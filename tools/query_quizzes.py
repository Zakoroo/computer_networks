#!/usr/bin/env python3
"""Read and filter local quizzes with canonical manifest and lesson metadata."""

import argparse
import json
from pathlib import Path
import re

from content_data import ROOT, question_fingerprint, read_json


def load_questions(root=ROOT, scope="networking", topics=()):
    """Join only canonical records; destination external references are not copies."""
    by_quiz = {}
    lessons = {}
    question_ids = set()
    for path in sorted((root / "lessons").glob("*/manifest.json")):
        manifest = read_json(path)
        source = manifest["source_quiz"]
        if source in by_quiz:
            raise ValueError(f"Multiple manifests claim {source}")
        by_quiz[source] = (path.relative_to(root).as_posix(), manifest)
        for lesson in manifest["lessons"]:
            if lesson["id"] in lessons:
                raise ValueError(f"Duplicate lesson ID: {lesson['id']}")
            lessons[lesson["id"]] = {key: lesson[key] for key in ("id", "title", "path")}
        for link in manifest["question_links"]:
            if link["question_id"] in question_ids:
                raise ValueError(f"Duplicate question ID: {link['question_id']}")
            question_ids.add(link["question_id"])

    sources = []
    aliases = set()
    for path in sorted((root / "quizzes").glob("quiz_*.json")):
        match = re.fullmatch(r"quiz_(\d+)_(.+)\.json", path.name)
        if not match:
            raise ValueError(f"Unsupported quiz filename: {path.name}")
        number = int(match[1])
        relative = path.relative_to(root).as_posix()
        manifest_path, manifest = by_quiz.get(relative, (None, None))
        file_topic = path.stem.removeprefix("quiz_")
        topic = manifest["topic_id"] if manifest else file_topic
        names = {file_topic, topic, match[1], str(number)}
        aliases.update(names)
        sources.append((path, relative, manifest_path, manifest, topic, names, number))
    unknown = set(topics) - aliases
    if unknown:
        raise ValueError("Unknown topic selector(s): " + ", ".join(sorted(unknown)))
    selected_sources = [source for source in sources if not topics or set(topics) & source[5]]
    in_scope = lambda number: (scope == "all" or (scope == "networking" and 1 <= number <= 6)
                              or (scope == "algorithms" and number >= 7))
    if topics and any(not any(selector in source[5] and in_scope(source[6]) for source in sources) for selector in topics):
        raise ValueError(f"A selected topic is outside --scope {scope}; choose --scope all or the appropriate scope")

    rows = []
    for path, relative, manifest_path, manifest, topic, _, number in selected_sources:
        if not in_scope(number):
            continue
        quiz = read_json(path)
        links = {link["source_index"]: link for link in manifest["question_links"]} if manifest else {}
        if manifest and (len(links) != len(manifest["question_links"])
                         or sorted(links) != list(range(len(quiz["questions"])))):
            raise ValueError(f"Canonical source indices/count do not match {relative}")
        for index, question in enumerate(quiz["questions"]):
            link = links.get(index)
            fingerprint = question_fingerprint(question)
            if link and link["question_sha256"] != fingerprint:
                raise ValueError(f"Stale fingerprint: {link['question_id']}; validate/update the canonical mapping")
            if link and (link["lesson_id"] != question["lesson_id"] or link["flags"] != question["flags"]):
                raise ValueError(f"Quiz/manifest assignment or flag mismatch: {link['question_id']}")
            required = link.get("required_lesson_ids") if link else None
            optional = link.get("optional_lesson_ids") if link else None
            related = link.get("related_lesson_ids", []) if link else []
            refs = set(related) | set(required or []) | set(optional or [])
            if question["lesson_id"]:
                refs.add(question["lesson_id"])
            missing = refs - lessons.keys()
            if missing:
                raise ValueError(f"{relative} Q{index + 1:03}: unknown lesson IDs {sorted(missing)}")
            row = {
                "question_id": link["question_id"] if link else None,
                "source_ref": f"{relative}#Q{index + 1:03}",
                "source_quiz": relative, "source_index": index,
                "topic_id": topic, "topic_title": quiz["topic"],
                "canonical_manifest": manifest_path,
                "question_sha256": fingerprint,
                "question": question["question"], "lesson_id": question["lesson_id"],
                "primary_lesson": lessons.get(question["lesson_id"]),
                "tags": question["tags"], "flags": question["flags"],
                "coverage_status": link["coverage_status"] if link else "unassessed",
                "required_lesson_ids": required, "optional_lesson_ids": optional,
                "related_lesson_ids": related,
                "dependency_status": ("classified" if required is not None and optional is not None
                                      else link.get("dependency_status", "unclassified") if link else "unclassified"),
                "details": {
                    "options": question["options"], "correct_answers": question["correct_answers"],
                    "explanation": question["explanation"],
                    "rationale": link.get("rationale") if link else None,
                    "review_note": link.get("review_note") if link else None,
                    "review_reference": link.get("review_reference") if link else None,
                    "evidence": link.get("evidence", []) if link else [],
                    "supporting_lessons": [lessons[lid] for lid in sorted(refs - {question["lesson_id"]})],
                },
            }
            rows.append(row)
    return rows, lessons


def filter_questions(rows, args):
    """OR within repeated values, AND between different filter criteria."""
    matches = []
    for row in rows:
        roles = {
            "primary": {row["lesson_id"]} if row["lesson_id"] else set(),
            "required": set(row["required_lesson_ids"] or []),
            "optional": set(row["optional_lesson_ids"] or []),
            "related": set(row["related_lesson_ids"]),
        }
        roles["any"] = set().union(*roles.values())
        if args.ids and not {row["question_id"], row["source_ref"]} & set(args.ids):
            continue
        if args.lesson and not roles[args.lesson_role] & set(args.lesson):
            continue
        if args.requires and not roles["required"] & set(args.requires):
            continue
        if args.multi_lesson and not roles["required"]:
            continue
        if args.flag and not set(row["flags"]) & set(args.flag):
            continue
        if args.tag and not set(row["tags"]) & set(args.tag):
            continue
        if args.untagged and row["tags"]:
            continue
        if args.unmapped and row["lesson_id"]:
            continue
        if args.coverage and row["coverage_status"] not in args.coverage:
            continue
        haystack = "\n".join([row["question"], *row["details"]["options"]]).casefold()
        if args.search and not any(term.casefold() in haystack for term in args.search):
            continue
        matches.append(row)
    return matches


def public_row(row, details=False):
    return {key: value for key, value in row.items() if key != "details"} | (row["details"] if details else {})


def compact(text):
    return " ".join(text.split())


def text_results(rows, total, offset, details=False):
    lines = [f"Showing {len(rows)} of {total} matches (offset {offset})."]
    for row in rows:
        identity = row["question_id"] or row["source_ref"]
        flags = ",".join(row["flags"]) or "none"
        lines.append(f"{identity} | lesson={row['lesson_id'] or 'unmapped'} | flags={flags} | {compact(row['question'])}")
        if details:
            data = row["details"]
            lines.append(f"  Source: {row['source_ref']} (zero-based index {row['source_index']})")
            lines.append(f"  Coverage: {row['coverage_status']}; dependencies: {row['dependency_status']}")
            if row["primary_lesson"]:
                lesson = row["primary_lesson"]
                lines.append(f"  Primary: {lesson['title']} ({lesson['path']})")
            for role in ("required", "optional"):
                values = row[role + "_lesson_ids"]
                description = (", ".join(values) or "none") if values is not None else "unclassified"
                lines.append(f"  {role.capitalize()}: {description}")
            if row["dependency_status"] != "classified" and row["related_lesson_ids"]:
                lines.append("  Related (unclassified): " + ", ".join(row["related_lesson_ids"]))
            lines.append("  Tags: " + (", ".join(row["tags"]) or "none"))
            for index, option in enumerate(data["options"]):
                lines.append(f"  {'*' if index in data['correct_answers'] else '-'} [{index}] {compact(option)}")
            lines.append("  Correct indices: " + ", ".join(map(str, data["correct_answers"])))
            for key in ("explanation", "rationale", "review_note", "review_reference"):
                if data[key]:
                    lines.append(f"  {key}: {compact(data[key])}")
            for evidence in data["evidence"]:
                lines.append(f"  Evidence: {evidence['path']} — {evidence['section']}")
    return "\n".join(lines)


def nonnegative(value):
    number = int(value)
    if number < 0:
        raise argparse.ArgumentTypeError("must be nonnegative")
    return number


def parser():
    command = argparse.ArgumentParser(description=__doc__, epilog="Repeated values of a filter are ORed; different filters are ANDed. No files are written. Default scope: networking lectures/quizzes 01–06.")
    command.add_argument("--scope", choices=("networking", "algorithms", "all"), default="networking")
    command.add_argument("--topic", action="append", default=[], help="Topic ID, filename topic, or number; repeat for alternatives")
    command.add_argument("--id", dest="ids", action="append", default=[], help="Canonical question ID or exact source_ref for an unmanifested question")
    command.add_argument("--lesson", action="append", default=[], help="Lesson ID, including cross-topic assignments and support")
    command.add_argument("--lesson-role", choices=("any", "primary", "required", "optional", "related"), default="any")
    command.add_argument("--requires", action="append", default=[], help="Explicit additional required lesson ID")
    command.add_argument("--multi-lesson", action="store_true", help="Has at least one explicitly required supporting lesson")
    command.add_argument("--flag", action="append", default=[], help="Exact review flag")
    command.add_argument("--coverage", action="append", default=[], help="Exact coverage status; unmanifested questions are unassessed")
    tags = command.add_mutually_exclusive_group()
    tags.add_argument("--tag", action="append", default=[], help="Exact manual tag")
    tags.add_argument("--untagged", action="store_true")
    command.add_argument("--unmapped", action="store_true", help="Empty primary lesson_id (not necessarily a coverage gap)")
    command.add_argument("--search", action="append", default=[], help="Case-insensitive literal substring in stem or options")
    command.add_argument("--details", action="store_true", help="Include options, zero-based answer indices, rationale, and evidence")
    command.add_argument("--json", action="store_true", help="Print a structured result envelope")
    command.add_argument("--count", action="store_true", help="Print total matches before pagination")
    command.add_argument("--limit", type=nonnegative, default=10, help="Maximum results; 0 means all (default: 10)")
    command.add_argument("--offset", type=nonnegative, default=0, help="Skip this many matching records; source indices stay unchanged")
    return command


def main(argv=None, root=ROOT):
    command = parser()
    args = command.parse_args(argv)
    try:
        rows, lessons = load_questions(root, args.scope, args.topic)
        unknown = (set(args.lesson) | set(args.requires)) - lessons.keys()
        if unknown:
            raise ValueError("Unknown lesson ID(s): " + ", ".join(sorted(unknown)))
        matches = filter_questions(rows, args)
    except (ValueError, KeyError, TypeError, OSError) as error:
        command.exit(2, f"Cannot query quizzes: {error}\n")
    total = len(matches)
    if args.count:
        print(json.dumps({"total": total}) if args.json else total)
        return
    selected = matches[args.offset:args.offset + args.limit] if args.limit else matches[args.offset:]
    if args.json:
        print(json.dumps({"total": total, "offset": args.offset, "limit": args.limit,
                          "results": [public_row(row, args.details) for row in selected]}, ensure_ascii=False, indent=2))
    else:
        print(text_results(selected, total, args.offset, args.details))


if __name__ == "__main__":
    main()
