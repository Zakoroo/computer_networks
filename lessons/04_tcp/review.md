# TCP coverage and question review

Reviewed against the available networking guides 01–06 on 22 October 2026. The source quiz is preserved: no question, option order, key, explanation, or manual tag was corrected. Stable IDs and exact evidence headings are in the [manifest](manifest.json); classifications describe available teaching, not exam scope.

## Missing and partial coverage

The eight entries below keep empty primary links and unresolved dependencies. Seven have insufficient explanatory support; Q027 has partial support in the socket guide. A named algorithm, an unanswered review prompt, or similar queueing vocabulary is not an explanation of the keyed mechanism.

| Question | Missing reasoning and cross-topic check |
| --- | --- |
| Q003 | The finite 32-bit space appears only in an unanswered archived review prompt; byte-window teaching does not explain modulo comparisons or safe wraparound. Socket TIME_WAIT concerns old connection incarnations, not this missing explanation. |
| Q004 | RTT/RTO teaching explains unnecessary retransmissions in general, but not the delayed-ACK mechanism or its tradeoff. The archived 1990 timeline only names delayed ACKs. |
| Q010 | Fast retransmit and immediate duplicate ACKs are explained, but there is no delayed-ACK policy or explanation supporting the keyed delay of duplicate ACKs. |
| Q022 | General AIMD fairness does not define TCP-friendliness as comparable throughput against a reference TCP flow. That term and comparison are not explained in the networking guides. |
| Q023 | The guide teaches deep queues and CoDel/FQ-CoDel, but does not explain DropTail or synchronized congestion losses among flows. Bufferbloat alone does not supply that reasoning. |
| Q025 | CoDel and FQ-CoDel demonstrate early congestion signaling, but the keyed answer is RED. Its name, queue averaging, and probabilistic early signal are not taught in guides 01–06. |
| Q026 | The socket guide explains the handshake and incomplete/completed listen queues, but not SYN flooding or stateless SYN cookies encoding state in an ISN. Its partial-line denial-of-service example is a different attack. |
| Q027 | The socket guide defines RST connection aborts and four-tuples, but not forged resets, sequence acceptability, prediction, or challenge-ACK defenses. This supplies partial background only, with no suitable primary lesson. |

The gap search included sequence/wraparound and old duplicates, delayed ACKs, fairness/TCP-friendliness, tail dropping/synchronization, RED/AQM, SYN flooding/cookies, and resets/sequence prediction across all six networking guides. Socket handshake/listen-queue teaching is retained in its source; its partial-line denial-of-service scenario is not SYN-cookie coverage. Generic FIFO queues and general fair sharing do not establish the more specific answers above. No algorithms lecture was used to fill a networking gap.

## Wording and key review

These findings are separate from coverage. Q007/Q015/Q028 have primary lessons despite their wording flags. Q003/Q010/Q027 have both wording and coverage flags. The original keys stay intact pending a requested correction.

| Question | Finding | Review evidence |
| --- | --- | --- |
| Q003 | A 32-bit field is finite and still wraps. Its width alone does not prevent ambiguity; sequence arithmetic and old-duplicate constraints are missing from the teaching and from the keyed explanation. | [Supplementary RFC check](https://www.rfc-editor.org/rfc/rfc9293.html#section-3.4) |
| Q007 | Qualify the stem as the sender receiving a new cumulative ACK. Duplicate ACKs repeat the acknowledgment edge rather than sliding it forward. | [Source teaching](../../lectures/lecture_04_tcp-ip.md#34-fast-retransmit-and-fast-recovery-tcp-reno) |
| Q010 | The key assumes delayed generation of duplicate ACKs. Standard guidance calls for immediate ACKs for out-of-order data, so a nonstandard ACK policy or other explicit context is needed. | [Supplementary RFC check](https://www.rfc-editor.org/rfc/rfc5681.html#section-4.2) |
| Q015 | Specify loss inferred from three duplicate ACKs. Reno also enters slow start after a retransmission timeout; the contrast with Tahoe is not true for every loss event. | [Supplementary RFC check](https://www.rfc-editor.org/rfc/rfc5681.html#section-3.1) |
| Q027 | Predictability is a facilitating weakness, not a complete attack model. A forged reset must target the connection tuple and satisfy sequence validation; acceptance also depends on reset defenses. | [Supplementary RFC check](https://www.rfc-editor.org/rfc/rfc5961.html#section-3) |
| Q028 | Qualify standard TCP as the classical loss-based sender discussed by the source; the statement is too broad for every modern TCP controller or wireless path. | [Source teaching](../../lectures/lecture_04_tcp-ip.md#45-fundamental-failure-modes-of-tcp-congestion-control) |

The RFC checks are supplementary editorial review evidence, not newly added examinable lessons and not a reason to mark a lecture gap covered. RFC 5681 distinguishes delayed ACK policy from immediate feedback for out-of-order data; RFC 9293 explains finite sequence arithmetic; RFC 5961 provides the missing attack context. See [references](references.md).

## Supplementary scope and multiple lessons

Q017 (NewReno), Q018 (Vegas RTT signal), and Q029 (Westwood ACK-rate estimate) require the detailed comparison in supplementary [lesson 15](15_classical_variants.md). They retain `supplementary_source`. Their primary lesson teaches the requested distinction, so optional Reno, RTT, or wireless context is not labelled an additional requirement. Lessons 16 and 25 are also archived supplementary material even though they have no native quiz assignments.

Every mapped native question has explicit additional required/optional fields. None needs more than its primary lesson for the actual keyed distinction after the stated wording qualifications; optional lessons and lesson-level prerequisites are not interchangeable. Gap dependencies stay unresolved rather than receiving empty required lists. No multi-lesson requirement was invented merely because an answer mentions two algorithms.

## Question-by-question audit

Each row addresses the requested reasoning and the keyed choice, rather than a keyword match. All mapped questions use the TCP topic; gaps have no primary lesson. Optional context appears in the manifest.

| Question | Primary lesson or coverage | Review rationale |
| --- | --- | --- |
| Q001 | [lesson 02](02_tcp_udp_services.md) | The TCP/UDP comparison explicitly distinguishes handshaking and reliable byte-stream service; ports and error checking are not unique to TCP. |
| Q002 | [lesson 07](07_rtt_and_timeouts.md) | The packet trace starts a segment at byte 1, carries 1448 bytes, and receives ACK 1449. Its labelled explanation makes the first-data-byte meaning explicit, rather than identifying a message or counting packets. |
| Q003 | Coverage gap | The finite 32-bit space appears only in an unanswered archived review prompt; byte-window teaching does not explain modulo comparisons or safe wraparound. Socket TIME_WAIT concerns old connection incarnations, not this missing explanation. |
| Q004 | Coverage gap | RTT/RTO teaching explains unnecessary retransmissions in general, but not the delayed-ACK mechanism or its tradeoff. The archived 1990 timeline only names delayed ACKs. |
| Q005 | [lesson 07](07_rtt_and_timeouts.md) | The RTT EWMA assigns exponentially decaying influence to earlier samples, preserving recent observations for the timeout calculation. |
| Q006 | [lesson 08](08_flow_control.md) | The free receive-buffer space is advertised as RcvWindow and constrains unacknowledged data; this is receiver protection rather than network congestion feedback. |
| Q007 | [lesson 06](06_byte_stream_window.md) | The four byte regions explain advancing the left edge on new cumulative acknowledgments. The question needs qualification because duplicate ACKs do not advance it. |
| Q008 | [lesson 07](07_rtt_and_timeouts.md) | The source explicitly contrasts too-short timeouts causing unnecessary retransmissions with too-long timeouts delaying loss recovery. |
| Q009 | [lesson 13](13_fast_retransmit.md) | The sequence trace and rule specify three duplicate ACKs and immediate retransmission before RTO expiry. |
| Q010 | Coverage gap | Fast retransmit and immediate duplicate ACKs are explained, but there is no delayed-ACK policy or explanation supporting the keyed delay of duplicate ACKs. |
| Q011 | [lesson 09](09_congestion_goals.md) | The congestion goals include fair bottleneck sharing and preventing collapse while retaining useful throughput. |
| Q012 | [lesson 10](10_congestion_feedback.md) | CWND is defined as the sender limit on unacknowledged traffic adjusted using inferred network feedback; the receive window is a distinct receiver constraint. |
| Q013 | [lesson 11](11_aimd_fairness.md) | The AIMD update rule increases one MSS per RTT and halves the window on a congestion indication in the classical model. |
| Q014 | [lesson 12](12_slow_start_tahoe.md) | Slow start doubles the congestion window each RTT until the threshold or a loss event, unlike linear congestion avoidance. |
| Q015 | [lesson 14](14_reno_fast_recovery.md) | The Reno explanation itself contrasts fast recovery with Tahoe resetting CWND to one. The timeout path still enters slow start, so the unqualified comparison needs wording review. |
| Q016 | [lesson 14](14_reno_fast_recovery.md) | The four fast-recovery steps halve the threshold, inflate CWND for duplicate ACKs, then deflate on a new ACK without traversing slow start. |
| Q017 | [lesson 15](15_classical_variants.md) | The archived comparison explains NewReno recovering multiple lost segments from a window before exiting fast recovery, unlike Reno leaving on the first new ACK. |
| Q018 | [lesson 15](15_classical_variants.md) | The archived Vegas explanation monitors RTT relative to its minimum baseline to infer a growing queue before loss; a mere visible-slide name mention would not establish this coverage. |
| Q019 | [lesson 20](20_ecn.md) | The ECN exchange shows router CE marking and TCP feedback before packet loss, without claiming per-flow bandwidth guarantees. |
| Q020 | [lesson 19](19_bbr.md) | The BBR lesson explicitly contrasts loss-based CUBIC with bottleneck delivery-rate and minimum-RTT modeling, BDP, and pacing. CUBIC curve details are optional for this keyed distinction. |
| Q021 | [lesson 11](11_aimd_fairness.md) | The equal-share trajectory requires competing flows to respond to overload. A flow that keeps growing while another halves its rate defeats that fairness mechanism. |
| Q022 | Coverage gap | General AIMD fairness does not define TCP-friendliness as comparable throughput against a reference TCP flow. That term and comparison are not explained in the networking guides. |
| Q023 | Coverage gap | The guide teaches deep queues and CoDel/FQ-CoDel, but does not explain DropTail or synchronized congestion losses among flows. Bufferbloat alone does not supply that reasoning. |
| Q024 | [lesson 18](18_bufferbloat_aqm.md) | The bufferbloat explanation preserves high utilization while packets wait persistently in oversized queues, harming latency. |
| Q025 | Coverage gap | CoDel and FQ-CoDel demonstrate early congestion signaling, but the keyed answer is RED. Its name, queue averaging, and probabilistic early signal are not taught in guides 01–06. |
| Q026 | Coverage gap | The socket guide explains the handshake and incomplete/completed listen queues, but not SYN flooding or stateless SYN cookies encoding state in an ISN. Its partial-line denial-of-service example is a different attack. |
| Q027 | Partial socket support; gap | The socket guide defines RST connection aborts and four-tuples, but not forged resets, sequence acceptability, prediction, or challenge-ACK defenses. This supplies partial background only, with no suitable primary lesson. |
| Q028 | [lesson 23](23_failure_modes.md) | The failure-mode explanation directly contrasts wireless corruption with congestion loss and describes unnecessary loss-based backoff. The stem should specify classical loss-based TCP. |
| Q029 | [lesson 15](15_classical_variants.md) | The archived Westwood comparison explicitly estimates bandwidth from the arrival rate of returning ACKs and uses it to set CWND and ssthresh after loss. |

## Existing questions from other topics

- **Routing Q049:** now linked to `tcp-14`. The unmarked Reno steps explicitly explain buffering out-of-order segments, and the labelled derived comparison explains the performance cost of discarding them. The archived review prompt is retained but is not the answer evidence. The original routing record remains canonical; no supplementary flag is added.
- **Routing Q047:** remains a gap. The archived wraparound prompt supplies no answer, and socket TIME_WAIT does not explain modulo sequence comparisons for a long-lived connection.
- **Routing Q048:** remains a gap with its wording flag. Data reordering can cause duplicate ACKs; the quiz says reordered ACKs and requests a mitigation absent from its options. The three-duplicate-ACK threshold is only partial support.
- **IPv6 Q013:** remains a gap. The layering lesson describes logical transport and physical forwarding, but does not explicitly compare hop-level acknowledgment scope with end-to-end delivery. No new teaching was silently added for it.

[Topic overview](README.md) · [Verification](verification.md)
