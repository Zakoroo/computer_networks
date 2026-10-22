# SDN references and source qualifications

## Revision notes and references

The supplied guide reports no hidden slides; this revision retains that classification. It distinguishes SDN's architecture from guarantees about consistency, security, and availability; specifies the OpenFlow miss-to-controller assumption; and identifies the incomplete ACL policy in the original example. The course suffix DIT663 is retained as supplied metadata, not independently verified.

- [OpenFlow 1.3 specification](https://opennetworking.org/wp-content/uploads/2014/10/openflow-spec-v1.3.0.pdf): table-miss processing, supported matches, and controller messages. Earlier versions differ.
- [Feamster, Rexford, and Zegura, The Road to SDN](https://www.cs.princeton.edu/~jrex/papers/sdnhistory.pdf): historical framing of programmable networks.
- [Google, B4: Experience with a Globally-Deployed Software Defined WAN](https://research.google/pubs/b4-experience-with-a-globally-deployed-software-defined-wan/): historical production architecture.

**Questions for revision:** Why is logically centralized control compatible with replicated controllers? What does a controller know when its topology information is stale? Why does a forwarding rule need separate reverse-direction handling? How can an ACL remain correct after a path change? What must work before an in-band controller can install ordinary forwarding rules?

## Supplementary editorial checks

These checks support question-review findings only. They do not add examinable extension lessons or close lecture-coverage gaps.

- [OpenFlow 1.3.0, sections 5.3–5.5, A.2.3, and 6.3.2](https://opennetworking.org/wp-content/uploads/2014/10/openflow-spec-v1.3.0.pdf): supported matches, table misses, rule expiry, and controller-connection interruption. Consulted on 22 October 2026.
- [Mermaid sequence syntax](https://mermaid.js.org/syntax/sequenceDiagram.html#line-breaks): explicit line breaks for notes/messages and participant aliases, used for source-label repairs. This is presentation documentation, not networking coverage.

The historical SDN papers, B4 deployment, acquisition amount, ONF membership, course suffix, and slide-visibility metadata remain source-reported; they were not independently authenticated in this conversion.

[Topic overview](README.md) · [Review queue](review.md)
