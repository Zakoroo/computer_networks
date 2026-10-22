# Lessons

Each topic has a numbered directory containing short Markdown lessons, a topic overview, a glossary, a review queue, and a JSON manifest. Start with [01 — Internet routing](01_routing/README.md).

Available topics: [01 — Internet routing](01_routing/README.md) · [02 — DNS](02_dns/README.md). Networking cross-topic coverage checks stop at lecture 06 (SDN); lectures 07 onward belong to algorithms.

## Content conventions

- Give each lesson a stable ID in YAML front matter and in its topic manifest. Numbered filenames control reading order; the ID is the question link.
- Preserve the source material even when the supplied quiz has no corresponding question. State learning goals, link prerequisites, and keep diagrams in Mermaid.
- Keep source classifications, dated claims, and uncertainties visible. A hidden-slide † designation is inherited from the guide, not a new exam-scope judgment.
- Label editorial clarification. Add a clearly labelled extension lesson only when a reviewed gap needs material beyond the available lectures.
- Inspect other topics before declaring a gap. A related keyword or unanswered review prompt is insufficient evidence of answer coverage.
- Use existing quiz `lesson_id` and `flags` fields. Leave `lesson_id` empty when no actual lesson exists, including a question assigned to another topic awaiting conversion.
- Keep tags for manual study-time editing. Preserve question wording, option order, and correct-answer indices unless a separate reviewed correction is explicitly made.

Future application requirement: users must be able to add and remove tags manually while studying, with changes persisted on the question. Tag editing is not implemented by this content pilot.

## Manifest conventions

`schema_version: 1` contains `lessons` and `question_links`. Lesson entries provide the ID, path, goals, prerequisites, source sections, classification, and assigned question IDs. Question entries provide a stable manifest ID, zero-based source index, fingerprint of the question and ordered options, primary/related lesson IDs, coverage status, flags, evidence, and review rationale.

Topic manifests also record `preparation_status`: `drafted` (content assembled), `reviewed` (content checks performed, awaiting user approval), or `approved` (user approved). Set this explicitly; neither a file's existence nor successful validation establishes approval. [PROGRESS.md](../PROGRESS.md) uses this metadata for its stage view, independently of commit/push status. Reassess the recorded stage when substantive content changes.

Before matching by source index after any edit, check `question_sha256`. Compute SHA-256 over UTF-8 JSON containing exactly `question` and `options`, with sorted keys, Unicode unescaped, and compact separators. The fingerprint excludes answer indices, tags, flags, and lesson assignments. If text or option order changes, update the manifest deliberately rather than silently attaching a different question.

Coverage statuses are `routing_lesson` for this pilot, `covered_in_other_topic`, `partial_in_other_topic`, and `not_found_in_available_lectures`. Cross-topic targets use source-file/section references until their real lessons exist. Coverage and question validity are independent: a mapped question can still need wording review.

DNS uses `dns_lesson` for its own mapped questions. Its question entries explicitly separate `required_lesson_ids` (additional lessons needed beyond the primary lesson) from `optional_lesson_ids` (background); `related_lesson_ids` is their union. Lesson-level prerequisites describe the study sequence and are not automatic per-question requirements. Most original routing entries still have only the older `related_lesson_ids` field: an absent `required_lesson_ids` field means unclassified, not that no additional lesson is needed.

Questions stay canonical in their source topic's `question_links`, even when assigned to another topic's lesson. The destination topic lists `external_question_links` with source-quiz/index and canonical-manifest references; lesson entries list these separately as `external_question_ids`. Count native and external assignments separately. Once suitable lessons exist, populate the original quiz's `lesson_id` and canonical manifest together; retain the cross-topic coverage status and flag. Do not duplicate full canonical question records in another manifest.

DNS also uses `duplicate_question` to identify preserved source duplicates with reordered options. Duplicate groups do not authorize deleting or reordering source questions.

Quiz files use the `.json` extension. Their JSON structure is retained. This change supplies content and mappings; it does not implement the application.
