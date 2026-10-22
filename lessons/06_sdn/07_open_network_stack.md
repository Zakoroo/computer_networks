---
id: sdn-07
topic_id: 06_sdn
order: 7
title: "From integrated appliances to an open network stack"
source_classification: lecture_guide
estimated_reading_minutes: 2
prerequisite_ids: ["sdn-01"]
---

# 7. From integrated appliances to an open network stack

## Learning goals

- Explain how an exposed forwarding interface separates control from vendor hardware.
- Identify the controller platform, network view, and compatible forwarding devices.

## Explanation

## 3. SDN Architecture: Network OS, Control Programs, and Virtualization

### 3.1 Vertically Integrated Appliances vs. Open Horizontal SDN Stack

Historically, networking equipment followed a closed, vertically integrated mainframe model: each vendor bundled millions of lines of complex protocol features (`Feature`), a proprietary closed-source router OS (`OS`), and specialized `Custom Hardware` inside a single box.

SDN transforms networking into a horizontal, modular ecosystem analogous to modern computing:

| Layer | Vertically integrated model | SDN decomposition |
| --- | --- | --- |
| Policy and features | Features tied to each vendor's device software | Control applications over a network abstraction |
| Control software | Per-device router OS and protocols | Reusable controller platform |
| Forwarding interface | Often vendor-specific internal interfaces | Exposed interface such as OpenFlow |
| Hardware | Vendor-controlled appliance | Compatible physical or virtual switches, often using merchant silicon |

This is an architectural comparison, not a claim that SDN hardware must be open-source or that traditional equipment offers no APIs.

The decomposition needs three components:

1. **An open interface to packet forwarding** (such as OpenFlow), decoupling control software from vendor hardware.
2. **At least one Network OS** (and in practice many competing open- and closed-source platforms).
3. **A consistent, up-to-date global network view** exposed to control programs.

## Practice

Use [quiz 06](../../quizzes/quiz_06_sdn.json); Q-numbers retain the original question order.

- **Q016** (`sdn-q016`). No additional required lesson.

## Source

- [Lecture: 3.1 Vertically Integrated Appliances vs. Open Horizontal SDN Stack](../../lectures/lecture_06_sdn.md#31-vertically-integrated-appliances-vs-open-horizontal-sdn-stack)

[Topic overview](README.md) · [Glossary](glossary.md) · [References](references.md) · [Previous lesson](06_routing_and_acls.md) · [Next lesson](08_network_os.md)
