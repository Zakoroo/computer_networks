---
id: sdn-08
topic_id: 06_sdn
order: 8
title: "The Network OS and control programs"
source_classification: lecture_guide
estimated_reading_minutes: 2
prerequisite_ids: ["sdn-07"]
---

# 8. The Network OS and control programs

## Learning goals

- Distinguish network-state collection from forwarding directives.
- Explain control-program inputs, outputs, and distributed-state limitations.

## Explanation

### 3.2 The Network OS (NOS) and Control Programs

#### The Network OS (NOS)
A **Network OS** is a **distributed system** running across one or more controller servers in the network that creates and maintains a **network-wide view with defined consistency and freshness properties** (a graph/database of all switches, ports, links, hosts, and traffic statistics).

* **Examples of Network OS platforms:** `NOX`, `ONIX`, `Floodlight`, `Trema`, `OpenDaylight`, `HyperFlow`, `Kandoo`, `Beehive`, `Beacon`, `Maestro`, and others.
* **Two directions of interaction via the forwarding abstraction:**
  1. **Upward (State collection):** Gathers state information, topology changes, and flow counters from forwarding elements.
  2. **Downward (Control directives):** Pushes forwarding rules and control directives down to forwarding elements.

#### The Control Program
A **Control Program** operates on top of the global network view provided by the Network OS:

* **Input:** The global network view (a graph or database of the network).
* **Output:** The desired configuration/forwarding behavior of each network device.
* **Key Software Engineering Advantage:** **The control program can be written against a centralized abstraction.** The Network OS abstraction handles much of the detail of distributed state synchronization, fault tolerance, and message passing, allowing the programmer to write a graph algorithm over the provided topology. The application must still account for stale observations, failures, and non-atomic switch updates. A controller cluster does not make those effects disappear.

## Practice

Use [quiz 06](../../quizzes/quiz_06_sdn.json); Q-numbers retain the original question order.

- **Q004** (`sdn-q004`). No additional required lesson.
- **Q008** (`sdn-q008`). No additional required lesson.

## Source

- [Lecture: 3.2 The Network OS (NOS) and Control Programs](../../lectures/lecture_06_sdn.md#32-the-network-os-nos-and-control-programs)
- [Lecture: The Network OS (NOS)](../../lectures/lecture_06_sdn.md#the-network-os-nos)
- [Lecture: The Control Program](../../lectures/lecture_06_sdn.md#the-control-program)

[Topic overview](README.md) · [Glossary](glossary.md) · [References](references.md) · [Previous lesson](07_open_network_stack.md) · [Next lesson](09_forwarding_abstraction.md)
