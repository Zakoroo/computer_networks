# Packaging and release plan

Prepared and approved on 23 October 2026; the plan is committed at `df5b55a`. Implementation began at the user's request from that clean commit. Native packaging tools, candidate workflows, and a locally tested Linux prototype are now implemented. Windows/macOS CI runs, distribution-specific desktop acceptance, and trusted signing remain pending. No public release has been published. See [packaging/README.md](packaging/README.md) for current commands and [app/verification.md](app/verification.md#packaging-implementation) for evidence; the sections below retain the release requirements and target matrix.

The user chose all three operating systems and GitHub-hosted virtual machines for builds and testing. Docker is outside this plan. The implemented application is described in [app/ARCHITECTURE.md](app/ARCHITECTURE.md); development commands and existing evidence are in [app/README.md](app/README.md) and [app/verification.md](app/verification.md).

## Delivery model

Publish versioned application downloads through GitHub Releases. Keep source code, packaging configuration, and workflows in Git; attach compiled packages to releases. GitHub's automatically generated source archives remain source downloads, separate from our runnable packages. [GitHub Releases documentation](https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases)

The user downloads the package for their computer, extracts it where necessary, and launches Network Study. A small launcher starts the local server and opens the existing interface in the default browser. Lessons, questions, diagrams, and math fonts are included for offline study. The user's computer supplies a supported browser and normal desktop system libraries; it should not need Python, Node.js, Git, Docker, or a checkout.

Bundle the existing Python launcher, Python runtime, and prebuilt `app/dist/` with PyInstaller. Build each native package on its target OS; PyInstaller is not a cross-compiler. Prototype folder bundles first, then produce the final download formats. [PyInstaller overview](https://pyinstaller.org/en/stable/index.html), [bundle modes](https://pyinstaller.org/en/stable/operating-mode.html)

This milestone changes distribution and launcher behavior. It preserves the accepted study interface, canonical content, flags, scoring rules, and explanation-approval state. Accounts, synchronization, an embedded browser, automatic updates, and app-store installers remain deferred.

## Initial platform matrix

Support three operating systems with four native packages, so both Intel and Apple Silicon Macs have a download. The following are proposed initial validation targets, not compatibility already demonstrated by tests.

| Platform | Architecture | Build runner | Proposed desktop validation | Release asset |
| --- | --- | --- | --- | --- |
| Windows | x64 | `windows-2022` | Windows 11 x64 | `network-study-<version>-windows-x64.exe` |
| Linux | x64 | `ubuntu-22.04` | Ubuntu, Fedora, and Arch-family targets below | `network-study-<version>-linux-x64.tar.gz` |
| macOS | Intel x64 | `macos-15-intel` | macOS 15 on Intel | `network-study-<version>-macos-x64.zip` |
| macOS | Apple Silicon arm64 | `macos-15` | macOS 15 on Apple Silicon | `network-study-<version>-macos-arm64.zip` |

These explicit runner labels are available at planning time. Recheck availability when implementing; avoid an unreviewed change of baseline through `*-latest`. The Windows build VM runs a server OS, so its successful tests do not establish Windows desktop acceptance. [GitHub runner reference](https://docs.github.com/en/actions/reference/runners/github-hosted-runners)

Use a single executable for Windows and, inside the tar archive, Linux. Use a normal `.app` bundle inside each Mac ZIP. PyInstaller advises against combining a macOS windowed app with one-file mode. Preserve executable permissions and bundle symlinks through archiving and artifact transfer. Build Linux on the older supported baseline because PyInstaller does not bundle glibc; compatibility still needs testing. [PyInstaller platform guidance](https://pyinstaller.org/en/stable/usage.html), [archive and symlink guidance](https://pyinstaller.org/en/stable/common-issues-and-pitfalls.html#requirements-imposed-by-symbolic-links-in-frozen-application)

Windows/Linux ARM, older macOS versions, and Linux distributions outside the validation matrix can be added after their own builds and tests. Do not advertise them as supported by these four packages. Start browser automation with Chromium, and record manual default-browser checks on each desktop; expand browser claims only with evidence.

### Linux distribution validation

Include Fedora and Arch-based desktops in the packaging prototype. Aim to distribute the same Linux x64 archive across the following targets; an Ubuntu build alone does not establish compatibility elsewhere. Separate RPM, DEB, or pacman packages are not needed for this initial portable-download approach. Add another format or build only if observed compatibility or installation requirements justify it.

| Distribution target | Version to record | Required checks |
| --- | --- | --- |
| Ubuntu | 22.04 and 24.04 | Build-baseline and newer-desktop launch, study, persistence, and shutdown |
| Fedora Workstation | 44 x64; recheck the supported release before a later candidate | Extracted package, native launcher, default-browser opening, offline study, and lifecycle |
| Arch Linux | Fully updated installation; record test date and relevant library versions | The same downloaded package and full desktop lifecycle |
| EndeavourOS | User's other computer; record test date and system/library versions | Its own desktop checks; an Arch Linux result does not certify every derivative |

Fedora Workstation 44 is the stable download offered by the [Fedora Project](https://fedoraproject.org/workstation/download/) on 23 October 2026. The user identified EndeavourOS as the Arch-based system on their other computer. Both remain untested targets for this application. Use the [desktop checklist](packaging/DESKTOP_CHECKS.md) to record candidate-specific evidence.

Building against an older glibc makes reuse on newer systems plausible, but desktop libraries and external-browser integration still need checking. Record any remaining system-library requirements for the packaged Tcl/Tk launcher on each target. Exercise the desktop session actually used, including Wayland/X11 integration where applicable, rather than relying exclusively on headless server tests. The glibc compatibility rationale comes from [PyInstaller's Linux guidance](https://pyinstaller.org/en/stable/usage.html#making-gnu-linux-apps-forward-compatible); cross-distribution compatibility remains a test result to establish.

GitHub's standard Linux VM images are Ubuntu, with no standard Fedora or Arch runner labels in the [runner matrix](https://docs.github.com/en/actions/reference/runners/github-hosted-runners). Keep the Ubuntu native build and automated checks there. Initially run Fedora/Arch checks on separate desktop machines or VMs and attach the evidence to the candidate. Dedicated self-hosted VM runners can automate these checks later; this plan does not assume nested virtualization on GitHub-hosted machines. Docker is not required.

Keep target, tested, and advertised support distinct. Record failures explicitly and list only successful combinations in release notes. Arch-family results describe the tested system state; rerun them for later releases rather than promising compatibility with every future update.

## Launcher changes

At the start of implementation, [tools/serve_study.py](tools/serve_study.py) located `app/dist/` relative to the checkout, printed to a terminal, and stopped with Ctrl+C. It already bound to the correct fixed address and refused an occupied port. The implementation now addresses the requirements below; automated Linux evidence is recorded separately from pending desktop acceptance:

1. **Find bundled files reliably.** Resolve the packaged asset directory independently of the current working directory. Preserve source-checkout launching as well. Check that the bundled index and catalogue exist before opening the browser. PyInstaller documents bundle-relative paths in its [runtime guide](https://pyinstaller.org/en/stable/runtime-information.html).
2. **Provide visible lifecycle controls.** Add a small native launcher window showing status, version, local address, **Open study app**, and **Stop and quit**. Use Python's Tkinter as the initial implementation choice and verify its bundled Tcl/Tk support on all targets during the packaging prototype. Closing this window stops the server; closing a browser tab leaves the launcher running. Keep study content and personal controls in the existing browser interface.
3. **Start and stop predictably.** Start serving before opening the browser. Shut down the server and release the port when the launcher exits. Give startup failures a visible message instead of losing them in a hidden console. Retain `--no-browser` and provide a headless mode for automated checks, with useful exit codes and an address/readiness signal.
4. **Keep one stable origin.** Always use `http://127.0.0.1:4173/`, including packaged builds. Never select another port automatically. A second launch or unrelated process occupying the port must produce a clear notice without terminating the existing process. Initial behavior may refuse the second launch; automatic handoff is not required.
5. **Open the system browser safely.** Test the packaged launcher, including the library-search environment inherited by external desktop programs. PyInstaller identifies this as a specific [external-program launching pitfall](https://pyinstaller.org/en/stable/common-issues-and-pitfalls.html#launching-external-programs-from-the-frozen-application).

Serve only the bundled web directory on loopback. The launcher remains a static server without a course-editing or personal-data API. It should run as an ordinary user and work from a directory it cannot write to. If diagnostics require a log, place it in a per-user application location and keep personal answers and backups out of it.

## Build and test pipeline

Use GitHub Actions for validation and native packaging. Build a candidate without publishing it, then promote the tested files to a release. Workflow artifacts can carry web assets, native packages, and test reports between jobs. [GitHub artifact documentation](https://docs.github.com/en/actions/tutorials/store-and-share-data)

| Stage | Work | Required evidence |
| --- | --- | --- |
| 1. Validate the commit | Install locked dependencies; run existing Python and application tests; check generated progress and canonical preservation | Tests pass; existing content findings are identified separately |
| 2. Build web assets once | Run the current production build, which regenerates the catalogue | Validated `app/dist/`, catalogue content version, commit SHA, and file hashes |
| 3. Package natively | Each matrix job downloads that same web build, installs a pinned Python/PyInstaller toolchain, and bundles it with the launcher; configured signing/notarization runs before final archiving | Four versioned packages containing the same course content, with signing status recorded |
| 4. Test final downloads | Fresh jobs download and extract the actual distributable files, then launch them away from the checkout | Startup, content, browser flows, persistence, and shutdown checks pass on every target |
| 5. Prepare a release | Collect successful packages, hashes, build metadata, and test reports | A complete candidate set tied to one commit; no missing platform silently ignored |
| 6. Verify desktop use | Run the manual checks below against the downloaded candidate | Recorded OS, architecture, browser, results, and unresolved issues |
| 7. Publish | Attach the tested files and release notes to the matching Git tag | Release points to the tested commit and assets; download links work |

Use read-only repository-token permissions in build/check jobs. Grant release-writing permissions only to the publication job, and expose signing credentials only to trusted native release-build jobs. Pull-request jobs must work without release secrets. Select and record exact tested toolchain versions when implementing; use `npm ci` with the existing lockfile and pin packaging dependencies. Capture runner image/tool versions because a runner label alone is not a fully reproducible environment.

Run normal application checks on pull requests. Initially invoke the four-platform packaging workflow manually for a selected committed revision; it produces candidate artifacts only. After packaging is established, version-tag runs may prepare a draft release. Publishing remains an explicit maintainer action. Writing this plan does not create workflows, tags, releases, or uploads.

### Automated package checks

The current Playwright configuration starts Vite preview. Add an explicit packaged-test mode that launches the downloaded executable at the fixed address instead. Disable reuse of unrelated servers in CI, wait for readiness, and stop only the test-owned process. Never run these checks against a personal study profile.

- Run outside the checkout, including a path containing spaces. Confirm the package supplies its runtime and assets, with Python/Node unavailable to the launched process through its command search path. Inspect collected dependencies as well; GitHub runners have development tools preinstalled, so this check alone does not prove a clean desktop installation works.
- Request the bundled index, catalogue, scripts, source Markdown, and fonts. Verify the catalogue content version against build metadata. Block requests outside loopback during browser study tests; this establishes offline asset availability while the local server remains reachable.
- Exercise read → answer → feedback → annotate → close/relaunch → reopen, plus backup export/restore in isolated browser profiles. Cover a reading-only lesson, cross-topic practice, multiple-answer scoring, and a flagged key in review mode.
- Reuse the full numbered-lesson diagram test and scroll-save regression against the packaged server. Package success must retain the accepted stable rendering and explicit Correct/Incorrect feedback.
- Check an occupied port and missing assets, useful failure reporting, shutdown, immediate relaunch, and absence of orphan server processes. Headless checks cover server lifecycle; desktop checks cover native-window lifecycle.
- Extract Mac ZIPs and Linux archives before testing, rather than testing only their pre-archive build folders. After signing, test the signed final packages and compute hashes from those final bytes.

Use the existing test suites rather than duplicating their selection/scoring rules. Add focused launcher tests for the new packaging paths and lifecycle. The content validator currently reports four intentional Socket API/SDN source-format findings and 49 legacy dependency warnings; record them explicitly and fail on additional findings. Do not suppress the entire validator or call its current result a strict pass.

### Manual desktop checks

On each advertised OS/architecture, download the candidate using a browser and launch it as a normal user. Record whether installation/extraction, native controls, automatic browser opening, actual disconnected study, stopping, and relaunching work. Confirm the desktop has no Python/Node requirement. GitHub VM automation does not replace this download-and-launch check or prove that platform trust prompts behave as expected.

Create a disposable study profile with read marks, a quiz attempt, a tag, and a flag. Close the launcher, replace the package with the next candidate, and confirm the same browser/profile resumes at the same origin. Verify backup/restore as well. Use disposable profiles for all automated and destructive restore checks.

## Release contents, updates, and recovery

Use the version in `app/package.json` as the application version; keep the lockfile, package names, metadata, and Git tag consistent. A first candidate could be `v0.1.0-rc.1`, followed by `v0.1.0` after acceptance. The stable version needs its own matching commit/build and checks; renaming the candidate package does not update its embedded version. Candidate testing does not establish a stable release automatically.

Each release should contain the four platform assets, a `SHA256SUMS.txt` file for the final downloads, and build metadata recording the application version, commit, catalogue content version, architectures, and toolchain versions. Include required dependency notices in the distribution. Release notes explain which file to download, extraction/launch/stop steps, tested platforms, browser storage, backup/restore, and known limitations. Checksums detect accidental corruption; they do not establish a publisher identity.

Promote the exact tested artifact bytes. If a rebuild, content edit, signing step, or archive change alters the final package, rerun the affected checks and hashes. Do not replace an existing published version's downloads with different bytes; issue another version.

Updates are manual downloads for this milestone. The launcher does not migrate progress into its installation directory: IndexedDB remains in the same browser profile at the fixed origin. Replacing/removing the executable therefore does not itself delete progress. A different browser/profile/address needs export/restore. App version, catalogue version, answer version, and personal-data schema version remain separate concepts.

Before a future storage-schema change, provide and test migration/backup compatibility. Current version-1 parsing has no general migration framework. For rollback, retain previous release assets; an older executable is safe only with compatible personal-data records. Export a backup before an upgrade, and document compatibility rather than promising arbitrary downgrades.

## Platform signing

Unsigned candidates allow us to develop and test packaging first. For broad distribution, plan Developer ID signing, hardened runtime, notarization, and a stapled ticket for macOS; signing credentials require an Apple developer account. Ad-hoc signatures from packaging tools are not a substitute for Developer ID/notarization. [Apple distribution guidance](https://developer.apple.com/developer-id/)

For Windows, decide on a trusted code-signing identity before claiming a smooth public installation experience. Smart App Control can block unknown unsigned applications; signing does not guarantee the absence of every reputation prompt. Record actual downloaded-package behavior. [Microsoft signing guidance](https://learn.microsoft.com/en-us/windows/apps/develop/smart-app-control/code-signing-for-smart-app-control), [SmartScreen guidance](https://learn.microsoft.com/en-us/windows/apps/package-and-deploy/smartscreen-reputation)

Store credentials in repository/environment secrets, accessible only to trusted release jobs. If credentials are not available, label candidates with their signing status and limits. Candidate build/test work can continue; do not describe it as signed public-release readiness or instruct users to disable platform protections.

## Implementation order and files

The implementation now provides the files below. Native workflow execution and desktop evidence remain separate milestones; file existence is not platform acceptance.

| Order | Deliverable | Files or affected entry points |
| --- | --- | --- |
| 1 | Bundle-aware launcher and minimal native lifecycle controls | `tools/serve_study.py`, focused tests under `tools/tests/` |
| 2 | Working folder bundles, then final package formats | `packaging/network_study.spec`, `packaging/requirements.txt`, `tools/package_study.py`; ignored build/output paths in `.gitignore` |
| 3 | Tests against packaged servers and extracted downloads | `app/playwright.config.ts`, existing browser suite, `tools/test_packaged_study.py` |
| 4 | Checks and four-platform candidate builds | `.github/workflows/check-app.yml`, `.github/workflows/package-app.yml` |
| 5 | Download/launch guidance, evidence, and draft-release preparation | `app/README.md`, `app/ARCHITECTURE.md`, `app/verification.md`, `STATUS.md`; release steps in the packaging workflow |

Complete a launcher/package prototype before investing in the release-writing job. Keep the current checkout launch path working throughout. Record successful candidate runs and unresolved platform limits in the verification report; do not overwrite historical evidence or treat a plan as a passed check.

The remaining arrangements are desktop test access across the platform/distribution matrix and a decision about Windows/macOS signing credentials. Fedora Workstation 44 and EndeavourOS are the selected additional Linux targets. Packaging work does not approve explanation text or change content statistics; public publication remains a later maintainer action.
