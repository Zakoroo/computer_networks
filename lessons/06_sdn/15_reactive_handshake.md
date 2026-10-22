---
id: sdn-15
topic_id: 06_sdn
order: 15
title: "A reactive TCP and HTTP exchange"
source_classification: lecture_guide
estimated_reading_minutes: 2
prerequisite_ids: ["sdn-14"]
---

# 15. A reactive TCP and HTTP exchange

## Learning goals

- Trace separate forward and reverse rule installation.
- Explain when subsequent traffic stays in the switch and when control may be needed again.

## Explanation

**Editorial context from the source example:** S1 connects H1/H2/H3/H4 on eth1/eth2/eth3/eth4; C0 controls it. Addresses and link-layer reachability are already resolved. A configured miss rule sends unmatched packets to C0, and buffering is supported in this example. This sequence uses [lesson 14](14_controller_responses.md)'s reactive Flow-MOD option.

#### Complete End-to-End Sequence (Reactive `Flow-MOD` Mode)

```mermaid
sequenceDiagram
    participant H1 as H1<br/>eth1
    participant S1 as Switch S1
    participant C0 as C0
    participant H4 as H4<br/>eth4

    Note over S1: No connection rules<br/>Miss rule sends to C0

    H1->>S1: 1. TCP SYN<br/>H1 to H4:80
    Note over S1: Table miss<br/>Buffer ID 250
    S1->>C0: Packet-IN<br/>SYN / ID 250
    C0->>S1: Flow-MOD<br/>Forward / release 250
    Note over S1: Install H1 to H4:80 rule<br/>Release buffer 250
    S1->>H4: SYN via eth4

    H4->>S1: 2. TCP SYN/ACK<br/>H4 to H1
    Note over S1: Reverse table miss<br/>Buffer ID 251
    S1->>C0: Packet-IN<br/>SYN/ACK / ID 251
    C0->>S1: Flow-MOD<br/>Reverse / release 251
    Note over S1: Install H4 to H1 reply rule<br/>Release buffer 251
    S1->>H1: SYN/ACK via eth1

    Note over H1,H4: S1 now has both directional flow entries

    H1->>S1: 3. TCP ACK
    Note over S1: H1 to H4:80 match<br/>No Packet-IN
    S1->>H4: ACK via eth4

    H1->>S1: 4. HTTP request
    Note over S1: H1 to H4:80 match<br/>Local forwarding
    S1->>H4: Request via eth4

    H4->>S1: 5. HTTP reply
    Note over S1: H4 to H1 reply match<br/>Local forwarding
    S1->>H1: Reply via eth1
```

**Editorial label repair:** The source participant order and message sequence are retained. Short participant names and explicit line breaks keep notes and messages compact.

| Label / phase | Full meaning |
| --- | --- |
| H1 / H4 | Client host H1 on S1 port eth1 / server host H4 on S1 port eth4 |
| S1 / C0 | OpenFlow switch S1 / OpenFlow controller C0 |
| Buffer 250 | Initial H1-to-H4 TCP SYN, destination port 80; the forward Flow-MOD installs its flow entry and releases the buffered packet |
| Buffer 251 | Reverse H4-to-H1 TCP SYN/ACK; the reverse Flow-MOD installs the reply flow entry and releases that packet |
| Steps 3–5 | TCP ACK and HTTP request match the H1-to-H4 port-80 entry; HTTP reply matches the reverse entry. All three forward locally, using eth4 toward H4 and eth1 toward H1 |

Notice the crucial transition after the `SYN` and `SYN/ACK` install the forward (`H1->H4 Port 80`) and reverse (`H4->H1 Reply`) flow entries: **subsequent matching packets can be forwarded locally while those rules remain valid. Rule expiry, a topology change, a different match, or an explicit controller action can require further control-plane involvement. Hardware capability determines actual forwarding performance.**

## Practice

No native quiz question has this lesson as its primary assignment. The source teaching remains included; this lesson may provide required or optional support listed in the [manifest](manifest.json).

## Source

- [Lecture: Complete End-to-End Sequence (Reactive `Flow-MOD` Mode)](../../lectures/lecture_06_sdn.md#complete-end-to-end-sequence-reactive-flow-mod-mode)

[Topic overview](README.md) · [Glossary](glossary.md) · [References](references.md) · [Previous lesson](14_controller_responses.md) · [Next lesson](16_control_paths.md)
