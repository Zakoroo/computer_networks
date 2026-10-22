# 01. Internet routing

Read one lesson, then answer its assigned questions. Reading-time estimates exclude quiz time. Lessons 13 and 14 retain the guide's † supplementary classification; lesson 07 marks only its telephone-circuit subsection as supplementary.

This topic restructures the existing [lecture guide](../../lectures/lecture_01_internet_routing.md). It preserves every teaching section, including subjects without quiz questions. Original lecture files are unchanged. Short editorial clarifications and worked reasoning are labelled inside the lessons; no new extension lesson has been created to fill an unsupported question.

## Lessons

| Lesson | Learning focus | Reading estimate | Assigned questions | Source classification |
| --- | --- | --- | --- | --- |
| [01. IP and Internet architecture](01_internet_architecture.md) | Explain the common IP layer and encapsulation. | ~3 min | Q001 | Unmarked in guide |
| [02. Reading an IPv4 header](02_ipv4_header.md) | Identify the roles of TTL, Protocol, checksum, and fragmentation fields. | ~2 min | Q002, Q050, Q051 | Unmarked in guide |
| [03. Fragmentation and path MTU](03_fragmentation_and_pmtu.md) | Calculate fragment offsets and explain destination reassembly. | ~2 min | Q083, Q100 | Unmarked in guide |
| [04. IPv4 addresses, prefixes, and ARP](04_addressing_and_arp.md) | Distinguish an IP destination from the MAC address of the local next hop. | ~2 min | Q003, Q064, Q093 | Unmarked in guide |
| [05. ICMP, ping, and traceroute](05_icmp_and_diagnostics.md) | Explain ICMP errors and the TTL mechanism used by traceroute. | ~2 min | Q034 | Unmarked in guide |
| [06. Getting configuration with DHCP](06_dhcp.md) | Follow the Discover, Offer, Request, Acknowledge exchange. | ~2 min | None supplied | Unmarked in guide |
| [07. Routing, forwarding, and switching models](07_forwarding_and_switching.md) | Separate control-plane route computation from data-plane forwarding. | ~3 min | Q004, Q033, Q040, Q065 | Mixed: telephone subsection † |
| [08. CIDR, aggregation, and longest-prefix matching](08_cidr_and_aggregation.md) | Explain subnetting and aggregation using variable-length prefixes. | ~2 min | Q006, Q010, Q061 | Unmarked in guide |
| [09. Autonomous systems and routing domains](09_autonomous_systems.md) | Distinguish stub, multihomed, and transit ASes. | ~2 min | None supplied | Unmarked in guide |
| [10. Link-state routing and shortest paths](10_link_state.md) | Explain how flooding produces a topology database. | ~3 min | Q009, Q017 | Unmarked in guide |
| [11. Distance-vector routing and Bellman–Ford](11_distance_vector.md) | Calculate a route from neighbors' advertised distances. | ~2 min | Q008, Q042 | Unmarked in guide |
| [12. Routing loops and poison reverse](12_routing_loops.md) | Explain count-to-infinity after a route failure. | ~2 min | Q007, Q016, Q091 | Unmarked in guide |
| [13. RIP and RIPv2](13_rip.md) | Interpret RIP's hop-count metric and bounded infinity. | ~2 min | None supplied | Supplementary † |
| [14. OSPF areas and protocol operation](14_ospf.md) | Explain the backbone, local areas, and area border routers. | ~3 min | Q018, Q019, Q041, Q057 | Supplementary † |
| [15. Why BGP uses paths and policy](15_bgp_path_vector.md) | Explain why Internet routing crosses independent policy boundaries. | ~2 min | Q020, Q021, Q045, Q046, Q082, Q089, Q092, Q099 | Unmarked in guide |
| [16. BGP messages, routing state, and next hops](16_bgp_messages_and_state.md) | Trace an advertisement through BGP's conceptual routing state. | ~2 min | Q022, Q058, Q088 | Unmarked in guide |
| [17. BGP route selection and internal sessions](17_bgp_route_selection.md) | Compare weight, LOCAL_PREF, AS_PATH, MED, and IGP cost. | ~2 min | Q023, Q059 | Unmarked in guide |
| [18. Business relationships and export policy](18_bgp_export_policy.md) | Apply customer, provider, and peer export rules. | ~3 min | Q024, Q025, Q026, Q027, Q044, Q063, Q072, Q073, Q079, Q080, Q094 | Unmarked in guide |
| [19. BGP hijacks and route leaks](19_bgp_hijacks_and_leaks.md) | Distinguish unauthorized origination from an inappropriate route export. | ~2 min | Q031, Q043 | Unmarked in guide |
| [20. RPKI and route origin validation](20_rpki.md) | Classify origins as Valid, Invalid, or NotFound using a ROA. | ~3 min | Q032 | Unmarked in guide |
| [21. ASPA and partial deployment](21_aspa.md) | Contrast provider authorization with origin authorization. | ~2 min | None supplied | Unmarked in guide |
| [22. Convergence, failures, and stability](22_convergence.md) | Explain how updates and independent policies affect convergence. | ~2 min | Q015, Q038, Q039, Q071, Q098 | Unmarked in guide |
| [23. BGP wedgies: stable but unwanted routes](23_bgp_wedgies.md) | Distinguish oscillation from multiple stable routing outcomes. | ~2 min | None supplied | Unmarked in guide |

## Practice and coverage

All 100 source questions are accounted for, without moving or deleting any:

- **60** linked to a routing lesson.
- **6** supported in another topic; waiting for that topic's lessons.
- **5** partly addressed in another topic; the missing reasoning still needs review.
- **29** not sufficiently explained in the available lecture guides.

A question being in quiz 01 does not establish that it belongs to routing. Cross-topic findings point to exact sections of other lectures. Mentioning a term, or finding the same unanswered review question, does not establish answer coverage. Questions awaiting a suitable lesson keep an empty `lesson_id`; no future lesson IDs have been invented.

Use [review.md](review.md) for the review queue, [manifest.json](manifest.json) for IDs and evidence, and the [glossary](glossary.md) for terminology. `wording_issue` questions retain their original keys but should be reviewed before scored practice. Tags remain available for manual editing while studying.

## Provenance and limits

The input is the Markdown guide at commit `192e7eac3ea9889afb259a0199e0a0638e1aee29`, not a fresh inspection of its original PowerPoint. Its † labels, historical examples, dated deployment claims, and explicit uncertainties have been retained. “Not found” means insufficient support in the 11 guides currently available, not “outside the course” or “not examinable.”

The RPKI and ASPA lessons retain source-reported historical percentages with the original warning that they were not independently verified; they are not current measurements.

### Source revision notes and references

This revision preserves the supplied guide's scope and † classifications. It corrects the noncanonical /14 example, distinguishes iBGP from eBGP AS-path handling, separates local weight from advertised attributes, and qualifies flooding complexity and deployment statistics. Original slide visibility and the missing details of the wedgie example could not be independently reconstructed from this Markdown file.

- [RFC 4271 — BGP-4](https://www.rfc-editor.org/rfc/rfc4271): route advertisements and path attributes.
- [RFC 792 — ICMP](https://www.rfc-editor.org/rfc/rfc792): error and diagnostic messages.
- [RFC 4264 — BGP Wedgies](https://www.rfc-editor.org/rfc/rfc4264): persistent policy-driven states.
