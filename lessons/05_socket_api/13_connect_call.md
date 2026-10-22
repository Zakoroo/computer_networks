---
id: socket-api-13
topic_id: 05_socket_api
order: 13
title: "Active open with connect()"
source_classification: lecture_guide
estimated_reading_minutes: 3
prerequisite_ids: ["socket-api-11", "socket-api-12"]
---

# 13. Active open with connect()

## Learning goals

- Explain automatic local endpoint selection and the blocking handshake.
- Distinguish timeout, refusal, soft errors, and pending nonblocking connects.

**Builds on:** [lesson 11](11_session_overview.md), [lesson 12](12_socket_call.md).

## Explanation

#### 2. `connect()` — Initiating an Active Open (Client)

A TCP client establishes a connection with a server by calling `connect()`:

```c
int connect(int sockfd, const struct sockaddr *servaddr, socklen_t addrlen);
/* Returns: 0 if OK, -1 on error */
```

* **No prior `bind()` required:** A client does not need to call `bind()` before calling `connect()`; the kernel automatically assigns an unused **ephemeral port** and selects the **source IP address** (based on the outgoing network interface).
* **State Transition:** `connect()` initiates TCP's three-way handshake, moving the socket from `CLOSED` to **`SYN_SENT`**, and returns `0` once the `SYN+ACK` arrives and the socket enters **`ESTABLISHED`**.
* **Three Failure Scenarios for blocking `connect()`:**
  1. **No response to `SYN` (Timeout — `ETIMEDOUT`):** If the client's `SYN` receives no reply, the kernel retransmits the `SYN` (e.g., in 4.4BSD, one initial `SYN`, another $6\text{ s}$ later, and another $24\text{ s}$ later, failing after $75\text{ s}$ total) and returns a timeout error.
  2. **`RST` received (Hard Error — `ECONNREFUSED`):** If the server host responds to the `SYN` with a TCP Reset (`RST`) segment, the connection has been actively refused, commonly because no server is listening; an intervening device can also reject it. `connect()` immediately returns "connection refused."
     * *When does TCP send an `RST`?* (a) A `SYN` arrives for a port with no listening server; (b) TCP wants to abort an existing connection; or (c) TCP receives a segment for a connection that does not exist.
  3. **ICMP "Destination Unreachable" from an intermediate router (Soft Error — `EHOSTUNREACH` / `ENETUNREACH`):** Because an ICMP unreachable message may reflect a transient routing loop or flap that will soon heal, the kernel treats it as a *soft error*: it saves the ICMP message and keeps retransmitting `SYN`s. In the historical BSD example, the saved error can be returned after the retry timeout. Current retry timing and treatment of ICMP errors vary by OS and error type; 75 seconds is not a portable API rule.
* **Important Rule on Failure:** After a failed connection attempt, portable code closes the socket and creates a new one because its state is unspecified. Nonblocking `connect()` returning `EINPROGRESS` is different: connection establishment is still pending; wait for readiness and inspect `SO_ERROR`.

## Practice

- **Q036** in [quiz 05](../../quizzes/quiz_05_socket_api.json).

Check the [review queue](review.md) before scored practice. A lesson link can teach the reasoning that exposes a false premise or key; it does not endorse that key. Optional background is listed separately in the [manifest](manifest.json).

## Source

- [Lecture: 2. `connect()` — Initiating an Active Open (Client)](../../lectures/lecture_05_socket-api.md#2-connect--initiating-an-active-open-client)

[Topic overview](README.md) · [Glossary](glossary.md) · [References](references.md) · [Previous lesson](12_socket_call.md) · [Next lesson](14_bind_call.md)
