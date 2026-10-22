# Routing question review

This is a review queue, not a replacement answer key. Original question wording, option order, correct-answer indices, explanations, and tags are preserved. Only `lesson_id` and `flags` were populated in the quiz file. Q001–Q100 are one-based positions in that file; the manifest contains stable local IDs and fingerprints.

## Meaning of flags

| Flag | Meaning |
| --- | --- |
| `cross_topic` | Another lecture is a more suitable target, or provides partial evidence that needs follow-up. See status and rationale before assuming full coverage. |
| `coverage_gap` | The available guides do not teach enough to answer the question as written. This is not an exam-scope decision. |
| `supplementary_source` | Required support includes a section marked † in the supplied guide. |
| `wording_issue` | The stem or keyed option omits a requested part, overstates a guarantee, or needs a technical qualification. The original key is unchanged. |

## Cross-topic assignments

IPv6 conversion follow-up: Q014 now has primary `ipv6-01` with required `routing-01`; Q085 has primary `ipv6-19` with required `ipv6-18`; Q086 has primary `ipv6-15` with no additional required lesson. Q013 stays unmapped because inbound-NAT behavior is not explained. Their original coverage categories and flags are unchanged. IPv6 Q012 is separately referenced as external practice in routing lesson 03, with required IPv6 lesson 17; it remains canonical in the IPv6 manifest.

DNS conversion follow-up: Q036 has primary `lesson_id: dns-18`; Q037 has primary `dns-08` and additional required `dns-18`. The table below retains the original source evidence; these questions and the three IPv6 assignments above no longer await lesson creation. The original audit checked the then-available guides; subsequent networking coverage work is limited to lectures 01–06 by user instruction.

| Question | Target | Coverage | Evidence and remaining issue |
| --- | --- | --- | --- |
| Q011: Which of the following is a key tradeoff when choosing trie-based forwarding tables over TCAMs? | [06_sdn](../../lectures/lecture_06_sdn.md#glossary) | Partial only | SDN introduces TCAM matching and capacity, but does not compare tries with TCAM lookup speed or power. A mention of TCAM does not establish full coverage. |
| Q013: Which of the following is a tradeoff introduced by Network Address Translation (NAT) in IPv4 networks? | [03_ipv6](../../lectures/lecture_03_ipv6.md#glossary) | Partial only | IPv6 explains address sharing and defines NAT, but does not explain inbound mappings or the inbound-connectivity limitation asked here. |
| Q014: Why is Network Address Translation (NAT) said to violate the end-to-end principle? | [03_ipv6](../../lectures/lecture_03_ipv6.md#glossary) | Supported elsewhere | The NAT definition covers address/transport-identifier rewriting; combine it with routing lesson 01's end-to-end principle. This is a cross-topic synthesis, not absent course coverage. |
| Q036: Why is IP anycast particularly suitable for services like DNS root servers? | [03_ipv6](../../lectures/lecture_03_ipv6.md#9-anycast-and-routing) | Supported elsewhere | IPv6 explains one shared service address, route-selected instances, and DNS root use. DNS lecture 02 also explains the same mechanism. |
| Q037: What is a challenge introduced by using IP anycast for DNS service deployment? | [02_dns](../../lectures/lecture_02_dns.md#5-replication-soa-and-caching) | Supported elsewhere | DNS explains replica refresh delays and route-selected anycast instances. Their combination supports potentially different answers during a replica-update interval; inconsistency is not inherent to anycast. |
| Q047: How does TCP handle sequence number wraparound after long connections? | [04_tcp-ip](../../lectures/lecture_04_tcp-ip.md#23-tcp-byte-stream-sliding-window) | Partial only | The TCP lecture explicitly asks the wraparound question in supplementary review material but does not explain modulo sequence-number comparisons. Finding the same question is not finding its answer. |
| Q048: Under what conditions does TCP unnecessarily retransmit data, and how can this be mitigated? | [04_tcp-ip](../../lectures/lecture_04_tcp-ip.md#34-fast-retransmit-and-fast-recovery-tcp-reno) | Partial only | TCP explains duplicate ACKs caused by out-of-order data and the duplicate-ACK threshold. The quiz instead says acknowledgments are reordered and asks for a mitigation that no option supplies; that wording needs review. |
| Q049: What are the consequences of accepting only in-order TCP segments, and how does it differ from standard TCP behavior? | [04_tcp-ip](../../lectures/lecture_04_tcp-ip.md#34-fast-retransmit-and-fast-recovery-tcp-reno) | Supported elsewhere | The unmarked Reno explanation explicitly describes out-of-order segments buffered at the receiver. The supplementary review question also poses this exact comparison; the answer is supported by the unmarked explanation. |
| Q070: Why is TCAM commonly used for longest prefix match (LPM) in IP forwarding, and what is a key limitation? | [06_sdn](../../lectures/lecture_06_sdn.md#glossary) | Partial only | SDN covers ternary matching and finite table capacity, but does not explain longest-prefix TCAM implementation or its power cost. |
| Q085: What is a key tradeoff in using tunneling and overlay routing? | [03_ipv6](../../lectures/lecture_03_ipv6.md#11-coexistence-and-transition-mechanisms) | Supported elsewhere | IPv6 shows the added outer header, tunnel-as-virtual-link abstraction, and packet steering. Together these support encapsulation overhead and reduced visibility into the underlying path. |
| Q086: What is a challenge associated with using anycast for load balancing? | [03_ipv6](../../lectures/lecture_03_ipv6.md#9-anycast-and-routing) | Supported elsewhere | IPv6 explicitly explains that route changes can move packets between instances and that long-lived stateful services must handle this. |

## Questions still lacking sufficient support

Partial cross-topic cases above also carry `coverage_gap`. The following additional questions remain unresolved after checking the other available topics.

| Question | Closest routing lesson | Missing explanation |
| --- | --- | --- |
| Q005: Which switching fabric architecture offers the highest aggregate throughput potential but becomes costly with increased port counts? | [Routing, forwarding, and switching models](07_forwarding_and_switching.md) | Router switching fabrics, port-count scaling, and crossbar throughput are not explained in the available guides. |
| Q012: How does the choice of switching technique affect end-to-end delay in high-speed routers? | [Routing, forwarding, and switching models](07_forwarding_and_switching.md) | The switching-model lesson compares datagrams and virtual circuits, not crossbar contention, buffering, or load-dependent delay. |
| Q028: What causes path exploration to slow down BGP convergence after a link failure? | [Convergence, failures, and stability](22_convergence.md) | The routing guide discusses convergence but does not teach the path-exploration sequence of stale BGP alternatives. |
| Q029: Why does iBGP require a full mesh or route reflectors to function correctly? | [BGP route selection and internal sessions](17_bgp_route_selection.md) | The guide mentions route reflectors, but does not explain the ordinary iBGP re-advertisement restriction or why a full mesh is needed. |
| Q030: What is a tradeoff introduced by using route reflectors in iBGP to reduce full mesh requirements? | [BGP route selection and internal sessions](17_bgp_route_selection.md) | The guide mentions route reflectors for scale, but not path hiding or the associated suboptimal-path trade-off. |
| Q035: What is a potential limitation of using Equal-Cost Multi-Path (ECMP) routing based on flow hashing? | [Routing, forwarding, and switching models](07_forwarding_and_switching.md) | No available guide explains ECMP flow hashing or collisions that create unequal load. |
| Q052: What role does the fragment offset field play in IP reassembly, and how can overlapping fragments be exploited? | [Fragmentation and path MTU](03_fragmentation_and_pmtu.md) | Fragment offsets are taught, but overlapping-fragment security attacks are not. |
| Q053: Why might allowing all ICMP message types through a firewall pose security or stability risks? | [ICMP, ping, and traceroute](05_icmp_and_diagnostics.md) | ICMP diagnostics and filtering are taught, but topology disclosure and ICMP denial-of-service mechanisms are not. |
| Q054: How can ICMP Redirect messages introduce security or stability issues in a network? | [ICMP, ping, and traceroute](05_icmp_and_diagnostics.md) | Redirect is named as a better-next-hop message, but malicious Redirect acceptance and routing-table manipulation are not explained. |
| Q055: What happens when a NAT device using port overloading exhausts its available port space? | [IPv4 addresses, prefixes, and ARP](04_addressing_and_arp.md) | IPv6 mentions NAT address sharing, but none of the available guides explains port-overloading exhaustion or collision handling. |
| Q056: Which technique enables two peers behind NATs to establish direct connectivity, and what is a key limitation? | [IPv4 addresses, prefixes, and ARP](04_addressing_and_arp.md) | NAT is mentioned in IPv6, but STUN, hole punching, and mapping-dependent traversal limitations are not explained. |
| Q060: What advantage does the BGP Community attribute provide, and what is one associated risk? | [BGP messages, routing state, and next hops](16_bgp_messages_and_state.md) | Communities are named as policy attributes, but the guide does not explain community propagation or unintended-policy risks. |
| Q062: What failure mode can occur from overly aggressive prefix aggregation in BGP? | [CIDR, aggregation, and longest-prefix matching](08_cidr_and_aggregation.md) | Aggregation and longest-prefix matching are taught, but routing holes and safe handling of unreachable subprefixes are not explained. |
| Q066: What problem arises from head-of-line blocking in input-buffered routers? | [Routing, forwarding, and switching models](07_forwarding_and_switching.md) | No available guide explains input-buffer head-of-line blocking. Transport stream head-of-line blocking is a different mechanism. |
| Q067: Why does a shared bus architecture limit throughput in high-speed routers? | [Routing, forwarding, and switching models](07_forwarding_and_switching.md) | No available guide explains shared-bus router fabrics or their serialized internal data path. |
| Q068: What is a major challenge in using crossbar switch fabric in routers? | [Routing, forwarding, and switching models](07_forwarding_and_switching.md) | No available guide explains crossbar scheduling or simultaneous output-port conflicts. |
| Q069: How do multistage interconnection networks like Clos improve router scalability? | [Routing, forwarding, and switching models](07_forwarding_and_switching.md) | No available guide explains multistage Clos fabrics or their internal path parallelism. |
| Q074: What is the tradeoff involved in applying route flap damping in BGP? | [Convergence, failures, and stability](22_convergence.md) | The available guides discuss route changes and stability but do not explain route-flap damping or its suppression penalties. |
| Q075: How does OSPF support fast reroute when a primary link fails? | [OSPF areas and protocol operation](14_ospf.md) | The OSPF section covers ordinary shortest-path recomputation, not optional fast-reroute mechanisms or loop-free alternates. |
| Q076: Why does iBGP require a full mesh of sessions in a simple deployment? | [BGP route selection and internal sessions](17_bgp_route_selection.md) | The iBGP dissemination purpose is taught, but the non-reflection rule that motivates full-mesh sessions is not explained. |
| Q077: How can differences in successive traceroute outputs suggest path instability? | [ICMP, ping, and traceroute](05_icmp_and_diagnostics.md) | Traceroute and missing replies are explained, but load-balanced probe paths versus route flapping are not distinguished. |
| Q078: Why is it recommended to establish iBGP sessions using loopback addresses? | [BGP route selection and internal sessions](17_bgp_route_selection.md) | The routing guide does not explain loopback-address iBGP sessions and IGP reachability after a physical interface fails. |
| Q081: How do design goals differ between edge routers and core routers? | [Routing, forwarding, and switching models](07_forwarding_and_switching.md) | The available guides do not compare edge-router interface diversity with core-router forwarding design goals. |
| Q084: Why do modern routers apply rate-limiting to ICMP messages? | [ICMP, ping, and traceroute](05_icmp_and_diagnostics.md) | ICMP rate limiting is mentioned as a cause of missing replies, but its resource-protection rationale is not taught. |
| Q087: Which routing technique allows an AS to influence how incoming traffic enters its network in a multihomed setup? | [Business relationships and export policy](18_bgp_export_policy.md) | The guide describes specific prefixes and multihoming separately, but not selective upstream advertisements for inbound traffic engineering. |
| Q090: What challenge can arise when routers obtain IP configuration dynamically in large networks? | [Getting configuration with DHCP](06_dhcp.md) | The guide permits multiple DHCP servers but does not explain coordination of their allocation pools or overlapping assignments. |
| Q095: What is a key benefit of Internet Exchange Points (IXPs) in global Internet architecture? | [Business relationships and export policy](18_bgp_export_policy.md) | Peering points are mentioned, but IXP shared interconnection and the latency/transit-cost benefits are not explained. |
| Q096: What is a tradeoff of using distributed route computation in interdomain routing? | [Why BGP uses paths and policy](15_bgp_path_vector.md) | Decentralized policies and limited global control are taught, but the claimed fault-isolation benefit is not established. |
| Q097: What risk arises from excessive growth of routing table entries in core routers? | [CIDR, aggregation, and longest-prefix matching](08_cidr_and_aggregation.md) | Aggregation addresses route scale, but the guides do not explain RIB/FIB resource exhaustion or implementation-dependent forwarding on lookup failure. |

## Wording and answer-key review

These are proposed review findings. Some keyed options remain the best available choice, but the qualification matters for learning.

| Question | Finding | Verification where needed |
| --- | --- | --- |
| Q012 | Crossbar delay depends on workload, scheduling, and buffering. Architecture alone does not guarantee lower end-to-end delay. | Compare source sections and reasoning listed in manifest |
| Q015 | Fast local recovery is useful, but an intra-AS failure can affect BGP next-hop reachability and can require BGP updates. "Without notifying BGP" is too absolute. | Compare source sections and reasoning listed in manifest |
| Q017 | Frequent failures alone do not guarantee that every link-state implementation outperforms every distance-vector implementation; topology and timers matter. | Compare source sections and reasoning listed in manifest |
| Q023 | The stem asks about LOCAL_PREF and AS_PATH, but the keyed option explains only LOCAL_PREF. It omits AS_PATH and their ordering. | Compare source sections and reasoning listed in manifest |
| Q025 | Peers normally carry traffic to one another's customers. The restriction is on unpaid third-party transit, not all traffic for one another. | Compare source sections and reasoning listed in manifest |
| Q048 | The explanation in the TCP lecture concerns reordering of data segments. The keyed option names reordered ACKs, and no option answers the requested mitigation. | Compare source sections and reasoning listed in manifest |
| Q050 | A too-small or too-large initial TTL differs from a router failing to decrement TTL. Indefinite circulation requires broken decrement behavior, not merely a high legal initial TTL. | Compare source sections and reasoning listed in manifest |
| Q055 | The key combines refusal of new connections with potentially unsafe port reuse. Clarify the assumed NAT mapping and exhaustion behavior instead of treating collisions as a required outcome. | Compare source sections and reasoning listed in manifest |
| Q056 | STUN discovers a mapped address and supports connectivity checks; it is a component of a traversal solution, not a guarantee of direct connectivity. The blanket symmetric-NAT wording needs qualification. | [RFC 8489](https://www.rfc-editor.org/rfc/rfc8489.html#section-1) |
| Q057 | ABRs originate inter-area summary reachability and bound area topology scope. "Aggregate LSAs" is a loose description; arbitrary received LSAs are not simply merged and forwarded. | [RFC 2328](https://www.rfc-editor.org/rfc/rfc2328.html#section-3) |
| Q059 | The keyed option omits the requested conflict. MED can be learned over eBGP and compared inside the receiving AS; LOCAL_PREF normally outranks it. | [RFC 4271](https://www.rfc-editor.org/rfc/rfc4271.html#section-5.1.4), [RFC 4271](https://www.rfc-editor.org/rfc/rfc4271.html#section-5.1.5) |
| Q075 | Loop-free alternates are an optional IP fast-reroute mechanism usable with OSPF, not a universal basic OSPF guarantee. Suitable alternate coverage depends on topology; full path disjointness is not always required. | [RFC 5286](https://www.rfc-editor.org/rfc/rfc5286.html) |
| Q084 | ICMP rate limiting protects bandwidth and router processing resources more generally. Reflection-based attacks are one example, not the complete rationale. | [RFC 1812](https://www.rfc-editor.org/rfc/rfc1812.html#section-4.3.2.8) |
| Q091 | Dropping an ICMP Time Exceeded reply hides feedback; it does not stop TTL decrement or the discard of that expired packet. Inconsistent tables can keep looping newly arriving traffic. | [RFC 1812](https://www.rfc-editor.org/rfc/rfc1812.html#section-5.3.1) |
| Q096 | "Fault isolation" is ambiguous: independent domains can limit control authority, but erroneous advertisements can still spread across domains. The claimed trade-off needs a stated fault model. | Compare source sections and reasoning listed in manifest |
| Q100 | IP itself does not retransmit lost fragments. Reassembly fails; a higher layer may retransmit data, potentially causing another complete IP datagram to be sent. | Compare source sections and reasoning listed in manifest |

## Supplementary source dependencies

Q018, Q019, Q041, Q057, Q089 require OSPF material marked † by the routing guide. General link-state and distance-vector lessons remain unmarked. TCP Q049 can be supported by the unmarked Reno explanation even though a similar review question also appears in a † subsection.

[Topic overview](README.md) · [Full evidence and assignments](manifest.json)
