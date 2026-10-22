# Project status

Last updated: 22 October 2026.

This is the current handoff, not a task authorization or a substitute for inspecting Git. Operating rules are in [AGENTS.md](AGENTS.md); measured counts are in [STATS.md](STATS.md).

## Completed

- The user approved the Internet Routing content changes. The historical `routing_lessons.patch`, based on commit `192e7ea`, was checked and applied locally. It still references the former `.txt` quiz path; do not reapply it to the current tree.
- Routing lessons preserve the source guide's teaching text, Mermaid diagrams, and supplementary classifications, including material without questions. See the [topic overview](lessons/01_routing/README.md), [review queue](lessons/01_routing/review.md), and [verification report](lessons/01_routing/verification.md) for evidence and limits.
- Quiz files were renamed from `.txt` to `.json` without changing their contents during the rename. The routing manifest and active documentation references were updated.
- The gitignored local extraction script now emits `.json`; the existing merge script successfully processed the renamed quizzes. Local utility changes are not automatically part of a commit.
- Root documentation separates operating instructions, status, and statistics.

## Open decisions and work

- Distinguish required supporting lessons from optional context in `related_lesson_ids` before implementing lesson-completion gates. Current related links do not establish mandatory reading.
- Review flagged question wording and coverage gaps before using affected questions for scored practice. Preserve original answer keys until a correction is requested.
- Cross-topic questions awaiting suitable lessons retain an empty `lesson_id`.
- Only Internet Routing has been split into lessons. Further topic conversion awaits the user's direction.
- The application has not been built. Manual, persisted add/remove tag functionality remains a requirement.

## Delivery and verification

No commit or PR has been created during this work as of this update. Inspect current Git state for subsequent changes.

Routing verification checked available Markdown guides, fingerprints, assignments, preserved text, and local file links. It did not independently authenticate slide visibility or historical deployment statistics, render Mermaid diagrams, or verify browser-generated heading anchors. No application test suite exists yet.

Update this file when progress or open decisions change. Record current state rather than accumulating a transcript; retain detailed evidence in the relevant topic documents.
