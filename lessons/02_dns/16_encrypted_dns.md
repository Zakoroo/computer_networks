---
id: dns-16
topic_id: 02_dns
order: 16
title: "Encrypted DNS and resolver trust"
source_classification: lecture_guide
estimated_reading_minutes: 2
prerequisite_ids: ["dns-05", "dns-14"]
---

# 16. Encrypted DNS and resolver trust

## Learning goals

- Compare DoT, DoH, and DoQ with DNSSEC.
- Identify what on-path observers and the receiving resolver can still learn.

**Builds on:** [DNS transport and message sections](05_transport_and_sections.md), [DNSSEC data authentication and deployment](14_dnssec.md).

## Explanation

### Encrypted transports

DNSSEC data authentication and encrypted transport address different threats. A validated answer over plain UDP is authenticated but publicly observable on that path. An unsigned answer retrieved over HTTPS has a protected transport connection, but no DNSSEC proof connecting the answer to the zone's signing authority.

| Mechanism | Transport and usual port | Main distinction |
|---|---|---|
| DoT | TLS over TCP, 853 | DNS content is encrypted; the dedicated port makes its purpose relatively visible. |
| DoH | HTTPS, 443 | Shares web transport, making simple DNS-specific filtering harder. |
| DoQ | QUIC over UDP, 853 | Independent streams avoid TCP's cross-stream head-of-line blocking. |

The defining references are RFC 7858, RFC 8484, and RFC 9250. **Technical clarification:** “DoH is indistinguishable from web traffic” is a design motivation, not an absolute guarantee. Endpoint addresses and traffic patterns can still provide clues. Encryption protects the client-to-resolver exchange; it does not automatically encrypt every subsequent resolver-to-authoritative exchange.

Network operators may prefer DoT's visibility because they can identify and manage DNS traffic. DoH makes that control harder and can make port-based censorship less effective. This creates a trade-off between user choice and network policy.

### Who still sees the query?

An encrypted connection hides query contents from on-path observers. **The receiving resolver still sees the name**, because it must answer or resolve the question.

The lecture describes movement from ISP-provided resolution toward large public providers as a privacy and concentration trade-off. A provider may offer strong operations and privacy commitments while accumulating queries from many more users. Encryption alone does not decide which endpoint deserves trust. Claims that all ISPs or all public resolvers behave alike would go beyond the mechanism.

The useful question is: **which observer learns which information?** Network confidentiality, resolver trust, and DNSSEC authentication are separate issues.

## Practice

Assigned DNS questions: Q027, Q028.

Consult [review.md](review.md) before scored practice. Assigned DNS questions need no additional lesson to answer the supported concepts; optional links in the manifest provide background.

## Source

- [Lecture 02: 10. Query privacy](../../lectures/lecture_02_dns.md#10-query-privacy)

[Topic overview](README.md) · [Glossary](glossary.md) · [References](references.md) · [Previous lesson](15_trust_anchor_rollover.md) · [Next lesson](17_query_disclosure.md)
