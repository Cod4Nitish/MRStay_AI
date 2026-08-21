# MRStay AI — Enterprise Knowledge Base

> Internal knowledge base for the MRStay AI platform, maintained for retrieval-augmented generation (RAG) via ChromaDB and Google Gemini. This document distinguishes between **Implemented** capabilities and **Planned / Future Roadmap** capabilities. Do not present Planned items as currently available functionality.

---

# 1. Company Overview

## 1.1 Company Introduction

MRStay AI is an agentic AI sales assistant platform being developed for **Mooncee**, a UAE-based e-commerce company expanding into AI-driven products. MRStay AI targets the real estate industry, where property developers, brokers, and consultants need to manage high volumes of customer inquiries, qualify leads, and coordinate sales activity across multiple communication channels.

The platform is currently in **Week 1 of active development**, with the core Retrieval-Augmented Generation (RAG) foundation implemented and the multi-agent architecture designed and approved for build-out.

## 1.2 Mission

To give real estate sales teams an AI-native operating layer that handles first-line customer conversations, qualifies leads automatically, and keeps every property inquiry moving toward a booked outcome — without adding headcount.

## 1.3 Vision

**Status: Planned.** The long-term vision is for MRStay AI to become the default AI sales layer for real estate businesses operating across WhatsApp, web chat, and email — replacing manual first-response work with a coordinated set of specialized AI agents supervised by human sales managers.

## 1.4 Core Values

- **Accuracy over speed** — retrieval-grounded answers (via RAG) rather than unconstrained generation, to reduce hallucinated property details.
- **Human-in-the-loop by design** — AI agents qualify and route; final sales decisions remain human-owned.
- **Transparency** — every AI response should be traceable back to source documents (property listings, policy documents).
- **Iterative delivery** — build in small, testable phases rather than large speculative releases.

## 1.5 Business Goals

| Goal | Status |
|---|---|
| Automate first-response customer conversations | Planned |
| Reduce time-to-qualify for inbound leads | Planned |
| Centralize property knowledge in a searchable RAG layer | **Implemented (foundation)** |
| Provide a real-time sales dashboard for managers | Planned |
| Integrate with WhatsApp, CRM, Email, Calendar | Planned |

## 1.6 Long-Term Roadmap

**Status: Planned.** See Section 3.9 and the platform Roadmap document for phase-by-phase detail. In summary:

1. RAG foundation and semantic search (in progress)
2. FastAPI backend and chat interface
3. Multi-agent orchestration (Reception, Property, Lead, Marketing, Sales Manager)
4. Tool integrations (WhatsApp, CRM, Calendar, Email)
5. Analytics dashboard and reporting
6. Voice assistant and multi-language support (future scope)

## 1.7 Why MRStay AI Was Built

Real estate sales teams typically lose leads in the first few minutes of an inquiry due to slow manual response times. Property consultants are often unavailable outside business hours, and lead qualification is inconsistent across team members. MRStay AI was conceived to close this gap with an AI system that can respond instantly, ask qualifying questions in a consistent way, and hand off only genuinely interested leads to human sales staff.

## 1.8 Industry Problems

- **Slow response times**: Manual reception of inquiries delays first contact, and delayed responses correlate strongly with lost conversions in real estate.
- **Inconsistent lead qualification**: Different sales staff ask different questions, producing uneven lead quality data.
- **Fragmented tools**: Property inquiries arrive across WhatsApp, email, and web forms, with no unified system tracking them.
- **Knowledge silos**: Property details, pricing, and availability often live in spreadsheets or the memory of individual agents rather than a searchable system.

## 1.9 Business Opportunities

- Real estate brokers and developers are actively seeking AI-based automation to cut operating costs on sales support staff.
- A RAG-grounded assistant can reduce the risk of AI systems giving incorrect property information, a common objection from real estate businesses evaluating AI tools.
- Multi-agent orchestration allows the platform to expand feature-by-feature (marketing, analytics, CRM) without re-architecting the core system.

---

# 2. Platform Overview

## 2.1 What Is MRStay AI

MRStay AI is an AI sales assistant platform for real estate businesses. It is **not** a hotel or short-stay booking platform — the name reflects an earlier product direction that was corrected during planning. The current product scope is B2B: real estate developers, brokers, and property consultants use MRStay AI to automate customer-facing sales conversations.

## 2.2 Main Features

| Feature | Status |
|---|---|
| Document ingestion into a vector database | **Implemented** |
| Semantic property search via RAG | **Implemented (foundation)** |
| Gemini-powered conversational responses | **Implemented (foundation)** |
| Chat interface (web) | Planned |
| FastAPI backend with `/query` endpoint | Planned |
| Reception Agent (intent detection, first response) | Planned |
| Property Consultant Agent | Planned |
| Lead Qualification Agent | Planned |
| Follow-up Agent | Planned |
| Marketing Agent | Planned |
| Sales Manager Agent | Planned |
| WhatsApp integration | Planned |
| CRM integration | Planned |
| Calendar integration | Planned |
| Email integration | Planned |
| Analytics dashboard | Planned |
| Memory & learning layer | Planned |

## 2.3 User Types

- **Property Consultants / Sales Staff** — receive qualified leads and manage bookings and follow-ups.
- **Sales Managers** — oversee agent performance, review analytics, and set qualification criteria. (Planned)
- **End Customers** — interact with the AI assistant via chat/WhatsApp to browse properties and ask questions.
- **System Administrators** — manage document ingestion, agent configuration, and integrations. (Planned)

## 2.4 Platform Benefits

- **Faster response**: instant AI-generated replies instead of waiting for a human agent to become available (Planned outcome, once chat interface and agents are live).
- **Grounded answers**: responses are generated using retrieved property documents rather than the model's general knowledge, reducing the chance of inaccurate property claims.
- **Consistent qualification**: a defined agent workflow asks the same qualifying questions to every lead. (Planned)
- **Centralized knowledge**: all property documents live in one searchable vector database.

## 2.5 Business Workflow

**Status: Planned**, describing the target end-to-end flow once all agents are implemented:

1. Customer sends a message (web chat or WhatsApp).
2. Reception Agent receives the message and performs intent detection.
3. Agent Orchestrator routes the request to the appropriate specialist agent (Property, Lead, Marketing).
4. The specialist agent uses the RAG layer to retrieve relevant property or policy information.
5. Tool Manager executes any needed actions (schedule a viewing, log to CRM, send WhatsApp confirmation).
6. The conversation and outcome are stored in the Memory & Learning layer.
7. Results appear on the Analytics dashboard for sales managers.

## 2.6 AI Capabilities

**Currently Implemented:**
- Document chunking and ingestion into ChromaDB.
- Embedding generation using Gemini's embedding model.
- Semantic retrieval of relevant document chunks for a given query.
- Context-grounded response generation using the Gemini generative model.

**Planned:**
- Multi-turn conversational memory.
- Multi-agent task routing and orchestration.
- Structured lead scoring.
- Tool-calling (WhatsApp send, CRM write, calendar scheduling).

---

# 3. Complete System Architecture

## 3.1 Current Architecture (Week 1 — Implemented)

```
Documents
    │
    ▼
Ingest
    │
    ▼
ChromaDB
    │
    ▼
Query
    │
    ▼
Gemini
    │
    ▼
Response
```

This is the currently working pipeline: source documents (property listings, policy text) are chunked, embedded, and stored in ChromaDB. A user query is embedded, matched against stored vectors, and the retrieved context is passed to Gemini to generate a grounded response.

## 3.2 Target Architecture (Planned)

```
Customer
   │
   ▼
Reception Agent
   │
   ▼
Intent Detection AI
   │
   ▼
Agent Orchestrator (Brain)
   │
   ├── Property AI
   ├── Lead AI
   └── Marketing AI
        │
        ▼
   Support AI / Follow-up AI / Sales Manager AI
   │
   ▼
Planning Engine
   │
   ▼
Tool Manager
   │
   ├── WhatsApp
   ├── CRM
   ├── Calendar
   └── Email
   │
   ▼
Knowledge + RAG Layer
   │
   ▼
Vector DB + PostgreSQL
   │
   ▼
Memory & Learning Layer
   │
   ▼
Analytics + Dashboard + Reports
```

## 3.3 Frontend

**Status: Planned.** The frontend will be a plain HTML, CSS, and JavaScript chat interface — deliberately avoiding React/Next.js per internal direction that prioritizes agent logic and functionality over frontend framework complexity. It will communicate with the backend via a `/query` REST endpoint.

## 3.4 Backend — FastAPI

**Status: Planned (design finalized).** FastAPI is the selected backend framework. Planned structure:

- `routes/` — endpoint definitions
- `services/` — business logic (agent calls, RAG calls, tool calls)
- `models/` — data models
- `middleware/` — request/response middleware
- `config/` — settings and environment loading

## 3.5 REST APIs

**Status: Planned.** The primary planned endpoint is `POST /query`, which accepts a customer message, performs RAG retrieval, and returns a Gemini-generated response. Additional endpoints (agent-specific routes, CRM webhook receivers, WhatsApp webhook receivers) are planned for later phases.

## 3.6 Authentication

**Status: Planned.** The current prototype has no authentication layer (it is an internal development prototype). Production deployment will require API-level authentication before external exposure; the specific mechanism (API keys, OAuth, JWT) has not yet been finalized.

## 3.7 Dashboard

**Status: Planned.** A separate internal engineering dashboard is planned to track sprint progress, task status, git activity, documentation, AI module health, and analytics — distinct from the customer-facing product.

## 3.8 AI Layer

**Status: Partially Implemented.** The Gemini generative model is integrated for response generation, and the Gemini embedding model is integrated for document/query embedding. The multi-agent orchestration layer that would coordinate specialized agents has not yet been built.

## 3.9 Knowledge Base

**Status: Implemented (foundation).** Source documents are stored as plain text files, chunked by word count, embedded via Gemini, and persisted in a local ChromaDB collection (`mrstay_properties`).

## 3.10 RAG (Retrieval-Augmented Generation)

**Status: Implemented (foundation).** See Section 3.1 for the current pipeline. Retrieval currently returns the top-N most similar chunks (default N=3) for a given query, which are concatenated into the Gemini prompt as context.

## 3.11 Gemini

**Status: Implemented.** Google's Gemini API is used for both embeddings (`text-embedding-004`) and generation (`gemini-2.0-flash`, subject to change as models are evaluated).

## 3.12 ChromaDB

**Status: Implemented.** ChromaDB is used as the vector database, running as a local persistent client. Production deployment configuration (hosted ChromaDB, backup strategy) is Planned.

## 3.13 PostgreSQL

**Status: Planned.** PostgreSQL is the selected relational database for structured data (leads, bookings, users, CRM records) but has not yet been integrated into the running system.

## 3.14 Redis

**Status: Planned.** Redis has been discussed as a potential caching layer for RAG query results and session state, to be introduced only if query latency becomes a measurable issue.

## 3.15 Monitoring

**Status: Planned.** No monitoring system is currently integrated. Planned capabilities include basic health checks and system status visibility on the internal engineering dashboard.

## 3.16 Logging

**Status: Planned.** Structured logging of chat interactions, agent decisions, and errors is planned to support both debugging and the analytics layer.

## 3.17 Analytics

**Status: Planned.** Planned analytics include lead conversion rates, response time metrics, agent-level performance, and property inquiry trends.

## 3.18 Data Flow (Current Implementation)

> **Note:** This section describes only the Week 1 RAG pipeline that is actually running today.

1. A source document (plain text) is placed in the ingestion folder.
2. The ingestion script splits the document into fixed-size word chunks (default: 500 words per chunk) to keep each chunk within a reasonable context size for embedding and retrieval.
3. Each chunk is sent to the Gemini embedding model, which returns a numeric vector representation.
4. The chunk text, its embedding, and basic metadata (source filename) are stored in a ChromaDB collection.
5. At query time, the incoming user message is embedded using the same embedding model.
6. ChromaDB performs a similarity search and returns the top-N most relevant chunks.
7. The retrieved chunks are concatenated into a prompt template along with the user's question.
8. The prompt is sent to the Gemini generative model, which produces the final response.

> **Best Practice:** Keep chunk size consistent between ingestion runs. Re-ingesting with a different chunk size without clearing the existing collection can lead to inconsistent retrieval quality, since old and new chunk boundaries will not align.

> **Warning:** The current prototype has no deduplication logic. Re-running the ingestion script on the same source files without clearing the collection first will create duplicate entries and can degrade retrieval quality.

## 3.19 Deployment Considerations (Planned)

No production deployment configuration exists yet. Items that will need to be decided before any production deployment:

- Hosting environment for the FastAPI backend (containerized deployment is the current default assumption).
- Whether ChromaDB runs locally on the same host or as a separate hosted service.
- PostgreSQL hosting and backup strategy.
- Reverse proxy / TLS termination (an `nginx` configuration folder already exists in the repository structure as a placeholder for this).
- Secrets management for API keys in production (current development approach of a local `.env` file is not suitable for production).

## 3.20 Security Considerations

> **Warning:** API keys (including the Gemini API key) must never be committed to version control. The project's `.gitignore` is configured to exclude `.env` files, but any script that hardcodes a key directly in source code bypasses this protection. All scripts should read credentials from environment variables, never from literals in code.

- **Status: Planned.** Formal authentication and authorization for the API layer.
- **Status: Planned.** Rate limiting on public-facing endpoints, to prevent abuse once the chat interface is live.
- **Status: Planned.** Input sanitation for any user-submitted text before it is used in prompts, to reduce prompt-injection risk once the system is customer-facing.
- **Current state:** the prototype runs locally, is not internet-exposed, and has no customer data flowing through it yet, which limits current-stage security risk to credential handling.

## 3.21 Scalability Considerations (Planned)

The current ChromaDB setup uses a local persistent client suitable for development and small-scale testing. As document volume and query traffic grow, the following will need evaluation:

- Migrating from a local ChromaDB instance to a hosted/managed vector database service.
- Introducing a caching layer (Redis, see Section 3.14) if repeated queries create measurable latency.
- Horizontal scaling of the FastAPI backend behind a load balancer once traffic patterns are understood.

---

# 4. AI Modules

All AI agents described in this section are **Planned**; none are currently implemented as working agents. Architecture and responsibilities have been designed and approved.

## 4.1 Reception Agent

**Purpose:** First point of contact for every incoming customer message.

**Responsibilities:**
- Receive the raw customer message.
- Perform intent classification (property inquiry, pricing question, booking request, general question).
- Pass classified intent to the Agent Orchestrator for routing.

**Inputs:** Raw customer text message (chat or WhatsApp).

**Outputs:** Structured intent object (intent type, extracted entities, original message).

**Workflow:** Customer message → intent detection → orchestrator routing.

**Example User Request:** "Do you have any 2BHK apartments in Noida under 50 lakh?"

**Expected Response:** Routed to Property Agent with entities `{type: 2BHK, location: Noida, budget: 5000000}`.

**Error Handling (Planned):** If intent cannot be confidently classified, fall back to a clarifying question rather than guessing.

**KPIs (Planned):** Intent classification accuracy, average time-to-route.

**Future Improvements:** Multi-language intent detection; sentiment detection to flag frustrated customers for human handoff.

## 4.2 Sales Agent

**Purpose:** Drive qualified leads toward a scheduled viewing or booking conversation.

**Responsibilities:** Present relevant property options, answer follow-up questions using RAG-retrieved context, and propose next steps (site visit, call with a human consultant).

**Inputs:** Qualified lead profile, property inquiry context.

**Outputs:** Proposed next action (schedule viewing, escalate to human, send more listings).

**Workflow:** Receives handoff from Lead Qualification Agent → retrieves matching properties via RAG → proposes next step.

**Example User Request:** "This looks good, can I see it this weekend?"

**Expected Response:** Trigger scheduling flow (via Calendar integration, once built).

**Error Handling (Planned):** If no matching property exists, respond honestly and offer to notify the customer when a match becomes available, rather than fabricating a listing.

**KPIs (Planned):** Conversion rate from inquiry to scheduled viewing.

**Future Improvements:** Personalized property ranking based on stated preferences.

## 4.3 Lead Qualification Agent

**Purpose:** Determine whether an inbound inquiry represents a genuine, sales-ready lead.

**Responsibilities:** Ask structured qualifying questions (budget, timeline, financing status, location preference) and score the lead.

**Inputs:** Conversation history, customer responses.

**Outputs:** Lead score and qualification status (qualified / needs nurturing / not a fit).

**Workflow:** Triggered after Reception Agent detects a property inquiry intent → asks qualifying questions → produces a lead score.

**Example User Request:** "I'm looking to buy in the next 2 months, budget around 60 lakh."

**Expected Response:** Lead marked qualified, budget and timeline recorded, handed to Sales Agent.

**Error Handling (Planned):** Incomplete answers should not block progress — partial qualification data should still be stored and the conversation should continue naturally.

**KPIs (Planned):** Qualification accuracy versus actual sales outcomes, average questions needed to qualify.

**Future Improvements:** Predictive lead scoring using historical conversion data.

## 4.4 Booking Agent

**Purpose:** Coordinate the scheduling and confirmation of property viewings or reservations.

**Responsibilities:** Check consultant/agent availability, confirm viewing slots, send confirmations.

**Inputs:** Customer-selected time slot, property ID, consultant availability data.

**Outputs:** Confirmed booking record, calendar entry, confirmation message to customer.

**Workflow:** Triggered when a customer agrees to a viewing → checks calendar → confirms → notifies both parties.

**Example User Request:** "Can I come Saturday at 4pm?"

**Expected Response:** Confirmation if the slot is available, or alternative slot suggestions if not.

**Error Handling (Planned):** Double-booking prevention; graceful handling of calendar API failures with a fallback to manual confirmation.

**KPIs (Planned):** Booking completion rate, no-show rate.

**Future Improvements:** Automated reminder messages before scheduled viewings.

## 4.5 Customer Support Agent

**Purpose:** Handle post-inquiry and post-booking questions that are not sales-driven (documentation questions, process questions, complaints).

**Responsibilities:** Answer procedural questions using the knowledge base; escalate complaints to a human.

**Inputs:** Customer message, account/booking context if available.

**Outputs:** Direct answer or escalation ticket.

**Workflow:** Routed from Reception Agent when intent is classified as support rather than sales.

**Example User Request:** "What documents do I need for the site visit?"

**Expected Response:** RAG-retrieved answer from policy documentation.

**Error Handling (Planned):** Any complaint-classified message is escalated to a human rather than handled fully by AI.

**KPIs (Planned):** First-contact resolution rate, escalation rate.

**Future Improvements:** Sentiment-based prioritization of support escalations.

## 4.6 Analytics Agent

**Purpose:** Aggregate conversation and outcome data into reporting metrics for sales managers.

**Responsibilities:** Compute conversion funnels, response time metrics, and agent performance summaries.

**Inputs:** Stored conversation logs, lead records, booking records.

**Outputs:** Structured metrics for the Analytics dashboard.

**Workflow:** Runs as a background/batch process over stored data (exact schedule not yet defined).

**Example User Request:** N/A (internal, not customer-facing).

**Expected Response:** N/A.

**Error Handling (Planned):** Metrics computation should degrade gracefully with incomplete data rather than failing entirely.

**KPIs (Planned):** Report generation reliability, data freshness.

**Future Improvements:** Predictive forecasting of monthly conversions.

## 4.7 Admin Agent

**Purpose:** Support system administrators with configuration and monitoring tasks.

**Responsibilities:** Surface system health (RAG pipeline status, agent status, integration status) and allow configuration changes (e.g., updating qualifying questions).

**Inputs:** Admin commands/requests via the internal dashboard.

**Outputs:** Configuration changes, system status reports.

**Workflow:** Not yet defined in detail; expected to be dashboard-driven rather than conversational.

**Example User Request:** "Show me RAG pipeline health."

**Expected Response:** Status of FastAPI, Gemini connectivity, ChromaDB, document/embedding counts.

**Error Handling (Planned):** Not yet defined.

**KPIs (Planned):** Not yet defined.

**Future Improvements:** Role-based access control for admin actions.

## 4.8 Agent Communication Protocol (Planned)

> **Note:** The exact inter-agent message format has not been finalized. The description below reflects the intended design direction, not a built specification.

All planned agents are expected to communicate through the Agent Orchestrator rather than directly with one another, to keep routing logic centralized and auditable. Each agent is expected to receive:

- A structured **context object** containing the conversation history relevant to the current task.
- A **task instruction** describing what the agent should accomplish (e.g., "qualify this lead" or "retrieve matching properties for this budget/location").

Each agent is expected to return:

- A **result payload** (structured data specific to the agent's function).
- A **next-action recommendation** (e.g., hand off to Sales Agent, escalate to human, request more information from the customer).

> **Best Practice:** Design each agent to be independently testable — given a fixed input context, an agent's output should be deterministic enough to unit test, even though the underlying LLM call is not fully deterministic. This is why the approved repository structure includes `tests/unit/` for per-agent testing separate from `tests/integration/` for full-workflow testing.

## 4.9 Human Handoff (Planned)

Any of the above agents may determine that a conversation should be escalated to a human sales consultant. Planned triggers for handoff include:

- The Lead Qualification Agent identifying a high-value or time-sensitive lead.
- The Customer Support Agent receiving a complaint.
- Any agent producing a low-confidence classification or response.

> **Warning:** Until human handoff logic is implemented and tested, MRStay AI should not be deployed in any context where a customer might reasonably expect to reach a human and not receive that option.

---

# 5. Property Management

**Status: Planned.** No property management module is implemented yet; the current system uses static sample text documents for RAG testing. The following describes the target design.

## 5.1 Property Registration

Property listings will be submitted with structured fields: location, type (e.g., 2BHK, 3BHK, villa), price, amenities, images, and availability status. Registration is expected to occur via an admin interface or bulk document upload into the RAG ingestion pipeline.

## 5.2 Property Approval

A review step is planned before a listing becomes visible to the AI assistant, to prevent inaccurate or incomplete listings from being surfaced to customers.

## 5.3 Availability

Each property record will include an availability status (available, under offer, sold/leased) that must be kept current, since the AI assistant will state availability directly to customers.

## 5.4 Pricing

Pricing will be stored as structured numeric data (not only free text) so that budget-based filtering can be performed reliably during retrieval and lead qualification.

## 5.5 Amenities

Amenities will be stored as a structured list per property (e.g., gym, pool, parking, security) to support both retrieval and structured filtering.

## 5.6 Images

**Status: Planned.** Image storage and delivery mechanism not yet finalized; images are expected to be referenced by URL rather than embedded directly in RAG documents.

## 5.7 Booking Rules

Rules governing minimum notice period for viewings, cancellation windows, and deposit requirements are planned but not yet defined in detail.

## 5.8 Cancellation Rules

**Status: Planned.** To be defined in coordination with the business team; will govern how the Booking Agent handles cancellation requests.

## 5.9 Reviews

**Status: Planned.** Customer reviews of properties or the sales experience are a future consideration, not part of the current build phases.

## 5.10 Ratings

**Status: Planned.** Same status as Reviews — future scope.

## 5.11 Ownership

**Status: Planned.** Tracking of property ownership/listing agent association is expected to be part of the PostgreSQL schema once implemented.

## 5.12 Property Lifecycle

**Status: Planned.** Target lifecycle: Draft → Under Review → Approved → Listed → Under Offer → Sold/Leased → Archived.

---

# 6. Customer Management

**Status: Planned**, except where noted.

## 6.1 Lead Generation

Leads originate from customer-initiated conversations via the chat interface (planned) and, later, WhatsApp. There is currently no live lead generation channel; the RAG prototype is tested manually.

## 6.2 Lead Qualification

See Section 4.3 (Lead Qualification Agent). Qualification logic is designed but not yet implemented.

## 6.3 CRM

**Status: Planned.** No CRM integration currently exists. The target design stores lead and customer records with conversation history, qualification status, and assigned sales consultant.

## 6.4 Customer Lifecycle

**Status: Planned.** Target stages: Inquiry → Qualified Lead → Scheduled Viewing → Negotiation → Booking/Sale → Post-Sale Support.

## 6.5 Customer Support

See Section 4.5 (Customer Support Agent).

## 6.6 Communication

**Status: Planned.** Multi-channel communication (chat, WhatsApp, email) is planned but only a basic chat interface concept currently exists in design form.

## 6.7 Notifications

**Status: Planned.** Booking confirmations, follow-up reminders, and status updates are planned notification types; delivery channel (email, WhatsApp, in-app) not yet finalized.

## 6.8 Escalation

**Status: Planned.** Any complaint or low-confidence AI response is expected to escalate to a human sales consultant rather than being resolved autonomously.

---

# 7. Booking System

**Status: Planned in full.** No booking system currently exists. The target lifecycle from customer inquiry to booking completion is as follows:

1. **Inquiry:** Customer messages the AI assistant about a property.
2. **Intent Detection:** Reception Agent classifies the message as a property inquiry.
3. **Retrieval:** Property Agent retrieves matching listings via RAG.
4. **Presentation:** Matching properties are presented to the customer with key details (price, location, amenities).
5. **Qualification:** Lead Qualification Agent gathers budget, timeline, and financing information.
6. **Scheduling Request:** Customer requests a viewing.
7. **Availability Check:** Booking Agent checks consultant and property availability (Calendar integration).
8. **Confirmation:** Booking is confirmed and both customer and consultant are notified.
9. **Viewing:** Physical or virtual property viewing occurs (outside the AI system).
10. **Follow-up:** Follow-up Agent checks in after the viewing to gauge interest.
11. **Negotiation:** Human sales consultant takes over price/terms negotiation.
12. **Booking Completion:** Deal is finalized and recorded (system of record not yet defined — likely PostgreSQL + CRM).
13. **Post-Booking:** Customer Support Agent handles any post-booking questions.

Each step above is a design target; none are currently automated in the running system.

---

# 8. Payment System

**Status: Planned in full.** No payment functionality exists in the current system. The following describes intended future scope, not current capability.

## 8.1 UPI

**Status: Planned.** UPI is intended as a supported payment method for token/booking deposits in the Indian market, subject to compliance review.

## 8.2 Credit Card

**Status: Planned.**

## 8.3 Debit Card

**Status: Planned.**

## 8.4 Net Banking

**Status: Planned.**

## 8.5 Wallet

**Status: Planned.** Specific wallet providers not yet selected.

## 8.6 Refund

**Status: Planned.** Refund policy and processing workflow have not yet been defined; will depend on the finalized cancellation rules (Section 5.8).

## 8.7 Invoices

**Status: Planned.** Automated invoice generation is a future consideration, not part of near-term development phases.

## 8.8 GST

**Status: Planned.** GST handling has not been designed. Any statements about GST compliance should be treated as aspirational until a finance/legal review is completed and implementation begins.

## 8.9 Failed Payments

**Status: Planned.** Retry logic and customer notification flows for failed payments are not yet designed.

## 8.10 Security

**Status: Planned.** Payment security will need to follow standard practices (PCI-DSS-aligned handling via a payment gateway provider rather than storing card data directly) once a provider is selected. No payment security implementation currently exists.

---

# 9. Best Practices & Operational Notes

This section consolidates operational guidance referenced throughout the document, for quick reference during development and semantic retrieval.

## 9.1 Development Best Practices

- **Small, working commits.** Each commit should represent a working state of the code where reasonably possible, to keep the git history usable for debugging and review.
- **Feature branches.** New agents or modules should be developed on a dedicated branch (e.g., `feature/lead-qualification-agent`) rather than directly on the main branch.
- **Document before building.** Architecture and workflow for a module should be documented (even briefly) before implementation begins, so the knowledge base and the code do not drift apart.
- **Mark status honestly.** Any documentation describing a feature must clearly state whether it is Implemented, Partially Implemented, or Planned. This knowledge base follows that convention throughout.

## 9.2 RAG-Specific Best Practices

- **Consistent chunking.** Use the same chunking strategy across a given collection to keep retrieval quality predictable.
- **Source metadata.** Always store the source filename (or future source identifier) alongside each chunk, to support traceability of AI answers back to source documents.
- **Avoid over-large context.** Concatenating too many retrieved chunks into a single prompt increases cost and can dilute answer relevance; the current default of 3 retrieved chunks is a starting point, not a fixed rule.

## 9.3 Common Pitfalls (Warnings)

> **Warning:** Do not treat a Planned feature as available when communicating with stakeholders or customers. This document exists specifically to prevent that confusion internally.

> **Warning:** Do not hardcode API credentials in any script, including test/utility scripts such as model-listing scripts. Read credentials from environment variables only.

> **Warning:** Do not re-run document ingestion against an existing collection without first clearing it, unless deduplication logic has been added.

## 9.4 Glossary

| Term | Definition |
|---|---|
| RAG | Retrieval-Augmented Generation — generating AI responses grounded in retrieved documents rather than relying solely on a model's parametric knowledge. |
| Chunking | Splitting a document into smaller text segments prior to embedding, to keep each segment within an effective size for retrieval and generation. |
| Embedding | A numeric vector representation of text, used to measure semantic similarity between a query and stored documents. |
| Vector Database | A database optimized for storing and searching embeddings by similarity (ChromaDB, in this project). |
| Agent Orchestrator | The planned central component responsible for routing a customer interaction to the correct specialist AI agent. |
| Lead Qualification | The process of determining whether an inbound inquiry represents a genuine, sales-ready prospect. |
| Tool Manager | The planned component responsible for executing external actions (WhatsApp messages, CRM updates, calendar bookings) on behalf of AI agents. |
| Human Handoff | The process of escalating a conversation from an AI agent to a human sales consultant. |

---

# Frequently Asked Questions

**1. What is MRStay AI?**
MRStay AI is an AI sales assistant platform being built for real estate businesses, currently in early development (Week 1) with a working RAG foundation.

**2. Is MRStay AI a hotel booking platform?**
No. An earlier product direction considered hotel/stay booking, but the current scope is real estate sales assistance.

**3. Who is building MRStay AI?**
It is being developed as an internship project at Mooncee, a UAE-based e-commerce company expanding into AI products.

**4. What AI model powers MRStay AI?**
Google Gemini is used for both embeddings and response generation.

**5. What vector database does MRStay AI use?**
ChromaDB, run as a local persistent client during development.

**6. Is the multi-agent system live yet?**
No. The multi-agent architecture is designed and approved but not yet implemented.

**7. What backend framework will MRStay AI use?**
FastAPI (Python), planned but not yet fully implemented.

**8. What frontend technology does MRStay AI use?**
Plain HTML, CSS, and JavaScript — deliberately avoiding React/Next.js to prioritize agent logic over frontend complexity.

**9. Does MRStay AI currently support WhatsApp?**
No, WhatsApp integration is planned for a later development phase.

**10. Does MRStay AI have a CRM?**
Not yet. CRM integration is planned.

**11. Can MRStay AI schedule property viewings automatically?**
Not yet — the Booking Agent and Calendar integration are planned features.

**12. Does MRStay AI process payments?**
No. Payment functionality is entirely in the planning stage.

**13. What is the current architecture of MRStay AI?**
Documents → Ingest → ChromaDB → Query → Gemini → Response — the Week 1 RAG pipeline.

**14. What is the target architecture?**
Customer → Reception Agent → Intent Detection → Agent Orchestrator → specialist agents → Tool Manager → RAG/Vector DB → Memory Layer → Analytics Dashboard.

**15. How does MRStay AI avoid giving incorrect property information?**
By grounding responses in retrieved documents via RAG rather than relying solely on the model's general knowledge.

**16. What is the Reception Agent responsible for?**
Receiving customer messages and classifying intent before routing to a specialist agent. (Planned)

**17. What is the Lead Qualification Agent responsible for?**
Asking structured qualifying questions and scoring leads based on budget, timeline, and other criteria. (Planned)

**18. What is the Sales Agent responsible for?**
Presenting relevant properties and driving qualified leads toward a scheduled viewing. (Planned)

**19. What is the Booking Agent responsible for?**
Coordinating scheduling and confirmation of property viewings. (Planned)

**20. What is the Customer Support Agent responsible for?**
Answering procedural questions and escalating complaints to humans. (Planned)

**21. What is the Analytics Agent responsible for?**
Aggregating conversation and outcome data into reporting metrics. (Planned)

**22. What is the Admin Agent responsible for?**
Supporting system administrators with configuration and monitoring. (Planned)

**23. What database will store structured data like leads and bookings?**
PostgreSQL, planned but not yet integrated.

**24. Is there a caching layer?**
Not yet. Redis is being considered if query latency becomes an issue.

**25. Is there authentication on the current prototype?**
No. The current prototype is an internal development build with no auth layer.

**26. Will MRStay AI support multiple languages?**
This is listed as future scope, not part of near-term development.

**27. Will MRStay AI have a voice assistant?**
This is listed as future scope, not part of near-term development.

**28. How are property documents currently ingested?**
Text files are chunked by word count, embedded via Gemini, and stored in a ChromaDB collection.

**29. How many chunks are retrieved per query currently?**
The current default is the top 3 most similar chunks.

**30. What embedding model is used?**
Gemini's `text-embedding-004` model.

**31. What generative model is used?**
Gemini's `gemini-2.0-flash` model (subject to change as models are evaluated).

**32. Is there a dashboard for sales managers?**
Not yet — the customer-facing analytics dashboard is planned.

**33. Is there a separate internal engineering dashboard?**
Yes, one is planned to track sprint progress, task status, git activity, and AI module health — separate from the customer-facing product.

**34. What is the Tool Manager?**
A planned component of the target architecture responsible for executing actions like sending WhatsApp messages, updating the CRM, or booking calendar slots.

**35. What is the Memory & Learning Layer?**
A planned component intended to retain conversational context and outcomes across interactions.

**36. How does MRStay AI handle a question it cannot answer from retrieved documents?**
The intended behavior is to respond honestly that the information is not available rather than fabricating an answer; this is a design principle, not yet a tested production behavior.

**37. Does MRStay AI currently support property image search?**
No. Image handling is entirely in the planning stage.

**38. Will there be a property approval workflow?**
Yes, planned — a review step before a listing becomes visible to the AI assistant.

**39. What happens to unqualified leads?**
Planned design: they are marked "needs nurturing" rather than discarded, for potential future follow-up.

**40. What is the expected timeline for the current build phase?**
Internally targeted at roughly one to two months for core agent functionality, followed by a testing phase.

**41. Will there be automated testing for the AI agents?**
Yes, a `tests/` directory (unit, integration, api) is part of the approved repository structure.

**42. What repository structure does the project follow?**
A structure with `docs/`, `src/` (frontend, backend, ai, rag, database, deployment, shared), and `tests/` at the root, with per-module README files.

**43. Are API keys stored in the codebase?**
No — API keys are intended to be stored only in a local `.env` file, excluded from version control via `.gitignore`.

**44. What license governs this project?**
It is developed exclusively for Mooncee; all rights reserved.

**45. Who maintains this project?**
An AI intern at Mooncee is the current maintainer during initial development.

**46. Will MRStay AI support refunds?**
Refund handling is planned but not yet designed in detail.

**47. Will invoices be generated automatically?**
This is planned as a future consideration, not part of near-term development.

**48. How will payment security be handled?**
The intended approach is to rely on a compliant third-party payment gateway rather than storing card data directly, once a provider is selected.

**49. Is MRStay AI currently in production?**
No. It is in early internal development (Week 1), not deployed to production or handling real customers.

**50. Where can more detail on any planned feature be found?**
In the project's internal documentation folders (`docs/`), which track architecture, requirements, and phase-by-phase roadmap in more detail than this knowledge base.

---

# Appendix A: Phase-by-Phase Roadmap Detail

> **Note:** Timelines below are internal targets and may shift as development progresses. This table should be updated as phases complete rather than treated as fixed.

| Phase | Focus | Key Deliverables | Status |
|---|---|---|---|
| Week 1 | Project Setup & RAG Foundation | Git/GitHub setup, repository structure, document ingestion script, retrieval script, Gemini integration | **In Progress** |
| Week 2 | Backend & Interface | FastAPI application, `/query` endpoint, basic chat interface (HTML/CSS/JS) | Planned |
| Week 3+ | Agent Layer | Reception Agent, Intent Detection, Agent Orchestrator, first working agent-to-agent handoff | Planned |
| Later Phases | Tool Integrations | WhatsApp, CRM, Calendar, Email integrations via Tool Manager | Planned |
| Later Phases | Memory & Analytics | Memory & Learning layer, PostgreSQL integration, Analytics dashboard | Planned |
| Testing Phase | Quality Assurance | Unit tests per agent, integration tests for full workflows, API endpoint tests | Planned |
| Future Scope | Expansion | Voice assistant, multi-language support, human handover tooling, CI/CD pipeline, formal deployment | Planned |

# Appendix B: Document Maintenance

This knowledge base is intended to be re-ingested into ChromaDB whenever a Planned feature moves to Implemented status, so that the AI system's own answers about itself remain accurate. When updating this document:

1. Change the relevant status marker (Planned → Partially Implemented → Implemented).
2. Update the corresponding FAQ answer if one exists.
3. Update Appendix A's status column.
4. Re-run the ingestion script against this file so retrieval reflects the change.

> **Best Practice:** Treat this document as a living artifact, not a one-time deliverable. Stale status markers are more misleading than no documentation at all, since they will be presented to end users as grounded fact through the RAG pipeline.
