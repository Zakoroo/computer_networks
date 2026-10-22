---
id: sdn-16
topic_id: 06_sdn
order: 16
title: "Out-of-band and in-band controller reachability"
source_classification: lecture_guide
estimated_reading_minutes: 2
prerequisite_ids: ["sdn-01", "sdn-13"]
---

# 16. Out-of-band and in-band controller reachability

## Learning goals

- Compare shared data links with a separate management path.
- Explain cost, fault domains, redundancy, and bootstrap requirements.

## Explanation

### 4.3 Out-of-Band vs. In-Band SDN Control Planes

How do the switches and the SDN controller physically exchange OpenFlow control messages (`Packet-IN`, `Flow-MOD`, `Packet-OUT`, heartbeats)? There are two architectural models:

| Control arrangement | Shared resources | Main trade-off |
| --- | --- | --- |
| Out-of-band | Separate management path; physical isolation depends on construction | Simpler bootstrap and fault separation, at extra infrastructure cost |
| In-band | Control and data use the same forwarding links | Reuses connectivity, but needs protected control reachability during bootstrap, congestion, and failure |

1. **Out-of-Band SDN Control:**
   * Control traffic uses a separate management path, typically through a dedicated management interface. Logical separation alone can still share physical failures and congestion with data traffic (`Controller A`).
   * **Characteristics:** Can isolate control traffic from data congestion and some failures, simplifying bootstrapping. Availability still depends on redundancy and shared failure domains. A physically separate network adds equipment and cabling cost (common in data centers, expensive in wide-area networks).

2. **In-Band SDN Control:**
   * Control traffic is **multiplexed directly alongside data-plane traffic** over the same shared physical switch ports and links (`Controller B`).
   * **Benefits:**
     * **Lower cost:** No separate physical cabling or management switch fabric required.
     * **Potential path redundancy:** Control traffic can take advantage of the rich multi-path redundancy of the data-plane topology if a link fails (though it requires self-stabilizing/fault-tolerant bootstrapping so switches can reach the controller before flow rules are installed).

---

## Practice

Use [quiz 06](../../quizzes/quiz_06_sdn.json); Q-numbers retain the original question order.

- **Q006** (`sdn-q006`). No additional required lesson.

## Source

- [Lecture: 4.3 Out-of-Band vs. In-Band SDN Control Planes](../../lectures/lecture_06_sdn.md#43-out-of-band-vs-in-band-sdn-control-planes)

[Topic overview](README.md) · [Glossary](glossary.md) · [References](references.md) · [Previous lesson](15_reactive_handshake.md) · [Next lesson](17_history.md)
