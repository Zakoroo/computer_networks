---
id: dns-01
topic_id: 02_dns
order: 1
title: "Names, URLs, and the purpose of DNS"
source_classification: lecture_guide
estimated_reading_minutes: 2
prerequisite_ids: []
---

# 01. Names, URLs, and the purpose of DNS

## Learning goals

- Identify the hostname DNS resolves within a URL.
- Explain name resolution as a library service that can consult DNS or local sources.

## Explanation

An application needs an address to communicate over IP, but people prefer memorable names. **DNS maps symbolic names to values**, including IP addresses, mail servers, and service information. Library functions such as `getaddrinfo()` provide applications with a name-resolution interface. In the DNS path, the system's resolver communicates with a DNS server using UDP or TCP. The function can also consult other locally configured naming sources, so calling it does not necessarily cause a DNS packet.

For example, a mail application working with `user@example.com` needs to discover where to send mail, resolve the relevant server's address, and then use TCP/IP to communicate. The lecture's basic address example is `example.com` and `93.184.216.34`. Mail-specific discovery adds the MX lookup explained later.

A URL contains more information than DNS resolves:

```text
http://user:pass@google.com:80/docs/index.html?lang=en&sort=asc#section2
```

- **Scheme:** `http`, followed by `:`. Other examples include `https`, `ftp`, `mailto`, `file`, `data`, and `irc`.
- **Authority:** introduced by `//`, here `user:pass@google.com:80`. It contains optional user information, a host, and an optional port.
- **User information:** `user:pass`.
- **Host and port:** `google.com` and `80`. DNS resolves the hostname, not the whole URL.
- **Path:** `/docs/index.html`.
- **Query:** `lang=en&sort=asc`, introduced by `?`, carries parameters.
- **Fragment:** `section2`, introduced by `#`, identifies a location within the resource.

Thus `https://www.example.com/state/city.html` uses HTTPS, host `www.example.com`, and path `/state/city.html`. A query such as `?query=URL+parsing` adds search parameters without changing the host being resolved.

## Practice

Assigned DNS questions: Q001, Q002.

Consult [review.md](review.md) before scored practice. Assigned DNS questions need no additional lesson to answer the supported concepts; optional links in the manifest provide background.

## Source

- [Lecture 02: 1. Names, URLs, and the purpose of DNS](../../lectures/lecture_02_dns.md#1-names-urls-and-the-purpose-of-dns)

[Topic overview](README.md) · [Glossary](glossary.md) · [References](references.md) · [Next lesson](02_scalable_naming.md)
