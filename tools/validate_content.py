#!/usr/bin/env python3
"""Validate lesson content and mappings. Read-only; semantic coverage needs review."""

import argparse
from collections import Counter
import json
from pathlib import Path
import re
import subprocess
from urllib.parse import unquote

from content_data import ROOT, markdown_anchors, outside_fences, question_fingerprint, read_json, teaching_lines


class Findings:
    def __init__(self):
        self.errors = []
        self.warnings = []

    def require(self, condition, message):
        if not condition:
            self.errors.append(message)


def check_links(root, path, result):
    text = path.read_text(encoding="utf-8")
    prose = "\n".join(outside_fences(text))
    result.require(not re.search(r"!\[|<img\b", prose, re.I), f"{path.relative_to(root)}: image dependency")
    for target in re.findall(r"(?<!!)\[[^\]]*\]\(([^)]+)\)", prose):
        if re.match(r"[a-zA-Z][\w+.-]*:", target):
            continue
        filename, _, anchor = target.partition("#")
        destination = path.parent / unquote(filename) if filename else path
        label = f"{path.relative_to(root)}: broken link {target}"
        result.require(destination.is_file(), label)
        if anchor and destination.is_file():
            result.require(unquote(anchor) in markdown_anchors(destination.read_text(encoding="utf-8")), label)


def compare_baseline(root, quiz_path, current, baseline, result):
    args = ["git", "show", f"{baseline}:{quiz_path}"]
    previous = subprocess.run(args, cwd=root, capture_output=True, text=True)
    if previous.returncode:
        result.errors.append(f"Cannot read {quiz_path} at baseline {baseline}; choose an existing baseline or omit --baseline for an intentional new/corrected quiz")
        return
    old = json.loads(previous.stdout)
    # Tags are intentionally editable during study; assignments and flags are review metadata.
    def unchanged(data):
        return {key: ([{k: v for k, v in question.items() if k not in {"tags", "lesson_id", "flags"}}
                       for question in value] if key == "questions" else value)
                for key, value in data.items()}
    result.require(unchanged(old) == unchanged(current), f"{quiz_path}: question content/answer key differs from {baseline}")


def validate(root=ROOT, topic=None, baseline=None):
    result = Findings()
    manifests = {path: read_json(path) for path in sorted((root / "lessons").glob("*/manifest.json"))}
    selected = {path: data for path, data in manifests.items() if topic is None or data["topic_id"] == topic}
    if not selected:
        raise ValueError(f"No final manifest found for {topic or 'any topic'}")
    lessons = {}
    questions = {}
    for path, manifest in manifests.items():
        for lesson in manifest["lessons"]:
            result.require(lesson["id"] not in lessons, f"Duplicate lesson ID {lesson['id']}")
            lessons[lesson["id"]] = (path, lesson)
        for question in manifest["question_links"]:
            qid = question["question_id"]
            result.require(qid not in questions, f"Duplicate question ID {qid}")
            questions[qid] = (path, manifest, question)

    legacy = 0
    for path, manifest in selected.items():
        name = manifest["topic_id"]
        result.require("TODO-CONTENT" not in json.dumps(manifest), f"{name}: unfinished scaffold metadata")
        quiz = read_json(root / manifest["source_quiz"])
        links = manifest["question_links"]
        result.require(bool(manifest["lessons"]), f"{name}: no lessons; draft is not ready for validation")
        result.require(sorted(q["source_index"] for q in links) == list(range(len(quiz["questions"]))), f"{name}: source indices must cover each quiz question exactly once")
        coverage = Counter(q["coverage_status"] for q in links)
        flags = Counter(flag for q in links for flag in q["flags"])
        result.require(dict(coverage) == manifest["coverage_counts"], f"{name}: stale coverage_counts")
        result.require(dict(flags) == manifest["flag_counts"], f"{name}: stale flag_counts")
        allowed = {f"{name.split('_', 1)[1]}_lesson", "covered_in_other_topic", "partial_in_other_topic", "not_found_in_available_lectures"}
        for question in links:
            qid = question["question_id"]
            index = question["source_index"]
            if not 0 <= index < len(quiz["questions"]):
                result.errors.append(f"{qid}: invalid source index {index}")
                continue
            actual = quiz["questions"][index]
            result.require(all(type(answer) is int and 0 <= answer < len(actual["options"]) for answer in actual["correct_answers"]), f"{qid}: correct-answer index outside options")
            result.require(question["question_sha256"] == question_fingerprint(actual), f"{qid}: fingerprint mismatch")
            result.require(actual["lesson_id"] == question["lesson_id"] and actual["flags"] == question["flags"], f"{qid}: quiz/manifest assignment or flags disagree")
            result.require(question["coverage_status"] in allowed, f"{qid}: unclassified or unknown coverage status")
            result.require(len(question["flags"]) == len(set(question["flags"])), f"{qid}: duplicate flags")
            related = set(question["related_lesson_ids"])
            refs = related | ({question["lesson_id"]} if question["lesson_id"] else set())
            result.require(refs <= lessons.keys(), f"{qid}: unresolved lesson IDs {sorted(refs - lessons.keys())}")
            if "required_lesson_ids" in question:
                required = set(question["required_lesson_ids"])
                optional = set(question["optional_lesson_ids"])
                result.require(not required & optional and related == required | optional and question["lesson_id"] not in related, f"{qid}: inconsistent required/optional lesson fields")
            elif related:
                legacy += 1
            for evidence in question["evidence"]:
                source = root / evidence["path"]
                result.require(source.is_file(), f"{qid}: evidence file missing: {evidence['path']}")
                if source.is_file():
                    headings = {line.lstrip("# ") for line in outside_fences(source.read_text(encoding="utf-8")) if re.match(r"^#{1,6} ", line)}
                    result.require(evidence["section"] in headings, f"{qid}: evidence heading missing: {evidence['section']}")
        if baseline:
            compare_baseline(root, manifest["source_quiz"], quiz, baseline, result)

        expected_external = {qid for qid, (other, _, q) in questions.items() if other != path and q["lesson_id"] in {l["id"] for l in manifest["lessons"]}}
        external = manifest.get("external_question_links", [])
        result.require({q["question_id"] for q in external} == expected_external and len(external) == len(expected_external), f"{name}: missing/duplicate external references")
        for reference in external:
            canonical = questions.get(reference["question_id"])
            if canonical is None:
                result.errors.append(f"{name}: unknown external question {reference['question_id']}")
                continue
            other, owner, q = canonical
            result.require(reference["canonical_manifest"] == other.relative_to(root).as_posix() and reference["source_quiz"] == owner["source_quiz"] and reference["source_index"] == q["source_index"] and reference["lesson_id"] == q["lesson_id"], f"{reference['question_id']}: stale external reference")
            actual = read_json(root / owner["source_quiz"])["questions"][q["source_index"]]
            result.require(actual["lesson_id"] == q["lesson_id"] and question_fingerprint(actual) == q["question_sha256"] and actual["flags"] == q["flags"], f"{q['question_id']}: external canonical record differs from its quiz")

        lesson_texts = []
        for lesson in manifest["lessons"]:
            file = root / lesson["path"]
            result.require(file.is_file(), f"{lesson['id']}: missing lesson file")
            result.require(set(lesson["prerequisite_ids"]) <= lessons.keys(), f"{lesson['id']}: unresolved prerequisite")
            native = {q["question_id"] for q in links if q["lesson_id"] == lesson["id"]}
            foreign = {qid for qid, (other, _, q) in questions.items() if other != path and q["lesson_id"] == lesson["id"]}
            result.require(set(lesson["question_ids"]) == native and len(lesson["question_ids"]) == len(native), f"{lesson['id']}: reverse native assignments disagree")
            result.require(set(lesson.get("external_question_ids", [])) == foreign and len(lesson.get("external_question_ids", [])) == len(foreign), f"{lesson['id']}: reverse external assignments disagree")
            if file.is_file():
                text = file.read_text(encoding="utf-8")
                lesson_texts.append(text)
                result.require(f"\nid: {lesson['id']}\n" in text, f"{lesson['id']}: frontmatter ID disagrees")
                result.require("TODO-CONTENT" not in text, f"{lesson['id']}: unfinished scaffold content")
                for qid in native:
                    result.require("Q" + qid[-3:] in text, f"{lesson['id']}: Practice missing {qid}")
                for qid in foreign:
                    result.require("Q" + qid[-3:] in text, f"{lesson['id']}: Practice missing external {qid}")
        markdown = sorted(path.parent.glob("*.md"))
        corpus = "\n".join(file.read_text(encoding="utf-8") for file in markdown)
        result.require("TODO-CONTENT" not in corpus, f"{name}: unfinished scaffold Markdown")
        source = (root / manifest["source_lecture"]).read_text(encoding="utf-8")
        missing = [line for line in teaching_lines(source) if line not in corpus]
        result.require(not missing, f"{name}: {len(missing)} source lines absent; first: {missing[:1]}")
        diagram = r"```mermaid\n(.*?)\n```"
        source_diagrams = Counter(re.findall(diagram, source, re.S))
        diagrams = Counter(re.findall(diagram, "\n".join(lesson_texts), re.S))
        result.require(not source_diagrams - diagrams, f"{name}: source Mermaid blocks changed or missing")
        for file in markdown:
            check_links(root, file, result)

    # Dependencies resolve globally, including cross-topic prerequisites.
    finished = set()
    def visit(lid, trail):
        if lid in trail:
            result.errors.append(f"Prerequisite cycle: {' -> '.join(trail + [lid])}")
            return
        if lid in finished or lid not in lessons:
            return
        for parent in lessons[lid][1]["prerequisite_ids"]:
            visit(parent, trail + [lid])
        finished.add(lid)
    for _, manifest in selected.items():
        for lesson in manifest["lessons"]:
            visit(lesson["id"], [])
    if legacy:
        result.warnings.append(f"{legacy} legacy related-question entries lack required/optional classification (not treated as no requirements)")
    return result, len(selected)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--topic", help="Topic ID, e.g. 02_dns; default: all prepared topics")
    parser.add_argument("--baseline", help="Git revision to compare quiz content and answer keys against (tags/assignments may change)")
    parser.add_argument("--json", action="store_true", help="Print machine-readable findings")
    parser.add_argument("--verbose", action="store_true", help="Print all errors rather than the first 20")
    args = parser.parse_args()
    try:
        result, count = validate(topic=args.topic, baseline=args.baseline)
    except (ValueError, KeyError, TypeError, OSError) as error:
        parser.exit(2, f"Cannot validate content: {error}\n")
    if args.json:
        print(json.dumps({"ok": not result.errors, "topics": count, "errors": result.errors, "warnings": result.warnings}, ensure_ascii=False))
    else:
        for error in result.errors if args.verbose else result.errors[:20]:
            print(f"ERROR: {error}")
        if not args.verbose and len(result.errors) > 20:
            print(f"... {len(result.errors) - 20} more errors; use --verbose")
        for warning in result.warnings:
            print(f"NOTE: {warning}")
        print(f"{'FAIL' if result.errors else 'PASS'}: {count} topic(s), {len(result.errors)} error(s). Structural/source checks only; answer coverage and diagram rendering need review.")
    raise SystemExit(1 if result.errors else 0)


if __name__ == "__main__":
    main()
