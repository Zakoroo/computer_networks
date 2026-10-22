#!/usr/bin/env python3
"""Create isolated lecture-content drafts without editing curated quizzes."""

import argparse
import json
from pathlib import Path
import re
from string import Template
import subprocess
import tempfile

from content_data import ROOT, heading_slug, outside_fences, question_fingerprint, read_json


TEMPLATES = ROOT / "skills/prepare-lecture/templates"


def scaffold(root, topic, output, plan=None, title=None):
    if not re.fullmatch(r"\d{2}_[a-z][a-z0-9]*(?:_[a-z0-9]+)*", topic):
        raise ValueError("Topic must look like 03_ipv6")
    output = Path(output).resolve()
    if output.exists():
        raise ValueError(f"Refusing to overwrite existing destination: {output}")
    number, prefix = topic.split("_", 1)
    prefix = prefix.replace("_", "-")
    def unique(directory, pattern):
        matches = sorted((root / directory).glob(pattern))
        if len(matches) != 1:
            raise ValueError(f"Expected exactly one {directory}/{pattern}; found {len(matches)}")
        return matches[0]
    lecture = unique("lectures", f"lecture_{number}_*.md")
    quiz_path = unique("quizzes", f"quiz_{number}_*.json")
    source = lecture.read_text(encoding="utf-8")
    title = title or source.splitlines()[0].removeprefix("# ")
    commit = subprocess.run(["git", "rev-parse", "HEAD"], cwd=root, capture_output=True, text=True, check=True).stdout.strip()
    values = {
        "topic_id": topic, "title": title, "source_commit": commit,
        "source_lecture": lecture.relative_to(root).as_posix(),
        "source_quiz": quiz_path.relative_to(root).as_posix(),
    }
    substitutions = values | {key + "_json": json.dumps(value, ensure_ascii=False) for key, value in values.items()}
    def render(filename, extra=None):
        return Template((TEMPLATES / filename).read_text(encoding="utf-8")).substitute(substitutions | (extra or {}))
    manifest = json.loads(render("manifest.json.tmpl"))
    quiz = read_json(quiz_path)
    # Unassessed does not mean missing coverage and must not be promoted as a final status.
    manifest["question_links"] = [
        {"question_id": f"{prefix}-q{index + 1:03}", "source_index": index,
         "question_sha256": question_fingerprint(question), "lesson_id": "",
         "related_lesson_ids": [], "coverage_status": "unassessed", "flags": [],
         "evidence": [], "rationale": "TODO-CONTENT: Review question and keyed answer against actual teaching.",
         "needs_review": True}
        for index, question in enumerate(quiz["questions"])
    ]
    manifest["coverage_counts"] = {"unassessed": len(quiz["questions"])}
    files = {}
    headings = {line.lstrip("# ") for line in outside_fences(source) if re.match(r"^#{1,6} ", line)}
    planned = read_json(plan)["lessons"] if plan else []
    slugs = set()
    for order, item in enumerate(planned, 1):
        slug = item["slug"]
        if not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", slug) or slug in slugs:
            raise ValueError(f"Invalid or duplicate lesson slug: {slug}")
        slugs.add(slug)
        for field in ("learning_goals", "source_sections"):
            if not isinstance(item[field], list) or not item[field] or any(not isinstance(v, str) or not v.strip() for v in item[field]):
                raise ValueError(f"{slug}: {field} must be a nonempty list of strings")
        if not set(item["source_sections"]) <= headings:
            raise ValueError(f"{slug}: source_sections contains a heading absent from the guide")
        if not isinstance(item["title"], str) or not item["title"].strip():
            raise ValueError(f"{slug}: title must be nonempty")
        if not re.fullmatch(r"[a-z][a-z0-9_]*", item["source_classification"]):
            raise ValueError(f"{slug}: source_classification must be an explicit classification identifier")
        prerequisites = item.get("prerequisite_ids", [])
        minutes = item.get("estimated_reading_minutes", 2)
        if not isinstance(prerequisites, list) or any(not isinstance(v, str) for v in prerequisites):
            raise ValueError(f"{slug}: prerequisite_ids must be a list of strings")
        if type(minutes) is not int or minutes < 1:
            raise ValueError(f"{slug}: estimated_reading_minutes must be a positive integer")
        lesson = {
            "id": f"{prefix}-{order:02}", "order": order, "title": item["title"],
            "path": f"lessons/{topic}/{order:02}_{slug.replace('-', '_')}.md",
            "prerequisite_ids": prerequisites,
            "learning_goals": item["learning_goals"], "source_sections": item["source_sections"],
            "source_classification": item["source_classification"],
            "estimated_reading_minutes": minutes,
            "question_ids": [], "external_question_ids": [],
        }
        files[Path(lesson["path"]).name] = render("lesson.md.tmpl", {
            "lesson_id": lesson["id"], "order": str(order), "title": item["title"],
            "title_json": json.dumps(item["title"], ensure_ascii=False),
            "classification": lesson["source_classification"], "minutes": str(lesson["estimated_reading_minutes"]),
            "prerequisites_json": json.dumps(lesson["prerequisite_ids"]),
            "goals": "\n".join("- " + goal for goal in lesson["learning_goals"]),
            "source_links": "\n".join(f"- [Lecture: {section}](../../{values['source_lecture']}#{heading_slug(section)})" for section in lesson["source_sections"]),
        })
        manifest["lessons"].append(lesson)
    if not planned:
        files["lesson.md.tmpl"] = (TEMPLATES / "lesson.md.tmpl").read_text(encoding="utf-8")
    files["manifest.draft.json"] = json.dumps(manifest, ensure_ascii=False, indent=2) + "\n"
    for name in ("review", "verification"):
        files[name + ".md"] = render(name + ".md.tmpl")
    files["README.md"] = f"# {title}\n\nDraft for `{topic}`. Quizzes are unchanged. Resolve TODO-CONTENT placeholders and all unassessed question entries before promoting `manifest.draft.json` to `manifest.json`.\n\nTODO-CONTENT: Add the lesson overview, coverage summary, glossary, source references, supplementary scope, and provenance.\n"
    output.parent.mkdir(parents=True, exist_ok=True)
    # Build all content first; do not leave a partially created destination on a plan error.
    with tempfile.TemporaryDirectory(prefix="lecture-scaffold-", dir=output.parent) as temporary:
        staged = Path(temporary) / "draft"
        staged.mkdir()
        for name, text in files.items():
            (staged / name).write_text(text, encoding="utf-8")
        # Reserve the destination exclusively; a concurrent creator must not be overwritten.
        output.mkdir()
        for file in staged.iterdir():
            file.rename(output / file.name)
    return len(manifest["lessons"]), len(quiz["questions"])


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--topic", required=True, help="Topic ID, e.g. 03_ipv6")
    parser.add_argument("--output", required=True, type=Path, help="New draft directory; existing paths are never overwritten")
    parser.add_argument("--plan", type=Path, help="Optional JSON lesson plan; see the prepare-lecture skill")
    parser.add_argument("--title", help="Override the guide's title")
    args = parser.parse_args()
    try:
        lessons, questions = scaffold(ROOT, args.topic, args.output, args.plan, args.title)
    except (ValueError, KeyError, TypeError, OSError, subprocess.CalledProcessError) as error:
        parser.exit(2, f"Cannot scaffold topic: {error}\n")
    print(f"Created draft at {args.output}: {lessons} lesson shells, {questions} unassessed questions. Curated quizzes unchanged; no final manifest registered.")


if __name__ == "__main__":
    main()
