# Domain Name System: Architecture, Records, Trust, and Failure

**Computer Networks — EDA387/DIT663**  
**Generated:** 2026-10-20

**† Supplementary material:** Content originating exclusively from hidden PowerPoint slides. It may not be included in this year's examinable material.

DNS examples below preserve the lecture's names, addresses, and observations as illustrative snapshots, not promises about current deployments. Explicit **Technical clarification** notes distinguish corrections or necessary standards context from the lecture's simplified model.

## Glossary

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

## Table of contents

- [1. Names, URLs, and the purpose of DNS](#1-names-urls-and-the-purpose-of-dns)
- [2. Hierarchy, delegation, and resolution](#2-hierarchy-delegation-and-resolution)
- [3. Bootstrapping and glue](#3-bootstrapping-and-glue)
- [4. DNS messages and binary encoding](#4-dns-messages-and-binary-encoding)
- [5. Replication, SOA, and caching](#5-replication-soa-and-caching)
- [6. Aliases, mail, reverse lookup, and services](#6-aliases-mail-reverse-lookup-and-services)
  - [CNAME aliases and chains](#cname-aliases-and-chains)
  - [† CNAME coexistence and MX restrictions](#cname-coexistence-and-mx-restrictions)
  - [Mail exchange](#mail-exchange)
  - [Reverse lookup](#reverse-lookup)
  - [Service discovery with SRV](#service-discovery-with-srv)
  - [TXT and SPF](#txt-and-spf)
- [7. DNS load balancing](#7-dns-load-balancing)
- [8. Forgery, cache poisoning, and DNSSEC](#8-forgery-cache-poisoning-and-dnssec)
- [9. Root trust anchors and key rollover](#9-root-trust-anchors-and-key-rollover)
- [10. Query privacy](#10-query-privacy)
- [11. Anycast and failure recovery](#11-anycast-and-failure-recovery)
- [12. Practical investigation and revision](#12-practical-investigation-and-revision)
- [References and technical clarifications](#references-and-technical-clarifications)

## 1. Names, URLs, and the purpose of DNS

An application needs an address to communicate over IP, but people prefer memorable names. **DNS maps symbolic names to values**, including IP addresses, mail servers, and service information. Library functions such as `getaddrinfo()` provide applications with a name-resolution interface. In the DNS path, the system's resolver communicates with a DNS server using UDP or TCP. The function can also consult other locally configured naming sources, so calling it does not necessarily cause a DNS packet.

For example, a mail application working with `user@example.com` needs to discover where to send mail, resolve the relevant server's address, and then use TCP/IP to communicate. The lecture's basic address example is `example.com` and `93.184.216.34`. Mail-specific discovery adds the MX lookup explained later.

A URL contains more information than DNS resolves:

```text
http://user:pass@google.com:80/docs/index.html?lang=en&sort=asc#section2
```

- **Scheme:** `http`, followed by `:`. Other examples include `https`, `ftp`, `mailto`, `file`, `data`, and `irc`.
- **Authority:** introduced by `//`, here `user:pass@google.com:80`. It contains optional user information, a host, and an optional port.
- **User information:** `user:pass`.
- **Host and port:** `google.com` and `80`. DNS resolves the hostname, not the whole URL.
- **Path:** `/docs/index.html`.
- **Query:** `lang=en&sort=asc`, introduced by `?`, carries parameters.
- **Fragment:** `section2`, introduced by `#`, identifies a location within the resource.

Thus `https://www.example.com/state/city.html` uses HTTPS, host `www.example.com`, and path `/state/city.html`. A query such as `?query=URL+parsing` adds search parameters without changing the host being resolved.

### From a shared hosts file to distributed naming

Originally, a global `hosts.txt` file listed names and addresses. Adding a host involved emailing an administrator, who distributed updates every few days. The file was maintained at SRI-NIC.ARPA, historically `26.0.0.73`, and hosts downloaded updates using FTP. RFC 952 documents this older system. Windows still has a local hosts file in `C:\Windows\System32\drivers\etc` (normally named `hosts`, without `.txt`).

A single global file cannot scale comfortably: it grows with the network, names may collide, authority to change entries must be established, and dynamic addresses may change faster than distribution intervals. DNS addresses these problems through a hierarchy and distributed administration.

Its design goals are distinct:

1. **Scalability:** support enormous numbers of records, including names synthesized by software. The possible namespace grows exponentially with name length.
2. **Distributed control:** let administrators manage their own names and delegate responsibility.
3. **Fault tolerance:** keep lookups available despite server or network failures. Applications once accustomed to an always-present local hosts file can fail badly when naming becomes unavailable.

DNS has a favourable workload: records are read much more often than changed. Many updates can tolerate minutes or hours before every cache reflects them. This **loose consistency** permits aggressive caching, reducing latency and authoritative-server load. The cost is that old or incorrect answers can persist.

## 2. Hierarchy, delegation, and resolution

DNS names form a tree rooted at `.`. Top-level domains include country-code domains such as `.se`, `.uk`, and `.fr`, and generic domains such as `.com`, `.org`, and `.edu`. A **domain** is a subtree of names. A **zone** is the portion administered together, excluding subtrees delegated to other zones. A dot-separated boundary does not automatically mean a new zone.

For example, `chalmers.se` can be a zone delegated by `.se`. Its administrators can further delegate a subdomain. Each zone normally has several authoritative servers containing replicated data. Parents publish NS records telling resolvers how to find child-zone servers.

The following example shows namespace relationships with undirected lines. Boxes mark separate administrative zones; lines do not represent packet flow.

```mermaid
flowchart TD
    subgraph rootzone["Root zone"]
        root["."]
    end
    subgraph sezone["se zone"]
        se["se"]
    end
    subgraph chzone["chalmers.se zone"]
        ch["chalmers.se"]
        www["www.chalmers.se"]
        ns["ns1.chalmers.se"]
        ch --- www
        ch --- ns
    end
    subgraph uuzone["uu.se zone"]
        uu["uu.se"]
        dns["dns.uu.se"]
        uu --- dns
    end
    root --- se
    se --- ch
    se --- uu
```

The same distinction appears in the lecture's wider tree: root branches include `edu`, `com`, `gov`, `mil`, `org`, `net`, `uk`, and `fr`. Examples beneath them include Princeton and MIT, Cisco and Yahoo, NASA and NSF, ARPA and Navy, and ACM and IEEE. Within Princeton, `cs`, `ee`, and `physics` illustrate separately bounded portions, with `ux01` and `ux04` beneath `cs`. The important information is the distinction between **name hierarchy and administrative boundaries**, rather than any present-day arrangement of those organizations.

### Recursive and non-recursive queries

A **recursive query** asks a server to obtain the final result, which may be an answer or an error. A **non-recursive query** asks for information the server can supply directly, including a referral. A recursive resolver commonly performs an **iterative sequence of non-recursive queries**.

Starting with an empty relevant cache:

1. The application asks its local recursive resolver for the target name.
2. The resolver asks a root server and receives a referral to the relevant TLD.
3. It asks a TLD server and receives a referral to the domain's authoritative servers.
4. It asks an authoritative server, following any further delegations if necessary.
5. It caches the usable records and returns the result to the application.

```mermaid
sequenceDiagram
    participant C as Client
    participant R as Recursive resolver
    participant Root as Root server
    participant T as TLD server
    participant A as Authoritative server
    C->>R: Recursive query for target address
    R->>Root: Non-recursive query
    Root-->>R: TLD referral
    R->>T: Non-recursive query
    T-->>R: Child-zone referral and needed addresses
    R->>A: Non-recursive query
    A-->>R: Address answer
    Note over R: Cache records for their TTLs
    R-->>C: Final answer
```

The lecture's topology uses requesting host `cis.poly.edu`, resolver `dns.poly.edu`, and target `gaia.cs.umass.edu`, served by `dns.cs.umass.edu`. Its eight numbered arrows are the four request/response pairs above. The drawing abstracts any extra delegation steps.

Caching applies to intermediate referrals as well as final answers. After learning how to reach the relevant servers, subsequent queries under `.umass.edu` need not restart at the root while usable cached information remains. “Only the first query contacts the root” therefore depends on cache lifetime and state.

## 3. Bootstrapping and glue

### Root hints

A resolver cannot discover every server exclusively through DNS, because it first needs somewhere to send a query. A **root hints file**, called a root cache file in the lecture, supplies initial root server names and addresses. This historical excerpt illustrates the format:

```dns
.                    3600000 NS A.ROOT-SERVERS.NET.
A.ROOT-SERVERS.NET.   3600000 A  198.41.0.4
.                    3600000 NS B.ROOT-SERVERS.NET.
B.ROOT-SERVERS.NET.   3600000 A  128.9.0.107
```

Each line is a separate record. An NS line associates the root with a server name, and an A line associates that server name with an address. **These are historical examples, especially the B-root address, not a configuration to install.** Root hints provide a bootstrap destination; caching learned referrals is what reduces repeated root queries.

### The circular dependency

Suppose the `.com` parent delegates `example.com` to `ns1.example.com`. To ask that server about `example.com`, the resolver needs its IP address. But discovering the address of `ns1.example.com` would ordinarily require contacting the very zone it cannot yet reach.

**Glue breaks this dependency:** the parent supplies address records for the delegated server alongside the referral. The resolver can contact the child immediately. Glue is a role played by A or AAAA records, not a separate record type.

Similarly, the lecture delegates `stanford.edu` to `Argus.stanford.edu`. The `.edu` parent supplies Argus's address so that the resolver can reach Stanford's servers. In a referral, NS records generally appear in the **Authority** section and glue addresses in **Additional**. Not every Additional record is glue.

### One delegation showing both cases

The lecture's Chalmers example names four servers:

- `ns1.chalmers.se`, `ns2.chalmers.se`, and `ns3.chalmers.se` lie inside the delegated zone. Their bootstrap addresses need parent-side glue.
- `dns.uu.se` lies outside `chalmers.se`. Its address can be resolved through the `uu.se` delegation, avoiding that circular dependency.

This is a documented example, **not a verified current NS set**. Its value is showing both sides of the rule. An off-site server protects against loss of Chalmers' SUNET connectivity: keeping DNS available from another network can allow dependent services, including mail, to continue making useful decisions.

**Technical clarification:** a temporary DNS failure normally causes mail delivery to be retried, not immediately discarded. The sound availability argument is that independent DNS service reduces failures and delays; the stronger claim that unanswered DNS necessarily causes message loss should not be treated as an SMTP rule.

### Inspecting referrals

The lecture's historical manual walk is:

```sh
dig +norec www.scs.stanford.edu @a.root-servers.net
dig +norec www.scs.stanford.edu @a.edu-servers.net
dig +norec www.scs.stanford.edu @argus.stanford.edu
dig +norec www.scs.stanford.edu @ns1.fs.net
```

These illustrate results for `.edu`, `stanford.edu`, `scs.stanford.edu`, and finally `www.scs.stanford.edu`. The first two referrals are the lecture's glue examples. Inspect the Authority and Additional sections together to determine which addresses enable the next step. The named servers may no longer serve these roles.

For an investigation of Chalmers:

```sh
dig +trace www.chalmers.se
dig +short NS chalmers.se
dig +short DS chalmers.se
```

The first walks the hierarchy and displays referrals. The second lists server names to classify as inside or outside the delegated zone. The third asks whether the parent publishes a DNSSEC commitment to a child key. A DS answer supports a chain-of-trust investigation. **No DS does not by itself prove that the child publishes no signatures**: it may be signed without a parent-linked chain, and an empty command result must also be distinguished from a failed query.

[DNSViz for chalmers.se](https://dnsviz.net/d/chalmers.se) visualizes delegation and validation. Windows `nslookup` does not display referral details as clearly as `dig`; WSL is one way to use `dig`. Direct tracing requires outbound access to the authoritative servers, which some networks block.

## 4. DNS messages and binary encoding

### Transport and framing

Conventional DNS uses **UDP or TCP port 53**. UDP avoids establishing a stream connection for a simple exchange. The original DNS specification limits an unextended UDP DNS message to **512 bytes**. A truncated reply sets `TC`, and the client can retry using TCP.

**Technical clarification:** 512 bytes is the original DNS limit, not UDP's inherent maximum. EDNS allows a client to advertise a larger UDP payload size. Modern queries can carry an OPT pseudo-record in Additional, so the lecture's “queries have empty Answer, Authority, and Additional sections” describes a basic query rather than every modern query. See [RFC 6891](https://www.rfc-editor.org/rfc/rfc6891).

TCP supplies a byte stream, not separate messages. Each DNS message is therefore preceded by a **16-bit length**, excluding the two-byte length prefix itself.

```mermaid
block-beta
    columns 1
    length["DNS-over-TCP length prefix: 16 bits"]
    message["DNS message: length bytes"]
```

### Message sections

Queries and replies share the following organization. Blocks show order, not proportional size.

```mermaid
block-beta
    columns 1
    header["Header: 12 bytes"]
    question["Question: queried name, type, and class"]
    answer["Answer: RRs answering the question"]
    authority["Authority: authority information, including referrals"]
    additional["Additional: glue and other useful information"]
```

A basic query contains its question and no answer RRs. A reply normally repeats the question and adds appropriate records. A referral can have no final Answer while still providing useful Authority and Additional records. Authority can also contain an SOA in a negative response; it is not restricted to NS records.

### The 12-byte header

The fixed header contains six 16-bit words:

```mermaid
block-beta
    columns 1
    id["ID: 16 bits"]
    flags["Flags and codes: 16 bits"]
    qd["QDCOUNT: 16 bits — number of questions"]
    an["ANCOUNT: 16 bits — Answer RR count"]
    ns["NSCOUNT: 16 bits — Authority RR count"]
    ar["ARCOUNT: 16 bits — Additional RR count"]
```

**ID** associates a reply with an outstanding query. The second word has this original RFC 1035 layout, expressed in wire order:

```mermaid
block-beta
    columns 4
    qr["QR: 1 bit"] opcode["OPCODE: 4 bits"] aa["AA: 1 bit"] tc["TC: 1 bit"]
    rd["RD: 1 bit"] ra["RA: 1 bit"] z["Z: 3 bits"] rc["RCODE: 4 bits"]
```

Read the top row left to right, then the bottom row. The visual blocks are not to scale; the stated widths sum to 16 bits.

- **QR:** `0` is a query, `1` a response.
- **OPCODE:** operation requested; `0` means a standard query.
- **AA:** authoritative answer indication.
- **TC:** message truncation indication.
- **RD:** recursion desired, set by the requester.
- **RA:** recursion available at the responding server. Requesting recursion does not guarantee it is offered.
- **Z:** originally reserved and zero.
- **RCODE:** response status, with `0` meaning no error.

**Technical clarification:** later standards assign two of the original Z bits to AD (Authenticated Data) and CD (Checking Disabled). Also, NSCOUNT counts *all RRs in Authority*, despite the suggestive field name. The diagram intentionally preserves the original header convention.

### Resource records

The textual record form is:

```text
name [TTL] [class] type rdata
```

The **owner name** identifies what the record describes. TTL gives the cache lifetime in seconds. The class supports extensibility and is normally `IN`, numeric value `1`. The type determines how to interpret the resource data. An A record holds an IPv4 address; an NS record holds a server's name.

The lecture's example is:

```dns
stanford.edu. 1800   IN A  171.67.216.14
stanford.edu. 1800   IN A  171.67.216.16
stanford.edu. 172800 IN NS Argus.stanford.edu.
```

The address TTL is 30 minutes; the NS TTL is two days. Multiple A records at the same owner name illustrate an RRset.

The binary encoding is:

```mermaid
block-beta
    columns 1
    name["NAME: variable-length encoded name"]
    type["TYPE: 16 bits"]
    class["CLASS: 16 bits"]
    ttl["TTL: 32 bits, in seconds"]
    len["RDLENGTH: 16 bits, in bytes"]
    data["RDATA: RDLENGTH bytes, interpreted by TYPE"]
```

Fields have explicit sizes because their visual heights are not proportional. NAME may use compression. RDLENGTH describes the encoded RDATA length, not the size of the entire record.

### Names and compression

`www.stanford.edu.` has the labels `www`, `stanford`, and `edu`, followed by the empty root label. Each ordinary label is encoded as a length byte followed by that many bytes:

```text
03 www 08 stanford 03 edu 00
```

The final `00` is the zero-length root label. A label is at most **63 octets**. For ordinary ASCII hostnames, labels use letters, digits, and hyphens, without a leading or trailing hyphen. **Technical clarification:** that hostname convention is not a restriction on every DNS owner name. Service records later use underscore labels, for example. RFC 2181 distinguishes DNS names from application-specific hostname rules.

Name comparisons are case-insensitive. Thus `www.sTANford.EDu` denotes the same name as `www.stanford.edu`. Case is preserved where possible, including the question copied into a reply; this does not require every independently stored name in every response section to adopt the question's spelling.

Repeated suffixes waste space. **Name compression** replaces a suffix with a two-byte pointer to its earlier encoding in the same DNS message:

```mermaid
block-beta
    columns 2
    marker["Pointer marker: 2 bits, binary 11"]
    offset["Offset: 14 bits from message start"]
```

For a 16-bit pointer value \(p\), the offset is:

\[
\operatorname{offset}=p-\mathtt{0xC000}=p\mathbin{\&}\mathtt{0x3FFF}.
\]

The test is that the first byte's **top two bits are `11`**, not that the byte must equal exactly `0xC0`. The pointer occupies two bytes total, including that first byte. For example, `www.example.com` and `mail.example.com` can share the encoded `example.com` suffix. This saves repeated suffix bytes within a message.

## 5. Replication, SOA, and caching

Availability requires replicas in genuinely different failure locations. Stanford could, for example, arrange for MIT to serve a secondary copy of `scs.stanford.edu`. A common arrangement has one **primary** holding managed updates and several **secondaries** copying the zone. Older terminology calls them master and slave. Both primary and secondary servers can give authoritative answers.

Frequent synchronization makes changes available sooner but costs more traffic and work. Infrequent synchronization reduces overhead but leaves older data in service longer. The zone owner controls this trade-off through its **SOA record**. The primary can update this administrative record and send **NOTIFY** messages, defined in RFC 1996, to prompt secondaries to check sooner. NOTIFY is a refresh hint, not the updated zone itself.

The SOA holds administrative information, a zone version, and timers. **Additional standards context:** its serial identifies the version; refresh controls regular update checks, retry controls attempts after failure, and expire limits how long a secondary can keep serving without successful refresh. This is distinct from a resolver's TTL-based cache.

SOA data also governs **negative caching**: remembering that a name does not exist or that the requested record type is absent. Inspect it with:

```sh
dig stanford.edu SOA
```

**Technical clarification:** the SOA field called MINIMUM is not a universal lower bound on every record's TTL. For negative caching, RFC 2308 uses the lesser of SOA.MINIMUM and the SOA record's TTL. Negative cache entries expire just as positive entries do.

Three mechanisms should remain separate: **secondary refresh** updates an authoritative replica, **positive TTLs** limit reuse of existing answers, and **negative TTLs** limit reuse of absence. Updating the primary does not immediately invalidate every resolver cache.

## 6. Aliases, mail, reverse lookup, and services

### CNAME aliases and chains

A CNAME associates an alias with a canonical name:

```text
name [TTL] [IN] CNAME canonical-name
```

When resolving ordinary data through an alias, the resolver follows the CNAME target. `getaddrinfo()` supports an `AI_CANONNAME` flag for requesting canonical-name information. The lecture gives short aliases for long hostnames:

```dns
wb.scs.stanford.edu. CNAME williamsburg-bridge.scs.stanford.edu.
mb.scs.stanford.edu. CNAME manhattan-bridge.scs.stanford.edu.
```

The Yahoo example combines many aliases with infrastructure managed elsewhere:

```dns
www.yahoo.fr. 300  IN CNAME rc.yahoo.com.
www.yahoo.de. 1800 IN CNAME rc.yahoo.com.
rc.yahoo.com. 300 IN CNAME global-accelerator.dns-rc.aws.oath.cloud.
global-accelerator.dns-rc.aws.oath.cloud. 900 IN CNAME a7de0457831fd11f7.awsglobalaccelerator.com.
a7de0457831fd11f7.awsglobalaccelerator.com. 300 IN A 13.248.158.7
a7de0457831fd11f7.awsglobalaccelerator.com. 300 IN A 76.223.84.192
```

These are historical lookup results, with whitespace artifacts in the long names normalized. The country aliases converge on `rc.yahoo.com`, and the chain then reaches the provider-managed name and its addresses.

```mermaid
flowchart TD
    fr["www.yahoo.fr"] -->|CNAME| rc["rc.yahoo.com"]
    de["www.yahoo.de"] -->|CNAME| rc
    rc -->|CNAME| cloud["global-accelerator.dns-rc.aws.oath.cloud"]
    cloud -->|CNAME| aws["a7de0457831fd11f7.awsglobalaccelerator.com"]
    aws -->|A| ip1["13.248.158.7"]
    aws -->|A| ip2["76.223.84.192"]
```

This avoids updating more than 50 country-domain zones whenever infrastructure changes. A provider such as AWS, Cloudflare, or Akamai can change addresses behind its name without the customer hard-coding those addresses into every alias. Address selection can also support load balancing and geographical steering.

A name has a single CNAME target, while the ultimate target can have multiple A or AAAA records. **CNAME chaining is name indirection**, not an HTTP redirect and not an NS delegation of zone administration.

A response may legitimately contain a CNAME for the queried alias and A records for the **different owner name** reached at the end of the chain, as the visible Yahoo example already demonstrates.

<a id="cname-coexistence-and-mx-restrictions"></a>
### † CNAME coexistence and MX restrictions

A CNAME owner cannot also have ordinary records such as A, AAAA, or NS. For example:

```dns
david.com. CNAME david.stanford.edu.
```

is not a valid ordinary zone-apex arrangement: `david.com` also requires the zone's NS and SOA records. **Technical clarification:** DNSSEC-related metadata is an exception to the simplified “no other records” rule; see RFC 2181 and subsequent DNSSEC specifications.

An MX target must be a server name with address records, not a CNAME alias. The lecture uses `bad-mx.scs.stanford.edu` as a historical diagnostic example. Alias targets interfere with the expected retrieval of address information, including additional-section processing. Missing Additional data alone does not establish that mail delivery must fail, since a client can perform further address queries, but the alias target itself violates the DNS requirement.

### Mail exchange

MX records identify servers receiving mail for a domain. The email domain itself need not have an A record. The lecture contrasts an unsuccessful address lookup or `ping scs.stanford.edu` with the ability to mail staff at that domain through its MX records:

```sh
dig scs.stanford.edu MX
```

The sender obtains an MX target and then resolves that server's address. MX preferences order alternatives: **smaller numbers mean higher preference**. This separation lets an organization's mail service operate independently of its website or of any address assigned directly to its domain name.

### Reverse lookup

Forward lookup maps a name to an address. **Reverse lookup** queries a PTR record to obtain a name associated with an address. It is a separately maintained mapping, not an automatic inverse returning every alias.

For IPv4, reverse the octets and append `in-addr.arpa.`:

```text
128.30.2.121  →  121.2.30.128.in-addr.arpa.
171.66.3.9   →  9.3.66.171.in-addr.arpa.
```

The order supports delegation: the most significant address components become the higher-level suffix of the DNS name. The record form is:

```text
reversed-address.in-addr.arpa. [TTL] [IN] PTR target-name.
```

The lecture's combined example is:

```dns
tinyos.stanford.edu. CNAME sing.stanford.edu.
sing.stanford.edu. A 171.67.76.65
65.76.67.171.in-addr.arpa. PTR sing.stanford.edu.
```

Resolving `tinyos` follows an alias to `sing`; reversing the resulting address returns `sing`, not necessarily `tinyos`. IPv6 reverse mapping uses `ip6.arpa`. ARPA originally referred to the agency funding early Internet development; the infrastructure domain now expands to **Address and Routing Parameter Area**, documented in RFC 3172.

Traceroute uses increasing IP TTL values and ICMP time-exceeded responses to learn router addresses, then may use PTR lookups to display names. **IP TTL limits packet lifetime in hops; DNS TTL limits cached information lifetime in seconds.**

### Service discovery with SRV

SRV generalizes the service-location idea beyond incoming mail:

```text
_service._proto.name [TTL] [IN] SRV priority weight port target
```

- **Service:** symbolic service name, such as `_sip` for SIP-based telephony.
- **Protocol:** commonly `_tcp` or `_udp`.
- **Name:** domain to which the service belongs.
- **Priority:** lower values are preferred, as with MX.
- **Weight:** influences randomized selection among records with equal priority.
- **Port:** the service's TCP or UDP port.
- **Target:** server name whose A or AAAA records supply its addresses.

For example:

```dns
_sip._tcp.example.com. 3600 IN SRV 10 5 5060 sipserver.example.com.
```

This identifies `sipserver.example.com`, port `5060`, priority `10`, and weight `5`. Applications that implement service discovery can find changing hosts and ports without hard-coding them. The lecture also suggests:

```sh
dig _sip._tls.microsoft.com SRV
```

That command preserves its service-specific example using `_tls`; its answer is deployment-dependent.

### TXT and SPF

TXT records associate application-defined text with a name:

```text
name [TTL] [IN] TXT "text"
```

Applications can introduce conventions without changing DNS infrastructure. Uses include domain ownership verification, service descriptions, administrative notes, and email authorization policies. **Technical clarification:** arbitrary application meaning does not imply unlimited length. TXT RDATA contains one or more length-prefixed strings, each at most 255 octets, within DNS message limits.

**SPF**, Sender Policy Framework (historically “Sender Permitted From”), publishes which hosts may send mail for a domain identity. The lecture uses `dig gmail.com TXT` and this shortened historical example:

```dns
gmail.com. 3600 IN TXT "v=spf1 ip4:216.239.32.0/19 ip4:64.233.160.0/19 ip4:66.249.80.0/20 ~all"
```

The longer example adds `72.14.192.0/18`, `209.85.128.0/17`, `66.102.0.0/20`, `74.125.0.0/16`, `64.18.0.0/20`, `207.126.144.0/20`, and `173.194.0.0/16`, and ends with `?all`. These are illustrative historical policies, not Gmail configuration advice. The `/n` suffix expresses the length of the network prefix in bits.

**Technical clarification:** the lecture conflates `~all` and `?all`. RFC 7208 defines `~all` as **softfail** and `?all` as **neutral**. A matching positive `ip4` mechanism passes authorization for the checked identity. A pass does not establish that the message is trustworthy or authenticate every displayed From header. Softfail may contribute to spam handling, but the receiver decides how to treat the message.

## 7. DNS load balancing

A name can have several A or AAAA records. An authoritative server or resolver can vary their order so different clients try different addresses first. `getaddrinfo()` returns a linked list of `addrinfo` results; the lecture's model assumes applications often try the first entry. Multiple NS records similarly support availability, whereas multiple competing CNAME targets for one owner are not allowed.

A simple experiment is to repeat:

```sh
dig cnn.com
```

If the record order changes, clients that prefer the first answer may spread across servers. Caching does not necessarily prevent distribution because a cached RRset can still be returned in different orders. However, **rotation is not a guarantee of equal load**: client selection, resolver caching, and connection reuse matter. Basic round-robin DNS does not itself measure backend load or ensure that each returned server is healthy.

CNAME chains can separate ownership of aliases from management of the final addresses, as in the Yahoo example. Anycast provides a different kind of distribution: the DNS answer or destination address can remain the same while IP routing selects a physical site.

## 8. Forgery, cache poisoning, and DNSSEC

### What the original protocol lacks

Original DNS supplies neither cryptographic data-origin authentication nor query confidentiality. Plain DNS exposes names to parties observing its network path. A conventional resolver matches a reply to its outstanding request using the transaction ID, addresses, ports, and question; a matching ID alone is not the complete acceptance rule.

Those checks are not a cryptographic proof of origin. An attacker able to forge an acceptable response can insert false data into a cache. Because that cache serves many clients, the result can affect everyone using the poisoned entry until it expires or is removed.

### The Kaminsky attack pattern

The 2008 attack made repeated forgery attempts practical:

1. Trigger a lookup for a fresh name, such as `aaa1.bank.com`, so a cached answer does not prevent a new upstream query.
2. Race the legitimate response with forged replies matching the expected question and server details.
3. Guess the transaction ID and include malicious delegation information intended to redirect subsequent lookups for the zone.
4. If the attempt loses, repeat using `aaa2.bank.com` and further fresh names.

With a predictable port, a 16-bit ID has only \(2^{16}=65{,}536\) possibilities. Source-port randomization adds another uncertainty. Under an idealized full 16-bit independent port space, the combined space approaches \(2^{32}\), about 4.3 billion combinations. Real port ranges and network behaviour may provide less entropy.

This raises the cost of successful guessing. **It does not authenticate the data.** The lecture's birthday-bound wording should be read as motivation for repeated opportunities, not as an exact success-probability derivation.

### DNSSEC and the chain of trust

DNSSEC adds signed data and a way to connect it to a trusted starting point:

- **RRSIG** signs an RRset.
- **DNSKEY** publishes the verifying public key.
- **DS**, stored in the parent, contains a digest identifying a child's key.

A validating resolver begins with a configured **trust anchor**, normally the root trust anchor for the public DNS hierarchy. It validates the parent data, checks that the child key matches the authenticated DS, and uses the child's authenticated key set to validate child records.

```mermaid
flowchart TD
    anchor["Configured root trust anchor"] -->|Authenticates| rootkeys
    subgraph rootzone["Root zone"]
        rootkeys["Root DNSKEY set"] -->|Verifies signature| rootds["Signed DS for se"]
    end
    subgraph sezone["se zone"]
        sekeys["se DNSKEY set"] -->|Verifies signature| childds["Signed DS for child zone"]
    end
    subgraph childzone["Child zone"]
        childkeys["Child DNSKEY set"] -->|Verifies RRSIG| answer["Answer RRset"]
    end
    rootds -->|Matches child key| sekeys
    childds -->|Matches child key| childkeys
```

The diagram abstracts the detailed signatures within each DNSKEY set. Unlike glue, which helps locate a server, a DS record helps establish trust in a child's key. Delegation provides the hierarchy for both tasks.

**DNSSEC signs; it does not encrypt.** Records remain public. It authenticates DNS data under the trusted key hierarchy, not an arbitrary server connection and not the correctness of an administrator's configuration.

**Technical clarification:** an authenticated absence of a DS can identify an **insecure** delegation, where validation does not extend to the child. A missing or invalid signature where a secure chain requires one is **bogus**, not a harmless downgrade to insecure. Simply deleting a DS from a reply must not disable validation.

### Signing and validating are separate deployment choices

Zone owners decide whether to sign. Resolver operators decide whether to validate. Signing gives little protection to clients whose resolvers never check signatures; validation cannot authenticate ordinary unsigned data. The parties bearing deployment costs and receiving benefits differ, which complicates adoption.

The lecture describes global validation as roughly one third, with a smaller share of zones signed, and presents Sweden and neighbouring countries as relatively strong adopters. **These are undated lecture estimates, not verified statistics for 2026-10-20.** APNIC's [Sweden measurement page](https://stats.labs.apnic.net/dnssec/SE) should be read with its observation period and measurement definition; its accessible page did not expose a fresh percentage during this preparation. Measured validation capability is not automatically the percentage of every DNS query worldwide.

The institutional explanation offered is early `.se` adoption, registry incentives including discounts for signed domains, a concentrated resolver market, and public-sector requirements. A few large operators' decisions can move validation rates, whereas signing requires action across many independently administered zones. The lecture compares this incentive mismatch with RPKI, citing an undated example of roughly 67% signing versus 12% enforcement. Those figures illustrate differing adoption measures, not interchangeable current statistics.

## 9. Root trust anchors and key rollover

### The operational problem

The root **KSK** signs the root DNSKEY set, which includes the keys used to verify ordinary root-zone data. Resolvers must have trusted starting information before the hierarchy can authenticate anything else. Key rotation limits long-term exposure, exercises recovery procedures, and can support stronger cryptographic parameters.

The difficulty is distributing new trust to independently operated resolvers without a reliable global push channel, a complete operator list, or confirmation that everyone has updated.

**Dated update, checked 2026-10-20:** IANA confirms that the new root KSK began use on **11 October 2026**, with key tag **38696**. The lecture names it **KSK-2024**, replacing **KSK-2017**, and gives **11 January 2027** as the scheduled old-key revocation. It also cites ICANN's operator guidance published **11 August 2026**. Revocation remains a future scheduled milestone, distinct from the completed signing change. See [IANA's announcement](https://www.iana.org/news/2026/root-zone-begins-using-new-ksk-2026) and [ICANN's rollover information](https://www.icann.org/resources/pages/ksk-rollover-en).

### RFC 5011 automated trust-anchor updates

The central mechanism is a local state transition based on authenticated observations over time:

1. Publish the new key alongside an existing trusted key in the DNSKEY RRset, authenticated through the current trust anchor.
2. A resolver observes and validates the candidate key, then starts an **add hold-down period** instead of trusting it immediately.
3. The resolver polls again. A key that satisfies the protocol's continuing observation and validity requirements can become a trust anchor after the hold-down period.
4. Later, the old key is published with its **REVOKE** bit set and appropriate self-authentication, allowing its removal from trusted use.

The standard's add hold-down is **30 days or the original relevant DNSKEY TTL, whichever is greater**. This requires multiple validated observations; a single appearance is insufficient. See [RFC 5011](https://www.rfc-editor.org/rfc/rfc5011).

**Technical clarification:** the lecture calls this “distributed consensus by patience.” It is more precisely authenticated trust-anchor update, not a general consensus protocol. There is a publishing authority, and safety and successful adoption depend on timers, key overlap, and sufficient observations. It does not require acknowledgements from every resolver, but that does not mean it has no timing assumptions.

A resolver offline throughout the useful observation window may fail to learn the new anchor before it is needed. Once its old trust information can no longer authenticate the root key set, validation fails closed rather than silently trusting unauthenticated replacements. Recovery may require an operator or another trusted update mechanism.

### Why observability matters

The first root KSK rollover was planned for **11 October 2017** but delayed until **October 2018**. KSK-2017 had been published in advance; its name does not mean it was already the active signing key in 2017. RFC 8145 telemetry let resolvers signal their trust anchors, but the operator could not confidently distinguish genuine lack of readiness from measurement artifacts. The lecture reports completion without major incident after the delay.

This separates two questions: whether the update protocol works under its assumptions, and whether operators can determine that the deployed population satisfies those assumptions. A correct local update rule does not give anyone complete knowledge of global readiness.

Inspect the published root key set with:

```sh
dig . DNSKEY +dnssec
```

A key appearing in that output does not alone show that every resolver has adopted it as a trust anchor.

## 10. Query privacy

### Encrypted transports

DNSSEC data authentication and encrypted transport address different threats. A validated answer over plain UDP is authenticated but publicly observable on that path. An unsigned answer retrieved over HTTPS has a protected transport connection, but no DNSSEC proof connecting the answer to the zone's signing authority.

| Mechanism | Transport and usual port | Main distinction |
|---|---|---|
| DoT | TLS over TCP, 853 | DNS content is encrypted; the dedicated port makes its purpose relatively visible. |
| DoH | HTTPS, 443 | Shares web transport, making simple DNS-specific filtering harder. |
| DoQ | QUIC over UDP, 853 | Independent streams avoid TCP's cross-stream head-of-line blocking. |

The defining references are RFC 7858, RFC 8484, and RFC 9250. **Technical clarification:** “DoH is indistinguishable from web traffic” is a design motivation, not an absolute guarantee. Endpoint addresses and traffic patterns can still provide clues. Encryption protects the client-to-resolver exchange; it does not automatically encrypt every subsequent resolver-to-authoritative exchange.

Network operators may prefer DoT's visibility because they can identify and manage DNS traffic. DoH makes that control harder and can make port-based censorship less effective. This creates a trade-off between user choice and network policy.

### Who still sees the query?

An encrypted connection hides query contents from on-path observers. **The receiving resolver still sees the name**, because it must answer or resolve the question.

The lecture describes movement from ISP-provided resolution toward large public providers as a privacy and concentration trade-off. A provider may offer strong operations and privacy commitments while accumulating queries from many more users. Encryption alone does not decide which endpoint deserves trust. Claims that all ISPs or all public resolvers behave alike would go beyond the mechanism.

The useful question is: **which observer learns which information?** Network confidentiality, resolver trust, and DNSSEC authentication are separate issues.

### QNAME minimisation

Traditional iterative queries can disclose the complete requested name to each server contacted, even when a server only needs one part of it to issue a referral. RFC 9156 reduces that disclosure.

For `www.example.se`, the conceptual sequence is:

1. The root receives only what is needed to find `.se`.
2. The `.se` servers receive what is needed to find `example.se`.
3. The final authoritative server receives the complete name needed for the answer.

This reduces unnecessary information at authoritative servers. **It does not hide the original full query from the recursive resolver.** The three steps describe the minimisation principle rather than every implementation's fallback behaviour.

### Oblivious DoH

Oblivious DoH separates two observations: who sent the request, and what name it requests. The client encrypts the DNS query for a target, then sends it through a relay.

```mermaid
sequenceDiagram
    participant C as Client
    participant P as Relay
    participant T as Target resolver
    C->>P: Query encrypted for target
    Note over P: Sees client address, not DNS plaintext
    P->>T: Forward encrypted query
    Note over T: Decrypts query, sees relay address
    T-->>P: Encrypted response
    P-->>C: Forward encrypted response
```

The relay sees the client but cannot decrypt the DNS contents. The target decrypts the contents but receives the relay's connection. **Technical clarification:** this separation assumes the parties do not collude and does not eliminate every traffic-correlation risk. Oblivious DoH uses encryption *and* separation of information; it is not privacy without encryption. See RFC 9230.

## 11. Anycast and failure recovery

### Root resilience through routing

The root service has **13 named identities, A through M**, rather than only 13 physical machines. Each identity can have instances at many sites. The lecture describes more than a thousand instances globally and includes an older map with examples in North America, London, Stockholm, and Tokyo, plus replicated sites elsewhere. Its historical site counts are not a current deployment inventory.

**BGP anycast** allows multiple sites to announce the same destination prefix. Routing selects the preferred reachable site according to routing policy and topology, not necessarily physical distance. The resolver addresses the same service regardless of which instance receives its packet.

Replication provides geographic resilience, can reduce latency, and distributes query load. If a failed instance's route is withdrawn, routing reconverges and sends later traffic elsewhere. This uses the IP routing layer to support DNS availability.

**Technical clarification:** the lecture's “no timeout, no health check, clients see nothing” is an idealization. A deployment needs a way to detect service failure and withdraw an unusable route. Route convergence takes time, packets can be lost, and resolver retry behaviour remains relevant. The historical 512-byte DNS response size helped shape the 13-identity arrangement; it is not a claim that only 13 physical instances are possible.

### Three distinct failure modes

1. **Stale delegation:** a parent still refers to servers the child no longer uses. Each component can faithfully apply its local configuration while resolution fails or reaches obsolete service. Repair requires correcting the delegation and allowing cached information to expire.
2. **Expired signatures:** an RRSIG passes beyond its validity interval. A validating resolver rejects data even if the underlying address and key have not changed. Renewal and correct timing matter independently of whether the data remains useful.
3. **Poisoned cache:** a resolver that accepted forged data can continue returning it until expiry or external removal. A non-validating cache has no cryptographic evidence with which to discover the forgery.

The lesson is that a distributed system can reach an undesirable state while individual components follow their local rules. Caching, independent administration, and time-based validity make automatic recovery incomplete.

**Technical clarification:** not all these failures are locally invisible. A validator can detect expired signatures and report failure, and administrators can monitor delegation problems or flush a bad cache. What local detection may not provide is the authority or information needed to repair the underlying state. DNSSEC also prevents acceptance of many forged answers in securely validated zones, so “DNS cannot detect poisoning” is not universal.

The lecture connects this distinction to undesirable BGP equilibria, hidden IPv6 connectivity problems, TCP behaviour, and SDN control-plane bootstrapping: local protocol compliance does not by itself guarantee a desired global outcome.

## 12. Practical investigation and revision

`nslookup` supports forward queries, reverse queries, record-type selection, and choosing a server. Running it without arguments enters interactive mode. For example:

```sh
nslookup www.example.com
nslookup 171.67.76.65
nslookup www.example.com 8.8.8.8
```

The lecture's screenshot queries a local server at `127.0.0.1#53` and returns a non-authoritative answer for `www.example.com`: IPv4 `93.184.216.34` and IPv6 `2606:2800:220:1:248:1893:25c8:1946`. These historical values illustrate two address families and a resolver answer, not a current address check. A non-authoritative answer is not automatically false or insecure; it describes the responder's role for that data.

Use `dig` when you need section details, referrals, or DNSSEC inspection. Explicit DNS tools may follow a different path from an application's system resolution, so differences can reflect local hosts files, caching, or resolver settings.

A useful study procedure is:

1. Trace a name and identify each delegation, the NS records, and any glue.
2. Classify nameserver targets as inside or outside the delegated zone and explain the dependency.
3. Compare a CNAME query with an A query for the alias; distinguish intermediate names from final addresses.
4. Compare forward and reverse lookup and explain why the original alias need not return.
5. Inspect an SOA and distinguish secondary-update timers from positive and negative caching.
6. Inspect DS and DNSKEY data and distinguish publication of signatures from successful validation.
7. Identify your configured resolver and ask separately whether transport is encrypted, whether it validates DNSSEC, and who can observe the names.

Before an examination, be able to answer these mechanism questions:

- Why does aggressive caching help DNS scale, and why does it complicate repair?
- What exactly is circular in an in-zone nameserver delegation, and what does glue supply?
- Which header bit requests recursion, and which advertises its availability?
- Why is a compressed-name pointer 16 bits while its offset is only 14 bits?
- Why does a CNAME chain permit provider-managed addresses without copying them into each customer alias?
- Why does randomizing source ports mitigate forgery without authenticating data?
- Why are DNSSEC signing, DNSSEC validation, and encrypted DNS three separate decisions?
- How can a safe trust-anchor update protocol coexist with uncertainty about whether a global rollover is safe?
- Which information remains visible under DoH, QNAME minimisation, and Oblivious DoH?

## References and technical clarifications

The lecture is the principal source. The following primary references support the explicitly marked clarifications and provide further reading; dated lookup examples above remain lecture examples.

- [RFC 952 — DoD Internet Host Table Specification](https://www.rfc-editor.org/rfc/rfc952): historical hosts files.
- [RFC 1035 — Domain Names: Implementation and Specification](https://www.rfc-editor.org/rfc/rfc1035): message structure, labels, compression, and records.
- [RFC 1996 — DNS NOTIFY](https://www.rfc-editor.org/rfc/rfc1996): prompting secondary refresh.
- [RFC 2181 — Clarifications to the DNS Specification](https://www.rfc-editor.org/rfc/rfc2181): aliases, mail-exchanger targets, and general DNS-name syntax.
- [RFC 2308 — Negative Caching](https://www.rfc-editor.org/rfc/rfc2308): negative responses and SOA timing.
- [RFC 3172 — Management Guidelines for the ARPA Domain](https://www.rfc-editor.org/rfc/rfc3172): infrastructure namespace.
- [RFC 4035 — Protocol Modifications for DNSSEC](https://www.rfc-editor.org/rfc/rfc4035): validation and DNSSEC header flags.
- [RFC 5011 — Automated DNSSEC Trust-Anchor Updates](https://www.rfc-editor.org/rfc/rfc5011): adoption, revocation, and hold-down rules.
- [RFC 5321 — SMTP](https://www.rfc-editor.org/rfc/rfc5321): mail delivery and transient failures.
- [RFC 6891 — EDNS(0)](https://www.rfc-editor.org/rfc/rfc6891): extended DNS messages and UDP sizes.
- [RFC 7208 — SPF](https://www.rfc-editor.org/rfc/rfc7208): authorization semantics, neutral, and softfail.
- [RFC 7858 — DNS over TLS](https://www.rfc-editor.org/rfc/rfc7858), [RFC 8484 — DNS over HTTPS](https://www.rfc-editor.org/rfc/rfc8484), and [RFC 9250 — DNS over QUIC](https://www.rfc-editor.org/rfc/rfc9250).
- [RFC 8145 — DNSSEC Trust-Anchor Signaling](https://www.rfc-editor.org/rfc/rfc8145): observations of resolver readiness.
- [RFC 9156 — QNAME Minimisation](https://www.rfc-editor.org/rfc/rfc9156) and [RFC 9230 — Oblivious DoH](https://www.rfc-editor.org/rfc/rfc9230): reducing query disclosure.
- [IANA — Root Zone Begins Using New KSK](https://www.iana.org/news/2026/root-zone-begins-using-new-ksk-2026): 11 October 2026 signing change.
- [ICANN — Root Zone KSK Rollover](https://www.icann.org/resources/pages/ksk-rollover-en): operational guidance and milestones.
- [APNIC Labs — Sweden DNSSEC Validation](https://stats.labs.apnic.net/dnssec/SE) and [DNSViz](https://dnsviz.net/d/chalmers.se): measurement and diagnostic exercises.
