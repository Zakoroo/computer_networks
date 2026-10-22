---
id: sdn-05
topic_id: 06_sdn
order: 5
title: "BGP policy limits and cooperating SDN domains"
source_classification: lecture_guide
estimated_reading_minutes: 2
prerequisite_ids: ["sdn-04"]
---

# 5. BGP policy limits and cooperating SDN domains

## Learning goals

- Explain destination-based forwarding and the limits of BGP policy influence.
- Describe what an SDN cluster can coordinate within participating ASes.

## Explanation

### 2.4 Motivating Case Study 1: Inter-Domain Routing (BGP Limitations)

Today's inter-domain routing protocol, **BGP (Border Gateway Protocol)**, provides a specific set of inter-domain control mechanisms that constrains how Autonomous Systems (ASes) can route traffic:

* **Destination-only routing:** Ordinary IP forwarding based on BGP routes selects destination prefixes, making it very difficult to incorporate application-level or flow-level information.
* **Neighbor-only influence:** An AS directly controls its own policies and advertisements to BGP peers. Those advertisements can influence distant ASes, but cannot dictate their policy or install their forwarding rules.

As a result, operators struggle to implement critical real-world policies such as:

* **Application-specific peering:** Routing latency-sensitive video traffic over one peering path and bulk non-video traffic over another.
* **Blocking Denial-of-Service (DoS) traffic:** Dropping unwanted attack traffic several hops further upstream before it saturates a peering link.
* **Inbound traffic engineering:** Finely splitting incoming traffic across multiple peering links.

As explored in **Software-Defined Inter-Domain Routing** (Chen et al., IEEE ICC 2016), grouping cooperating ASes into an **SDN cluster** managed by a logically centralized controller (with separate logical **control relationships** and **data links**) can coordinate richer policies within the cooperating cluster. It does not grant control over nonparticipating ASes; deploying upstream filtering still requires cooperation.

## Practice

No native quiz question has this lesson as its primary assignment. The source teaching remains included; this lesson may provide required or optional support listed in the [manifest](manifest.json).

## Source

- [Lecture: 2.4 Motivating Case Study 1: Inter-Domain Routing (BGP Limitations)](../../lectures/lecture_06_sdn.md#24-motivating-case-study-1-inter-domain-routing-bgp-limitations)

[Topic overview](README.md) · [Glossary](glossary.md) · [References](references.md) · [Previous lesson](04_traditional_control.md) · [Next lesson](06_routing_and_acls.md)
