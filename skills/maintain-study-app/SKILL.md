---
name: maintain-study-app
description: Maintain or diagnose this repository's local study application, including reader behavior, generated content, personal storage, and launcher integration. Use release-study-app for native packaging and release workflows, and prepare-lecture for teaching-content changes.
---

# Maintain the study application

Use [ARCHITECTURE.md](../../app/ARCHITECTURE.md) to locate the affected module and its contracts. Read only the relevant sections; [Making changes](../../app/ARCHITECTURE.md#making-changes) maps tasks to source files and checks. [App commands](../../app/README.md#implementation-and-checks) and the [tools index](../../tools/README.md) provide existing entry points. Current results belong in [STATUS.md](../../STATUS.md) and [verification.md](../../app/verification.md), not this skill.

The root [user guide](../../README.md) explains downloads and study controls in plain language. Keep its descriptions and the in-app control help aligned with actual behavior when those features change.

## Preserve the study contracts

- Canonical lessons, quizzes, and manifests feed the generated catalogue. Rebuild ignored app content instead of editing generated copies. Personal tags, flags, progress, and attempts belong in IndexedDB, separately from course records.
- Keep the fixed `http://127.0.0.1:4173/` origin. A different host, port, or browser profile has different storage. Diagnose with an isolated test profile or an exported backup; do not clear a user's study data to make a test pass.
- Preserve stable IDs, question fingerprints, answer-key snapshots, backup compatibility, and unmatched history. Unknown lesson dependencies remain unknown. Personal filtering and labels do not silently change canonical flags or ordinary/review scoring eligibility.
- Keep Markdown renderer component identities stable. Successful first rendering does not prove scrolling stability: unchanged diagram/SVG nodes, document height, and viewport position must survive actual progress saves and read-mark updates. Do not disable scroll saving to conceal a remount problem.
- Navigation effects must wait for content/profile readiness without depending on every profile update. Exercise cold startup when changing loading, anchors, or resume behavior.

## Diagnose before choosing a change

For stale or absent teaching content, inspect the generated catalogue identity and builder output before changing UI logic. `npm test` regenerates content through `pretest`; direct Vitest invocation bypasses it. A pre-existing local build can hide a clean-checkout prerequisite failure.

For diagram failures, inspect the browser trace, failed network requests, page errors, and the figure's `data-status`. Distinguish an in-progress render from an errored module download or a remounted component before changing timeouts. For local asset refusals, inspect the Python server as well as the renderer; Vite preview does not exercise the packaged server's MIME, connection-queue, or lifecycle behavior. The implemented decisions are in [Extension boundaries](../../app/ARCHITECTURE.md#extension-boundaries).

## Verify the affected behavior

Use the architecture's task/check map and [tool checks](../../tools/README.md#verification) to select focused verification. Rebuild before browser checks; identify whether they exercised Vite, the Python source server, or an extracted native download. Use the [release workflow](../release-study-app/SKILL.md) when native-package behavior is part of the request.

When a regression is reproducible, demonstrate failure before the fix and verify the actual observable behavior afterward. For persistence changes, check reopen/restore compatibility; for feedback changes, check correct/incorrect results and applicable content notices; for reader changes, check rendered diagrams and saved scroll positions. Retain relevant assertions when correcting test setup.

Record the tested build/server, browser/platform, skips, and remaining uncertainty in the verification report. UI acceptance, explanation approval, content validation, and package/desktop acceptance are separate results. Update the current handoff without advancing unrelated features or lecture work.
