---
id: tcp-09
topic_id: 04_tcp
order: 9
title: "Congestion, goodput, and fairness"
source_classification: lecture_guide
estimated_reading_minutes: 2
prerequisite_ids: ["tcp-05"]
---

# 9. Congestion, goodput, and fairness

## Learning goals

- Explain how overload causes loss, queueing, and wasted retransmissions.
- Identify efficient utilization and fair sharing as congestion-control goals.

**Builds on:** [lesson 05](05_pipelining.md).

## Explanation

**Editorial clarification:** Read the source's QoS bullet as a design goal. Congestion control by itself does not supply a minimum-bandwidth or delay guarantee; the TCP/UDP service comparison explicitly excludes those guarantees.

## 3. Principles of Congestion Control and Classical TCP

### 3.1 Causes, Consequences, and Goals of Congestion Control

**Network congestion** occurs when the aggregate demand for network resources (such as link bandwidth, router buffer memory, and processing capacity) surpasses what the network can provide. Informally, it means *"too many sources sending too much data too fast for the network to handle."*

It is essential to distinguish **flow control** from **congestion control**:
- **Flow control** is a point-to-point issue: *one sender* transmitting too fast for *one specific receiver's buffer*.
- **Congestion control** is a shared-network issue: *too many senders* transmitting too fast for the *routers and links inside the network core*.

#### Consequences of Unchecked Congestion
1. **Increased Latency:** As congestion builds, packets spend long periods waiting in router queues (queueing delay), increasing end-to-end latency.
2. **Packet Loss:** When router memory buffers overflow, routers drop incoming packets.
3. **Reduced Throughput:** Dropped packets must be retransmitted, wasting link capacity and reducing useful data transfer rates (goodput).
4. **Degraded User Experience:** Slow-loading websites, buffering video streams, and sluggish response times for interactive applications.

#### Goals of Congestion Control
1. **Preventing Collapse:** Regulate data flow to avoid overwhelming routers and prevent **congestion collapse** (a state where the network is saturated with retransmissions and delivers minimal useful data).
2. **Fair Resource Sharing:** Ensure a fair distribution of bottleneck bandwidth among competing users, applications, and connections.
3. **Ensuring Quality of Service (QoS):** Uphold minimum performance levels (bandwidth, low latency, reliable delivery).
4. **Enhancing User Experience:** Maintain smooth, responsive application performance.

## Practice

- **Q011** in [quiz 04](../../quizzes/quiz_04_tcp.json).

The [review queue](review.md) separates coverage from wording and supplementary scope. Mapped questions here need no additional required lessons; the [manifest](manifest.json) lists optional background. Original keys and manual tags are preserved.

## Source

- [Lecture: 3. Principles of Congestion Control and Classical TCP](../../lectures/lecture_04_tcp-ip.md#3-principles-of-congestion-control-and-classical-tcp)
- [Lecture: 3.1 Causes, Consequences, and Goals of Congestion Control](../../lectures/lecture_04_tcp-ip.md#31-causes-consequences-and-goals-of-congestion-control)

[Topic overview](README.md) · [Glossary](glossary.md) · [References](references.md) · [Previous lesson](08_flow_control.md) · [Next lesson](10_congestion_feedback.md)
