---
id: dns-11
topic_id: 02_dns
order: 11
title: "Service discovery, TXT, and SPF"
source_classification: lecture_guide
estimated_reading_minutes: 2
prerequisite_ids: ["dns-06", "dns-10"]
---

# 11. Service discovery, TXT, and SPF

## Learning goals

- Interpret SRV priority, weight, port, and target.
- Explain TXT extensibility and distinguish SPF softfail from neutral.

**Builds on:** [DNS headers and resource records](06_headers_and_records.md), [Mail exchange and reverse DNS](10_mail_and_reverse.md).

## Explanation

### Service discovery with SRV

SRV generalizes the service-location idea beyond incoming mail:

```text
_service._proto.name [TTL] [IN] SRV priority weight port target
```

- **Service:** symbolic service name, such as `_sip` for SIP-based telephony.
- **Protocol:** commonly `_tcp` or `_udp`.
- **Name:** domain to which the service belongs.
- **Priority:** lower values are preferred, as with MX.
- **Weight:** influences randomized selection among records with equal priority.
- **Port:** the service's TCP or UDP port.
- **Target:** server name whose A or AAAA records supply its addresses.

For example:

```dns
_sip._tcp.example.com. 3600 IN SRV 10 5 5060 sipserver.example.com.
```

This identifies `sipserver.example.com`, port `5060`, priority `10`, and weight `5`. Applications that implement service discovery can find changing hosts and ports without hard-coding them. The lecture also suggests:

```sh
dig _sip._tls.microsoft.com SRV
```

That command preserves its service-specific example using `_tls`; its answer is deployment-dependent.

### TXT and SPF

TXT records associate application-defined text with a name:

```text
name [TTL] [IN] TXT "text"
```

Applications can introduce conventions without changing DNS infrastructure. Uses include domain ownership verification, service descriptions, administrative notes, and email authorization policies. **Technical clarification:** arbitrary application meaning does not imply unlimited length. TXT RDATA contains one or more length-prefixed strings, each at most 255 octets, within DNS message limits.

**SPF**, Sender Policy Framework (historically “Sender Permitted From”), publishes which hosts may send mail for a domain identity. The lecture uses `dig gmail.com TXT` and this shortened historical example:

```dns
gmail.com. 3600 IN TXT "v=spf1 ip4:216.239.32.0/19 ip4:64.233.160.0/19 ip4:66.249.80.0/20 ~all"
```

The longer example adds `72.14.192.0/18`, `209.85.128.0/17`, `66.102.0.0/20`, `74.125.0.0/16`, `64.18.0.0/20`, `207.126.144.0/20`, and `173.194.0.0/16`, and ends with `?all`. These are illustrative historical policies, not Gmail configuration advice. The `/n` suffix expresses the length of the network prefix in bits.

**Technical clarification:** the lecture conflates `~all` and `?all`. RFC 7208 defines `~all` as **softfail** and `?all` as **neutral**. A matching positive `ip4` mechanism passes authorization for the checked identity. A pass does not establish that the message is trustworthy or authenticate every displayed From header. Softfail may contribute to spam handling, but the receiver decides how to treat the message.

## Practice

No questions from the supplied DNS quiz are assigned. Retain this material for study and revision.

Consult [review.md](review.md) before scored practice.

## Source

- [Lecture 02: 6. Aliases, mail, reverse lookup, and services](../../lectures/lecture_02_dns.md#6-aliases-mail-reverse-lookup-and-services)

[Topic overview](README.md) · [Glossary](glossary.md) · [References](references.md) · [Previous lesson](10_mail_and_reverse.md) · [Next lesson](12_load_balancing.md)
