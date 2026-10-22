---
id: ipv6-13
topic_id: 03_ipv6
order: 13
title: "Duplicate detection and ICMPv6 filtering"
source_classification: lecture_guide
estimated_reading_minutes: 2
prerequisite_ids: ["ipv6-12"]
---

# 13. Duplicate detection and ICMPv6 filtering

## Learning goals

- Trace DAD and explain what silence can and cannot establish.
- Explain why blocking all ICMPv6 breaks essential control functions.

**Builds on:** [Solicited-node multicast and address resolution](12_neighbor_resolution.md).

## Explanation

DAD asks whether an intended unicast address is already in use on the link:

1. Treat the proposed GUA or LLA as **tentative**.
2. Send an NS whose **Target Address is that tentative address**, normally to its solicited-node group.
3. During DAD, use **`::` as the IPv6 source**, since the tentative address is not yet available for normal use.
4. An existing owner can reply with an NA, indicating a conflict. Competing DAD solicitations can also reveal a duplicate.
5. If no conflict is detected over the required checks, the address can become usable.

DAD reuses Neighbor Discovery rather than requiring a separate query protocol. Even a low collision probability is not zero, and manual configuration can also create duplicates.

**Technical clarification:** silence supports an operational assumption of uniqueness; it is not mathematical proof. Packet loss, sleeping devices, or filtering can prevent a conflict from being observed.

### Why indiscriminate ICMPv6 filtering breaks IPv6

RAs and neighbour discovery are essential control traffic. MLD also uses ICMPv6, and error messages support functions such as path-MTU discovery. Blocking all ICMPv6 can therefore break addressing or packet delivery, not just `ping` diagnostics. Filtering must distinguish message types, scope, and role rather than treating the protocol as optional noise.

## Practice

No native IPv6 quiz questions are assigned. This teaching is retained for study and revision.

Check the [review queue](review.md) before scored practice; flagged questions retain their original keys. The [manifest](manifest.json) separates additional required lessons from optional background.

## Source

- [Lecture: 7. ICMPv6 and Neighbor Discovery](../../lectures/lecture_03_ipv6.md#7-icmpv6-and-neighbor-discovery)

[Topic overview](README.md) · [Glossary](glossary.md) · [References](references.md) · [Previous lesson](12_neighbor_resolution.md) · [Next lesson](14_multicast.md)
