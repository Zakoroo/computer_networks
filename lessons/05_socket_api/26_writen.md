---
id: socket-api-26
topic_id: 05_socket_api
order: 26
title: "Writing a complete local byte count"
source_classification: lecture_guide
estimated_reading_minutes: 1
prerequisite_ids: ["socket-api-24", "socket-api-25"]
---

# 26. Writing a complete local byte count

## Learning goals

- Trace partial-write progress and EINTR retry.
- Distinguish locally accepted bytes from remote application consumption.

**Builds on:** [lesson 24](24_stream_framing.md), [lesson 25](25_readn.md).

## Explanation

**Source helper assumptions (repeated for this lesson):** These helpers assume blocking descriptors. A successful write means bytes were accepted locally, not that the peer application consumed them. With nonblocking sockets, preserve progress across `EAGAIN`; also handle `SIGPIPE`/`EPIPE` when writing to a closed connection.

**Code context:** The C listings are teaching fragments using the course support definitions and capitalized wrappers described in [lesson 18](18_wrappers_and_daytime_client.md).

#### 2. `writen()` — Write Exactly $n$ Bytes

Loops calling `write()` until all $n$ bytes have been written to the kernel socket buffer:

```c
ssize_t writen(int fd, const void *vptr, size_t n) {
    size_t      nleft = n;
    ssize_t     nwritten;
    const char *ptr = vptr;

    while (nleft > 0) {
        if ((nwritten = write(fd, ptr, nleft)) <= 0) {
            if (nwritten < 0 && errno == EINTR)
                nwritten = 0; /* interrupted by signal; call write() again */
            else
                return (-1);  /* error */
        }
        nleft -= nwritten;
        ptr   += nwritten;
    }
    return (n);
}
```

## Practice

- **Q025** in [quiz 05](../../quizzes/quiz_05_socket_api.json).

Check the [review queue](review.md) before scored practice. A lesson link can teach the reasoning that exposes a false premise or key; it does not endorse that key. Optional background is listed separately in the [manifest](manifest.json).

## Source

- [Lecture: 2. `writen()` — Write Exactly $n$ Bytes](../../lectures/lecture_05_socket-api.md#2-writen--write-exactly-n-bytes)

[Topic overview](README.md) · [Glossary](glossary.md) · [References](references.md) · [Previous lesson](25_readn.md) · [Next lesson](27_buffered_readline.md)
