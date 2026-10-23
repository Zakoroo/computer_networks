# Content statistics

Measured: 22 October 2026. Recompute affected rows when source files, lessons, questions, or mappings change. These counts describe content, not exam scope or readiness for scored practice.

For generated charts and tables, see [PROGRESS.md](PROGRESS.md). Its generator computes counts directly from canonical manifest records and quizzes; this document is maintained separately.

## Repository

| Measure | Count | Source |
| --- | ---: | --- |
| Lecture guides | 11 | `lectures/lecture_*.md` |
| Quiz files | 15 | `quizzes/quiz_*.json` |
| Quiz questions | 585 | Sum of each quiz's `questions` array |
| Topics converted to lessons | 6 | Internet Routing, DNS, IPv6, TCP, Socket API, and SDN manifests |
| Numbered lessons | 155 | Sum of prepared manifests' `lessons` arrays |

## Networking answer explanations

Measured from the six networking manifests and their canonical quizzes on 22 October 2026. Explanations are authored and checked, awaiting user approval (`explanation_status: reviewed`). The first local application now supports review through its graphical interface; see [app/README.md](app/README.md). Wording findings overlap the linked-question population and do not all indicate incorrect keys.

| Topic | Linked questions | Linked questions with explanations | Linked questions with wording flags |
| --- | ---: | ---: | ---: |
| Internet Routing | 66 | 66 | 9 |
| DNS | 27 | 27 | 4 |
| IPv6 | 21 | 21 | 5 |
| TCP | 21 | 21 | 3 |
| Socket API | 47 | 47 | 20 |
| SDN | 28 | 28 | 4 |
| **Total** | **210** | **210** | **45** |

All 210 linked networking questions now have sourced explanations, including the 45 with wording findings. The 89 unlinked questions retain empty explanations and existing gaps. Original keys, wording, options, tags, mappings, and flags are unchanged. Existing lesson-conversion approvals remain independent of the new explanation review. Explanation quality requires checking the actual teaching, not just a nonempty field. See the [explanation standards](APP_PLAN.md#content-prerequisite-answer-explanations).

## Internet Routing

Source: [manifest.json](lessons/01_routing/manifest.json), checked against the routing quiz and lesson files.

| Measure | Count |
| --- | ---: |
| Lessons | 23 |
| Mermaid diagrams in numbered lessons | 28 |
| Questions accounted for | 100 |
| Mapped to routing lessons | 60 |
| Supported in another topic | 6 |
| Partially supported in another topic | 5 |
| Insufficient coverage in available guides | 29 |
| Questions listing related lessons | 52 |
| Cross-topic questions now linked to DNS lessons | 2 |
| Cross-topic questions now linked to IPv6 lessons | 3 |
| Cross-topic questions now linked to TCP lessons | 1 |
| Actual primary lesson assignments | 66 |
| External IPv6 questions using routing as primary lesson | 1 |
| Related-lesson entries still awaiting dependency classification | 49 |

Flag categories overlap; do not sum them as separate question populations.

| Flag | Questions |
| --- | ---: |
| `coverage_gap` | 34 |
| `wording_issue` | 16 |
| `cross_topic` | 11 |
| `supplementary_source` | 5 |

Compute coverage from `question_links[].coverage_status` and flags from `question_links[].flags`, rather than trusting cached manifest totals alone. Count nonempty `related_lesson_ids` arrays for related-lesson questions; they do not distinguish required reading from optional context. Count Mermaid fences in the numbered lesson files, excluding support documents.

## DNS

Source: [manifest.json](lessons/02_dns/manifest.json), checked against quiz 02 and the DNS lesson files. Native totals below exclude external routing questions.

| Measure | Count |
| --- | ---: |
| Lessons | 20 |
| Mermaid diagrams in numbered lessons | 11 |
| Native questions accounted for | 31 |
| Native questions mapped to DNS lessons | 27 |
| Insufficient coverage in networking guides 01–06 | 4 |
| Native questions with additional required lessons | 0 |
| Native questions with optional background lessons | 24 |
| Lessons without native DNS-quiz questions | 7 |
| External routing questions linked to DNS lessons | 2 |
| External questions requiring an additional lesson | 1 |

Flag categories overlap with coverage/mapping counts. Duplicate entries are retained and counted individually.

| Flag | Native questions |
| --- | ---: |
| `coverage_gap` | 4 |
| `wording_issue` | 4 |
| `duplicate_question` | 2 |

Compute dependency counts from nonempty `required_lesson_ids` and `optional_lesson_ids` arrays. External questions remain counted in their source topic, with canonical assignments referenced through `external_question_links`. The two routing links do not add questions to the repository total or change routing coverage categories.

## IPv6

Source: [manifest.json](lessons/03_ipv6/manifest.json), checked against quiz 03 and the lesson files. Native counts exclude the three referenced routing questions.

| Measure | Count |
| --- | ---: |
| Lessons | 25 |
| Mermaid diagrams in numbered lessons | 13 |
| Native questions accounted for | 30 |
| Native questions mapped to IPv6 lessons | 20 |
| Native questions supported by a routing primary lesson | 1 |
| Partially supported in another networking topic | 2 |
| Insufficient coverage in networking guides 01–06 | 7 |
| Native questions without a primary lesson | 9 |
| Native mapped questions with additional required lessons | 3 |
| Native mapped questions with optional background | 19 |
| Native gap entries with unresolved dependency classification | 9 |
| Lessons without native IPv6 quiz assignments | 16 |
| External routing questions now linked to IPv6 lessons | 3 |

The partial-support and insufficient-coverage groups together produce nine coverage-gap flags. Wording flags overlap those groups; they must not be added to obtain a distinct question total. Cross-topic links remain canonical in their source quiz and are counted once.

| Flag | Native questions |
| --- | ---: |
| `coverage_gap` | 9 |
| `wording_issue` | 9 |
| `cross_topic` | 3 |

IPv6 Q004 requires lesson 05 in addition to lesson 03 to evaluate the mixed-notation option. Q012 uses routing's fragmentation lesson and additionally requires IPv6 lesson 17. Q024 uses IPv6 lesson 01 and additionally requires lesson 19. Unclassified gap dependencies are not treated as empty requirements. No native question depends on hidden-slide supplementary material; the guide reports no hidden slides.

## TCP

Source: [manifest.json](lessons/04_tcp/manifest.json), checked against quiz 04 and the lesson files. Native counts exclude the externally referenced Routing Q049.

| Measure | Count |
| --- | ---: |
| Lessons | 25 |
| Mermaid diagrams in numbered lessons, all retained from the source | 13 |
| Native questions accounted for | 29 |
| Native questions mapped to TCP lessons | 21 |
| Partially supported in another networking topic | 1 |
| Insufficient coverage in networking guides 01–06 | 7 |
| Native questions without a primary lesson | 8 |
| Native mapped questions with additional required lessons | 0 |
| Native mapped questions with optional background | 20 |
| Native gap entries with unresolved dependency classification | 8 |
| Lessons without native TCP quiz assignments | 10 |
| Supplementary archived lessons | 3 |
| External routing questions linked to TCP lessons | 1 |

| Flag | Native questions |
| --- | ---: |
| `coverage_gap` | 8 |
| `wording_issue` | 6 |
| `supplementary_source` | 3 |
| `cross_topic` | 1 |

Flags overlap coverage categories. Q017/Q018/Q029 use the archived variant comparison; their name mentions elsewhere are insufficient. Q027 has partial socket-guide background and remains unassigned. The primary lessons already teach the supported keyed distinctions, so optional study context is not labelled mandatory extra reading. Routing Q049's unmarked TCP buffering support does not require a supplementary-source flag and is counted only in its original quiz.

## Socket API

Source: [manifest.json](lessons/05_socket_api/manifest.json), checked against quiz 05 and the lesson files. User-approved on 22 October 2026. No external question assignments were added.

| Measure | Count |
| --- | ---: |
| Lessons | 42 |
| Mermaid diagrams in numbered lessons, all based on the source | 11 |
| Source Mermaid blocks unchanged | 5 |
| Source diagrams with label/layout repairs | 6 |
| C code blocks retained exactly | 26 |
| Native questions accounted for | 80 |
| Native questions with socket API primary lessons | 47 |
| Partially supported in another networking topic | 1 |
| Insufficient coverage in networking guides 01–06 | 32 |
| Native questions without a primary lesson | 33 |
| Native mapped questions with additional required lessons | 12 |
| Native mapped questions with optional background | 46 |
| Native gap entries with unresolved dependency classification | 33 |
| Lessons without native socket API quiz assignments | 18 |
| External questions newly assigned to this topic | 0 |

| Flag | Native questions |
| --- | ---: |
| `coverage_gap` | 33 |
| `wording_issue` | 40 |
| `cross_topic` | 1 |

Flags overlap; mapped questions with defective keys are not ready for scored practice. Shared readiness, bounded queues, and partial-write reasoning can be taught without an API-specific tutorial, while pollfd flags, epoll trigger/registration rules, and socket-option details remain gaps where required. Q046 has only partial background in TCP's archived Nagle timeline. No mapped native question depends on hidden-slide supplementary material; the guide reports no hidden substantive slides. Question text, options, keys, and manual tags are preserved; sourced explanations are now authored for the 47 linked questions.

## SDN

Source: [manifest.json](lessons/06_sdn/manifest.json), checked against quiz 06 and the lesson files. User-approved on 22 October 2026. No external question assignments were added.

| Measure | Count |
| --- | ---: |
| Lessons | 20 |
| Mermaid diagrams in numbered lessons, all based on the source | 5 |
| Source Mermaid blocks unchanged | 1 |
| Source diagrams with label repairs | 4 |
| Native questions accounted for | 29 |
| Native questions with SDN primary lessons | 28 |
| Insufficient coverage in networking guides 01–06 | 1 |
| Native questions without a primary lesson | 1 |
| Native mapped questions with additional required lessons | 3 |
| Native mapped questions with optional background | 26 |
| Native gap entries with unresolved dependency classification | 1 |
| Lessons without native SDN quiz assignments | 7 |
| External questions newly assigned to this topic | 0 |

| Flag | Native questions |
| --- | ---: |
| `coverage_gap` | 1 |
| `wording_issue` | 5 |

Flags overlap: Q027 has both a coverage gap and a wording issue, while Q007/Q015/Q021/Q028 are mapped with wording flags. Q014/Q015/Q025 require additional lessons. The guide does not teach switch failure modes after controller disconnection, so supplementary specification evidence does not turn Q027 into lecture coverage. Routing Q011/Q070 remain gaps despite related TCAM context. Source teaching, question text/options/keys, and manual tags are preserved; sourced explanations are now authored for the 28 linked questions. Diagram label differences are documented in the topic verification report.
