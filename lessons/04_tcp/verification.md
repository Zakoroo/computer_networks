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
