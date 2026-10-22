---
id: ipv6-04
topic_id: 03_ipv6
order: 4
title: "Delivery types and global unicast structure"
source_classification: lecture_guide
estimated_reading_minutes: 2
prerequisite_ids: ["ipv6-03"]
---

# 4. Delivery types and global unicast structure

## Learning goals

- Distinguish unicast, multicast, anycast, and the absence of broadcast.
- Read the global-prefix, subnet, and interface-ID fields.

**Builds on:** [IPv6 notation, compression, and prefixes](03_notation_and_prefixes.md).

## Explanation

IPv6 defines three delivery models:

- **Unicast:** deliver to one interface.
- **Multicast:** deliver to members of a group.
- **Anycast:** deliver to one of several interfaces using the same address, selected by routing.

There is **no IPv6 broadcast address**. Multicast replaces broadcast uses, with groups targeted to the participants that need a message.

An interface can hold several IPv6 addresses simultaneously. A typical host has a link-local address and one or more global addresses, possibly including temporary addresses. **Technical clarification:** IPv4 interfaces can also have multiple addresses; the contrast is about normal configuration patterns, not an IPv4 restriction to one address.

### Global unicast and its structure

A **GUA** is intended to be globally unique and routable. The lecture focuses on ordinary global allocations within `2000::/3`, whose first three bits are `001`. The first hextet therefore ranges from `2000` to `3fff`, beginning with hexadecimal `2` or `3`.

That block is one eighth of the total address space. **Technical clarification:** the other seven eighths are not all freely available for future GUA allocation: they also contain special-purpose ranges such as multicast and link-local addresses. The `/3` is the lecture's allocation context, not the definition of every possible global-use IPv6 address.

A common site layout is:

```mermaid
block-beta
    columns 3
    global["Global routing prefix: 48 bits"]
    subnet["Subnet ID: 16 bits"]
    iid["Interface ID: 64 bits"]
```

The provider assigns the global routing prefix. The organization chooses subnet IDs within that allocation. The interface ID identifies an interface on its link. `/48` site allocations and `/56` home allocations are examples, not mandatory allocation sizes.

The `2001:db8::/32` addresses used throughout the exercises are **documentation addresses**. They illustrate GUA structure but are not public addresses to deploy on the Internet.

## Practice

Assigned IPv6 questions: Q003.

Check the [review queue](review.md) before scored practice; flagged questions retain their original keys. The [manifest](manifest.json) separates additional required lessons from optional background.

## Source

- [Lecture: 3. Address types and scope](../../lectures/lecture_03_ipv6.md#3-address-types-and-scope)

[Topic overview](README.md) · [Glossary](glossary.md) · [References](references.md) · [Previous lesson](03_notation_and_prefixes.md) · [Next lesson](05_local_and_embedded_addresses.md)
