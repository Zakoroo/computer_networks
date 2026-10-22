---
id: dns-18
topic_id: 02_dns
order: 18
title: "Anycast DNS and routing-based recovery"
source_classification: lecture_guide
estimated_reading_minutes: 2
prerequisite_ids: ["dns-03", "dns-12"]
---

# 18. Anycast DNS and routing-based recovery

## Learning goals

- Distinguish root identities from their physical instances.
- Explain route-selected replicas and the detection and convergence needed after failure.

**Builds on:** [Zones, delegation, and recursive resolution](03_hierarchy_and_resolution.md), [Round-robin DNS and address selection](12_load_balancing.md).

## Explanation

### Root resilience through routing

The root service has **13 named identities, A through M**, rather than only 13 physical machines. Each identity can have instances at many sites. The lecture describes more than a thousand instances globally and includes an older map with examples in North America, London, Stockholm, and Tokyo, plus replicated sites elsewhere. Its historical site counts are not a current deployment inventory.

**BGP anycast** allows multiple sites to announce the same destination prefix. Routing selects the preferred reachable site according to routing policy and topology, not necessarily physical distance. The resolver addresses the same service regardless of which instance receives its packet.

Replication provides geographic resilience, can reduce latency, and distributes query load. If a failed instance's route is withdrawn, routing reconverges and sends later traffic elsewhere. This uses the IP routing layer to support DNS availability.

**Technical clarification:** the lecture's “no timeout, no health check, clients see nothing” is an idealization. A deployment needs a way to detect service failure and withdraw an unusable route. Route convergence takes time, packets can be lost, and resolver retry behaviour remains relevant. The historical 512-byte DNS response size helped shape the 13-identity arrangement; it is not a claim that only 13 physical instances are possible.

## Practice

No questions from the supplied DNS quiz are assigned. Retain this material for study and revision.

Cross-topic practice from the routing quiz: Routing Q036. See the [external assignments](manifest.json).

Consult [review.md](review.md) before scored practice.

## Source

- [Lecture 02: 11. Anycast and failure recovery](../../lectures/lecture_02_dns.md#11-anycast-and-failure-recovery)

[Topic overview](README.md) · [Glossary](glossary.md) · [References](references.md) · [Previous lesson](17_query_disclosure.md) · [Next lesson](19_persistent_failures.md)
