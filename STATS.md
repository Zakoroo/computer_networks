# Content statistics

Measured: 22 October 2026. Recompute affected rows when source files, lessons, questions, or mappings change. These counts describe content, not exam scope or readiness for scored practice.

## Repository

| Measure | Count | Source |
| --- | ---: | --- |
| Lecture guides | 11 | `lectures/lecture_*.md` |
| Quiz files | 15 | `quizzes/quiz_*.json` |
| Quiz questions | 585 | Sum of each quiz's `questions` array |

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
| Questions listing related lessons | 50 |

Flag categories overlap; do not sum them as separate question populations.

| Flag | Questions |
| --- | ---: |
| `coverage_gap` | 34 |
| `wording_issue` | 16 |
| `cross_topic` | 11 |
| `supplementary_source` | 5 |

Compute coverage from `question_links[].coverage_status` and flags from `question_links[].flags`, rather than trusting cached manifest totals alone. Count nonempty `related_lesson_ids` arrays for related-lesson questions; they do not distinguish required reading from optional context. Count Mermaid fences in the numbered lesson files, excluding support documents.
