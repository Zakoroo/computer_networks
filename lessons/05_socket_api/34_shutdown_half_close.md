---
id: socket-api-34
topic_id: 05_socket_api
order: 34
title: "shutdown and a half-close-aware client"
source_classification: lecture_guide
estimated_reading_minutes: 3
prerequisite_ids: ["socket-api-17", "socket-api-21", "socket-api-33"]
---

# 34. shutdown and a half-close-aware client

## Learning goals

- Explain directional shutdown and reference-count independence.
- Trace sending EOF while continuing to receive server replies.

**Builds on:** [lesson 17](17_close_call.md), [lesson 21](21_orderly_teardown.md), [lesson 33](33_batch_pipelining.md).

## Explanation

**Editorial reading note:** To review Q076's claimed data loss, combine the queued-data/FIN ordering below with the receiving-side buffered-data/EOF ordering in [lesson 21](21_orderly_teardown.md). That lesson is additional required reading for this comparison.

**Code context:** The C listings are teaching fragments using the course support definitions and capitalized wrappers described in [lesson 18](18_wrappers_and_daytime_client.md).

#### Step 3: Fixing Batch Mode with `shutdown()` (TCP Half-Close) and Raw Buffer I/O

In batch mode, reaching EOF on `stdin` only means we have finished *writing* to the socket; we have not finished *reading* echoed replies from the socket. We need to send a `FIN` to the server (closing the write half of the connection) while keeping the read half open. This is accomplished with `shutdown()`:

```c
int shutdown(int sockfd, int howto);
/* Returns: 0 if OK, -1 on error */
```

#### Two Key Differences Between `close()` and `shutdown()`

1. **Reference Count Independence:** `close()` releases one reference to the underlying socket and sends a `FIN` only when the count reaches `0`. **`shutdown(SHUT_WR)` disables further sends on the underlying socket even if duplicate descriptors remain. FIN follows queued data; `SHUT_RD` alone does not send FIN.**
2. **Directional Control (`howto`):** `close()` releases this descriptor, so the caller loses both I/O directions through it; other references can keep the socket alive. `shutdown()` allows closing a single half of the full-duplex connection:
   * `SHUT_RD`: Disable further receive operations; exact handling of queued data is platform-dependent.
   * `SHUT_WR`: Close the write half of the socket (**half-close**: send any queued data followed by a `FIN`, while leaving the socket open for reading).
   * `SHUT_RDWR`: Close both the read half and the write half (`SHUT_RD` followed by `SHUT_WR`).

#### Half-Close-Aware `str_cli` (Blocking Teaching Example)

```c
void str_cli(FILE *fp, int sockfd) {
    int    maxfdp1, stdineof;
    fd_set rset;
    char   buf[MAXLINE];
    ssize_t n;

    stdineof = 0;
    FD_ZERO(&rset);
    for ( ; ; ) {
        if (stdineof == 0)
            FD_SET(fileno(fp), &rset);
        FD_SET(sockfd, &rset);
        maxfdp1 = max(fileno(fp), sockfd) + 1;
        Select(maxfdp1, &rset, NULL, NULL, NULL);

        if (FD_ISSET(sockfd, &rset)) { /* socket is readable */
            if ((n = Read(sockfd, buf, MAXLINE)) == 0) {
                if (stdineof == 1)
                    return; /* normal termination: peer finished sending */
                else
                    err_quit("str_cli: server terminated prematurely");
            }
            Writen(fileno(stdout), buf, (size_t)n);
        }

        if (FD_ISSET(fileno(fp), &rset)) { /* input is readable */
            if ((n = Read(fileno(fp), buf, MAXLINE)) == 0) {
                stdineof = 1;
                Shutdown(sockfd, SHUT_WR); /* send FIN (half-close) */
                FD_CLR(fileno(fp), &rset);
                continue;
            }
            Writen(sockfd, buf, n);
        }
    }
}
```

---

## Practice

- **Q070** in [quiz 05](../../quizzes/quiz_05_socket_api.json).
- **Q073** in [quiz 05](../../quizzes/quiz_05_socket_api.json); flags: `wording_issue`; also requires [lesson 28](28_baseline_echo_server.md).
- **Q076** in [quiz 05](../../quizzes/quiz_05_socket_api.json); flags: `wording_issue`; also requires [lesson 21](21_orderly_teardown.md).

Check the [review queue](review.md) before scored practice. A lesson link can teach the reasoning that exposes a false premise or key; it does not endorse that key. Optional background is listed separately in the [manifest](manifest.json).

## Source

- [Lecture: Step 3: Fixing Batch Mode with `shutdown()` (TCP Half-Close) and Raw Buffer I/O](../../lectures/lecture_05_socket-api.md#step-3-fixing-batch-mode-with-shutdown-tcp-half-close-and-raw-buffer-io)

[Topic overview](README.md) · [Glossary](glossary.md) · [References](references.md) · [Previous lesson](33_batch_pipelining.md) · [Next lesson](35_server_concurrency.md)
