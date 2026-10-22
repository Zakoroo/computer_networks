# TCP glossary

From the full lecture guide. Definitions and deployment assertions are retained as source text, not freshly authenticated claims. † scope is described in the [overview](README.md).

## Glossary

| Term | Full name | Meaning |
|---|---|---|
| ACK | Acknowledgment | Control message sent by a receiver to confirm the receipt of data bytes or segments. |
| AIMD | Additive Increase Multiplicative Decrease | Congestion control feedback scheme that increases the congestion window linearly during normal operation and halves it upon detecting packet loss. |
| AQM | Active Queue Management | Router-side techniques that actively monitor and manage buffer queues (by dropping or marking packets early) to prevent bufferbloat. |
| ASPA | Autonomous System Provider Authorization | Routing security standard referenced in comparison to L4S deployment (standardized and available, yet barely deployed in practice). |
| BBR | Bottleneck Bandwidth and Round-trip propagation time | Congestion control algorithm developed by Google that models the network path's bottleneck capacity and minimum delay rather than waiting for packet loss. |
| BDP | Bandwidth-Delay Product | The product of a data link's capacity and its round-trip delay ($B \times \text{RTT}$), representing the maximum amount of unacknowledged data that can be in flight on the pipe. |
| Bufferbloat | Bufferbloat | Excessive packet queueing delay caused by overly large memory buffers in network routers and switches when paired with loss-based congestion control. |
| CC | Congestion Control | Mechanisms that regulate the rate of data entering the network to prevent overloading intermediate links and routers. |
| CoDel | Controlled Delay | An AQM algorithm that drops packets based on how long they have spent waiting in a queue (sojourn time) rather than the raw number of packets in the queue. |
| CUBIC | CUBIC TCP | Standard loss-based congestion control algorithm (default in Linux) that uses a cubic function of time since the last loss event to govern window growth. |
| CWND | Congestion Window | Sender-side state variable that limits the maximum amount of unacknowledged data (in bytes or segments) a sender can have in transit across the network. |
| Demultiplexing | Transport-layer Demultiplexing | The process at the receiving host of examining transport header fields to deliver incoming segments to the appropriate application socket. |
| DevRTT | Deviation of RTT | An exponentially weighted moving average measuring the variability (mean deviation) between `SampleRTT` and `EstimatedRTT`. |
| DupACK | Duplicate Acknowledgment | An ACK that repeats the acknowledgment number of a previous ACK, sent when a receiver receives an out-of-order segment with a higher sequence number than expected. |
| ECN | Explicit Congestion Notification | Extension to IP and TCP allowing routers to mark packets in the IP header to signal impending congestion instead of dropping them. |
| ECT(1) | ECN-Capable Transport (1) | A specific two-bit codepoint in the IP header used by L4S to identify scalable traffic and separate it into a low-latency queue. |
| EstimatedRTT | Estimated Round-Trip Time | An exponentially weighted moving average of measured `SampleRTT` values maintained by a TCP sender. |
| EWMA | Exponentially Weighted Moving Average | A statistical averaging technique where the weight of older samples decreases exponentially over time. |
| FACK | Forward Acknowledgment | A 1996 extension to TCP SACK (by Mathis et al.) that explicitly tracks the highest sequence number held by the receiver to improve recovery. |
| Fast Recovery | TCP Fast Recovery | Phase entered after Fast Retransmit (in TCP Reno and later) where the sender halves the congestion window and inflates it for duplicate ACKs rather than resetting `cwnd` to $1$. |
| Fast Retransmit | TCP Fast Retransmit | Mechanism where the sender immediately retransmits a missing segment upon receiving three duplicate ACKs, without waiting for the retransmission timer to expire. |
| Flow Control | Transport Flow Control | Mechanism preventing a fast sender from overwhelming a slow receiver's socket buffer using the advertised `RcvWindow`. |
| FQ-CoDel | Flow Queue Controlled Delay | AQM discipline combining per-flow fair queueing with CoDel so that a bulk transfer flow cannot build a queue that delays interactive flows. |
| L4S | Low Latency, Low Loss, Scalable Throughput | IETF framework (RFCs 9330–9332) using dual queues and frequent, early `ECT(1)` packet marking to eliminate queueing delay for real-time applications. |
| MI | Mild Increase (Slow Start) | The initialization phase of TCP congestion control (commonly called Slow Start) where `cwnd` increases by $1\text{ MSS}$ for every ACK received, doubling every $\text{RTT}$. |
| MSS | Maximum Segment Size | The maximum amount of application-layer payload data (in bytes) that can be placed inside a single TCP segment. |
| Multiplexing | Transport-layer Multiplexing | The process at the sending host of gathering data chunks from multiple application sockets, encapsulating each with a transport header, and passing them to the network layer. |
| Pipelining | Pipelined Data Transfer | Technique (also called sliding window) allowing a sender to transmit multiple packets back-to-back without waiting for each individual packet to be acknowledged first. |
| QoS | Quality of Service | The ability of a network to guarantee or uphold a minimum level of performance, such as minimum bandwidth, low latency, and reliable delivery. |
| QUIC | QUIC Transport Protocol | A modern, encrypted transport protocol running in userspace on top of UDP that replaces TCP for web traffic (HTTP/3). |
| RcvBuffer | Receive Buffer | The total memory allocated by the receiving transport layer for a specific connection's incoming data. |
| RcvWindow | Receive Window | The amount of free, spare room currently available in the receiver's `RcvBuffer`, advertised to the sender in the TCP header. |
| RDT | Reliable Data Transfer | Protocols and mechanisms that provide guaranteed, error-free, in-order delivery of data over an underlying unreliable communication channel. |
| RTO | Retransmission Timeout | The time interval (`TimeoutInterval`) a TCP sender waits for an acknowledgment before assuming a transmitted segment was lost and retransmitting it. |
| RTT | Round-Trip Time | The time required for a small packet or segment to travel from a sender to a receiver and for the corresponding acknowledgment to return. |
| SACK | Selective Acknowledgment | TCP option allowing the receiver to acknowledge non-contiguous blocks of out-of-order data successfully received, rather than only the last cumulative in-order byte. |
| SampleRTT | Sample Round-Trip Time | A single direct measurement of the time elapsed from when a segment is passed to IP until the ACK for that segment arrives. |
| Segment | Transport Segment | The protocol data unit (PDU) exchanged between transport-layer entities, consisting of a transport header and application payload. |
| Sliding Window | Sliding Window Protocol | A mechanism that bounds the range of sequence numbers a sender may transmit without acknowledgment, advancing forward as cumulative ACKs arrive. |
| Slow Start | TCP Slow Start | Phase of TCP congestion control in which `cwnd` starts small (e.g., $1\text{ MSS}$) and grows exponentially by doubling each $\text{RTT}$ until reaching `ssthresh` or a loss event. |
| Socket | Network Socket | The software interface (door) between an application process and the end-system transport protocol. |
| ssthresh | Slow Start Threshold | A TCP state variable marking the congestion window size at which the sender transitions from exponential growth (Slow Start) to linear growth (Congestion Avoidance). |
| Stop-and-Wait | Stop-and-Wait ARQ | A basic reliable transfer protocol in which the sender transmits a single packet and waits until it receives an ACK before transmitting the next packet. |
| T/TCP | Transaction TCP | A 1994 experimental TCP extension (by Braden) designed for low-overhead request-response transactions. |
| TCP | Transmission Control Protocol | Connection-oriented, reliable Internet transport protocol providing error recovery, in-order byte-stream delivery, flow control, and congestion control. |
| UDP | User Datagram Protocol | Connectionless, best-effort Internet transport protocol that provides multiplexing and error checking without reliability, flow control, or congestion control. |

---
