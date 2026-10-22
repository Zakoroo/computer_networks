---
id: ipv6-21
topic_id: 03_ipv6
order: 21
title: "Dual-stack, IPv6-mostly, and IPv6-only access"
source_classification: lecture_guide
estimated_reading_minutes: 2
prerequisite_ids: ["ipv6-19", "ipv6-20"]
---

# 21. Dual-stack, IPv6-mostly, and IPv6-only access

## Learning goals

- Compare native access models and their compatibility needs.
- Explain IPv6-Only Preferred signalling without assuming every remote service is IPv6.

**Builds on:** [Coexistence, encapsulation, and historical 6to4](19_tunnelling.md), [NAT64, DNS64, and 464XLAT](20_nat64_and_464xlat.md).

## Explanation

These describe the **native access-network operating model**, not necessarily what every remote service supports:

| Model | Native operation | Main operational consequence |
|---|---|---|
| Dual-stack | IPv4 and IPv6 | Maintain both families' addressing, routes, policies, and diagnostics. |
| IPv6-mostly | Prefer IPv6; retain IPv4 for clients that still need it | Reduce IPv4 dependence without requiring every host to stop using it immediately. |
| IPv6-only | No native IPv4 on the access network | Use translation or other compatibility facilities where legacy reachability is required. |

**RFC 8925** defines an IPv6-Only Preferred option in **DHCPv4**. A capable client signals support, and a server can tell it to defer IPv4 configuration for a stated interval when the IPv6 environment is suitable. This is more precise than saying hosts simply request IPv4 only if needed; the option coordinates client and server behaviour.

Dual stack is often a useful transition state, but it preserves two sets of things to operate. “Twice the operational surface” is a useful warning, not a measured universal cost multiplier. The cheapest appropriate model depends on requirements and deployed capabilities.

## Practice

No native IPv6 quiz questions are assigned. This teaching is retained for study and revision.

Check the [review queue](review.md) before scored practice; flagged questions retain their original keys. The [manifest](manifest.json) separates additional required lessons from optional background.

## Source

- [Lecture: 11. Coexistence and transition mechanisms](../../lectures/lecture_03_ipv6.md#11-coexistence-and-transition-mechanisms)

[Topic overview](README.md) · [Glossary](glossary.md) · [References](references.md) · [Previous lesson](20_nat64_and_464xlat.md) · [Next lesson](22_adoption_measurements.md)
