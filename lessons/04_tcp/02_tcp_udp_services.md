---
id: tcp-02
topic_id: 04_tcp
order: 2
title: "TCP and UDP services"
source_classification: lecture_guide
estimated_reading_minutes: 2
prerequisite_ids: ["tcp-01"]
---

# 2. TCP and UDP services

## Learning goals

- Compare TCP reliability, connection setup, flow control, and congestion control with UDP.
- Identify the timing and bandwidth guarantees neither service provides.

**Builds on:** [lesson 01](01_layering.md).

## Explanation

**Editorial clarification:** These are service abstractions, not a promise that every connection survives every failure. The source explicitly excludes timing and bandwidth guarantees.

### 1.2 TCP vs. UDP Service Models

From an end-user perspective, applications typically care about three primary transport properties: **connection management**, **reliability** (guaranteed information arrival), and **timing** (such as bounded delay for streamed communication). The Internet offers two transport protocols with contrasting service models:

- **TCP (Transmission Control Protocol):**
  - **Connection-oriented service:** Requires connection setup (handshaking) between sender and receiver before data flows.
  - **Reliable transport:** Guarantees error-free, in-order delivery of a byte stream between the sending and receiving processes.
  - **Flow control:** Ensures the sender will not overwhelm the receiver by transmitting faster than the receiver can buffer and process.
  - **Congestion control:** Acts when the network is overloaded—an extra service benefiting both individual users and the overall network—by throttling the sender's rate.
  - **What TCP does NOT provide:** Timing guarantees or minimum bandwidth guarantees.

- **UDP (User Datagram Protocol):**
  - **Connectionless, best-effort delivery:** Acts like placing data in an envelope and relying entirely on IP for delivery (which may drop, reorder, or delay packets).
  - **What UDP does NOT provide:** Connection setup, reliability, flow control, congestion control, timing guarantees, or bandwidth guarantees.

## Practice

- **Q001** in [quiz 04](../../quizzes/quiz_04_tcp.json).

The [review queue](review.md) separates coverage from wording and supplementary scope. Mapped questions here need no additional required lessons; the [manifest](manifest.json) lists optional background. Original keys and manual tags are preserved.

## Source

- [Lecture: 1.2 TCP vs. UDP Service Models](../../lectures/lecture_04_tcp-ip.md#12-tcp-vs-udp-service-models)

[Topic overview](README.md) · [Glossary](glossary.md) · [References](references.md) · [Previous lesson](01_layering.md) · [Next lesson](03_demultiplexing.md)
