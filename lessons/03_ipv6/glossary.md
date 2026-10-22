# IPv6 glossary

Retained from [lecture 03](../../lectures/lecture_03_ipv6.md#glossary).

| Term | Full name | Meaning |
|---|---|---|
| 464XLAT | — | Client-side and provider-side translation allowing IPv4 applications to use an IPv6-only access network. |
| 6to4 | — | Historical automatic IPv6-over-IPv4 tunnelling scheme using `2002::/16`. |
| AFRINIC | African Network Information Centre | Regional Internet Registry serving Africa. |
| Anycast | — | One destination address assigned at several locations, with routing selecting one instance. |
| APNIC | Asia Pacific Network Information Centre | Regional Internet Registry serving the Asia-Pacific region. |
| ARIN | American Registry for Internet Numbers | Registry serving the United States, Canada, and parts of the Caribbean. |
| ARP | Address Resolution Protocol | IPv4 mechanism for discovering a neighbour's link-layer address; IPv6 uses Neighbor Discovery. |
| BGP | Border Gateway Protocol | Routing protocol exchanging reachability between networks, including anycast routes. |
| CDN | Content delivery network | Distributed infrastructure delivering content from multiple sites. |
| CGN | Carrier-grade NAT | Provider-operated address translation sharing public IPv4 addresses among customers. |
| CIDR | Classless Inter-Domain Routing | Prefix-based address allocation and routing, written using slash notation. |
| CLAT | Customer-side translator | Stateless translator converting legacy IPv4 traffic into IPv6 in 464XLAT. |
| DAD | Duplicate Address Detection | Tests whether another interface on the link already uses a tentative IPv6 address. |
| DHCPv6 | Dynamic Host Configuration Protocol for IPv6 | Supplies addresses and/or other configuration, depending on the operating mode. |
| DNS | Domain Name System | Maps names to records such as IP addresses. |
| DNS64 | DNS synthesis for NAT64 | Synthesizes IPv6 address answers for IPv4-only destinations. |
| Dual stack | — | Running both IPv4 and IPv6 on the same hosts or network. |
| EUI-64 | Extended Unique Identifier, 64-bit | Identifier format; modified EUI-64 can derive an IPv6 interface ID from a MAC address. |
| Extension header | — | Optional header linked after the IPv6 base header to carry additional functions. |
| GUA | Global unicast address | IPv6 address intended for globally unique, Internet-routable use. |
| Happy Eyeballs | — | Connection algorithm that tries alternative addresses with controlled concurrency to avoid long delays. |
| Hextet | — | Informal name for a 16-bit IPv6 address group, written with up to four hexadecimal digits. |
| IANA | Internet Assigned Numbers Authority | Coordinates global Internet identifier registries and top-level address allocations. |
| ICMPv6 | Internet Control Message Protocol for IPv6 | Carries errors and control messages, including Neighbor Discovery and MLD. |
| IEEE | Institute of Electrical and Electronics Engineers | Standards organization associated with Ethernet and identifier formats. |
| IETF | Internet Engineering Task Force | Develops Internet protocol standards. |
| IGMP | Internet Group Management Protocol | IPv4 host-to-router multicast membership protocol. |
| IID | Interface identifier | Usually the low 64 bits of an IPv6 unicast address on an ordinary LAN. |
| IoT | Internet of Things | Network-connected devices such as sensors and embedded systems. |
| IPsec | Internet Protocol Security | Mechanisms providing IP-layer authentication and/or encryption when configured. |
| IPv4 / IPv6 | Internet Protocol version 4 / version 6 | IP versions with 32-bit and 128-bit addresses respectively. |
| ISP | Internet service provider | Operator supplying connectivity and often address prefixes. |
| LACNIC | Latin America and Caribbean Network Information Centre | Regional Internet Registry serving Latin America and much of the Caribbean. |
| LAN | Local area network | A local network, commonly an Ethernet or Wi-Fi subnet. |
| LLA | Link-local address | Address usable only on its own link, normally beginning `fe80::`. |
| MAC | Media access control | Link-layer addressing, commonly a 48-bit Ethernet address. |
| MLD | Multicast Listener Discovery | ICMPv6 mechanism for reporting and querying IPv6 multicast membership. |
| MTU | Maximum transmission unit | Largest packet size a link can carry without fragmentation at that layer. |
| Multicast | — | Delivery to members of an addressed group. |
| NA | Neighbor Advertisement | Neighbor Discovery message providing information about an interface and its address. |
| NAT | Network Address Translation | Rewrites addresses, often also transport identifiers, between address realms. |
| NAT64 | IPv6/IPv4 translation | Allows IPv6 traffic to reach IPv4 destinations through a translator. |
| ND / NDP | Neighbor Discovery / Neighbor Discovery Protocol | IPv6 mechanisms for finding routers and neighbours and checking reachability. |
| NIC | Network interface card | Hardware interface connecting a device to a network. |
| NS | Neighbor Solicitation | Message used for neighbour discovery, reachability checks, and DAD. |
| PLAT | Provider-side translator | Stateful NAT64 component in the provider network in 464XLAT. |
| Prefix length | — | Number of leading address bits identifying a network or route. |
| RA | Router Advertisement | Router message advertising prefixes, router lifetime, and configuration information. |
| RDNSS | Recursive DNS Server | RA option advertising DNS resolver addresses. |
| RFC | Request for Comments | Internet technical publication series containing standards and other documents. |
| RIPE NCC | Réseaux IP Européens Network Coordination Centre | Registry serving Europe, the Middle East, and parts of Central Asia. |
| RIR | Regional Internet Registry | Organization allocating and registering Internet number resources within a region. |
| ROAD | Routing and Addressing | Early IETF effort addressing routing growth and address exhaustion. |
| RPKI | Resource Public Key Infrastructure | Infrastructure authenticating resource holdings and route-origin authorizations. |
| RS | Router Solicitation | Host request for routers to send an advertisement. |
| SID | Segment identifier | IPv6 identifier selecting a segment endpoint or behaviour in SRv6. |
| SLAAC | Stateless Address Autoconfiguration | Host-generated addressing based on advertised prefixes and locally generated interface IDs. |
| Soft state | — | Operational state maintained or refreshed over time, whose loss may disrupt ongoing work. |
| SRH | Segment Routing Header | IPv6 routing extension header carrying a segment list. |
| SRv6 | Segment Routing over IPv6 | Steering and processing packets using IPv6 segment identifiers. |
| Subnet ID | Subnet identifier | Bits used by a site to select a subnet within its delegated prefix. |
| TCP / UDP | Transmission Control Protocol / User Datagram Protocol | Common transport protocols carried over IP. |
| TTL | Time to live | IPv4 packet lifetime field; IPv6 uses Hop Limit. |
| ULA | Unique local address | IPv6 address for local or limited inter-site use rather than global Internet routing. |
| Unicast | — | Delivery to one addressed interface. |
| Zone index | — | Interface or scope identifier disambiguating a scoped address, often written after `%`. |

[Topic overview](README.md)
