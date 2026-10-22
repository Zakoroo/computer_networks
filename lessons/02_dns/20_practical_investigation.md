---
id: dns-20
topic_id: 02_dns
order: 20
title: "DNS investigation and revision"
source_classification: lecture_guide
estimated_reading_minutes: 2
prerequisite_ids: ["dns-04", "dns-07", "dns-08", "dns-09", "dns-10", "dns-11", "dns-14", "dns-15", "dns-17", "dns-19"]
---

# 20. DNS investigation and revision

## Learning goals

- Use nslookup and dig to distinguish answers, referrals, and validation evidence.
- Apply the lecture revision checklist across naming, caching, trust, and privacy.

**Builds on:** [Bootstrapping, glue, and delegation inspection](04_root_hints_and_glue.md), [Labels, name encoding, and compression](07_names_and_compression.md), [Replication, SOA, and cache lifetimes](08_replication_and_caching.md), [CNAME chains and alias restrictions](09_aliases_and_cname.md), [Mail exchange and reverse DNS](10_mail_and_reverse.md), [Service discovery, TXT, and SPF](11_srv_txt_and_spf.md), [DNSSEC data authentication and deployment](14_dnssec.md), [Root trust anchors and key rollover](15_trust_anchor_rollover.md), [QNAME minimisation and Oblivious DoH](17_query_disclosure.md), [Stale delegation, expired signatures, and poisoned caches](19_persistent_failures.md).

## Explanation

`nslookup` supports forward queries, reverse queries, record-type selection, and choosing a server. Running it without arguments enters interactive mode. For example:

```sh
nslookup www.example.com
nslookup 171.67.76.65
nslookup www.example.com 8.8.8.8
```

The lecture's screenshot queries a local server at `127.0.0.1#53` and returns a non-authoritative answer for `www.example.com`: IPv4 `93.184.216.34` and IPv6 `2606:2800:220:1:248:1893:25c8:1946`. These historical values illustrate two address families and a resolver answer, not a current address check. A non-authoritative answer is not automatically false or insecure; it describes the responder's role for that data.

Use `dig` when you need section details, referrals, or DNSSEC inspection. Explicit DNS tools may follow a different path from an application's system resolution, so differences can reflect local hosts files, caching, or resolver settings.

A useful study procedure is:

1. Trace a name and identify each delegation, the NS records, and any glue.
2. Classify nameserver targets as inside or outside the delegated zone and explain the dependency.
3. Compare a CNAME query with an A query for the alias; distinguish intermediate names from final addresses.
4. Compare forward and reverse lookup and explain why the original alias need not return.
5. Inspect an SOA and distinguish secondary-update timers from positive and negative caching.
6. Inspect DS and DNSKEY data and distinguish publication of signatures from successful validation.
7. Identify your configured resolver and ask separately whether transport is encrypted, whether it validates DNSSEC, and who can observe the names.

Before an examination, be able to answer these mechanism questions:

- Why does aggressive caching help DNS scale, and why does it complicate repair?
- What exactly is circular in an in-zone nameserver delegation, and what does glue supply?
- Which header bit requests recursion, and which advertises its availability?
- Why is a compressed-name pointer 16 bits while its offset is only 14 bits?
- Why does a CNAME chain permit provider-managed addresses without copying them into each customer alias?
- Why does randomizing source ports mitigate forgery without authenticating data?
- Why are DNSSEC signing, DNSSEC validation, and encrypted DNS three separate decisions?
- How can a safe trust-anchor update protocol coexist with uncertainty about whether a global rollover is safe?
- Which information remains visible under DoH, QNAME minimisation, and Oblivious DoH?

## Practice

No questions from the supplied DNS quiz are assigned. Retain this material for study and revision.

Consult [review.md](review.md) before scored practice.

## Source

- [Lecture 02: 12. Practical investigation and revision](../../lectures/lecture_02_dns.md#12-practical-investigation-and-revision)

[Topic overview](README.md) · [Glossary](glossary.md) · [References](references.md) · [Previous lesson](19_persistent_failures.md)
