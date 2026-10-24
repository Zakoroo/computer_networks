# Building downloadable candidates

The repository now has native packaging tools and GitHub Actions workflows for Windows x64, Linux x64, and Intel/Apple Silicon Macs. These prepare candidates; public distribution still needs platform evidence and signing decisions. [DEPLOYMENT_PLAN.md](../DEPLOYMENT_PLAN.md) records the approved targets, including Fedora and Arch-family desktop checks. Current evidence belongs in [app/verification.md](../app/verification.md).

Agents should use the focused [release workflow](../skills/release-study-app/SKILL.md). The [tools index](../tools/README.md#application-and-packaging-tools) describes each helper's inputs, outputs, and side effects; commands and platform requirements are maintained here.

## What users run

A Windows download is an executable; a Linux tar archive contains one executable; a Mac ZIP contains `Network Study.app`. Launching a package opens a small native window and the default browser at **http://127.0.0.1:4173/**. Keep the launcher open while studying. **Open study app** reopens the interface, **Licenses** opens bundled notices, and **Stop and quit** closes the server. Closing a browser tab leaves the launcher running.

Python, Tcl/Tk, the interface, course content, rendering libraries, and fonts are bundled. A browser and normal desktop system libraries remain requirements. Progress stays in the same browser profile at the fixed address. Updates replace the application files; export/restore remains the way to transfer progress between profiles. Never change the port to bypass an occupied origin.

## Build locally

Use Python 3.13.17 with working Tkinter to match CI, plus Node.js 22.12+ for the web build. Packaging dependencies are pinned in [requirements.txt](requirements.txt). On Linux, check Tkinter with `python3 -c "import tkinter; print(tkinter.Tcl().eval('info patchlevel'))"`; the native controls also need a display. Build on the oldest supported platform baseline, as described in the plan.

Create and activate a packaging virtual environment, then install the pinned dependencies:

```sh
python3 -m venv .venv-packaging
. .venv-packaging/bin/activate
python -m pip install -r packaging/requirements.txt
cd app
npm ci
npm run build
cd ..
python tools/package_study.py --prepare-web
python tools/package_study.py --mode onedir --output-dir dist/packages/prototype
python tools/package_study.py
```

On Windows, create the environment with `python -m venv .venv-packaging` and activate `.venv-packaging\Scripts\Activate.ps1` in PowerShell. Native packaging can consume the prepared `web-dist` artifact from CI instead of building web assets again; extract it into `app/dist/` at the same source commit. The automated web build runs on Ubuntu once and feeds all native jobs.

Clean committed sources are required by default. For a local prototype with uncommitted edits, pass `--allow-dirty` to **both** preparation and packaging. Metadata records that state, and release assembly rejects dirty candidates. Use another output directory for a rebuilt prototype: the tool refuses to overwrite an existing asset. Generated builds, environments, and candidate downloads are ignored by Git.

Preparation collects installed npm dependency notices, inventories web files, and records the app version, commit, catalogue version, and shared-asset hash. Native builds verify that identity and inventory before invoking [network_study.spec](network_study.spec), add runtime notices and toolchain/platform metadata, and produce an archive/executable with JSON and SHA-256 sidecars. Mac archives preserve `.app` symlinks using `ditto`; Linux tar archives preserve executable permissions.

The source launcher retains its terminal behavior. `python tools/serve_study.py --gui` previews native controls; `--headless --no-browser` runs without controls/browser opening. `--check-gui` briefly opens and closes the native window for packaging diagnostics. Automation can use `--headless --stop-file /path/to/stop` to request clean shutdown without adding an HTTP write API.

## Test an extracted download

Run from the root with the actual generated paths:

```sh
python tools/test_packaged_study.py \
  --asset dist/packages/network-study-0.1.0-linux-x64.tar.gz \
  --metadata dist/packages/network-study-0.1.0-linux-x64.json \
  --report dist/packages/check-linux-x64.json --gui --browser
```

Browser checks need the development npm dependencies and an installed Playwright Chromium (`cd app` then `npx playwright install chromium`). On headless Linux, wrap the command with `xvfb-run -a`. `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` can select an existing compatible browser. These dependencies belong to the test machine; the launched package receives an empty command search path.

The helper checks the download hash, extracts it outside the checkout into a path containing spaces, and starts it from a read-only working directory on POSIX. It checks served asset hashes, runtime notices, build/content identity, duplicate-launch refusal, clean shutdown, and immediate relaunch. `--gui` verifies the bundled Tk controls. `--browser` invokes the existing study/backup/diagram suite against that executable, with an isolated personal profile and the packaged content version. A busy port fails testing; an existing study server is never reused.

Native checks still use the release's real study origin on port 4173. Development uses 5173 and normal local browser checks use a Vite preview on 5174; those can run beside an installed study app. Success on the local preview does not establish native launcher/package acceptance.

The Python tests also cover source/bundle path resolution, missing assets, server lifecycle, pending-connection bursts from parallel module loads, browser environment restoration, stale web builds, and release identity/checksum guards. Run them with `python -m unittest discover -s tools/tests`; native-window tests skip when Tkinter or a desktop display is unavailable.

## GitHub Actions

Commit and push the implementation through the normal repository workflow. Once the workflow is available on the default branch, open **Actions → Build study app candidates → Run workflow**, select the intended branch/tag, and leave **create_draft** unchecked for candidate testing.

- [check-app.yml](../.github/workflows/check-app.yml) runs on main/master pushes and pull requests, and is reused by packaging. It runs tool/application tests, reports the exact documented content findings, checks progress, builds the app once, and uploads `web-dist`.
- [package-app.yml](../.github/workflows/package-app.yml) is manually invoked. Four native jobs build/test folder prototypes and create final downloads. Fresh jobs extract those downloads and run native-window and full browser checks. Linux uses a virtual display; no Docker is used.
- Successful checks feed an assembly job. It requires all four matching clean candidates and matching successful reports, then uploads `release-candidate` containing downloads, `SHA256SUMS.txt`, `BUILD_INFO.json`, and release-note text. Intermediate candidate/check/browser artifacts are retained for 14 days; the assembled candidate is retained for 30 days.

To download assembled packages, open the successful **Build study app candidates** run, choose its **Summary**, and find **Artifacts → release-candidate**. Download and extract that artifact while signed into GitHub. `web-dist` is the shared web input, not a native launcher. Public pre-releases, after publication, are listed under the repository's [Releases](https://github.com/Zakoroo/computer_networks/releases).

For a failed run, inspect the exact commit, job, and step, then download `browser-evidence-<target>` for its Playwright trace/error context and `package-check-<target>` for the helper's result. Inspect failed asset requests and diagram error/loading state before changing readiness timeouts. A new source/workflow fix needs a new run on the updated commit; rerunning an older run retains its original source/workflow. All four final package checks must pass before assembly.

The workflows pin Python 3.13.17 and Node 22.14.0, and record actual packaging and runner versions. `setup-python` installs the pinned interpreter in each job; no manual VM installation is needed. Before changing the pin in either workflow, check the [Actions version manifest](https://raw.githubusercontent.com/actions/python-versions/main/versions-manifest.json) for **all four targets**: Ubuntu 22.04 x64, Windows x64, macOS x64, and macOS arm64. Availability on Linux alone is insufficient. Python 3.12.14 is a [source-only release](https://www.python.org/downloads/release/python-31214/#no-installers); the Actions manifest provides it for Linux but lacks Windows/macOS packages. Python 3.13.17 has packages for all four targets. Keep build/test/assembly/draft jobs on the same pin, and verify a new candidate run after changes.

The [content findings file](content-findings.json) records four pre-existing source-format errors and one warning covering 49 legacy dependency entries. [check_release_content.py](../tools/check_release_content.py) prints these and rejects any changed/new findings. This is an explicit packaging baseline, not a strict content-validation pass or a waiver for new findings.

## Drafts and publication

Candidate builds have read-only repository permissions. There is no automatic public publication or update mechanism. The optional draft job alone receives release-writing permissions, and creates a draft only when manually requested on an existing `v<app-version>` tag whose commit matches the tested packages. It uses the exact assembled asset bytes. It refuses to overwrite an existing release; it does not create a tag or publish a draft.

The draft title is set separately to `Network Study <version>`. Generated notes begin with the candidate notice and omit a duplicate title heading.

When tag/draft preparation is authorized:

1. Confirm the intended source commit and matching versions in `app/package.json` and `app/package-lock.json`. Create/push its version tag through the normal Git workflow. The tag must be exactly `v<app-version>`; an `-rc.1` tag needs the same suffix in the app version. Use a new version for a subsequent release instead of moving a published tag.
2. Start the candidate workflow on that tag with **create_draft** enabled. With GitHub CLI, replace `TAG_NAME` below with the actual existing tag:

   ```sh
   gh workflow run package-app.yml --ref TAG_NAME -f create_draft=true
   ```

3. The tagged workflow rebuilds and tests all targets, assembles the verified assets, and creates the draft under **Releases**. Starting it on `main` cannot satisfy the matching-tag draft guard.
4. Review the draft's title, source commit, platform files, and generated notes. Keep `BUILD_INFO.json` and `SHA256SUMS.txt` attached; undo any pending deletion of those files in the editor. Update "Unpublished candidate" wording if publishing, while keeping accurate signing and desktop-test qualifications.
5. For a public release candidate, select the **Pre-release** label; the title alone does not set it. Publishing is a separate action from building or saving the draft. Use **Publish release** only within the user's authorized stage, after the applicable checks below. See [GitHub's release guide](https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository#creating-a-release) for the editor controls.

Before public publication, perform the plan's download-and-launch checks on the advertised desktops, including Fedora/Arch targets. Arrange Windows signing and Mac Developer ID/notarization if those are part of the release. The current workflow creates unsigned Windows/Linux candidates and ad-hoc-signed Mac candidates; trusted signing/notarization is not configured. Signing or changing an archive requires another test/hash pass against those final bytes. Keep explanation approvals and known content findings separate from package acceptance.

Use [DESKTOP_CHECKS.md](DESKTOP_CHECKS.md) for a short test record. Fedora Workstation 44 is the initial Fedora target; EndeavourOS is the selected Arch derivative because the user runs it on another computer. Neither has been tested yet.

Record actual desktop evidence and signing status in release notes before the maintainer publishes the draft. GitHub artifacts are temporary test downloads; GitHub Releases are the intended durable distribution channel.
