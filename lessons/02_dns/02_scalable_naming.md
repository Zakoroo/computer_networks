---
id: dns-02
topic_id: 02_dns
order: 2
title: "Why distributed naming and caching scale"
source_classification: lecture_guide
estimated_reading_minutes: 2
prerequisite_ids: ["dns-01"]
---

# 02. Why distributed naming and caching scale

## Learning goals

- Explain why a shared hosts file scales poorly.
- Relate read-heavy data and loose consistency to aggressive caching.

**Builds on:** [Names, URLs, and the purpose of DNS](01_names_and_urls.md).

## Explanation

### From a shared hosts file to distributed naming

Originally, a global `hosts.txt` file listed names and addresses. Adding a host involved emailing an administrator, who distributed updates every few days. The file was maintained at SRI-NIC.ARPA, historically `26.0.0.73`, and hosts downloaded updates using FTP. RFC 952 documents this older system. Windows still has a local hosts file in `C:\Windows\System32\drivers\etc` (normally named `hosts`, without `.txt`).

A single global file cannot scale comfortably: it grows with the network, names may collide, authority to change entries must be established, and dynamic addresses may change faster than distribution intervals. DNS addresses these problems through a hierarchy and distributed administration.

Its design goals are distinct:

1. **Scalability:** support enormous numbers of records, including names synthesized by software. The possible namespace grows exponentially with name length.
2. **Distributed control:** let administrators manage their own names and delegate responsibility.
3. **Fault tolerance:** keep lookups available despite server or network failures. Applications once accustomed to an always-present local hosts file can fail badly when naming becomes unavailable.

DNS has a favourable workload: records are read much more often than changed. Many updates can tolerate minutes or hours before every cache reflects them. This **loose consistency** permits aggressive caching, reducing latency and authoritative-server load. The cost is that old or incorrect answers can persist.

## Practice

Assigned DNS questions: Q003, Q004.

Consult [review.md](review.md) before scored practice. Assigned DNS questions need no additional lesson to answer the supported concepts; optional links in the manifest provide background.

## Source

- [Lecture 02: 1. Names, URLs, and the purpose of DNS](../../lectures/lecture_02_dns.md#1-names-urls-and-the-purpose-of-dns)

[Topic overview](README.md) · [Glossary](glossary.md) · [References](references.md) · [Previous lesson](01_names_and_urls.md) · [Next lesson](03_hierarchy_and_resolution.md)
