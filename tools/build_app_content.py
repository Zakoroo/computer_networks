#!/usr/bin/env python3
"""Build the local app catalogue from canonical networking content (read-only inputs)."""

import argparse
import hashlib
import json
from pathlib import Path
import re
import shutil

from content_data import ROOT, read_json
from query_quizzes import load_questions


def lesson_body(text):
    """Remove front matter and repository practice/navigation, preserving teaching."""
    text = re.sub(r"\A---\r?\n.*?\r?\n---\r?\n", "", text, count=1, flags=re.S)
    lines = []
    practice = False
    fence = None
    for line in text.splitlines():
        marker = re.match(r"^\s*(`{3,}|~{3,})(.*)$", line)
        if marker:
            if fence is None:
                fence = marker[1]
            elif marker[1][0] == fence[0] and len(marker[1]) >= len(fence) and not marker[2].strip():
                fence = None
        if fence is None and line.startswith("## "):
            practice = line.strip() == "## Practice"
        if practice:
            continue
        if fence is None and re.match(r"^\[Topic overview\]\(", line):
            continue
        lines.append(line)
    return "\n".join(lines).strip() + "\n"


def build_catalogue(root=ROOT):
    rows, _ = load_questions(root, scope="networking")
    topics, lessons, documents, questions = [], [], {}, []
    source_paths = set()
    for manifest_path in sorted((root / "lessons").glob("0[1-6]_*/manifest.json")):
        manifest = read_json(manifest_path)
        topic = manifest["topic_id"]
        topics.append({
            "id": topic, "title": manifest["title"],
            "preparation_status": manifest["preparation_status"],
            "explanation_status": manifest.get("explanation_status", "drafted"),
        })
        source_paths.add(manifest["source_lecture"])
        for entry in manifest["lessons"]:
            path = entry["path"]
            body = (root / path).read_text(encoding="utf-8")
            # Front matter supplies the same identity; catch accidental file mismatches.
            if not re.search(rf"^id: {re.escape(entry['id'])}\s*$", body, re.M):
                raise ValueError(f"Lesson front matter identity mismatch: {path}")
            lessons.append({**entry, "topic_id": topic, "markdown": lesson_body(body)})
        for path in sorted(manifest_path.parent.glob("*.md")):
            relative = path.relative_to(root).as_posix()
            documents[relative] = path.read_text(encoding="utf-8")
            source_paths.add(relative)
    if len(topics) != 6:
        raise ValueError("Expected all six prepared networking topics")

    for path in sorted(source_paths):
        if path.endswith(".md"):
            documents.setdefault(path, (root / path).read_text(encoding="utf-8"))

    for row in rows:
        details = row["details"]
        answers = details["correct_answers"]
        if (not answers or len(set(answers)) != len(answers)
                or any(type(i) is not int or i < 0 or i >= len(details["options"]) for i in answers)):
            raise ValueError(f"Invalid answer indices: {row['question_id']}")
        questions.append({
            **{key: value for key, value in row.items() if key not in ("details", "primary_lesson")},
            **{key: details[key] for key in ("options", "correct_answers", "explanation", "rationale", "review_note")},
            "answer_version": hashlib.sha256(json.dumps(sorted(answers)).encode()).hexdigest(),
        })
    question_map = {q["question_id"]: q for q in questions}
    if len(question_map) != len(questions) or any(not qid for qid in question_map):
        raise ValueError("All app questions must have unique canonical identities")
    lesson_ids = {lesson["id"] for lesson in lessons}
    for lesson in lessons:
        if set(lesson["prerequisite_ids"]) - lesson_ids:
            raise ValueError(f"Unknown prerequisites: {lesson['id']}")
        assigned = set(lesson.get("question_ids", []) + lesson.get("external_question_ids", []))
        actual = {q["question_id"] for q in questions if q["lesson_id"] == lesson["id"]}
        if assigned != actual:
            raise ValueError(f"Stale lesson assignments: {lesson['id']}")
    catalogue = {"schema_version": 1, "topics": topics, "lessons": lessons, "questions": questions,
                 "documents": documents}
    version = hashlib.sha256(json.dumps(catalogue, sort_keys=True, ensure_ascii=False).encode()).hexdigest()
    return {**catalogue, "content_version": version}, source_paths


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, default=ROOT / "app/public/content")
    args = parser.parse_args()
    catalogue, sources = build_catalogue()
    args.output.mkdir(parents=True, exist_ok=True)
    (args.output / "catalogue.json").write_text(json.dumps(catalogue, ensure_ascii=False), encoding="utf-8")
    for relative in sorted(sources):
        target = args.output / "source" / relative
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(ROOT / relative, target)
    print(f"Built {len(catalogue['topics'])} topics, {len(catalogue['lessons'])} lessons, "
          f"{len(catalogue['questions'])} canonical questions. Source files unchanged.")


if __name__ == "__main__":
    main()
