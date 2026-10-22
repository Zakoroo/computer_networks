---
id: socket-api-17
topic_id: 05_socket_api
order: 17
title: "Closing descriptors and socket references"
source_classification: lecture_guide
estimated_reading_minutes: 1
prerequisite_ids: ["socket-api-16"]
---

# 17. Closing descriptors and socket references

## Learning goals

- Distinguish releasing a descriptor from closing the underlying socket.
- Explain queued kernel data and ordinary FIN initiation on the last close.

**Builds on:** [lesson 16](16_accept_call.md).

## Explanation

#### 6. `close()` — Closing a Socket

```c
int close(int sockfd);
/* Returns: 0 if OK, -1 on error */
```

Calling `close()` releases this descriptor and normally returns without waiting for TCP teardown; linger settings can affect blocking behavior. The process can no longer use that released `sockfd` for `read()` or `write()`. However, in the kernel:
1. `close()` decrements the descriptor's **reference count on the underlying open socket**. Only when the reference count reaches `0` (crucial in concurrent `fork()` servers where both parent and child hold open copies of `connfd`!) does the kernel initiate TCP connection termination.
2. When reference count reaches `0`, TCP first attempts to transmit any data already queued in the kernel send buffer, and then sends a `FIN` segment to begin normal connection teardown (unless overridden by the `SO_LINGER` socket option).

## Practice

No native socket API quiz questions are assigned. This teaching is retained for study and revision.

Check the [review queue](review.md) before scored practice. A lesson link can teach the reasoning that exposes a false premise or key; it does not endorse that key. Optional background is listed separately in the [manifest](manifest.json).

## Source

- [Lecture: 6. `close()` — Closing a Socket](../../lectures/lecture_05_socket-api.md#6-close--closing-a-socket)

[Topic overview](README.md) · [Glossary](glossary.md) · [References](references.md) · [Previous lesson](16_accept_call.md) · [Next lesson](18_wrappers_and_daytime_client.md)
