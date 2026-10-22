---
id: socket-api-23
topic_id: 05_socket_api
order: 23
title: "Why TIME_WAIT lasts twice MSL"
source_classification: lecture_guide
estimated_reading_minutes: 3
prerequisite_ids: ["socket-api-21", "socket-api-22"]
---

# 23. Why TIME_WAIT lasts twice MSL

## Learning goals

- Explain retransmitting the last ACK and expiring old duplicates.
- Distinguish a connection incarnation, segment-lifetime assumptions, and implementation-specific reuse.

**Builds on:** [lesson 21](21_orderly_teardown.md), [lesson 22](22_tcp_states.md).

## Explanation

### 4.4 The `TIME_WAIT` State and the $2\text{MSL}$ Timeout

In the ordinary orderly-close sequence, the active closer enters **TIME_WAIT** for **2 × MSL**. Both endpoints can enter TIME_WAIT during simultaneous close; aborted connections need not follow the orderly-close path.

**MSL** is a protocol assumption about maximum segment lifetime, not a wall-clock bound calculated from IPv4's hop-limited TTL. The lecture's historical examples use MSL values of two minutes or 30 seconds, giving TIME_WAIT values of four minutes or one minute. Actual timers and permitted safe-reuse rules are implementation-dependent; these are not universal limits.

There are **two fundamental reasons** for the `TIME_WAIT` state:

#### Reason 1: Reliably Implementing TCP's Full-Duplex Connection Termination

Suppose the final `ACK N+1` (Segment 4 of connection teardown) from the active closer (Endpoint 1 / Client) to the passive closer (Endpoint 2 / Server) is **lost in the network**:
* Because the server in `LAST_ACK` does not receive `ACK N+1`, its timer expires and it **retransmits its final `FIN N`**.
* If the client had transitioned directly to `CLOSED` instead of remaining in `TIME_WAIT`, the client would have no state left for the connection and would respond to the retransmitted `FIN N` with an **`RST` segment** (interpreting the `FIN` as an unexpected segment), causing the server to report a spurious error even though all data was transferred cleanly!
* By remaining in `TIME_WAIT` for $2\text{MSL}$, the active closer maintains connection state so it can **retransmit the final `ACK N+1`** if it receives a retransmitted `FIN N`. This explains TIME_WAIT in the ordinary active-close case. In simultaneous close, both endpoints can need this state.

#### Reason 2: Allowing Old Duplicate Segments ("Wandering Duplicates") to Expire in the Network

Suppose a connection with 4-tuple `{12.106.32.254:1500, 206.168.112.219:21}` has a packet caught in a temporary routing loop. Once the routing loop heals (within $\text{MSL}$ seconds), the delayed packet is delivered to its destination.
* If the original connection closed and a new connection—called a new **incarnation**—were immediately established using the **exact same 4-tuple** `{12.106.32.254:1500, 206.168.112.219:21}`, that delayed duplicate segment from the old connection could arrive with a valid sequence number and be **mistaken for part of the second connection**, corrupting the data stream!
* To prevent this, TCP normally delays reuse of that connection identity; carefully constrained reuse mechanisms exist. Waiting $2 \times \text{MSL}$ allows up to $\text{MSL}$ seconds for a packet in one direction to be lost/delayed and another $\text{MSL}$ seconds for a reply in the opposite direction to expire, allowing old duplicates to expire under the segment-lifetime assumptions. Sequence numbers and timestamp-based protections also matter when implementations permit earlier reuse.

---

## Practice

- **Q007** in [quiz 05](../../quizzes/quiz_05_socket_api.json).
- **Q020** in [quiz 05](../../quizzes/quiz_05_socket_api.json).

Check the [review queue](review.md) before scored practice. A lesson link can teach the reasoning that exposes a false premise or key; it does not endorse that key. Optional background is listed separately in the [manifest](manifest.json).

## Source

- [Lecture: 4.4 The `TIME_WAIT` State and the $2\text{MSL}$ Timeout](../../lectures/lecture_05_socket-api.md#44-the-time_wait-state-and-the-2textmsl-timeout)

[Topic overview](README.md) · [Glossary](glossary.md) · [References](references.md) · [Previous lesson](22_tcp_states.md) · [Next lesson](24_stream_framing.md)
