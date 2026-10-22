---
id: sdn-13
topic_id: 06_sdn
order: 13
title: "Configured table misses, Packet-IN, and buffering"
source_classification: lecture_guide
estimated_reading_minutes: 1
prerequisite_ids: ["sdn-12"]
---

# 13. Configured table misses, Packet-IN, and buffering

## Learning goals

- State the miss-to-controller assumption and the default-drop alternative.
- Explain the example topology, Packet-IN, buffer IDs, and no-buffer packets.

## Explanation

### 4.2 Step-by-Step Execution Example: TCP Handshake and HTTP over OpenFlow

Consider an OpenFlow switch `S1` connected to an OpenFlow controller `C0` and four hosts: `H1` (on port `eth1`), `H2` (on `eth2`), `H3` (on `eth3`), and `H4` (on `eth4`). Suppose `H1` initiates HTTP over TCP port `80` to `H4`. Assume addresses and link-layer reachability are already resolved, and no rules for this connection exist. **A table-miss rule sends unmatched packets to the controller.** In OpenFlow 1.3, a completely empty table does not imply Packet-IN: without a suitable table-miss rule, unmatched packets are dropped by default.

#### Two Ways the Controller Can Respond to a Table Miss (`Packet-IN`)

When `H1` sends its initial `SYN (port 80)` packet into `S1` (`eth1`), `S1` finds no matching flow entry. In this example, `S1` supports buffering and stores the packet locally (assigning it **`Buffer ID = 250`**) and sends an OpenFlow **`Packet-IN`** message containing the packet header and `Buffer ID = 250` up to controller `C0`. A switch can instead send packet bytes with a no-buffer indication; buffering is not guaranteed.

Controller `C0` can handle this in one of two ways:

## Practice

Use [quiz 06](../../quizzes/quiz_06_sdn.json); Q-numbers retain the original question order.

- **Q021** (`sdn-q021`). No additional required lesson. **Wording review:** See the [review queue](review.md#wording-and-answer-key-findings) before scoring; the preserved key needs qualification.

## Source

- [Lecture: 4.2 Step-by-Step Execution Example: TCP Handshake and HTTP over OpenFlow](../../lectures/lecture_06_sdn.md#42-step-by-step-execution-example-tcp-handshake-and-http-over-openflow)
- [Lecture: Two Ways the Controller Can Respond to a Table Miss (`Packet-IN`)](../../lectures/lecture_06_sdn.md#two-ways-the-controller-can-respond-to-a-table-miss-packet-in)

[Topic overview](README.md) · [Glossary](glossary.md) · [References](references.md) · [Previous lesson](12_match_action_tables.md) · [Next lesson](14_controller_responses.md)
