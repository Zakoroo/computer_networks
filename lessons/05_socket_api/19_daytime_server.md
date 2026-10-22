---
id: socket-api-19
topic_id: 05_socket_api
order: 19
title: "An iterative Daytime server"
source_classification: lecture_guide
estimated_reading_minutes: 1
prerequisite_ids: ["socket-api-15", "socket-api-16", "socket-api-17", "socket-api-18"]
---

# 19. An iterative Daytime server

## Learning goals

- Trace accepting a client, writing a time response, and closing it.
- Explain the sequential service behavior and kernel queueing.

**Builds on:** [lesson 15](15_listen_call.md), [lesson 16](16_accept_call.md), [lesson 17](17_close_call.md), [lesson 18](18_wrappers_and_daytime_client.md).

## Explanation

**Code context:** The C listings are teaching fragments using the course support definitions and capitalized wrappers described in [lesson 18](18_wrappers_and_daytime_client.md).

#### Simple Iterative TCP Daytime Server (Port 13)

```c
int main(int argc, char **argv) {
    int                listenfd, connfd;
    struct sockaddr_in servaddr;
    char               buff[MAXLINE];
    time_t             ticks;

    listenfd = Socket(AF_INET, SOCK_STREAM, 0);

    bzero(&servaddr, sizeof(servaddr));
    servaddr.sin_family      = AF_INET;
    servaddr.sin_addr.s_addr = htonl(INADDR_ANY); /* wildcard IP */
    servaddr.sin_port        = htons(13);         /* daytime server */

    Bind(listenfd, (SA *) &servaddr, sizeof(servaddr));
    Listen(listenfd, LISTENQ);

    for ( ; ; ) {
        connfd = Accept(listenfd, (SA *) NULL, NULL);

        ticks = time(NULL);
        snprintf(buff, sizeof(buff), "%.24s\r\n", ctime(&ticks));
        Writen(connfd, buff, strlen(buff));

        Close(connfd);
    }
}
```

This server is an **iterative server**: it processes one client completely from `Accept()` through `Writen()` and `Close()` before looping back to `Accept()` the next client. If multiple client handshakes complete simultaneously, the kernel queues them up to `LISTENQ` and hands them to `Accept()` one at a time.

---

## Practice

No native socket API quiz questions are assigned. This teaching is retained for study and revision.

Check the [review queue](review.md) before scored practice. A lesson link can teach the reasoning that exposes a false premise or key; it does not endorse that key. Optional background is listed separately in the [manifest](manifest.json).

## Source

- [Lecture: Simple Iterative TCP Daytime Server (Port 13)](../../lectures/lecture_05_socket-api.md#simple-iterative-tcp-daytime-server-port-13)

[Topic overview](README.md) · [Glossary](glossary.md) · [References](references.md) · [Previous lesson](18_wrappers_and_daytime_client.md) · [Next lesson](20_handshake_and_queues.md)
