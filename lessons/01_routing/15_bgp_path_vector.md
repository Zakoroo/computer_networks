---
id: routing-15
topic_id: 01_routing
order: 15
title: "Why BGP uses paths and policy"
source_classification: lecture_guide
estimated_reading_minutes: 2
prerequisite_ids: ["routing-09", "routing-10", "routing-11"]
---

# 15. Why BGP uses paths and policy

## Learning goals

- Explain why Internet routing crosses independent policy boundaries.
- Use an AS path to understand advertisements and AS-level loop detection.

**Builds on:** [Autonomous systems and routing domains](09_autonomous_systems.md), [Link-state routing and shortest paths](10_link_state.md), [Distance-vector routing and Bellman–Ford](11_distance_vector.md).

## Explanation

Why not use a shortest-path IGP over the entire Internet? **Scale is not the only obstacle**: different ASes are independent organizations, need to hide internal details, and make **policy** decisions about who may use their networks. Routing across AS boundaries is therefore as much about economic relationships, information control, and trust as about path length.

**Border Gateway Protocol (BGP)** is the Internet's widely deployed exterior gateway protocol. It advertises **reachability to IP prefixes** together with an **AS-level path** and other attributes, rather than exposing every internal router and link. A receiving AS may learn several candidate routes yet **select and propagate just one preferred route** to a given peer under ordinary BGP operation. When advertising an ordinary route to an external BGP peer, an AS normally prepends its ASN, supporting AS-level loop detection. Ordinary iBGP propagation does not add the local ASN again. This does not eliminate every transient forwarding loop, particularly during change or IGP/BGP inconsistency.

### BGP background and path-vector model

BGP evolved through versions from **BGPv1 (1989; RFC 1105)**, **v2 (1990; RFC 1163)** and **v3 (1991; RFC 1267)** to **BGPv4 (1994/1995; RFCs 1654 and 1771)**, whose CIDR support allowed classless prefix aggregation. The later core BGPv4 specification is **RFC 4271**. Related references include RFCs 1772–1774 for applications, operational experience, and protocol analysis.

**Prefix correction:** The supplied guide writes `171.67.0.0/14`, whose host bits are nonzero. Its canonical /14 network is `171.64.0.0/14` (covering 171.64.0.0–171.67.255.255).

At the AS level, an advertisement such as prefix `171.64.0.0/14` with an AS path listing **15444, 3549, 174, 46749, 32** means the speaker claims a route through that advertised sequence of ASes to the origin. The actual router-by-router internal topology is not included. This abstraction scales organizational policy but can sacrifice **shortest-path efficiency**: an AS with a cheaper route may still choose a commercially preferable longer one.

## Reasoning through the concepts

**Editorial clarification of the existing topic:** For ordinary AS-level loop detection, a speaker excludes a route whose AS_PATH contains its own ASN. This checks an advertised path, not the TTL of a data packet. See [RFC 4271 §9.1.2](https://www.rfc-editor.org/rfc/rfc4271.html#section-9.1.2).

## Practice

Assigned questions: Q020, Q021, Q045, Q046, Q082, Q089, Q092, Q099.

See the [question review](review.md) before using flagged questions for scored practice. The IDs refer to the original routing quiz; full assignments are in [manifest.json](manifest.json).

## Source

- [Lecture 01: Inter-domain routing and the role of BGP](../../lectures/lecture_01_internet_routing.md#inter-domain-routing-and-the-role-of-bgp)

[Topic overview](README.md) · [Glossary](glossary.md) · [Previous lesson](14_ospf.md) · [Next lesson](16_bgp_messages_and_state.md)
