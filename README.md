# 🏨 MRStay AI

<p align="center">
AI-Powered Hospitality Platform for Intelligent Property Management, Guest Experience, and Business Automation.
</p>

<p align="center">

![Status](https://img.shields.io/badge/Status-Active%20Development-0A84FF?style=for-the-badge)

![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)

![FastAPI](https://img.shields.io/badge/FastAPI-Latest-009688?style=for-the-badge&logo=fastapi&logoColor=white)

![Frontend](https://img.shields.io/badge/Frontend-HTML%20|%20CSS%20|%20JavaScript-E34F26?style=for-the-badge)

![AI](https://img.shields.io/badge/AI-Gemini%20%2B%20RAG-blueviolet?style=for-the-badge)

![Database](https://img.shields.io/badge/PostgreSQL-ChromaDB-336791?style=for-the-badge)

![License](https://img.shields.io/badge/Repository-Private-red?style=for-the-badge)

</p>

---

# Overview

MRStay AI is an intelligent hospitality platform designed to modernize property management, guest engagement, and business operations using Artificial Intelligence.

The platform combines Retrieval-Augmented Generation (RAG), Large Language Models (LLMs), intelligent workflow automation, and modular software architecture to deliver scalable hospitality solutions.

---

# Vision

To redefine hospitality through AI-driven automation, seamless guest experiences, and intelligent business operations.

---

# Mission

- Build scalable AI solutions
- Automate repetitive workflows
- Enhance customer experiences
- Deliver secure enterprise software
- Simplify hospitality operations

---

# Core Capabilities

- 🤖 AI Sales Assistant
- 🏨 Property Recommendation Engine
- 💬 AI Customer Support
- 📊 Business Analytics
- 📚 Retrieval-Augmented Generation (RAG)
- 🧠 Conversational Memory
- 📅 Workflow Automation
- 📈 Lead Qualification
- 📧 Email Automation
- 📱 WhatsApp Integration

---

# System Architecture

```text
                    Customer
                        │
                        ▼
              Reception AI Agent
                        │
                        ▼
               Intent Detection
                        │
                        ▼
              Agent Orchestrator
                        │
 ┌─────────────┬─────────────┬─────────────┐
 │ Property AI │ Marketing AI│ Support AI │
 └─────────────┴─────────────┴─────────────┘
                        │
                        ▼
             Tool Integration Layer
      WhatsApp • CRM • Email • Calendar
                        │
                        ▼
             RAG + Chroma Vector Database
                        │
                        ▼
                   Gemini LLM
                        │
                        ▼
                Analytics Dashboard
```

---

# Technology Stack

| Layer | Technology |
|--------|------------|
| Backend | FastAPI |
| Frontend | HTML • CSS • JavaScript |
| AI Framework | LangGraph |
| LLM | Google Gemini |
| Vector Database | ChromaDB |
| Database | PostgreSQL |
| Version Control | Git & GitHub |

---

# Repository Structure

```text
MRStay-AI/

backend/
frontend/
ai/
docs/
tests/
scripts/
infrastructure/

README.md
CONTRIBUTING.md
CODE_OF_CONDUCT.md
CHANGELOG.md
```

---

# Development Workflow

```
Planning

↓

Development

↓

Unit Testing

↓

Bug Fixing

↓

Integration Testing

↓

API Testing

↓

Frontend Testing

↓

Git Commit

↓

Pull Request

↓

Deployment
```

---

# 🚀 Getting Started

## Clone the Repository

```bash
git clone https://github.com/<organization-or-username>/MRStay-AI.git
cd MRStay-AI
```

## Create a Virtual Environment

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

## Install Dependencies

```bash
pip install -r requirements.txt
```

## Configure Environment

```bash
cp .env.example .env
```

Update the required environment variables and API keys before running the application.

## Start Backend

```bash
uvicorn backend.main:app --reload
```

The API will be available at:

```
http://127.0.0.1:8000
```

# Engineering Principles

- Clean Architecture
- Modular Development
- AI First
- Security by Design
- Test Before Merge
- Documentation Driven
- Scalable Codebase

---

# Roadmap

### Phase 1

- Foundation
- RAG
- ChromaDB
- FastAPI

### Phase 2

- AI Agents
- CRM
- WhatsApp
- Dashboard

### Phase 3

- Deployment
- Monitoring
- Analytics
- Scaling

---

# Documentation

Complete documentation is available inside

```
docs/
```

---

# Contributing

Please follow the project's engineering standards before submitting code.

Read:

```
CONTRIBUTING.md
```

---

# Security

Sensitive credentials, API keys, databases, and internal documents must never be committed to Git.

---

# Repository Status

🚧 Active Development

---

© MRStay AI

Official Engineering Repository
