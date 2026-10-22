---
id: tcp-17
topic_id: 04_tcp
order: 17
title: "Modern transport evolution and CUBIC"
source_classification: lecture_guide
estimated_reading_minutes: 3
prerequisite_ids: ["tcp-12", "tcp-14"]
---

# 17. Modern transport evolution and CUBIC

## Learning goals

- Identify the six developments motivating modern transport control.
- Explain CUBIC window growth around the previous maximum and time K.

**Builds on:** [lesson 12](12_slow_start_tahoe.md), [lesson 14](14_reno_fast_recovery.md).

## Explanation

**Source context:** Deployment and popularity statements below are preserved from the guide generated on 20 October 2026; they are not new measurements or independently refreshed claims.

## 4. Modern Transport Evolution: Beyond Loss-Based Control

The classical textbook story of TCP congestion control ends around 1996 with Tahoe, Reno, NewReno, and SACK. Over the subsequent thirty years, congestion control stopped being a "solved problem" and became an active battleground driven by six major developments:
1. **CUBIC** becoming the default loss-based algorithm in Linux and web servers.
2. **Bufferbloat** exposing a fundamental flaw in loss-based congestion control.
3. **Active Queue Management (AQM)** such as CoDel and FQ-CoDel moving queue control into routers.
4. **BBR** replacing loss-based reaction with path-capacity modeling.
5. **ECN and L4S** redesigning network congestion signaling for near-zero queueing delay.
6. **QUIC** moving transport and congestion control out of the OS kernel and into application userspace.

#### TCP CUBIC

**TCP CUBIC** replaced Reno/NewReno as the default congestion control algorithm in Linux and the most popular TCP variant on web servers. Instead of Reno's linear additive increase, CUBIC adjusts `CWND` using a **cubic function of time** elapsed since the last loss event:

$$\text{CWND}(t) \propto (t - K)^3 + W_{\max}$$

where $W_{\max}$ is the window size just before the previous loss occurred, and $K$ is the time period required for the window to grow back to $W_{\max}$ in the absence of further loss:
- When `CWND` is far below $W_{\max}$ (early after a loss) or far above $W_{\max}$ (probing for new bandwidth), the cubic curve is steep, yielding a **large increase**.
- When `CWND` is **near $W_{\max}$** (around time $t \approx K$), the cubic curve flattens into a plateau, yielding a **very small increase** so the sender hovers stably near the bottleneck's previous capacity without immediately triggering another packet drop.

*(Note: Slide 82 contains a typo in its bullet text—"Large increase when near K, small increase near K"—which contradicts its accompanying graph; as shown in the slide's plot of $W_{\max}$ across times $t_0 \dots t_4$, CUBIC grows rapidly right after loss, flattens into a small increase near the $W_{\max}$ plateau at $K$, and accelerates again past $K$ if no loss occurs.)*

## Practice

No native TCP quiz questions are assigned. This teaching is retained for study and revision.

The [review queue](review.md) separates coverage from wording and supplementary scope. Mapped questions here need no additional required lessons; the [manifest](manifest.json) lists optional background. Original keys and manual tags are preserved.

## Source

- [Lecture: 4. Modern Transport Evolution: Beyond Loss-Based Control](../../lectures/lecture_04_tcp-ip.md#4-modern-transport-evolution-beyond-loss-based-control)
- [Lecture: TCP CUBIC](../../lectures/lecture_04_tcp-ip.md#tcp-cubic)

[Topic overview](README.md) · [Glossary](glossary.md) · [References](references.md) · [Previous lesson](16_tcp_history.md) · [Next lesson](18_bufferbloat_aqm.md)
