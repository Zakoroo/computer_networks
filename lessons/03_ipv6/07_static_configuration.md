---
id: ipv6-07
topic_id: 03_ipv6
order: 7
title: "Static router and host configuration"
source_classification: lecture_guide
estimated_reading_minutes: 2
prerequisite_ids: ["ipv6-05", "ipv6-06"]
---

# 7. Static router and host configuration

## Learning goals

- Separate interface addressing from forwarding configuration.
- Choose a reachable gateway and explain the stability of link-local next hops.

**Builds on:** [Local scope, special addresses, and embedded IPv4](05_local_and_embedded_addresses.md), [Subnetting a site allocation](06_subnetting.md).

## Explanation

### Router addresses and forwarding

The Cisco IOS examples use `ipv6 address address/prefix-length`. Enabling an interface and assigning an address are separate from enabling forwarding. The lecture emphasizes the global command **`ipv6 unicast-routing`**, which enables IPv6 routing on the relevant IOS platform and allows normal router-advertisement operation.

R1's three-subnet configuration is:

```text
R1(config)# ipv6 unicast-routing
R1(config)# interface gigabitethernet 0/0/0
R1(config-if)# ipv6 address 2001:db8:acad:1::1/64
R1(config-if)# no shutdown
R1(config-if)# exit
R1(config)# interface gigabitethernet 0/0/1
R1(config-if)# ipv6 address 2001:db8:acad:2::1/64
R1(config-if)# no shutdown
R1(config-if)# exit
R1(config)# interface serial 0/1/0
R1(config-if)# ipv6 address 2001:db8:acad:3::1/64
R1(config-if)# no shutdown
```

These are instructional commands for the illustrated interfaces, not a complete production configuration. Interface names and defaults depend on the platform.

### Host settings and gateway choice

A manually configured host needs an address, prefix length, a route through a gateway when reaching other networks, and DNS settings when name resolution is required. The source's Windows example enters:

```text
IPv6 address:         2001:db8:acad:1::10
Subnet prefix length: 64
Default gateway:      2001:db8:acad:1::1
```

The router's GUA can work as a static gateway, but its **LLA is generally preferable**. A next hop must be reachable on the local link; its own address need not be globally routable. A stable link-local gateway survives changes to the site's global prefix, whereas a gateway entered using an obsolete GUA would need updating.

### A memorable link-local gateway

To configure the source's explicit LLA example:

```text
R1(config)# interface gigabitethernet 0/0/0
R1(config-if)# ipv6 address fe80::1:1 link-local
R1(config-if)# no shutdown
R1(config-if)# exit
```

`link-local` distinguishes this from a global assignment. Administrators may use a short `fe80::1` on each separate link, or different suffixes to identify router interfaces more easily. Uniqueness is required on each link, not across all links.

In the Cisco example, assigning a GUA also enables IPv6 on the interface and causes an LLA to appear. This is a configuration trigger, not a universal protocol rule that GUAs must precede LLAs. Hosts can form LLAs before acquiring any global address.

## Practice

No native IPv6 quiz questions are assigned. This teaching is retained for study and revision.

Check the [review queue](review.md) before scored practice; flagged questions retain their original keys. The [manifest](manifest.json) separates additional required lessons from optional background.

## Source

- [Lecture: 5. Static configuration](../../lectures/lecture_03_ipv6.md#5-static-configuration)

[Topic overview](README.md) · [Glossary](glossary.md) · [References](references.md) · [Previous lesson](06_subnetting.md) · [Next lesson](08_slaac_and_dhcpv6.md)
