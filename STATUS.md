# Project status

Last updated: 22 October 2026.

This is the current handoff, not a task authorization or a substitute for inspecting Git. Operating rules are in [AGENTS.md](AGENTS.md); measured counts are in [STATS.md](STATS.md).

For charts and a quick confirmation view, see [PROGRESS.md](PROGRESS.md). Regenerate it with `python3 tools/generate_progress.py`; check freshness with `--check`.

## Completed

- The user approved, committed, and reported pushing the routing/content setup as `657236d`. The historical recovery patch was removed. That commit is the base for the DNS conversion.
- Routing lessons preserve the source guide's teaching text, Mermaid diagrams, and supplementary classifications, including material without questions. See the [topic overview](lessons/01_routing/README.md), [review queue](lessons/01_routing/review.md), and [verification report](lessons/01_routing/verification.md) for evidence and limits.
- Quiz files were renamed from `.txt` to `.json` without changing their contents during the rename. The routing manifest and active documentation references were updated.
- The gitignored local extraction script now emits `.json`; the existing merge script successfully processed the renamed quizzes. Local utility changes are not automatically part of a commit.
- Root documentation separates operating instructions, status, and statistics.
- The user approved lecture 02's 20 DNS lessons, with a glossary, references, manifest, review queue, and verification report. See the [DNS overview](lessons/02_dns/README.md) for assignments and [DNS review](lessons/02_dns/review.md) for gaps, wording issues, and duplicates.
- DNS question dependencies explicitly distinguish additional required lessons from optional background. Routing Q036/Q037 now link to the new DNS lessons; Q037 requires both replica timing and anycast.
- Networking cross-topic checks now stop at lecture 06 (SDN), as instructed by the user. Lectures 07 onward are algorithms. The original routing audit remains a historical report of its earlier scope.
- Added reusable `tools/` commands for content validation, progress generation, and isolated topic scaffolding, plus the repository workflow at [skills/prepare-lecture/SKILL.md](skills/prepare-lecture/SKILL.md). The validator replaces session-specific validation snippets; it does not establish pedagogical coverage.
- Added a generated progress report covering topic stages, question coverage, review flags, and lesson counts. Topic approval stages are independent of delivery state.
- DNS and reusable workflow tools are committed at `ee91644`, which is the base for the IPv6 conversion. Remote push state was not independently checked.
- Lecture 03 is split into IPv6 lessons with source-preservation checks, question-by-question coverage review, and separate wording findings. See the [IPv6 overview](lessons/03_ipv6/README.md), [review](lessons/03_ipv6/review.md), and [verification](lessons/03_ipv6/verification.md). Its mapped dependencies distinguish required lessons from optional context; coverage gaps leave dependencies unresolved.
- Routing Q014/Q085/Q086 now have IPv6 lesson links; Q013 remains a partial-support gap. IPv6 Q012 uses routing's fragmentation lesson with additional required IPv6 support, and remains counted in its source quiz.
- Added `tools/query_quizzes.py` for read-only local question filtering by topic, identity, lesson/link role, flags, coverage, tags, required support, and text. Output is compact by default with JSON/detail/count/pagination modes; the existing lecture skill documents the command.
- Progress charts use short topic/flag codes with adjacent legends retaining full labels and counts. The lecture skill prioritizes reusing suitable source diagrams. New diagrams are reserved for missing or seriously unusable illustrations; web image references guide their design. Type/orientation choices, compact labels, and rendered checks remain documented.
- Query filtering and diagram-readability changes are committed at `436acd7`, the base for lecture 04 preparation. Remote push state was not independently checked.
- The user approved lecture 04 and its associated changes. It is split into 25 TCP lessons, retaining the full guide and glossary, with question-by-question evidence and separate coverage/wording findings. Twenty-one of 29 native questions have TCP lesson links; eight remain coverage gaps. Six wording flags and three supplementary-source flags overlap those groups. See the [TCP overview](lessons/04_tcp/README.md), [review](lessons/04_tcp/review.md), and [verification](lessons/04_tcp/verification.md).
- Routing Q049 now links to TCP lesson 14 using its unmarked out-of-order buffering explanation; it stays canonical in routing. Routing Q047/Q048 and IPv6 Q013 remain unresolved. All six fully supported cross-topic routing questions now have lesson links.

## Open decisions and work

- Distinguish required supporting lessons from optional context for the remaining legacy routing `related_lesson_ids` entries before implementing lesson-completion gates. DNS entries and the two new external routing assignments have explicit dependency fields; older absent fields mean unclassified.
- Review flagged question wording and coverage gaps before using affected questions for scored practice. Preserve original answer keys until a correction is requested.
- Cross-topic questions with insufficient teaching or no suitable prepared lesson retain an empty `lesson_id`; the new TCP Q027 reset-attack gap has partial socket-guide background.
- Internet Routing, DNS, IPv6, and TCP have been split into lessons. All four prepared topics are user-approved. The approved lecture 04 changes and DNS approval metadata are local and uncommitted. Further topic conversion awaits the user's direction.
- The application has not been built. Manual, persisted add/remove tag functionality remains a requirement.

## Delivery and verification

The routing/content setup is committed at `657236d`; the user reported pushing it. DNS and reusable tooling are committed at `ee91644`, the approved IPv6 conversion at `7b7a172`, and query-tool/diagram-readability changes at `436acd7`. TCP conversion, its routing cross-link, DNS approval metadata, and updated reports are local and uncommitted as of this update. Remote push state for these later commits was not independently checked. No PR was created in this session. Inspect current Git state for subsequent changes.

Routing verification checked available Markdown guides, fingerprints, assignments, preserved text, and local file links. It did not independently authenticate slide visibility or historical deployment statistics, render Mermaid diagrams, or verify browser-generated heading anchors. No application test suite exists yet.

DNS verification additionally checks explicit question dependencies, external assignments, source evidence headings, and local Markdown heading slugs. See [verification.md](lessons/02_dns/verification.md) for checks and limits; diagrams were not rendered and historical deployment claims were not freshly verified.

IPv6 uses the saved validator for all affected topics and a separate semantic review of each question. Supplementary RFC checks explain selected wording defects without closing lecture gaps. Original lecture files and quiz content/keys/tags are preserved; see its verification report for limits. Progress charts are regenerated from the current canonical records.

TCP uses the same all-topic preservation and assignment checks against HEAD, plus a semantic review of its 29 questions. Its 13 original diagrams appear directly in the lessons. TCP-06 and TCP-14 use the source window and Reno figures; redundant editorial alternatives were removed. Mermaid was not rendered, and dated source deployment/status claims were not freshly authenticated. Detailed limits and review evidence are in the TCP reports.

Tool tests run with `python3 -m unittest discover -s tools/tests`. They use temporary fixtures to check source loss, fingerprint/key changes, dependencies, external assignments, live progress counts, and scaffold isolation/refusal to overwrite. All tools use Python's standard library. The repository skill also passes the skill-creator validator.

Query tests additionally check filter combinations, cross-topic roles, preserved source indices, unassessed identities, pagination/counts, stale-data rejection, opt-in answer details, and unchanged input files.

Update this file when progress or open decisions change. Record current state rather than accumulating a transcript; retain detailed evidence in the relevant topic documents.
