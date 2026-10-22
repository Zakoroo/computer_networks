# SDN conversion verification

Prepared on 22 October 2026 against commit `8ba94d4` (full identity in the [manifest](manifest.json)). The working tree was clean at the start; the approved Socket API conversion and associated guidance/reports were committed. The repository prepare-lecture skill and isolated scaffold were used.

## Source preservation

All 20 numbered lessons retain the source teaching from definition/interfaces through adoption, networking planes, routing/ACL case studies, open stack, NOS/control programs, forwarding abstraction, virtualization, match-action processing, table misses, response modes, handshake, control reachability, history, adoption drivers, systems challenges, and the recap. The complete glossary, reference list, revision notes, and revision questions are retained in support documents. Dated claims, the DIT663 metadata caveat, supplied slide classification, and incomplete broad ACL-policy qualification remain visible. No source lecture was modified.

All five source diagrams are reused; no additional figures or image dependencies were introduced. The ACL topology in lesson 06 remains exact. Four label repairs preserve the existing designs:

- Lesson 01 wraps the control/platform labels and uses NB API / SB with a full interface legend. The three switches, data connections, control relationships, and northbound boundary remain unchanged.
- Lesson 10 wraps the original virtual-policy, topology, and enforcement labels. Its six directed translation dependencies and all seven nodes are unchanged.
- Lesson 12 retains the original three-column rule/action/statistics block alignment and all nine cells. Its table preserves the exact/wildcard pattern example, action alternatives, packet/byte counters, and lowest-priority default entry.
- Lesson 15 shortens participant/message text and wraps notes. H1/S1/C0/H4 order, all 14 directed messages, SYN/SYN-ACK/ACK and HTTP request/reply order, eth1/eth4, both directional entries, and buffers 250/251 remain intact. Context retains H2/H3 and the resolved-address/miss-rule/buffering assumptions. No message or new controller round trip was added.

The exact source-line comparison reports **43 nonverbatim source lines**, all confined to these four source diagrams, plus a changed-Mermaid-block finding. The original remains in lectures/. These are intentional, documented label-format differences; the strict validator does not pass overall. Full meanings remain in the revised diagrams, nearby tables, and retained prose. No original copy was duplicated into a lesson or hidden comment to evade the check.

The source has no separate executable code blocks. Its header patterns, policy notation, message fields, buffer IDs, priority 5000, idle timeout 20 seconds, hard timeout 60 seconds, port values, and historical tables remain present. Editorial context notes reconnect split source examples. Lesson 19 derives controller load, setup delay, and compatible-update reasoning from the retained NOS and reactive-exchange mechanisms rather than counting unanswered challenge prompts as complete answers. These notes do not introduce external protocol teaching or fill the failure-mode gap.

## Question review and dependencies

All 29 native stems, ordered options, and keyed choices were reviewed. Twenty-eight have SDN lesson links; Q027 remains an insufficient-coverage gap after networking guides 01–06 were checked. Q027 has partial native context, not enough failure-mode teaching to assert its keyed outcome; no other networking topic supplies it. Five wording flags (Q007/Q015/Q021/Q027/Q028) overlap coverage, including four mapped questions.

All 28 mapped entries distinguish additional required from optional reading: 3 questions require supporting lessons and 26 have optional background. The gap uses unresolved dependency metadata. 7 lessons without native primary assignments remain included. Lesson prerequisites are separate from question-completion requirements. No mapped native answer depends on archived hidden-slide supplementary material.

Routing Q011/Q070 were rechecked and remain unassigned because their trie/LPM/power comparisons are missing. No external question assignments, copies, or earlier-topic quiz changes were introduced. All question wording, ordered options, keys, explanations, manual tags, and other non-review fields remain unchanged; only quiz 06's lesson_id and flags are updated.

## Checks and limits

The saved validator was run against HEAD for IDs, fingerprints, baseline quiz preservation, source lines, Mermaid blocks, evidence headings, coverage/flag totals, prerequisites/cycles, dependencies, reverse assignments, static local links, and heading slugs. It reported exactly the two SDN diagram-preservation findings above, with no other SDN errors or warnings. The all-topic run reported those findings plus the two already documented Socket API diagram-preservation findings; its 49 legacy dependency warnings concern existing routing records. This is not an overall strict-validation pass.

Separate comparisons confirmed that all lecture files remain byte-identical to HEAD and that every quiz retains its question text, ordered options, answer keys, explanations, manual tags, and other fields outside lesson assignments/flags. Diagram checks confirmed graph connectivity, all nine block-table cells/three-column alignment, and the 14-message sequence/participant order. Root-report links, query filtering for the three required-support questions and one unmapped question, generated progress freshness, and Git whitespace checks passed. No tool implementation changed, so the tool unit suite was not rerun for this content conversion.

Source-span comparison, counts, and diagram semantic checks complement structural validation; none establishes rendering quality. Mermaid CLI and a local browser were unavailable, so diagrams were not rendered and browser-produced anchors were not verified. The public Mermaid syntax guide was consulted for line breaks; no syntax execution or visual-preview claim is made.

The primary OpenFlow 1.3.0 specification was consulted for selected matching, table-miss, and connection-interruption review findings. Those supplementary checks do not fill lecture gaps. Historical deployment/adoption claims, membership, acquisition value, slide visibility, supplied course suffix, every linked paper, and current implementation status were not independently authenticated. No answer-key correction, application work, commit, or push was performed.

[Topic overview](README.md) · [Review queue](review.md)
