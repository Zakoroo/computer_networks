---
id: socket-api-12
topic_id: 05_socket_api
order: 12
title: "Creating an endpoint with socket()"
source_classification: lecture_guide
estimated_reading_minutes: 2
prerequisite_ids: ["socket-api-07", "socket-api-11"]
---

# 12. Creating an endpoint with socket()

## Learning goals

- Select an address family, socket type, and protocol.
- Explain initial TCP state and socket-creation failure categories.

**Builds on:** [lesson 07](07_address_structures.md), [lesson 11](11_session_overview.md).

## Explanation

### 3.2 Detailed Specification of Core Socket System Calls

#### 1. `socket()` — Creating a Communication Endpoint

To perform network I/O, a process first calls `socket()`, specifying the desired protocol family, socket type, and transport protocol:

```c
int socket(int family, int type, int protocol);
/* Returns: non-negative file descriptor on success, -1 on error */
```

* **`family` (Address/Protocol Family):**
  * `AF_INET`: IPv4 protocols
  * `AF_INET6`: IPv6 protocols
  * `AF_LOCAL` (or `AF_UNIX`): Unix domain protocols
  * `AF_ROUTE`: Routing sockets
  * `AF_KEY`: Key management sockets
* **`type` (Socket Type):**
  * `SOCK_STREAM`: Stream socket (`TCP` or `SCTP` in `AF_INET`/`AF_INET6`; also supported in `AF_LOCAL`)
  * `SOCK_DGRAM`: Datagram socket (`UDP` in `AF_INET`/`AF_INET6`; also supported in `AF_LOCAL`)
  * `SOCK_SEQPACKET`: Sequenced packet socket (`SCTP` in `AF_INET`/`AF_INET6`; also supported in `AF_LOCAL`)
  * `SOCK_RAW`: Raw network-layer socket (`IPv4`/`IPv6`, plus `AF_ROUTE` and `AF_KEY`)
* **`protocol`:** Typically set to `0` to select the system's default protocol for the given `(family, type)` combination, or specified explicitly via `IPPROTO_TCP`, `IPPROTO_UDP`, or `IPPROTO_SCTP`.
* **Initial TCP State:** When created by `socket()`, a TCP socket begins in the **`CLOSED`** state.
* **Why can `socket()` fail?**
  1. Lack of permission to create a socket of the specified type/protocol (e.g., `SOCK_RAW` without superuser privileges).
  2. No kernel support for the specified address family or protocol.
  3. Per-process file descriptor table overflow.
  4. System-wide limit on the total number of open files has been reached.
  5. Insufficient kernel memory available.

## Practice

No native socket API quiz questions are assigned. This teaching is retained for study and revision.

Check the [review queue](review.md) before scored practice. A lesson link can teach the reasoning that exposes a false premise or key; it does not endorse that key. Optional background is listed separately in the [manifest](manifest.json).

## Source

- [Lecture: 3.2 Detailed Specification of Core Socket System Calls](../../lectures/lecture_05_socket-api.md#32-detailed-specification-of-core-socket-system-calls)

[Topic overview](README.md) · [Glossary](glossary.md) · [References](references.md) · [Previous lesson](11_session_overview.md) · [Next lesson](13_connect_call.md)
