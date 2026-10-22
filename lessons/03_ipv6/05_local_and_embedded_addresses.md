---
id: ipv6-05
topic_id: 03_ipv6
order: 5
title: "Local scope, special addresses, and embedded IPv4"
source_classification: lecture_guide
estimated_reading_minutes: 3
prerequisite_ids: ["ipv6-04"]
---

# 5. Local scope, special addresses, and embedded IPv4

## Learning goals

- Explain link-local scope, zone indices, ULAs, and special addresses.
- Distinguish mapped, compatible, 6to4, and NAT64 address forms.

**Builds on:** [Delivery types and global unicast structure](04_address_types.md).

## Explanation

An **LLA** supports communication only on the local link. Routers do not forward packets with a link-local source or destination to another link. IPv6-enabled ordinary interfaces use LLAs for bootstrapping, router advertisements, neighbour communication, and many routing-protocol exchanges.

The reserved block is `fe80::/10`. The usual address format consists of those 10 prefix bits, 54 zero bits, and a 64-bit IID, so addresses normally appear within `fe80::/64`. Unlike SLAAC GUAs, an automatically formed LLA needs no advertised site prefix: the prefix is already known.

Link-local uniqueness applies **per link**. A router can use `fe80::1` on several different interfaces, provided no other interface on each corresponding link uses the same address. To select the intended link, tools may require a **zone index**, for example:

```text
fe80::1%eth0
fe80::1%12
```

The suffix selects an interface or scope zone and is not part of the 128-bit address.

### Unique local and special addresses

**ULAs** occupy `fc00::/7`, covering first-hextet values from `fc00` through `fdff`. Locally assigned ULAs use `fd00::/8`, with a 40-bit pseudo-random global ID intended to reduce collisions between independently numbered sites. The `fc00::/8` half is reserved for a different assignment scheme.

ULAs support local or limited inter-site communication and are not intended for global Internet routing. They resemble IPv4 RFC 1918 private addresses, but local addressing does not require translation. **Technical clarification:** translation mechanisms for IPv6 do exist; the sound distinction is that ULA use does not inherently require or imply NAT. Address scope also does not replace a firewall or access policy.

Two special addresses shown in the source classification are:

- **`::1/128` — loopback:** communication with the same host.
- **`::/128` — unspecified:** indicates the absence of an assigned source address in particular bootstrap operations. It is not an ordinary interface address to assign.

IPv6 has no all-ones broadcast host address. However, an all-zero IID has the **Subnet-Router Anycast** role for the corresponding subnet. Do not interpret the source's “all-zero and all-one host values are assignable” as permission to assign the subnet-router anycast address to an arbitrary ordinary host.

### IPv4 embedded in IPv6 notation

The same IPv4 value can appear in several IPv6 formats with different meanings. `192.0.2.128` has bytes `c0 00 02 80`, forming hextets `c000:0280`.

| Form | Example | Meaning |
|---|---|---|
| IPv4-mapped | `::ffff:192.0.2.128` = `::ffff:c000:280` | Socket/API representation allowing IPv6-capable applications to handle IPv4 peers; not ordinary IPv6 Internet routing. |
| IPv4-compatible | `::192.0.2.128` = `::c000:280` | Deprecated historical format. |
| 6to4 | `2002:c000:0280::/48` | Embeds an IPv4 tunnel endpoint after `2002::/16`. |
| NAT64 well-known prefix | `64:ff9b::192.0.2.128` = `64:ff9b::c000:280` | Represents an IPv4 destination through translation using `64:ff9b::/96`. |

Leading zeros in `0280` may be omitted without changing the address. These formats are not interchangeable simply because they contain the same low-order IPv4 bits.

## Practice

No native IPv6 quiz questions are assigned. This teaching is retained for study and revision.

Check the [review queue](review.md) before scored practice; flagged questions retain their original keys. The [manifest](manifest.json) separates additional required lessons from optional background.

## Source

- [Lecture: 3. Address types and scope](../../lectures/lecture_03_ipv6.md#3-address-types-and-scope)

[Topic overview](README.md) · [Glossary](glossary.md) · [References](references.md) · [Previous lesson](04_address_types.md) · [Next lesson](06_subnetting.md)
