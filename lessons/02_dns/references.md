# References and technical clarifications

The lecture is the principal source. The following primary references support the explicitly marked clarifications and provide further reading; dated lookup examples above remain lecture examples.

- [RFC 952 — DoD Internet Host Table Specification](https://www.rfc-editor.org/rfc/rfc952): historical hosts files.
- [RFC 1035 — Domain Names: Implementation and Specification](https://www.rfc-editor.org/rfc/rfc1035): message structure, labels, compression, and records.
- [RFC 1996 — DNS NOTIFY](https://www.rfc-editor.org/rfc/rfc1996): prompting secondary refresh.
- [RFC 2181 — Clarifications to the DNS Specification](https://www.rfc-editor.org/rfc/rfc2181): aliases, mail-exchanger targets, and general DNS-name syntax.
- [RFC 2308 — Negative Caching](https://www.rfc-editor.org/rfc/rfc2308): negative responses and SOA timing.
- [RFC 3172 — Management Guidelines for the ARPA Domain](https://www.rfc-editor.org/rfc/rfc3172): infrastructure namespace.
- [RFC 4035 — Protocol Modifications for DNSSEC](https://www.rfc-editor.org/rfc/rfc4035): validation and DNSSEC header flags.
- [RFC 5011 — Automated DNSSEC Trust-Anchor Updates](https://www.rfc-editor.org/rfc/rfc5011): adoption, revocation, and hold-down rules.
- [RFC 5321 — SMTP](https://www.rfc-editor.org/rfc/rfc5321): mail delivery and transient failures.
- [RFC 6891 — EDNS(0)](https://www.rfc-editor.org/rfc/rfc6891): extended DNS messages and UDP sizes.
- [RFC 7208 — SPF](https://www.rfc-editor.org/rfc/rfc7208): authorization semantics, neutral, and softfail.
- [RFC 7858 — DNS over TLS](https://www.rfc-editor.org/rfc/rfc7858), [RFC 8484 — DNS over HTTPS](https://www.rfc-editor.org/rfc/rfc8484), and [RFC 9250 — DNS over QUIC](https://www.rfc-editor.org/rfc/rfc9250).
- [RFC 8145 — DNSSEC Trust-Anchor Signaling](https://www.rfc-editor.org/rfc/rfc8145): observations of resolver readiness.
- [RFC 9156 — QNAME Minimisation](https://www.rfc-editor.org/rfc/rfc9156) and [RFC 9230 — Oblivious DoH](https://www.rfc-editor.org/rfc/rfc9230): reducing query disclosure.
- [IANA — Root Zone Begins Using New KSK](https://www.iana.org/news/2026/root-zone-begins-using-new-ksk-2026): 11 October 2026 signing change.
- [ICANN — Root Zone KSK Rollover](https://www.icann.org/resources/pages/ksk-rollover-en): operational guidance and milestones.
- [APNIC Labs — Sweden DNSSEC Validation](https://stats.labs.apnic.net/dnssec/SE) and [DNSViz](https://dnsviz.net/d/chalmers.se): measurement and diagnostic exercises.

## Additional review references

- [RFC 1034](https://www.rfc-editor.org/rfc/rfc1034.html#section-5.3.1): stub resolvers and CNAME processing.
- [RFC 5452 §9.1](https://www.rfc-editor.org/rfc/rfc5452.html#section-9.1): query matching before accepting a response.

[Topic overview](README.md)
