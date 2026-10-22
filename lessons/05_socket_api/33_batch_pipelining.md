---
id: socket-api-33
topic_id: 05_socket_api
order: 33
title: "Batch pipelining and premature termination"
source_classification: lecture_guide
estimated_reading_minutes: 2
prerequisite_ids: ["socket-api-32"]
---

# 33. Batch pipelining and premature termination

## Learning goals

- Calculate the source stop-and-wait echo time.
- Explain how premature exit truncates outstanding replies in batch mode.

**Builds on:** [lesson 32](32_select_client.md).

## Explanation

#### Step 2: The Batch Input Problem and Stop-and-Wait vs. Full-Duplex Pipelining

The original `str_cli` operated in **stop-and-wait mode**: it sent one line, waited $1\text{ RTT}$ for the echoed reply, and then sent the next line.
* **Numerical Example:** Suppose `ping` measures an average $\text{RTT} = 175\text{ ms}$ ($0.175\text{ s}$) for $84\text{-byte}$ IP datagrams. We want to echo the first $2,000$ lines of a $98,349\text{-byte}$ file ($\approx 49\text{ bytes/line}$; adding the $20\text{-byte}$ IP header and $20\text{-byte}$ TCP header yields roughly an $89\text{-byte}$ IP packet, comparable to but not equal to the ping packet).
* In stop-and-wait mode, sending $2,000$ lines requires:

$$T_{\text{total}} \approx 2,000 \times 0.175\text{ s} = 350\text{ seconds}\quad (\text{measured time: } \approx 354\text{ seconds!})$$

Because the network pipe has a propagation delay (say, 4 time units each way, so $1\text{ RTT} = 8$ time units), the illustrative one-unit-send/eight-unit-cycle model spends about seven eighths of its cycle waiting. The exact utilization depends on serialization time and on how RTT is defined.

With our `select()`-based `str_cli` redirected from an input file in **batch mode**, `stdin` is always ready, so the client pipelines requests continuously into the full-duplex pipe (`request 1` at time 0, `request 2` at time 1, ..., `request 8` at time 7 while `reply 1..4` are simultaneously in flight returning from the server).

**However, a critical bug occurs when the input file has 9 lines and reaches EOF at time 8:**
1. At time 8, `Fgets()` reads the 9th line, and on the next iteration returns `NULL` (EOF on `stdin`).
2. The first `select()`-based `str_cli` immediately executes `return;` to `main()`, which calls `exit(0)` and closes the socket—**while requests 6–9 and replies 2–5 are still in flight inside the network pipe.** As a result, the output can be truncated because the client stops reading before all replies arrive.
3. Furthermore, because `Fgets()` and `Readline()` use internal user-space buffers hidden from `select()`, mixing buffered line functions with `select()` is unsafe.

## Practice

No native socket API quiz questions are assigned. This teaching is retained for study and revision.

Check the [review queue](review.md) before scored practice. A lesson link can teach the reasoning that exposes a false premise or key; it does not endorse that key. Optional background is listed separately in the [manifest](manifest.json).

## Source

- [Lecture: Step 2: The Batch Input Problem and Stop-and-Wait vs. Full-Duplex Pipelining](../../lectures/lecture_05_socket-api.md#step-2-the-batch-input-problem-and-stop-and-wait-vs-full-duplex-pipelining)

[Topic overview](README.md) · [Glossary](glossary.md) · [References](references.md) · [Previous lesson](32_select_client.md) · [Next lesson](34_shutdown_half_close.md)
