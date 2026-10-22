---
id: tcp-16
topic_id: 04_tcp
order: 16
title: "Classical TCP history, 1974–1996 †"
source_classification: supplementary_archived_slides
estimated_reading_minutes: 2
prerequisite_ids: ["tcp-15"]
---

# 16. Classical TCP history, 1974–1996 †

## Learning goals

- Place the major classical TCP changes in their source historical sequence.
- Connect congestion collapse with the later recovery and control mechanisms.

**Builds on:** [lesson 15](15_classical_variants.md).

## Explanation

**† Supplementary:** This material inherits the guide's archived/hidden-slide designation and may fall outside this year's examinable material.



#### Historical Timeline of Classical TCP Evolution (1974–1996) †
- **1974:** TCP first described by Vint Cerf and Bob Kahn in *IEEE Transactions on Communications*.
- **1975:** Three-way handshake introduced by Ray Tomlinson in *SIGCOMM '75*.
- **1981:** TCP and IP standardized in **RFC 793** and **RFC 791**.
- **1983:** BSD Unix 4.2 ships with built-in TCP/IP support.
- **1984:** John Nagle introduces **Nagle's algorithm** to reduce the overhead of small packets ("tinygrams") and predicts the danger of congestion collapse.
- **1986:** **Congestion collapse** is first observed on the operational Internet (throughput on links dropped by orders of magnitude due to uncontrolled retransmissions).
- **1987:** Phil Karn introduces **Karn's algorithm** to unambiguous RTT estimation (ignoring RTT samples from retransmitted segments and backing off the timer).
- **1988:** Van Jacobson publishes **Slow Start, Congestion Avoidance, and Fast Retransmit** in *SIGCOMM '88*, implemented in **4.3BSD Tahoe**.
- **1990:** **4.3BSD Reno** adds **Fast Recovery** and delayed ACKs.
- **1993:** **TCP Vegas** (Brakmo et al.) proposes delay-based congestion avoidance.
- **1994:** Sally Floyd proposes **Explicit Congestion Notification (ECN)**; Bob Braden proposes **T/TCP** (Transaction TCP).
- **1996:** **NewReno** (modified Fast Recovery), **SACK TCP** (Floyd et al.), startup improvements (Janey Hoe), and **FACK TCP** (Mathis et al.).

---

## Practice

No native TCP quiz questions are assigned. This teaching is retained for study and revision.

The [review queue](review.md) separates coverage from wording and supplementary scope. Mapped questions here need no additional required lessons; the [manifest](manifest.json) lists optional background. Original keys and manual tags are preserved.

## Source

- [Lecture: Historical Timeline of Classical TCP Evolution (1974–1996) †](../../lectures/lecture_04_tcp-ip.md#historical-timeline-of-classical-tcp-evolution-19741996-)

[Topic overview](README.md) · [Glossary](glossary.md) · [References](references.md) · [Previous lesson](15_classical_variants.md) · [Next lesson](17_cubic.md)
