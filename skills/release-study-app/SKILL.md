---
name: release-study-app
description: Prepare, test, diagnose, or review this repository's native study-app packages, GitHub Actions candidates, tagged drafts, and pre-releases. Use for packaging and distribution work rather than ordinary UI maintenance or lecture conversion.
---

# Prepare and release the study application

Start with [packaging commands and workflows](../../packaging/README.md); consult [DEPLOYMENT_PLAN.md](../../DEPLOYMENT_PLAN.md) only for the relevant platform or acceptance requirement. The [tools index](../../tools/README.md#application-and-packaging-tools) identifies each helper's inputs and effects. Read [the launcher design](../../app/ARCHITECTURE.md#extension-boundaries) when changing runtime behavior.

Keep versions, commit hashes, run IDs, current platform results, and publication state in [STATUS.md](../../STATUS.md) and [verification.md](../../app/verification.md). Verify the requested run/tag/release directly instead of assuming those snapshots are current.

## Prepare compatible candidates

- Read the app version and lockfile, workflow matrices, and pinned dependencies from their maintained files. Before changing Python, check the Actions version manifest for every configured OS/architecture, not just the local machine. Check build, test, assembly, and draft jobs together; runtime pins are documented in the packaging README.
- Shared web assets and native packages must identify the same clean commit, app version, catalogue version, and web inventory. Reuse the existing builders and identity checks. `--allow-dirty` is a local-prototype option on both web preparation and packaging; dirty prototypes cannot become assembled releases.
- Preserve the fixed browser origin, bundle asset paths, explicit MIME types, pending-connection capacity, and owned-process shutdown. Cross-platform changes need native evidence; success under Vite or a source launcher does not verify a frozen download.
- Use [check_release_content.py](../../tools/check_release_content.py) for the documented content baseline. It reports existing findings; it does not make the strict validator pass or approve explanations. Investigate changed findings rather than enlarging the baseline merely to unblock CI.

## Diagnose and verify the actual download

Find the workflow run for the intended commit, then the failing job/step and its retained artifacts. A successful check workflow provides `web-dist`; runnable packages come from the separate candidate workflow. Artifact names and download locations are in [GitHub Actions](../../packaging/README.md#github-actions).

For browser failures, inspect `browser-evidence-<target>` traces and error context before assuming a rendering delay. A zero ready-diagram count can mean a failed asset request. Check the Python listener and served files when requests fail; increasing assertion timeouts cannot repair a failed download. For an actual slow startup, adjust the specific readiness condition using evidence while preserving behavioral assertions.

Run the extracted-download helper against the final asset and its matching metadata, with native controls and browser checks when those paths changed. Keep port-ownership, asset/hash, duplicate-launch, shutdown/relaunch, and diagram/scroll checks meaningful. Never reuse a user's running session as a package test server. Folder prototypes, final downloads, automated native checks, and manual [desktop checks](../../packaging/DESKTOP_CHECKS.md) establish different things.

Use the assembler to require the complete target set and matching successful reports. Signing or modifying package bytes requires testing and hashing those final bytes again.

## Work at the requested release stage

Follow [Drafts and publication](../../packaging/README.md#drafts-and-publication) for the tag/version relationship, draft workflow command, and public pre-release review. Preserve the platform downloads, `SHA256SUMS.txt`, and `BUILD_INFO.json`; those support checksum verification and build provenance. Check for pending asset deletions when reviewing the release editor.

The workflow creates an unpublished draft only on the matching existing `v<app-version>` tag. A release-candidate title alone does not set GitHub's Pre-release label. Before publication, make the notes accurate about publication state, signing, automated checks, and desktop configurations actually tested; do not infer Fedora/Arch acceptance from Ubuntu CI.

Stay within the user's requested stage and carry forward authorization already given in the session. Instructions, diagnosis, and draft review do not themselves authorize tag pushes, workflow dispatches/reruns, or public publication. When an authorized external operation fails, inspect the cause before retrying; stop if success would require changing the intended tag, overwriting a release, or publishing beyond the authorized stage.
