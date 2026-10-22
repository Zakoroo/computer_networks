# Lessons

Each topic has a numbered directory containing short Markdown lessons, a topic overview, a glossary, a review queue, and a JSON manifest. Start with [01 — Internet routing](01_routing/README.md).

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

Before matching by source index after any edit, check `question_sha256`. Compute SHA-256 over UTF-8 JSON containing exactly `question` and `options`, with sorted keys, Unicode unescaped, and compact separators. The fingerprint excludes answer indices, tags, flags, and lesson assignments. If text or option order changes, update the manifest deliberately rather than silently attaching a different question.

Coverage statuses are `routing_lesson` for this pilot, `covered_in_other_topic`, `partial_in_other_topic`, and `not_found_in_available_lectures`. Cross-topic targets use source-file/section references until their real lessons exist. Coverage and question validity are independent: a mapped question can still need wording review.

Quiz files use the `.json` extension. Their JSON structure is retained. This change supplies content and mappings; it does not implement the application.
