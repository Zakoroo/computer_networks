---
id: socket-api-03
topic_id: 05_socket_api
order: 3
title: "Services and port allocation"
source_classification: lecture_guide
estimated_reading_minutes: 3
prerequisite_ids: ["socket-api-02"]
---

# 3. Services and port allocation

## Learning goals

- Distinguish service ports, IANA ranges, and OS allocation rules.
- Explain port zero and the source historical examples.

**Builds on:** [lesson 02](02_clients_and_socket_pairs.md).

## Explanation

### 1.3 Port Number Ranges, Services, and Concurrent Demultiplexing

#### Servers and Well-Known Services

Many servers run as long-lived background **daemons**, often managed by a service manager; others start on demand. A server listens on its configured port, which may be a registered service port or an application-specific choice. `/etc/services` lists conventional service-to-port mappings:

| Service | Port(s) | Managed Resource | Service Provided |
|---|---|---|---|
| **Echo server** | `7` | Input buffer | Echoes back whatever bytes the client sends. |
| **Daytime server** | `13` | System clock | Returns the current date and time as a human-readable ASCII string. |
| **FTP server** | `20`, `21` | Filesystem | Stores and retrieves files (`21` = control; active-mode FTP commonly uses server source port `20` for data, while passive mode negotiates another port). |
| **Telnet server** | `23` | Terminal | Proxies an interactive terminal login session on the server machine. |
| **Mail (SMTP) server** | `25` | Email "spool" file | Receives and stores mail messages in the mail spool file. |
| **Web (HTTP) server** | `80` | Files / compute cycles (CGI) | Retrieves static files and executes CGI programs on behalf of the client. |

#### IANA and OS Port Number Allocations

TCP and UDP ports have 16-bit values, **0–65535**. IANA separates the namespace from OS rules for binding privileges and automatic allocation:

| IANA range | Name | Meaning |
| --- | --- | --- |
| 0–1023 | System ports | Assigned under IANA procedures; port 0 is reserved |
| 1024–49151 | User ports | Registered services, also governed by IANA procedures |
| 49152–65535 | Dynamic/private ports | Not assigned by IANA |

In `bind()`, requesting port **0** asks the OS to select a local port; it is not a request to run a service on port 0. Unix systems traditionally protect ports below 1024, but capabilities and configuration can grant permission without running the whole program as root.

The lecture's historical examples use BSD ephemeral ports 1024–5000, higher ports for ordinary servers, `rresvport` in 513–1023, and Solaris allocation in 32768–65535. These are implementation snapshots, not IANA rules or universal current defaults. A released port can still be subject to connection-identity and TIME_WAIT constraints.

## Practice

No native socket API quiz questions are assigned. This teaching is retained for study and revision.

Check the [review queue](review.md) before scored practice. A lesson link can teach the reasoning that exposes a false premise or key; it does not endorse that key. Optional background is listed separately in the [manifest](manifest.json).

## Source

- [Lecture: 1.3 Port Number Ranges, Services, and Concurrent Demultiplexing](../../lectures/lecture_05_socket-api.md#13-port-number-ranges-services-and-concurrent-demultiplexing)

[Topic overview](README.md) · [Glossary](glossary.md) · [References](references.md) · [Previous lesson](02_clients_and_socket_pairs.md) · [Next lesson](04_concurrent_demultiplexing.md)
