---
id: socket-api-06
topic_id: 05_socket_api
order: 6
title: "Host and network byte order"
source_classification: lecture_guide
estimated_reading_minutes: 3
prerequisite_ids: ["socket-api-02"]
---

# 6. Host and network byte order

## Learning goals

- Read a multibyte value in big- and little-endian storage.
- Choose the host/network conversion for ports and IPv4 addresses.

**Builds on:** [lesson 02](02_clients_and_socket_pairs.md).

## Explanation

**Editorial clarification:** The common network representation is needed even on a homogeneous little-endian LAN. Raw application payloads whose two endpoints use the same private native format are a different case; Q015 needs to identify which fields it means.

## 2. Byte Ordering, Socket Address Structures, and Address Conversion

### 2.1 Little-Endian vs. Big-Endian and Network Byte Order

A 16-bit integer consists of 2 bytes (and a 32-bit integer consists of 4 bytes). Hardware architectures store multi-byte integers in memory using one of two conventions:

| Value 0x0102 | Byte at address A | Byte at address A + 1 |
| --- | --- | --- |
| Big-endian | 0x01, most significant | 0x02, least significant |
| Little-endian | 0x02, least significant | 0x01, most significant |

* **Little-endian byte order:** Stores the **low-order byte (LSB)** at the starting memory address $A$ and the **high-order byte (MSB)** at $A + 1$.
* **Big-endian byte order:** Stores the **high-order byte (MSB)** at the starting memory address $A$ and the **low-order byte (LSB)** at $A + 1$.

A C program can determine a host's byte order at runtime by storing `0x0102` in a 16-bit `short` inside a `union` and inspecting its two constituent bytes:

```c
union {
    short s;
    char  c[sizeof(short)];
} un;

un.s = 0x0102;
if (sizeof(short) == 2) {
    if (un.c[0] == 1 && un.c[1] == 2)
        printf("big-endian\n");
    else if (un.c[0] == 2 && un.c[1] == 1)
        printf("little-endian\n");
    else
        printf("unknown\n");
} else {
    printf("sizeof(short) = %zu\n", sizeof(short));
}
```

#### Network Byte Order and Conversion Functions

Because communicating hosts may have different native CPU byte orderings, networking protocols must mandate a canonical **network byte order** so the sending and receiving stacks agree on multi-byte header fields. **The Internet protocol suite (TCP/IP) uses big-endian byte ordering for the relevant TCP/IP header fields, including ports and IPv4 addresses** (such as 16-bit port numbers and 32-bit IPv4 addresses).

Ports and IPv4 address fields use network byte order. Address-family fields, structure lengths, and other API bookkeeping do not all use network byte order. Four standard functions convert 16- and 32-bit integer values:

* `htons()` (*host to network short*): Converts a 16-bit integer (e.g., port number) from host to network byte order.
* `htonl()` (*host to network long*): Converts a 32-bit integer (e.g., IPv4 address) from host to network byte order.
* `ntohs()` (*network to host short*): Converts a 16-bit integer from network to host byte order.
* `ntohl()` (*network to host long*): Converts a 32-bit integer from network to host byte order.

## Practice

- **Q014** in [quiz 05](../../quizzes/quiz_05_socket_api.json).
- **Q015** in [quiz 05](../../quizzes/quiz_05_socket_api.json); flags: `wording_issue`.

Check the [review queue](review.md) before scored practice. A lesson link can teach the reasoning that exposes a false premise or key; it does not endorse that key. Optional background is listed separately in the [manifest](manifest.json).

## Source

- [Lecture: 2. Byte Ordering, Socket Address Structures, and Address Conversion](../../lectures/lecture_05_socket-api.md#2-byte-ordering-socket-address-structures-and-address-conversion)

[Topic overview](README.md) · [Glossary](glossary.md) · [References](references.md) · [Previous lesson](05_bsd_history.md) · [Next lesson](07_address_structures.md)
