# MRStay AI

> **AI Sales Assistant Platform for Real Estate**  
> An Agentic AI system built for **Mooncee** to automate customer interactions, lead qualification, property recommendations, marketing assistance, and sales operations.

---

# Overview

MRStay AI is designed to streamline the real estate sales process using multiple AI agents working together through an orchestrated workflow.

The platform aims to:

- Automate customer conversations
- Recommend suitable properties
- Qualify leads
- Schedule follow-ups
- Support marketing activities
- Generate business insights
- Maintain conversational memory
- Assist sales teams

---

# Current Project Status

**Current Development Phase:** Week 1

### Week 1 Architecture

```text
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

Current objective:

- Project setup
- Development environment
- RAG foundation
- Document ingestion
- Semantic search
- Gemini integration

---

# Target Architecture

```text
Customer
      │
      ▼
Reception Agent
      │
      ▼
Intent Detection
      │
      ▼
Agent Orchestrator
      │
      ▼
────────────────────────────────────
│ Property Agent                   │
│ Lead Qualification Agent         │
│ Marketing Agent                  │
│ Customer Support Agent           │
────────────────────────────────────
      │
      ▼
Tool Manager
(WhatsApp • CRM • Email • Calendar)
      │
      ▼
RAG + Vector Database
      │
      ▼
Memory
      │
      ▼
Analytics Dashboard
```

Detailed diagrams are available in:

```
docs/03_Architecture/
```

---

# Technology Stack

| Layer | Technology |
|--------|------------|
| Language | Python |
| Backend | FastAPI |
| Frontend | HTML, CSS, JavaScript |
| AI Framework | LangGraph / Custom Agent Orchestrator |
| LLM | Google Gemini |
| Vector Database | ChromaDB |
| Database | PostgreSQL |
| Version Control | Git & GitHub |

---

# Project Structure

```
MRStay-AI/
│
├── assets/
├── docs/
│
├── scripts/
├── src/
│   ├── ai/
│   ├── backend/
│   ├── database/
│   ├── deployment/
│   ├── frontend/
│   ├── rag/
│   └── shared/
│
├── tests/
│
├── .env.example
├── .gitignore
├── CHANGELOG.md
├── CONTRIBUTING.md
├── LICENSE
├── README.md
└── requirements.txt
```

---

# Installation

## Clone Repository

```bash
git clone <repository-url>
cd MRStay-AI
```

---

## Create Virtual Environment

### Windows

```bash
python -m venv .venv
.venv\Scripts\activate
```

### Linux / macOS

```bash
python3 -m venv .venv
source .venv/bin/activate
```

---

## Install Dependencies

```bash
pip install -r requirements.txt
```

---

## Configure Environment

Copy

```
.env.example
```

to

```
.env
```

and update the required API keys.

---

## Run RAG Ingestion

```bash
python src/rag/ingestion/ingest.py
```

---

## Run Backend

```bash
uvicorn src.backend.main:app --reload
```

---

# Development Workflow

- Create a feature branch

```
feature/<feature-name>
```

- Write small and meaningful commits
- Push regularly
- Open Pull Requests
- Perform code reviews before merge

Never commit:

- `.env`
- `.venv/`
- `__pycache__/`
- Vector Database files
- API keys
- Credentials

---

# Roadmap

## Week 1

- Project Initialization
- Git & GitHub Setup
- Environment Setup
- RAG Foundation
- ChromaDB
- Gemini Integration

---

## Week 2

- FastAPI
- REST APIs
- Chat Interface
- API Integration

---

## Week 3

- Agent Orchestrator
- Reception Agent
- Property Agent
- Lead Agent
- Marketing Agent

---

## Week 4

- CRM Integration
- WhatsApp Integration
- Email Integration
- Calendar Integration

---

## Future Scope

- Voice Assistant
- Analytics Dashboard
- Multi-language Support
- Human Handover
- Performance Monitoring
- Deployment
- CI/CD Pipeline

---

# Documentation

Project documentation is available inside:

```
docs/
```

including:

- Project Documents
- Software Requirement Specification (SRS)
- System Architecture
- Research
- API Design
- Testing
- Deployment

---

# Contributing

Please follow the project's coding standards and Git workflow before submitting changes.

---

# License

This project is developed for Mooncee.

All rights reserved.

---

# Maintainer

Nitish Kumar

AI Intern

Mooncee