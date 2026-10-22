---
id: socket-api-29
topic_id: 05_socket_api
order: 29
title: "The baseline echo client and its blocking flaw"
source_classification: lecture_guide
estimated_reading_minutes: 2
prerequisite_ids: ["socket-api-18", "socket-api-27", "socket-api-28"]
---

# 29. The baseline echo client and its blocking flaw

## Learning goals

- Trace the line-oriented client exchange.
- Explain delayed detection of peer closure while blocked on stdin.

**Builds on:** [lesson 18](18_wrappers_and_daytime_client.md), [lesson 27](27_buffered_readline.md), [lesson 28](28_baseline_echo_server.md).

## Explanation

**Code context:** The C listings are teaching fragments using the course support definitions and capitalized wrappers described in [lesson 18](18_wrappers_and_daytime_client.md).

#### Baseline Echo Client (`main` and `str_cli`)

```c
int main(int argc, char **argv) {
    int                sockfd;
    struct sockaddr_in servaddr;

    if (argc != 2)
        err_quit("usage: tcpcli <IPaddress>");

    sockfd = Socket(AF_INET, SOCK_STREAM, 0);
    bzero(&servaddr, sizeof(servaddr));
    servaddr.sin_family = AF_INET;
    servaddr.sin_port   = htons(SERV_PORT);
    Inet_pton(AF_INET, argv[1], &servaddr.sin_addr);

    Connect(sockfd, (SA *) &servaddr, sizeof(servaddr));
    str_cli(stdin, sockfd); /* do it all */
    exit(0);
}

void str_cli(FILE *fp, int sockfd) {
    char sendline[MAXLINE], recvline[MAXLINE];

    while (Fgets(sendline, MAXLINE, fp) != NULL) {
        Writen(sockfd, sendline, strlen(sendline));
        if (Readline(sockfd, recvline, MAXLINE) == 0)
            err_quit("str_cli: server terminated prematurely");
        Fputs(recvline, stdout);
    }
}
```

#### The Flaw in Baseline `str_cli`

Notice that `str_cli` handles two inputs (`stdin` and `sockfd`), but blocks inside `Fgets()` waiting for user keyboard input. If the server process crashes or is killed while the client is blocked inside `Fgets()`, an orderly server-side close can send FIN (the client TCP acknowledges it and enters CLOSE_WAIT), **but the client application process never notices the `FIN`/EOF until the user eventually types a line on `stdin` and the program reaches `Readline()`.** To fix this, a process must wait on *any* of multiple descriptors simultaneously using **I/O multiplexing**.

---

## Practice

No native socket API quiz questions are assigned. This teaching is retained for study and revision.

Check the [review queue](review.md) before scored practice. A lesson link can teach the reasoning that exposes a false premise or key; it does not endorse that key. Optional background is listed separately in the [manifest](manifest.json).

## Source

- [Lecture: Baseline Echo Client (`main` and `str_cli`)](../../lectures/lecture_05_socket-api.md#baseline-echo-client-main-and-str_cli)

[Topic overview](README.md) · [Glossary](glossary.md) · [References](references.md) · [Previous lesson](28_baseline_echo_server.md) · [Next lesson](30_io_models.md)
