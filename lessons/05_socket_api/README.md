# 05. Socket API, network programming, and high-performance I/O

Read a short lesson, then answer its related questions in [quiz 05](../../quizzes/quiz_05_socket_api.json). Q001–Q080 identify the preserved source positions. Reading estimates exclude practice; code examples may take longer to trace carefully.

The complete [source guide](../../lectures/lecture_05_socket-api.md) is retained across 42 lessons, the [glossary](glossary.md), and [references](references.md), including every example and material without questions. The original lecture is unchanged. All 11 source Mermaid diagrams are reused. Lessons 02/04/05/07/08/20 repair long or clipped labels with line breaks, short labels, and full-detail tables. Lessons 08 and 20 use vertical layouts to fit the preview. Hosts, connections, release branches/dates/features, structure fields/sizes, conversion APIs, and queue transitions are preserved. The other five diagrams remain exact. No additional figures or image dependencies were added.

**Source revised:** 21 October 2026. **Source title:** Socket API, Network Programming, and High-Performance I/O (EDA387; supplied guide labels DIT661). The source's DIT661 suffix is not independently verified.

**† Supplementary material:** Content identified by the supplied guide as originating exclusively from hidden slides. It may not be included in this year's examinable material. The supplied guide reports no hidden substantive slides; that classification has been retained. No lesson is newly classified as hidden-slide supplementary content.

## Lessons

| Lesson | Reading estimate | Native practice |
| --- | --- | --- |
| [01. The socket boundary and protocol stack](01_socket_boundary.md) | ~2 min | Q001 |
| [02. Clients, servers, and socket pairs](02_clients_and_socket_pairs.md) | ~3 min | None supplied |
| [03. Services and port allocation](03_services_and_ports.md) | ~3 min | None supplied |
| [04. Concurrent connections on one server port](04_concurrent_demultiplexing.md) | ~3 min | None supplied |
| [05. BSD networking history](05_bsd_history.md) | ~2 min | None supplied |
| [06. Host and network byte order](06_byte_order.md) | ~3 min | Q014, Q015 |
| [07. Socket address structures and storage](07_address_structures.md) | ~3 min | Q010, Q019 |
| [08. IP presentation and numeric conversion](08_address_conversion.md) | ~2 min | Q018 |
| [09. Formatting a complete socket address](09_socket_formatting.md) | ~1 min | None supplied |
| [10. Protocol-independent name resolution](10_name_resolution.md) | ~2 min | Q016 |
| [11. A blocking TCP client-server session](11_session_overview.md) | ~1 min | None supplied |
| [12. Creating an endpoint with socket()](12_socket_call.md) | ~2 min | None supplied |
| [13. Active open with connect()](13_connect_call.md) | ~3 min | Q036 |
| [14. Choosing a local address with bind()](14_bind_call.md) | ~2 min | Q002, Q003 |
| [15. Passive open and listen backlog](15_listen_call.md) | ~1 min | None supplied |
| [16. Accepting connected descriptors](16_accept_call.md) | ~2 min | Q004 |
| [17. Closing descriptors and socket references](17_close_call.md) | ~1 min | None supplied |
| [18. Error wrappers and the Daytime client](18_wrappers_and_daytime_client.md) | ~2 min | None supplied |
| [19. An iterative Daytime server](19_daytime_server.md) | ~1 min | None supplied |
| [20. Three-way handshake and listen queues](20_handshake_and_queues.md) | ~3 min | Q065 |
| [21. Orderly teardown and half-close](21_orderly_teardown.md) | ~2 min | Q068 |
| [22. TCP states and simultaneous open or close](22_tcp_states.md) | ~2 min | Q008 |
| [23. Why TIME_WAIT lasts twice MSL](23_time_wait.md) | ~3 min | Q007, Q020 |
| [24. Byte streams, framing, and short counts](24_stream_framing.md) | ~3 min | Q005, Q032, Q071, Q072 |
| [25. Reading a requested byte count](25_readn.md) | ~2 min | Q024, Q031 |
| [26. Writing a complete local byte count](26_writen.md) | ~1 min | Q025 |
| [27. Buffered line reading and readiness](27_buffered_readline.md) | ~3 min | Q026 |
| [28. The baseline echo server](28_baseline_echo_server.md) | ~1 min | None supplied |
| [29. The baseline echo client and its blocking flaw](29_baseline_echo_client.md) | ~2 min | None supplied |
| [30. Blocking, nonblocking, and multiplexed I/O](30_io_models.md) | ~2 min | Q035, Q075 |
| [31. select sets, bounds, timeouts, and readiness](31_select_readiness.md) | ~4 min | Q027, Q028, Q029, Q037, Q038, Q042, Q062 |
| [32. A client waiting on stdin and its socket](32_select_client.md) | ~1 min | Q054 |
| [33. Batch pipelining and premature termination](33_batch_pipelining.md) | ~2 min | None supplied |
| [34. shutdown and a half-close-aware client](34_shutdown_half_close.md) | ~3 min | Q070, Q073, Q076 |
| [35. Processes, threads, and event-driven servers](35_server_concurrency.md) | ~2 min | Q013, Q021 |
| [36. A select-based concurrent echo server](36_select_server.md) | ~4 min | Q043, Q044, Q066, Q077, Q078, Q080 |
| [37. Partial-line stalls and per-client state](37_partial_lines_and_state.md) | ~2 min | Q039 |
| [38. C10K and scalable readiness mechanisms](38_c10k.md) | ~1 min | Q030 |
| [39. C10M, io_uring, and kernel-bypass tradeoffs](39_c10m_and_bypass.md) | ~3 min | None supplied |
| [40. Messaging above the socket](40_messaging_middleware.md) | ~1 min | None supplied |
| [41. Testing and debugging network programs](41_debugging.md) | ~2 min | None supplied |
| [42. Socket programming pitfalls and practice](42_pitfalls_and_practice.md) | ~2 min | None supplied |

## Coverage and study dependencies

All 80 question stems, ordered options, and keys were reviewed. **47** have socket API primary lessons. **32** lack sufficient explanation after checking networking guides 01–06, and **one** has partial background in TCP's archived Nagle timeline. These groups produce **33 coverage-gap flags**; their primary links stay empty and dependencies unresolved. Finding an API name or a related select example does not establish coverage of poll/epoll-specific semantics.

**40 wording-review flags** overlap the coverage categories. Some mapped questions have false premises or incorrect keys, such as Q018 (invalid inet_pton input), Q027/Q028 (select result sets), Q044 (maxfd), and Q076 (FIN timing). Their lessons explain the relevant reasoning; assigning them is not approval to score those keys as correct. No text, options, answer indices, explanations, or manual tags were changed.

**12 mapped questions require additional lessons** beyond their primary lesson; **46** have optional background. Required reading is listed in each Practice section and the [review dependency table](review.md#additional-required-lessons). Lesson-level prerequisites describe the study sequence and are not automatic per-question requirements. **18 lessons have no native quiz assignment** and remain included.

Shared concepts can support an API-labelled question without teaching that API's unasked internals: Q054 concerns two ready inputs, Q062 local writability, Q065 a bounded accept queue, and Q066 partial-write progress. Their mappings record that boundary. Edge/level triggering, pollfd flags, registration lifetime, and keepalive/linger details remain gaps where actually needed. No extension lessons were added to fill them.

Earlier gaps remain open: TCP Q003 (wraparound), Q026 (SYN cookies), and Q027 (reset attacks), plus IPv6 Q013 (link versus transport ACK scope). The socket guide provides background but not the missing mechanisms. No external questions were newly assigned or duplicated here.

See the [review queue](review.md), [manifest](manifest.json), and [verification](verification.md). The future application's persisted manual add/remove tag requirement remains in force.

## Code, provenance, and limits

The 26 C blocks are retained as teaching fragments, with the course support definitions, capitalized wrappers, blocking-descriptor assumptions, hidden/static buffer warnings, partial-write caveats, and EOF qualifications visible. No standalone application was created or compiled. Labelled editorial reasoning explains combinations already present in the source; it does not provide new poll/epoll operational teaching.

Baseline: `ea7f3e7` (full commit in the manifest). Preparation status: **user-approved on 22 October 2026**. The working tree was clean at the start; TCP and DNS approval changes were already committed. Remote push state was not independently checked.

Historical BSD timing, port and queue examples, release history, C10K/C10M milestones, and the ATC 2025 comparison remain source-reported material with their qualifications. Slide visibility, course suffix, historical claims, and every external resource were not independently authenticated. Supplementary API checks are review evidence only and do not close lecture gaps. Diagrams were preserved but not rendered locally. No commit or push was performed.
