---
id: sdn-20
topic_id: 06_sdn
order: 20
title: "SDN and OpenFlow recap"
source_classification: lecture_guide
estimated_reading_minutes: 2
prerequisite_ids: ["sdn-19"]
---

# 20. SDN and OpenFlow recap

## Learning goals

- Connect architecture, abstractions, policy placement, and reactive forwarding.

## Explanation

## 6. Summary and Key Takeaways

* **Core Architectural Principle:** SDN decouples the **control plane** (event-timescale software that computes forwarding state) from the **data plane** (per-packet forwarding machinery that forwards packets based on `<Match, Action>` rules), placing a **logically centralized** (but physically distributed) **Network OS** in charge of multiple switches.
* **Solving Traditional Network Pathologies:** Traditional distributed control planes suffer from indirect control (e.g., tweaking link weights to coax Dijkstra's algorithm), uncoordinated updates, and brittle interactions between routing and access control (as demonstrated when adding a backup link between data centers silently bypassed static ACL filters).
* **Compiler Analogy:** SDN does not eliminate complexity; instead, like a compiler, it pushes distributed state management into reusable platform software (**Network OS** and **Network Hypervisor**) while exposing a clean global graph abstraction to user-written **Control Programs**.
* **OpenFlow Mechanics:** Switches match packet headers against prioritized `<Rule (exact/wildcard), Action, Statistics>` entries. Under the configured miss-to-controller policy, a switch can buffer the packet (`Buffer ID`) and send a `Packet-IN`, which can inject a one-shot `Packet-OUT` or install persistent forward/reverse rules via `Flow-MOD` (with `Idle Timeout`, `Hard Timeout`, and `Priority`) so matching packets can be forwarded locally while those rules remain installed.

## Practice

No native quiz question has this lesson as its primary assignment. The source teaching remains included; this lesson may provide required or optional support listed in the [manifest](manifest.json).

## Source

- [Lecture: 6. Summary and Key Takeaways](../../lectures/lecture_06_sdn.md#6-summary-and-key-takeaways)

[Topic overview](README.md) · [Glossary](glossary.md) · [References](references.md) · [Previous lesson](19_systems_challenges.md)
