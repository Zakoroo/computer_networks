# SDN glossary

Retained from the [source guide](../../lectures/lecture_06_sdn.md#glossary). Definitions are course context, not extra evidence that an otherwise missing mechanism is taught.

## Glossary

| Term | Full name | Meaning |
|---|---|---|
| 4D | 4D Network Architecture | A mid-2000s clean-slate architecture (Princeton/CMU) separating network control into four planes (Decision, Dissemination, Discovery, Data), laying conceptual groundwork for SDN. |
| ACL | Access Control List | A list of packet-filtering rules specifying which traffic is permitted or denied across a network interface or router. |
| Active Networking | Active Networking | A 1990s research initiative that first attempted to make networks programmable by demultiplexing packets to custom software programs running on switches. |
| AS | Autonomous System | An independently operated network domain participating in inter-domain routing via BGP. |
| BGP | Border Gateway Protocol | The standard inter-domain routing protocol of the Internet, which advertises prefix reachability and path attributes under policy and exchanges routes with configured peers and propagates permitted reachability across many ASes. |
| Buffer ID | OpenFlow Packet Buffer Identifier | An identifier assigned by an OpenFlow switch to a packet temporarily stored in local switch memory while awaiting a forwarding decision from the controller. |
| Control Plane | Network Control Plane | The logic and software that computes forwarding state (routing tables, paths, failure recovery) and determines how and where packets should be forwarded. |
| Control Program | SDN Control Application | An application running on top of the Network OS (via the northbound interface) that takes a global network view as input and outputs device configurations or policy decisions. |
| Data Plane | Network Data (Forwarding) Plane | The high-speed hardware subsystem (line cards, switching fabric) that processes and delivers individual packets based on local forwarding state. |
| Dijkstra's Algorithm | Dijkstra's Shortest-Path Algorithm | Graph algorithm executed by link-state routing protocols (OSPF, IS-IS) to compute shortest-path trees from a global topology map. |
| Ethane / SANE | Ethane and SANE | Stanford/Berkeley enterprise security architectures (2006–2007) using a centralized controller to enforce flow-level access control; direct precursors to OpenFlow. |
| `Flow-MOD` | OpenFlow Modify Flow Entry Message | Control message sent by an OpenFlow controller to a switch to install, modify, or delete a `<Match, Action>` rule in the switch's flow table. |
| Flow Table | OpenFlow Switch Flow Table | Hardware/software table inside an SDN switch containing prioritized `<Rule, Action, Statistics>` entries used to process arriving packets. |
| ForCES | Forwarding and Control Element Separation | An IETF working group and standard (2003–2007) defining open interfaces between separated control and forwarding elements. |
| Hard Timeout | OpenFlow Hard Timeout | A flow-entry timer that deletes a rule from the switch's flow table after a fixed number of seconds, regardless of whether packets are matching the rule. |
| Idle Timeout | OpenFlow Idle Timeout | A flow-entry timer that deletes a rule from the switch's flow table if no packets match the rule for a specified number of seconds. |
| In-Band Control | In-Band SDN Control Plane | An SDN deployment mode in which control traffic between switches and the controller shares the same physical links and ports as regular data-plane traffic. |
| IS-IS | Intermediate System to Intermediate System | A distributed link-state interior gateway routing protocol. |
| Management Plane | Network Management Plane | The human-timescale layer responsible for configuring, tuning, provisioning devices, setting link weights for traffic engineering, and defining ACL policies. |
| `<Match, Action>` | Match-Action Forwarding Primitive | The core data-plane abstraction in OpenFlow: match supported header fields (exact or masked where supported) and perform an action (forward, drop, send to controller, rewrite header). |
| Merchant Silicon | Merchant Switching Silicon | Off-the-shelf, commercially available switching chipsets (e.g., Broadcom) sold to any hardware vendor, democratizing switch manufacturing. |
| Network Hypervisor | SDN Network Hypervisor | Software layer (such as FlowVisor or Nicira NVP) that slices or virtualizes a physical SDN infrastructure so multiple tenants can run independent virtual topologies simultaneously. |
| Network OS (NOS) | Network Operating System | A distributed software system running on SDN controller servers (e.g., NOX, ONIX, Floodlight, OpenDaylight) that maintains network-wide state with implementation-dependent freshness and consistency. |
| Northbound Interface | SDN Northbound API | The programmatic interface between the SDN Controller (Network OS) and high-level network applications (Control Programs). |
| ONF | Open Networking Foundation | Industry consortium founded by major operators and tech companies (Google, Facebook, Microsoft, Deutsche Telekom, Verizon, Yahoo, etc.) to standardize OpenFlow and promote SDN. |
| OpenFlow | OpenFlow Protocol | A southbound communication protocol and forwarding abstraction between an SDN controller (control path) and switch flow tables (hardware data path). |
| OSPF | Open Shortest Path First | A widely used distributed link-state routing protocol that floods topology updates and runs Dijkstra's algorithm on every router. |
| Out-of-Band Control | Out-of-Band SDN Control Plane | An SDN deployment mode using a physically or logically separate dedicated management network to carry control traffic between the controller and switches. |
| `Packet-IN` | OpenFlow Packet-In Message | Message sent from an OpenFlow switch to the controller when configured packet-processing rules request controller delivery, including a suitable table-miss action. |
| `Packet-OUT` | OpenFlow Packet-Out Message | Message sent from an OpenFlow controller to a switch instructing it to inject or forward a specific packet out of specified switch port(s) without installing a persistent flow rule. |
| RCP | Routing Control Platform | A 2004–2005 architecture proposing logically centralized route computation within an Autonomous System. |
| SDN | Software Defined Network | A network architecture in which the control plane is decoupled from the data plane, often on separate servers, and a single logically centralized control plane controls multiple forwarding devices. |
| Southbound Interface | SDN Southbound API | The protocol interface (such as OpenFlow) between the SDN Controller (control plane) and physical/virtual network switches (data plane). |
| TCAM | Ternary Content-Addressable Memory | High-speed hardware memory in switches that supports ternary bit matching (0, 1, or don't-care); table capacity and supported fields constrain forwarding rules. |
| Traffic Engineering | Network Traffic Engineering (TE) | The process of optimizing network performance by steering traffic across paths to balance load, minimize congestion, or meet latency goals. |

[Topic overview](README.md)
