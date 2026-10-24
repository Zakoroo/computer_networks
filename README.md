# Network Study

Study computer networking one lesson at a time: read a short lesson, answer related quiz questions, and check the explanation. Choose what to focus on with your own tags, bookmarks, and priorities.

The app covers networking lectures 01–06: Internet routing, DNS, IPv6, TCP, the Socket API, and Software-Defined Networking (SDN). It runs on your computer, opens in your web browser, and works offline after download. No account is needed.

**[Download the app from GitHub Releases](https://github.com/Zakoroo/computer_networks/releases)**

## Download and open the app

1. Open the download link above and choose the newest release you want to try. Releases marked **Pre-release** are early test versions; read their notes for known limitations.
2. Expand **Assets** and download the file for your computer:

   | Your computer | Filename ends with | How to open it |
   | --- | --- | --- |
   | Windows PC with a 64-bit Intel or AMD processor | `-windows-x64.exe` | Open the downloaded `.exe`. |
   | Linux PC with a 64-bit Intel or AMD processor | `-linux-x64.tar.gz` | Extract the archive, then run the `network-study` file inside. Allow it to run as a program in your file manager if needed. |
   | Mac with an Apple M-series chip | `-macos-arm64.zip` | Extract the ZIP, then open `Network Study.app`. |
   | Mac with an Intel processor | `-macos-x64.zip` | Extract the ZIP, then open `Network Study.app`. |

   On a Mac, **Apple menu → About This Mac** shows the chip or processor. The release's **Source code** archives are project files for developers; choose an app file from the table to study.
3. A small launcher window opens, followed by your browser. Keep the launcher open while studying. Use **Open study app** to reopen the browser page and **Stop and quit** when you are finished. Closing a browser tab leaves the launcher running.

You need a desktop web browser. You do not need to install Python, Node.js, or development tools. Windows and Mac test downloads do not yet have a verified publisher signature, so your system may show a trust notice. Check the release notes for details. Linux downloads have been automatically checked on Ubuntu; other distributions, such as Fedora, Arch, and EndeavourOS, still need desktop testing.

## Your first study session

1. On the **Roadmap**, choose **Start studying** or open a lesson from a topic.
2. Read the lesson. Diagrams have an **Enlarge** button when you want a closer look.
3. Choose **Mark lesson read** when you are done reading. This is separate from answering its quiz, and you can undo it.
4. Continue to the questions, choose your answer, and press **Submit answer**. Questions with checkboxes can require several answers; select the complete set. The app shows **Correct** or **Incorrect**, the keyed answers, and an explanation when available.
5. Use **Continue studying** to carry on. Your reading position and study choices save in the browser.

Some lessons have no quiz questions. They remain on the roadmap as reading material. The **Question library** lets you find and practise questions separately from their lessons.

## Make the study plan your own

Your choices belong to you and can be changed at any time. They do not edit the course material.

| Control | What it does |
| --- | --- |
| **Tags** | Add your own labels, such as `needs-practice` or `exam-week`. Remove a tag with its × button. Use **Include tags** or **Exclude tags** to find matching questions. Lesson tags and question tags are separate; tagging a lesson does not automatically tag its questions. |
| **Revisit** | Bookmark a lesson or question to return to later. Marked lessons show a flag on the roadmap. To find bookmarked questions, enter `revisit` in **Include flags**. |
| **Defer** on a lesson | Pause it in **Continue studying** suggestions. It remains on the roadmap, and its questions are still available. Press **Defer** again to resume it. |
| **Defer** on a question | Leave it out of future practice selections by default. Turn on **Include deferred questions** to include it, or press **Defer** again to resume it. |
| **Mark lesson read** | Record that you have read the lesson. It does not require a perfect quiz score or mark questions as answered. |

### What does Priority do?

**Priority changes the order: High comes before Normal, then Low.**

- **For questions**, it orders the questions that match your practice filters. For example, a High question appears before a Normal question when both match. Priority does not override a filter that excludes the question.
- **For lessons**, it helps order the roadmap while keeping prerequisite lessons first. A High lesson can still follow earlier material it builds on. **Continue studying** may first resume your unfinished lesson.

Revisit and Priority are independent: a bookmark does not automatically raise priority. Priority does not change grading or mark anything complete.

An open lesson session keeps its current questions and their order while you answer. Reopen the lesson or change the practice filters to build a fresh selection using your latest choices.

### Narrow your practice

Open **Shape your practice queue** on the Roadmap or in the Question library. You can choose topics, tags, flags, unanswered questions, questions you last answered incorrectly in ordinary practice, and whether their lessons are marked read. You can also search question text.

Several labels in one Include field mean **any of them can match**. Different fields combine: choosing a topic and a tag requires both. Exclusions take precedence. Use **Reset filters** to start over. Practice filters leave all lessons available on the reading roadmap.

## Understand question notices

**Ordinary practice** focuses on lesson-linked questions without known wording or answer-key findings. Other questions remain available: use **Show all questions** in the Question library, or choose **Include review questions** and the coverage you want.

Review questions show feedback against the original answer key but stay outside the ordinary score. Read their status notices: a question may have ambiguous wording, an answer-key concern, or insufficient teaching in the supplied lectures. A **coverage gap** describes lecture support; it does not predict what will appear on an exam. Explanations are available for linked questions, and their review status is shown in the app.

## Keep your progress safe

Your progress, answers, tags, bookmarks, priorities, and filters are saved in the browser you use to study. Use the same browser profile and the app's usual address, **http://127.0.0.1:4173/**, each time. A different browser, private window, or address such as `localhost` has separate study data.

Use **Backup & restore → Download personal backup** regularly, especially before updating the app, clearing browser data, or moving to another computer. To move your progress, open the app in the destination browser, choose the backup file, review the preview, then confirm replacement. Restoring replaces that browser's current study data, so download its backup first if you want to keep it.

There is no automatic account or device synchronization. Updating the downloaded app does not itself transfer data between browsers.

## If something does not work

- **The browser did not open:** use **Open study app** in the launcher, or open **http://127.0.0.1:4173/** yourself while the launcher is running.
- **Another copy is already running:** return to its launcher window, or stop it with **Stop and quit** before opening another copy.
- **Questions seem to be missing:** check your practice mode, coverage, tags, flags, progress filters, and deferred-question setting. **Show all questions** resets the library to include review questions and all coverage.
- **Progress appears to be missing:** check the browser profile and address you used before, or restore a personal backup.

Report problems through [GitHub Issues](https://github.com/Zakoroo/computer_networks/issues), including your operating system, app version, and what you were doing. Keep personal backup files private unless you intentionally choose to share them.

## For contributors

To run or change the source, see [app setup](app/README.md), the [architecture and technology stack](app/ARCHITECTURE.md), the [tools index](tools/README.md), and [packaging instructions](packaging/README.md). [AGENTS.md](AGENTS.md) guides coding agents. [PROGRESS.md](PROGRESS.md) tracks preparation of the course material; your own study progress lives in the app.
