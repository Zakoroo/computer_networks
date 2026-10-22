# IPv6 question review

This queue preserves question text, ordered options, keys, explanations, and tags. Only `lesson_id` and `flags` change in the quiz. Q001–Q030 are one-based quiz-03 positions; stable IDs and fingerprints are in [manifest.json](manifest.json).

## Flag meanings

| Flag | Meaning |
| --- | --- |
| `coverage_gap` | The available networking guides do not teach enough for the question as written. |
| `wording_issue` | The stem or keyed option needs correction, disambiguation, or a technical qualification. |
| `cross_topic` | Another networking topic supplies full or partial support; consult the coverage status before assuming it is sufficient. |

No native question depends on hidden-slide † material; the source reports none. A coverage gap is not an exam-scope decision, and categories/flags can overlap.

## Missing or partial coverage

Searches and section review were confined to lectures 01–06. These included IPv6 configuration/headers/transition mechanisms, routing's best-effort and fragmentation explanations, TCP's logical end-to-end ACK/recovery model, DNS replica distribution, socket addressing, and SDN forwarding and attack filtering. No guide past SDN was used.

| Question | Coverage status | Closest lesson | Evidence and missing explanation |
| --- | --- | --- | --- |
| Q001: Which of the following best explains why NAT alone could not fully solve the IPv4 address exhaustion problem? | Partial elsewhere | [Why IPv6 exists](01_motivation.md) | NAT address sharing and address/transport rewriting are described, and routing teaches the end-to-end principle. The guides do not explain the claimed obstruction of protocol innovation or make the keyed tradeoff a complete answer to exhaustion. |
| Q010: Why does IPv6 mandate support for a 1280-byte MTU, even if the link MTU is smaller? | Not sufficiently covered | [Source fragmentation and modular extension headers](17_fragmentation_and_extensions.md) | The guide teaches source fragmentation and ICMPv6 feedback, but not the 1280-byte minimum link MTU or lower-layer adaptation for smaller frames. |
| Q013: Why might link-layer acknowledgments be insufficient for ensuring delivery in IPv6? | Partial elsewhere | [Source fragmentation and modular extension headers](17_fragmentation_and_extensions.md) | Routing teaches best-effort IP and endpoint recovery; TCP explains reliable transport and ACKs. Neither explains the scope and limitations of hop-by-hop link ACKs sufficiently for this comparison. |
| Q015: What is the primary challenge addressed by the 6LoWPAN adaptation of IPv6? | Not sufficiently covered | [Source fragmentation and modular extension headers](17_fragmentation_and_extensions.md) | No explanation of 6LoWPAN low-power-link adaptation or IPv6 header compression was found. General IPv6 extension headers are not that mechanism. |
| Q016: Which 6LoWPAN header compression mode reduces an IPv6 address to zero bits? | Not sufficiently covered | [Deriving modified EUI-64 identifiers](09_eui64.md) | Modified EUI-64 explains an IID derived from a MAC, but not 6LoWPAN SAM/DAM modes, address elision, or inference from link-layer context. |
| Q020: What is a primary drawback of supporting anycast at the IP layer? | Not sufficiently covered | [Anycast, DNS selection, and service continuity](15_anycast.md) | Anycast operation and ordinary route selection are taught, but not the route-scaling tradeoff asked here. The keyed /32 requirement additionally needs correction rather than extra teaching of that false rule. |
| Q021: How does anycast help reduce the impact of distributed denial-of-service (DDoS) attacks? | Not sufficiently covered | [Anycast, DNS selection, and service continuity](15_anycast.md) | DNS teaches replica/query-load distribution and SDN discusses upstream attack filtering, but neither explains anycast distribution of DDoS traffic or its capacity limits. |
| Q023: Which of the following best summarizes the role of IPv6 in modern networking? | Not sufficiently covered | [Reading the fixed IPv6 base header](16_base_header.md) | Address scalability and header/security mechanisms have support, but the compound keyed summary includes mobility support not taught in the networking guides. Mobile carrier translation is not an explanation of IP mobility. |
| Q028: Why might a "jumbogram" be used in IPv6 networking? | Not sufficiently covered | [Reading the fixed IPv6 base header](16_base_header.md) | The source mentions jumbograms only as a special case outside its basic format. It does not define the greater-than-65535-byte payload use or the required extension mechanism. |

Q001's address-sharing context and routing's end-to-end principle do not supply the asserted protocol-innovation explanation. Q013's endpoint transport explanation does not establish the scope of a link ACK. Neither is marked fully covered merely because relevant terms exist. Q016's MAC-to-IID derivation is not a lesson in 6LoWPAN address elision. Q028's mention of “jumbogram” does not define its payload threshold.

Q020 has two distinct findings: the route-scaling topic is not explained by the guides, and the given /32 requirement is not a correct general IPv6 anycast rule. Correcting its key would still require suitable teaching before scoring it. Q023 similarly has partial support for address/header features but not the whole mobility/security/QoS bundle.

## Wording and answer-key review

| Question | Finding | Evidence |
| --- | --- | --- |
| Q001 | The stem asks why NAT cannot fully solve address exhaustion, but the key gives transparency/innovation costs rather than the finite-space limit. That protocol-innovation claim also needs teaching not supplied by these guides. | [Recorded coverage evidence](manifest.json) |
| Q002 | SLAAC automates address formation; it does not establish end-to-end reachability or remove NAT by itself. None of the options clearly names the intended global-addressing benefit. Review the stem/key relationship. | [Supporting source](../../lectures/lecture_03_ipv6.md#6-dynamic-addressing-and-interface-identifiers) |
| Q004 | The stem does not distinguish invalid syntax from changing the intended address: repeated :: is invalid syntax, while omitting a nonzero group is not a faithful compression even if the result parses. | [Supporting source](https://www.rfc-editor.org/rfc/rfc4291.html#section-2.2) |
| Q006 | MAC-based modified EUI-64 is one IID method, not a requirement of SLAAC. The key should identify SLAAC without implying that all SLAAC addresses derive from a MAC. | [Supporting source](../../lectures/lecture_03_ipv6.md#stable-and-temporary-identifiers) |
| Q010 | The 1280-byte rule is a minimum IPv6 link-MTU capability, not a minimum packet length. Smaller lower-layer frames require adaptation below IPv6; the keyed phrase conflates these ideas. | [Supporting source](https://www.rfc-editor.org/rfc/rfc8200.html#section-5) |
| Q020 | Anycast does not universally require multiple /32 routes per service. IPv6 host routes use /128; route-scale costs depend on allocation, aggregation, and deployment. The key conflates these matters. | [Supporting source](https://www.rfc-editor.org/rfc/rfc4291.html#section-2.6) |
| Q022 | Nearest means preferred by routing policy and metrics, not necessarily the geographically closest regional server. The keyed option needs that qualification. | [Supporting source](../../lectures/lecture_03_ipv6.md#9-anycast-and-routing) |
| Q023 | The key bundles scalability, mobility, security, and QoS. The guide does not teach mobility support; it also explicitly rejects automatic IPv6 security. Header mechanisms are not universal service guarantees. | [Supporting source](../../lectures/lecture_03_ipv6.md#simplification-and-optional-functions) |
| Q030 | Periodic unsolicited RAs are not the only way to learn a SLAAC prefix: solicited RAs also work. Initial link-local autoconfiguration needs no RA, and a GUA needs suitable autonomous prefix information. | [Supporting source](https://www.rfc-editor.org/rfc/rfc4862.html#section-5.5.1) |

**Supplementary standards context for this review only:** RFC 8200 §5 distinguishes minimum link-MTU capability from packet length and describes adaptation below IPv6. RFC 4291 §§2.2/2.6 distinguish zero compression and anycast addressing/routing. RFC 4862 §§5.3/5.5 distinguishes link-local generation from advertised-prefix configuration and permits solicited RAs. These targeted checks explain the review findings; they do not retroactively provide lecture coverage or authenticate every reference in the source guide.

Q002 stays linked to the SLAAC lesson so the actual mechanism can be studied, but no option clearly states the claimed reachability benefit. Q004's repeated `::` option is the syntactically invalid one; its nonzero-omission option creates ambiguity about whether preserving the original value is part of the question. Keep both in the review queue before scored practice. “Nearest” in Q005/Q019/Q022 means routing preference, not a geographical guarantee; Q022's regional wording needs an explicit qualification.

## Additional required lessons

| Source question | Primary lesson | Additional required lesson | Why |
| --- | --- | --- | --- |
| IPv6 Q004 | [IPv6 03](03_notation_and_prefixes.md) | [IPv6 05](05_local_and_embedded_addresses.md) | The compression rules identify repeated `::`; the embedded IPv4 examples establish that mixed decimal/hexadecimal forms can be valid. |
| IPv6 Q012 | [Routing 03](../01_routing/03_fragmentation_and_pmtu.md) | [IPv6 17](17_fragmentation_and_extensions.md) | Combine the generic all-fragments reassembly requirement with IPv6 source-only fragmentation. No numerical calculation using the 10% loss figure is requested. |
| IPv6 Q024 | [IPv6 01](01_motivation.md) | [IPv6 19](19_tunnelling.md) | NAT delaying migration and IPv4/IPv6 compatibility are separate parts of the keyed explanation. This does not establish a measured ranking of adoption causes. |
| Routing Q014 | [IPv6 01](01_motivation.md) | [Routing 01](../01_routing/01_internet_architecture.md) | Combine NAT address/transport rewriting with the end-to-end principle. |
| Routing Q085 | [IPv6 19](19_tunnelling.md) | [IPv6 18](18_extension_deployment_and_srv6.md) | Encapsulation/virtual-link abstraction and the policy-steering example together support the tradeoff. SRv6 illustrates steering; it is not a claim that all overlays use SRv6. |
| Routing Q086 | [IPv6 15](15_anycast.md) | None | The source directly explains route changes moving traffic between stateful service instances. |

Other mapped native questions have no additional required lesson beyond their primary lesson for the supported concept; optional background is recorded separately. Question validity remains independent. Gap entries have unresolved dependency classification.

Routing Q013 remains unmapped: the NAT definition and address sharing still do not explain inbound mapping limitations. Existing cross-topic flags and coverage categories remain in the original routing records.

[Topic overview](README.md) · [Full evidence and assignments](manifest.json)
