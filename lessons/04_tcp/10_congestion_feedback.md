---
id: tcp-10
topic_id: 04_tcp
order: 10
title: "End-to-end feedback and CWND"
source_classification: lecture_guide
estimated_reading_minutes: 1
prerequisite_ids: ["tcp-08", "tcp-09"]
---

# 10. End-to-end feedback and CWND

## Learning goals

- Explain the sender congestion window as a response to network feedback.
- Relate approximate throughput to window size and RTT.

**Builds on:** [lesson 08](08_flow_control.md), [lesson 09](09_congestion_goals.md).

## Explanation

### 3.2 End-to-End Feedback and the AIMD Control Law

In classical TCP, congestion control operates **end-to-end** without explicit assistance from network routers. The network acts as a black box whose internal congestion state is inferred through an **alarm flag observable at the end stations**—specifically, via packet acknowledgments returned every $\text{RTT}$:
- **Smoothly arriving ACKs** indicate low congestion, prompting the sender to **increase** its sending rate (larger congestion window `CWND`).
- **Missing ACKs (timeouts) or duplicate ACKs** indicate high congestion (buffer overflow), prompting the sender to **decrease** its sending rate (smaller `CWND`).

The TCP sender limits its transmission by maintaining a **Congestion Window (`CWND`)**, which represents the maximum number of unacknowledged bytes or segments that the sender can have in transit at any given time. If a sender transmits $w$ segments of size $\text{MSS}$ bytes in one $\text{RTT}$ ($\text{CWND} = w \cdot \text{MSS}$), its approximate throughput is:

$$\text{Throughput} = \frac{\text{CWND}}{\text{RTT}} = \frac{w \cdot \text{MSS}}{\text{RTT}}\text{ bytes/sec}$$

## Practice

- **Q012** in [quiz 04](../../quizzes/quiz_04_tcp.json).

The [review queue](review.md) separates coverage from wording and supplementary scope. Mapped questions here need no additional required lessons; the [manifest](manifest.json) lists optional background. Original keys and manual tags are preserved.

## Source

- [Lecture: 3.2 End-to-End Feedback and the AIMD Control Law](../../lectures/lecture_04_tcp-ip.md#32-end-to-end-feedback-and-the-aimd-control-law)

[Topic overview](README.md) · [Glossary](glossary.md) · [References](references.md) · [Previous lesson](09_congestion_goals.md) · [Next lesson](11_aimd_fairness.md)
