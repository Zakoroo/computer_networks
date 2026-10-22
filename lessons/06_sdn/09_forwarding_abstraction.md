---
id: sdn-09
topic_id: 06_sdn
order: 9
title: "A flexible, minimal, vendor-neutral forwarding abstraction"
source_classification: lecture_guide
estimated_reading_minutes: 1
prerequisite_ids: ["sdn-07"]
---

# 9. A flexible, minimal, vendor-neutral forwarding abstraction

## Learning goals

- Explain the ISA analogy and the abstraction's flexibility, minimality, and vendor neutrality.

## Explanation

### 3.3 Forwarding Abstraction and Network Virtualization

#### Purpose of the Forwarding Abstraction
Just as an instruction set architecture (ISA) like x86 or ARM abstracts CPU hardware for compilers, SDN's **forwarding abstraction** (exemplified by OpenFlow) provides a standard way of defining forwarding state:

* **Flexible:** Forwarding behavior is specified dynamically by the control plane and built from a basic set of general forwarding primitives rather than hardwired to IPv4 or Ethernet.
* **Minimal:** Streamlined for high speed and low power consumption in switch silicon.
* **Vendor-neutral:** Control programs are not tied to any specific switch vendor.

## Practice

Use [quiz 06](../../quizzes/quiz_06_sdn.json); Q-numbers retain the original question order.

- **Q023** (`sdn-q023`). No additional required lesson.

## Source

- [Lecture: 3.3 Forwarding Abstraction and Network Virtualization](../../lectures/lecture_06_sdn.md#33-forwarding-abstraction-and-network-virtualization)
- [Lecture: Purpose of the Forwarding Abstraction](../../lectures/lecture_06_sdn.md#purpose-of-the-forwarding-abstraction)

[Topic overview](README.md) · [Glossary](glossary.md) · [References](references.md) · [Previous lesson](08_network_os.md) · [Next lesson](10_virtual_topologies.md)
