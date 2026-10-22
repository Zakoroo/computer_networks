---
id: tcp-04
topic_id: 04_tcp
order: 4
title: "Reliable transfer and stop-and-wait utilization"
source_classification: lecture_guide
estimated_reading_minutes: 3
prerequisite_ids: ["tcp-02"]
---

# 4. Reliable transfer and stop-and-wait utilization

## Learning goals

- Explain the idle time introduced by stop-and-wait.
- Calculate utilization from packet size, transmission rate, and RTT.

**Builds on:** [lesson 02](02_tcp_udp_services.md).

## Explanation

## 2. Principles of Reliable Data Transfer and Pipelining

Reliable Data Transfer (RDT) is a top-10 networking topic fundamental to the application, transport, and link layers. While the transport layer presents a **reliable channel** abstraction to the application layer (invoked via `rdt_send()` at the sender and `deliver_data()` at the receiver), the underlying implementation must exchange packets across an **unreliable channel** (using `udt_send()` and `rdt_rcv()`) where packets may be corrupted, lost, or reordered. The characteristics of this unreliable channel determine the complexity of the RDT protocol.

### 2.1 Stop-and-Wait and Bandwidth Utilization

The traditional technique for providing reliability is **Positive Acknowledgment with Retransmission**, whose simplest form is **Stop-and-Wait**:
1. The sender transmits a single packet and starts a countdown timer.
2. The receiver sends an acknowledgment (`ACK`) when the data arrives intact.
3. The sender waits until the `ACK` arrives before sending the next packet; if the timer expires before the `ACK` arrives, the sender retransmits the packet.

While Stop-and-Wait achieves reliability, it suffers from abysmal **efficiency (bandwidth utilization)** over links with high bandwidth or long propagation delays.

#### Numerical Utilization Example

Consider a link with the following parameters:
- Link transmission rate: $R = 1\text{ Gbps} = 10^9\text{ bits/sec}$
- One-way propagation delay: $t_p = 15\text{ ms}$, giving a Round-Trip Time of $\text{RTT} = 2 \cdot t_p = 30\text{ ms}$
- Packet size: $L = 8000\text{ bits}$

First, compute the **transmission time** $D_{\text{trans}}$ required to push all bits of one packet into the channel:

$$D_{\text{trans}} = \frac{L}{R} = \frac{8000\text{ bits}}{10^9\text{ bits/sec}} = 8\text{ }\mu\text{s} = 0.008\text{ ms}$$

In Stop-and-Wait, the first bit is transmitted at $t = 0$, and the last bit leaves the sender at $t = L/R = 8\text{ }\mu\text{s}$. The last bit arrives at the receiver at $t = t_p + L/R$, at which point the receiver sends an `ACK` that arrives back at the sender at $t = \text{RTT} + L/R = 30.008\text{ ms}$.

The **sender utilization** $U_{\text{sender}}$—defined as the fraction of time the sender is actually busy transmitting bits into the channel—is:

$$U_{\text{sender}} = \frac{L / R}{\text{RTT} + L / R} = \frac{0.008\text{ ms}}{30.008\text{ ms}} \approx 0.00027 = 0.027\%$$

Thus, the sender uses only $0.027\%$ of the time to send a packet and remains completely silent for the remaining $99.973\%$ of the cycle waiting for the `ACK`.

## Practice

No native TCP quiz questions are assigned. This teaching is retained for study and revision.

The [review queue](review.md) separates coverage from wording and supplementary scope. Mapped questions here need no additional required lessons; the [manifest](manifest.json) lists optional background. Original keys and manual tags are preserved.

## Source

- [Lecture: 2. Principles of Reliable Data Transfer and Pipelining](../../lectures/lecture_04_tcp-ip.md#2-principles-of-reliable-data-transfer-and-pipelining)
- [Lecture: 2.1 Stop-and-Wait and Bandwidth Utilization](../../lectures/lecture_04_tcp-ip.md#21-stop-and-wait-and-bandwidth-utilization)

[Topic overview](README.md) · [Glossary](glossary.md) · [References](references.md) · [Previous lesson](03_demultiplexing.md) · [Next lesson](05_pipelining.md)
