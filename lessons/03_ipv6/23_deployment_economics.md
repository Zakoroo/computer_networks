---
id: ipv6-23
topic_id: 03_ipv6
order: 23
title: "Testing economic explanations for deployment"
source_classification: lecture_guide
estimated_reading_minutes: 2
prerequisite_ids: ["ipv6-01", "ipv6-22"]
---

# 23. Testing economic explanations for deployment

## Learning goals

- Compare address prices and device costs without conflating denominators.
- Assess proposed adoption drivers without inferring causality from correlation.

**Builds on:** [Why IPv6 exists](01_motivation.md), [Interpreting IPv6 adoption measurements](22_adoption_measurements.md).

## Explanation

The source revisits a 2024 argument: IPv6 should become attractive when obtaining IPv4 addresses costs more than deploying IPv6. It cites roughly **US$60 per IPv4 address in 2022**, against **US$50–200 per device** plus wider migration costs for IPv6 deployment.

It then reports IPv4 transfer prices falling by roughly a third from a peak around 2021 while transfer volumes reached record levels, even as IPv6 adoption grew. These are **source-reported estimates with unspecified market coverage**, not verified current prices or universally comparable costs. Address prices and per-device deployment estimates do not even share the same denominator: NAT can let many devices share one address.

The lecture proposes broader operational drivers: the cost of carrier-grade NAT state, logging and lawful-intercept obligations, carriers' IPv6-only architectures, and changes in cloud defaults. Broker and marketplace figures vary by block size, timing, and transaction type, and suppliers have commercial interests.

**Interpretive clarification:** adoption rising while prices fall challenges a simple contemporaneous price-threshold story, but does not by itself prove that prices never mattered. Deployment has delays, anticipated costs matter, and adoption can itself affect demand for IPv4. The lesson is to test a proposed causal mechanism rather than treating a correctly predicted outcome as proof of the explanation.

## Practice

No native IPv6 quiz questions are assigned. This teaching is retained for study and revision.

Check the [review queue](review.md) before scored practice; flagged questions retain their original keys. The [manifest](manifest.json) separates additional required lessons from optional background.

## Source

- [Lecture: 12. Deployment evidence and failure modes](../../lectures/lecture_03_ipv6.md#12-deployment-evidence-and-failure-modes)

[Topic overview](README.md) · [Glossary](glossary.md) · [References](references.md) · [Previous lesson](22_adoption_measurements.md) · [Next lesson](24_fallback_and_failures.md)
