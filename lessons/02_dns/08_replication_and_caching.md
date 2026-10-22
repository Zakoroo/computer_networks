---
id: dns-08
topic_id: 02_dns
order: 8
title: "Replication, SOA, and cache lifetimes"
source_classification: lecture_guide
estimated_reading_minutes: 2
prerequisite_ids: ["dns-03", "dns-06"]
---

# 08. Replication, SOA, and cache lifetimes

## Learning goals

- Distinguish secondary refresh from positive and negative caching.
- Explain TTL trade-offs and compute a negative lifetime from SOA timing.

**Builds on:** [Zones, delegation, and recursive resolution](03_hierarchy_and_resolution.md), [DNS headers and resource records](06_headers_and_records.md).

## Explanation

Availability requires replicas in genuinely different failure locations. Stanford could, for example, arrange for MIT to serve a secondary copy of `scs.stanford.edu`. A common arrangement has one **primary** holding managed updates and several **secondaries** copying the zone. Older terminology calls them master and slave. Both primary and secondary servers can give authoritative answers.

Frequent synchronization makes changes available sooner but costs more traffic and work. Infrequent synchronization reduces overhead but leaves older data in service longer. The zone owner controls this trade-off through its **SOA record**. The primary can update this administrative record and send **NOTIFY** messages, defined in RFC 1996, to prompt secondaries to check sooner. NOTIFY is a refresh hint, not the updated zone itself.

The SOA holds administrative information, a zone version, and timers. **Additional standards context:** its serial identifies the version; refresh controls regular update checks, retry controls attempts after failure, and expire limits how long a secondary can keep serving without successful refresh. This is distinct from a resolver's TTL-based cache.

SOA data also governs **negative caching**: remembering that a name does not exist or that the requested record type is absent. Inspect it with:

```sh
dig stanford.edu SOA
```

**Technical clarification:** the SOA field called MINIMUM is not a universal lower bound on every record's TTL. For negative caching, RFC 2308 uses the lesser of SOA.MINIMUM and the SOA record's TTL. Negative cache entries expire just as positive entries do.

Three mechanisms should remain separate: **secondary refresh** updates an authoritative replica, **positive TTLs** limit reuse of existing answers, and **negative TTLs** limit reuse of absence. Updating the primary does not immediately invalidate every resolver cache.

## Reasoning through the concepts

**Editorial clarification of the existing topic:** **NXDOMAIN** reports that the queried name does not exist, rather than merely lacking the requested record type. An ordinary cached RR counts down its remaining TTL. After expiry it cannot supply a fresh cache hit: a later request needs fresh data, using any still-usable referrals to reach an authority. Expiry alone need not trigger an immediate network query. A longer TTL can save repeat lookups while allowing an old answer to persist longer. For a negative answer, if SOA.MINIMUM is 900 seconds and the SOA TTL is 300 seconds, the starting negative-cache lifetime is at most 300 seconds. This explains the basic TTL model; special stale-answer policies are outside this lesson. See [RFC 1035 §6.1.3](https://www.rfc-editor.org/rfc/rfc1035.html#section-6.1.3) and [RFC 2308 §5](https://www.rfc-editor.org/rfc/rfc2308.html#section-5).

## Practice

Assigned DNS questions: Q011, Q014, Q017, Q023.

Cross-topic practice from the routing quiz: Routing Q037. See the [external assignments](manifest.json).

Routing Q037 also requires [Anycast DNS and routing-based recovery](18_anycast_and_resilience.md); replica timing alone does not explain route-selected instances.

Consult [review.md](review.md) before scored practice. Assigned DNS questions need no additional lesson to answer the supported concepts; optional links in the manifest provide background.

## Source

- [Lecture 02: 5. Replication, SOA, and caching](../../lectures/lecture_02_dns.md#5-replication-soa-and-caching)

[Topic overview](README.md) · [Glossary](glossary.md) · [References](references.md) · [Previous lesson](07_names_and_compression.md) · [Next lesson](09_aliases_and_cname.md)
