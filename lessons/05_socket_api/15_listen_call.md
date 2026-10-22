---
id: socket-api-15
topic_id: 05_socket_api
order: 15
title: "Passive open and listen backlog"
source_classification: lecture_guide
estimated_reading_minutes: 1
prerequisite_ids: ["socket-api-14"]
---

# 15. Passive open and listen backlog

## Learning goals

- Explain the passive LISTEN state and queued connections.
- Retain the source backlog wrapper and historical configuration example.

**Builds on:** [lesson 14](14_bind_call.md).

## Explanation

#### 4. `listen()` — Converting to a Passive Listening Socket

For the TCP examples, called by a server (after `socket()` and `bind()`, and before `accept()`), `listen()` converts an unconnected active socket into a **passive socket**, moving it from `CLOSED` to the **`LISTEN`** state:

```c
int listen(int sockfd, int backlog);
/* Returns: 0 if OK, -1 on error */
```

The `backlog` parameter specifies the maximum number of connections the kernel should queue for this listening socket (detailed in Section 4.1). Because the historical 4.2BSD maximum of `5` is far too small for modern servers handling millions of connections per day, a clean wrapper allows an administrator to override `backlog` at runtime via an environment variable (`LISTENQ`):

```c
void Listen(int fd, int backlog) {
    char *ptr;
    /* Can override 2nd argument with environment variable */
    if ((ptr = getenv("LISTENQ")) != NULL)
        backlog = atoi(ptr);
    if (listen(fd, backlog) < 0)
        err_sys("listen error");
}
```

## Practice

No native socket API quiz questions are assigned. This teaching is retained for study and revision.

Check the [review queue](review.md) before scored practice. A lesson link can teach the reasoning that exposes a false premise or key; it does not endorse that key. Optional background is listed separately in the [manifest](manifest.json).

## Source

- [Lecture: 4. `listen()` — Converting to a Passive Listening Socket](../../lectures/lecture_05_socket-api.md#4-listen--converting-to-a-passive-listening-socket)

[Topic overview](README.md) · [Glossary](glossary.md) · [References](references.md) · [Previous lesson](14_bind_call.md) · [Next lesson](16_accept_call.md)
