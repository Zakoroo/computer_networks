---
id: socket-api-35
topic_id: 05_socket_api
order: 35
title: "Processes, threads, and event-driven servers"
source_classification: lecture_guide
estimated_reading_minutes: 2
prerequisite_ids: ["socket-api-28", "socket-api-30"]
---

# 35. Processes, threads, and event-driven servers

## Learning goals

- Compare address-space isolation and scheduling among the three mechanisms.
- Explain why an idle client blocks an iterative server.

**Builds on:** [lesson 28](28_baseline_echo_server.md), [lesson 30](30_io_models.md).

## Explanation

**Editorial clarification:** The source's private process address spaces give isolation, while creating a process per client adds process resources and scheduling work compared with one event loop. This is a qualitative design tradeoff, not a universal performance ranking.

## 7. Server Architectures, Denial-of-Service Attacks, and Modern High-Speed I/O

**Limit of the half-close client:** This fixes premature termination and hidden input buffering, but `Writen()` can still block on either output. It is a blocking teaching example, not a fully asynchronous implementation.

### 7.1 Iterative vs. Concurrent Servers and Concurrency Mechanisms

* **Flaw of Iterative Servers:** An iterative server handles one client completely before calling `accept()` for the next client. If `Client 1` connects to an iterative echo server and its user "goes out to lunch" without typing a line (or closing the connection), the server blocks indefinitely inside `read()` waiting for `Client 1`. Meanwhile, `Client 2`'s connection sits in the kernel queue and cannot be serviced until after lunch!
* **Solution — Concurrent Servers:** Serve multiple clients simultaneously using one of **three concurrency mechanisms**:
  1. **Processes (`fork()`):** The kernel automatically interleaves multiple logical control flows, and each flow has its own **private address space**.
  2. **Threads (`pthread_create()`):** The kernel automatically interleaves multiple logical control flows, and all flows **share the same address space**.
  3. **Event-Based I/O Multiplexing (`select()`):** A single user-space process **manually interleaves** multiple logical flows within a single address space using `select()`.
     * **Pros:** One logical control flow; easy to single-step in a debugger (`gdb`); no per-connection process creation or thread-switching requirement (historically the design of choice for high-performance web servers and search engines).
     * **Cons:** Significantly more complex to code (requires explicit per-client state machines) and vulnerable to single-client blocking Denial-of-Service attacks if coded carelessly.

## Practice

- **Q013** in [quiz 05](../../quizzes/quiz_05_socket_api.json).
- **Q021** in [quiz 05](../../quizzes/quiz_05_socket_api.json).

Check the [review queue](review.md) before scored practice. A lesson link can teach the reasoning that exposes a false premise or key; it does not endorse that key. Optional background is listed separately in the [manifest](manifest.json).

## Source

- [Lecture: 7. Server Architectures, Denial-of-Service Attacks, and Modern High-Speed I/O](../../lectures/lecture_05_socket-api.md#7-server-architectures-denial-of-service-attacks-and-modern-high-speed-io)

[Topic overview](README.md) · [Glossary](glossary.md) · [References](references.md) · [Previous lesson](34_shutdown_half_close.md) · [Next lesson](36_select_server.md)
