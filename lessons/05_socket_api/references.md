# Socket API source and review references

## Revision notes and references

Historical BSD timing, queue, and port examples have been retained as historical examples. Corrections address address-family byte order, port ranges, EOF after buffered data, select's mutable timeout, TIME_WAIT exceptions, partial writes, static reader state, and conditional zero-copy support. Course code remains pedagogical: wrappers and blocking examples are labeled explicitly. The supplied course suffix DIT661 has not been verified against an original slide deck.

- [Linux listen(2)](https://man7.org/linux/man-pages/man2/listen.2.html), [accept(2)](https://man7.org/linux/man-pages/man2/accept.2.html), [select(2)](https://man7.org/linux/man-pages/man2/select.2.html), and [shutdown(2)](https://man7.org/linux/man-pages/man2/shutdown.2.html): API semantics and portability boundaries.
- [RFC 9293 — TCP](https://www.rfc-editor.org/rfc/rfc9293): connection state and orderly close.
- [IANA port registry](https://www.iana.org/assignments/service-names-port-numbers/): system, user, and dynamic/private ranges.
- [Linux epoll(7)](https://man7.org/linux/man-pages/man7/epoll.7.html) and [AF_XDP documentation](https://docs.kernel.org/networking/af_xdp.html): readiness and packet-I/O mechanisms.
- [Awamoto and Honda, Opening Up Kernel-Bypass TCP Stacks, USENIX ATC 2025](https://www.usenix.org/conference/atc25/presentation/awamoto): empirical comparison rather than a universal bypass recommendation.

## Supplementary editorial API checks

These references support question-review findings only; they are not added lecture teaching or hidden-slide classifications. Their consultation does not close a source coverage gap.

- [socket reference](https://man7.org/linux/man-pages/man7/socket.7.html): user/kernel socket interface, reuse limits, and linger context (Q001/Q011/Q033).
- [select reference](https://man7.org/linux/man-pages/man2/select.2.html): value-result sets, descriptor-number bounds, errors, and portability qualifications (Q027/Q028/Q039/Q041/Q044).
- [poll reference](https://man7.org/linux/man-pages/man2/poll.2.html): array slots, invalid-descriptor events, hangup flags, and timeout returns (Q050/Q051/Q053/Q055/Q079).
- [epoll reference](https://man7.org/linux/man-pages/man7/epoll.7.html): triggering, buffered progress, duplicate references, cached events, and final-close lifetime (Q059/Q060/Q061/Q069/Q074/Q079).
- [ctl reference](https://man7.org/linux/man-pages/man2/epoll_ctl.2.html): duplicate ADD errors, invalid-fd deletion, and unsupported regular files (Q061/Q063/Q067).
- [pton reference](https://man7.org/linux/man-pages/man3/inet_pton.3.html): numeric octet validation and invalid-input returns (Q018).
- [resolver reference](https://man7.org/linux/man-pages/man3/getaddrinfo.3.html): hints filtering; a returned address family is not itself listener policy (Q017).
- [ipv6 reference](https://man7.org/linux/man-pages/man7/ipv6.7.html): IPv4-mapped acceptance and IPv6 socket options (Q017).
- [send reference](https://man7.org/linux/man-pages/man2/send.2.html): the Linux EPIPE versus ENOTCONN caveat (Q009).
- [listen reference](https://man7.org/linux/man-pages/man2/listen.2.html): implicit ephemeral binding when no local bind was supplied (Q012).
- [wait reference](https://man7.org/linux/man-pages/man2/wait.2.html): child reaping and alternatives to installing a SIGCHLD handler (Q023).
- [winsock reference](https://learn.microsoft.com/en-us/windows/win32/api/winsock2/nf-winsock2-select): socket handles and selectable object restrictions compared with the source Unix examples (Q040).

[Topic overview](README.md) · [Review queue](review.md)
