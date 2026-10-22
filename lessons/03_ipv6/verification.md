# IPv6 conversion verification

Prepared on 22 October 2026 against commit `ee91644` (full identity in [manifest.json](manifest.json)). The working tree was clean at the start; DNS and reusable tooling were already committed. Existing files were inspected before using the saved prepare-lecture workflow and an isolated scaffold.

## Source preservation

Twenty-five lessons retain all teaching sections of lecture 03, including material without quiz questions. The glossary, references, source metadata, worked examples, configuration commands, equations, dated observations, corrections, and caveats remain present. The original lecture file is unchanged.

The full source's nonempty teaching/reference lines, excluding document preamble, reorganized headings, and navigation, were checked for inclusion after whitespace trimming. The preamble is separately retained in the overview. All 13 source Mermaid blocks were preserved exactly. Sixteen lessons have no native quiz assignments and are deliberately retained. The guide reports no hidden slides, so no lesson inherits a supplementary † classification. A linked supplementary video remains a source resource, not a new hidden-slide designation.

No extension lessons were added to close gaps. Short additions reuse the source NAT glossary and clarify address configuration versus reachability; they are labelled editorial clarification. Targeted supplementary standards checks are confined to review findings and are not counted as lecture teaching.

## Question coverage and dependencies

All 30 native questions were compared with their requested reasoning, ordered options, and keys. Twenty are mapped to IPv6 lessons; Q012 uses routing plus required IPv6 support; two have partial cross-topic support; seven lack sufficient explanation after checking networking lectures 01–06. That produces nine coverage-gap flags. Nine wording-review flags and three cross-topic flags overlap these categories; they are not separate populations. No questions were removed or reordered.

Every mapped question has explicit additional required/optional lesson fields. Q004, Q012, and Q024 require multiple lessons. Q004's embedded-address support is needed to evaluate the mixed decimal/hexadecimal option. Gap entries leave those requirements unresolved rather than treating an empty known list as proof of standalone coverage. Q002 is mapped for conceptual review but does not offer a clear correct option for the stated benefit; a mapping is not endorsement of its key. Q020's unsupported route-scaling content and incorrect specific rule are recorded separately. No new question keys were invented.

The text, ordered options, correct-answer indices, explanations, and tags in both affected quizzes match HEAD. Question fingerprints, quiz/manifest links, cached counts, reference IDs, and reverse/external assignments were checked using the saved validator. Optional tags remain editable by the future application.

## Cross-topic reconciliation

Routing Q014/Q085/Q086 now have real IPv6 lesson IDs and explicit dependency classification. Their previous coverage categories and flags remain unchanged. Routing Q013 stays a partial-support gap with no primary lesson. The routing manifest still accounts for its original questions; the IPv6 manifest references the three external questions instead of duplicating them.

IPv6 Q012 stays canonical in this topic and is referenced externally from routing lesson 03. Its qualitative fragment-loss risk is taught by the routing lesson, with required IPv6 lesson 17 supplying the distinct source-only fragmentation rule. The stem's 10% number is not used to claim a taught probability calculation.

## Checks and limits

Checks covered source-line and exact Mermaid-block preservation, JSON parsing, source fingerprints, quiz field preservation against HEAD, answer index bounds, coverage/flag counts, question and lesson IDs, prerequisite cycles, required/optional dependencies, evidence headings, reverse/external assignments, static local links/anchors, generated progress freshness, and whitespace errors.

Mermaid blocks were not rendered and local anchors were not checked in a browser. Semantic coverage was reviewed separately from structural validation. Original slide visibility, exam scope, every external reference, and dated prices/adoption statistics were not independently authenticated. No current measurement or historical chart series was reconstructed from the source's qualitative descriptions. No application work, commit, or push was performed for this conversion.

[Topic overview](README.md) · [Review queue](review.md)
