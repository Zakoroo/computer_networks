---
id: tcp-07
topic_id: 04_tcp
order: 7
title: "RTT estimation and retransmission timeouts"
source_classification: lecture_guide
estimated_reading_minutes: 3
prerequisite_ids: ["tcp-06"]
---

# 7. RTT estimation and retransmission timeouts

## Learning goals

- Use the RTT and deviation EWMAs to explain an adaptive timeout.
- Interpret sequence and ACK numbers in the worked packet trace.

**Builds on:** [lesson 06](06_byte_stream_window.md).

## Explanation

**Editorial clarification:** In the data-bearing trace below, `Seq=1, Len=1448` covers bytes 1–1448 and `ACK=1449` asks for byte 1449 next. Thus the sequence field identifies the first data byte carried in the illustrated segment, while a cumulative ACK identifies the next expected byte. This is an explanation of the source trace, not an extension covering sequence wraparound.

### 2.4 Round-Trip Time Estimation and Timeout Calculation

To know when to retransmit a lost segment, TCP must set its **Retransmission Timeout (`TimeoutInterval`)** appropriately:
- If the timeout is too short, TCP triggers premature timeouts and unnecessary retransmissions.
- If the timeout is too long, TCP reacts too slowly to segment loss.

Because end-to-end queuing delays fluctuate across the Internet, TCP continuously measures `SampleRTT` (the time from when an un-retransmitted segment is sent until its `ACK` arrives) and smooths these measurements using an **Exponentially Weighted Moving Average (EWMA)** where the influence of past samples decays exponentially fast:

$$\text{EstimatedRTT} = (1 - \alpha) \cdot \text{EstimatedRTT} + \alpha \cdot \text{SampleRTT}$$

The typical recommended value is $\alpha = 0.125$ ($\frac{1}{8}$), so $\text{EstimatedRTT} = 0.875 \cdot \text{EstimatedRTT} + 0.125 \cdot \text{SampleRTT}$.

To account for jitter (large variations in RTT require a larger safety margin), TCP also tracks the RTT deviation `DevRTT`, defined as an EWMA of the absolute difference between `SampleRTT` and `EstimatedRTT`:

$$\text{DevRTT} = (1 - \beta) \cdot \text{DevRTT} + \beta \cdot |\text{SampleRTT} - \text{EstimatedRTT}|$$

The typical recommended value is $\beta = 0.25$ ($\frac{1}{4}$). The retransmission timeout interval is then set to `EstimatedRTT` plus a safety margin of four times `DevRTT`:

$$\text{TimeoutInterval} = \text{EstimatedRTT} + 4 \cdot \text{DevRTT}$$

#### Worked Example: RTT Estimation from a Packet Trace

Consider a packet trace between client `192.168.86.68` (port `55639`) and server `128.119.245.12` (port `80`):
- **Packet 4 ($t = 0.024047\text{ s}$):** Client sends data segment `Seq=1, Ack=1, Len=1448`.
- **Packet 5 ($t = 0.024048\text{ s}$):** Client sends data segment `Seq=1449, Ack=1, Len=1448`.
- **Packet 7 ($t = 0.052671\text{ s}$):** Server sends `ACK` for Packet 4 (`Ack=1449`).
- **Packet 8 ($t = 0.052676\text{ s}$):** Server sends `ACK` for Packet 5 (`Ack=2897`).

1. **Initialization (after 1st packet is ACKed at $t = 0.052671\text{ s}$):**
   Because no prior `EstimatedRTT` exists at the start of the connection, `EstimatedRTT` is initialized directly to the first `SampleRTT`:
   $$\text{SampleRTT}_1 = 0.052671 - 0.024047 = 0.028624\text{ s}$$
   $$\text{EstimatedRTT}_1 = 0.875 \cdot 0.028624 + 0.125 \cdot (0.052671 - 0.024047) = 0.028624\text{ s}$$

2. **Update (after 2nd packet is ACKed at $t = 0.052676\text{ s}$):**
   $$\text{SampleRTT}_2 = 0.052676 - 0.024048 = 0.028628\text{ s}$$
   $$\text{EstimatedRTT}_2 = 0.875 \cdot 0.028624 + 0.125 \cdot (0.052676 - 0.024048) = 0.0286245\text{ s}$$

This update process repeats for each newly acknowledged segment.

## Practice

- **Q002** in [quiz 04](../../quizzes/quiz_04_tcp.json).
- **Q005** in [quiz 04](../../quizzes/quiz_04_tcp.json).
- **Q008** in [quiz 04](../../quizzes/quiz_04_tcp.json).

The [review queue](review.md) separates coverage from wording and supplementary scope. Mapped questions here need no additional required lessons; the [manifest](manifest.json) lists optional background. Original keys and manual tags are preserved.

## Source

- [Lecture: 2.4 Round-Trip Time Estimation and Timeout Calculation](../../lectures/lecture_04_tcp-ip.md#24-round-trip-time-estimation-and-timeout-calculation)

[Topic overview](README.md) · [Glossary](glossary.md) · [References](references.md) · [Previous lesson](06_byte_stream_window.md) · [Next lesson](08_flow_control.md)
