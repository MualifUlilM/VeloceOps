# VeloceOps — Multi-Tenant Treasury, Smart Invoicing & AI RevOps
**Flagship B2B SaaS MVP** engineered with Next.js 15 (App Router), TypeScript, Tailwind CSS v4, shadcn/ui, Supabase (PostgreSQL 16, Auth, RLS), and Stripe Webhooks.

---

## 🏗️ Repository Architecture

```
├── project/                      # 🌟 Multi-Page HTML Prototype Hub (17 Screens)
│   ├── index.html                # Master Interactive Directory (Open in browser)
│   ├── 01_landing.html           # Public Landing Page & Sandbox Embed
│   ├── 12_dashboard_overview.html# Consolidated Treasury Command Deck
│   ├── 16_invoices_list.html     # Smart Invoicing Studio Sub-Ledger
│   ├── 17_invoice_create.html    # Full-Page Commercial Invoice Builder
│   ├── 18_invoice_detail.html    # Invoice Detail & Cryptographic Audit
│   ├── 19_customer_portal_view.html # Buyer Hosted Stripe Checkout
│   ├── 22_spend_management.html  # OpEx Spend Caps & SaaS Funnel
│   ├── 25_ai_cfo_feed.html       # AI CFO Copilot & Runway Simulator
│   └── 33_design_system_ui_kit.html # Design System Storybook
├── src/                          # 💻 Production Next.js 15 Application
│   ├── app/
│   │   ├── (auth)/               # Supabase Auth routes (Login / Magic Link)
│   │   ├── (dashboard)/          # Authenticated Multi-Tenant Treasury Workspace
│   │   ├── (marketing)/          # Public Landing & Pricing Pages
│   │   ├── api/webhooks/stripe/  # Idempotent Stripe Webhook Handler
│   │   ├── globals.css           # Warm Fintech Design Tokens
│   │   └── layout.tsx
│   ├── components/               # Modular UI & Feature Components
│   │   ├── layout/               # Inset App Frame, Sidebar, Canvas Header
│   │   ├── treasury/             # Metric Strip, Cashflow Trajectory Chart
│   │   ├── invoices/             # Invoice Table, Invoice Paper Sheet
│   │   ├── ai-cfo/               # Anomaly Cards & Runway Simulator
│   │   └── ui/                   # Reusable Primitive Elements (Clean Dot Status)
│   ├── lib/
│   │   ├── supabase/             # SSR Client & Server Helpers (Cookies)
│   │   └── utils.ts              # Currency formatters & cn utility
│   ├── actions/                  # Next.js Server Actions (Zod Schema Validation)
│   └── types/                    # Strict TypeScript Interfaces
├── supabase/                     # 🗄️ Database Migrations & Seeds
│   ├── migrations/               # PostgreSQL Tables & Strict RLS Policies
│   └── seed.sql                  # Verified Seed Data (Acme, Nova, Kinetix)
├── SPRINT_BACKLOG_DEVELOPER_VeloceOps.md # 📋 Sprints 1–4 Task Breakdown (TICK-001 - TICK-016)
├── BRIEF_Portofolio_Flagship_Hanif_VeloceOps.md # 🎯 Master Project Brief & Handover SOP
├── DESIGNSYSTEM_VeloceOps.md     # 🎨 Warm Fintech Inset Frame Design Guidelines
└── veloceops-theme.json          # 🏷️ Standard Design Tokens (JSON)
```

---

## ⚡ Quickstart (Local Development)

### 1. Prerequisites
- **Node.js:** v20.x or higher
- **pnpm** (recommended) or **npm**
- **Docker Desktop** (for local Supabase instance)
- **Supabase CLI:** `npm install -g supabase`

### 2. Environment Setup
```bash
cp .env.example .env.local
```

### 3. Spin Up Local Database
```bash
npx supabase start
npx supabase db reset
```
*(This automatically executes `supabase/migrations/*.sql` and seeds the 3 verified sandbox tenants from `supabase/seed.sql`).*

### 4. Run Development Server
```bash
npm run dev
# Visit http://localhost:3000
```

---

## 🛑 Golden Engineering Rules
1. **Migration-First Rule:** Zero manual dashboard clicks. All schema updates must be saved as `supabase/migrations/<timestamp>_<name>.sql`.
2. **Strict Multi-Tenant RLS:** Always enforce `tenant_id = (auth.jwt()->>'tenant_id')::uuid`.
3. **Idempotent Webhooks:** Deduplicate Stripe events using the `processed_events` table before modifying financial balances.
4. **Clean Dot Status:** Do not use candy bubble pill badges; use clean 6px dot status indicators (`.status-dot-cell`).
