---
id: tcp-11
topic_id: 04_tcp
order: 11
title: "Why AIMD approaches a fair share"
source_classification: lecture_guide
estimated_reading_minutes: 3
prerequisite_ids: ["tcp-10"]
---

# 11. Why AIMD approaches a fair share

## Learning goals

- Compare additive and multiplicative window updates.
- Explain AIMD convergence in the two-user bottleneck model.

**Builds on:** [lesson 10](10_congestion_feedback.md).

## Explanation

**Editorial clarification:** The equal-share argument below is the source's simplified two-user shared-bottleneck model. It is not a guarantee that flows with different RTTs or different controllers always obtain equal throughput.

#### Why AIMD? Comparing Window Update Schemes

To understand why TCP uses **Additive Increase, Multiplicative Decrease (AIMD)**—pioneered by Dah-Ming Chiu and Raj Jain (1989) and incorporated into TCP by Van Jacobson (1988)—consider the performance and fairness properties of pure multiplicative vs. pure additive updates:

1. **Pure Multiplicative Update (MI/MD):**
   - *No congestion:* $\text{CWND}_{\text{new}} = 2 \cdot \text{CWND}_{\text{old}}$
   - *Congestion:* $\text{CWND}_{\text{new}} = \frac{\text{CWND}_{\text{old}}}{2}$
   - *Evaluation:* Provides a **fast response**, but is **unfair**. Multiplying or dividing both flows by $2$ leaves the **ratio** of their bandwidth shares completely unchanged; a flow that starts with more bandwidth permanently dominates.

2. **Pure Additive Update (AI/AD):**
   - *No congestion:* $\text{CWND}_{\text{new}} = \text{CWND}_{\text{old}} + 1$
   - *Congestion:* $\text{CWND}_{\text{new}} = \text{CWND}_{\text{old}} - 1$
   - *Evaluation:* Divides spare bandwidth equally, but exhibits a **slow response** during overload and **unfairness**: adding and subtracting a constant leaves the **absolute difference** between two flows' rates unchanged.

3. **AIMD Scheme (Additive Increase, Multiplicative Decrease):**
   - **Additive Increase ($\text{CWND}_{\text{new}} = \text{CWND}_{\text{old}} + 1\text{ MSS}$ per RTT):** Gradually probes for spare bandwidth. Because both competing flows increase by the same constant amount, the **ratio** between their rates improves toward $1:1$ (fairness improves).
   - **Multiplicative Decrease ($\text{CWND}_{\text{new}} = \frac{\text{CWND}_{\text{old}}}{2}$ on loss):** Provides a **fast response** to overload. Although halving preserves the ratio momentarily, **connections that are overusing resources lose a larger absolute amount of bandwidth** during multiplicative decreases, allowing connections using less than their fair share to catch up during the subsequent additive increase phase.

This produces the classic **AIMD sawtooth behavior**, continually probing for available bandwidth until loss occurs and backing off by half.

#### Geometric Convergence of Two Users Sharing One Bottleneck Link

Chiu and Jain (1989) proved that AIMD converges to an **efficient and fair** operating point using a 2D phase-plane vector diagram where the X-axis represents the transmission rate of User 1 ($x_1$) and the Y-axis represents the transmission rate of User 2 ($x_2$) sharing a link of capacity $C$:

- **Efficiency line ($x_1 + x_2 = C$):** Any point below this negatively sloped line underutilizes the link; any point above it exceeds the link's bandwidth limit (causing packet drops).
- **Fairness line ($x_1 = x_2$):** The $45^\circ$ diagonal line where both users receive an equal share of the link.
- **Trajectory:** Starting from an unfair point (e.g., $x_1 < x_2$), **Additive Increase** moves the system along a $45^\circ$ vector $(+\Delta, +\Delta)$ parallel to the fairness line until total throughput crosses the bandwidth limit $x_1 + x_2 > C$. Upon congestion, **Multiplicative Decrease** pulls the operating point halfway back toward the origin $(0,0)$ along the radial line connecting the current point to the origin: $(x_1, x_2) \to (\frac{x_1}{2}, \frac{x_2}{2})$. Repeated cycles of $45^\circ$ up-and-right increases followed by radial-to-origin halvings force the trajectory to oscillate tightly around the intersection of the **Fairness line** and the **Bandwidth limit** $(\frac{C}{2}, \frac{C}{2})$.

## Practice

- **Q013** in [quiz 04](../../quizzes/quiz_04_tcp.json).
- **Q021** in [quiz 04](../../quizzes/quiz_04_tcp.json).

The [review queue](review.md) separates coverage from wording and supplementary scope. Mapped questions here need no additional required lessons; the [manifest](manifest.json) lists optional background. Original keys and manual tags are preserved.

## Source

- [Lecture: Why AIMD? Comparing Window Update Schemes](../../lectures/lecture_04_tcp-ip.md#why-aimd-comparing-window-update-schemes)
- [Lecture: Geometric Convergence of Two Users Sharing One Bottleneck Link](../../lectures/lecture_04_tcp-ip.md#geometric-convergence-of-two-users-sharing-one-bottleneck-link)

[Topic overview](README.md) · [Glossary](glossary.md) · [References](references.md) · [Previous lesson](10_congestion_feedback.md) · [Next lesson](12_slow_start_tahoe.md)
