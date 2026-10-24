# Repository tools

Run Python commands from the repository root. Each listed Python CLI supports `--help`; inspect that before inventing flags or rewriting a helper. Content tools use the standard library. Native builds also need the pinned packaging environment and working Tkinter described in [packaging instructions](../packaging/README.md).

Choose the workflow relevant to the request: [prepare a lecture](../skills/prepare-lecture/SKILL.md), [maintain the app](../skills/maintain-study-app/SKILL.md), or [prepare/test a release](../skills/release-study-app/SKILL.md). Detailed commands stay in those workflows' linked references.

## Content tools

| Command | Purpose | Files/effects |
| --- | --- | --- |
| [query_quizzes.py](query_quizzes.py) | Filter questions by identity, lesson role, flags, tags, coverage, or text | Read-only; networking scope and compact pagination by default. `--details` exposes answers/evidence; `--json` supports automation. |
| [validate_content.py](validate_content.py) | Check prepared topics, links, fingerprints, assignments, and source preservation | Read-only. `--topic` limits the report; `--baseline` checks preserved quiz content/keys against a Git revision. Static checks do not prove teaching sufficiency or rendered readability. |
| [generate_progress.py](generate_progress.py) | Generate content progress charts/tables | Writes root `PROGRESS.md`; `--check` checks freshness without writing. Does not update approval states or `STATS.md`. |
| [scaffold_topic.py](scaffold_topic.py) | Create an isolated topic draft from a source guide/quiz | Requires `--topic` and a new `--output` directory. Optional `--plan` supplies lesson shells. Does not register a prepared topic or edit curated quizzes. |

For query semantics and scaffold plans, use the [lecture skill's references](../skills/prepare-lecture/SKILL.md). Keep curated quizzes; local extraction/merge utilities are not a safe replacement for content maintenance.

## Application and packaging tools

| Command | Purpose | Files/effects |
| --- | --- | --- |
| [build_app_content.py](build_app_content.py) | Join canonical manifests, quizzes, and lesson Markdown into the app catalogue/source downloads | Writes ignored `app/public/content/` by default; `--output` changes the destination. Preserves canonical files. Called by the app's content/build/dev/pretest scripts. |
| [serve_study.py](serve_study.py) | Serve the built or bundled interface at the fixed loopback origin | Starts a local server and normally opens a browser. `--headless --no-browser` is for automation; `--gui` previews native controls; `--check-gui` opens/closes them diagnostically. `--stop-file` is headless-only. |
| [check_release_content.py](check_release_content.py) | Compare validator results with the explicit [release baseline](../packaging/content-findings.json) | Read-only. Prints known findings and fails on differences; success does not erase the strict validator's known errors. |
| [package_study.py](package_study.py) | Prepare shared web assets or build a native package | `--prepare-web` inventories an existing build and collects npm notices. Native `--mode onedir`/`release` writes artifacts/metadata/checksums and build work directories; defaults to release mode. Requires clean matching sources unless deliberately making a dirty local prototype. |
| [test_packaged_study.py](test_packaged_study.py) | Extract and test an actual platform download | Requires matching `--asset` and `--metadata`; optional `--report` writes JSON evidence. Starts/stops its own executable outside the checkout; `--gui` checks controls and `--browser` runs Playwright against that executable. Fails on an occupied origin. |
| [assemble_study_release.py](assemble_study_release.py) | Collect the complete set of verified native candidates | Reads `--packages` and `--reports`; writes a new `--output` directory with downloads, aggregate checksums, build info, and release notes. Optional `--create-draft` calls GitHub and requires the matching tag/CI environment; it does not publish. |

For launch/build/test commands use [app/README.md](../app/README.md). For packaging prerequisites, platform-specific extraction, workflow triggers/artifacts, and publication use [packaging/README.md](../packaging/README.md). Package paths in examples must match the current version and target; do not copy old prototype paths as evidence for a new build.

## Shared modules and wrappers

- [content_data.py](content_data.py) supplies the canonical loading, identity, and fingerprint rules used by the other tools. Import those rules instead of implementing another question join.
- [run_packaged_study.mjs](run_packaged_study.mjs) is the internal Playwright process wrapper, not a standalone CLI with `--help`. The packaged test helper sets its executable environment; it launches from a temporary directory with an empty command search path and stops only its own process. Packaged checks use study port 4173. Normal local browser checks own a Vite preview on 5174, separate from development on 5173. Both modes refuse to reuse an existing server.
- [network_study.spec](../packaging/network_study.spec) is the native builder's PyInstaller input; the Python packaging tool supplies its configuration.

## Verification

| Changed area | Existing checks |
| --- | --- |
| Content conversion/mappings | Topic validator and the [lecture workflow](../skills/prepare-lecture/SKILL.md); semantic review remains separate. |
| Content/query/catalogue tools | Python [content-tool](tests/test_content_tools.py), [query](tests/test_query_quizzes.py), and [catalogue](tests/test_app_content.py) tests cover different contracts. |
| Launcher or package helpers | `test_launcher.py` and `test_packaging.py`, followed by native checks when runtime/platform behavior changed. Launcher tests use loopback sockets; the window check skips without Tkinter/display support. |
| App model/storage | `npm test` from `app/`; its pretest hook regenerates the catalogue, without needing an earlier build. |
| Reader or user flows | Build first, then the relevant Playwright checks in [app/README.md](../app/README.md#implementation-and-checks). Identify the server and browser used. |
| Native downloads | The extracted-download helper, with final package bytes and matching metadata; see [packaging checks](../packaging/README.md#test-an-extracted-download). |

Run the complete Python suite with `python3 -m unittest discover -s tools/tests`. For a focused module, add `-p test_launcher.py` (or the relevant test filename). Tests use temporary fixtures; launcher/browser checks also start local processes. Native GUI tests require Tkinter and a display, or Xvfb on headless Linux. Do not install system packages merely to validate a documentation-only edit.

For documentation-only work, check changed links/anchors and command help, validate changed skills with the skill-creator validator when available, run `python3 tools/generate_progress.py --check`, and finish with `git diff --check`. Record checks and skips in the relevant verification report. Re-run application/native suites when runtime behavior changes, not just because their documentation was linked.
