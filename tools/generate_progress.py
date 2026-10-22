#!/usr/bin/env python3
"""Generate PROGRESS.md from networking lecture, quiz, and manifest data."""

import argparse
from collections import Counter
import json
from pathlib import Path
import re

from content_data import read_json, question_fingerprint


ROOT = Path(__file__).resolve().parents[1]
STAGES = {
    "not_started": "Not started",
    "drafted": "Drafted",
    "reviewed": "Reviewed",
    "approved": "Approved",
    "unclassified": "Unclassified",
}
REVIEW_LEGEND = (("G", "coverage_gap", "Coverage gaps"),
                 ("W", "wording_issue", "Wording issues"),
                 ("D", "duplicate_question", "Duplicate entries"))
REVIEW_FLAGS = tuple(flag for _, flag, _ in REVIEW_LEGEND)


def collect(root):
    """Count canonical questions once; external links are references, not copies."""
    lectures = sorted((root / "lectures").glob("lecture_*.md"))
    quizzes = {
        path.relative_to(root).as_posix(): read_json(path)
        for path in sorted((root / "quizzes").glob("quiz_*.json"))
    }
    manifests = {}
    lesson_ids = set()
    for path in sorted((root / "lessons").glob("*/manifest.json")):
        manifest = read_json(path)
        source = manifest["source_lecture"]
        if source in manifests:
            raise ValueError(f"Multiple manifests claim {source}")
        manifests[source] = (path, manifest)
        for lesson in manifest["lessons"]:
            if lesson["id"] in lesson_ids:
                raise ValueError(f"Duplicate lesson ID: {lesson['id']}")
            if not (root / lesson["path"]).is_file():
                raise ValueError(f"Missing lesson file: {lesson['path']}")
            lesson_ids.add(lesson["id"])

    topics = []
    for lecture in lectures:
        number = int(re.match(r"lecture_(\d+)_", lecture.name).group(1))
        if not 1 <= number <= 6:
            continue
        source = lecture.relative_to(root).as_posix()
        title = lecture.read_text(encoding="utf-8").splitlines()[0].removeprefix("# ")
        title = re.sub(r"\s+\([^)]*\)$", "", title)
        topic = {
            "number": number, "title": title, "source": source,
            "stage": "not_started", "lessons": 0, "without_native": 0,
            "coverage": Counter(), "flags": Counter(), "review_questions": 0,
            "question_count": 0, "assigned": 0,
        }
        if source not in manifests:
            topics.append(topic)
            continue
        path, manifest = manifests[source]
        stage = manifest.get("preparation_status", "unclassified")
        if stage not in STAGES or stage == "not_started":
            raise ValueError(f"Invalid preparation_status in {path}: {stage}")
        quiz = quizzes[manifest["source_quiz"]]["questions"]
        links = manifest["question_links"]
        if sorted(link["source_index"] for link in links) != list(range(len(quiz))):
            raise ValueError(f"Question indices/count do not match {manifest['source_quiz']}")
        coverage = Counter()
        flags = Counter()
        for link in links:
            question = quiz[link["source_index"]]
            if link["question_sha256"] != question_fingerprint(question):
                raise ValueError(f"Stale question fingerprint: {link['question_id']}")
            if (question["lesson_id"] != link["lesson_id"]
                    or question["flags"] != link["flags"]):
                raise ValueError(f"Quiz/manifest mismatch: {link['question_id']}")
            if link["lesson_id"] and link["lesson_id"] not in lesson_ids:
                raise ValueError(f"Unknown lesson ID: {link['lesson_id']}")
            status = link["coverage_status"]
            if status == "covered_in_other_topic":
                bucket = "elsewhere"
            elif status == "partial_in_other_topic":
                bucket = "partial"
            elif status == "not_found_in_available_lectures":
                bucket = "gap"
            elif status == f"{manifest['topic_id'].split('_', 1)[1]}_lesson":
                bucket = "own"
            else:
                raise ValueError(f"Unknown coverage status: {status}")
            coverage[bucket] += 1
            flags.update(set(link["flags"]))
        native_lesson_ids = {link["lesson_id"] for link in links if link["lesson_id"]}
        topic.update(
            title=manifest["title"], stage=stage,
            manifest=path.relative_to(root).as_posix(),
            overview=(path.parent / "README.md").relative_to(root).as_posix(),
            review=(path.parent / "review.md").relative_to(root).as_posix(),
            lessons=len(manifest["lessons"]),
            without_native=sum(lesson["id"] not in native_lesson_ids for lesson in manifest["lessons"]),
            coverage=coverage, flags=flags, question_count=len(links),
            review_questions=sum(bool(set(link["flags"]) & set(REVIEW_FLAGS)) for link in links),
            assigned=sum(bool(link["lesson_id"]) for link in links),
        )
        topics.append(topic)

    networking_quizzes = [
        quiz for path, quiz in quizzes.items()
        if 1 <= int(re.match(r"quiz_(\d+)_", Path(path).name).group(1)) <= 6
    ]
    return {
        "topics": topics, "lecture_count": len(lectures), "quiz_count": len(quizzes),
        "question_count": sum(len(quiz["questions"]) for quiz in quizzes.values()),
        "network_questions": sum(len(quiz["questions"]) for quiz in networking_quizzes),
    }


def table(headers, rows):
    def row(values):
        return "| " + " | ".join(str(value).replace("|", "\\|") for value in values) + " |"
    return "\n".join([row(headers), row(["---"] * len(headers))] + [row(values) for values in rows])


def bar_chart(title, labels, values, axis):
    # A single series avoids implying that overlapping review flags can be stacked.
    if not values:
        return "No data yet."
    return "\n".join([
        "```mermaid", "xychart-beta", f"    title {json.dumps(title)}",
        "    x-axis [" + ", ".join(json.dumps(label) for label in labels) + "]",
        f"    y-axis {json.dumps(axis)} 0 --> {max(1, max(values))}",
        "    bar [" + ", ".join(map(str, values)) + "]", "```",
    ])


def render(data):
    topics = data["topics"]
    prepared = [topic for topic in topics if "manifest" in topic]
    reviewed = sum(topic["question_count"] for topic in prepared)
    assigned = sum(topic["assigned"] for topic in prepared)
    stages = Counter(topic["stage"] for topic in topics)
    flags = Counter()
    for topic in prepared:
        flags.update(topic["flags"])
    lines = [
        "# Work progress", "",
        "<!-- Generated by tools/generate_progress.py; do not edit counts or charts manually. -->", "",
        "Quick view of **networking lectures 01–06**. Algorithms (07 onward) are outside this work scope. "
        "Charts show the current files, not historical progress or a percentage of work completed.", "",
        f"**{len(prepared)}/{len(topics)} topics have lessons · "
        f"{sum(topic['lessons'] for topic in prepared)} lessons · "
        f"{reviewed}/{data['network_questions']} networking questions accounted for in manifests · "
        f"{assigned} questions linked to actual lessons.**", "",
        f"Whole repository inventory: {data['lecture_count']} lecture guides, {data['quiz_count']} quizzes, "
        f"{data['question_count']} questions (including algorithms).", "",
        "Regenerate with `python3 tools/generate_progress.py`; verify freshness with "
        "`python3 tools/generate_progress.py --check`. "
        "The script reads canonical question entries and quiz data, not cached manifest totals or STATS.md. "
        "It stops on stale fingerprints or conflicting quiz assignments.", "",
        "## Topic status", "",
        "Stages are explicit `preparation_status` metadata in each topic manifest: "
        "**Drafted** = content assembled; **Reviewed** = content checks performed, awaiting user approval; "
        "**Approved** = user approved the content. A topic without a manifest is **Not started**; "
        "a manifest missing stage metadata is **Unclassified**. Stages do not imply a commit, push, or app release.", "",
        "```mermaid", "pie title Networking topic status",
    ]
    lines += [f'    "{STAGES[stage]}" : {count}' for stage, count in stages.items() if count]
    lines += ["```", "", table(
        ["Topic", "Stage", "Lessons", "Details"],
        [[f"{topic['number']:02}. [{topic['title']}]({topic['source']})", STAGES[topic["stage"]],
          topic["lessons"], f"[Overview]({topic['overview']})" if "manifest" in topic else "—"]
         for topic in topics]), "", "## Question coverage by topic", "",
        "Coverage categories below are mutually exclusive and describe teaching support. "
        "**Mapped does not mean ready for scored practice.** Wording issues are tracked separately. "
        "Questions supported elsewhere may still await a real lesson link; partial elsewhere support still has a coverage gap.", "",
        table(["Chart label", "Source quiz", "Own-topic lesson", "Supported elsewhere", "Partial elsewhere", "Missing coverage", "Total", "Actual lesson links"],
              [[f"T{topic['number']:02}", topic["title"], topic["coverage"]["own"], topic["coverage"]["elsewhere"],
                topic["coverage"]["partial"], topic["coverage"]["gap"], topic["question_count"], topic["assigned"]]
               for topic in prepared]), "",
    ]
    for topic in prepared:
        if not topic["question_count"]:
            continue
        lines += ["```mermaid", f"pie title T{topic['number']:02} question coverage"]
        for key, label in [("own", "Own-topic lesson"), ("elsewhere", "Supported elsewhere"),
                           ("partial", "Partial elsewhere"), ("gap", "Missing coverage")]:
            if topic["coverage"][key]:
                lines.append(f'    "{label}" : {topic["coverage"][key]}')
        lines += ["```", ""]
    lines += [
        f"**{data['network_questions'] - reviewed} networking questions are not yet accounted for in topic manifests.** "
        "They are unassessed, not confirmed coverage gaps. External assignments are counted only in the source quiz: "
        "the routing questions linked to DNS are not counted again as DNS quiz questions.", "",
        "## Review backlog", "",
        "Flags overlap. The bars count flags, not separate populations, and must not be added to estimate unresolved questions. "
        "Duplicate entries remain in their quizzes; no questions have been removed.", "",
        bar_chart("Review flags", [code for code, _, _ in REVIEW_LEGEND],
                  [flags[flag] for _, flag, _ in REVIEW_LEGEND], "Questions"), "",
        "**Legend:** " + "; ".join(f"{code} = {label.lower()}" for code, _, label in REVIEW_LEGEND) + ".", "",
        table(["Source quiz", "Coverage gaps", "Wording issues", "Duplicate entries", "Distinct questions with any of these flags", "Review queue"],
              [[topic["title"], *[topic["flags"][flag] for flag in REVIEW_FLAGS], topic["review_questions"],
                f"[Review]({topic['review']})"] for topic in prepared]), "",
        "Cross-topic and supplementary-source flags describe context, not defects by themselves. "
        "These flags are excluded from the backlog chart. The distinct-question column above is a deduplicated "
        "review queue, not a count of failed questions or necessarily unaddressed fixes.", "",
        "## Content prepared", "",
        bar_chart("Lessons prepared by topic", [f"T{topic['number']:02}" for topic in prepared],
                  [topic["lessons"] for topic in prepared], "Lessons"), "",
        "**Legend and counts:**", "",
        table(["Chart label", "Topic", "Lessons", "Without questions from own quiz"],
              [[f"T{topic['number']:02}", topic["title"], topic["lessons"], topic["without_native"]] for topic in prepared]), "",
        "Lessons without native quiz questions are retained deliberately. Some support another quiz. "
        "Lesson counts describe content organization, not equal amounts of work or exam importance.", "",
        "See [STATUS.md](STATUS.md) for open decisions and delivery state, [STATS.md](STATS.md) for detailed counts, "
        "and each topic's verification report for check limitations. Mermaid diagrams require a compatible Markdown viewer; "
        "the tables provide the same counts if charts are unavailable.", "",
    ]
    return "\n".join(lines)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="Fail if PROGRESS.md needs regeneration; do not write files")
    args = parser.parse_args()
    try:
        content = render(collect(ROOT))
    except (ValueError, KeyError, OSError) as error:
        parser.exit(2, f"Cannot generate progress: {error}\n")
    target = ROOT / "PROGRESS.md"
    if args.check:
        if not target.exists() or target.read_text(encoding="utf-8") != content:
            parser.exit(1, "PROGRESS.md is stale. Run python3 tools/generate_progress.py\n")
        print("PROGRESS.md is up to date.")
    else:
        target.write_text(content, encoding="utf-8")
        print("Generated PROGRESS.md")


if __name__ == "__main__":
    main()
