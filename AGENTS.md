# Agent guide

Maintain exam-study content and its local study application: short Markdown lessons followed by directly related quiz questions. Follow the current request; do not automatically advance to another lecture, application feature, or deployment.

## Start here

1. Inspect `git status --short` and relevant existing changes. Preserve the user's work.
2. Read [STATUS.md](STATUS.md) for current progress and open decisions. Use [PROGRESS.md](PROGRESS.md) for charts or [STATS.md](STATS.md) when detailed counts are needed; do not load every report for a focused edit.
3. For lecture conversion or mapping review, read the repository workflow [skills/prepare-lecture/SKILL.md](skills/prepare-lecture/SKILL.md). Then inspect only the active topic's overview, review queue, manifest entries, and relevant source sections. The skill links to templates and reusable tools.
4. Consult [lessons/README.md](lessons/README.md) when schema or content conventions are needed. Use targeted `rg` searches rather than scanning every file.
5. For application implementation or diagnosis, use [skills/maintain-study-app/SKILL.md](skills/maintain-study-app/SKILL.md). It routes to the architecture's relevant modules/contracts and the existing app checks.
6. For native packages, CI candidates, or releases, use [skills/release-study-app/SKILL.md](skills/release-study-app/SKILL.md). It routes to packaging commands, artifact diagnosis, and the tag/draft/publication workflow. Use the [tools index](tools/README.md) to select existing helpers and check their effects.

Treat status documents as snapshots; verify the actual files. Skills here are repository resources reached through these links, without requiring a global installation.

## Repository and scope

- `lectures/`: source guides; `quizzes/quiz_*.json`: curated questions; `lessons/<topic>/`: derived lessons, manifests, and review evidence. Preserve source teaching even without questions. Keep original lecture files unchanged when splitting content.
- `tools/`: executable helpers with concise output and `--help`; [tools/README.md](tools/README.md) indexes commands, outputs, and checks. `skills/`: focused lecture, app-maintenance, and release workflows linking to their maintained references.
- For question lookups, use `python3 tools/query_quizzes.py` with focused criteria instead of dumping whole quizzes. It defaults to networking scope; see the skill for query options and cross-topic identity rules.
- Networking coverage searches stop at lecture 06 (SDN). Lectures 07 onward are algorithms; broaden scope only when the user requests it.
- `quiz_extraction/` and `other/` are gitignored local resources. Do not silently force-add them. Rerunning extraction over curated quizzes would erase tags, explanations, and assignments.
- Preserve question wording, ordered options, answer keys, explanations, and manual tags unless the task requests a correction. Structural validation cannot decide whether teaching supports an answer.
- Historical patches require compatibility inspection before use; do not apply them by default.

## Routine commands and handoff

```sh
python3 tools/validate_content.py --topic 02_dns --baseline HEAD
python3 tools/generate_progress.py
python3 tools/generate_progress.py --check
git diff --check
```

Substitute the active topic ID, or omit `--topic` to validate all prepared topics. `--baseline` is for preservation checks; the skill explains intentional question corrections. Read detailed findings only when checks fail. Tools must not grant content approval or rewrite answer keys.

Update affected topic documents, [STATUS.md](STATUS.md), and [STATS.md](STATS.md); regenerate [PROGRESS.md](PROGRESS.md) after count/stage changes. Set `preparation_status` explicitly and reconsider it after substantive changes. Keep routine progress and live counts out of this guide. Report what changed, what was checked, and unresolved decisions; distinguish static checks from semantic review, rendered diagrams, and independently verified sources.
