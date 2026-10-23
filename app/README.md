# Network Study

A local study application for networking lectures 01–06: a complete reading roadmap, lessons followed by related questions, and a searchable question library. Personal progress, tags, flags, and priorities stay in IndexedDB in your browser. Course files stay unchanged.

For development, start with [ARCHITECTURE.md](ARCHITECTURE.md): implemented design, module map, data/storage flows, rendering decisions, and where to make common changes. [verification.md](verification.md) records checks and user acceptance; [STATUS.md](../STATUS.md) tracks current work. Launch commands are below.

## Run it

First-time setup requires Python 3.10+, Node.js 22.12+ and Internet access to install dependencies. From the repository root:

```sh
cd app
npm ci
npm run build
cd ..
python3 tools/serve_study.py
```

The launcher opens **http://127.0.0.1:4173/** in your browser. Keep the terminal running while studying; press Ctrl+C to stop. Use `python3 tools/serve_study.py --no-browser` if automatic browser opening is unavailable (for example, some WSL setups). Once built, launching needs only Python, and study content, diagram libraries, and math fonts are served locally without Internet requests.

Alternatively, run `npm run start` from `app/` to serve the existing build at the same address. For development, `npm run dev` regenerates the content and starts Vite there. Stop the other server first: the port is fixed and never silently changes. Changes to course Markdown/JSON require `npm run content` during development or `npm run build` for the production app.

Use the same browser profile and **127.0.0.1:4173** address on later launches. Using `localhost`, another port, a private browsing window, or a different browser creates a separate storage location. Use **Backup & restore** to download your personal data regularly and move it between profiles. The commands above run from the checkout. Native candidate builds and GitHub Actions workflows are now available; see [packaging instructions](../packaging/README.md) and the approved [deployment plan](../DEPLOYMENT_PLAN.md). A public downloadable release has not been published.

`python3 tools/serve_study.py --gui` shows native launcher controls when Tkinter and a desktop display are available. Packaged downloads show those controls by default: **Open study app**, **Licenses**, and **Stop and quit**. Keep that window open while studying; closing a browser tab leaves the server running. Terminal launching remains available through `--headless --no-browser`.

## What works

- Read all 155 lessons, including lessons without supplied questions. Render Mermaid diagrams, mathematics, tables, code, glossaries, references, and source-relative links. Enlarge diagrams when the fitted view is too small.
- Answer directly assigned questions in their original option order, then see sourced explanations and preserved keys. Cross-topic questions appear after their actual primary lesson, using their canonical identity once.
- See consistent Correct/Incorrect feedback with green/red options for every question, regardless of flags. A separate status notice describes coverage, wording/key review, supplementary material, cross-topic teaching, or duplicates. Results compare with the original key; known wording/key findings remain explicit beside the result, and review attempts stay outside the ordinary score.
- Track read marks separately from attempts. Ordinary practice defaults to the 165 linked questions without a wording flag. The 45 flagged linked questions and 89 coverage-gap questions remain accessible in review mode, outside the ordinary score. Coverage is not a prediction about the exam.
- Add/remove tags and revisit flags on questions and lessons; set priorities and deferral. Personal visibility overrides preserve original audit flags and do not change scoring eligibility.
- Filter practice by source topic, tags, flags, coverage, attempt/read status, and text. Inclusions within a field combine with OR; fields combine with AND; exclusions win. Clear all criteria with Reset filters. Filters leave the full reading roadmap available.
- See additional required reading, optional context, and unknown dependency classifications separately. Lesson priorities respect prerequisites. Explicit reading-focus routes and named saved roadmaps are not implemented yet.
- Save attempts, current page, reading position, and annotations locally. Export and preview a versioned backup before explicitly replacing current personal data. Invalid restores preserve existing data; unmatched history is retained.

Starting a question visit hides its answers even if it was attempted previously. Submit again to see feedback. While answering a lesson's current session, questions stay visible after submission so an “unattempted” filter cannot remove the feedback. Changing filters or navigating starts a newly computed queue. Attempt history retains the key snapshot and question fingerprint; changed questions/keys are not silently regraded.

Explanations remain agent-reviewed and await the user's review in the interface. Known wording/key findings are shown after submission. The app does not approve or correct canonical content.

## Implementation and checks

`tools/build_app_content.py` uses the existing question loader and fingerprint rules to generate ignored `public/content/` files. The app build copies them into ignored `dist/`. It validates canonical joins and assignments, preserves all question fields, and does not maintain a second editable course database. Neither generated content nor browser study data should be committed.

The interface uses React/TypeScript and Vite; IndexedDB updates are transactional, with cross-tab notifications. Markdown uses GFM/math plugins with sanitized HTML, local KaTeX fonts, and source-aware navigation. Mermaid is loaded on demand. See the primary [Vite](https://vite.dev/guide/), [react-markdown](https://github.com/remarkjs/react-markdown), and [Mermaid API](https://mermaid.js.org/config/usage.html#api-usage) documentation for the integration APIs. The lockfile records tested dependency versions; a KaTeX override keeps transitive renderers on the patched version tested here.

Keep Markdown renderer component types stable across parent updates. Code-block and table renderers live at module scope, source-aware link components are memoized, and the Markdown body skips unrelated profile updates. Defining renderers again on each render remounts diagram subtrees during scroll-progress saves, discarding SVGs and changing page height; see [React's state-preservation guidance](https://react.dev/learn/preserving-and-resetting-state#different-components-at-the-same-position-reset-state). The browser regression verifies actual saved scroll positions, preserved SVG nodes, and stable page height for block, flowchart, and sequence diagrams. Successful first rendering alone does not establish scrolling stability.

From `app/`:

```sh
npm test
npm run build
npx playwright install chromium
npm run test:browser
```

Browser installation is only needed for testing. An existing compatible Chromium can be selected with `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/absolute/path/to/chrome`. Browser tests use the production build and start/reuse the fixed local preview; close a study session before running tests against its port. Tests use isolated browser profiles, not your study data.

From the root, `python3 -m unittest discover -s tools/tests` checks the content tools and catalogue preservation. Verification evidence and limits are in [verification.md](verification.md). Application checks do not replace semantic content review or erase the existing strict diagram-source findings in the content validator.
