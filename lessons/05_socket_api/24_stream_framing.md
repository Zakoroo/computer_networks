---
id: socket-api-24
topic_id: 05_socket_api
order: 24
title: "Byte streams, framing, and short counts"
source_classification: lecture_guide
estimated_reading_minutes: 3
prerequisite_ids: ["socket-api-11", "socket-api-21"]
---

# 24. Byte streams, framing, and short counts

## Learning goals

- Explain why writes, packets, reads, and messages need not align.
- Compare EOF, delimiter, and length-prefix framing.

**Builds on:** [lesson 11](11_session_overview.md), [lesson 21](21_orderly_teardown.md).

## Explanation

**Editorial clarification:** “Fragments” in Q071/Q072 should mean chunks of stream bytes returned to the application. The source explicitly explains that short reads occur without IP fragmentation and do not preserve TCP segment boundaries.

## 5. Byte-Stream Framing, Short Counts, and Robust I/O Wrappers

### 5.1 Record Boundaries and Short Counts in TCP

A critical principle of TCP socket programming is that **TCP is a byte-stream protocol with no inherent record boundaries (no message markers).**

For example, when the Daytime server writes the 26-byte Daytime response `"Mon May 26 20:58:40 2003\r\n"`, the client's `read()` call is **not** guaranteed to receive all 26 bytes at once:
* Normally, it arrives as 1 TCP segment of 26 bytes.
* However, sender segmentation, buffering, and read timing can produce different read sizes, even without IP fragmentation; a read can return as little as one byte, or across three `read()` calls (e.g., returning `"Hell"`, then `"o w"`, then `"orld\n"` for `"Hello world\n"`).

#### Three Common Techniques for Application-Level Record Framing

If an application wants to delineate the ends of logical records over TCP, it must implement framing itself using one of three standard conventions:
1. **End-of-File (Connection Close):** The sender closes the connection to mark the end of the record, and the receiver loops on `read()` until `read()` returns `0` (used by the Daytime protocol and HTTP/1.0).
2. **In-Band Delimiter Sequence:** Mark the end of each record with a special byte sequence, such as the two-byte ASCII carriage-return/linefeed (`\r\n`) used by **SMTP** (or `\n` in line-oriented protocols).
3. **Explicit Binary Length Prefix:** Prepend a fixed-size binary counter containing the exact byte length of the record in front of each record (used by **Sun RPC** and **DNS over TCP**).

#### Why TCP Sockets Return Short Counts

For both regular files and sockets, **it is not necessarily an error for `read()` or `write()` on a stream socket to return fewer bytes than requested** (a *short count*):
* On `read()`, a short count occurs whenever fewer bytes than requested are currently available in the kernel's socket receive buffer.
* On `write()`, a short count occurs if the kernel's socket send buffer reaches its limit (most commonly seen when the socket is non-blocking).

## Practice

- **Q005** in [quiz 05](../../quizzes/quiz_05_socket_api.json).
- **Q032** in [quiz 05](../../quizzes/quiz_05_socket_api.json).
- **Q071** in [quiz 05](../../quizzes/quiz_05_socket_api.json).
- **Q072** in [quiz 05](../../quizzes/quiz_05_socket_api.json); flags: `wording_issue`.

Check the [review queue](review.md) before scored practice. A lesson link can teach the reasoning that exposes a false premise or key; it does not endorse that key. Optional background is listed separately in the [manifest](manifest.json).

## Source

- [Lecture: 5. Byte-Stream Framing, Short Counts, and Robust I/O Wrappers](../../lectures/lecture_05_socket-api.md#5-byte-stream-framing-short-counts-and-robust-io-wrappers)

[Topic overview](README.md) · [Glossary](glossary.md) · [References](references.md) · [Previous lesson](23_time_wait.md) · [Next lesson](25_readn.md)
