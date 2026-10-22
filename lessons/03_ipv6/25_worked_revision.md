---
id: ipv6-25
topic_id: 03_ipv6
order: 25
title: "Worked checks and practical revision"
source_classification: lecture_guide
estimated_reading_minutes: 2
prerequisite_ids: ["ipv6-06", "ipv6-07", "ipv6-09", "ipv6-10", "ipv6-13", "ipv6-15", "ipv6-18", "ipv6-21", "ipv6-24"]
---

# 25. Worked checks and practical revision

## Learning goals

- Connect notation, subnetting, IIDs, ND, and header calculations.
- Inspect configurations while distinguishing observations from assumptions.

**Builds on:** [Subnetting a site allocation](06_subnetting.md), [Static router and host configuration](07_static_configuration.md), [Deriving modified EUI-64 identifiers](09_eui64.md), [Stable and temporary interface identifiers](10_privacy_identifiers.md), [Duplicate detection and ICMPv6 filtering](13_dad_and_filtering.md), [Anycast, DNS selection, and service continuity](15_anycast.md), [Extension-header deployment and SRv6](18_extension_deployment_and_srv6.md), [Dual-stack, IPv6-mostly, and IPv6-only access](21_operating_models.md), [Happy Eyeballs and hidden path failures](24_fallback_and_failures.md).

## Explanation

The following small calculations connect the main mechanisms:

1. **Expand `2001:db8:cafe:1::1`.** Five hextets are explicit, so insert three zero hextets: `2001:0db8:cafe:0001:0000:0000:0000:0001`.
2. **Count `/64`s in `2001:db8:acad::/48`.** There are 16 subnet bits, giving 65,536 subnets. The fourth hextet selects one.
3. **Derive an IID from `fc:99:47:75:ce:e0`.** Insert `ff:fe`, then XOR the first byte with `02`, giving `fe99:47ff:fe75:cee0`.
4. **Resolve `2001:db8:acad:1::10` on Ethernet.** Send NS to `ff02::1:ff00:10` using Ethernet multicast `33:33:ff:00:00:10`; put the unicast address in the NS Target Address field.
5. **Decode the first 6to4 endpoint.** `c000:0204` consists of `c0`, `00`, `02`, `04`, or decimal `192.0.2.4`.
6. **Check the base header.** Two 32-bit field rows plus two 128-bit addresses equal 320 bits, or 40 bytes.

For practical inspection, compare `ipconfig` on Windows or `ip addr` on Linux with the router's `show ipv6 interface brief`. Identify each address's scope, prefix, IID, and role. A shared suffix can be informative without proving the configuration mechanism.

Questions worth being able to explain in your own words:

- Why did CIDR and NAT both alleviate IPv4 exhaustion and reduce pressure to migrate?
- Why can `::` appear only once, and why can trailing zeros not be removed from a hextet?
- Why is a link-local address useful as a default gateway even though routers do not forward link-local traffic off-link?
- Which settings come from RA, which can come from DHCPv6, and what does the A flag control?
- Why is a MAC-derived IID a privacy concern, and how do stable opaque and temporary identifiers differ?
- How do an ordinary NS and a DAD NS differ in their purpose and source address?
- What does MLD establish locally, and what additional work must multicast routing perform?
- Why do multiple DNS A records not demonstrate IP anycast?
- How does translation differ from encapsulation in the packet carried across the network?
- Why can SRv6 be practical inside an operator domain even when some extension headers are unreliable across the public Internet?
- What can a successful Happy Eyeballs connection conceal, and which measurement would expose it?

## Practice

No native IPv6 quiz questions are assigned. This teaching is retained for study and revision.

Check the [review queue](review.md) before scored practice; flagged questions retain their original keys. The [manifest](manifest.json) separates additional required lessons from optional background.

## Source

- [Lecture: 13. Worked checks and revision questions](../../lectures/lecture_03_ipv6.md#13-worked-checks-and-revision-questions)

[Topic overview](README.md) · [Glossary](glossary.md) · [References](references.md) · [Previous lesson](24_fallback_and_failures.md)
