# Socket API glossary

Definitions retained from the [source guide](../../lectures/lecture_05_socket-api.md). Source classifications and metadata are in the [overview](README.md).

## Glossary

| Term | Expansion or category | Meaning |
|---|---|---|
| Active Close | Active Connection Close | The endpoint that calls `close()` (or `shutdown(SHUT_WR)`) first to initiate TCP connection teardown by sending the initial `FIN` segment, normally entering `TIME_WAIT` during orderly teardown. |
| Active Open | Active Connection Open | The action performed by a client calling `connect()` to initiate a TCP three-way handshake by sending a `SYN` segment. |
| `AF_INET` | Address Family Internet (IPv4) | Socket address family constant specifying 32-bit IPv4 network protocols. |
| `AF_INET6` | Address Family Internet v6 (IPv6) | Socket address family constant specifying 128-bit IPv6 network protocols. |
| `AF_XDP` | Address Family eXpress Data Path | Linux socket family for XDP-directed user-space packet I/O; zero-copy depends on driver support and operating mode. |
| API | Application Programming Interface | A set of functions, data structures, and conventions through which an application program interacts with the operating system kernel or libraries. |
| Big-Endian | Big-Endian Byte Order | Memory ordering in which the most significant byte (MSB) of a multi-byte integer is stored at the lowest memory address; the standard for **network byte order**. |
| C10K | Concurrent 10,000 Connections Problem | Coined by Dan Kegel (1999): the architectural challenge of handling 10,000 simultaneous client connections on a single server, exposing the $O(N)$ scaling limits of `select()`. |
| C10M | Concurrent 10 Million Connections Problem | Formulated by Robert Graham (2013): the challenge of handling $10^7$ concurrent connections where the OS kernel itself (syscalls, interrupts, copies) becomes the bottleneck. |
| CGI | Common Gateway Interface | Standard interface for web servers to execute external programs (compute cycles) on behalf of client requests. |
| Connected Descriptor | Connected Socket Descriptor (`connfd`) | A brand-new file descriptor returned by `accept()` for each accepted connection, dedicated to full-duplex I/O with that specific client. |
| CSRG | Computer Systems Research Group | Research group at UC Berkeley responsible for developing BSD Unix, the sockets API (4.2BSD), and the public BSD Networking Releases (`Net/1`, `Net/2`, `Net/3`). |
| Daemon | Daemon Process | A long-running background server process, typically started at boot time by the `init` process (PID 1), that waits for client requests on a well-known port. |
| DNS | Domain Name System | Worldwide distributed database that maps human-readable Internet domain names (e.g., `www.cs.cmu.edu`) to binary IP addresses. |
| DPDK | Data Plane Development Kit | A framework of user-space libraries and poll-mode NIC drivers that bypass the normal kernel packet-processing path for high-throughput, low-latency packet processing. |
| `EINTR` | Interrupted System Call | POSIX `errno` value returned when a slow blocking system call (such as `read`, `write`, or `accept`) is interrupted by a caught signal before completion. |
| EOF | End of File | Condition signaled when `read()` returns `0` on a TCP socket, after preceding buffered data is consumed, indicating an orderly end to the peer's sending stream (assuming a nonzero read request). |
| Ephemeral Port | Ephemeral (Short-Lived) Port | A temporary local port number automatically assigned by the kernel to a client socket (upon `connect()`) for the duration of a communication session. |
| `epoll` | Event Poll | Linux readiness-notification mechanism with persistent interest and ready lists that replaces `select()` and `poll()` for high-concurrency servers. |
| `EWOULDBLOCK` | Operation Would Block | Error code (often aliased to `EAGAIN`) returned immediately when an I/O system call on a non-blocking socket cannot complete without putting the process to sleep. |
| `FD_SETSIZE` | File Descriptor Set Size | Compile-time constant (typically `1024`) defining the maximum number of file descriptors that an `fd_set` bitmask can hold for `select()`. |
| File Descriptor | Unix File Descriptor | A small non-negative integer returned by the kernel to represent an open file, pipe, device, or network socket. |
| Half-Close | TCP Half-Close | The ability of one end of a TCP connection to terminate its output stream (by sending a `FIN` via `shutdown(sockfd, SHUT_WR)`) while still remaining open to receive data from the peer. |
| IANA | Internet Assigned Numbers Authority | Organization responsible for coordinating global IP addressing and managing the allocation of well-known ($0\text{--}1023$) and registered ($1024\text{--}49151$) port numbers. |
| `INADDR_ANY` | IPv4 Wildcard Address (`0.0.0.0`) | Constant used in `bind()` allowing a server on a multihomed host to accept incoming connections destined to any of the host's local network interfaces. |
| Incarnation | Connection Incarnation | A new TCP connection established later using the exact same 4-tuple (source IP, source port, destination IP, destination port) as a previously closed connection. |
| `io_uring` | Asynchronous I/O Ring | Modern Linux asynchronous system call and I/O interface using shared memory submission and completion rings between user space and kernel space. |
| `kqueue` | Kernel Event Queue | Scalable event notification interface introduced in FreeBSD/BSD systems as a high-performance replacement for `select()`. |
| Listening Descriptor | Listening Socket Descriptor (`listenfd`) | A socket converted from active to passive via `listen()`, created once for the lifetime of a server to accept incoming client connection requests. |
| Little-Endian | Little-Endian Byte Order | Memory ordering in which the least significant byte (LSB) of a multi-byte integer is stored at the lowest memory address (e.g., x86/x86_64 architectures). |
| MOM | Message-Oriented Middleware | High-level messaging libraries or brokers (such as ZeroMQ, NATS, or Aeron) that abstract away raw byte-stream sockets and deliver framed messages with system-specific delivery guarantees. |
| MSL | Maximum Segment Lifetime | An assumed upper bound on TCP segment lifetime; historical values vary and are not a wall-clock bound derived from TTL. |
| Multihomed Host | Multihomed Network Host | A host with two or more network interfaces and multiple IP addresses. |
| Network Byte Order | Big-endian for the relevant protocol fields | The standard byte ordering used for multi-byte binary integers in TCP/IP protocol headers and socket address structures, defined as **big-endian**. |
| Passive Close | Passive Connection Close | The endpoint that receives a `FIN` segment from its peer first while in the `ESTABLISHED` state, transitioning to `CLOSE_WAIT`. |
| Passive Open | Passive Connection Open | The sequence performed by a server (`socket` $\to$ `bind` $\to$ `listen`) to prepare a socket to accept incoming client connection requests. |
| `RST` | TCP Reset Segment | A TCP segment sent immediately when something is wrong (e.g., a `SYN` arrives for a port with no listening server, a connection is aborted, or a segment arrives for a closed/nonexistent connection). |
| Short Count | Short Read/Write Count | When `read()` or `write()` on a stream socket transfers fewer bytes than requested—not an error, but a normal consequence of kernel socket buffer limits or the amount of data currently available; packet boundaries are not exposed. |
| Socket | Network Socket | To the kernel, an endpoint of communication; to an application, an integer file descriptor used to read from and write to the network. |
| Socket Pair | TCP Connection Socket Pair | The 4-tuple `{client_IP:client_port, server_IP:server_port}` that identifies a TCP connection within its networking context. |
| `SOCK_DGRAM` | Datagram Socket Type | Socket type constant used with `socket()` to create a connectionless, unreliable UDP datagram endpoint. |
| `SOCK_STREAM` | Stream Socket Type | Socket type constant used with `socket()` to create a connection-oriented, full-duplex stream interface; TCP is the usual Internet example, while SCTP has distinct message semantics. |
| `TIME_WAIT` | TCP `TIME_WAIT` State | State entered by the endpoint performing the active close for a duration of $2 \times \text{MSL}$ in the ordinary orderly-close model, allowing final-ACK retransmission and old-duplicate expiry; actual reuse rules vary. |
| Value-Result Argument | Value-Result Pointer Argument | A pointer parameter (such as `socklen_t *addrlen` in `accept()`) where the caller supplies buffer capacity and the kernel returns the actual address length, which can exceed that capacity on truncation. |
| Well-Known Port | IANA Well-Known Port | Port numbers in the range $0\text{--}1023$ reserved and assigned by IANA to conventional services (port 0 is reserved) (e.g., port `7` for Echo, `13` for Daytime, `21` for FTP, `25` for SMTP, `80` for HTTP). |
| Wrapper Function | Error-Handling Wrapper Function | Convention (popularized by W. Richard Stevens) of capitalizing the first letter of a system call (e.g., `Socket()`, `Bind()`, `Writen()`) to encapsulate the call and its error check in one place. |
| XDP | eXpress Data Path | Linux framework that runs verified eBPF programs directly inside the network device driver before packets enter the kernel networking stack. |
| XTI | X/Open Transport Interface | An alternative transport-layer API (historically competing with BSD sockets) sitting between user processes and the kernel transport stack. |
| ZeroMQ | ZeroMQ (ØMQ) | A brokerless, high-performance asynchronous messaging library that provides message framing and communication patterns (`REQ/REP`, `PUB/SUB`, `PUSH/PULL`) over a socket-like API. |
