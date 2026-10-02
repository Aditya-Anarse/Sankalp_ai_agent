# SANKALP — Autonomous AI Marketing Employee for Businesses

> **SANKALP** is an autonomous AI marketing employee for businesses. It autonomously researches market trends, crafts multi-day campaign strategies, generates high-retention content, conducts strict quality audits, schedules and publishes across social platforms, tracks real-time performance telemetry, and continuously learns from results to improve future campaigns.

---

## ⚡ Core Autonomous Loop

```text
BUSINESS GOAL / BRIEF
          ↓
   RESEARCH AGENT (Audience & Market Trends)
          ↓
   STRATEGY AGENT (5-Day Funnel & Content Pillars)
          ↓
   CREATIVE AGENT (Reels, Carousels, Shorts, Scripts)
          ↓
   QUALITY AGENT (Brand Voice, Pricing, Safe Claims QA)
          ↓
   PUBLISHER AGENT (Scheduler & Social Dispatch)
          ↓
   PERFORMANCE AGENT (Retention & View Velocity)
          ↓
   LEARNING AGENT (Empirical Heuristic Calibration)
          ↓
   RE-PLAN (Autonomous Closed-Loop Optimization)
          ↺
```

---

## 🏛️ System Architecture

```text
Frontend (Next.js 14 App Router, TypeScript, Tailwind CSS, Three.js, Framer Motion)
                          ↓ REST API Client
FastAPI Backend (Python 3.11, SQLAlchemy 2.0, Pydantic v2, APScheduler)
                          ↓
Central Agent Orchestrator
  ├── ResearchAgent
  ├── StrategyAgent
  ├── CreativeAgent
  ├── QualityAgent
  ├── PublisherAgent
  ├── PerformanceAgent
  └── LearningAgent
                          ↓
AI Provider Layer (Google Gemini, Groq, Mock Deterministic Fallback)
                          ↓
Database (PostgreSQL / SQLite fallback) + Redis Queue
```

---

## 🛡️ Demo Mode vs Real Integrations

| Feature | Demo Mode | Real Mode (with API Keys) |
|---|---|---|
| **AI Generation** | Deterministic high-fidelity marketing synthesis (Zero API key required) | Live LLM synthesis using Google Gemini or Groq |
| **Instagram Integration** | Simulated dispatch with verified JSON payload (`is_demo_mode: True`) | Official Instagram Graph API (Requires `INSTAGRAM_CLIENT_ID` & `INSTAGRAM_CLIENT_SECRET`) |
| **YouTube Integration** | Simulated channel dispatch with preview metadata | Official YouTube Data API v3 (Requires Google OAuth credentials) |
| **Performance Analytics** | Calibrated telemetry benchmarks based on real retail datasets | Direct Instagram Graph & YouTube Analytics API sync |
| **Quality Audit** | 8 strict automated guardrails (Pricing parity, tone, safe claims, character limits) | Automated guardrails + LLM-evaluated semantic consistency |

> **Ethical Guarantee**: SANKALP **never** fakes live publishing or claims an external post was created when operating in Demo Mode. Every simulated action is explicitly stamped with `"Demo Mode"` in UI telemetry and API payloads.

---

## 🚀 3-Minute Hackathon Demo Script

1. **Landing & Onboarding**:
   - Open `http://localhost:3000`.
   - Click **Start Building** or **Workspace**.
   - View the pre-seeded **ABC Fashion Store** business profile with 3 active products (*Urban Glide Sneaker*, *Oversized Minimalist Tee*, *Summit Tech Jacket*).

2. **AI Manager (Conversational Workspace)**:
   - Navigate to **AI Manager** in the sidebar (`/workspace/ai-manager`).
   - Click or submit the prompt: *"New summer collection launched. Create a 5-day Instagram campaign."*
   - Watch SANKALP's 7 agents execute in real-time:
     - `✓ Business context & brand voice loaded`
     - `✓ Product catalog & pricing verified`
     - `→ Research Agent: Analyzed breathable footwear trend velocity`
     - `→ Strategy Agent: Built 5-day sequential funnel with 5 pillars`
     - `→ Creative Agent: Synthesized Reels, Carousels & Shorts`
     - `→ Quality Agent: Passed 100% brand voice & price parity`
   - Click **Review Campaign Timeline**.

3. **Campaign Workspace & Content Studio**:
   - Open `/campaigns` to inspect active and scheduled sprints.
   - Open `/content-studio` to preview, edit, or regenerate synthesized assets.
   - Note: Editing any copy automatically re-triggers the Quality Agent before publication is unlocked.

4. **Scheduling & Publishing**:
   - Open `/calendar` to view the sequenced drops for October 2026.
   - Click **Publish** to see immediate dispatch feedback (honestly labeled as Demo Publish).

5. **Telemetry & Learning Loop**:
   - Open `/analytics` to see retention curves and platform distributions.
   - Open `/learning` to inspect causal evidence and SANKALP's continuous prompt calibration.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | Next.js 14.2 (App Router) |
| **Language** | TypeScript 5.6 |
| **Styling & Effects** | Tailwind CSS 3.4, Framer Motion, Liquid Glass UI |
| **3D Rendering** | Three.js, React Three Fiber, Drei |
| **Backend API** | FastAPI (Python 3.11) |
| **ORM & Database** | SQLAlchemy 2.0 (PostgreSQL / SQLite) |
| **AI Providers** | Provider Abstraction (Google Gemini, Groq, Mock) |
| **Scheduler** | APScheduler / Background Workers |

---

## 💻 Local Setup Instructions

### 1. Backend Setup
```bash
cd backend

# Create & activate virtual environment (optional)
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # macOS / Linux

# Install Python requirements
pip install -r requirements.txt

# Run automated test suite
python -m pytest tests -v

# Run FastAPI backend server
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
- Backend API & Interactive Swagger Docs: `http://localhost:8000/docs`
- Health check: `http://localhost:8000/health`

### 2. Frontend Setup
```bash
# In project root
npm install

# Run automated Next.js build verification
npm run build

# Run development server
npm run dev
```
- Frontend Web App: `http://localhost:3000`

### 3. Docker Compose Setup
```bash
docker compose build
docker compose up
```

---

## 🔑 Environment Variables

Copy `.env.example` to `.env`:

```env
# Application Environment
ENVIRONMENT=development
PORT=8000
DEBUG=true
NEXT_PUBLIC_API_URL=http://localhost:8000

# Database (PostgreSQL or SQLite fallback)
DATABASE_URL=sqlite:///./sankalp.db

# Security & Authentication
SECRET_KEY=sankalp_super_secret_jwt_key_2026_change_in_production
ACCESS_TOKEN_EXPIRE_MINUTES=10080

# AI Provider Configuration ('gemini', 'groq', or 'mock')
AI_PROVIDER=mock
GEMINI_API_KEY=
GROQ_API_KEY=

# Social Platform API Integrations (Leave empty for Demo Mode)
INSTAGRAM_CLIENT_ID=
INSTAGRAM_CLIENT_SECRET=
INSTAGRAM_REDIRECT_URI=http://localhost:8000/social-accounts/instagram/callback

YOUTUBE_CLIENT_ID=
YOUTUBE_CLIENT_SECRET=
YOUTUBE_REDIRECT_URI=http://localhost:8000/social-accounts/youtube/callback
```

---

## 🛡️ Honesty & Demo Mode Guardrails

- **Zero Fake AI Claims**: Deterministic outputs are clearly attributed to Demo AI Provider when external keys are absent.
- **Honest Social Platform Integration**: If external OAuth is not configured, the system explicitly labels dispatch as simulated rather than claiming actual platform delivery.
- **Strict QA Enforcement**: Never permits publishing content that fails pricing parity, safe claims, or character limits.
- **Data Isolation**: Multi-tenant database design ensures user and workspace data remains strictly partitioned.

---

© 2026 SANKALP AI Systems. Built for next-generation autonomous business marketing.
