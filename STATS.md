# Content statistics

Measured: 22 October 2026. Recompute affected rows when source files, lessons, questions, or mappings change. These counts describe content, not exam scope or readiness for scored practice.

For generated charts and tables, see [PROGRESS.md](PROGRESS.md). Its generator computes counts directly from canonical manifest records and quizzes; this document is maintained separately.

## Repository

| Measure | Count | Source |
| --- | ---: | --- |
| Lecture guides | 11 | `lectures/lecture_*.md` |
| Quiz files | 15 | `quizzes/quiz_*.json` |
| Quiz questions | 585 | Sum of each quiz's `questions` array |
| Topics converted to lessons | 2 | Internet Routing and DNS manifests |
| Numbered lessons | 43 | Sum of both manifests' `lessons` arrays |

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
| Questions listing related lessons | 51 |
| Cross-topic questions now linked to DNS lessons | 2 |
| Related-lesson entries still awaiting dependency classification | 50 |

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
