# TCP sources and review references

## Supplied source

- [Complete TCP guide](../../lectures/lecture_04_tcp-ip.md), generated 20 October 2026, preserved against commit `436acd7`.
- [Glossary](glossary.md) retains every source definition. Resource URLs and all exercise categories are retained in [lesson 24](24_study_resources.md).
- [Archived prompts](25_review_prompts.md) retain supplementary questions and the worked window-limited throughput example. A prompt is not answer coverage.

The source's dated BBR draft and L4S field-study assertions are retained as source reports, not independently verified citations. The full original slide deck and slide visibility were not re-authenticated. No source teaching was removed for lack of a quiz question.

## Supplementary editorial checks

These sources support review findings only. They are not counted as lecture coverage and do not close unresolved gaps.

- [RFC 9293, TCP header format](https://www.rfc-editor.org/rfc/rfc9293.html#section-3.1) checks the first-data-byte interpretation used in the source packet trace; [sequence numbers](https://www.rfc-editor.org/rfc/rfc9293.html#section-3.4) confirms that finite width alone does not explain safe wraparound (Q003).
- [RFC 5681, acknowledgment generation](https://www.rfc-editor.org/rfc/rfc5681.html#section-4.2) distinguishes ordinary delayed ACKs from immediate out-of-order feedback (Q010). Its [congestion-control rules](https://www.rfc-editor.org/rfc/rfc5681.html#section-3.1) retain slow start after timeout (Q015).
- [RFC 5961, blind reset attacks](https://www.rfc-editor.org/rfc/rfc5961.html#section-3) provides the tuple/sequence-validation context missing from Q027's simple predictability condition.

[Topic overview](README.md) · [Review queue](review.md)
