---
id: dns-15
topic_id: 02_dns
order: 15
title: "Root trust anchors and key rollover"
source_classification: lecture_guide
estimated_reading_minutes: 3
prerequisite_ids: ["dns-14"]
---

# 15. Root trust anchors and key rollover

## Learning goals

- Explain RFC 5011 hold-down, overlap, and revocation.
- Distinguish a valid local update protocol from evidence of global readiness.

**Builds on:** [DNSSEC data authentication and deployment](14_dnssec.md).

## Explanation

### The operational problem

The root **KSK** signs the root DNSKEY set, which includes the keys used to verify ordinary root-zone data. Resolvers must have trusted starting information before the hierarchy can authenticate anything else. Key rotation limits long-term exposure, exercises recovery procedures, and can support stronger cryptographic parameters.

The difficulty is distributing new trust to independently operated resolvers without a reliable global push channel, a complete operator list, or confirmation that everyone has updated.

**Dated update, checked 2026-10-20:** IANA confirms that the new root KSK began use on **11 October 2026**, with key tag **38696**. The lecture names it **KSK-2024**, replacing **KSK-2017**, and gives **11 January 2027** as the scheduled old-key revocation. It also cites ICANN's operator guidance published **11 August 2026**. Revocation remains a future scheduled milestone, distinct from the completed signing change. See [IANA's announcement](https://www.iana.org/news/2026/root-zone-begins-using-new-ksk-2026) and [ICANN's rollover information](https://www.icann.org/resources/pages/ksk-rollover-en).

### RFC 5011 automated trust-anchor updates

The central mechanism is a local state transition based on authenticated observations over time:

1. Publish the new key alongside an existing trusted key in the DNSKEY RRset, authenticated through the current trust anchor.
2. A resolver observes and validates the candidate key, then starts an **add hold-down period** instead of trusting it immediately.
3. The resolver polls again. A key that satisfies the protocol's continuing observation and validity requirements can become a trust anchor after the hold-down period.
4. Later, the old key is published with its **REVOKE** bit set and appropriate self-authentication, allowing its removal from trusted use.

The standard's add hold-down is **30 days or the original relevant DNSKEY TTL, whichever is greater**. This requires multiple validated observations; a single appearance is insufficient. See [RFC 5011](https://www.rfc-editor.org/rfc/rfc5011).

**Technical clarification:** the lecture calls this “distributed consensus by patience.” It is more precisely authenticated trust-anchor update, not a general consensus protocol. There is a publishing authority, and safety and successful adoption depend on timers, key overlap, and sufficient observations. It does not require acknowledgements from every resolver, but that does not mean it has no timing assumptions.

A resolver offline throughout the useful observation window may fail to learn the new anchor before it is needed. Once its old trust information can no longer authenticate the root key set, validation fails closed rather than silently trusting unauthenticated replacements. Recovery may require an operator or another trusted update mechanism.

### Why observability matters

The first root KSK rollover was planned for **11 October 2017** but delayed until **October 2018**. KSK-2017 had been published in advance; its name does not mean it was already the active signing key in 2017. RFC 8145 telemetry let resolvers signal their trust anchors, but the operator could not confidently distinguish genuine lack of readiness from measurement artifacts. The lecture reports completion without major incident after the delay.

This separates two questions: whether the update protocol works under its assumptions, and whether operators can determine that the deployed population satisfies those assumptions. A correct local update rule does not give anyone complete knowledge of global readiness.

Inspect the published root key set with:

```sh
dig . DNSKEY +dnssec
```

A key appearing in that output does not alone show that every resolver has adopted it as a trust anchor.

## Practice

No questions from the supplied DNS quiz are assigned. Retain this material for study and revision.

Consult [review.md](review.md) before scored practice.

## Source

- [Lecture 02: 9. Root trust anchors and key rollover](../../lectures/lecture_02_dns.md#9-root-trust-anchors-and-key-rollover)

[Topic overview](README.md) · [Glossary](glossary.md) · [References](references.md) · [Previous lesson](14_dnssec.md) · [Next lesson](16_encrypted_dns.md)
