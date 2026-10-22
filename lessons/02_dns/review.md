# DNS question review

This queue preserves the original quiz and answer key. Only `lesson_id` and `flags` have been populated. DNS Q001–Q031 are one-based positions in quiz 02; stable IDs and fingerprints are in [manifest.json](manifest.json).

## Flags

| Flag | Meaning |
| --- | --- |
| `coverage_gap` | The networking guides 01–06 do not teach enough to answer the question as written. This is not a judgment about exam scope. |
| `wording_issue` | The keyed option needs a technical qualification or includes an unsupported assertion. |
| `duplicate_question` | Another source entry asks the same question with reordered options. Both are retained. |

No native DNS question requires supplementary † material or a cross-topic assignment. The source's supplementary CNAME/MX restriction subsection is preserved even though no supplied DNS question depends on it.

## Coverage gaps after checking lectures 01–06

A related keyword or example is insufficient answer coverage. The checks included the DNS guide, routing DHCP, IPv6 address configuration, TCP/UDP, the socket API, and SDN forwarding primitives; algorithms lectures were excluded.

| Question | Closest DNS lesson | Evidence and missing teaching |
| --- | --- | --- |
| Q015: If a zone includes a wildcard record *.example.com, what happens when a query for unknown.example.com is made? | [DNS headers and resource records](06_headers_and_records.md) | Wildcard synthesis and its applicability rules are not taught in lectures 01–06. SDN wildcard packet matches and socket wildcard addresses are different mechanisms. |
| Q022: Which of the following best distinguishes DNS redirection from HTTP redirection? | [CNAME chains and alias restrictions](09_aliases_and_cname.md) | The guide distinguishes CNAME indirection from HTTP redirection and parses URL hosts, but does not teach HTTP redirection responses or their effect on the displayed URL. Lectures 01–06 do not complete that comparison. |
| Q026: What makes DNS susceptible to amplification attacks? | [Forgery and cache poisoning](13_forgery_and_cache_poisoning.md) | The security section teaches answer forgery and cache poisoning, not small-query/large-response amplification, open resolvers, or reflection. No explanation of DNS amplification was found in lectures 01–06. |
| Q030: What does Dynamic DNS (DDNS) enable in conjunction with DHCP? | [Replication, SOA, and cache lifetimes](08_replication_and_caching.md) | The DNS guide discusses changing addresses, and routing teaches DHCP address allocation and resolver settings, but neither explains DHCP-triggered DNS record updates. Lectures 01–06 do not teach DDNS integration. |

Q022 has partial DNS-side support: lesson 01 parses the host within a URL and lesson 09 distinguishes CNAME indirection from an HTTP redirect. That does not teach what an HTTP redirection response does to the displayed URL. Q030 has partial DHCP-side context in [routing lesson 06](../01_routing/06_dhcp.md), but address allocation and supplying a DNS server address do not establish DDNS updates. Neither is counted as fully covered or assigned an invented lesson.

## Wording and answer-key review

| Question | Finding | Evidence |
| --- | --- | --- |
| Q012 | A CNAME requires following a target name, but not necessarily another network query: the target address may be in the same answer or cache. The keyed option overstates the extra lookup. | [Supporting reference](https://www.rfc-editor.org/rfc/rfc1034.html#section-3.6.2) |
| Q014 | NXDOMAIN denotes nonexistence. Its negative-cache lifetime is limited by the lesser of SOA.MINIMUM and the SOA RR TTL, not SOA.MINIMUM alone; the keyed option omits that condition. | [Supporting reference](https://www.rfc-editor.org/rfc/rfc2308.html#section-5) |
| Q019 | Predicting the transaction ID can help forge a reply, but the resolver also checks addresses, ports, and the question. ID prediction alone is not sufficient. | [Supporting reference](https://www.rfc-editor.org/rfc/rfc5452.html#section-9.1) |
| Q028 | The receiving resolver can observe and potentially log queries, but whether it profiles users or lacks consent is a provider-policy claim, not a required property of public DNS. | [Supporting reference](../../lectures/lecture_02_dns.md#who-still-sees-the-query) |

These four questions remain mapped because their lessons teach the relevant mechanism and its qualification. Review the wording before scored practice; no answer key was silently corrected.

Q023 describes the ordinary TTL-cache model. Refresh is needed on demand after expiry; expiry is not necessarily an instruction to immediately send a query or to contact the same server directly. The lesson makes that model explicit without claiming that all resolver policies are identical.

## Duplicate source entries

Q001 and Q002 have identical stems and answer meanings, with reordered options. They are grouped as `dns-purpose-001` and assigned to lesson 01. Keep their separate identities and indices; deleting one would shift later indices and requires deliberate manifest maintenance.

## Additional required lessons versus background

All 27 mapped DNS questions have no additional required lesson beyond the primary lesson for the supported answer concept. Optional background links are explicit and must not become completion gates automatically. Coverage gaps and wording issues remain separate from this dependency decision.

| External question | Primary lesson | Additional required lesson | Reason |
| --- | --- | --- | --- |
| Routing Q036 | [18. Anycast DNS](18_anycast_and_resilience.md) | None | The same service address can reach a route-selected root instance without changing client configuration. |
| Routing Q037 | [08. Replication and caching](08_replication_and_caching.md) | [18. Anycast DNS](18_anycast_and_resilience.md) | Replica-update delays and route-selected instances together explain potentially differing answers during updates. |

External questions keep their `cross_topic` flags and `covered_in_other_topic` status in the [canonical routing manifest](../01_routing/manifest.json). Their actual primary IDs and required reading are now populated, replacing the old awaiting-lessons action. Other routing cross-topic questions remain unchanged.

[Topic overview](README.md) · [Full assignments and evidence](manifest.json)
