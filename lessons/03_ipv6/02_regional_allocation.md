---
id: ipv6-02
topic_id: 03_ipv6
order: 2
title: "Regional allocation and depletion"
source_classification: lecture_guide
estimated_reading_minutes: 2
prerequisite_ids: ["ipv6-01"]
---

# 2. Regional allocation and depletion

## Learning goals

- Identify the RIR allocation hierarchy and depletion milestones.
- Interpret consumption models without confusing projections, restrictions, and measurements.

**Builds on:** [Why IPv6 exists](01_motivation.md).

## Explanation

IANA allocates resources to five RIRs, which distribute and register resources for providers and organizations within their regions:

| Registry | Region |
|---|---|
| AFRINIC | Africa |
| APNIC | Asia-Pacific |
| ARIN | United States, Canada, and parts of the Caribbean |
| LACNIC | Latin America and much of the Caribbean |
| RIPE NCC | Europe, the Middle East, and parts of Central Asia |

Chalmers' Swedish setting, through SUNET, belongs to the RIPE NCC region. This hierarchy also helps explain the registry trust anchors used in RPKI. Regional pools differed in size, demand, and allocation policies, so exhaustion occurred in stages rather than on one global date.

The lecture's timeline gives APNIC's last-`/8` stage in **April 2011**, RIPE NCC's in **September 2012**, a LACNIC exhaustion milestone in **June 2014**, AFRINIC's restricted-allocation stage around **March 2017**, and RIPE NCC's final available `/22` allocation in **November 2019**. These milestones should not all be read as the same kind of “zero addresses remaining” event.

**Technical clarification:** the source contains inconsistent dates. It labels IANA exhaustion January 2011, whereas exhaustion of the central free pool occurred **3 February 2011**. It gives ARIN September 2014 in one timeline and July 2015 in another map; ARIN's free pool actually reached zero on **24 September 2015**. One map also places April 2011 under LACNIC and June 2014 under APNIC, reversing the regional milestones stated elsewhere, and includes an old AFRINIC projection for 2020. Those graphical labels should not be memorized as historical facts.

A `/8` contains \(2^{24}=16{,}777{,}216\) IPv4 addresses, whereas a `/22` contains \(2^{10}=1{,}024\). The shrinking allocation sizes make the rationing visible.

The historical **RIR run-down model** tracks remaining pools in `/8` equivalents over a **2013–2022** time axis. It compares AFRINIC, APNIC, ARIN, RIPE NCC, and LACNIC. Their curves decline at different rates: some drop sharply before flattening under restrictive allocation policies, while others decline more gradually. Projected tails must not be mistaken for later observed data. The source supplies no numerical series from which to reproduce exact values or fitted curves reliably.

As free pools diminish, restrictions can flatten allocation curves even while demand remains high. Growth and **policy both affect the shape**. Exhaustion means ordinary free allocation is constrained; it does not mean IPv4 stops forwarding packets or that existing addresses disappear. Reuse and transfers continue.

## Practice

No native IPv6 quiz questions are assigned. This teaching is retained for study and revision.

Check the [review queue](review.md) before scored practice; flagged questions retain their original keys. The [manifest](manifest.json) separates additional required lessons from optional background.

## Source

- [Lecture: 1. Why IPv6 exists](../../lectures/lecture_03_ipv6.md#1-why-ipv6-exists)

[Topic overview](README.md) · [Glossary](glossary.md) · [References](references.md) · [Previous lesson](01_motivation.md) · [Next lesson](03_notation_and_prefixes.md)
