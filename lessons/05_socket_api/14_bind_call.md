---
id: socket-api-14
topic_id: 05_socket_api
order: 14
title: "Choosing a local address with bind()"
source_classification: lecture_guide
estimated_reading_minutes: 2
prerequisite_ids: ["socket-api-03", "socket-api-07", "socket-api-12"]
---

# 14. Choosing a local address with bind()

## Learning goals

- Explain local IP/port choices and wildcard binding.
- Recognize binding errors and the scope of a specific local address.

**Builds on:** [lesson 03](03_services_and_ports.md), [lesson 07](07_address_structures.md), [lesson 12](12_socket_call.md).

## Explanation

#### 3. `bind()` — Assigning a Local Protocol Address

The `bind()` function assigns a local protocol address (IPv4/IPv6 address and 16-bit port number) to a socket:

```c
int bind(int sockfd, const struct sockaddr *myaddr, socklen_t addrlen);
/* Returns: 0 if OK, -1 on error */
```

* **Servers vs. Clients:** Servers almost always call `bind()` at startup to register their well-known port. Normal TCP clients rarely call `bind()`.
* **Specifying IP Address and/or Port in `bind()`:**

| Process Specifies IP Address | Process Specifies Port | Result |
|---|---|---|
| **Wildcard (`INADDR_ANY`)** | `0` | Kernel chooses both the local IP address (upon connection) and an ephemeral port (when `bind` is called). |
| **Wildcard (`INADDR_ANY`)** | Nonzero | Kernel chooses the local IP address (from the client's `SYN` destination IP once connected); process specifies the port. |
| **Local IP address** | `0` | Process specifies the local IP address; kernel chooses an ephemeral port. |
| **Local IP address** | Nonzero | Process explicitly specifies both the local IP address and the port. |

* **Binding a Specific IP vs. Wildcard:**
  * On a **TCP client**, binding a specific local IP address forces all outgoing IP datagrams on that socket to use that source IP.
  * On a **TCP server**, binding a specific local IP restricts the socket to accept incoming client connections destined *only* to that IP address. If the server instead binds `INADDR_ANY` (`0.0.0.0`, whose value is `0`, though `htonl(INADDR_ANY)` is good style), the kernel accepts connections on any interface and uses the destination IP address of the client's `SYN` as the server's source IP address.
* **Common `bind()` Errors:**
  1. Protected port ($< 1024$) requested by a non-superuser (`EACCES`).
  2. The specified address/port is already in use (`EADDRINUSE`, often related to `TIME_WAIT`).
  3. `sockfd` is not a valid socket descriptor.
  4. The socket is already bound to an address.

## Practice

- **Q002** in [quiz 05](../../quizzes/quiz_05_socket_api.json); also requires [lesson 13](13_connect_call.md).
- **Q003** in [quiz 05](../../quizzes/quiz_05_socket_api.json); flags: `wording_issue`.

Check the [review queue](review.md) before scored practice. A lesson link can teach the reasoning that exposes a false premise or key; it does not endorse that key. Optional background is listed separately in the [manifest](manifest.json).

## Source

- [Lecture: 3. `bind()` — Assigning a Local Protocol Address](../../lectures/lecture_05_socket-api.md#3-bind--assigning-a-local-protocol-address)

[Topic overview](README.md) · [Glossary](glossary.md) · [References](references.md) · [Previous lesson](13_connect_call.md) · [Next lesson](15_listen_call.md)
