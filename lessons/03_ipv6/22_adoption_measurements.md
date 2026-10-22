---
id: ipv6-22
topic_id: 03_ipv6
order: 22
title: "Interpreting IPv6 adoption measurements"
source_classification: lecture_guide
estimated_reading_minutes: 2
prerequisite_ids: ["ipv6-01"]
---

# 22. Interpreting IPv6 adoption measurements

## Learning goals

- Identify measurement population, method, and observation period.
- Separate dated proportions from current traffic volumes and formal uncertainty.

**Builds on:** [Why IPv6 exists](01_motivation.md).

## Explanation

### What an adoption percentage measures

The lecture records **50.10% of Google users accessing its services over native IPv6 on 28 March 2026**, 18 years after the measurement series began. The historical pattern was relatively flat until around 2011, followed by sustained growth. Google's [measurement page](https://www.google.com/intl/en/ipv6/statistics.html) defines its population as users accessing Google; [APNIC's April 2026 discussion](https://blog.apnic.net/2026/04/28/google-hits-50-ipv6/) confirms the approximately-half milestone.

**Scope clarification:** the exact dated 50.10% value is retained from the lecture. It is not a fresh reading for 2026-10-20 and does not establish that most Internet traffic bytes use IPv6. A first daily crossing also differs from a sustained global majority.

APNIC uses measurements distributed through advertising networks. The lecture places its contemporary estimate nearer **40%**, roughly ten percentage points lower. Treat this as a dated approximate comparison, not a newly retrieved measurement.

Different methods observe different populations:

- Google's sample depends on reaching Google services.
- Advertising-based measurement depends on receiving and executing the measurement task; advertisement blocking can affect coverage.
- Users, connections, successful tests, and byte volumes are different denominators.

A percentage needs a **population, method, and observation period**. Differences do not automatically establish that one measurement is wrong. They also should not be combined into a formal confidence interval: the lecture's “40–50% bracket” describes different observations, not a single estimator's uncertainty bounds.

## Practice

No native IPv6 quiz questions are assigned. This teaching is retained for study and revision.

Check the [review queue](review.md) before scored practice; flagged questions retain their original keys. The [manifest](manifest.json) separates additional required lessons from optional background.

## Source

- [Lecture: 12. Deployment evidence and failure modes](../../lectures/lecture_03_ipv6.md#12-deployment-evidence-and-failure-modes)

[Topic overview](README.md) · [Glossary](glossary.md) · [References](references.md) · [Previous lesson](21_operating_models.md) · [Next lesson](23_deployment_economics.md)
