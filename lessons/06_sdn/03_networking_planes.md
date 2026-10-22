---
id: sdn-03
topic_id: 06_sdn
order: 3
title: "Data, control, and management responsibilities"
source_classification: lecture_guide
estimated_reading_minutes: 2
prerequisite_ids: ["sdn-01"]
---

# 3. Data, control, and management responsibilities

## Learning goals

- Classify packet processing, route computation, and operational policy.
- Explain indirect OSPF traffic engineering and indicative timescales.

## Explanation

## 2. The Three Networking Planes and Traditional Network Challenges

### 2.1 Data, Control, and Management Planes

The **data plane** handles individual packets using local forwarding state. It matches headers and applies actions such as forwarding, filtering, buffering, or scheduling. A hardware router commonly implements this work in line cards and a switching fabric, while software switches implement it in code. For example, destination `1.2.3.7` can match `1.2.3.0/24 → LAN 1`; a different prefix, `5.6.7.0/24`, can map to a WAN interface.

The **control plane** computes that forwarding state. It handles routing, path selection, circuit setup, and failure recovery. In OSPF or IS-IS, routers flood descriptions of their local links within a routing scope, then independently run a shortest-path calculation on the resulting topology. The protocol is distributed even though each router can obtain a topology map.

The **management plane** defines and maintains operational intent: provisioning devices, configuring ACLs, monitoring traffic, and setting policy. In ordinary OSPF traffic engineering, an operator adjusts integer link weights to influence the paths Dijkstra selects. Weights might reflect capacity, propagation delay, or an optimization using a traffic matrix. This is indirect control: choosing weights is not the same operation as installing an explicit end-to-end path.

The boundaries overlap in practice. Traffic engineering, for example, can include management policy, control-plane computation, and data-plane enforcement.

### 2.2 Comparison of Operational Timescales, Tasks, and Locations

The planes describe responsibilities, not rigid deployment rules. These are indicative timescales; automated management and local failure recovery can operate much faster:

| Property | Data Plane | Control Plane | Management Plane |
|---|---|---|---|
| **Timescale** | **Per packet** (hardware can act at nanosecond scales) | **Event** ($10\text{ ms}$ to $\text{seconds}$) | **Policy/operations** (often seconds to hours) |
| **Core Tasks** | Forwarding, buffering, filtering, scheduling | Routing, circuit setup, failure recovery | Traffic analysis, ACL/weight configuration, provisioning |
| **Execution Location** | Line-card hardware (ASICs / TCAM) | Router software (or SDN controller) | Humans or management scripts |

## Practice

No native quiz question has this lesson as its primary assignment. The source teaching remains included; this lesson may provide required or optional support listed in the [manifest](manifest.json).

## Source

- [Lecture: 2.1 Data, Control, and Management Planes](../../lectures/lecture_06_sdn.md#21-data-control-and-management-planes)
- [Lecture: 2.2 Comparison of Operational Timescales, Tasks, and Locations](../../lectures/lecture_06_sdn.md#22-comparison-of-operational-timescales-tasks-and-locations)

[Topic overview](README.md) · [Glossary](glossary.md) · [References](references.md) · [Previous lesson](02_adoption.md) · [Next lesson](04_traditional_control.md)
