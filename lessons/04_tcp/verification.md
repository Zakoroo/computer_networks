# TCP conversion verification

Prepared on 22 October 2026 against commit `436acd7` (full identity in the [manifest](manifest.json)). The working tree was clean at the start. The saved prepare-lecture skill and scaffold were used; no earlier topic was regenerated.

The user approved the conversion and associated changes on 22 October 2026. The manifest records `approved`; the coverage gaps and wording findings below remain documented.

## Source preservation

Twenty-five lessons retain every teaching section, worked example, equation, glossary definition, exercise link, qualification, source correction, dated claim, and supplementary prompt from lecture 04. Ten lessons have no native TCP quiz assignment and remain included. The original lecture files are unchanged. The overview separately retains the source title, generation date, and supplementary notice.

Lessons 15, 16, and 25 inherit the guide's † archived/hidden-slide classification. The visible Reno explanation supports out-of-order buffering without needing that archived comparison. No extension lessons were added to fill missing teaching. Added clarifications are labelled and derive the byte/ACK trace, new-versus-duplicate ACK behavior, QoS goals versus guarantees, loss-path distinctions, and buffering consequences from existing source teaching.

All 13 source Mermaid blocks remain exact and appear directly as figures in numbered lessons, with no image dependencies. The source's horizontal byte-window diagram and Reno state diagram are used in lessons 06 and 14; the redundant editorial alternatives were removed following the user's source-diagram preference. There are 13 Mermaid blocks in the numbered lessons. Mermaid CLI was unavailable, so no rendered readability check is claimed. The source figures still need visual inspection before publication.

## Semantic coverage review

All 29 native stems, options, and keyed choices were compared with actual explanatory text. Twenty-one have TCP primary lessons; seven lack sufficient explanation in guides 01–06, and one has partial socket-guide background. The eight gaps have no primary assignment and keep dependency classification unresolved. Six wording flags, three supplementary-source flags, and one cross-topic flag overlap the coverage categories.

All 21 mapped entries classify additional required and optional lessons explicitly. For the keyed distinctions, the primary lessons are sufficient after observing the recorded wording qualifications; none requires an additional lesson. Optional background and study prerequisites are not counted as mandatory per-question dependencies. Supplementary RFC checks explain selected question defects without being counted as missing lecture teaching.

Routing Q049 now has its real TCP lesson link in the original quiz and canonical routing manifest, mirrored only by an external reference here. Its cross-topic status and flag remain; it is counted once. Routing Q047/Q048 and IPv6 Q013 remain unresolved. Coverage and wording are separate: a mapping is not approval to use an ambiguous question for scored practice.

## Checks and limits

The saved validator checks all prepared topics against HEAD for source-line and exact-diagram preservation, question fingerprints, preserved question content/keys/explanations/tags, JSON structure, counts, lesson IDs, dependency and prerequisite consistency, exact evidence headings, reverse/external assignments, local links, and static anchors. Progress freshness and Git whitespace checks are run separately. Static checks do not substitute for the semantic review above.

Dated deployment/standardization and empirical claims, every external resource, original slide visibility, and exam scope were not independently authenticated. Browser-generated anchors and Mermaid layout were not checked in a browser. No application, commit, push, or answer-key correction was performed.

[Topic overview](README.md) · [Review queue](review.md)

## Answer-explanation pass, 22 October 2026

Against committed baseline `078b66f`, authored explanations for all 21 currently linked native questions in `quizzes/quiz_04_tcp.json`. Reviewed each against its actual mapped teaching, ordered options, key, and relevant review notes. Cross-topic support uses the destination lessons; the canonical question remains here. The 3 linked wording findings are addressed explicitly, including any preserved key that conflicts with the source. All supplementary-source dependencies retain the inherited † notice. The 8 unlinked questions keep their empty explanations and coverage gaps. No new coverage was claimed.

A separate comparison verified that **only explanation fields changed in the quiz**: question text, option order, correct-answer indices, manual tags, lesson assignments, flags, and all other fields are identical to HEAD. Fingerprints remain valid. Every explanation links to its primary lesson and every explicitly required supporting lesson; all local targets were checked. No lecture teaching, numbered lesson, diagram, or dependency classification was changed.

The saved validator without `--baseline` retains only the four previously documented Socket API/SDN diagram-preservation findings across the repository, plus the existing 49 legacy dependency warnings. With `--baseline HEAD`, it additionally reports a content difference for each of the six intentionally edited quizzes because explanations are protected content. Those generic messages do **not** indicate that keys changed: the stricter comparison allowing only explanation edits verified their preservation. This is not an overall strict-baseline validation pass. No validator behavior was weakened.

`explanation_status` is now **reviewed**, awaiting the user's approval of the new text. `preparation_status` retains approval of the unchanged lesson conversion. The explanation pass does not classify missing legacy dependencies as empty or resolve existing wording flags by itself. No application code, answer-key corrections, new figures, commit, or push was produced.
