---
id: socket-api-25
topic_id: 05_socket_api
order: 25
title: "Reading a requested byte count"
source_classification: lecture_guide
estimated_reading_minutes: 2
prerequisite_ids: ["socket-api-24"]
---

# 25. Reading a requested byte count

## Learning goals

- Trace readn progress, interrupted reads, EOF, and errors.
- Explain why waiting for a requested count can block.

**Builds on:** [lesson 24](24_stream_framing.md).

## Explanation

**Code context:** The C listings are teaching fragments using the course support definitions and capitalized wrappers described in [lesson 18](18_wrappers_and_daytime_client.md).

### 5.2 Implementing `readn`, `writen`, and Buffered `readline`

To handle short counts and interrupted system calls (`errno == EINTR`) cleanly, we use three helper functions: `readn()`, `writen()`, and `readline()`.

These helpers assume blocking descriptors. A successful write means bytes were accepted locally, not that the peer application consumed them. With nonblocking sockets, preserve progress across `EAGAIN`; also handle `SIGPIPE`/`EPIPE` when writing to a closed connection.

#### 1. `readn()` — Read Exactly $n$ Bytes

Loops calling `read()` until $n$ bytes have been received, EOF (`0`) is reached, or an unrecoverable error occurs (restarting automatically on `EINTR`):

```c
ssize_t readn(int fd, void *vptr, size_t n) {
    size_t  nleft = n;
    ssize_t nread;
    char   *ptr = vptr;

    while (nleft > 0) {
        if ((nread = read(fd, ptr, nleft)) < 0) {
            if (errno == EINTR)
                nread = 0; /* interrupted by signal; call read() again */
            else
                return (-1);
        } else if (nread == 0) {
            break;         /* EOF */
        }
        nleft -= nread;
        ptr   += nread;
    }
    return (n - nleft);    /* return >= 0 */
}
```

## Practice

- **Q024** in [quiz 05](../../quizzes/quiz_05_socket_api.json).
- **Q031** in [quiz 05](../../quizzes/quiz_05_socket_api.json); flags: `wording_issue`; also requires [lesson 26](26_writen.md), [lesson 31](31_select_readiness.md).

Check the [review queue](review.md) before scored practice. A lesson link can teach the reasoning that exposes a false premise or key; it does not endorse that key. Optional background is listed separately in the [manifest](manifest.json).

## Source

- [Lecture: 5.2 Implementing `readn`, `writen`, and Buffered `readline`](../../lectures/lecture_05_socket-api.md#52-implementing-readn-writen-and-buffered-readline)

[Topic overview](README.md) · [Glossary](glossary.md) · [References](references.md) · [Previous lesson](24_stream_framing.md) · [Next lesson](26_writen.md)
