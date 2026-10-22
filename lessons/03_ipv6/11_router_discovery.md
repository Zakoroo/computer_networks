---
id: ipv6-11
topic_id: 03_ipv6
order: 11
title: "ICMPv6 and router discovery"
source_classification: lecture_guide
estimated_reading_minutes: 2
prerequisite_ids: ["ipv6-05", "ipv6-08"]
---

# 11. ICMPv6 and router discovery

## Learning goals

- Identify RS, RA, NS, and NA as message types.
- Explain solicited versus periodic RAs, source scope, and router lifetime.

**Builds on:** [Local scope, special addresses, and embedded IPv4](05_local_and_embedded_addresses.md), [Router advertisements, SLAAC, and DHCPv6](08_slaac_and_dhcpv6.md).

## Explanation

ICMPv6 carries much more than diagnostic errors. **Neighbor Discovery** includes router discovery, prefix discovery, address resolution, and reachability-related functions. The four messages emphasized here are RS, RA, NS, and NA.

**Technical clarification:** these are message types, not four separate protocols, and they are not the entire ND message set: ND also defines Redirect. DHCPv6 remains a separate UDP-based protocol; IPv6 has not moved every possible configuration task into ICMPv6.

### Router discovery

A newly attached host can form and check an LLA, send an RS to `ff02::2`, and use the returned RA. The example advertisement supplies prefix **`2001:db8:acad:1::/64`** and identifies router **`fe80::1`** as a possible default next hop. The router also has GUA `2001:db8:acad:1::1`.

**Figure clarification:** one source RA illustration labels both PC1 and R1 with `2001:db8:acad:1::1`. That would be a duplicate on the same link. The host example elsewhere is `2001:db8:acad:1::10`, while the router uses `::1`; those distinct roles are used here.

Periodic RAs let passive listeners discover routers; solicited advertisements reduce the initial delay. The source uses **200 seconds** as an illustrative periodic interval. **Technical clarification:** RAs are not universally sent every 200 seconds. Standards use configurable, randomized intervals and rate limits. A response to an RS may also be delayed briefly rather than sent instantaneously.

An RS normally uses a valid LLA, but may use the unspecified source **`::`** if no suitable address is available. The simplified order “LLA, RS, RA, GUA” is useful without being the only permitted bootstrap path. Likewise, an RA source is not automatically a default router if its advertised router lifetime is zero.

## Practice

No native IPv6 quiz questions are assigned. This teaching is retained for study and revision.

Check the [review queue](review.md) before scored practice; flagged questions retain their original keys. The [manifest](manifest.json) separates additional required lessons from optional background.

## Source

- [Lecture: 7. ICMPv6 and Neighbor Discovery](../../lectures/lecture_03_ipv6.md#7-icmpv6-and-neighbor-discovery)

[Topic overview](README.md) · [Glossary](glossary.md) · [References](references.md) · [Previous lesson](10_privacy_identifiers.md) · [Next lesson](12_neighbor_resolution.md)
