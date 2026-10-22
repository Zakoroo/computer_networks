---
id: dns-12
topic_id: 02_dns
order: 12
title: "Round-robin DNS and address selection"
source_classification: lecture_guide
estimated_reading_minutes: 2
prerequisite_ids: ["dns-06", "dns-09"]
---

# 12. Round-robin DNS and address selection

## Learning goals

- Explain how ordered address RRsets distribute client choices.
- Distinguish address rotation, health checking, and IP anycast.

**Builds on:** [DNS headers and resource records](06_headers_and_records.md), [CNAME chains and alias restrictions](09_aliases_and_cname.md).

## Explanation

A name can have several A or AAAA records. An authoritative server or resolver can vary their order so different clients try different addresses first. `getaddrinfo()` returns a linked list of `addrinfo` results; the lecture's model assumes applications often try the first entry. Multiple NS records similarly support availability, whereas multiple competing CNAME targets for one owner are not allowed.

A simple experiment is to repeat:

```sh
dig cnn.com
```

If the record order changes, clients that prefer the first answer may spread across servers. Caching does not necessarily prevent distribution because a cached RRset can still be returned in different orders. However, **rotation is not a guarantee of equal load**: client selection, resolver caching, and connection reuse matter. Basic round-robin DNS does not itself measure backend load or ensure that each returned server is healthy.

CNAME chains can separate ownership of aliases from management of the final addresses, as in the Yahoo example. Anycast provides a different kind of distribution: the DNS answer or destination address can remain the same while IP routing selects a physical site.

## Practice

Assigned DNS questions: Q016.

Consult [review.md](review.md) before scored practice. Assigned DNS questions need no additional lesson to answer the supported concepts; optional links in the manifest provide background.

## Source

- [Lecture 02: 7. DNS load balancing](../../lectures/lecture_02_dns.md#7-dns-load-balancing)

[Topic overview](README.md) · [Glossary](glossary.md) · [References](references.md) · [Previous lesson](11_srv_txt_and_spf.md) · [Next lesson](13_forgery_and_cache_poisoning.md)
