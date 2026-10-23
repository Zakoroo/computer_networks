# 03. IPv6, multicast, and anycast

Read one lesson, then answer its assigned questions from [quiz 03](../../quizzes/quiz_03_ipv6.json). Q001–Q030 refer to that quiz. “Routing Q…” refers to quiz 01. Reading estimates exclude practice.

The full [source guide](../../lectures/lecture_03_ipv6.md) is preserved across these lessons, the [glossary](glossary.md), and [references](references.md), including content with no quiz questions. The supplied guide reports no hidden slides: no lesson inherits a † classification. Visible self-study material and the source's additional resource links remain included.

## Lessons

| Lesson | Reading estimate | Assigned native/external questions |
| --- | --- | --- |
| [01. Why IPv6 exists](01_motivation.md) | ~3 min | Q014, Q024; Routing Q014 |
| [02. Regional allocation and depletion](02_regional_allocation.md) | ~2 min | None supplied |
| [03. IPv6 notation, compression, and prefixes](03_notation_and_prefixes.md) | ~2 min | Q004, Q029 |
| [04. Delivery types and global unicast structure](04_address_types.md) | ~2 min | Q003 |
| [05. Local scope, special addresses, and embedded IPv4](05_local_and_embedded_addresses.md) | ~3 min | None supplied |
| [06. Subnetting a site allocation](06_subnetting.md) | ~2 min | None supplied |
| [07. Static router and host configuration](07_static_configuration.md) | ~2 min | None supplied |
| [08. Router advertisements, SLAAC, and DHCPv6](08_slaac_and_dhcpv6.md) | ~3 min | Q002, Q006, Q030 |
| [09. Deriving modified EUI-64 identifiers](09_eui64.md) | ~2 min | None supplied |
| [10. Stable and temporary interface identifiers](10_privacy_identifiers.md) | ~2 min | None supplied |
| [11. ICMPv6 and router discovery](11_router_discovery.md) | ~2 min | None supplied |
| [12. Solicited-node multicast and address resolution](12_neighbor_resolution.md) | ~2 min | None supplied |
| [13. Duplicate detection and ICMPv6 filtering](13_dad_and_filtering.md) | ~2 min | None supplied |
| [14. Multicast replication, membership, and scope](14_multicast.md) | ~2 min | Q017, Q018 |
| [15. Anycast, DNS selection, and service continuity](15_anycast.md) | ~3 min | Q005, Q019, Q022; Routing Q086 |
| [16. Reading the fixed IPv6 base header](16_base_header.md) | ~2 min | Q026 |
| [17. Source fragmentation and modular extension headers](17_fragmentation_and_extensions.md) | ~2 min | Q009, Q011, Q027 |
| [18. Extension-header deployment and SRv6](18_extension_deployment_and_srv6.md) | ~2 min | None supplied |
| [19. Coexistence, encapsulation, and historical 6to4](19_tunnelling.md) | ~2 min | Q007, Q008, Q025; Routing Q085 |
| [20. NAT64, DNS64, and 464XLAT](20_nat64_and_464xlat.md) | ~2 min | None supplied |
| [21. Dual-stack, IPv6-mostly, and IPv6-only access](21_operating_models.md) | ~2 min | None supplied |
| [22. Interpreting IPv6 adoption measurements](22_adoption_measurements.md) | ~2 min | None supplied |
| [23. Testing economic explanations for deployment](23_deployment_economics.md) | ~2 min | None supplied |
| [24. Happy Eyeballs and hidden path failures](24_fallback_and_failures.md) | ~2 min | None supplied |
| [25. Worked checks and practical revision](25_worked_revision.md) | ~2 min | None supplied |

## Coverage and practice

All 30 source questions are retained:

- **20** link to IPv6 lessons.
- **1**, Q012, links to [routing lesson 03](../01_routing/03_fragmentation_and_pmtu.md) and additionally requires [IPv6 lesson 17](17_fragmentation_and_extensions.md).
- **2**, Q001 and Q013, have partial support in other networking topics but still lack sufficient explanation and remain unmapped.
- **7**, Q010, Q015, Q016, Q020, Q021, Q023, and Q028, lack sufficient coverage in the available networking guides and remain unmapped.
- **9** have wording issues: Q001, Q002, Q004, Q006, Q010, Q020, Q022, Q023, and Q030. These overlap with coverage gaps. Original keys are unchanged.

Required supporting lessons and optional context are explicit for mapped questions. Q004 requires lesson 05 to evaluate the mixed-notation option, Q024 requires lesson 19 in addition to its primary lesson 01, and Q012 combines routing's fragment-reassembly explanation with IPv6's source-only fragmentation rule. Gap entries leave dependency classification unresolved rather than claiming that no extra teaching is needed. Lesson prerequisites describe a study sequence, not automatic question-completion gates.

A mapped wording-issue question is a review item, not necessarily a valid scored question. In particular, Q002 does not supply a clear end-to-end-connectivity answer, and Q004 mixes syntax with faithful compression. Q020 also needs a correction of its key; adding teaching of a false /32 rule would not close its genuine route-scaling coverage gap. See [review.md](review.md) and [manifest.json](manifest.json) for evidence and reasoning.

## Cross-topic follow-up

Routing Q014 now uses lesson 01 with required [routing lesson 01](../01_routing/01_internet_architecture.md); Q085 uses lesson 19 with required lesson 18; Q086 uses lesson 15 alone. Those questions stay canonical in the routing manifest and are referenced here as external assignments. Routing Q013 remains a partial-support gap and is not silently assigned.

IPv6 Q012 is canonical in this topic despite using routing as its primary lesson. It is listed in the routing lesson's external Practice section and destination manifest. Do not count it twice.

## Provenance and limits

Source commit: `ee91644287a55400038acf5c4ce63ad051c2a522`. Cross-topic searches for this conversion stop at lecture 06 (SDN); later lectures belong to algorithms. The input is the Markdown guide, not a new audit of the original PowerPoint. See [verification.md](verification.md) for checks and limits.

No extension lessons were added to fill unsupported quiz questions. Short editorial clarifications reuse the guide's NAT glossary and distinguish SLAAC configuration from reachability. Supplementary standards checks appear in the review queue to explain defects; they do not count as lecture coverage. Dated adoption, registry, and economic statements retain their original qualifications and are not new measurements or current deployment advice.

The source metadata and cautions below are retained verbatim:

**Computer Networks — EDA387/DIT663**  
**Generated:** 2026-10-20

**† Supplementary material:** Content originating exclusively from hidden PowerPoint slides. It may not be included in this year's examinable material. **This presentation has no hidden slides**, so no topic below carries this marker. Visible material labelled “self-study” remains included without a dagger.

Examples preserve the lecture's addresses and configurations. **Technical clarification** notes identify source contradictions or necessary standards context. Historical measurements and projections are labelled with their scope rather than presented as current universal facts.

[All topics](../README.md)

## Answer explanations

On 22 October 2026, all **21 linked questions** in [the canonical quiz](../../quizzes/quiz_03_ipv6.json) received authored explanations grounded in their actual primary/supporting lessons. The **5 linked questions with wording flags** have specific review notes; the keys were preserved rather than silently corrected or falsely justified. The **9 unlinked questions** remain outside the pass and retain empty explanations.

Explanations are Markdown stored in the existing quiz field, with source links relative to that quiz file. They explain the mechanism and useful misconceptions, not just the keyed option. Cross-topic questions stay in their original quiz. Additional explicit required lessons are cited; legacy related-reading classification is still unresolved where previously absent.

The explanations have been checked against the teaching and are **reviewed, awaiting user approval** (`explanation_status: reviewed`). The existing `preparation_status: approved` records the unchanged lesson-conversion approval; it does not approve this new answer text. See [verification](verification.md#answer-explanation-pass-22-october-2026).
