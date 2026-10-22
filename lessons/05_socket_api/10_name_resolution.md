---
id: socket-api-10
topic_id: 05_socket_api
order: 10
title: "Protocol-independent name resolution"
source_classification: lecture_guide
estimated_reading_minutes: 2
prerequisite_ids: ["socket-api-07", "socket-api-08"]
---

# 10. Protocol-independent name resolution

## Learning goals

- Compare getaddrinfo/getnameinfo with legacy host interfaces.
- Explain trying an ordered list of resolved address candidates.

**Builds on:** [lesson 07](07_address_structures.md), [lesson 08](08_address_conversion.md).

## Explanation

#### Domain Name System (DNS) Resolution

DNS maps between domain names (e.g., `www.cs.cmu.edu`) and IP addresses (`128.2.203.179`) in a worldwide distributed database:

* **Modern Resolver API (`getaddrinfo()` and `getnameinfo()`):** Prefer `getaddrinfo()` for portable name/service resolution:
  * It is **thread-safe** (unlike `gethostbyname()`).
  * It is **protocol-independent**: a single code path serves both IPv4 and IPv6 without conditional compilation.
  * It returns an **ordered linked list of address structures**; a client walks the list and tries `socket()`/`connect()` on each entry in turn until one succeeds.
  * `getnameinfo()` formats a socket address as host/service strings; flags can request numeric output without DNS lookup.
* **Legacy Resolver API (`gethostbyname()`, `gethostbyaddr()`, `struct hostent`):** historical interfaces with portability and shared-storage limitations; support varies by function and platform. They are still encountered in legacy code and lab exercises. For example, an echo server using the legacy API can identify a connected client's hostname and dotted-decimal IP string via:

```c
struct hostent *hp; /* pointer to DNS host entry */
char *haddrp;       /* pointer to dotted decimal string */

hp = Gethostbyaddr((const char *)&clientaddr.sin_addr.s_addr,
                   sizeof(clientaddr.sin_addr.s_addr), AF_INET);
haddrp = inet_ntoa(clientaddr.sin_addr);
printf("server connected to %s (%s)\n", hp->h_name, haddrp);
```

---

## Practice

- **Q016** in [quiz 05](../../quizzes/quiz_05_socket_api.json).

Check the [review queue](review.md) before scored practice. A lesson link can teach the reasoning that exposes a false premise or key; it does not endorse that key. Optional background is listed separately in the [manifest](manifest.json).

## Source

- [Lecture: Domain Name System (DNS) Resolution](../../lectures/lecture_05_socket-api.md#domain-name-system-dns-resolution)

[Topic overview](README.md) · [Glossary](glossary.md) · [References](references.md) · [Previous lesson](09_socket_formatting.md) · [Next lesson](11_session_overview.md)
