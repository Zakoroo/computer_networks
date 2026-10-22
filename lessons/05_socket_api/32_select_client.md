---
id: socket-api-32
topic_id: 05_socket_api
order: 32
title: "A client waiting on stdin and its socket"
source_classification: lecture_guide
estimated_reading_minutes: 1
prerequisite_ids: ["socket-api-27", "socket-api-29", "socket-api-31"]
---

# 32. A client waiting on stdin and its socket

## Learning goals

- Trace independent readiness checks for the two input descriptors.
- Retain the intermediate client limitations.

**Builds on:** [lesson 27](27_buffered_readline.md), [lesson 29](29_baseline_echo_client.md), [lesson 31](31_select_readiness.md).

## Explanation

**Code context:** The C listings are teaching fragments using the course support definitions and capitalized wrappers described in [lesson 18](18_wrappers_and_daytime_client.md).

### 6.3 Revisiting `str_cli` with `select()`, Batch Input Pipelining, and `shutdown()`

#### Step 1: Event-Driven `str_cli` Using `select()`

Monitoring both descriptors lets the application react when the socket has data, EOF, or an error while waiting for keyboard input. A process exit may cause an orderly close or reset; a host failure can be silent until a timeout. This intermediate version still has line-buffering and batch-termination problems, addressed below:

```c
void str_cli(FILE *fp, int sockfd) {
    int    maxfdp1;
    fd_set rset;
    char   sendline[MAXLINE], recvline[MAXLINE];

    FD_ZERO(&rset);
    for ( ; ; ) {
        FD_SET(fileno(fp), &rset);
        FD_SET(sockfd, &rset);
        maxfdp1 = max(fileno(fp), sockfd) + 1;
        Select(maxfdp1, &rset, NULL, NULL, NULL);

        if (FD_ISSET(sockfd, &rset)) { /* socket is readable */
            if (Readline(sockfd, recvline, MAXLINE) == 0)
                err_quit("str_cli: server terminated prematurely");
            Fputs(recvline, stdout);
        }
        if (FD_ISSET(fileno(fp), &rset)) { /* input is readable */
            if (Fgets(sendline, MAXLINE, fp) == NULL)
                return; /* all done <-- BUG IN BATCH MODE! */
            Writen(sockfd, sendline, strlen(sendline));
        }
    }
}
```

## Practice

- **Q054** in [quiz 05](../../quizzes/quiz_05_socket_api.json); flags: `wording_issue`; also requires [lesson 30](30_io_models.md).

Check the [review queue](review.md) before scored practice. A lesson link can teach the reasoning that exposes a false premise or key; it does not endorse that key. Optional background is listed separately in the [manifest](manifest.json).

## Source

- [Lecture: 6.3 Revisiting `str_cli` with `select()`, Batch Input Pipelining, and `shutdown()`](../../lectures/lecture_05_socket-api.md#63-revisiting-str_cli-with-select-batch-input-pipelining-and-shutdown)

[Topic overview](README.md) · [Glossary](glossary.md) · [References](references.md) · [Previous lesson](31_select_readiness.md) · [Next lesson](33_batch_pipelining.md)
