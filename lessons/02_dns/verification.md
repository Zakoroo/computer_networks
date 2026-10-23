# DNS conversion verification

Prepared on 22 October 2026 against commit `657236d` (full source identity in [manifest.json](manifest.json)). The working tree was clean at the start. The user reported that the preceding routing work had been committed and pushed and the recovery patch removed; Git confirmed that commit as HEAD and the patch was absent.

The user approved the DNS topic lessons on 22 October 2026. The manifest records `approved`; the coverage gaps and question-review findings below remain documented.

## Preservation and structure

- Twenty numbered Markdown lessons cover every teaching section of lecture 02. The source glossary, references, examples, command snippets, equations, and qualifications are retained. The original lecture file is unchanged.
- Every nonempty source teaching/reference line is present in the destination Markdown after trimming surrounding whitespace, apart from reorganized headings. The glossary table is preserved separately. Source metadata and its historical-example warning appear in the overview.
- All 11 source Mermaid blocks are preserved exactly, with no image dependencies. Other fences contain source DNS records, shell commands, or text encodings, not external visuals.
- Seven lessons have no native DNS-quiz assignments: mail/reverse DNS, SRV/TXT/SPF, root rollover, minimisation/Oblivious DoH, anycast, persistent failures, and practical revision. Anycast does now support a question from the routing quiz. These lessons are retained regardless of quiz demand.
- Lesson 09 preserves the inherited † designation only for CNAME coexistence and MX restrictions. Other material remains unmarked. No extension lessons were added to fill unsupported questions.

## Question review

- All 31 source DNS questions are accounted for: 27 have a primary DNS lesson and four retain an empty `lesson_id` with a coverage-gap flag.
- Q015, Q022, Q026, and Q030 remain insufficiently covered after targeted searches and section review across networking lectures 01–06. Q022 has DNS-side context but lacks the HTTP mechanism; Q030 has DHCP context but lacks DDNS integration. Algorithms lectures were excluded as requested.
- Q012, Q014, Q019, and Q028 have wording-review flags separately from coverage gaps. Their lessons teach the mechanism and its qualification; the original keyed answers are unchanged.
- Q001 and Q002 are duplicates with reordered options. Both identities and answer indices are preserved and flagged. They are included in the 27 mapped entries.
- The text, ordered options, correct-answer indices, explanations, and tags in both affected quizzes match HEAD. Only assignment/flag fields change. All fingerprints were recomputed independently and match their manifest records.
- Each mapped DNS question was compared with its primary lesson's explanation and keyed option. Short, labelled clarifications name the already-illustrated stub role, work through cache expiry, and qualify CNAME lookup cost. No native DNS question requires an additional lesson to answer the supported concept. Twenty-four list optional background, explicitly separated from required support.

## Cross-topic reconciliation

Routing Q036 now links to `dns-18`. Routing Q037 links to `dns-08` and additionally requires `dns-18`: replica synchronization timing and route-selected instances are both needed. Their source-topic records remain canonical in the routing manifest; the DNS manifest stores external references rather than duplicate full records. Quiz links, review notes, overviews, and Practice sections agree.

The routing coverage categories and flag totals are unchanged. Two of the six questions covered in another topic now have real lesson assignments; four still await other topics. Fifty original routing questions still have related links without an explicit required-versus-optional classification. This conversion classifies only the two newly linked routing questions and the native DNS entries.

## Checks and limits

Validation covered JSON parsing, source identity fingerprints, preserved quiz fields, coverage/flag counts, unique question indices, lesson IDs, prerequisite cycles, required/optional reference consistency, canonical/external references, reverse assignments, evidence section headings, source-text preservation, exact Mermaid-block preservation, local file links and heading anchors, and `git diff --check`.

The root-KSK timeline, adoption measurements, and historical lookup results are retained as source-qualified statements. They were not freshly authenticated or turned into current measurements. Original PowerPoint visibility and exam scope were not rechecked. Mermaid blocks were compared as text, not rendered. Local heading anchors were checked against Markdown heading slugs and explicit IDs, not in a browser. No application was built and no commit or PR was created for this conversion.

Additional standards checks used [RFC 1034](https://www.rfc-editor.org/rfc/rfc1034.html#section-5.3.1) for stub resolvers and CNAME processing, [RFC 1035 §6.1.3](https://www.rfc-editor.org/rfc/rfc1035.html#section-6.1.3) for ordinary cache expiry, [RFC 2308 §5](https://www.rfc-editor.org/rfc/rfc2308.html#section-5) for negative-cache timing, and [RFC 5452 §9.1](https://www.rfc-editor.org/rfc/rfc5452.html#section-9.1) for response matching. These checks support the identified clarifications, not an assertion that every external reference was audited.

[Topic overview](README.md) · [Review queue](review.md)

## Answer-explanation pass, 22 October 2026

Against committed baseline `078b66f`, authored explanations for all 27 currently linked native questions in `quizzes/quiz_02_dns.json`. Reviewed each against its actual mapped teaching, ordered options, key, and relevant review notes. Cross-topic support uses the destination lessons; the canonical question remains here. The 4 linked wording findings are addressed explicitly, including any preserved key that conflicts with the source. The 4 unlinked questions keep their empty explanations and coverage gaps. No new coverage was claimed.

A separate comparison verified that **only explanation fields changed in the quiz**: question text, option order, correct-answer indices, manual tags, lesson assignments, flags, and all other fields are identical to HEAD. Fingerprints remain valid. Every explanation links to its primary lesson and every explicitly required supporting lesson; all local targets were checked. No lecture teaching, numbered lesson, diagram, or dependency classification was changed.

The saved validator without `--baseline` retains only the four previously documented Socket API/SDN diagram-preservation findings across the repository, plus the existing 49 legacy dependency warnings. With `--baseline HEAD`, it additionally reports a content difference for each of the six intentionally edited quizzes because explanations are protected content. Those generic messages do **not** indicate that keys changed: the stricter comparison allowing only explanation edits verified their preservation. This is not an overall strict-baseline validation pass. No validator behavior was weakened.

`explanation_status` is now **reviewed**, awaiting the user's approval of the new text. `preparation_status` retains approval of the unchanged lesson conversion. The explanation pass does not classify missing legacy dependencies as empty or resolve existing wording flags by itself. No application code, answer-key corrections, new figures, commit, or push was produced.
