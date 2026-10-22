---
id: ipv6-01
topic_id: 03_ipv6
order: 1
title: "Why IPv6 exists"
source_classification: lecture_guide
estimated_reading_minutes: 3
prerequisite_ids: []
---

# 1. Why IPv6 exists

## Learning goals

- Explain IPv4 scarcity and why CIDR/NAT delayed migration.
- Distinguish address sharing from a larger hierarchical address space.

## Explanation

IPv4 has **32-bit addresses**, giving \(2^{32}=4{,}294{,}967{,}296\) possible bit patterns before reservations and allocation constraints. Internet growth, mobile access, and the Internet of Things made a much larger address space necessary. IPv6 uses **128 bits** and also revises packet processing and configuration.

The aim is not to attach \(2^{128}\) usable hosts to the Internet. The space supports hierarchical allocation with room to spare. A conventional `/64` subnet divides the address into a 64-bit prefix and a 64-bit interface identifier. Mathematically the whole 128-bit space contains \(2^{64}\) distinct `/64` prefixes, but reserved ranges and allocation policy mean that this is not a count of available public subnets.

### Address exhaustion and temporary relief

IPv4 exhaustion was foreseeable well before the free pools ran out. The historical consumption model measures **consumed `/8` equivalents increasing** toward the total of 256, not a remaining pool decreasing. The time axis spans January 1995 to January 2021, and the displayed consumption scale runs from 128 to 256 `/8` equivalents. The fitted series are a five-year polynomial, five-year exponential, ten-year exponential, and ten-year linear model. The models differ in timing but all imply exhaustion under continued growth.

The historical projection is attributed to Tony Hain's “A Pragmatic Report on IPv4 Address Space Consumption.” The supplied citation labels it 2007 and misspells the surname “Main.” Its projected exhaustion dates depend on the model and fitting window; they are not measurements of today's address availability.

The main milestones establish why IPv6 was designed long before widespread adoption:

- **September 1981:** RFC 791 specifies IPv4.
- **1989:** The World appears in the lecture's timeline as an early commercial ISP, marking growing commercial access.
- **November 1991:** the IETF ROAD effort addresses routing and addressing growth.
- **June 1992:** RFC 1338 describes problems and remedies related to routing and address-space exhaustion.
- **September 1993:** CIDR, associated with RFC 1519, improves address allocation and route aggregation.
- **May 1994:** RFC 1631 describes NAT. IPv6 design work develops during the mid-1990s.
- **December 1995:** RFC 1883 publishes the early IPv6 specification.
- **December 1998:** RFC 2460 revises IPv6. After a lull, activity increases around 2003–2006.
- **2017:** RFC 8200 replaces RFC 2460 as the IPv6 base specification.

**Technical clarification:** the source timeline dates RFC 1883 to December 1996; the RFC itself is dated **December 1995**. The protocol did not first appear in 1998. Version number 5 had already been used by the experimental **Internet Stream Protocol**, aimed at streaming rather than replacing general-purpose IPv4.

CIDR and NAT bought time. More efficient allocation and sharing addresses among many hosts reduced immediate pressure to deploy IPv6. That success also reduced the urgency of replacing IPv4, helping explain the long coexistence period.


## Reasoning through the concepts

**Editorial clarification from the source glossary:** NAT rewrites addresses, often also transport identifiers, between address realms. Combine this definition with [routing lesson 01](../01_routing/01_internet_architecture.md) when reasoning about the end-to-end principle; this lesson alone does not teach that principle.

## Practice

Assigned IPv6 questions: Q014, Q024.

External routing practice: Routing Q014.

Q024 additionally requires [lesson 19](19_tunnelling.md). Routing Q014 additionally requires [routing lesson 01](../01_routing/01_internet_architecture.md).

Check the [review queue](review.md) before scored practice; flagged questions retain their original keys. The [manifest](manifest.json) separates additional required lessons from optional background.

## Source

- [Lecture: 1. Why IPv6 exists](../../lectures/lecture_03_ipv6.md#1-why-ipv6-exists)

[Topic overview](README.md) · [Glossary](glossary.md) · [References](references.md) · [Next lesson](02_regional_allocation.md)
