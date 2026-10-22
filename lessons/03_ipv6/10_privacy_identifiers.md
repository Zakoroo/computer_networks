---
id: ipv6-10
topic_id: 03_ipv6
order: 10
title: "Stable and temporary interface identifiers"
source_classification: lecture_guide
estimated_reading_minutes: 2
prerequisite_ids: ["ipv6-08", "ipv6-09"]
---

# 10. Stable and temporary interface identifiers

## Learning goals

- Explain MAC-based tracking and alternative IID lifetimes.
- Avoid inferring a configuration mechanism from matching suffixes alone.

**Builds on:** [Router advertisements, SLAAC, and DHCPv6](08_slaac_and_dhcpv6.md), [Deriving modified EUI-64 identifiers](09_eui64.md).

## Explanation

A MAC-derived IID can remain constant as a device changes networks, making the changing prefix insufficient to conceal that device's identity. Hardware-independent generation reduces this link.

Two behaviours should be distinguished:

- **Stable opaque identifiers:** remain useful locally, often tied to a particular network rather than revealing the MAC across networks.
- **Temporary privacy addresses:** additional addresses that change over time and are commonly selected for outgoing connections.

Consequently, one interface may have an LLA, a stable GUA, and one or more temporary GUAs simultaneously. Rotation intervals and address-selection rules are implementation-dependent.

The Windows example, associated in the lecture with random identifier generation introduced in the Vista era, is:

```text
IPv6 Address:            2001:db8:acad:1:50a5:8a35:a5bb:66e1
Link-local IPv6 Address: fe80::50a5:8a35:a5bb:66e1
Default Gateway:        fe80::1
```

These equal suffixes illustrate reuse of an IID. **Technical clarification:** suffix equality is a clue, not proof of SLAAC, and unequal suffixes do not disprove SLAAC. Stable per-prefix generation, temporary addresses, and manual configuration can all invalidate that shortcut.

Automatic LLA generation uses the same general prefix-plus-IID structure, with the locally known `fe80::/64` prefix. A router advertisement is needed for the illustrated dynamic GUA prefix, not for creating the initial LLA. A statically assigned GUA is another exception to the claim that no GUA can exist before an RA.

## Practice

No native IPv6 quiz questions are assigned. This teaching is retained for study and revision.

Check the [review queue](review.md) before scored practice; flagged questions retain their original keys. The [manifest](manifest.json) separates additional required lessons from optional background.

## Source

- [Lecture: 6. Dynamic addressing and interface identifiers](../../lectures/lecture_03_ipv6.md#6-dynamic-addressing-and-interface-identifiers)

[Topic overview](README.md) · [Glossary](glossary.md) · [References](references.md) · [Previous lesson](09_eui64.md) · [Next lesson](11_router_discovery.md)
