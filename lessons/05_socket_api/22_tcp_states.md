---
id: socket-api-22
topic_id: 05_socket_api
order: 22
title: "TCP states and simultaneous open or close"
source_classification: lecture_guide
estimated_reading_minutes: 2
prerequisite_ids: ["socket-api-20", "socket-api-21"]
---

# 22. TCP states and simultaneous open or close

## Learning goals

- Follow ordinary setup and teardown states.
- Trace the simultaneous-open and simultaneous-close paths.

**Builds on:** [lesson 20](20_handshake_and_queues.md), [lesson 21](21_orderly_teardown.md).

## Explanation

### 4.3 TCP State Transitions and Packet Trace

```mermaid
flowchart TB
    START(( )) --> CLOSED(["CLOSED"])

    subgraph SETUP["Connection setup"]
        LISTEN(["LISTEN"])
        SYN_SENT(["SYN_SENT"])
        SYN_RCVD(["SYN_RCVD"])
    end

    subgraph DATA["Data transfer"]
        ESTABLISHED(["ESTABLISHED"])
    end

    subgraph ACTIVE["Active close"]
        FIN_WAIT_1(["FIN_WAIT_1"])
        FIN_WAIT_2(["FIN_WAIT_2"])
        CLOSING(["CLOSING"])
        TIME_WAIT(["TIME_WAIT"])
    end

    subgraph PASSIVE["Passive close"]
        CLOSE_WAIT(["CLOSE_WAIT"])
        LAST_ACK(["LAST_ACK"])
    end

    CLOSED -->|"passive open"| LISTEN
    CLOSED -->|"active open / SYN"| SYN_SENT
    LISTEN -->|"close"| CLOSED
    LISTEN -->|"rcv SYN / SYN+ACK"| SYN_RCVD
    LISTEN -->|"send data / SYN"| SYN_SENT
    SYN_SENT -->|"close or timeout"| CLOSED
    SYN_SENT -->|"rcv SYN / SYN+ACK, simultaneous open"| SYN_RCVD
    SYN_SENT -->|"rcv SYN+ACK / ACK"| ESTABLISHED
    SYN_RCVD -->|"rcv RST"| LISTEN
    SYN_RCVD -->|"rcv ACK"| ESTABLISHED
    SYN_RCVD -->|"close / FIN"| FIN_WAIT_1

    ESTABLISHED -->|"close / FIN"| FIN_WAIT_1
    ESTABLISHED -->|"rcv FIN / ACK"| CLOSE_WAIT

    FIN_WAIT_1 -->|"rcv ACK"| FIN_WAIT_2
    FIN_WAIT_1 -->|"rcv FIN / ACK, simultaneous close"| CLOSING
    FIN_WAIT_1 -->|"rcv FIN+ACK / ACK"| TIME_WAIT
    FIN_WAIT_2 -->|"rcv FIN / ACK"| TIME_WAIT
    CLOSING -->|"rcv ACK"| TIME_WAIT
    TIME_WAIT -->|"2MSL timeout"| CLOSED

    CLOSE_WAIT -->|"close / FIN"| LAST_ACK
    LAST_ACK -->|"rcv ACK"| CLOSED
```

Notice the two special edge cases captured in the state machine:
* **Simultaneous open (`SYN_SENT` $\to$ `SYN_RCVD`):** Both ends perform an active open at nearly the same instant and their `SYN`s cross in the network.
* **Simultaneous close (`FIN_WAIT_1` $\to$ `CLOSING` $\to$ `TIME_WAIT`):** Both applications call `close()` simultaneously while in `ESTABLISHED`, and their `FIN`s cross in the network.

## Practice

- **Q008** in [quiz 05](../../quizzes/quiz_05_socket_api.json).

Check the [review queue](review.md) before scored practice. A lesson link can teach the reasoning that exposes a false premise or key; it does not endorse that key. Optional background is listed separately in the [manifest](manifest.json).

## Source

- [Lecture: 4.3 TCP State Transitions and Packet Trace](../../lectures/lecture_05_socket-api.md#43-tcp-state-transitions-and-packet-trace)

[Topic overview](README.md) · [Glossary](glossary.md) · [References](references.md) · [Previous lesson](21_orderly_teardown.md) · [Next lesson](23_time_wait.md)
