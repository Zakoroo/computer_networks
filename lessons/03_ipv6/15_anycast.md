---
id: ipv6-15
topic_id: 03_ipv6
order: 15
title: "Anycast, DNS selection, and service continuity"
source_classification: lecture_guide
estimated_reading_minutes: 3
prerequisite_ids: ["ipv6-04", "ipv6-14"]
---

# 15. Anycast, DNS selection, and service continuity

## Learning goals

- Contrast route-selected instances with multicast and DNS-based address selection.
- Explain root service replication and stateful-session risks during route changes.

**Builds on:** [Delivery types and global unicast structure](04_address_types.md), [Multicast replication, membership, and scope](14_multicast.md).

## Explanation

**Anycast reaches one member of a set**, rather than all members. At the IP layer, several service instances use the same address, and the routing system selects a path to one of them. “Nearest” means preferred by routing policy and metrics, not necessarily geographically closest or lowest-latency.

An anycast address has the **same format as a unicast address**. There is no multicast-like prefix identifying it. The property arises from address assignment and route advertisement. Ordinary route selection and forwarding apply: the routing system chooses routes, and forwarding uses longest-prefix matching on the installed information.

### DNS selection versus IP anycast

The historical example returns several addresses:

```dns
www.google.com.   604799 IN CNAME www.l.google.com.
www.l.google.com. 300    IN A 74.125.19.103
www.l.google.com. 300    IN A 74.125.19.104
www.l.google.com. 300    IN A 74.125.19.147
www.l.google.com. 300    IN A 74.125.19.99
```

The lecture describes this loosely as application-layer anycast: the name names a service set and the client chooses an address. **Technical clarification:** multiple A records demonstrate DNS-based selection or load distribution, not proof of IP anycast. A DNS reply does not establish that those servers occupy different geographic sites or that the client chooses the closest one.

| Mechanism | What varies | Who chooses an instance? |
|---|---|---|
| DNS-based service selection | One name can return several distinct addresses | DNS policy and client address selection |
| IP anycast | The same destination address is reachable at several sites | IP routing |

### Root servers and operational consequences

DNS root service has **13 named identities**, backed by many physical instances. The lecture cites more than a thousand instances as a deployment-scale example, not a fixed limit. An identity can advertise its address from multiple sites. If a failed site withdraws its route, traffic can move elsewhere without clients needing a different DNS destination address.

Failure recovery is partly delegated to routing. **It is not necessarily instantaneous or invisible:** service-health detection, route withdrawal, convergence, retries, and connection state still matter.

Examples include the Cloudflare resolver's IPv6 service address **`2606:4700:4700::1111`**, corresponding to its `1.1.1.1` service, and Google's IPv4 resolver **`8.8.8.8`**. Subnet-Router Anycast is a separate local example using an all-zero IID.

The source suggests comparing `traceroute 8.8.8.8` from different locations using [PerfOps network utilities](https://panel.perfops.net/tools/network-utilities). Different paths illustrate route-dependent instance selection; a trace alone may not reveal every detail of the backend deployment.

Anycast is especially convenient when requests can be served independently, such as many DNS exchanges. Routing may change which instance receives subsequent packets. Long-lived or stateful services need a design that handles that possibility; the use of anycast by CDNs does not mean arbitrary mid-connection movement is harmless.

## Practice

Assigned IPv6 questions: Q005, Q019, Q022.

External routing practice: Routing Q086.

Check the [review queue](review.md) before scored practice; flagged questions retain their original keys. The [manifest](manifest.json) separates additional required lessons from optional background.

## Source

- [Lecture: 9. Anycast and routing](../../lectures/lecture_03_ipv6.md#9-anycast-and-routing)

[Topic overview](README.md) · [Glossary](glossary.md) · [References](references.md) · [Previous lesson](14_multicast.md) · [Next lesson](16_base_header.md)
