---
id: socket-api-16
topic_id: 05_socket_api
order: 16
title: "Accepting connected descriptors"
source_classification: lecture_guide
estimated_reading_minutes: 2
prerequisite_ids: ["socket-api-15"]
---

# 16. Accepting connected descriptors

## Learning goals

- Separate listening descriptors from accepted connected descriptors.
- Explain value-result address lengths and accept failure cases.

**Builds on:** [lesson 15](15_listen_call.md).

## Explanation

**Editorial reading note:** For Q004, combine the accept semantics below with the handshake timing in [lesson 20](20_handshake_and_queues.md) and buffered-data/EOF behavior in [lesson 21](21_orderly_teardown.md). Both are additional required reading. Distinguish an orderly client close from an aborted connection.

#### 5. `accept()` — Dequeuing a Completed Connection

Called by a TCP server to retrieve the next established connection from the front of the kernel's completed connection queue (putting the process to sleep if the queue is currently empty):

```c
int accept(int sockfd, struct sockaddr *cliaddr, socklen_t *addrlen);
/* Returns: non-negative connected descriptor (connfd) if OK, -1 on error */
```

* **Listening vs. Connected Descriptors:**
  * The first argument (`sockfd` / `listenfd`) is the **listening descriptor**, created once and kept open for the entire lifetime of the server.
  * The return value (`connfd`) is a brand-new **connected descriptor** created by the kernel specifically for this accepted client. All `read()`/`write()` data transfers with the client take place over `connfd`, and `connfd` is closed as soon as the server finishes servicing that client.
  * *Why separate them?* Separating `listenfd` from `connfd` enables **concurrent servers** (e.g., forking a child or multiplexing multiple `connfd` descriptors simultaneously while `listenfd` continues accepting new clients).
* **Value-Result Argument (`addrlen`):** `cliaddr` and `addrlen` return the client's protocol address (IP and ephemeral port). Before calling `accept()`, the caller must initialize `*addrlen = sizeof(clientaddr)`; upon return, the kernel overwrites `*addrlen` with the actual address length; this can exceed the supplied capacity if the address was truncated. If the server does not care about the client's identity, both `cliaddr` and `addrlen` may be passed as `NULL`.
* **Common `accept()` Errors:** Invalid descriptor, connection aborted before pickup (`ECONNABORTED`), socket not listening or invalid `addrlen`, per-process or system-wide file table full, socket type does not support accepting connections, insufficient socket buffer memory, protocol error, or firewall rules forbidding the connection.

## Practice

- **Q004** in [quiz 05](../../quizzes/quiz_05_socket_api.json); also requires [lesson 20](20_handshake_and_queues.md), [lesson 21](21_orderly_teardown.md).

Check the [review queue](review.md) before scored practice. A lesson link can teach the reasoning that exposes a false premise or key; it does not endorse that key. Optional background is listed separately in the [manifest](manifest.json).

## Source

- [Lecture: 5. `accept()` — Dequeuing a Completed Connection](../../lectures/lecture_05_socket-api.md#5-accept--dequeuing-a-completed-connection)

[Topic overview](README.md) · [Glossary](glossary.md) · [References](references.md) · [Previous lesson](15_listen_call.md) · [Next lesson](17_close_call.md)
