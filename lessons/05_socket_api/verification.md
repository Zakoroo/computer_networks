# Socket API conversion verification

Prepared on 22 October 2026 against commit `ea7f3e7` (full identity in the [manifest](manifest.json)). The working tree was clean at the start; TCP lessons, the diagram workflow refinements, and DNS approval were already committed. The saved prepare-lecture workflow and isolated scaffold were used.

## Source preservation

All 42 numbered lessons preserve the guide's teaching sections, examples, equations, commands, service/port tables, code caveats, historical qualifications, and material without questions. The glossary and revision notes/references are retained separately; the overview preserves the source title, revised date, course-code caveat, and supplementary notice. The original lecture files are unchanged.

All 11 source Mermaid diagrams are reused as lesson figures, with no additional diagrams or image dependencies. Five blocks remain exact. The user's requested label/layout repairs affect lessons 02/04/05/07/08/20:

- Lessons 02/04 use wrapped node text, short connection labels, and endpoint tables. Addresses, ports, port roles, connection identities, wildcard listening, both server interfaces, parent/child fork arrows, and bidirectional connections remain intact.
- Lesson 05 retains all nine releases, years, and eight branching edges; its table preserves every source feature description, release designation, and BSD-Lite descendant.
- Lesson 07 retains the two-column structure comparison, all six field groups, conceptual byte sizes, AF_INET, network-order fields, and zero-filled padding. The original platform-layout qualifications remain visible.
- Lesson 08 retains both address-family panels, the four conversion directions, binary widths/structures, presentation patterns, and modern/legacy API names. An invisible layout-only link places IPv4 above IPv6; it expresses no cross-family conversion.
- Lesson 20 uses a top-to-bottom SYN → incomplete queue → completed queue → server path. The table retains SYN_RCVD/ESTABLISHED, the third ACK K+1, handshake timeout, and accept's front-entry dequeue. Backlog qualifications remain unchanged.

The original lecture is unchanged. These repairs preserve the source teaching while shortening and wrapping labels or changing panel placement.

All 26 C blocks remain exact, including deliberately intermediate or blocking teaching examples and their limitations. They are separate source fragments using the course support library, not standalone compilable application files. Code-context links and repeated source helper assumptions keep that context visible after splitting. No application or code execution was part of this conversion.

The guide reports no hidden substantive slides. No lesson inherits a new † classification; supplementary API review checks are labelled separately and are not examinable extension lessons. Editorial notes either repeat source definitions or explain reasoning from the retained code and source combinations. No extension was added to close a gap.

## Question review and dependencies

All 80 native stems, ordered options, and keyed choices were reviewed against explanatory teaching. 47 have socket API primary lessons; 32 lack sufficient coverage in guides 01–06, and one has partial TCP/Nagle background. The 33 gap entries retain empty primary links and unresolved dependencies. 40 wording flags overlap these categories; one cross-topic flag records Q046. No native mapped answer depends on archived supplementary slides.

Some mapped lessons teach why a premise or key is false. Examples include inet_pton invalid input, select's ready subset, stale maxfd, and ordered FIN/EOF behavior. A map is not endorsement of a defective key. Specific unsupported API details remain gaps despite related source names or select examples. Shared writability, bounded-queue, and partial-write questions use the common socket mechanisms actually taught.

All mapped entries explicitly classify additional required and optional lessons; 12 need additional required teaching and 46 list optional background. Practice sections list the required support. Lesson prerequisites describe reading order separately. 18 lessons without native assignments remain included. Every question stays canonical in quiz 05; no external assignments or earlier-quiz content changes were made.

TCP Q003/Q026/Q027 and IPv6 Q013 remain unresolved. The new socket lessons preserve related background but do not supply their missing sequence arithmetic, cookies, attack validation, or acknowledgment-scope explanation.

## Checks and limits

The saved validator checks source-line inclusion, exact Mermaid blocks, JSON structure, fingerprints, quiz preservation against HEAD, IDs, prerequisite cycles, required/optional references, reverse assignments, evidence headings, coverage/flag counts, static local links, and anchors. Exact C-block preservation is checked separately. Progress generation/freshness and Git whitespace checks complete the handoff; structural checks do not replace the semantic review.

After the label/layout repairs, the strict validator reports two preservation findings: 43 original Mermaid lines are no longer present verbatim, and the six repaired blocks differ from the source. The differing lines are confined to those six source diagrams; they contain labels and layout statements whose meanings and data are retained in the revised figures/tables. No other validator errors were reported. These are documented formatting exceptions, not an overall strict-validation pass. The skill validator, progress freshness, and whitespace checks pass.

Mermaid CLI and a local browser renderer were unavailable, so no rendered diagram readability or browser-anchor check is claimed. Historical BSD examples, every resource link, original slide visibility, the supplied course suffix, and empirical claims were not independently authenticated. Supplementary maintained API documentation was consulted for selected review findings; it was not counted as lecture teaching. No answer-key correction, application work, commit, or push was performed.

[Topic overview](README.md) · [Review queue](review.md)
