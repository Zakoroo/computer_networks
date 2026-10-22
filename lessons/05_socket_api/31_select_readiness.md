---
id: socket-api-31
topic_id: 05_socket_api
order: 31
title: "select sets, bounds, timeouts, and readiness"
source_classification: lecture_guide
estimated_reading_minutes: 4
prerequisite_ids: ["socket-api-30"]
---

# 31. select sets, bounds, timeouts, and readiness

## Learning goals

- Rebuild value-result descriptor sets and timeouts correctly.
- Explain descriptor-number bounds and readiness for data, EOF, errors, and urgent input.

**Builds on:** [lesson 30](30_io_models.md).

## Explanation

**Editorial clarification:** Returned sets contain the descriptors ready during this call; they are not a cache of earlier readiness. Rebuilding the watched set restores interest in descriptors that were previously not ready. Writability can also report an operation that will immediately fail, as the source error/closed-half rows show.

### 6.2 The `select()` System Call and Descriptor Readiness Conditions

The `select()` function instructs the kernel to suspend the process until one or more specified file descriptors become ready for reading, writing, or an exception condition, or until an optional timeout expires:

```c
int select(int maxfdp1, fd_set *readset, fd_set *writeset, fd_set *exceptset,
           struct timeval *timeout);
/* Returns: positive count of ready descriptors across all sets, 0 on timeout, -1 on error */

struct timeval {
    long tv_sec;  /* seconds */
    long tv_usec; /* microseconds */
};
```

* **`timeout` Behavior:**
  1. `timeout == NULL`: **Wait without a deadline**; readiness or an error such as signal interruption can end the wait.
  2. `timeout->tv_sec > 0 || timeout->tv_usec > 0`: **Wait up to a fixed time**; return when a descriptor is ready or the timer expires.
  3. `timeout->tv_sec == 0 && timeout->tv_usec == 0`: **Do not wait at all (polling)**; check descriptors and return immediately.
* **Manipulating `fd_set` Bitmasks:**
  * `void FD_ZERO(fd_set *fdset);` — Clear all bits in `fdset`.
  * `void FD_SET(int fd, fd_set *fdset);` — Turn on the bit for `fd` in `fdset`.
  * `void FD_CLR(int fd, fd_set *fdset);` — Turn off the bit for `fd` in `fdset`.
  * `int FD_ISSET(int fd, fd_set *fdset);` — Test whether the bit for `fd` is turned on in `fdset`.
* **Value-Result Sets:** Because **`select()` modifies the descriptor sets pointed to by `readset`, `writeset`, and `exceptset` in place** to indicate which descriptors are ready upon return, you must re-enable (`FD_SET`) the bits of interest before every call to `select()` in a loop!
* **Reset timeout as well:** Linux may modify the timeout structure; reconstruct it before reuse. The return value counts set bits across the returned sets, so one descriptor represented in two sets can be counted twice.
* **Why is the first argument `maxfdp1` ($`\mathrm{fd}_{max} + 1`$)?** `maxfdp1` specifies the *number* of descriptors to test starting from descriptor `0`. This is a descriptor-number bound, not the number of active descriptors. Because descriptors are zero-indexed ($`0, 1, \dots, \mathrm{fd}_{max}`$), the total count of descriptors to scan is $`\mathrm{fd}_{max} + 1`$ (e.g., to test `{1, 4, 5}`, `maxfdp1` is $`5 + 1 = 6`$).

#### Under What Conditions is a Socket Descriptor Ready in `select()`?

| Condition on Socket | Readable? | Writable? | Exception? |
|---|:---:|:---:|:---:|
| Data available to read in receive buffer | **Yes** (`read` returns $> 0$) | | |
| Read half of connection closed (**`FIN` received**) | **Yes** (read buffered bytes first, then `0` / EOF) | | |
| New connection completed on **listening socket** | **Yes** (an accept attempt can proceed; nonblocking mode protects against races) | | |
| Space available in send buffer for writing | | **Yes** | |
| Write half of connection closed | | **Yes** (`write` generates `SIGPIPE`) | |
| Pending socket error (**`RST` received**) | **Yes** (`read` returns `-1`, sets `errno`) | **Yes** (`write` returns `-1`, sets `errno`) | |
| TCP out-of-band (urgent) data arrived | | | **Yes** |

## Practice

- **Q027** in [quiz 05](../../quizzes/quiz_05_socket_api.json); flags: `wording_issue`.
- **Q028** in [quiz 05](../../quizzes/quiz_05_socket_api.json); flags: `wording_issue`.
- **Q029** in [quiz 05](../../quizzes/quiz_05_socket_api.json).
- **Q037** in [quiz 05](../../quizzes/quiz_05_socket_api.json); flags: `wording_issue`.
- **Q038** in [quiz 05](../../quizzes/quiz_05_socket_api.json); flags: `wording_issue`.
- **Q042** in [quiz 05](../../quizzes/quiz_05_socket_api.json); also requires [lesson 25](25_readn.md).
- **Q062** in [quiz 05](../../quizzes/quiz_05_socket_api.json).

Check the [review queue](review.md) before scored practice. A lesson link can teach the reasoning that exposes a false premise or key; it does not endorse that key. Optional background is listed separately in the [manifest](manifest.json).

## Source

- [Lecture: 6.2 The `select()` System Call and Descriptor Readiness Conditions](../../lectures/lecture_05_socket-api.md#62-the-select-system-call-and-descriptor-readiness-conditions)

[Topic overview](README.md) · [Glossary](glossary.md) · [References](references.md) · [Previous lesson](30_io_models.md) · [Next lesson](32_select_client.md)
