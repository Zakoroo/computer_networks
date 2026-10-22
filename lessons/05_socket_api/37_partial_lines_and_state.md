---
id: socket-api-37
topic_id: 05_socket_api
order: 37
title: "Partial-line stalls and per-client state"
source_classification: lecture_guide
estimated_reading_minutes: 2
prerequisite_ids: ["socket-api-27", "socket-api-31", "socket-api-36"]
---

# 37. Partial-line stalls and per-client state

## Learning goals

- Explain descriptor exhaustion and a readiness-triggered partial-line stall.
- Use bounded nonblocking progress and per-client state to avoid one-client waits.

**Builds on:** [lesson 27](27_buffered_readline.md), [lesson 31](31_select_readiness.md), [lesson 36](36_select_server.md).

## Explanation

### 7.3 Denial-of-Service Attacks (Partial Lines) and Per-Client State Machines

Even a `select()`-based server is vulnerable to two classic **Denial-of-Service (DoS) attacks**:

1. **Attack #1 — Connection Exhaustion:** Idle connections consume descriptors, buffers, and application state. In the simplified layout with descriptors 0–3 already occupied and a 1024-bit set, only 1020 further descriptor values fit. Real limits depend on existing descriptors and OS configuration; **FD_SETSIZE bounds descriptor values, not merely the count of clients**.
2. **Attack #2 — Partial Line Hanging:** Suppose the `select()`-based server processes line-oriented requests by calling `readline()` (or `Rio_readlineb()`) whenever `select()` reports a client socket as readable. What happens if a malicious or flaky client connects, sends `"Hello world"` (**without the trailing `\n`**), and goes to sleep?
   * `select()` sees data in the socket buffer and reports the descriptor as readable.
   * The server calls `readline()`, which reads `"Hello world"` and then **blocks inside a second `read()` call waiting for the missing `\n`.**
   * The entire single-process server is now frozen waiting on this one client and cannot accept new connections or service any other connected clients!

**Event-loop rule:** A shared event loop must not wait indefinitely for one client. Readiness of a descriptor does not promise a complete message or enough output space for a whole reply.

**Solutions:**
* Use **non-blocking I/O** (`O_NONBLOCK`), place **timeouts** on I/O operations, or service each client in a separate thread/process; **AND**
* **Break up line reading into partial reads using a per-client state machine:** Whenever `select()` selects a connection, perform bounded nonblocking reads, often draining available bytes until `EAGAIN`/`EWOULDBLOCK` to read whatever bytes are currently available, append those bytes into a **dedicated per-client buffer** (where each client's state tracks `{connfd, partial_line_buf, char_count}`), and only process the message once the full delimiter (`\n`) has arrived.

## Practice

- **Q039** in [quiz 05](../../quizzes/quiz_05_socket_api.json); flags: `wording_issue`.

Check the [review queue](review.md) before scored practice. A lesson link can teach the reasoning that exposes a false premise or key; it does not endorse that key. Optional background is listed separately in the [manifest](manifest.json).

## Source

- [Lecture: 7.3 Denial-of-Service Attacks (Partial Lines) and Per-Client State Machines](../../lectures/lecture_05_socket-api.md#73-denial-of-service-attacks-partial-lines-and-per-client-state-machines)

[Topic overview](README.md) · [Glossary](glossary.md) · [References](references.md) · [Previous lesson](36_select_server.md) · [Next lesson](38_c10k.md)
