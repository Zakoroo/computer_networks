---
id: tcp-25
topic_id: 04_tcp
order: 25
title: "Archived review prompts and throughput example †"
source_classification: supplementary_archived_slides
estimated_reading_minutes: 3
prerequisite_ids: ["tcp-06", "tcp-08", "tcp-14"]
---

# 25. Archived review prompts and throughput example †

## Learning goals

- Use the archived prompts as self-tests without mistaking questions for explanations.
- Calculate receive-window-limited throughput and its dependence on RTT.

**Builds on:** [lesson 06](06_byte_stream_window.md), [lesson 08](08_flow_control.md), [lesson 14](14_reno_fast_recovery.md).

## Explanation

**† Supplementary:** This material inherits the guide's archived/hidden-slide designation and may fall outside this year's examinable material.

**Supplementary scope and coverage:** These archived self-test prompts are retained in full. Most are questions, not worked answers. The sequence-wraparound and fixed-ISN prompts do not teach their mechanisms, and the unnecessary-retransmission prompt is not a substitute for delayed-ACK teaching. Only the receive-window throughput calculation below supplies an explicit worked solution.

### 5.2 Review Questions †

*The following review questions appear on archived slides at the end of the presentation and serve as self-test problems for deeper understanding:*

1. **Finite Sequence Number Space:** TCP uses a finite (32-bit) header field to contain byte-stream sequence numbers. How does the protocol specification allow an arbitrary-length byte stream to pass from one machine to another without ambiguity when sequence numbers wrap around?
2. **Unnecessary Retransmissions:** Under what conditions of delay, bandwidth, load, and packet loss will TCP retransmit significant volumes of data unnecessarily?
3. **Lost Acknowledgments:** A lost TCP acknowledgment does not necessarily force a packet retransmission. Explain why (hint: consider cumulative acknowledgments in a pipelined window).
4. **Discarding Out-of-Order Segments:** Imagine an implementation of TCP that discards segments that arrive out of order, even if they fall within the current receive window (i.e., it only accepts segments that immediately extend the contiguous byte stream already received). Does it still work (provide reliable delivery)? How does its performance compare to a standard TCP implementation that buffers out-of-order segments?
5. **Fixed Initial Sequence Number Hazard:** Suppose an implementation of TCP always uses initial sequence number `1` (`ISN = 1`) whenever it creates a new connection. Explain how a system crash and quick restart can confuse a remote system into believing that the old connection remained open (or accept stale duplicate segments from the previous incarnation).
6. **Window-Limited Throughput Calculation:** Assume TCP is sending segments using a maximum receive window size of $64\text{ KBytes}$ on a channel that has unbounded (infinite) bandwidth and an average round-trip time of $\text{RTT} = 20\text{ ms}$ (assume `CWND` is very large and imposes no limit):
   - What is the maximum achievable throughput?
     $$\text{Throughput}_{20\text{ ms}} = \frac{64\text{ KB}}{0.020\text{ s}} = 3.2\text{ MB/s}\text{ (or } 3200\text{ KBytes/s} \approx 25.6\text{ Mbps)}$$
   - How does the maximum throughput change if the round-trip time doubles to $\text{RTT} = 40\text{ ms}$ while bandwidth remains infinite?
     $$\text{Throughput}_{40\text{ ms}} = \frac{64\text{ KB}}{0.040\text{ s}} = 1.6\text{ MB/s}\text{ (halved to } 1600\text{ KBytes/s} \approx 12.8\text{ Mbps)}$$

## Practice

No native TCP quiz questions are assigned. This teaching is retained for study and revision.

The [review queue](review.md) separates coverage from wording and supplementary scope. Mapped questions here need no additional required lessons; the [manifest](manifest.json) lists optional background. Original keys and manual tags are preserved.

## Source

- [Lecture: 5.2 Review Questions †](../../lectures/lecture_04_tcp-ip.md#52-review-questions-)

[Topic overview](README.md) · [Glossary](glossary.md) · [References](references.md) · [Previous lesson](24_study_resources.md)
