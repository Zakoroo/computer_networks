---
id: socket-api-21
topic_id: 05_socket_api
order: 21
title: "Orderly teardown and half-close"
source_classification: lecture_guide
estimated_reading_minutes: 2
prerequisite_ids: ["socket-api-17", "socket-api-20"]
---

# 21. Orderly teardown and half-close

## Learning goals

- Trace the ordinary FIN/ACK teardown and half-closed interval.
- Explain EOF after buffered data and retain combined/simultaneous-close caveats.

**Builds on:** [lesson 17](17_close_call.md), [lesson 20](20_handshake_and_queues.md).

## Explanation

**Editorial clarification from the source glossary:** EOF here means a successful read returning zero for a nonzero requested count, after earlier buffered data is consumed. It closes the peer's sending stream, not necessarily both directions. A zero-length read request by itself is not evidence of peer closure.

### 4.2 Four-Way Connection Termination and Half-Close

An ordinary handshake uses three segments. Closing both directions is often shown using **four separate control segments in the usual illustrative teardown** because TCP is full-duplex and each direction closes independently. ACK and FIN can be combined, and simultaneous close changes the exchange:

1. **Segment 1 — `FIN M` (Active Close):** One application calls `close()` first (an **active close**). Its TCP sends a `FIN M` segment indicating it has finished sending data, and enters `FIN_WAIT_1`.
2. **Segment 2 — `ACK M+1` (Passive Close):** The peer receives `FIN M` (performing a **passive close**), sends `ACK M+1`, transitions to `CLOSE_WAIT`, and makes EOF visible to its application **after previously received data has been read** (`read` then returns `0`). Meanwhile, the active closer receives `ACK M+1` and enters `FIN_WAIT_2`.
   * **Half-Close Window:** Between Step 2 and Step 3, the connection is **half-closed**: the passive closer (`CLOSE_WAIT`) can still send data back to the active closer (`FIN_WAIT_2`), though the active closer can no longer send data.
3. **Segment 3 — `FIN N`:** When the passive closer's application finishes processing the EOF and calls `close()`, its TCP sends `FIN N` and enters `LAST_ACK`.
4. **Segment 4 — `ACK N+1`:** The active closer receives `FIN N`, sends the final `ACK N+1`, and enters the **`TIME_WAIT`** state (while the passive closer receives `ACK N+1` and transitions immediately to `CLOSED`).

## Practice

- **Q068** in [quiz 05](../../quizzes/quiz_05_socket_api.json); flags: `wording_issue`.

Check the [review queue](review.md) before scored practice. A lesson link can teach the reasoning that exposes a false premise or key; it does not endorse that key. Optional background is listed separately in the [manifest](manifest.json).

## Source

- [Lecture: 4.2 Four-Way Connection Termination and Half-Close](../../lectures/lecture_05_socket-api.md#42-four-way-connection-termination-and-half-close)

[Topic overview](README.md) · [Glossary](glossary.md) · [References](references.md) · [Previous lesson](20_handshake_and_queues.md) · [Next lesson](22_tcp_states.md)
