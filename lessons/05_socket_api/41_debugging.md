---
id: socket-api-41
topic_id: 05_socket_api
order: 41
title: "Testing and debugging network programs"
source_classification: lecture_guide
estimated_reading_minutes: 2
prerequisite_ids: ["socket-api-18", "socket-api-22"]
---

# 41. Testing and debugging network programs

## Learning goals

- Use the retained telnet/netstat and GDB teaching commands.
- Distinguish source-level stepping, stack traces, expression evaluation, and memory inspection.

**Builds on:** [lesson 18](18_wrappers_and_daytime_client.md), [lesson 22](22_tcp_states.md).

## Explanation

## 8. Debugging, Testing, Pitfalls, and Best Practices

### 8.1 Debugging Network Programs with GDB and Testing with `telnet` / `netstat`

#### Testing ASCII Servers with `telnet` and Inspecting States with `netstat`

* **`telnet <host> <portnumber>`:** Opens a TCP connection but can also exchange Telnet protocol negotiation bytes to `<host>` on `<portnumber>`, making it a useful historical tool for interactively testing ASCII line-based servers (Echo, Daytime, HTTP web servers, SMTP mail servers) before writing client code.
* **`netstat`:** Displays active network connections, TCP states (`LISTEN`, `ESTABLISHED`, `TIME_WAIT`, `CLOSE_WAIT`), routing tables, and interface statistics.

#### Debugging with GDB (and DDD)

* **Compilation:** For a straightforward teaching session, compile with `-g -O0`. `-Og` is another useful debugging choice; optimized code can also be debugged, but source-level stepping and variable visibility may be less intuitive.
* **Starting GDB:**
  * Live execution: `gdb progname`, then inside GDB run `run args` (supports shell redirection, e.g., `run < infile > /dev/null`).
  * Post-mortem crash analysis on a core dump: `gdb progname core`.
* **Controlling Execution:**
  * Set breakpoints: `break main`, `break foo.c:4`, `break 16`.
  * Resume execution: `cont`. Pause a hanging program: `CTRL-C` (`SIGINT`).
  * Single-step: `step N` (steps into function calls) vs. `next` (treats a function call as a single line). *Tip:* Avoid writing nested "mega-expressions" like `foo(bar(tmp = baz(), tmp2 = baz2()))` which are difficult to step through.
* **Examining State:**
  * Stack trace: `backtrace` (`bt`), `bt full` (prints all local variables), and `up`/`down` to navigate stack frames.
  * Evaluate expressions: `print EXP`.
  * Inspect raw memory: `x/<count><format><size> ADDR` (formats: `o` octal, `x` hex, `d` decimal, `u` unsigned, `t` binary, `f` float, `a` address, `i` instruction, `c` char, `s` string; sizes: `b` byte, `h` halfword/2B, `w` word/4B, `g` giant/8B).

## Practice

No native socket API quiz questions are assigned. This teaching is retained for study and revision.

Check the [review queue](review.md) before scored practice. A lesson link can teach the reasoning that exposes a false premise or key; it does not endorse that key. Optional background is listed separately in the [manifest](manifest.json).

## Source

- [Lecture: 8. Debugging, Testing, Pitfalls, and Best Practices](../../lectures/lecture_05_socket-api.md#8-debugging-testing-pitfalls-and-best-practices)

[Topic overview](README.md) · [Glossary](glossary.md) · [References](references.md) · [Previous lesson](40_messaging_middleware.md) · [Next lesson](42_pitfalls_and_practice.md)
