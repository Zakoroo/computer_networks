---
id: dns-13
topic_id: 02_dns
order: 13
title: "Forgery and cache poisoning"
source_classification: lecture_guide
estimated_reading_minutes: 2
prerequisite_ids: ["dns-03", "dns-06", "dns-08"]
---

# 13. Forgery and cache poisoning

## Learning goals

- Explain how a forged accepted reply can poison a shared cache.
- Describe repeated fresh-name attempts and the benefit and limits of source-port randomization.

**Builds on:** [Zones, delegation, and recursive resolution](03_hierarchy_and_resolution.md), [DNS headers and resource records](06_headers_and_records.md), [Replication, SOA, and cache lifetimes](08_replication_and_caching.md).

## Explanation

### What the original protocol lacks

Original DNS supplies neither cryptographic data-origin authentication nor query confidentiality. Plain DNS exposes names to parties observing its network path. A conventional resolver matches a reply to its outstanding request using the transaction ID, addresses, ports, and question; a matching ID alone is not the complete acceptance rule.

Those checks are not a cryptographic proof of origin. An attacker able to forge an acceptable response can insert false data into a cache. Because that cache serves many clients, the result can affect everyone using the poisoned entry until it expires or is removed.

### The Kaminsky attack pattern

The 2008 attack made repeated forgery attempts practical:

1. Trigger a lookup for a fresh name, such as `aaa1.bank.com`, so a cached answer does not prevent a new upstream query.
2. Race the legitimate response with forged replies matching the expected question and server details.
3. Guess the transaction ID and include malicious delegation information intended to redirect subsequent lookups for the zone.
4. If the attempt loses, repeat using `aaa2.bank.com` and further fresh names.

With a predictable port, a 16-bit ID has only \(2^{16}=65{,}536\) possibilities. Source-port randomization adds another uncertainty. Under an idealized full 16-bit independent port space, the combined space approaches \(2^{32}\), about 4.3 billion combinations. Real port ranges and network behaviour may provide less entropy.

This raises the cost of successful guessing. **It does not authenticate the data.** The lecture's birthday-bound wording should be read as motivation for repeated opportunities, not as an exact success-probability derivation.

## Practice

Assigned DNS questions: Q019.

Consult [review.md](review.md) before scored practice. Assigned DNS questions need no additional lesson to answer the supported concepts; optional links in the manifest provide background.

## Source

- [Lecture 02: 8. Forgery, cache poisoning, and DNSSEC](../../lectures/lecture_02_dns.md#8-forgery-cache-poisoning-and-dnssec)

[Topic overview](README.md) · [Glossary](glossary.md) · [References](references.md) · [Previous lesson](12_load_balancing.md) · [Next lesson](14_dnssec.md)
