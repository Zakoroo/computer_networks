# Routing patch verification

Reviewed on 22 October 2026 against repository HEAD `192e7eac3ea9889afb259a0199e0a0638e1aee29` and the supplied `routing_lessons.patch`.

## Working tree and compatibility

Initially, the only working-tree change was the untracked patch. No lessons directory existed, and the routing quiz still had its original assignments. The patch was therefore not already applied. `git apply --check` succeeded against its exact stated base, and the patch was applied locally for review. No commit, pull request, or GitHub write was made during this review.

## Confirmed results

- The patch creates 23 numbered lessons and five support files, and modifies only the routing quiz among existing tracked files.
- Every nonempty teaching and reference line from lecture 01 is present in the lesson Markdown after trimming surrounding whitespace. Headings and navigation are reorganized. The glossary and source revision notes are retained. The original lectures are unchanged.
- All 28 source Mermaid blocks are retained. The lesson Markdown contains no image dependencies. Local Markdown link targets exist; this check did not render diagrams or verify browser-generated heading anchors.
- Five lessons have no assigned questions and are retained: DHCP, autonomous systems, RIP, ASPA, and BGP wedgies.
- All 100 quiz questions have manifest entries. Their text, option order, correct-answer indices, explanations, and tags match HEAD. Only `lesson_id` and `flags` change.
- All 100 question fingerprints, quiz-to-manifest links, flags, and reverse lesson assignments agree. Lesson IDs and prerequisite/related references resolve.
- Coverage totals match the report: 60 linked to routing lessons, six supported in another topic, five partially supported in another topic, and 29 without sufficient support in the available guides. The latter two groups produce 34 coverage-gap flags.
- There are 16 wording-review flags, 11 cross-topic flags, and five supplementary-source flags. These categories overlap and should not be added as mutually exclusive totals.
- Supplementary classification is visible for RIP, OSPF, and the telephone-circuit subsection. Additional worked reasoning is labelled editorial clarification. Dated RPKI/ASPA claims retain their source qualifications.

## Coverage review and remaining limits

I compared the 100 question stems and keyed choices with the assigned lessons and their related lessons. The [review queue](review.md) correctly keeps coverage gaps separate from wording issues rather than silently rewriting answer keys. A mapping does not make a flagged question ready for scored practice; examples include Q015, Q023, Q050, Q059, and Q100.

Cross-topic checks against the available lecture guides support the stated distinction: IPv6/DNS explain anycast and its operational consequences; TCP explains out-of-order buffering; SDN mentions TCAM but does not supply the trie comparison or power-cost explanation. The TCP wraparound review prompt is not an explanation of modulo arithmetic. Searches across all 11 guides did not find the missing router-fabric, ECMP hashing, NAT traversal, route-flap damping, or fast-reroute teaching identified in the queue. These findings describe the available Markdown guides, not exam scope or unseen slides.

The multi-lesson requirement is only partly resolved. **50 questions have `related_lesson_ids`, but that field does not distinguish required supporting lessons from optional context.** For example, Q008/Q042 compare link-state and distance-vector, Q089 compares BGP and OSPF, and Q014 combines NAT in IPv6 with the routing lesson's end-to-end principle. These require synthesis. Other related links are simply background. Before implementing lesson-completion gates, classify these dependencies explicitly rather than treating every related lesson as mandatory. The patch's generic coverage rationales do not provide that distinction.

The 60 routing mappings are therefore an accounting result, not a claim that all 60 questions can be answered from their primary lesson alone or scored without wording review. Question validity, source coverage, and required reading are separate decisions.

The future application's manual **add/remove tag** requirement is now explicit in [the content conventions](../README.md). Existing tags remain untouched; no application functionality is implemented.

This review verifies the supplied guide's preservation and the patch's internal consistency. It does not independently authenticate original slide visibility, historical deployment statistics, or every linked external standard. The supplied patch remains unchanged as the recovery artifact; this verification document and the explicit tag requirement are local additions beyond it.

## TCP conversion follow-up, 22 October 2026

The preceding sections describe the original patch audit; the user later removed the patch and committed the content. During lecture 04 preparation against `436acd7`, Routing Q049 gained primary `tcp-14` with no additional required lessons. The unmarked Reno explanation and labelled derived buffering comparison support the answer; the unanswered archived prompt is not itself answer evidence. The original quiz, canonical routing manifest, TCP external reference, and topic overviews/review notes agree. Its question content and flags are unchanged. All six fully supported external routing questions now have lesson links, for 66 actual primary assignments in this quiz. Q047/Q048 remain unresolved. The all-topic validator against HEAD checks this follow-up together with the TCP conversion; see [TCP verification](../04_tcp/verification.md). Routing's approved lesson content is unchanged; the user approved the new assignment together with the TCP work on 22 October 2026.
