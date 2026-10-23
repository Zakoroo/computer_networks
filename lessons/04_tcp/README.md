# 04. TCP: end-to-end communication and congestion control

Read one lesson, then answer its assigned questions in [quiz 04](../../quizzes/quiz_04_tcp.json). Q001–Q029 refer to that quiz; Routing Q049 stays in quiz 01. Reading estimates exclude practice.

The full [source guide](../../lectures/lecture_04_tcp-ip.md) is retained across these lessons and the [glossary](glossary.md), including material without quiz questions. No extension lessons were added to close quiz gaps. See the [references](references.md) for source resources and separately labelled review-only standards checks.

**† Supplementary material:** Content originating exclusively from hidden or archived PowerPoint slides (or slides marked for replacement). It may not be included in this year's examinable material. Lessons 15, 16, and 25 inherit this designation. The detailed NewReno, Vegas, and Westwood answers depend on lesson 15 even though some variant names are introduced in visible material.

## Lessons

| Lesson | Reading estimate | Native/external practice |
| --- | --- | --- |
| [01. Layering and end-to-end transport](01_layering.md) | ~3 min | None supplied |
| [02. TCP and UDP services](02_tcp_udp_services.md) | ~2 min | Q001 |
| [03. Ports, sockets, and demultiplexing](03_demultiplexing.md) | ~4 min | None supplied |
| [04. Reliable transfer and stop-and-wait utilization](04_stop_and_wait.md) | ~3 min | None supplied |
| [05. Pipelining and sliding windows](05_pipelining.md) | ~2 min | None supplied |
| [06. TCP byte numbers and the sender window](06_byte_stream_window.md) | ~2 min | Q007 |
| [07. RTT estimation and retransmission timeouts](07_rtt_and_timeouts.md) | ~3 min | Q002, Q005, Q008 |
| [08. Flow control and the receive window](08_flow_control.md) | ~2 min | Q006 |
| [09. Congestion, goodput, and fairness](09_congestion_goals.md) | ~2 min | Q011 |
| [10. End-to-end feedback and CWND](10_congestion_feedback.md) | ~1 min | Q012 |
| [11. Why AIMD approaches a fair share](11_aimd_fairness.md) | ~3 min | Q013, Q021 |
| [12. Slow start, congestion avoidance, and Tahoe](12_slow_start_tahoe.md) | ~3 min | Q014 |
| [13. Fast retransmit and duplicate ACKs](13_fast_retransmit.md) | ~2 min | Q009 |
| [14. Reno fast recovery and out-of-order buffering](14_reno_fast_recovery.md) | ~4 min | Q015, Q016, Routing Q049 |
| [15. NewReno, SACK, Vegas, and Westwood †](15_classical_variants.md) | ~3 min | Q017, Q018, Q029 |
| [16. Classical TCP history, 1974–1996 †](16_tcp_history.md) | ~2 min | None supplied |
| [17. Modern transport evolution and CUBIC](17_cubic.md) | ~3 min | None supplied |
| [18. Bufferbloat, CoDel, and FQ-CoDel](18_bufferbloat_aqm.md) | ~3 min | Q024 |
| [19. BBR path models and fairness caveats](19_bbr.md) | ~3 min | Q020 |
| [20. Explicit Congestion Notification](20_ecn.md) | ~2 min | Q019 |
| [21. L4S queues, feedback, and deployment claims](21_l4s.md) | ~3 min | None supplied |
| [22. QUIC and userspace deployment](22_quic.md) | ~2 min | None supplied |
| [23. Wireless loss and other congestion-control limits](23_failure_modes.md) | ~2 min | Q028 |
| [24. Interactive study resources](24_study_resources.md) | ~1 min | None supplied |
| [25. Archived review prompts and throughput example †](25_review_prompts.md) | ~3 min | None supplied |

## Coverage and study dependencies

All 29 native questions were reviewed against their requested reasoning and keyed options. **21** have TCP primary lessons; **seven** lack sufficient explanation in networking guides 01–06, and **one** has partial socket-topic background but remains a gap. Thus **eight** questions keep an empty primary link: Q003/Q004/Q010/Q022/Q023/Q025/Q026/Q027. Six wording flags overlap these groups; a mapping does not endorse an ambiguous key. Three mapped questions (Q017/Q018/Q029) depend on supplementary teaching.

For the supported distinctions asked by these questions, each primary lesson contains enough teaching once the recorded wording qualification is observed. All 21 mapped entries explicitly have no additional required lessons; 20 list optional background. In particular, lesson 14 already contrasts Reno with Tahoe and lesson 19 already contrasts BBR with loss-based CUBIC. Their fuller prerequisite lessons support the study sequence without becoming mandatory extra reading for those individual questions. Gap entries leave dependencies unresolved.

Ten lessons have no native quiz assignment and remain included. Routing Q049 now uses [lesson 14](14_reno_fast_recovery.md), based on the unmarked explanation of buffered out-of-order data; it is referenced externally and counted only in routing. Routing Q047 (wraparound), Routing Q048 (reordered ACK wording and missing mitigation), and IPv6 Q013 (end-to-end versus link ACK scope) remain unresolved. Splitting related teaching into lessons does not fill their missing reasoning.

See the [question-by-question review](review.md), [manifest](manifest.json), and [verification](verification.md). `coverage_gap`, `wording_issue`, `cross_topic`, and `supplementary_source` describe different review needs. Questions, ordered options, keys, explanations, and manual tags are preserved. The future application's persisted add/remove tag requirement remains unchanged.

## Provenance and limits

Source title: **End-to-End Communication and Congestion Control (EDA387/DIT660)**. Source generated: **2026-10-20**. Baseline: `436acd7` (full commit in the manifest). Preparation status: **user-approved on 22 October 2026**.

Original lecture files are unchanged. Source diagrams appear directly as the lesson figures in their original form, including the horizontal byte-window diagram and Reno state diagram. All teaching is retained. Mermaid was not rendered in this environment. Long labels in inherited figures still need a visual preview before publication.

Dated BBR/L4S deployment, standardization, historical, and empirical claims remain source-reported assertions with their original dates and caveats; they were not freshly authenticated. The ASPA comparison in particular is not a new adoption measurement. Supplementary slide visibility and exam scope have not been independently checked. Coverage searches stop at lecture 06; algorithms were excluded. No application, commit, or push is part of this conversion.

## Answer explanations

On 22 October 2026, all **21 linked questions** in [the canonical quiz](../../quizzes/quiz_04_tcp.json) received authored explanations grounded in their actual primary/supporting lessons. The **3 linked questions with wording flags** have specific review notes; the keys were preserved rather than silently corrected or falsely justified. The **8 unlinked questions** remain outside the pass and retain empty explanations.

Explanations are Markdown stored in the existing quiz field, with source links relative to that quiz file. They explain the mechanism and useful misconceptions, not just the keyed option. Cross-topic questions stay in their original quiz. Additional explicit required lessons are cited; legacy related-reading classification is still unresolved where previously absent. Supplementary-source dependencies retain a visible † notice.

The explanations have been checked against the teaching and are **reviewed, awaiting user approval** (`explanation_status: reviewed`). The existing `preparation_status: approved` records the unchanged lesson-conversion approval; it does not approve this new answer text. See [verification](verification.md#answer-explanation-pass-22-october-2026).
