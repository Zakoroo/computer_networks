# First application verification

Checked on 23 October 2026 against content commit `ec60efc`. This report describes the first local implementation; it does not approve answer explanations or establish exam coverage.

The user subsequently reported testing all implemented features and passing inspection, including the answer-feedback and diagram-scrolling fixes. This is user acceptance of the application behavior, separate from the automated checks below and from approval of explanation content. The implementation is described in [ARCHITECTURE.md](ARCHITECTURE.md).

## Implemented milestone

The local application provides a complete read → answer → feedback → continue → save/reopen → export/restore session. The catalogue contains all six networking topics, 155 lessons, and 299 canonical questions. Ordinary practice initially selects 165 linked questions without wording findings. The 45 linked wording findings and 89 unlinked questions remain available outside ordinary scoring.

The roadmap retains all lessons. Question assignments use their actual primary lesson, including external-topic assignments, without duplicate records. Required, optional, and unclassified supporting reading remain distinct. Personal tags, flags, priorities, deferral, and practice criteria persist separately from source content. Attempts retain the question fingerprint, answer version, key snapshot, and original option indices. Read marks remain separate from quiz results.

## Checks and evidence

- `npm run build`: TypeScript compilation and production build pass. The catalogue builder reuses canonical fingerprint/assignment checks and preserves the original question fields. The dependency lockfile records tested versions. Vite still emits a bundle-size advisory for the Markdown/math and Mermaid dependencies; diagrams load on demand. This is a local build, not a published deployment.
- `npm test`: 15 tests pass for include/exclude precedence, canonical cross-topic identity, source-relative navigation, complete/prerequisite-aware reading order, resume selection, exact-set scoring, key-version history, personal overlays, storage transactions, backup validation, and unmatched history.
- `python3 -m unittest discover -s tools/tests`: 18 tests pass, including three new catalogue tests for original learner-field preservation, scaffolding removal without teaching/code loss, unknown dependency retention, and deterministic content identity.
- Browser checks: the seven existing Playwright checks and the new scrolling regression pass against the production build using installed Chromium. The initial study/backup flows were also checked through the Python launcher. They verify concealed answers before submission, feedback afterward, read/tag/flag persistence after reload, backup export and restore into a fresh browser context, restored page position, invalid-backup refusal without changing current data, filtered-session feedback, tag removal, reading-only lessons, cross-topic placement, review-mode key findings, local math/code/reference rendering, diagram enlargement/Escape, mobile navigation, all content-flag feedback, and scrolling stability described below.
- All **81 Mermaid diagrams in numbered lessons render** in Chromium. The complete diagram browser test blocks external network requests and records no outside requests or page errors. TCP-06's window block diagram, Socket API-08's conversion panels, and SDN-12's flow-table illustration were inspected in screenshots at desktop and 390 px widths; the page does not overflow horizontally at the inspected narrow widths. The fitted TCP window is small on a phone; enlargement provides a scrollable view. Native mobile navigation is hidden when closed.
- The Python launcher serves the built app at `http://127.0.0.1:4173/` with `--no-browser` during testing. A second launcher refuses an occupied port instead of selecting another origin. Automatic desktop browser opening was not exercised in this environment.
- `git diff --exit-code -- lectures quizzes lessons` passes: canonical content, keys, explanations, tags, manifests, and preparation/explanation approval metadata are unchanged by app work. The generated app catalogue/build and browser-test artifacts are ignored.
- `python3 tools/generate_progress.py --check` passes; content counts and preparation stages have not changed. Documentation links and whitespace are checked separately with the repository link helper and `git diff --check`.

## Existing findings and limits

During the user's local trial, diagrams were reported to flicker while scrolling and change the page height. The initial render checks did not cover stability during scroll-driven state updates. The subsequent fix and regression are recorded below; the user has accepted the corrected behavior.

`python3 tools/validate_content.py --baseline HEAD` retains four existing strict preservation findings: the intentional source-text/diagram label/layout repairs in Socket API and SDN. It also retains the warning for 49 legacy related-question entries without required/optional classification. No new content-preservation finding was introduced, and these checks were not disabled. Their semantic review is in the topic verification reports. Rendering those diagrams successfully in the app does not make their source blocks verbatim again.

The app is ready for the user's local trial, including explanation review in context. Explanations still have `explanation_status: reviewed` and await user approval. Review-mode feedback preserves known key qualifications; source corrections remain a separate task.

Browser automation used Chromium only. All numbered-lesson diagrams were rendered, but every diagram's label geometry has not been individually inspected at every viewport. Keyboard/native-dialog behavior and representative responsive views were checked; this is not a complete assistive-technology or cross-browser audit. Browser data remains tied to the local origin/profile; clearing browser storage can erase personal records, so export remains necessary.

Packaged downloadable distribution, explicit reading-focus routes, named saved roadmaps, richer attempt-history browsing, accounts/synchronization, desktop wrappers, and algorithms content remain future work. See [README.md](README.md) for launch commands and [APP_PLAN.md](../APP_PLAN.md) for agreed scope.

## Answer-feedback follow-up

On 23 October 2026, quiz submissions gained explicit Correct/Incorrect headings with check/cross icons. Correct options are green; a selected incorrect option and its verdict are red. Text labels identify the user's selection and the correct answer, so color is not the only signal. At the user's request, the same presentation applies across all flags. A separate status notice describes every original content flag and explains that results compare with the original key. Wording/key review questions also show an explicit qualification beside the verdict; review attempts stay outside ordinary scoring. Answer keys and scoring eligibility are unchanged.

The production build and four focused feedback browser tests passed, covering both outcomes for each of the five content-flag categories, visibility of all applicable notices on questions with several flags, reset/concealment before another submission, matching and differing review-mode selections, read/save/restore, and cross-topic/reading-only behavior. Computed option/banner colors were checked; screenshots of ordinary correct/incorrect feedback and a flagged correct result with its qualification were visually inspected. Scoring/storage logic was unchanged. The user accepted this feedback behavior before requesting the diagram fix.

## Diagram scrolling follow-up

Scroll-progress saves update the personal profile and rerender the surrounding interface. Markdown previously defined fresh renderer functions on every render. React treated the new code-block renderer as a different component, removed its diagram subtree, and discarded the SVG before drawing it again. This explains the repeated height changes and scrollbar jumps. The fix gives code-block/table renderers stable module-level identities, memoizes source-aware links, and memoizes the Markdown body so unchanged content skips unrelated updates. Diagram source changes and normal document navigation still render through the existing path; scroll saving remains enabled.

The regression failed before the fix: the original diagram/SVG was disconnected and loading was observed during a progress save. After the fix, it passes for TCP-06 (block), Socket API-08 (flowchart), and SDN-15 (sequence). For each, three scroll positions are verified against the actual persisted IndexedDB fraction, while a mutation observer checks that original diagram/SVG nodes stay connected and never return to loading. Document height and viewport scroll position remain unchanged through each save. A read-mark update also preserves the diagrams. The test starts at a settled learning-goals anchor so the separate one-time resume operation is outside the measurement.

The seven other browser checks pass, including all 81 diagram renders, content navigation, diagram enlargement, responsive views, study/backup flows, and all-flag answer feedback. The production build and 15 app tests pass. These automated checks used Chromium; the user subsequently reported passing feature inspection. Source lessons, quizzes, answer keys, metadata, and statistical counts are unchanged by this fix.

## Architecture documentation

[ARCHITECTURE.md](ARCHITECTURE.md) was checked against the current builder, launcher, types, views, model, persistence, controls, and Markdown renderer. It separates the implemented design from proposed extensions and links common changes to their source files and relevant tests. Documentation links and whitespace checks pass. All three Mermaid diagrams were rendered with the app's current renderer at desktop and narrow widths in an isolated browser context, with no page errors or horizontal page overflow; screenshots were inspected. The quiz lifecycle uses a horizontal layout to keep opposing transition labels apart. No runtime or course-content changes were made for this documentation task; application test suites were not rerun.
