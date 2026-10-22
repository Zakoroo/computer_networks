---
id: socket-api-39
topic_id: 05_socket_api
order: 39
title: "C10M, io_uring, and kernel-bypass tradeoffs"
source_classification: lecture_guide
estimated_reading_minutes: 3
prerequisite_ids: ["socket-api-01", "socket-api-30", "socket-api-38"]
---

# 39. C10M, io_uring, and kernel-bypass tradeoffs

## Learning goals

- Compare kernel sockets, completion rings, early packet processing, and bypass.
- Retain mode, driver, tuning, power, isolation, and empirical-comparison qualifications.

**Builds on:** [lesson 01](01_socket_boundary.md), [lesson 30](30_io_models.md), [lesson 38](38_c10k.md).

## Explanation

**Source context:** Historical C10K/C10M milestones and the ATC 2025 comparison remain source-reported claims. The guide's workload, driver/mode, power, and isolation qualifications are retained; no current benchmark or deployment measurement was reconstructed.

#### 2. The C10M Problem: When the OS Kernel Becomes the Bottleneck

In 2013, Robert Graham posed the **C10M problem**: at **10 million concurrent connections**, kernel packet processing can become a bottleneck because of per-packet system calls, hardware interrupts, memory copies between kernel and user space, and lost CPU cache locality. Three modern tiers of solutions address this:

| Approach | Main change | What remains to handle |
| --- | --- | --- |
| Traditional sockets | Kernel TCP/IP with application syscalls | Framing, buffering, errors, and scheduling |
| `io_uring` | Shared submission/completion rings and batching | Completion handling and buffer lifetime |
| XDP / AF_XDP | Early packet processing or packet buffers exposed to user space | Mode/driver capabilities and any protocol logic bypassed |
| DPDK with a user-space transport | Bypass normal kernel packet processing | Transport stack, resource isolation, polling, and tuning |

* **`io_uring`:** Modern Linux asynchronous I/O using shared memory ring buffers between user space and kernel space, batching operations with fewer syscalls and supporting zero-copy sends.
* **XDP / `AF_XDP`:** XDP can run verified eBPF in the driver before normal stack processing. AF_XDP exposes packet buffers to user space; zero-copy is conditional on driver support and mode. Generic and offloaded XDP modes have different execution points.
* **DPDK and User-Space TCP Stacks (`mTCP`, `F-Stack`, `TAS`, `Junction`):** Bypass the normal kernel packet-processing path, mapping the NIC directly into user space.
* **What Kernel Bypass Costs (Awamoto & Honda, USENIX ATC 2025):**
  * A continuously busy-polling DPDK worker can consume a core even while idle; power-aware modes and design choices change that cost.
  * Often needs careful memory allocation, CPU affinity, driver support, and operational tuning; exact requirements depend on the chosen stack.
  * Gives user space direct hardware access (IOMMU and VFIO mitigate, but do not eliminate, the security risk).
  * *Takeaway:* Measure the workload before choosing bypass. The cited study compares stacks and does not establish a universal winner for every connection count or traffic pattern.

## Practice

No native socket API quiz questions are assigned. This teaching is retained for study and revision.

Check the [review queue](review.md) before scored practice. A lesson link can teach the reasoning that exposes a false premise or key; it does not endorse that key. Optional background is listed separately in the [manifest](manifest.json).

## Source

- [Lecture: 2. The C10M Problem: When the OS Kernel Becomes the Bottleneck](../../lectures/lecture_05_socket-api.md#2-the-c10m-problem-when-the-os-kernel-becomes-the-bottleneck)

[Topic overview](README.md) · [Glossary](glossary.md) · [References](references.md) · [Previous lesson](38_c10k.md) · [Next lesson](40_messaging_middleware.md)
