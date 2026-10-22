---
id: socket-api-18
topic_id: 05_socket_api
order: 18
title: "Error wrappers and the Daytime client"
source_classification: lecture_guide
estimated_reading_minutes: 2
prerequisite_ids: ["socket-api-08", "socket-api-13"]
---

# 18. Error wrappers and the Daytime client

## Learning goals

- Recognize the course wrapper and constant assumptions.
- Trace the Daytime client initialization, read loop, and EOF handling.

**Builds on:** [lesson 08](08_address_conversion.md), [lesson 13](13_connect_call.md).

## Explanation

**Source code context:** The listings are separate teaching fragments and assume the course support definitions and wrapper library described below. They are not standalone program files.

### 3.3 Walkthrough: Daytime Client and Iterative Daytime Server

The C listings are separate teaching fragments, not one compilation unit. They assume the course support header/library defining `SA`, `MAXLINE`, `SERV_PORT`, `LISTENQ`, capitalized wrappers, and error helpers. Add system headers and declarations when extracting a program.

#### Error-Handling Wrapper Convention

Checking every system call for an error return (`< 0`) is mandatory in network programming. To keep code readable without omitting error checks, Stevens defines **capitalized wrapper functions** (such as `Socket()`, `Bind()`, `Listen()`, `Accept()`, `Write()`, `Close()`) that invoke the underlying lowercase system call and terminate with a diagnostic message via `err_sys()` if an error occurs:

```c
int Socket(int family, int type, int protocol) {
    int n;
    if ((n = socket(family, type, protocol)) < 0)
        err_sys("socket error");
    return (n);
}
```

#### Simple TCP Daytime Client (Port 13)

```c
int main(int argc, char **argv) {
    int                sockfd, n;
    char               recvline[MAXLINE + 1];
    struct sockaddr_in servaddr;

    if (argc != 2)
        err_quit("usage: a.out <IPaddress>");

    if ((sockfd = socket(AF_INET, SOCK_STREAM, 0)) < 0)
        err_sys("socket error");

    bzero(&servaddr, sizeof(servaddr));
    servaddr.sin_family = AF_INET;
    servaddr.sin_port   = htons(13); /* daytime server well-known port */
    if (inet_pton(AF_INET, argv[1], &servaddr.sin_addr) <= 0)
        err_quit("inet_pton error for %s", argv[1]);

    if (connect(sockfd, (SA *) &servaddr, sizeof(servaddr)) < 0)
        err_sys("connect error");

    while ((n = read(sockfd, recvline, MAXLINE)) > 0) {
        recvline[n] = 0; /* null terminate */
        if (fputs(recvline, stdout) == EOF)
            err_sys("fputs error");
    }
    if (n < 0)
        err_sys("read error");

    exit(0);
}
```

## Practice

No native socket API quiz questions are assigned. This teaching is retained for study and revision.

Check the [review queue](review.md) before scored practice. A lesson link can teach the reasoning that exposes a false premise or key; it does not endorse that key. Optional background is listed separately in the [manifest](manifest.json).

## Source

- [Lecture: 3.3 Walkthrough: Daytime Client and Iterative Daytime Server](../../lectures/lecture_05_socket-api.md#33-walkthrough-daytime-client-and-iterative-daytime-server)

[Topic overview](README.md) · [Glossary](glossary.md) · [References](references.md) · [Previous lesson](17_close_call.md) · [Next lesson](19_daytime_server.md)
