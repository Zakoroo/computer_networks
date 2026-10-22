---
id: dns-10
topic_id: 02_dns
order: 10
title: "Mail exchange and reverse DNS"
source_classification: lecture_guide
estimated_reading_minutes: 2
prerequisite_ids: ["dns-06", "dns-09"]
---

# 10. Mail exchange and reverse DNS

## Learning goals

- Use MX priorities to choose mail servers.
- Construct reverse names and explain why PTR does not return every alias.

**Builds on:** [DNS headers and resource records](06_headers_and_records.md), [CNAME chains and alias restrictions](09_aliases_and_cname.md).

## Explanation

### Mail exchange

MX records identify servers receiving mail for a domain. The email domain itself need not have an A record. The lecture contrasts an unsuccessful address lookup or `ping scs.stanford.edu` with the ability to mail staff at that domain through its MX records:

```sh
dig scs.stanford.edu MX
```

The sender obtains an MX target and then resolves that server's address. MX preferences order alternatives: **smaller numbers mean higher preference**. This separation lets an organization's mail service operate independently of its website or of any address assigned directly to its domain name.

### Reverse lookup

Forward lookup maps a name to an address. **Reverse lookup** queries a PTR record to obtain a name associated with an address. It is a separately maintained mapping, not an automatic inverse returning every alias.

For IPv4, reverse the octets and append `in-addr.arpa.`:

```text
128.30.2.121  →  121.2.30.128.in-addr.arpa.
171.66.3.9   →  9.3.66.171.in-addr.arpa.
```

The order supports delegation: the most significant address components become the higher-level suffix of the DNS name. The record form is:

```text
reversed-address.in-addr.arpa. [TTL] [IN] PTR target-name.
```

The lecture's combined example is:

```dns
tinyos.stanford.edu. CNAME sing.stanford.edu.
sing.stanford.edu. A 171.67.76.65
65.76.67.171.in-addr.arpa. PTR sing.stanford.edu.
```

Resolving `tinyos` follows an alias to `sing`; reversing the resulting address returns `sing`, not necessarily `tinyos`. IPv6 reverse mapping uses `ip6.arpa`. ARPA originally referred to the agency funding early Internet development; the infrastructure domain now expands to **Address and Routing Parameter Area**, documented in RFC 3172.

Traceroute uses increasing IP TTL values and ICMP time-exceeded responses to learn router addresses, then may use PTR lookups to display names. **IP TTL limits packet lifetime in hops; DNS TTL limits cached information lifetime in seconds.**

## Practice

No questions from the supplied DNS quiz are assigned. Retain this material for study and revision.

Consult [review.md](review.md) before scored practice.

## Source

- [Lecture 02: 6. Aliases, mail, reverse lookup, and services](../../lectures/lecture_02_dns.md#6-aliases-mail-reverse-lookup-and-services)

[Topic overview](README.md) · [Glossary](glossary.md) · [References](references.md) · [Previous lesson](09_aliases_and_cname.md) · [Next lesson](11_srv_txt_and_spf.md)
