---
id: sdn-04
topic_id: 06_sdn
order: 4
title: "Indirect control and uncoordinated updates"
source_classification: lecture_guide
estimated_reading_minutes: 1
prerequisite_ids: ["sdn-03"]
---

# 4. Indirect control and uncoordinated updates

## Learning goals

- Explain why adjusting metrics differs from installing an explicit path.
- Identify transient failures caused by asynchronous updates and interacting mechanisms.

## Explanation

### 2.3 Why Traditional Networks Are Hard to Reason About and Evolve

In conventional networks where control is tightly coupled to each router's software and distributed protocols, operators face four structural problems:

1. **(Too) many task-specific control mechanisms:** Separate, non-modular protocols exist for every narrow task (OSPF, BGP, VLANs, Spanning Tree, MPLS, ACLs), offering limited functionality and limited modularity across vendor and protocol boundaries.
2. **Indirect control:** Operators cannot directly program the paths they want. Instead, they must **invert protocol behavior** and "coax" distributed protocols into doing what they want—such as tweaking OSPF link weights by trial and error to shift traffic away from a congested link.
3. **Uncoordinated control:** Because routers run asynchronous distributed algorithms, ordinary asynchronous protocol operation does not by itself give the operator a network-wide atomic update during a topology or policy change, leading to transient forwarding loops, black holes, or security violations.
4. **Complex interacting protocols and mechanisms:** Routing, IP addressing, access control filters, and Quality of Service (QoS) interact in subtle, brittle ways.

Consequently, traditional networks are **hard to reason about, hard to evolve, and expensive to operate**.

## Practice

Use [quiz 06](../../quizzes/quiz_06_sdn.json); Q-numbers retain the original question order.

- **Q010** (`sdn-q010`). No additional required lesson.

## Source

- [Lecture: 2.3 Why Traditional Networks Are Hard to Reason About and Evolve](../../lectures/lecture_06_sdn.md#23-why-traditional-networks-are-hard-to-reason-about-and-evolve)

[Topic overview](README.md) · [Glossary](glossary.md) · [References](references.md) · [Previous lesson](03_networking_planes.md) · [Next lesson](05_bgp_policy_limits.md)
