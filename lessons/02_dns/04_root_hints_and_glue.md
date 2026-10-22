---
id: dns-04
topic_id: 02_dns
order: 4
title: "Bootstrapping, glue, and delegation inspection"
source_classification: lecture_guide
estimated_reading_minutes: 3
prerequisite_ids: ["dns-03"]
---

# 04. Bootstrapping, glue, and delegation inspection

## Learning goals

- Explain root hints and the circular dependency solved by glue.
- Classify nameservers as inside or outside a delegated zone and inspect referrals.

**Builds on:** [Zones, delegation, and recursive resolution](03_hierarchy_and_resolution.md).

## Explanation

### Root hints

A resolver cannot discover every server exclusively through DNS, because it first needs somewhere to send a query. A **root hints file**, called a root cache file in the lecture, supplies initial root server names and addresses. This historical excerpt illustrates the format:

```dns
.                    3600000 NS A.ROOT-SERVERS.NET.
A.ROOT-SERVERS.NET.   3600000 A  198.41.0.4
.                    3600000 NS B.ROOT-SERVERS.NET.
B.ROOT-SERVERS.NET.   3600000 A  128.9.0.107
```

Each line is a separate record. An NS line associates the root with a server name, and an A line associates that server name with an address. **These are historical examples, especially the B-root address, not a configuration to install.** Root hints provide a bootstrap destination; caching learned referrals is what reduces repeated root queries.

### The circular dependency

Suppose the `.com` parent delegates `example.com` to `ns1.example.com`. To ask that server about `example.com`, the resolver needs its IP address. But discovering the address of `ns1.example.com` would ordinarily require contacting the very zone it cannot yet reach.

**Glue breaks this dependency:** the parent supplies address records for the delegated server alongside the referral. The resolver can contact the child immediately. Glue is a role played by A or AAAA records, not a separate record type.

Similarly, the lecture delegates `stanford.edu` to `Argus.stanford.edu`. The `.edu` parent supplies Argus's address so that the resolver can reach Stanford's servers. In a referral, NS records generally appear in the **Authority** section and glue addresses in **Additional**. Not every Additional record is glue.

### One delegation showing both cases

The lecture's Chalmers example names four servers:

- `ns1.chalmers.se`, `ns2.chalmers.se`, and `ns3.chalmers.se` lie inside the delegated zone. Their bootstrap addresses need parent-side glue.
- `dns.uu.se` lies outside `chalmers.se`. Its address can be resolved through the `uu.se` delegation, avoiding that circular dependency.

This is a documented example, **not a verified current NS set**. Its value is showing both sides of the rule. An off-site server protects against loss of Chalmers' SUNET connectivity: keeping DNS available from another network can allow dependent services, including mail, to continue making useful decisions.

**Technical clarification:** a temporary DNS failure normally causes mail delivery to be retried, not immediately discarded. The sound availability argument is that independent DNS service reduces failures and delays; the stronger claim that unanswered DNS necessarily causes message loss should not be treated as an SMTP rule.

### Inspecting referrals

The lecture's historical manual walk is:

```sh
dig +norec www.scs.stanford.edu @a.root-servers.net
dig +norec www.scs.stanford.edu @a.edu-servers.net
dig +norec www.scs.stanford.edu @argus.stanford.edu
dig +norec www.scs.stanford.edu @ns1.fs.net
```

These illustrate results for `.edu`, `stanford.edu`, `scs.stanford.edu`, and finally `www.scs.stanford.edu`. The first two referrals are the lecture's glue examples. Inspect the Authority and Additional sections together to determine which addresses enable the next step. The named servers may no longer serve these roles.

For an investigation of Chalmers:

```sh
dig +trace www.chalmers.se
dig +short NS chalmers.se
dig +short DS chalmers.se
```

The first walks the hierarchy and displays referrals. The second lists server names to classify as inside or outside the delegated zone. The third asks whether the parent publishes a DNSSEC commitment to a child key. A DS answer supports a chain-of-trust investigation. **No DS does not by itself prove that the child publishes no signatures**: it may be signed without a parent-linked chain, and an empty command result must also be distinguished from a failed query.

[DNSViz for chalmers.se](https://dnsviz.net/d/chalmers.se) visualizes delegation and validation. Windows `nslookup` does not display referral details as clearly as `dig`; WSL is one way to use `dig`. Direct tracing requires outbound access to the authoritative servers, which some networks block.

## Practice

Assigned DNS questions: Q007.

Consult [review.md](review.md) before scored practice. Assigned DNS questions need no additional lesson to answer the supported concepts; optional links in the manifest provide background.

## Source

- [Lecture 02: 3. Bootstrapping and glue](../../lectures/lecture_02_dns.md#3-bootstrapping-and-glue)

[Topic overview](README.md) · [Glossary](glossary.md) · [References](references.md) · [Previous lesson](03_hierarchy_and_resolution.md) · [Next lesson](05_transport_and_sections.md)
