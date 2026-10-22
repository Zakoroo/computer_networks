---
id: dns-19
topic_id: 02_dns
order: 19
title: "Stale delegation, expired signatures, and poisoned caches"
source_classification: lecture_guide
estimated_reading_minutes: 2
prerequisite_ids: ["dns-04", "dns-08", "dns-13", "dns-14", "dns-18"]
---

# 19. Stale delegation, expired signatures, and poisoned caches

## Learning goals

- Distinguish three persistent DNS failure modes.
- Separate local detection from the authority or information needed for repair.

**Builds on:** [Bootstrapping, glue, and delegation inspection](04_root_hints_and_glue.md), [Replication, SOA, and cache lifetimes](08_replication_and_caching.md), [Forgery and cache poisoning](13_forgery_and_cache_poisoning.md), [DNSSEC data authentication and deployment](14_dnssec.md), [Anycast DNS and routing-based recovery](18_anycast_and_resilience.md).

## Explanation

### Three distinct failure modes

1. **Stale delegation:** a parent still refers to servers the child no longer uses. Each component can faithfully apply its local configuration while resolution fails or reaches obsolete service. Repair requires correcting the delegation and allowing cached information to expire.
2. **Expired signatures:** an RRSIG passes beyond its validity interval. A validating resolver rejects data even if the underlying address and key have not changed. Renewal and correct timing matter independently of whether the data remains useful.
3. **Poisoned cache:** a resolver that accepted forged data can continue returning it until expiry or external removal. A non-validating cache has no cryptographic evidence with which to discover the forgery.

The lesson is that a distributed system can reach an undesirable state while individual components follow their local rules. Caching, independent administration, and time-based validity make automatic recovery incomplete.

**Technical clarification:** not all these failures are locally invisible. A validator can detect expired signatures and report failure, and administrators can monitor delegation problems or flush a bad cache. What local detection may not provide is the authority or information needed to repair the underlying state. DNSSEC also prevents acceptance of many forged answers in securely validated zones, so “DNS cannot detect poisoning” is not universal.

The lecture connects this distinction to undesirable BGP equilibria, hidden IPv6 connectivity problems, TCP behaviour, and SDN control-plane bootstrapping: local protocol compliance does not by itself guarantee a desired global outcome.

## Practice

No questions from the supplied DNS quiz are assigned. Retain this material for study and revision.

Consult [review.md](review.md) before scored practice.

## Source

- [Lecture 02: 11. Anycast and failure recovery](../../lectures/lecture_02_dns.md#11-anycast-and-failure-recovery)

[Topic overview](README.md) · [Glossary](glossary.md) · [References](references.md) · [Previous lesson](18_anycast_and_resilience.md) · [Next lesson](20_practical_investigation.md)
