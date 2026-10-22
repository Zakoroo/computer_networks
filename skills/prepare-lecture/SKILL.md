---
name: prepare-lecture
description: Prepare or review this repository's lecture lessons and quiz mappings, preserving source teaching and recording coverage evidence. Use for content conversion and mapping maintenance, not application implementation.
---

# Prepare a lecture

Work from the repository root. Read `STATUS.md` and only the active topic's overview/review/manifest; do not reload all lesson text or statistics to rediscover the workflow. [Content conventions](../../lessons/README.md) are the schema reference when needed.

## Existing topic

Inspect the relevant diff and question entries. Start with:

```sh
python3 tools/validate_content.py --topic 02_dns
```

Substitute the active topic ID. Output is concise by default; use `--json` for structured findings or `--verbose` for all errors. The validator reads other manifests to resolve cross-topic IDs, but does not require rereading their lessons.

## New topic

Only prepare the topic the user requested. Read its source guide and quiz; choose lesson boundaries based on coherent teaching units, not just question count. Use [templates](templates/) or, for an isolated draft:

```sh
python3 tools/scaffold_topic.py --topic 03_ipv6 --output /tmp/ipv6-draft
```

This creates a draft manifest with fingerprinted, **unassessed** question entries, a lesson template, and support-document templates. It does not modify quizzes or register a final manifest. For planned lesson shells, read [the plan format](references/scaffold-plan.md) and add `--plan /tmp/ipv6-plan.json`. Do not run the IPv6 example unless that topic is the active task.

Draft placeholders and unassessed coverage must be resolved before promotion to `lessons/<topic>/manifest.json`. A scaffold is not a reviewed conversion. Copy complete source teaching, glossary, references, examples, and qualifications into the chosen lessons/support files, including material with no questions.

## Coverage decisions

- Preserve question text, option order, keys, explanations, and manual tags. Use the existing `lesson_id` and `flags`; keep canonical records in their source topic.
- For every question, compare the requested reasoning and keyed option with the actual explanation. A matching keyword or unanswered review prompt is insufficient.
- For networking gaps, search only lecture guides 01–06. Record exact file/section evidence; distinguish cross-topic support, partial support, missing coverage, wording issues, and multi-lesson answers. Do not assume missing coverage means outside the exam.
- Separate additional `required_lesson_ids` from `optional_lesson_ids`; their union is `related_lesson_ids`. An absent required field in older records means unclassified. Do not infer dependencies or empty requirements automatically.
- Label editorial clarifications and supplementary additions. Inherit † scope, retain dated claims and caveats, and use Mermaid only. Do not silently add material to erase a gap or rewrite an ambiguous key.
- If a new lesson resolves an existing cross-topic assignment, update its original quiz and canonical manifest, the destination's external references, and Practice/overview/review notes together. Count the question once, in its source quiz.

## Finish

```sh
python3 tools/validate_content.py --topic 02_dns --baseline HEAD
python3 tools/generate_progress.py
python3 tools/generate_progress.py --check
git diff --check
```

Use the active topic ID. `--baseline HEAD` checks that pending work preserves question content/keys; it permits tag and assignment changes. Choose a different existing baseline when needed. For an explicitly requested question correction, review the diff and deliberately update fingerprints; omit baseline preservation for that correction rather than treating an approved change as an error.

When changing cross-topic assignments, validate both affected topics or omit `--topic` to check all prepared topics. The validator does not edit files. It checks static Markdown anchors and source-line inclusion, not browser rendering, pedagogical sufficiency, slide visibility, or exam scope. Reworded source text needs a deliberate preservation review rather than blindly satisfying a line matcher.

Update affected overviews/review/verification notes, `STATUS.md`, and `STATS.md`. Set manifest `preparation_status` honestly; validation does not grant user approval. Summarize checks and remaining decisions; stop at the requested scope without starting another lecture or building the app.
