---
id: sdn-11
topic_id: 06_sdn
order: 11
title: "Moving complexity into reusable platform software"
source_classification: lecture_guide
estimated_reading_minutes: 1
prerequisite_ids: ["sdn-08", "sdn-10"]
---

# 11. Moving complexity into reusable platform software

## Learning goals

- Explain how the NOS and hypervisor modularize rather than eliminate complexity.

## Explanation

#### Where the Complexity Goes
**Abstraction relocates and modularizes complexity.** Writing a distributed Network OS and a Network Hypervisor remains a complex systems-engineering challenge. However, SDN's main achievement—**just like a compiler**—is that it:
1. **Simplifies the interface** for user-specific control programs.
2. **Pushes the distributed systems complexity into reusable platform code** (the NOS and hypervisor) written once and shared by all applications.

---

## Practice

Use [quiz 06](../../quizzes/quiz_06_sdn.json); Q-numbers retain the original question order.

- **Q020** (`sdn-q020`). No additional required lesson.

## Source

- [Lecture: Where the Complexity Goes](../../lectures/lecture_06_sdn.md#where-the-complexity-goes)

[Topic overview](README.md) · [Glossary](glossary.md) · [References](references.md) · [Previous lesson](10_virtual_topologies.md) · [Next lesson](12_match_action_tables.md)
