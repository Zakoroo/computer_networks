# Agent guide

## Purpose and scope

Prepare content for an exam study application: short Markdown lessons followed by directly related quiz questions. Preserve the lecture material, including topics with no questions.

Follow the user's current task. Do not automatically advance to another lecture or start building the application after finishing a content task.

## Start here

1. Run `git status --short` and inspect relevant existing changes. Preserve the user's work; do not assume an uncommitted file is disposable or that a patch needs applying.
2. Read [STATUS.md](STATUS.md) for progress and open decisions, [STATS.md](STATS.md) for measured counts, and [lessons/README.md](lessons/README.md) for content and manifest conventions.
3. For routing work, read [the topic overview](lessons/01_routing/README.md), [review queue](lessons/01_routing/review.md), and [verification report](lessons/01_routing/verification.md). Inspect the relevant manifest entries and lessons next.
4. Use targeted `rg` searches to find source sections and references. Read the relevant lecture sections in context. Scan other lectures when checking a coverage gap, rather than rereading every file for every task.

Treat status documents as snapshots, not proof of the current tree. Check relevant files before editing or applying anything.

## Repository map

- `lectures/`: source Markdown lecture guides. These are the current content sources; lessons are derived from them. Do not rewrite the source guides merely to split them into lessons.
- `quizzes/quiz_*.json`: JSON quiz files. Preserve the existing topic names and filename spellings unless the task calls for changing them.
- `lessons/<topic>/`: numbered lessons, overview, glossary, review queue, and `manifest.json`. Lesson IDs, rather than filenames, link questions to lessons.
- `quiz_extraction/`: local extraction/merge utilities and HTML inputs. This directory is gitignored. Local edits here will not automatically be included in a commit; mention relevant changes rather than silently force-adding it.
- `other/`: gitignored supporting material. Do not treat it as already reviewed source evidence.
- Historical patch artifacts: consult `STATUS.md` and inspect compatibility before use. Do not apply or regenerate them by default.

## Content and question rules

- Split topics into manageable Markdown lessons with learning goals, prerequisites, and source references. Retain material even when no quiz question uses it.
- Use Mermaid diagrams only; no image dependencies.
- Preserve inherited † supplementary labels and explain their provenance. Mark added teaching beyond the guides as supplementary/extension material; label editorial clarifications explicitly. Do not imply that a coverage gap establishes exam scope.
- Preserve dated claims and their qualifications. Do not present historical deployment statistics as current measurements.
- Keep question wording, option order, answer indices, explanations, and manual tags intact unless the user requests a correction. Record ambiguous wording or questionable keys separately in the review queue.
- Use the existing `lesson_id` field for an actual primary lesson. Leave it empty when no suitable lesson exists, including cross-topic questions awaiting lesson creation. Do not invent future IDs.
- Check whether the lesson and any required supporting lessons teach enough to answer the question. A keyword mention or unanswered review prompt is not sufficient coverage.
- Check other lecture guides before declaring missing coverage. Record exact file/section evidence and distinguish missing coverage, partial coverage, cross-topic support, wording issues, and questions requiring multiple lessons.
- Keep quiz assignments, manifest entries, reverse question lists, lesson Practice sections, overview tables, and review notes consistent when changing mappings.
- Preserve the manifest's fingerprint convention described in `lessons/README.md`. Verify fingerprints before using source indices after question edits; regenerate deliberately if text or option order changes.
- Tags are for manual editing while studying. The future app must allow users to add/remove tags and persist changes. Consult `STATUS.md` for implementation progress.

## Verification and handoff

Use checks appropriate to the change and the available tooling documented in `STATUS.md`.

- Parse affected `.json` files with Python 3's `json` module. For a rename, compare file bytes before/after and update active references.
- For mapping changes, verify IDs, prerequisites, related references, fingerprints, quiz/manifest agreement, reverse assignments, and coverage/flag counts.
- For lesson restructuring, compare against source teaching text, including material without questions; inspect supplementary labels, local links, and Mermaid blocks. State separately whether diagrams were actually rendered.
- To exercise quiz merging without changing repository data, run `python3 quiz_extraction/merge.py --src quizzes --out /tmp/computer_networks_quiz_check.json` if the local utility exists. Do not rerun extraction over curated quizzes to validate a rename: extraction initializes tags, explanations, and lesson links.
- Run `git diff --check` and review the final diff/status. Account for untracked lessons/files and gitignored utilities; a normal diff alone does not show them.

Report what changed, what was checked, and unresolved decisions. Update `STATUS.md` when progress, blockers, or open decisions change. Recompute affected counts in `STATS.md` when content or mappings change; record the measurement date and source. Keep topic overviews/manifests consistent. Update this guide only when operating rules or repository conventions change, not for routine progress. Do not copy live counts into this guide. Do not describe checks as stronger than they were: the routing verification compared available Markdown guides, not original slide visibility or independently authenticated deployment statistics.
