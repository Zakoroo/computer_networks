# Desktop candidate check

Use this checklist with an actual downloaded package. It complements automated checks and records acceptance for one candidate, OS, architecture, desktop session, and browser. Initial additional Linux targets are Fedora Workstation 44 and the user's EndeavourOS computer; see the [deployment matrix](../DEPLOYMENT_PLAN.md#linux-distribution-validation). Their application compatibility is still unverified.

Record the following in the candidate's release notes or [application verification report](../app/verification.md). Do not mark an untested item as passing.

| Field | Result |
| --- | --- |
| Candidate filename and SHA-256 | Pending |
| App version / source commit / dirty prototype status | Pending |
| OS/release, CPU architecture, and test date | Pending |
| Desktop environment and Wayland/X11 session, where relevant | Pending |
| Default browser and version | Pending |
| Signing/trust message observed | Pending |
| Python/Node already present? Any extra runtime package required? | Pending |

For EndeavourOS, record the installed system state rather than only an installer ISO name. Settings can supply the desktop/browser versions; optional Linux diagnostics are `cat /etc/os-release`, `uname -m`, and `getconf GNU_LIBC_VERSION`. Testing does not require changing the system's package set.

1. Download/copy the candidate and its checksum from the same build. Extract archives with the desktop's normal archive tool. On Linux, run the executable as a regular user; if necessary, enable its executable permission through file properties. Record any extraction, missing-library, or launch failure verbatim.
2. Launch it normally. Confirm the native window is readable and the default browser opens **http://127.0.0.1:4173/**. Test **Open study app** and **Licenses**. A browser-opening failure should leave the local address available to copy.
3. Use a disposable browser profile for study/restore checks. Read TCP-06, Socket API-08, and SDN-15; enlarge a diagram and scroll while progress saves. Check that diagrams stay stable and the scrollbar does not jump.
4. Submit correct and incorrect answers, including a flagged review question. Confirm explicit feedback, readable explanations, and the question-status notice. Also open a lesson without questions.
5. Mark a lesson read, add a tag and revisit flag, then close the browser tab. The launcher should remain running, and **Open study app** should reopen the interface with saved progress.
6. Start the executable again while the first copy runs. Confirm a clear occupied-address notice; dismiss it and check that the original session still works. No alternate port should open.
7. Disconnect Internet access while keeping the local process running. Reopen a lesson with diagrams/math and answer a quiz. External reference websites need Internet; the study interface and bundled content should work locally.
8. Reconnect if necessary. Use **Stop and quit**, then relaunch. Check that the port is released and the same browser/profile resumes its saved state. Closing the native window should also stop the server.
9. Export a backup from the disposable profile, preview a restore, and restore it there. For a later candidate update, stop the old launcher, replace the application files, and check that the same origin/profile retains progress. Do not test replacement restore over personal study data.

Report pass/fail per step and attach only relevant failure details. A successful EndeavourOS check establishes evidence for that tested configuration; it does not automatically establish every Arch derivative or future system update. Public release notes should list the configurations actually tested.
