# Agent guide

Prepare exam-study content: short Markdown lessons followed by directly related quiz questions. Follow the current request; do not automatically advance to another lecture or build the application.

## Start here

1. Inspect `git status --short` and relevant existing changes. Preserve the user's work.
2. Read [STATUS.md](STATUS.md) for current progress and open decisions. Use [PROGRESS.md](PROGRESS.md) for charts or [STATS.md](STATS.md) when detailed counts are needed; do not load every report for a focused edit.
3. For lecture conversion or mapping review, read the repository workflow [skills/prepare-lecture/SKILL.md](skills/prepare-lecture/SKILL.md). Then inspect only the active topic's overview, review queue, manifest entries, and relevant source sections. The skill links to templates and reusable tools.
4. Consult [lessons/README.md](lessons/README.md) when schema or content conventions are needed. Use targeted `rg` searches rather than scanning every file.

Treat status documents as snapshots; verify the actual files. Skills here are repository resources reached through these links, without requiring a global installation.

## Repository and scope

- `lectures/`: source guides; `quizzes/quiz_*.json`: curated questions; `lessons/<topic>/`: derived lessons, manifests, and review evidence. Preserve source teaching even without questions. Keep original lecture files unchanged when splitting content.
- `tools/`: executable helpers with concise output and `--help`. `skills/prepare-lecture/`: workflow, plan reference, and templates.
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
