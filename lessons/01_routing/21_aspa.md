---
id: routing-21
topic_id: 01_routing
order: 21
title: "ASPA and partial deployment"
source_classification: lecture_guide
estimated_reading_minutes: 2
prerequisite_ids: ["routing-18", "routing-20"]
---

# 21. ASPA and partial deployment

## Learning goals

- Contrast provider authorization with origin authorization.
- Distinguish specification, availability, and deployment.

**Builds on:** [Business relationships and export policy](18_bgp_export_policy.md), [RPKI and route origin validation](20_rpki.md).

## Explanation

**Autonomous System Provider Authorization (ASPA)** addresses a different weakness: an AS publishes a signed list of the networks that are its legitimate **providers**. Other networks can use these declarations to detect AS paths inconsistent with customer–provider hierarchy and thus identify certain **route leaks or impossible-looking paths**. Rather than signing an entire BGP path, ASPA checks whether the claimed path is compatible with known provider relationships. Compare this with **BGPsec**, which seeks path cryptographic protection but presents difficult deployment and computational requirements.

It is important to distinguish three adoption stages:

1. **Specified:** the mechanism is defined in a specification and can be implemented.
2. **Available:** registries and software infrastructure support it.
3. **Adopted:** operators actually publish/use it in deployed routing policy.

The supplied guide reports that registry support had arrived in **RIPE NCC and APNIC since November 2025**, and **ARIN since January 2026**, with **well under 1% of ASNs publishing ASPA objects as of February 2026**. These deployment dates and percentages have been retained as source-reported historical claims, not independently verified current statistics. The mechanism's specification status must be distinguished from registry tooling and operator adoption.

**Partial deployment matters on its own.** A hijacked route can be rejected by validating ASes while continuing to spread through nonvalidating ASes. The result is neither a fully secure nor a fully insecure Internet; reachability and policy can diverge between regions of the network. Security mechanisms therefore have **deployment and convergence properties**, not merely theoretical correctness under universal adoption.

## Practice

No supplied routing question is assigned here. The lesson is retained because it is part of the lecture guide.

## Source

- [Lecture 01: ASPA and partial deployment](../../lectures/lecture_01_internet_routing.md#aspa-and-partial-deployment)

[Topic overview](README.md) · [Glossary](glossary.md) · [Previous lesson](20_rpki.md) · [Next lesson](22_convergence.md)
