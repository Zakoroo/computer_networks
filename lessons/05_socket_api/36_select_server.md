---
id: socket-api-36
topic_id: 05_socket_api
order: 36
title: "A select-based concurrent echo server"
source_classification: lecture_guide
estimated_reading_minutes: 4
prerequisite_ids: ["socket-api-26", "socket-api-31", "socket-api-35"]
---

# 36. A select-based concurrent echo server

## Learning goals

- Trace master sets, ready sets, client slots, and maxfd.
- Explain EOF cleanup, descriptor-value bounds, and remaining output-blocking limits.

**Builds on:** [lesson 26](26_writen.md), [lesson 31](31_select_readiness.md), [lesson 35](35_server_concurrency.md).

## Explanation

**Editorial reading note:** Q044 combines the master-set bookkeeping below with the descriptor-number scan bound in [lesson 31](31_select_readiness.md). For Q077/Q078, use [lesson 17](17_close_call.md) to distinguish descriptor close and kernel-queued data from the application output-queue limitation below. These supporting lessons are listed as additional required reading in Practice.

**Code context:** The C listings are teaching fragments using the course support definitions and capitalized wrappers described in [lesson 18](18_wrappers_and_daytime_client.md).

### 7.2 Event-Driven Single-Process Server Using `select()`

To serve multiple clients concurrently inside a single process without `fork()`, the server maintains two data structures:
1. `fd_set allset`: The master read descriptor bitmask tracking `listenfd` (descriptor `3` in this example, assuming no other descriptors were already open) plus all currently active `connfd` descriptors.
2. `int client[FD_SETSIZE]`: An integer array (initialized to `-1`) storing the active `connfd` values, along with `maxi` (the highest index in `client[]` currently in use) and `maxfd` (the highest descriptor number for `select(maxfd + 1, ...)`).

| Event | Active client descriptors | Master read-interest set | `maxfd + 1` |
| --- | --- | --- | ---: |
| Before clients | None | {3} | 4 |
| First client accepted | {4} | {3, 4} | 5 |
| Second client accepted | {4, 5} | {3, 4, 5} | 6 |
| First client closes | {5} | {3, 5} | 6 |

Descriptor 3 is the listening socket in this example. The **master interest set** is distinct from the `rset` result returned by select, which contains only ready descriptors.

#### Baseline `select()`-Based Concurrent TCP Echo Server

```c
int main(int argc, char **argv) {
    int                i, maxi, maxfd, listenfd, connfd, sockfd;
    int                nready, client[FD_SETSIZE];
    ssize_t            n;
    fd_set             rset, allset;
    char               buf[MAXLINE];
    socklen_t          clilen;
    struct sockaddr_in cliaddr, servaddr;

    listenfd = Socket(AF_INET, SOCK_STREAM, 0);
    bzero(&servaddr, sizeof(servaddr));
    servaddr.sin_family      = AF_INET;
    servaddr.sin_addr.s_addr = htonl(INADDR_ANY);
    servaddr.sin_port        = htons(SERV_PORT);

    Bind(listenfd, (SA *) &servaddr, sizeof(servaddr));
    Listen(listenfd, LISTENQ);

    maxfd = listenfd; /* initialize */
    maxi  = -1;       /* index into client[] array */
    for (i = 0; i < FD_SETSIZE; i++)
        client[i] = -1; /* -1 indicates available entry */
    if (listenfd >= FD_SETSIZE)
        err_quit("listening descriptor exceeds FD_SETSIZE");
    FD_ZERO(&allset);
    FD_SET(listenfd, &allset);

    for ( ; ; ) {
        rset   = allset; /* structure assignment */
        nready = Select(maxfd + 1, &rset, NULL, NULL, NULL);

        if (FD_ISSET(listenfd, &rset)) { /* new client connection */
            clilen = sizeof(cliaddr);
            connfd = Accept(listenfd, (SA *) &cliaddr, &clilen);

            for (i = 0; i < FD_SETSIZE; i++)
                if (client[i] < 0) {
                    client[i] = connfd; /* save descriptor */
                    break;
                }
            if (i == FD_SETSIZE)
                err_quit("too many clients");

            if (connfd >= FD_SETSIZE) {
                Close(connfd);
                client[i] = -1;
                continue;
            }
            FD_SET(connfd, &allset); /* fd value must fit the bitmap */
            if (connfd > maxfd)
                maxfd = connfd;      /* for select */
            if (i > maxi)
                maxi = i;            /* max index in client[] array */

            if (--nready <= 0)
                continue;            /* no more readable descriptors */
        }

        for (i = 0; i <= maxi; i++) { /* check all clients for data */
            if ((sockfd = client[i]) < 0)
                continue;
            if (FD_ISSET(sockfd, &rset)) {
                if ((n = Read(sockfd, buf, MAXLINE)) == 0) {
                    /* connection closed by client */
                    Close(sockfd);
                    FD_CLR(sockfd, &allset);
                    client[i] = -1;
                } else {
                    Writen(sockfd, buf, n);
                }
                if (--nready <= 0)
                    break; /* no more readable descriptors */
            }
        }
    }
}
```

**Limit of this example:** `Writen()` still blocks if a peer stops reading, so read multiplexing alone is not a production event loop. A fully nonblocking design maintains an output queue per client, monitors writability only while that queue is nonempty, and handles partial writes and `EAGAIN`. Apply timeouts and bounds to both input and output buffers.

## Practice

- **Q043** in [quiz 05](../../quizzes/quiz_05_socket_api.json).
- **Q044** in [quiz 05](../../quizzes/quiz_05_socket_api.json); flags: `wording_issue`; also requires [lesson 31](31_select_readiness.md).
- **Q066** in [quiz 05](../../quizzes/quiz_05_socket_api.json); also requires [lesson 26](26_writen.md).
- **Q077** in [quiz 05](../../quizzes/quiz_05_socket_api.json); flags: `wording_issue`; also requires [lesson 17](17_close_call.md).
- **Q078** in [quiz 05](../../quizzes/quiz_05_socket_api.json); also requires [lesson 17](17_close_call.md).
- **Q080** in [quiz 05](../../quizzes/quiz_05_socket_api.json).

Check the [review queue](review.md) before scored practice. A lesson link can teach the reasoning that exposes a false premise or key; it does not endorse that key. Optional background is listed separately in the [manifest](manifest.json).

## Source

- [Lecture: 7.2 Event-Driven Single-Process Server Using `select()`](../../lectures/lecture_05_socket-api.md#72-event-driven-single-process-server-using-select)

[Topic overview](README.md) · [Glossary](glossary.md) · [References](references.md) · [Previous lesson](35_server_concurrency.md) · [Next lesson](37_partial_lines_and_state.md)
