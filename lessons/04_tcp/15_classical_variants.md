---
id: tcp-15
topic_id: 04_tcp
order: 15
title: "NewReno, SACK, Vegas, and Westwood †"
source_classification: supplementary_archived_slides
estimated_reading_minutes: 3
prerequisite_ids: ["tcp-14"]
---

# 15. NewReno, SACK, Vegas, and Westwood †

## Learning goals

- Compare recovery with cumulative ACKs, NewReno, SACK, and FACK.
- Identify RTT feedback in Vegas and ACK-rate bandwidth estimation in Westwood.

**Builds on:** [lesson 14](14_reno_fast_recovery.md).

## Explanation

**† Supplementary:** This material inherits the guide's archived/hidden-slide designation and may fall outside this year's examinable material.



### 3.5 Classical TCP Variants and Early Evolution †

*Note: While TCP Tahoe, Reno, SACK, CUBIC, Vegas, and ECN are introduced in visible slides, the detailed comparison slides and timeline below come from archived slides at the end of the presentation and are preserved here as supplementary reference material.*

#### Comparing Tahoe, Reno, NewReno, SACK, and Westwood †
- **Out-of-order buffering in Tahoe and Reno:** In both TCP Tahoe and TCP Reno, the receiver buffers out-of-order segments that fall within the receive window. When the missing segment is finally received via Fast Retransmit, the receiver sends a single **cumulative ACK** covering the missing segment and all contiguous buffered segments.
- **Reno vs. NewReno:** Standard TCP Reno exits Fast Recovery upon the first new ACK. If *multiple* packets were lost from a single window of data, Reno only recovers one lost packet per Fast Recovery cycle and can be forced into multiple halvings or a timeout. **TCP NewReno** (1996) modifies Fast Recovery to handle multiple packet losses within a single window (transmitting/recovering multiple lost packets before exiting Fast Recovery), reducing slowdowns and improving bandwidth utilization.
- **TCP SACK (Selective Acknowledgment, 1996):** Allows the receiver to explicitly list non-contiguous blocks of data that have arrived safely so the sender only retransmits the exact missing holes. **FACK (Forward Acknowledgment, 1996)** by Mathis et al. extended SACK to track the highest forward sequence number held at the receiver.
- **TCP Vegas (1993, Brakmo et al.):** Rather than waiting for packet loss, Vegas monitors variations in $\text{RTT}$. If the measured $\text{RTT}$ increases above the minimum baseline (indicating a building router queue), Vegas proactively decreases its sending rate before any packets are dropped, minimizing queueing delay. However, Vegas is not widely deployed because it loses bandwidth share when competing against loss-based flows that deliberately fill buffers.
- **TCP Westwood:** Estimates available bottleneck bandwidth by monitoring the arrival rate of returning `ACK` packets and uses that estimate to set `ssthresh` and `CWND` after a loss event, optimizing performance over high-speed, long-distance, or lossy wireless links.

## Practice

- **Q017** in [quiz 04](../../quizzes/quiz_04_tcp.json); flags: `supplementary_source`.
- **Q018** in [quiz 04](../../quizzes/quiz_04_tcp.json); flags: `supplementary_source`.
- **Q029** in [quiz 04](../../quizzes/quiz_04_tcp.json); flags: `supplementary_source`.

The [review queue](review.md) separates coverage from wording and supplementary scope. Mapped questions here need no additional required lessons; the [manifest](manifest.json) lists optional background. Original keys and manual tags are preserved.

## Source

- [Lecture: 3.5 Classical TCP Variants and Early Evolution †](../../lectures/lecture_04_tcp-ip.md#35-classical-tcp-variants-and-early-evolution-)
- [Lecture: Comparing Tahoe, Reno, NewReno, SACK, and Westwood †](../../lectures/lecture_04_tcp-ip.md#comparing-tahoe-reno-newreno-sack-and-westwood-)

[Topic overview](README.md) · [Glossary](glossary.md) · [References](references.md) · [Previous lesson](14_reno_fast_recovery.md) · [Next lesson](16_tcp_history.md)
