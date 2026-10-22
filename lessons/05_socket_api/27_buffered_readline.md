---
id: socket-api-27
topic_id: 05_socket_api
order: 27
title: "Buffered line reading and readiness"
source_classification: lecture_guide
estimated_reading_minutes: 3
prerequisite_ids: ["socket-api-24", "socket-api-25"]
---

# 27. Buffered line reading and readiness

## Learning goals

- Explain per-byte parsing with block prefetch and exposed buffered state.
- Identify hidden buffering, static shared state, and per-connection requirements.

**Builds on:** [lesson 24](24_stream_framing.md), [lesson 25](25_readn.md).

## Explanation

**Source helper assumptions (repeated for this lesson):** These helpers assume blocking descriptors. A successful write means bytes were accepted locally, not that the peer application consumed them. With nonblocking sockets, preserve progress across `EAGAIN`; also handle `SIGPIPE`/`EPIPE` when writing to a closed connection.

**Code context:** The C listings are teaching fragments using the course support definitions and capitalized wrappers described in [lesson 18](18_wrappers_and_daytime_client.md).

#### 3. `readline()` — Buffering and Readiness

A naive `readline()` implementation invokes the `read(fd, &c, 1)` system call once for **every single byte** up to `\n`. While functionally correct, executing a system-call transition per byte is often inefficient.

Why not simply wrap the socket in a C standard I/O (`stdio`) `FILE *` stream and call `fgets()`?
* **The buffering mismatch:** The portable stdio API does not expose a general readiness count for prefetched input.
* If a server or `select()` loop uses `stdio`, multiple lines or unexpected extra protocol bytes may be slurped from the kernel socket buffer into the hidden `stdio` buffer in a single read. `select()` reports kernel-level readiness, not data already prefetched into a library buffer. Waiting only on the descriptor can therefore stall while the library still has unread bytes. Buffering itself is valid; its state must be integrated with the event loop.

#### Solution: `readline()` with an Exposed Internal Buffer (`my_read` and `readlinebuf`)

Instead of `stdio`, we write a custom buffered reader `my_read()` that reads up to `MAXLINE` bytes from the kernel at a time into `read_buf` and parcels them out one byte at a time to `readline()`, accompanied by `readlinebuf()` which **exposes the internal buffer state** so callers can inspect any leftover bytes received beyond a single line:

```c
static int   read_cnt;
static char *read_ptr;
static char  read_buf[MAXLINE];

static ssize_t my_read(int fd, char *ptr) {
    if (read_cnt <= 0) {
    again:
        if ((read_cnt = read(fd, read_buf, sizeof(read_buf))) < 0) {
            if (errno == EINTR)
                goto again;
            return (-1);
        } else if (read_cnt == 0) {
            return (0);
        }
        read_ptr = read_buf;
    }
    read_cnt--;
    *ptr = *read_ptr++;
    return (1);
}

ssize_t readline(int fd, void *vptr, size_t maxlen) {
    size_t n;
    ssize_t rc;
    char    c, *ptr = vptr;
    if (maxlen == 0) { errno = EINVAL; return -1; }

    for (n = 1; n < maxlen; n++) {
        if ((rc = my_read(fd, &c)) == 1) {
            *ptr++ = c;
            if (c == '\n')
                break;       /* newline is stored, like fgets() */
        } else if (rc == 0) {
            *ptr = 0;
            return (n - 1);  /* EOF, n - 1 bytes were read */
        } else {
            return (-1);     /* error, errno set by read() */
        }
    }
    *ptr = 0;                /* null terminate like fgets() */
    return ptr - (char *)vptr; /* bytes stored, excluding NUL */
}

ssize_t readlinebuf(void **vptrptr) {
    if (read_cnt)
        *vptrptr = read_ptr;
    return (read_cnt);
}
```

*(Note: Even with `readlinebuf()`, this single static buffer is neither thread-safe nor safe for alternating between multiple sockets, and still complicates `select()`; therefore, an event-driven server needs per-connection buffering integrated with readiness; line-oriented application protocols remain valid).*

## Practice

- **Q026** in [quiz 05](../../quizzes/quiz_05_socket_api.json); flags: `wording_issue`.

Check the [review queue](review.md) before scored practice. A lesson link can teach the reasoning that exposes a false premise or key; it does not endorse that key. Optional background is listed separately in the [manifest](manifest.json).

## Source

- [Lecture: 3. `readline()` — Buffering and Readiness](../../lectures/lecture_05_socket-api.md#3-readline--buffering-and-readiness)

[Topic overview](README.md) · [Glossary](glossary.md) · [References](references.md) · [Previous lesson](26_writen.md) · [Next lesson](28_baseline_echo_server.md)
