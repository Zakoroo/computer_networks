---
id: socket-api-42
topic_id: 05_socket_api
order: 42
title: "Socket programming pitfalls and practice"
source_classification: lecture_guide
estimated_reading_minutes: 2
prerequisite_ids: ["socket-api-23", "socket-api-34", "socket-api-37", "socket-api-38"]
---

# 42. Socket programming pitfalls and practice

## Learning goals

- Connect framing, buffering, concurrency, teardown, and byte-order mistakes to their source remedies.
- Retain the limits of the teaching examples when reviewing code.

**Builds on:** [lesson 23](23_time_wait.md), [lesson 34](34_shutdown_half_close.md), [lesson 37](37_partial_lines_and_state.md), [lesson 38](38_c10k.md).

## Explanation

### 8.2 Summary of Pitfalls and Best Practices

| Category | Common Pitfall | Best Practice |
|---|---|---|
| **Message Framing** | Assuming TCP preserves message boundaries (`one write equals one read`). | Always loop on `read()` and use framing (`readn`, `writen`, length prefixes, or delimiters) on raw byte buffers. |
| **Buffering & Multiplexing** | Mixing `stdio` (`fgets`) or static `readline` buffers with `select()`. | Operate on unbuffered byte chunks (`Read`/`Write`) with explicit per-client state machines so unread bytes are never hidden from `select()`. |
| **Server Concurrency** | Using blocking per-client reads in a single-process server (vulnerable to partial-line DoS). | Use non-blocking I/O, per-client state machines, timeouts, or separate threads/processes. |
| **Scalability** | Using `select()` for thousands of connections (hard `FD_SETSIZE` limit + $O(N)$ scan). | Prefer **`epoll`** (Linux) or **`kqueue`** (BSD) to avoid repeatedly scanning the complete watched set. |
| **Batch / Full-Duplex Close** | Calling `close()` immediately upon `stdin` EOF while replies are still in flight. | Call **`shutdown(sockfd, SHUT_WR)`** to send a `FIN` (half-close) while keeping the socket open for reading until the peer sends EOF. |
| **Connection Teardown** | Ignoring `TIME_WAIT` or misconfiguring `SO_LINGER` / $\text{MSL}$, causing `"Address already in use"` (`EADDRINUSE`) errors or corrupted reincarnations. | Respect `TIME_WAIT` ($2\text{MSL}$) for connection correctness and use `SO_REUSEADDR` appropriately on listening servers. |
| **Byte Ordering & IPv4/IPv6** | Forgetting `htons`/`htonl`/`ntohs`/`ntohl` or hardcoding IPv4-only `sockaddr_in` and `gethostbyname()`. | Always convert multi-byte header fields between host and network byte order; resolve names with **`getaddrinfo()`** and store addresses in **`sockaddr_storage`**. |
| **Resource Management** | Failing to check return codes or forgetting to `close(connfd)` (especially across `fork()`). | Use error-checking wrapper functions and close descriptors promptly to prevent file descriptor leaks. |

## Practice

No native socket API quiz questions are assigned. This teaching is retained for study and revision.

Check the [review queue](review.md) before scored practice. A lesson link can teach the reasoning that exposes a false premise or key; it does not endorse that key. Optional background is listed separately in the [manifest](manifest.json).

## Source

- [Lecture: 8.2 Summary of Pitfalls and Best Practices](../../lectures/lecture_05_socket-api.md#82-summary-of-pitfalls-and-best-practices)

[Topic overview](README.md) · [Glossary](glossary.md) · [References](references.md) · [Previous lesson](41_debugging.md)
