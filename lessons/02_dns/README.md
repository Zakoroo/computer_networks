# 02. Domain Name System

Read a short lesson, then answer its assigned questions from [quiz 02](../../quizzes/quiz_02_dns.json). IDs Q001–Q031 refer to positions in that quiz; “Routing Q…” refers to [quiz 01](../../quizzes/quiz_01_routing.json). Reading estimates exclude practice.

The full [lecture guide](../../lectures/lecture_02_dns.md) is preserved across the lessons, [glossary](glossary.md), and [references](references.md), including material without questions. Original lectures are unchanged. Only the CNAME coexistence/MX restrictions subsection in lesson 09 inherits a † label; the rest of that lesson is unmarked.

## Lessons

| Lesson | Reading estimate | Assigned questions | Source classification |
| --- | --- | --- | --- |
| [01. Names, URLs, and the purpose of DNS](01_names_and_urls.md) | ~2 min | Q001, Q002 | Unmarked in guide |
| [02. Why distributed naming and caching scale](02_scalable_naming.md) | ~2 min | Q003, Q004 | Unmarked in guide |
| [03. Zones, delegation, and recursive resolution](03_hierarchy_and_resolution.md) | ~3 min | Q005, Q013, Q018, Q029, Q031 | Unmarked in guide |
| [04. Bootstrapping, glue, and delegation inspection](04_root_hints_and_glue.md) | ~3 min | Q007 | Unmarked in guide |
| [05. DNS transport and message sections](05_transport_and_sections.md) | ~2 min | Q008, Q024, Q025 | Unmarked in guide |
| [06. DNS headers and resource records](06_headers_and_records.md) | ~3 min | Q006, Q009 | Unmarked in guide |
| [07. Labels, name encoding, and compression](07_names_and_compression.md) | ~2 min | Q010 | Unmarked in guide |
| [08. Replication, SOA, and cache lifetimes](08_replication_and_caching.md) | ~2 min | Q011, Q014, Q017, Q023; Routing Q037 | Unmarked in guide |
| [09. CNAME chains and alias restrictions](09_aliases_and_cname.md) | ~2 min | Q012 | Mixed: CNAME/MX restrictions † |
| [10. Mail exchange and reverse DNS](10_mail_and_reverse.md) | ~2 min | None supplied | Unmarked in guide |
| [11. Service discovery, TXT, and SPF](11_srv_txt_and_spf.md) | ~2 min | None supplied | Unmarked in guide |
| [12. Round-robin DNS and address selection](12_load_balancing.md) | ~2 min | Q016 | Unmarked in guide |
| [13. Forgery and cache poisoning](13_forgery_and_cache_poisoning.md) | ~2 min | Q019 | Unmarked in guide |
| [14. DNSSEC data authentication and deployment](14_dnssec.md) | ~3 min | Q020, Q021 | Unmarked in guide |
| [15. Root trust anchors and key rollover](15_trust_anchor_rollover.md) | ~3 min | None supplied | Unmarked in guide |
| [16. Encrypted DNS and resolver trust](16_encrypted_dns.md) | ~2 min | Q027, Q028 | Unmarked in guide |
| [17. QNAME minimisation and Oblivious DoH](17_query_disclosure.md) | ~2 min | None supplied | Unmarked in guide |
| [18. Anycast DNS and routing-based recovery](18_anycast_and_resilience.md) | ~2 min | None supplied; Routing Q036 | Unmarked in guide |
| [19. Stale delegation, expired signatures, and poisoned caches](19_persistent_failures.md) | ~2 min | None supplied | Unmarked in guide |
| [20. DNS investigation and revision](20_practical_investigation.md) | ~2 min | None supplied | Unmarked in guide |

## Practice and coverage

All 31 DNS source questions are retained:

- **27** linked to DNS lessons, including the two duplicate entries.
- **4** not sufficiently explained in networking lectures 01–06: Q015 (wildcards), Q022 (HTTP redirection comparison), Q026 (amplification), and Q030 (DDNS/DHCP integration).
- **4** have wording issues, separately from coverage: Q012, Q014, Q019, and Q028.
- **2** are duplicates: Q001 and Q002 have the same stem and answer meanings with reordered options. They remain separate source entries.

No DNS-quiz question needs another topic's lesson to answer the supported concept. Each mapped DNS question has an explicit empty `required_lesson_ids` array. Optional background is listed separately in `optional_lesson_ids`; `related_lesson_ids` is their union. Lesson-level prerequisites suggest a study sequence, whereas these question-level fields specify additional reading needed for a particular answer.

Two previously reviewed routing questions now have real DNS links: Routing Q036 uses lesson 18; Routing Q037 uses lesson 08 **and requires lesson 18**. The latter combines replica-update timing with route-selected instances; differing responses during an update interval are not an inherent property of anycast. The canonical records remain in the routing manifest; this topic records external references and lists them in Practice sections.

See the [review queue](review.md) for evidence and qualifications, [manifest](manifest.json) for machine-readable links, and [verification](verification.md) for checks and limits. A mapping does not endorse an imprecise answer key. Question text, option order, correct-answer indices, explanations, and manual tags are unchanged.

## Provenance and source qualifications

Source commit: `657236d94510bebe598e374fd8a0dc106a3137f5`. The input is the existing Markdown guide, not a fresh review of the original PowerPoint. Cross-topic lookups for this task stop at lecture 06 (SDN), the end of the networking part. Lectures 07 onward belong to algorithms and are excluded.

No extension lessons were added to fill unsupported questions. Short additions naming the stub-resolver role, reasoning through TTL expiry, and qualifying CNAME lookup cost are explicitly labelled editorial clarification and cite standards. Existing technical clarifications remain part of the source text.

The following metadata and cautions are retained verbatim from the guide. In particular, its dated root-KSK update and undated adoption figures are source claims, not fresh measurements in this conversion.

**Computer Networks — EDA387/DIT663**  
**Generated:** 2026-10-20

**† Supplementary material:** Content originating exclusively from hidden PowerPoint slides. It may not be included in this year's examinable material.

DNS examples below preserve the lecture's names, addresses, and observations as illustrative snapshots, not promises about current deployments. Explicit **Technical clarification** notes distinguish corrections or necessary standards context from the lecture's simplified model.

[All topics](../README.md)
