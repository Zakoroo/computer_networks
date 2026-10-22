# Routing glossary

| Term | Meaning |
| --- | --- |
| **Adj-RIBs-In / Adj-RIBs-Out** | BGP routing information learned from, or prepared for advertisement to, peers. |
| **ARP** | Address Resolution Protocol; resolves a local IPv4 next-hop address to a link-layer address. |
| **AS / ASN** | Autonomous System / Autonomous System Number; an administratively governed routing domain / its identifier. |
| **AS_PATH** | BGP attribute identifying the AS sequence advertised for a route. |
| **ASPA** | Autonomous System Provider Authorization; signed information about authorized providers. |
| **Backbone** | Central network or routing area interconnecting other parts of a network. |
| **Bellman–Ford** | Distributed shortest-distance recurrence underlying distance-vector routing. |
| **BGP** | Border Gateway Protocol; policy-oriented inter-domain routing protocol. |
| **BGPsec** | BGP extension designed to cryptographically protect AS-path announcements. |
| **CIDR** | Classless Inter-Domain Routing; prefix notation such as `192.0.2.0/24`. |
| **Convergence** | Process of reaching a stable routing state after a change. |
| **Customer cone** | An AS and the customer ASes reachable through its downstream customer hierarchy. |
| **Datagram** | Packet forwarded independently, without an established virtual circuit. |
| **DD** | Database Description; OSPF packet summarizing link-state database contents. |
| **DF / MF** | IPv4 *Don't Fragment* / *More Fragments* flags. |
| **DHCP / DORA** | Dynamic Host Configuration Protocol / Discover–Offer–Request–Acknowledge exchange. |
| **Dijkstra** | Shortest-path algorithm used with link-state routing information. |
| **DNS** | Domain Name System; resolves names to information including IP addresses. |
| **DSCP / ECN** | Differentiated Services Code Point / Explicit Congestion Notification. |
| **eBGP / iBGP** | BGP between different ASes / BGP within the same AS. |
| **EGP / IGP** | Exterior Gateway Protocol / Interior Gateway Protocol; inter-AS / intra-AS routing. |
| **FIB / forwarding table** | Forwarding Information Base used to select an output interface or next hop. |
| **Flooding** | Disseminating routing information through neighboring routers across a defined scope. |
| **Hop** | One router-to-router forwarding step; RIP also uses hop count as a metric. |
| **IHL** | Internet Header Length; IPv4 header size expressed in 32-bit words. |
| **ICMP** | Internet Control Message Protocol; IP-related errors, control, and diagnostics. |
| **IP / IPv4 / IPv6** | Internet Protocol / versions 4 and 6. |
| **LSA / LSDB** | Link-State Advertisement / Link-State Database used by link-state routing. |
| **MAC address** | Link-layer identifier of a network interface. |
| **MED** | Multi-Exit Discriminator; BGP attribute used when comparing certain entry points. |
| **MTU / PMTUD** | Maximum Transmission Unit / Path MTU Discovery. |
| **Next hop** | Neighbor or gateway to which a packet is forwarded. |
| **NLRI** | Network Layer Reachability Information; BGP-advertised destination prefixes. |
| **OSPF** | Open Shortest Path First; link-state IGP. |
| **Packet switching** | Network model that shares links by forwarding individually delimited packets. |
| **Peering** | Interconnection where ASes exchange traffic under a negotiated policy. |
| **Prefix / prefix length** | Address range identified by common leading bits / number of such bits. |
| **PSTN** | Public Switched Telephone Network; traditional circuit-switched telephony. |
| **RIP / RIPv2** | Routing Information Protocol / its version 2; distance-vector IGP. |
| **ROA / ROV / RPKI** | Route Origin Authorization / Route Origin Validation / Resource Public Key Infrastructure. |
| **Route aggregation** | Combining contiguous prefixes into a shorter common prefix. |
| **Route hijack / route leak** | Unauthorized origination of a prefix / unintended export of a learned route. |
| **Route reflector** | BGP mechanism that distributes iBGP routing information without a full mesh. |
| **RIR** | Regional Internet Registry; allocates Internet number resources within its region. |
| **RTT** | Round-trip time, e.g., used by TCP for timing estimates. |
| **Split horizon / poison reverse** | Distance-vector loop mitigation: suppress a route toward its source / advertise it there with infinite metric. |
| **TCP / UDP** | Transmission Control Protocol / User Datagram Protocol. |
| **Transit** | Carrying traffic between networks that are not the originating or destination AS. |
| **TTL** | Time To Live; IPv4 field reduced on each router hop. |
| **Valley-free** | Conventional BGP export pattern: up through providers, optionally across a peer, then down to customers. |
| **Virtual circuit** | Packet-switching model with a setup phase and established per-flow forwarding state. |
| **Wedgie** | BGP situation with multiple stable routing configurations, including an undesirable persistent state. |

[Return to the lessons](README.md).
