# DNS glossary

Retained from [lecture 02](../../lectures/lecture_02_dns.md#glossary).

| Term | Full name | Meaning |
|---|---|---|
| A | Address record | Associates a name with an IPv4 address. |
| AAAA | IPv6 address record | Associates a name with an IPv6 address. |
| Anycast | — | Several sites offer the same IP destination; routing selects a reachable instance. |
| ARPA | Address and Routing Parameter Area | Infrastructure domain containing, among other things, reverse DNS namespaces. |
| AS | Autonomous system | Network or group of networks under a common routing administration. |
| Authoritative server | — | Server that serves the configured data for a zone. |
| BGP | Border Gateway Protocol | Interdomain routing protocol used to distribute routes, including anycast routes. |
| Cache poisoning | — | Insertion of forged DNS data into a resolver's cache. |
| CNAME | Canonical name | Record associating an alias with another domain name. |
| Delegation | — | A parent zone assigns responsibility for a child zone to named servers. |
| dig | Domain Information Groper | Command-line tool for inspecting DNS questions, answers, and referrals. |
| DNS | Domain Name System | Distributed database mapping hierarchical names to typed values. |
| DNSKEY | DNS public key record | Publishes a key used to verify DNSSEC signatures. |
| DNSSEC | DNS Security Extensions | Adds authentication of DNS data and protection against undetected alteration. |
| DoH | DNS over HTTPS | Carries DNS exchanges over HTTPS. |
| DoQ | DNS over QUIC | Carries DNS over encrypted QUIC connections. |
| DoT | DNS over TLS | Carries DNS over a dedicated TLS connection. |
| DS | Delegation signer | Parent-zone record containing a digest identifying a child's DNSSEC key. |
| EDNS | Extension Mechanisms for DNS | Extensions including support for larger DNS messages over UDP. |
| FQDN | Fully qualified domain name | Complete name reaching the root, conventionally written with a final dot. |
| FTP | File Transfer Protocol | Historically used to download the shared hosts file. |
| Glue | — | Address records supplied by a parent to help reach delegated name servers. |
| HTTP / HTTPS | Hypertext Transfer Protocol / HTTP Secure | Web protocols; HTTPS protects exchanges using TLS. |
| ICANN | Internet Corporation for Assigned Names and Numbers | Organization coordinating Internet identifiers and root KSK rollover communications. |
| ICMP | Internet Control Message Protocol | Carries network control/error messages, including responses used by traceroute. |
| IN | Internet class | The usual DNS record class, numeric value 1. |
| IP | Internet Protocol | Network-layer addressing and packet delivery protocol; IPv4 and IPv6 are its major versions. |
| ISP | Internet service provider | Network operator that may also provide a recursive resolver. |
| KSK | Key signing key | DNSSEC key used to sign a zone's DNSKEY record set. |
| Label | — | One component of a DNS name, such as `stanford` in `www.stanford.edu.` |
| MX | Mail exchange | Record identifying a domain's incoming mail servers and their preferences. |
| Negative caching | — | Remembering that a name or requested record does not exist. |
| NS | Name server | Record identifying an authoritative name server for a zone. |
| Oblivious DoH | Oblivious DNS over HTTPS | Separates the relay seeing the client from the target decrypting the query. |
| PKI | Public key infrastructure | Mechanisms for establishing trust in public keys. |
| PTR | Pointer | Record mapping a reverse DNS name to a domain name. |
| QNAME | Query name | Domain name for which a DNS question requests data. |
| QNAME minimisation | — | Sends each authoritative server only the name information needed at that stage. |
| QUIC | — | Encrypted transport supporting independent streams without TCP's cross-stream delivery blocking. |
| Recursive resolver | — | Server that obtains a final DNS result for a client, consulting other servers as needed. |
| Referral | — | Response directing a resolver to servers responsible for a more specific zone. |
| RFC | Request for Comments | Publication series containing Internet standards and related technical documents. |
| Root hints | — | Initial list of root server names and addresses used to bootstrap resolution. |
| RPKI | Resource Public Key Infrastructure | Routing security infrastructure, used in the lecture as an adoption comparison. |
| RR / RRset | Resource record / resource record set | A typed DNS datum / records sharing an owner name, class, and type. |
| RRSIG | Resource record set signature | DNSSEC signature over an RRset, with a validity interval. |
| SIP | Session Initiation Protocol | Signalling protocol used, for example, in Internet telephony. |
| SOA | Start of authority | Record holding zone administration, version, and timing information. |
| SPF | Sender Policy Framework | DNS-published policy authorizing sending hosts for an email domain identity. |
| SRV | Service location record | Specifies a service's target host, port, priority, and weight. |
| TCP | Transmission Control Protocol | Reliable byte-stream transport; DNS adds message-length framing. |
| TLD | Top-level domain | Domain immediately below the root, such as `se`, `com`, or `edu`. |
| TLS | Transport Layer Security | Protects a connection's confidentiality and integrity and authenticates its endpoint. |
| Trust anchor | — | Public key or equivalent trusted information configured before validation begins. |
| TTL | Time to live | For DNS, a record's cache lifetime in seconds; IP TTL is a different field. |
| TXT | Text record | Carries application-defined text strings in DNS. |
| UDP | User Datagram Protocol | Datagram transport commonly used for conventional DNS exchanges. |
| URL | Uniform Resource Locator | Identifies a resource using components such as scheme, host, and path. |
| VoIP | Voice over IP | Voice communication over IP networks. |
| Zone | — | Administratively served portion of the DNS namespace, bounded by delegations. |
| ZSK | Zone signing key | DNSSEC key commonly used to sign ordinary zone RRsets. |

[Topic overview](README.md)
