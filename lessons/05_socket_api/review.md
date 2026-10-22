# Socket API question coverage and review

Reviewed on 22 October 2026 against the supplied guide and networking lectures 01–06. Original question text, ordered options, keys, explanations, and manual tags are preserved. Coverage and key validity are independent. Exact evidence headings, stable IDs, fingerprints, and rationale are in the [manifest](manifest.json).

## Missing and partial coverage

33 questions remain unassigned with unresolved dependencies. Except for Q046's partial TCP background, these lack sufficient teaching in the available networking guides. A source name mention, bibliography link, or another API's similar behavior is not an explanation of the requested mechanism. Algorithms guides were excluded.

| Question | Missing teaching and closest source context |
| --- | --- |
| Q006 | The guide shows the third handshake ACK and SYN_RCVD waiting state but not the server SYN+ACK retransmission path after that ACK is lost. Closest context: [lesson 20](20_handshake_and_queues.md). |
| Q009 | The connection setup sequence is taught, but send/recv before establishment and the ENOTCONN error contract are not explained. Closest context: [lesson 13](13_connect_call.md). |
| Q011 | EADDRINUSE is taught and the summary recommends appropriate SO_REUSEADDR use, but no explanation gives the reuse conditions or when it cannot resolve a live-listener conflict. Closest context: [lesson 14](14_bind_call.md). |
| Q012 | The source uses explicit bind before listen and explains port-zero allocation, but not listen's implicit binding when bind was omitted. Closest context: [lesson 15](15_listen_call.md). |
| Q017 | Protocol-independent resolution is taught, but addrinfo hints/ai_family, IPv4-mapped acceptance, and IPV6_V6ONLY are not explained in guides 01–06. Closest context: [lesson 10](10_name_resolution.md). |
| Q022 | Forked processes and private address spaces are described, but child exit status, zombies, wait/waitpid, and reaping are absent from the networking guides. Closest context: [lesson 35](35_server_concurrency.md). |
| Q023 | No networking guide teaches SIGCHLD handlers or child-reaping alternatives. Descriptor close across fork is a different resource-lifetime issue. Closest context: [lesson 35](35_server_concurrency.md). |
| Q033 | TIME_WAIT explains duplicate expiry, and the summary names SO_REUSEADDR, but its listener-rebind semantics and interaction with retained connection protections are not taught. Closest context: [lesson 23](23_time_wait.md). |
| Q034 | TCP keepalive defaults, probes, failure detection, and their loss tradeoffs are not explained. BGP keepalive messages are a different protocol mechanism. Closest context: No suitable primary lesson. |
| Q040 | The source deliberately teaches Unix fileno(stdin) plus sockets; it does not compare Windows socket handles, CRT descriptors, or selectable stdin types across platforms. Closest context: [lesson 32](32_select_client.md). |
| Q041 | The server demonstrates close plus FD_CLR, but the exact select EBADF error rule and platform exceptions asked by the key are not explained. Closest context: [lesson 36](36_select_server.md). |
| Q045 | The close lesson mentions linger affecting blocking but does not define a zero-time SO_LINGER setting or abortive reset behavior. Closest context: [lesson 17](17_close_call.md). |
| Q046 | The archived TCP timeline mentions Nagle reducing tinygram overhead, but neither it nor the socket guide explains TCP_NODELAY or its latency/packetization tradeoff. Closest context: [TCP archived timeline](../04_tcp/16_tcp_history.md). |
| Q047 | No networking guide explains TCP keepalive idle timers or the detection-versus-probe-overhead tradeoff. Closest context: No suitable primary lesson. |
| Q048 | Poll is named alongside select, but the pollfd array interface and absence of the fd_set bitmap bound are not taught. Closest context: [lesson 38](38_c10k.md). |
| Q049 | The source does not explain poll's dynamic descriptor array; general C10K scanning/ready-list discussion is insufficient to establish that comparison. Closest context: [lesson 38](38_c10k.md). |
| Q050 | Poll event handling for closed/invalid descriptors and the distinction between released descriptors and retained TCP TIME_WAIT state are not explained together. Closest context: No suitable primary lesson. |
| Q051 | Select's zero-on-timeout return is taught, but poll's return contract is not. Its API cannot be inferred merely from another API having a similar return value. Closest context: No suitable primary lesson. |
| Q052 | POLLERR and POLLHUP are not defined anywhere in guides 01–06; select's readable/writable/error cases do not identify poll's event flags. Closest context: No suitable primary lesson. |
| Q053 | The source clears a select master set after close, but it does not teach pollfd invalid entries, POLLNVAL, or descriptor-number reuse in a poll array. Closest context: No suitable primary lesson. |
| Q055 | The source's client[] bookkeeping is for select. It does not explain pollfd array deletion, negative-fd holes, or other poll client-tracking strategies. Closest context: No suitable primary lesson. |
| Q056 | The guide says linger can affect close blocking, but omits the enabled nonzero timeout conditions and completion/timeout semantics required by this question. Closest context: [lesson 17](17_close_call.md). |
| Q057 | The guide mentions possible linger blocking and queued kernel data but does not explain which linger setting waits, what completion means, or the timeout bound. Closest context: [lesson 17](17_close_call.md). |
| Q058 | Epoll is introduced as scalable ready-work handling, but its edge-triggered and level-triggered modes are not defined. Closest context: [lesson 38](38_c10k.md). |
| Q059 | The nonblocking state-machine lesson teaches draining available bytes to EAGAIN, but not why edge triggering requires managing readiness this way. Closest context: [lesson 37](37_partial_lines_and_state.md). |
| Q060 | Output progress and EAGAIN are taught, but no guide explains edge-triggered write notifications or the stall caused by sleeping with pending progress. Closest context: [lesson 36](36_select_server.md). |
| Q061 | No guide teaches epoll_ctl, EPOLL_CTL_DEL, open-file-description lifetime, or automatic registration removal on final close. Closest context: [lesson 38](38_c10k.md). |
| Q063 | No guide describes epoll registration identity, duplicate ADD errors, or registrations using duplicated descriptors. Closest context: [lesson 38](38_c10k.md). |
| Q064 | The high-level epoll introduction does not define level triggering or repeated notification while readiness persists. Closest context: [lesson 38](38_c10k.md). |
| Q067 | The guide does not teach epoll-supported file types, EPERM on regular-file registration, or how stdin's underlying object changes suitability. Closest context: [lesson 38](38_c10k.md). |
| Q069 | Peer hangup notification, local descriptor closure, repeated epoll events, and interest-list removal are not explained in the source. Closest context: [lesson 38](38_c10k.md). |
| Q074 | The source does not teach epoll registration lifetime, duplicate references, cached event batches, or stale application event identity after descriptor reuse. Closest context: [lesson 38](38_c10k.md). |
| Q079 | The guides never compare pollfd cleanup with epoll interest-list teardown. General close/TIME_WAIT descriptions do not establish those API-specific rules. Closest context: [lesson 38](38_c10k.md). |

The targeted search covered handshake loss recovery, socket errno contracts, reuse/linger/keepalive options, resolver hints/IPv6-only acceptance, child reaping, platform-specific stdin handling, pollfd and poll event flags, epoll trigger modes, registration identity, descriptor lifetime, and teardown. Nagle appears only in TCP's archived historical timeline; BGP keepalives do not explain TCP keepalive. No operational poll/epoll tutorial was found in the other networking lectures.

## Wording and answer-key findings

These findings preserve the original keys. A mapped entry may identify teaching that contradicts the key; a gap entry may additionally have an invalid premise. Supplementary API documentation checks the defect without being counted as new lecture coverage.

| Question | Finding | Review evidence |
| --- | --- | --- |
| Q001 | The API can include user-space library code while system calls enter the kernel stack. This does not require ordinary applications to obtain driver privileges; no option cleanly states the boundary issue. | [Supplementary API check](https://man7.org/linux/man-pages/man7/socket.7.html) |
| Q003 | Specify overlapping local IP/port bindings in the same networking context. Equal port numbers on different local IPs do not alone establish a conflict. | [Source teaching](../../lectures/lecture_05_socket-api.md#3-bind--assigning-a-local-protocol-address) |
| Q009 | An unconnected send need not universally fail with ENOTCONN; Linux documents EPIPE as an alternative. Specify the call and platform. | [Supplementary API check](https://man7.org/linux/man-pages/man2/send.2.html) |
| Q010 | Zeroing unused padding is a portable convention; properly initialized required fields are distinct from a universal need to zero the whole structure. | [Source teaching](../../lectures/lecture_05_socket-api.md#22-socket-address-structures-sockaddr-sockaddr_in-sockaddr_storage) |
| Q011 | SO_REUSEADDR does not resolve every active-listener conflict. Qualify the restart/rebind situation and platform. | [Supplementary API check](https://man7.org/linux/man-pages/man7/socket.7.html) |
| Q012 | On systems with implicit listen binding, the OS selects an ephemeral port. It does not listen on actual port zero. | [Supplementary API check](https://man7.org/linux/man-pages/man2/listen.2.html) |
| Q015 | A homogeneous lab may mask native-payload assumptions, but little-endian hosts still need network order for the protocol fields discussed by the guide. | [Source teaching](../../lectures/lecture_05_socket-api.md#2-byte-ordering-socket-address-structures-and-address-conversion) |
| Q017 | Restricting resolver results to AF_INET6 does not alone guarantee an IPv6-only listener; IPv4-mapped acceptance and socket settings matter. | [Supplementary API check](https://man7.org/linux/man-pages/man3/getaddrinfo.3.html) |
| Q018 | The premise and key are false: inet_pton rejects 300.1.1.1; dotted-decimal octets must be within 0–255. | [Supplementary API check](https://man7.org/linux/man-pages/man3/inet_pton.3.html) |
| Q023 | A SIGCHLD handler is one reaping strategy, not mandatory for every fork-based server. Explicit waits and configured no-zombie behavior are alternatives. | [Supplementary API check](https://man7.org/linux/man-pages/man2/wait.2.html) |
| Q026 | Line readers need not peek one byte at a time. The source prefetches blocks, parses buffered bytes, and retains excess input. | [Source teaching](../../lectures/lecture_05_socket-api.md#3-readline--buffering-and-readiness) |
| Q027 | Select returns the ready subset, rather than clearing every descriptor. Rebuild the interest sets. | [Supplementary API check](https://man7.org/linux/man-pages/man2/select.2.html) |
| Q028 | The bug is lost interest in previously nonready descriptors, not cached reports of old readiness. | [Supplementary API check](https://man7.org/linux/man-pages/man2/select.2.html) |
| Q031 | Readiness promises neither a whole message nor unconditional completion by readn/writen; EOF and errors still matter. | [Source teaching](../../lectures/lecture_05_socket-api.md#52-implementing-readn-writen-and-buffered-readline) |
| Q033 | Listener rebinding does not automatically remove connection-level TIME_WAIT protections or imply acceptance of stray duplicates. | [Supplementary API check](https://man7.org/linux/man-pages/man7/socket.7.html) |
| Q037 | Qualify this as a client requesting both read and write readiness. A read-only interest set is valid. | [Source teaching](../../lectures/lecture_05_socket-api.md#62-the-select-system-call-and-descriptor-readiness-conditions) |
| Q038 | Writability can also indicate an immediate error, so describing it solely as available buffer space is incomplete. | [Source teaching](../../lectures/lecture_05_socket-api.md#62-the-select-system-call-and-descriptor-readiness-conditions) |
| Q039 | FD_SETSIZE bounds descriptor values representable in fd_set, not the process's total socket count. | [Supplementary API check](https://man7.org/linux/man-pages/man2/select.2.html) |
| Q040 | Name the platform and stdin object. Unix file descriptors and Windows socket handles have different API constraints. | [Supplementary API check](https://learn.microsoft.com/en-us/windows/win32/api/winsock2/nf-winsock2-select) |
| Q041 | EBADF is the specified invalid-descriptor error; Linux documents an exception for entries above its current highest open descriptor. | [Supplementary API check](https://man7.org/linux/man-pages/man2/select.2.html) |
| Q044 | A stale high maxfd only adds scan work when closed entries are cleared; descriptors beyond nfds are not inspected. | [Supplementary API check](https://man7.org/linux/man-pages/man2/select.2.html) |
| Q050 | A released descriptor and TCP TIME_WAIT are different lifetimes; poll reports invalid entries rather than polled TIME_WAIT state. | [Supplementary API check](https://man7.org/linux/man-pages/man2/poll.2.html) |
| Q051 | The keyed option defines timeout but omits the risk the stem also requests. | [Supplementary API check](https://man7.org/linux/man-pages/man2/poll.2.html) |
| Q053 | An invalid open-number entry produces POLLNVAL, not ordinary spurious readiness; descriptor reuse is a separate case. | [Supplementary API check](https://man7.org/linux/man-pages/man2/poll.2.html) |
| Q054 | Independent ready inputs require handling; they do not intrinsically conflict. State whether buffering or scheduling is the intended issue. | [Source teaching](../../lectures/lecture_05_socket-api.md#63-revisiting-str_cli-with-select-batch-input-pipelining-and-shutdown) |
| Q055 | Compacting the array is optional: negative-fd slots can be ignored. | [Supplementary API check](https://man7.org/linux/man-pages/man2/poll.2.html) |
| Q059 | Drain available progress before waiting; the key's single-event-until-empty description is too absolute. | [Supplementary API check](https://man7.org/linux/man-pages/man7/epoll.7.html) |
| Q060 | Stopping early can stall pending output; bytes are lost only if application buffer management drops them. | [Supplementary API check](https://man7.org/linux/man-pages/man7/epoll.7.html) |
| Q061 | DEL after close is not universally required; final close removes interest and deletion through an invalid fd can fail. | [Supplementary API check](https://man7.org/linux/man-pages/man2/epoll_ctl.2.html) |
| Q063 | Adding the same fd twice fails with EEXIST; dup-created descriptors are a different case. | [Supplementary API check](https://man7.org/linux/man-pages/man2/epoll_ctl.2.html) |
| Q067 | Regular files cannot be registered; stdin may instead be a terminal or pipe. “Reliably” obscures the supported-type rule. | [Supplementary API check](https://man7.org/linux/man-pages/man2/epoll_ctl.2.html) |
| Q068 | Require a nonzero read request and distinguish peer sending EOF from closure of both TCP directions. | [Source teaching](../../lectures/lecture_05_socket-api.md#42-four-way-connection-termination-and-half-close) |
| Q069 | Distinguish peer hangup, local close, and outstanding references; detecting peer closure before cleanup is normal. | [Supplementary API check](https://man7.org/linux/man-pages/man7/epoll.7.html) |
| Q072 | Application read chunks and record lengths drive parsing; they are not TCP segment boundaries. Fixed buffers with proper framing are valid. | [Source teaching](../../lectures/lecture_05_socket-api.md#5-byte-stream-framing-short-counts-and-robust-io-wrappers) |
| Q073 | Specify retaining an open connection without signaling sending EOF. The source's early-exit bug instead truncates replies. | [Source teaching](../../lectures/lecture_05_socket-api.md#step-3-fixing-batch-mode-with-shutdown-tcp-half-close-and-raw-buffer-io) |
| Q074 | Specify cached events or remaining duplicate references; a recycled number alone does not preserve interest after final close. | [Supplementary API check](https://man7.org/linux/man-pages/man7/epoll.7.html) |
| Q075 | This is a general event-loop design concern, not an epoll-specific requirement or an established comparison with raw socket I/O. | [Source teaching](../../lectures/lecture_05_socket-api.md#6-io-models-io-multiplexing-select-and-batch-input) |
| Q076 | The key is false: orderly FIN follows queued data and buffered bytes precede EOF, even if the application reads later. | [Source teaching](../../lectures/lecture_05_socket-api.md#step-3-fixing-batch-mode-with-shutdown-tcp-half-close-and-raw-buffer-io) |
| Q077 | Specify pending application buffers. Ordinary close attempts to transmit the kernel queue; incomplete responses are not TCP checksum-level corruption. | [Source teaching](../../lectures/lecture_05_socket-api.md#72-event-driven-single-process-server-using-select) |
| Q079 | The key reverses lifecycle rules: poll does not ignore invalid entries, and final close removes epoll interest. | [Supplementary API check](https://man7.org/linux/man-pages/man7/epoll.7.html) |

Q017 additionally uses the supplementary IPv6 API check for mapped-address acceptance. Q061/Q079 compare registration deletion with final-close lifetime, not peer FIN or TIME_WAIT. The review deliberately distinguishes those identities instead of turning every teardown case into “stale events.” Sources are listed in [references](references.md#supplementary-editorial-api-checks).

## Additional required lessons

These are required for the requested reasoning beyond the primary lesson; optional background is kept separately in the manifest. Gap dependencies remain unresolved. No fully mapped native question relies on a † section.

| Question | Primary | Additional required teaching | Why |
| --- | --- | --- | --- |
| Q001 | [lesson 01](01_socket_boundary.md) | [lesson 12](12_socket_call.md) | The source locates the API across the user/kernel boundary; the socket-call lesson separates ordinary endpoints from privileged raw sockets. Together they explain the boundary, but do not support the key claiming ordinary applications need device-driver privilege. |
| Q002 | [lesson 14](14_bind_call.md) | [lesson 13](13_connect_call.md) | Bind chooses the local IP/port; connect supplies the remote endpoint and can otherwise let the kernel choose the local endpoint. Both explanations are needed for the API-separation tradeoff. |
| Q004 | [lesson 16](16_accept_call.md) | [lesson 20](20_handshake_and_queues.md), [lesson 21](21_orderly_teardown.md) | Accept dequeues a kernel-established connection; the handshake can finish before the application accepts it. Orderly FIN preserves queued data and EOF, so this case follows by combining queue and teardown teaching. RST aborts are separate. |
| Q031 | [lesson 25](25_readn.md) | [lesson 26](26_writen.md), [lesson 31](31_select_readiness.md) | The compound question requires readn, writen, and readiness semantics. Readn may stop at EOF/error and readiness does not promise n bytes; writen completion means local acceptance. Those teachings refute the key's unconditional complete-transfer promise. |
| Q042 | [lesson 31](31_select_readiness.md) | [lesson 25](25_readn.md) | The select description permits signal interruption; the helper lesson supplies explicit EINTR retry/error handling. Returned readiness must not be treated as ordinary success after an interrupted call. |
| Q044 | [lesson 36](36_select_server.md) | [lesson 31](31_select_readiness.md) | The server never reduces maxfd on close, yet clears the corresponding interest bit. Combined with select's nfds bound, this shows that an oversized bound is harmless except for scan cost; readiness cannot be reported beyond the bound. |
| Q054 | [lesson 32](32_select_client.md) | [lesson 30](30_io_models.md) | The client independently handles stdin and socket readiness; the I/O-model diagram explicitly groups select/poll as readiness multiplexing. This supports shared input-handling reasoning, not any unprovided pollfd detail. Readiness is not inherently a conflict. |
| Q066 | [lesson 36](36_select_server.md) | [lesson 26](26_writen.md) | The nonblocking-output limitation explicitly calls for a pending output queue and partial-write/EAGAIN handling. Writen supplies the progress loop; together they teach retrying the remaining bytes until completion or EAGAIN without assuming epoll-specific APIs. |
| Q073 | [lesson 34](34_shutdown_half_close.md) | [lesson 28](28_baseline_echo_server.md) | The half-close client signals sending EOF while continuing to read, and the echo server waits for read EOF to finish its input loop. Omitting that signal while keeping the connection open can leave the server waiting; premature client exit is a different source bug. |
| Q076 | [lesson 34](34_shutdown_half_close.md) | [lesson 21](21_orderly_teardown.md) | Shutdown queues FIN after prior data; the teardown explanation exposes EOF after buffered data. Together they refute the keyed claim that a FIN arriving before the application reads inherently loses data. |
| Q077 | [lesson 36](36_select_server.md) | [lesson 17](17_close_call.md) | The output-queue limitation explains partial application-held writes. The close lesson distinguishes those bytes from the kernel send buffer, which ordinary close attempts to transmit; the question must specify that boundary. |
| Q078 | [lesson 36](36_select_server.md) | [lesson 17](17_close_call.md) | Per-client output queues retain unsent application data across partial writes. Descriptor close cannot transmit bytes never submitted to the kernel, so teardown must account for the remaining application queue. |

## Question-by-question audit

All 80 stems and keyed choices are accounted for. Mapped results establish relevant teaching, including refutation of a defective key; they do not resolve a wording flag. Shared readiness/queue/buffering questions are assessed on the reasoning actually requested, while API-specific controls and event flags need their own missing teaching.

| Question | Primary or coverage | Semantic evidence |
| --- | --- | --- |
| Q001 | [lesson 01](01_socket_boundary.md) | The source locates the API across the user/kernel boundary; the socket-call lesson separates ordinary endpoints from privileged raw sockets. Together they explain the boundary, but do not support the key claiming ordinary applications need device-driver privilege. |
| Q002 | [lesson 14](14_bind_call.md) | Bind chooses the local IP/port; connect supplies the remote endpoint and can otherwise let the kernel choose the local endpoint. Both explanations are needed for the API-separation tradeoff. |
| Q003 | [lesson 14](14_bind_call.md) | Bind names a local IP and port and documents EADDRINUSE for conflicts. The answer needs an overlapping local endpoint, not merely equal numeric ports on different local addresses. |
| Q004 | [lesson 16](16_accept_call.md) | Accept dequeues a kernel-established connection; the handshake can finish before the application accepts it. Orderly FIN preserves queued data and EOF, so this case follows by combining queue and teardown teaching. RST aborts are separate. |
| Q005 | [lesson 24](24_stream_framing.md) | The source explicitly distinguishes a byte stream from record boundaries and explains short receives from currently available data, independently of write sizes and segment boundaries. |
| Q006 | Coverage gap | The guide shows the third handshake ACK and SYN_RCVD waiting state but not the server SYN+ACK retransmission path after that ACK is lost. |
| Q007 | [lesson 23](23_time_wait.md) | Both stated TIME_WAIT purposes are explained: re-ACK a retransmitted final FIN and let old duplicates expire under the MSL model. |
| Q008 | [lesson 22](22_tcp_states.md) | The state diagram explicitly follows simultaneous FINs through FIN_WAIT_1, CLOSING, and TIME_WAIT, with the combined FIN/ACK alternative retained. |
| Q009 | Coverage gap | The connection setup sequence is taught, but send/recv before establishment and the ENOTCONN error contract are not explained. |
| Q010 | [lesson 07](07_address_structures.md) | The address-structure lesson identifies unused padding and calls zero-initialization a good portable convention. The client shows that convention; it does not establish the universal necessity asserted by the question. |
| Q011 | Coverage gap | EADDRINUSE is taught and the summary recommends appropriate SO_REUSEADDR use, but no explanation gives the reuse conditions or when it cannot resolve a live-listener conflict. |
| Q012 | Coverage gap | The source uses explicit bind before listen and explains port-zero allocation, but not listen's implicit binding when bind was omitted. |
| Q013 | [lesson 35](35_server_concurrency.md) | The iterative-server lunch example directly shows one blocked client read preventing service to queued clients. The concurrency mechanisms explain the alternatives. |
| Q014 | [lesson 06](06_byte_order.md) | The two-byte 0x0102 example and conversion definitions explain reversed byte significance between host representations without claiming that the kernel misparses every packet. |
| Q015 | [lesson 06](06_byte_order.md) | The source mandates canonical network order for relevant protocol fields. Shared native application-payload conventions can mask a problem, but homogeneous little-endian hosts do not remove network-order requirements. |
| Q016 | [lesson 10](10_name_resolution.md) | The resolver explanation explicitly contrasts IPv4-only legacy interfaces with protocol-independent address lists serving IPv4 and IPv6. It is a capability, not a promise that every lookup returns both. |
| Q017 | Coverage gap | Protocol-independent resolution is taught, but addrinfo hints/ai_family, IPv4-mapped acceptance, and IPV6_V6ONLY are not explained in guides 01–06. |
| Q018 | [lesson 08](08_address_conversion.md) | The conversion interface explicitly rejects invalid presentation input with return zero. The numeric-octet example in the quiz is a false premise confirmed by the supplementary API check; the key is not accepted as correct. |
| Q019 | [lesson 07](07_address_structures.md) | The generic sockaddr pointer exists to pass address structures for different families through one API. The source separately explains why larger generic storage uses sockaddr_storage. |
| Q020 | [lesson 23](23_time_wait.md) | The old-incarnation example explains delayed duplicates using the same four-tuple and the MSL wait that protects a new incarnation under the stated assumptions. |
| Q021 | [lesson 35](35_server_concurrency.md) | Processes have private address spaces while the event loop shares one control flow/address space. The labelled source-derived clarification makes the isolation/process-resource tradeoff explicit without a universal speed ranking. |
| Q022 | Coverage gap | Forked processes and private address spaces are described, but child exit status, zombies, wait/waitpid, and reaping are absent from the networking guides. |
| Q023 | Coverage gap | No networking guide teaches SIGCHLD handlers or child-reaping alternatives. Descriptor close across fork is a different resource-lifetime issue. |
| Q024 | [lesson 25](25_readn.md) | The readn loop waits until its requested count, EOF, or an error. A peer that sends too little and stays open can leave that blocking loop waiting indefinitely. |
| Q025 | [lesson 26](26_writen.md) | The source writen implementation explicitly retries EINTR without discarding progress and loops over partial writes until all local bytes are accepted or an error occurs. |
| Q026 | [lesson 27](27_buffered_readline.md) | The source contrasts inefficient one-byte syscalls with block prefetch and per-byte parsing from an internal buffer. The key captures delimiter detection but the claim that peeking is required is false. |
| Q027 | [lesson 31](31_select_readiness.md) | The value-result explanation states that select returns the ready subset, so interest must be rebuilt. It does not clear every descriptor indiscriminately as the key says. |
| Q028 | [lesson 31](31_select_readiness.md) | Reusing a result set can lose interest in descriptors previously not ready. Readiness is checked anew for watched descriptors rather than replaying old notifications; the keyed explanation names the wrong bug. |
| Q029 | [lesson 31](31_select_readiness.md) | The readiness table explains checking which sockets can make read progress before reading. The optional partial-line lesson explains why this does not promise a complete application message. |
| Q030 | [lesson 38](38_c10k.md) | The C10K discussion explicitly describes repeated full-set scans and linear overhead, alongside the separate descriptor-set bound. |
| Q031 | [lesson 25](25_readn.md) | The compound question requires readn, writen, and readiness semantics. Readn may stop at EOF/error and readiness does not promise n bytes; writen completion means local acceptance. Those teachings refute the key's unconditional complete-transfer promise. |
| Q032 | [lesson 24](24_stream_framing.md) | The framing lesson explains the lack of intrinsic TCP message records and EOF signaled by read returning zero. That distinguishes receive-side EOF from an empty application record. |
| Q033 | Coverage gap | TIME_WAIT explains duplicate expiry, and the summary names SO_REUSEADDR, but its listener-rebind semantics and interaction with retained connection protections are not taught. |
| Q034 | Coverage gap | TCP keepalive defaults, probes, failure detection, and their loss tradeoffs are not explained. BGP keepalive messages are a different protocol mechanism. |
| Q035 | [lesson 30](30_io_models.md) | The nonblocking I/O sequence repeatedly returns EWOULDBLOCK before data exists; the polling loop demonstrates why retrying without waiting wastes CPU. |
| Q036 | [lesson 13](13_connect_call.md) | The connect lesson explicitly distinguishes EINPROGRESS from failure and established success, and requires checking SO_ERROR after readiness. |
| Q037 | [lesson 31](31_select_readiness.md) | The source describes independent read and write interest/result sets and allows one descriptor to be counted in both. Both must be inspected when both were requested; read-only clients need not request a write set. |
| Q038 | [lesson 31](31_select_readiness.md) | The readiness table explicitly includes immediate write errors and closed write halves as writable cases. Local space and readiness are not guarantees of successful delivery. |
| Q039 | [lesson 37](37_partial_lines_and_state.md) | The source explicitly states that FD_SETSIZE bounds descriptor values, with a 1020-client example only under specific occupied-descriptor assumptions. It is not a universal maximum number of sockets a process can open. |
| Q040 | Coverage gap | The source deliberately teaches Unix fileno(stdin) plus sockets; it does not compare Windows socket handles, CRT descriptors, or selectable stdin types across platforms. |
| Q041 | Coverage gap | The server demonstrates close plus FD_CLR, but the exact select EBADF error rule and platform exceptions asked by the key are not explained. |
| Q042 | [lesson 31](31_select_readiness.md) | The select description permits signal interruption; the helper lesson supplies explicit EINTR retry/error handling. Returned readiness must not be treated as ordinary success after an interrupted call. |
| Q043 | [lesson 36](36_select_server.md) | On read EOF, the server listing closes connfd, clears it from allset, and releases its client-array slot. All three steps are shown together. |
| Q044 | [lesson 36](36_select_server.md) | The server never reduces maxfd on close, yet clears the corresponding interest bit. Combined with select's nfds bound, this shows that an oversized bound is harmless except for scan cost; readiness cannot be reported beyond the bound. |
| Q045 | Coverage gap | The close lesson mentions linger affecting blocking but does not define a zero-time SO_LINGER setting or abortive reset behavior. |
| Q046 | Partial TCP background; gap | The archived TCP timeline mentions Nagle reducing tinygram overhead, but neither it nor the socket guide explains TCP_NODELAY or its latency/packetization tradeoff. |
| Q047 | Coverage gap | No networking guide explains TCP keepalive idle timers or the detection-versus-probe-overhead tradeoff. |
| Q048 | Coverage gap | Poll is named alongside select, but the pollfd array interface and absence of the fd_set bitmap bound are not taught. |
| Q049 | Coverage gap | The source does not explain poll's dynamic descriptor array; general C10K scanning/ready-list discussion is insufficient to establish that comparison. |
| Q050 | Coverage gap | Poll event handling for closed/invalid descriptors and the distinction between released descriptors and retained TCP TIME_WAIT state are not explained together. |
| Q051 | Coverage gap | Select's zero-on-timeout return is taught, but poll's return contract is not. Its API cannot be inferred merely from another API having a similar return value. |
| Q052 | Coverage gap | POLLERR and POLLHUP are not defined anywhere in guides 01–06; select's readable/writable/error cases do not identify poll's event flags. |
| Q053 | Coverage gap | The source clears a select master set after close, but it does not teach pollfd invalid entries, POLLNVAL, or descriptor-number reuse in a poll array. |
| Q054 | [lesson 32](32_select_client.md) | The client independently handles stdin and socket readiness; the I/O-model diagram explicitly groups select/poll as readiness multiplexing. This supports shared input-handling reasoning, not any unprovided pollfd detail. Readiness is not inherently a conflict. |
| Q055 | Coverage gap | The source's client[] bookkeeping is for select. It does not explain pollfd array deletion, negative-fd holes, or other poll client-tracking strategies. |
| Q056 | Coverage gap | The guide says linger can affect close blocking, but omits the enabled nonzero timeout conditions and completion/timeout semantics required by this question. |
| Q057 | Coverage gap | The guide mentions possible linger blocking and queued kernel data but does not explain which linger setting waits, what completion means, or the timeout bound. |
| Q058 | Coverage gap | Epoll is introduced as scalable ready-work handling, but its edge-triggered and level-triggered modes are not defined. |
| Q059 | Coverage gap | The nonblocking state-machine lesson teaches draining available bytes to EAGAIN, but not why edge triggering requires managing readiness this way. |
| Q060 | Coverage gap | Output progress and EAGAIN are taught, but no guide explains edge-triggered write notifications or the stall caused by sleeping with pending progress. |
| Q061 | Coverage gap | No guide teaches epoll_ctl, EPOLL_CTL_DEL, open-file-description lifetime, or automatic registration removal on final close. |
| Q062 | [lesson 31](31_select_readiness.md) | The shared socket-readiness table distinguishes local write progress from remote delivery and includes pending errors. This answers the conceptual writability question without requiring epoll registration mechanics. |
| Q063 | Coverage gap | No guide describes epoll registration identity, duplicate ADD errors, or registrations using duplicated descriptors. |
| Q064 | Coverage gap | The high-level epoll introduction does not define level triggering or repeated notification while readiness persists. |
| Q065 | [lesson 20](20_handshake_and_queues.md) | The bounded completed queue and accept-dequeue diagram explain why failing to accept leaves no room for more connections. The question asks that bounded-queue consequence, not an epoll-specific trigger rule. |
| Q066 | [lesson 36](36_select_server.md) | The nonblocking-output limitation explicitly calls for a pending output queue and partial-write/EAGAIN handling. Writen supplies the progress loop; together they teach retrying the remaining bytes until completion or EAGAIN without assuming epoll-specific APIs. |
| Q067 | Coverage gap | The guide does not teach epoll-supported file types, EPERM on regular-file registration, or how stdin's underlying object changes suitability. |
| Q068 | [lesson 21](21_orderly_teardown.md) | Orderly FIN makes EOF visible only after preceding buffered data is consumed. The source glossary specifies a nonzero read request and closure of the sending stream, which the question should retain. |
| Q069 | Coverage gap | Peer hangup notification, local descriptor closure, repeated epoll events, and interest-list removal are not explained in the source. |
| Q070 | [lesson 34](34_shutdown_half_close.md) | The source directly compares descriptor reference release with directional shutdown, including SHUT_WR preserving the receive direction. |
| Q071 | [lesson 24](24_stream_framing.md) | The no-record-boundary explanation and concrete short-read examples show that a receive may contain part of a line regardless of the sender's write size. |
| Q072 | [lesson 24](24_stream_framing.md) | Short-count and framing examples explain splitting logical data across successive application reads/buffers. The source explicitly prevents equating those chunks with TCP segment boundaries. |
| Q073 | [lesson 34](34_shutdown_half_close.md) | The half-close client signals sending EOF while continuing to read, and the echo server waits for read EOF to finish its input loop. Omitting that signal while keeping the connection open can leave the server waiting; premature client exit is a different source bug. |
| Q074 | Coverage gap | The source does not teach epoll registration lifetime, duplicate references, cached event batches, or stale application event identity after descriptor reuse. |
| Q075 | [lesson 30](30_io_models.md) | The general multiplexing model explains coordinating user input and socket events. The premise is misleading: it is an application architecture issue shared by readiness APIs, not an intrinsic epoll requirement or a demonstrated epoll-versus-raw-socket difficulty. |
| Q076 | [lesson 34](34_shutdown_half_close.md) | Shutdown queues FIN after prior data; the teardown explanation exposes EOF after buffered data. Together they refute the keyed claim that a FIN arriving before the application reads inherently loses data. |
| Q077 | [lesson 36](36_select_server.md) | The output-queue limitation explains partial application-held writes. The close lesson distinguishes those bytes from the kernel send buffer, which ordinary close attempts to transmit; the question must specify that boundary. |
| Q078 | [lesson 36](36_select_server.md) | Per-client output queues retain unsent application data across partial writes. Descriptor close cannot transmit bytes never submitted to the kernel, so teardown must account for the remaining application queue. |
| Q079 | Coverage gap | The guides never compare pollfd cleanup with epoll interest-list teardown. General close/TIME_WAIT descriptions do not establish those API-specific rules. |
| Q080 | [lesson 36](36_select_server.md) | The full server cleanup path coordinates descriptors, master interest sets, and client slots. The retained output-queue limitation extends the same consistency requirement to pending buffers. |

## Existing cross-topic gaps

TCP Q003 still lacks sequence-wraparound arithmetic; TIME_WAIT protects connection incarnations rather than supplying that explanation. TCP Q026 still lacks SYN-cookie/SYN-flood teaching despite the new handshake/queue lesson. TCP Q027 still lacks forged-reset sequence validation despite socket RST and tuple background. IPv6 Q013 still lacks the explicit link-ACK versus end-to-end-ACK comparison. No canonical question in an earlier quiz was reassigned.

[Topic overview](README.md) · [Verification](verification.md)
