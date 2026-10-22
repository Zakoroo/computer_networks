---
id: tcp-23
topic_id: 04_tcp
order: 23
title: "Wireless loss and other congestion-control limits"
source_classification: lecture_guide
estimated_reading_minutes: 2
prerequisite_ids: ["tcp-07", "tcp-18", "tcp-19"]
---

# 23. Wireless loss and other congestion-control limits

## Learning goals

- Explain why non-congestion loss confuses a loss-based sender.
- Describe adverse equilibria, route changes, and the limits of stability.

**Builds on:** [lesson 07](07_rtt_and_timeouts.md), [lesson 18](18_bufferbloat_aqm.md), [lesson 19](19_bbr.md).

## Explanation

**Editorial clarification:** The wireless-loss argument applies to the classical loss-based controllers described here. “Standard TCP” in Q028 needs that qualification; it is not a claim about every controller or every wireless path.

### 4.5 Fundamental Failure Modes of TCP Congestion Control

Even with decades of refinement, end-to-end congestion control faces fundamental structural limitations:

1. **Inability to distinguish congestion loss from non-congestion (wireless) loss:**
   A loss-based TCP sender cannot tell whether a packet was dropped because a router buffer overflowed or because of bit errors/interference on a **wireless link**. TCP backs off and cuts `CWND` either way, needlessly throttling throughput over noisy wireless channels.
2. **Adverse equilibria between competing algorithms:**
   When heterogeneous algorithms (such as Reno, CUBIC, Vegas, and BBR) share the same bottleneck link, their differing control laws interact to reach an equilibrium that **neither algorithm would choose alone** (for instance, loss-based flows starving delay-based Vegas flows, or BBR starving CUBIC in shallow buffers).
3. **Route flaps invalidating RTT estimators:**
   TCP's EWMA timeout estimator (`EstimatedRTT` and `DevRTT`) and delay-based controllers are built on the assumption that the underlying physical path's propagation delay is relatively stable. When a **route flap** suddenly switches packets onto a longer or shorter path, the RTT shifts abruptly underneath an estimator that assumes stability, triggering spurious timeouts or miscalibrated sending rates.
4. **Stability vs. Optimality:**
   *Convergence to a stable state is not convergence to a good one.*

---

## Practice

- **Q028** in [quiz 04](../../quizzes/quiz_04_tcp.json); flags: `wording_issue`.

The [review queue](review.md) separates coverage from wording and supplementary scope. Mapped questions here need no additional required lessons; the [manifest](manifest.json) lists optional background. Original keys and manual tags are preserved.

## Source

- [Lecture: 4.5 Fundamental Failure Modes of TCP Congestion Control](../../lectures/lecture_04_tcp-ip.md#45-fundamental-failure-modes-of-tcp-congestion-control)

[Topic overview](README.md) · [Glossary](glossary.md) · [References](references.md) · [Previous lesson](22_quic.md) · [Next lesson](24_study_resources.md)
