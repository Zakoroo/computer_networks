---
id: tcp-12
topic_id: 04_tcp
order: 12
title: "Slow start, congestion avoidance, and Tahoe"
source_classification: lecture_guide
estimated_reading_minutes: 3
prerequisite_ids: ["tcp-10", "tcp-11"]
---

# 12. Slow start, congestion avoidance, and Tahoe

## Learning goals

- Distinguish exponential slow start from linear congestion avoidance.
- Trace Tahoe window and threshold changes after loss.

**Builds on:** [lesson 10](10_congestion_feedback.md), [lesson 11](11_aimd_fairness.md).

## Explanation

### 3.3 TCP Slow Start and Congestion Avoidance (TCP Tahoe)

Designed by Van Jacobson in 1988, classical TCP congestion control has scaled across a $>200,000\times$ increase in Internet bandwidth by combining two distinct phases governed by a state variable called the **Slow Start Threshold (`ssthresh`)**:

1. **Initialization — Slow Start / Mild Increase (MI):**
   When a connection begins, `CWND` is initialized to $1\text{ MSS}$. Because starting with additive increase would take too long to reach high speeds, TCP increases `CWND` by $1\text{ MSS}$ for **every single ACK received**:
   ```text
   initialize: CWND = 1
   for (each segment ACKed)
       CWND++
   until (congestion event OR CWND > ssthresh)
   ```
   This results in an **exponential increase per RTT** (e.g., $1 \to 2 \to 4 \to 8 \to 16\text{ segments}$, or $6 \to 12 \to 24$ in modern stacks with a larger initial window)—so Slow Start is actually *not slow at all*.

2. **Steady State — Congestion Avoidance (AIMD):**
   Once $\text{CWND} \ge \text{ssthresh}$, TCP transitions from Slow Start to **Congestion Avoidance**, increasing `CWND` additively by only $1\text{ MSS}$ **per entire RTT** (roughly $\text{CWND} \leftarrow \text{CWND} + \frac{\text{MSS}^2}{\text{CWND}}$ on each arriving ACK).

> **Terminology Note on Slide Pseudocode:** The lecture slide titled *"TCP Taheo Congestion Avoidance"* writes the loop body inside Congestion Avoidance as `every ACK: CWND++` while simultaneously plotting a graph where `CWND` increases by $1$ segment **per transmission round (RTT)** (rising linearly from $8 \to 9 \to 10 \to 11 \to 12$ across rounds $3$ to $7$). Keep this distinction clear for exams: incrementing `CWND` by $1$ on *every individual ACK* doubles `CWND` each RTT (Slow Start), whereas during **Congestion Avoidance**, `CWND` increases by $1\text{ MSS}$ **per RTT** (i.e., once every full window of ACKs).

#### TCP Tahoe Behavior on Loss

In **TCP Tahoe** (4.3BSD Tahoe, 1988), whenever a loss event occurs—whether detected via a **timeout** or via **three duplicate ACKs (Fast Retransmit)**—Tahoe performs the following reset:
1. Sets $\text{ssthresh} = \frac{\text{CWND}}{2}$.
2. Resets $\text{CWND} = 1\text{ MSS}$.
3. Re-enters the **Slow Start** phase, growing exponentially until reaching the new `ssthresh`, and then switches back to linear Congestion Avoidance.

For example, if `ssthresh` starts at $8$, `CWND` grows exponentially in Slow Start during rounds $0 \to 3$ ($1 \to 2 \to 4 \to 8$), then grows linearly in Congestion Avoidance during rounds $3 \to 7$ ($8 \to 9 \to 10 \to 11 \to 12$). If a loss occurs at $\text{CWND} = 12$ (round $7$), Tahoe sets $\text{ssthresh} = \frac{12}{2} = 6$, drops $\text{CWND}$ to $1$ at round $8$, grows exponentially ($1 \to 2 \to 4 \to 6$) up to round $11$, and then grows linearly ($6 \to 7 \to 8 \to 9$) from round $11$ onward.

## Practice

- **Q014** in [quiz 04](../../quizzes/quiz_04_tcp.json).

The [review queue](review.md) separates coverage from wording and supplementary scope. Mapped questions here need no additional required lessons; the [manifest](manifest.json) lists optional background. Original keys and manual tags are preserved.

## Source

- [Lecture: 3.3 TCP Slow Start and Congestion Avoidance (TCP Tahoe)](../../lectures/lecture_04_tcp-ip.md#33-tcp-slow-start-and-congestion-avoidance-tcp-tahoe)

[Topic overview](README.md) · [Glossary](glossary.md) · [References](references.md) · [Previous lesson](11_aimd_fairness.md) · [Next lesson](13_fast_retransmit.md)
