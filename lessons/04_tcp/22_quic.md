---
id: tcp-22
topic_id: 04_tcp
order: 22
title: "QUIC and userspace deployment"
source_classification: lecture_guide
estimated_reading_minutes: 2
prerequisite_ids: ["tcp-02", "tcp-17"]
---

# 22. QUIC and userspace deployment

## Learning goals

- Explain how userspace transport changes the pace of deployment.
- Distinguish implementation fragmentation from packet fragmentation.

**Builds on:** [lesson 02](02_tcp_udp_services.md), [lesson 17](17_cubic.md).

## Explanation

**Editorial clarification:** “Fragmentation” in this source paragraph means different implementations and tuning, not IP fragmentation of packets.

### 4.4 Userspace Transport: QUIC

Historically, TCP congestion control lived inside the **operating system kernel**. Changing or updating a TCP algorithm required updating the OS kernel on servers and client devices—a process that took years or decades.

**QUIC** is a modern transport protocol that runs **on top of UDP in application userspace** (forming the transport foundation of HTTP/3):
- **Deployment velocity:** Because QUIC runs in userspace, the transport protocol and its congestion control algorithm ship directly inside the application binary (such as a web browser or mobile app). An application developer can update the congestion control algorithm with a routine app update without waiting for OS kernel upgrades.
- **Trade-off — Fragmentation:** While deployment velocity increases dramatically, moving congestion control to userspace also increases **fragmentation across implementations**. Instead of a few standardized OS kernel TCP stacks, every browser, CDN, and application vendor maintains its own independent QUIC stack and congestion control tuning. *Who controls the algorithm determines how fast it can change.*

## Practice

No native TCP quiz questions are assigned. This teaching is retained for study and revision.

The [review queue](review.md) separates coverage from wording and supplementary scope. Mapped questions here need no additional required lessons; the [manifest](manifest.json) lists optional background. Original keys and manual tags are preserved.

## Source

- [Lecture: 4.4 Userspace Transport: QUIC](../../lectures/lecture_04_tcp-ip.md#44-userspace-transport-quic)

[Topic overview](README.md) · [Glossary](glossary.md) · [References](references.md) · [Previous lesson](21_l4s.md) · [Next lesson](23_failure_modes.md)
