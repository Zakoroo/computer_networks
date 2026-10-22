---
id: socket-api-09
topic_id: 05_socket_api
order: 9
title: "Formatting a complete socket address"
source_classification: lecture_guide
estimated_reading_minutes: 1
prerequisite_ids: ["socket-api-08"]
---

# 9. Formatting a complete socket address

## Learning goals

- Explain why formatting an address and port requires family information.
- Identify the static-storage and missing-IPv6 limitations of the source wrapper.

**Builds on:** [lesson 08](08_address_conversion.md).

## Explanation

**Code context:** The C listings are teaching fragments using the course support definitions and capitalized wrappers described in [lesson 18](18_wrappers_and_daytime_client.md).

#### Wrapper for Address-Family-Independent Formatting (`sock_ntop`)

Because `inet_ntop()` requires the caller to know the address family and pass a pointer to the internal `sin_addr` or `sin6_addr` member, Stevens defines `sock_ntop()`, which takes a generic `struct sockaddr *`, inspects `sa_family`, and formats both the IP address and port number:

```c
char *sock_ntop(const struct sockaddr *sa, socklen_t salen) {
    char portstr[8];
    static char str[128]; /* shared output: not reentrant/thread-safe */

    switch (sa->sa_family) {
    case AF_INET: {
        const struct sockaddr_in *sin = (const struct sockaddr_in *) sa;
        if (inet_ntop(AF_INET, &sin->sin_addr, str, sizeof(str)) == NULL)
            return (NULL);
        if (ntohs(sin->sin_port) != 0) {
            snprintf(portstr, sizeof(portstr), ":%d", ntohs(sin->sin_port));
            strcat(str, portstr);
        }
        return (str);
    }
    /* IPv6 needs its own case and brackets around addresses with ports. */
    default:
        errno = EAFNOSUPPORT;
        return NULL;
    }
}
```

## Practice

No native socket API quiz questions are assigned. This teaching is retained for study and revision.

Check the [review queue](review.md) before scored practice. A lesson link can teach the reasoning that exposes a false premise or key; it does not endorse that key. Optional background is listed separately in the [manifest](manifest.json).

## Source

- [Lecture: Wrapper for Address-Family-Independent Formatting (`sock_ntop`)](../../lectures/lecture_05_socket-api.md#wrapper-for-address-family-independent-formatting-sock_ntop)

[Topic overview](README.md) · [Glossary](glossary.md) · [References](references.md) · [Previous lesson](08_address_conversion.md) · [Next lesson](10_name_resolution.md)
