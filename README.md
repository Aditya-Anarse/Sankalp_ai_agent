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
| **Backend API** | FastAPI (Python 3.11/3.14) |
| **ORM & Database** | SQLAlchemy 2.0 (PostgreSQL / SQLite) |
| **AI Providers** | Google Gemini (Primary), Groq, Local SD-Turbo Image Generator |
| **Media Storage** | Cloudinary (Signed SHA1 uploads, Reachability QA) / Local fallback |
| **Scheduler** | APScheduler (Persistent AsyncIO background queue, 15s polling) |

---

## 💻 Local Setup Instructions

### 1. Backend Setup
```bash
cd backend

# Create & activate virtual environment
python -m venv .venv
.venv\Scripts\activate  # Windows
# source .venv/bin/activate  # macOS / Linux

# Install Python requirements
pip install -r requirements.txt

# Run automated test suite (30 unit & integration tests)
python -m pytest tests -v

# Run FastAPI backend server
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
- Backend API & Interactive Swagger Docs: `http://localhost:8000/docs`
- Health check: `http://localhost:8000/health`
- Scheduler Diagnostics: `http://localhost:8000/scheduler/status`

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

---

## 🔑 Environment Variables Reference

Copy `.env.example` to `.env`:

```env
# Application Environment
ENVIRONMENT=development
PORT=8000
DEBUG=true
NEXT_PUBLIC_API_URL=http://localhost:8000

# Database (PostgreSQL or SQLite fallback)
DATABASE_URL=sqlite:///./sankalp.db
# DATABASE_URL=postgresql://sankalp_user:sankalp_password@localhost:5432/sankalp_db

# Security & Authentication
SECRET_KEY=sankalp_super_secret_jwt_key_2026_change_in_production
ACCESS_TOKEN_EXPIRE_MINUTES=10080

# AI Provider Configuration ('gemini', 'groq', or 'mock')
AI_PROVIDER=gemini
IMAGE_PROVIDER=local
LOCAL_IMAGE_MODEL=sd-turbo
GEMINI_API_KEY=your_gemini_api_key_here
GROQ_API_KEY=
OPENAI_API_KEY=

# Storage & Public Media Provider (Local or Cloudinary)
STORAGE_URL=cloudinary
PUBLIC_MEDIA_BASE_URL=
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Social Platform API Integrations (Instagram Graph API)
INSTAGRAM_API_VERSION=v21.0
INSTAGRAM_CLIENT_ID=your_instagram_app_id
INSTAGRAM_CLIENT_SECRET=your_instagram_app_secret
INSTAGRAM_REDIRECT_URI=https://your-domain.ngrok.app/social-accounts/instagram/callback

# YouTube Data API v3 (Optional)
YOUTUBE_CLIENT_ID=
YOUTUBE_CLIENT_SECRET=
YOUTUBE_REDIRECT_URI=http://localhost:8000/social-accounts/youtube/callback
```

---

## 🎨 Local Image Generation Pipeline

SANKALP includes a local, deterministic Stable Diffusion generator powered by `stabilityai/sd-turbo`:
- **Engine**: Hugging Face Diffusers (`AutoPipelineForText2Image`) on PyTorch.
- **Hardware Optimization**: Runs on standard CPU with FP32 precision (`torch_dtype=torch.float32`), utilizing 1-step or 4-step EulerAncestralDiscreteScheduler for ultra-fast inference.
- **Off-Event-Loop**: Generates images inside Python `asyncio.to_thread` workers so FastAPI's async event loop is never blocked.
- **Integrity**: Produces real, high-resolution JPEG byte streams (512x512). No placeholder Unsplash URLs or mock SVGs are ever passed as generated assets.

---

## ☁️ Media Storage (Cloudinary)

Instagram Graph API requires a publicly reachable, HTTPS media URL to publish image containers.
- **Signed Uploads**: Uses server-side SHA1 signature generation with timestamp and tags (`sankalp_ai,marketing_asset`).
- **Reachability Verification**: Pre-validates every uploaded URL with a `HEAD` request before passing it to Meta Graph API.
- **Content-Type Enforcement**: Ensures the remote asset returns `image/jpeg` or `image/png`.
- **Credential Scrubbing**: Credentials and secrets are automatically masked in all logs and exception messages.

---

## 📸 Instagram OAuth & Publishing Flow

SANKALP integrates directly with Meta Graph API for Instagram Professional (Business / Creator) accounts:
1. **OAuth Initiation**: `/social-accounts/instagram/authorize` generates a secure CSRF state token bound to the active business context with 15-minute expiration.
2. **Meta Consent**: The user authorizes permissions: `instagram_basic,instagram_content_publish`.
3. **Token Exchange**: Exchanges the auth code for a short-lived token, then automatically upgrades to a 60-day long-lived User Access Token.
4. **Live Verification**: Queries Meta Graph API `/me/accounts` and `/me?fields=id,username,account_type` to verify that the account is live, active, and has publishing capabilities.
5. **Publishing Pipeline**:
   - Creates a media container via `POST /{ig_user_id}/media` with `image_url` and caption.
   - Polls container status code until `FINISHED`.
   - Publishes container via `POST /{ig_user_id}/media_publish`.
   - Fetches the permanent live permalink via `GET /{media_id}?fields=permalink`.
   - Persists publication records in the database with timestamps and status.

### Cloudflare / Ngrok Development Tunnel Setup
Because Meta requires an HTTPS redirect URI:
```bash
# Example with Cloudflare Tunnel:
cloudflared tunnel --url http://localhost:8000
# Update INSTAGRAM_REDIRECT_URI in .env with the generated HTTPS domain:
# INSTAGRAM_REDIRECT_URI=https://<your-subdomain>.trycloudflare.com/social-accounts/instagram/callback
```

---

## ⏱️ Persistent Background Scheduler

SANKALP includes a background job queue powered by `APScheduler`:
- **Lifecycle**: Starts automatically during FastAPI startup (`@asynccontextmanager`) and shuts down gracefully.
- **Interval Polling**: Scans every 15 seconds for approved content items whose `scheduled_at <= now()`.
- **Atomic Concurrency Protection**: Immediately locks transitioning items to `status='publishing'` to guarantee **zero duplicate posts**.
- **Survivability**: Scheduled content persists in the primary database (`scheduled_at` timestamp). If the server restarts, any due or upcoming jobs are automatically picked up on the next cycle.
- **Diagnostics**: Real-time status accessible via `GET /scheduler/status` and manual cycle execution via `POST /scheduler/trigger`.

---

## 📈 Real Analytics & Autonomous Replanning Loop

SANKALP is designed as a true closed-loop marketing employee:
1. **Live Analytics Sync**: `POST /analytics/sync` queries Meta Graph API for published posts to retrieve real likes, comments, and reach metrics, saving timestamped `AnalyticsSnapshot` entities.
2. **Empirical Learning**: The `LearningAgent` derives actionable heuristics based strictly on observed performance evidence (e.g., top-performing content pillars, optimal posting hours, engagement velocity).
3. **Loop State Inspection**: `GET /campaigns/{id}/loop-state` provides an end-to-end audit of the campaign's 9 stages.
4. **Autonomous Replanning**: `POST /campaigns/{id}/replan` takes the campaign's past publication results and learning insights, feeds them into the `StrategyAgent`, and synthesizes an evolved strategy with refreshed messaging angles and scheduling recommendations.

---

## 🧪 Automated Test Suite

Run all unit, integration, and security tests:
```bash
# In backend directory with virtual environment active:
python -m pytest tests -v
```

Verified test coverage includes:
- `backend/tests/test_api.py`: Core REST endpoints, business profile, campaign orchestration, content CRUD, quality audit.
- `backend/tests/test_instagram_publisher.py`: Complete Meta Graph API publishing state machine, mock container polling, permalink fetching, timeout handling, error code logging.
- `backend/tests/test_local_image_provider.py`: Stable Diffusion Turbo local generator fallback, real byte generation, singleton caching.
- `backend/tests/test_scheduler_and_loop.py`: APScheduler diagnostics, due post dispatch, atomic duplicate prevention, Cloudinary SHA1 signature generation, closed-loop campaign state, autonomous replanning.

---

## 🛡️ Honesty & Demo Mode Guardrails

- **Zero Fake Claims**: When external API credentials are not provided, SANKALP operates honestly in Demo Mode. Outputs are clearly marked as `Demo Mode` in all UI screens and payloads.
- **Zero Fabricated URLs**: The system will never present a placeholder or fabricated Instagram URL as a real publication.
- **Strict Quality Assurance**: Automated guardrails prevent any asset from publishing if it fails pricing parity, safe claims, or character limits.
- **Multi-Tenant Isolation**: Database models cleanly segregate business workspaces and social credentials.

---

© 2026 SANKALP AI Systems. Built for next-generation autonomous business marketing.

