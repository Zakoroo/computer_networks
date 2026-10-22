# Query local quizzes

Run `python3 tools/query_quizzes.py --help` from the repository root for the full option list. The tool reads local quizzes and final manifests only. It does not download quizzes or edit files.

## Targeted examples

```sh
python3 tools/query_quizzes.py --topic 03_ipv6 --flag coverage_gap
python3 tools/query_quizzes.py --lesson routing-03 --lesson-role primary --details
python3 tools/query_quizzes.py --requires ipv6-17 --json --details
python3 tools/query_quizzes.py --untagged --search fragmentation
python3 tools/query_quizzes.py --topic 03_ipv6 --multi-lesson --count
python3 tools/query_quizzes.py --scope all --coverage unassessed --count
```

`--topic` accepts the canonical topic ID, the quiz filename's topic portion, or its number. Networking (01–06) is the default scope; use `--scope algorithms` or `--scope all` explicitly for other inventory queries. An out-of-scope or unknown topic produces an error rather than silently showing an empty topic.

Filters combine with **AND**. Repeating a filter supplies **OR** alternatives: `--flag coverage_gap --flag wording_issue` selects either flag, while adding `--unmapped` requires an empty primary link too. Flags, tags, IDs, and coverage values match exactly. Search is a case-insensitive literal substring across the question and options. `--tag` and `--untagged` are mutually exclusive.

## Lesson links and dependency uncertainty

`--lesson` defaults to any link role: primary, required support, optional background, or legacy related context. Use `--lesson-role primary` to get assigned practice rather than all mentions. `--requires` matches only an explicitly classified additional requirement. `--multi-lesson` selects nonempty `required_lesson_ids`; it does not infer requirements from old related links.

Canonical records stay in their source topic. A routing question assigned to an IPv6 lesson appears once, with its original routing ID and quiz path. Destination `external_question_links` do not create copies. Lesson titles/paths are resolved across manifests; detail output includes supporting lesson metadata in JSON.

Absent required/optional fields remain JSON `null`, with an unclassified or unresolved dependency status. They do not become empty requirements. A question with no manifest is **unassessed**, not a confirmed gap. `--unmapped` tests the quiz's primary link only; an unmapped question can be supported elsewhere, partially covered, unassessed, or a gap.

## Identity and output

Results retain canonical `question_id`, `source_quiz`, zero-based `source_index`, and the source fingerprint. Without a manifest, `question_id` is `null`; use the explicit one-based source locator instead:

```sh
python3 tools/query_quizzes.py --id 'quizzes/quiz_04_tcp.json#Q001' --details
```

A source locator is positional, not a newly invented permanent ID. Source indices are never renumbered after filtering or pagination. The tool checks canonical fingerprints and quiz/manifest assignment agreement before returning records from selected quizzes; stale identity or conflicting metadata stops the query.

Default text output shows identity, stem, primary lesson, and flags. `--details` reveals options, zero-based correct-answer indices, explanation, rationale, review notes, and evidence. JSON output preserves multiline values and includes source/lesson/dependency metadata; options and answers still require `--details`.

`--count` returns the total before pagination (or `{"total": ...}` with `--json`). Otherwise JSON contains `total`, `offset`, `limit`, and `results`. Default limit is ten; `--limit 0` returns all matches after the offset. Sorting follows source quiz filename and original question order. No matches is a successful empty result; invalid arguments or stale data exit with code 2. Output goes to stdout and errors to stderr.
