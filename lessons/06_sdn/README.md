# 06. Software-Defined Networking (SDN) and OpenFlow

Read a short lesson, then answer its directly related questions in [quiz 06](../../quizzes/quiz_06_sdn.json). Q001–Q029 retain the original question order. Reading estimates exclude practice and diagram tracing.

The complete [source guide](../../lectures/lecture_06_sdn.md) is retained across 20 lessons, a [glossary](glossary.md), and [references](references.md), including material without questions and all five source Mermaid diagrams. The original lecture is unchanged. Lesson 06's ACL diagram stays exact; lessons 01/10/12/15 make small label repairs using line breaks, short labels, and adjacent full-detail tables. Layout, nodes, interfaces, dependencies, table alignment, directional rules, buffer IDs, ports, and message order are retained. No additional figures or image dependencies were added.

**Source revised:** 21 October 2026. **Source title:** Software-Defined Networking (SDN) and OpenFlow (EDA387; supplied guide labels DIT663). The course suffix is retained as supplied metadata, not independently verified.

**† Supplementary material:** Content identified by the supplied guide as originating exclusively from hidden slides. It may not be included in this year's examinable material. The guide reports no hidden substantive slides; that classification is retained. Supplementary specification checks in the review are separate from lecture teaching, and no extension lessons were added.

## Lessons

| Lesson | Reading estimate | Native practice |
| --- | --- | --- |
| [01. SDN separation, logical centralization, and interfaces](01_definition_and_interfaces.md) | ~2 min | Q001, Q002, Q003 |
| [02. Historical adoption and production examples](02_adoption.md) | ~1 min | None supplied |
| [03. Data, control, and management responsibilities](03_networking_planes.md) | ~2 min | None supplied |
| [04. Indirect control and uncoordinated updates](04_traditional_control.md) | ~1 min | Q010 |
| [05. BGP policy limits and cooperating SDN domains](05_bgp_policy_limits.md) | ~2 min | None supplied |
| [06. How a new route can bypass a packet filter](06_routing_and_acls.md) | ~2 min | Q009 |
| [07. From integrated appliances to an open network stack](07_open_network_stack.md) | ~2 min | Q016 |
| [08. The Network OS and control programs](08_network_os.md) | ~2 min | Q004, Q008 |
| [09. A flexible, minimal, vendor-neutral forwarding abstraction](09_forwarding_abstraction.md) | ~1 min | Q023 |
| [10. Virtual topologies and physical policy enforcement](10_virtual_topologies.md) | ~2 min | Q013, Q019, Q024, Q025 |
| [11. Moving complexity into reusable platform software](11_reusable_complexity.md) | ~1 min | Q020 |
| [12. OpenFlow matches, actions, counters, and capabilities](12_match_action_tables.md) | ~2 min | Q005, Q007, Q011, Q012, Q022 |
| [13. Configured table misses, Packet-IN, and buffering](13_table_misses.md) | ~1 min | Q021 |
| [14. Packet-OUT, Flow-MOD, and rule lifetimes](14_controller_responses.md) | ~1 min | None supplied |
| [15. A reactive TCP and HTTP exchange](15_reactive_handshake.md) | ~2 min | None supplied |
| [16. Out-of-band and in-band controller reachability](16_control_paths.md) | ~2 min | Q006 |
| [17. The intellectual road to SDN](17_history.md) | ~1 min | None supplied |
| [18. Merchant silicon, cloud demand, and virtualization](18_adoption_drivers.md) | ~2 min | Q017, Q018 |
| [19. Scale, reliability, latency, consistency, and interoperability](19_systems_challenges.md) | ~1 min | Q014, Q015, Q026, Q028, Q029 |
| [20. SDN and OpenFlow recap](20_recap.md) | ~2 min | None supplied |

## Coverage and study dependencies

All **29** native question stems, ordered options, and keys were reviewed. **28** have SDN primary lessons; **one** remains a lecture-coverage gap after checking networking guides 01–06. Q027 asks about behavior after controller failure, but the guide does not teach the relevant switch failure modes. Local forwarding while rules remain valid and a general reliability challenge are partial background, not a complete answer to the preserved key.

**5 wording-review flags** overlap the coverage categories: Q007 (arbitrary header fields), Q015 (legacy OpenFlow support), Q021 (unqualified table-miss outcome), Q027 (failure mode), and Q028 (per-packet phrasing). Mapped teaching can expose a question's defective assumption; a lesson link does not endorse its key. Question text, option order, keys, explanations, and manual tags remain unchanged.

**3 mapped questions require additional lessons:** Q014 needs the NOS state/message-passing explanation, Q015 the forwarding-interface boundary, and Q025 the flow-table representation of physical rules. **26** mapped questions have optional background. Required support appears in Practice and the [review dependency table](review.md#additional-required-lessons); prerequisites describe reading order separately. The gap's dependencies remain unresolved. **7 lessons have no native primary assignment** and remain included.

The conversion does not close earlier TCAM questions: routing Q011 still lacks a trie/TCAM comparison, and Q070 lacks parallel LPM and power-cost teaching. No external question assignments were added. Canonical questions remain in their original quizzes and are counted once.

See the [review queue](review.md), [manifest](manifest.json), and [verification report](verification.md). The future application's persisted manual add/remove tag requirement remains in force.

## Provenance and limits

Baseline: `8ba94d4` (full identity in the manifest). Preparation status: **user-approved on 22 October 2026**. The working tree was clean at the start; the approved Socket API conversion was committed. Remote push state was not independently checked.

The historical production/adoption examples, monetary figures, intellectual-history dates, ONF membership, course suffix, and hidden-slide classification remain source-reported with their qualifications. Source-preservation checks report the documented diagram-format differences; they do not establish pedagogical sufficiency or a readable render. Mermaid CLI and a local browser were unavailable, so no rendering is claimed. No application work, answer-key corrections, commit, or push was performed.
