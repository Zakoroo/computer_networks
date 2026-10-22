---
id: sdn-14
topic_id: 06_sdn
order: 14
title: "Packet-OUT, Flow-MOD, and rule lifetimes"
source_classification: lecture_guide
estimated_reading_minutes: 1
prerequisite_ids: ["sdn-13"]
---

# 14. Packet-OUT, Flow-MOD, and rule lifetimes

## Learning goals

- Distinguish a one-packet response from installing a forwarding entry.
- Interpret idle and hard timeouts, priority, and buffered-packet release.

## Explanation

**Editorial context from the preceding source example:** H1 sends a TCP SYN for H4 port 80 through S1. The miss rule sends Packet-IN to C0, and S1 buffers this packet as ID 250. The two responses below use that same example; see [lesson 13](13_table_misses.md).

* **Option A — Stateless One-Shot Forwarding (`Packet-OUT`):** `C0` replies with a **`Packet-OUT`** message referencing `Buffer ID = 250` (or carrying the raw packet) with `Action = Forward port 4`. Switch `S1` transmits that single packet out `eth4` to `H4`, **without installing any state in its flow table** (subsequent packets of the same flow would again trigger `Packet-IN`).
* **Option B — Reactive Flow Installation (`Flow-MOD`):** `C0` replies with a **`Flow-MOD`** message containing:
  * `Match & Mask`: `H1 -> H4, TCP Dst Port 80`
  * `Buffer ID = 250` (instructing `S1` to also forward the buffered packet `#250` immediately)
  * `Idle Timeout = 20` (expire rule if no packets match for $20\text{ s}$)
  * `Hard Timeout = 60` (expire rule unconditionally after $60\text{ s}$)
  * `Action = Forward port 4`
  * `Priority = 5000`

  `S1` installs **`Flow-ENTRY (H1->H4 Port 80)`** into its hardware flow table and forwards the buffered `SYN` out `eth4` to `H4`.

## Practice

No native quiz question has this lesson as its primary assignment. The source teaching remains included; this lesson may provide required or optional support listed in the [manifest](manifest.json).

## Source

- [Lecture: Two Ways the Controller Can Respond to a Table Miss (`Packet-IN`)](../../lectures/lecture_06_sdn.md#two-ways-the-controller-can-respond-to-a-table-miss-packet-in)

[Topic overview](README.md) · [Glossary](glossary.md) · [References](references.md) · [Previous lesson](13_table_misses.md) · [Next lesson](15_reactive_handshake.md)
