# VeloceOps — Multi-Tenant Treasury, Smart Invoicing & AI CFO OS

[![CI - Build & Typecheck](https://github.com/MualifUlilM/VeloceOps/actions/workflows/ci.yml/badge.svg)](https://github.com/MualifUlilM/VeloceOps/actions/workflows/ci.yml)
[![Live Demo - Vercel](https://img.shields.io/badge/Live_Demo-veloce--ops--ochre.vercel.app-121316?style=flat&logo=vercel&logoColor=D4F338)](https://veloce-ops-ochre.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Next.js 15](https://img.shields.io/badge/Next.js-15.0-black?logo=next.js)](https://nextjs.org)
[![PostgreSQL 16](https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql)](https://supabase.com)
[![Stripe](https://img.shields.io/badge/Stripe-Idempotent%20Webhooks-635BFF?logo=stripe)](https://stripe.com)

**Live Demo URL:** [https://veloce-ops-ochre.vercel.app](https://veloce-ops-ochre.vercel.app)  
**Flagship B2B Financial Operating System** engineered with **Next.js 15 (App Router, Server Actions)**, **TypeScript**, **Tailwind CSS v4**, **Supabase (PostgreSQL 16, Row-Level Security, pgvector)**, and **Idempotent Stripe Webhooks**.

---

## 🚀 Key Production Deliverables

* **Enterprise Handover Runbook:** [`HANDOVER_RUNBOOK.md`](./HANDOVER_RUNBOOK.md) — Zero-click production cutover guide for client DevOps & Finance Ops.
* **Upwork Proposal & Pitch Kit:** [`UPWORK_PROPOSAL_KIT.md`](./UPWORK_PROPOSAL_KIT.md) — Killer proposal hooks, screening question answers, and 60-second Loom script for Hanif Daffa N.
* **Standalone Native Mobile App:** [`mobile/`](./mobile) — React Native (Expo) standalone app for iOS & Android.
* **Master Developer Sprint Backlog:** [`SPRINT_BACKLOG_DEVELOPER_VeloceOps.md`](./SPRINT_BACKLOG_DEVELOPER_VeloceOps.md) — 16 tickets tracking Sprints 1–4.
* **HTML Prototype Hub:** [`project/index.html`](./project/index.html) — 17 standalone responsive HTML screens (100% Impeccable CSS compliance).
* **Design Tokens & Theme:** [`DESIGNSYSTEM_VeloceOps.md`](./DESIGNSYSTEM_VeloceOps.md) & [`veloceops-theme.json`](./veloceops-theme.json) — Warm Fintech Inset Frame palette (`#F2F2EE`, `#FFFFFF`, `#121316`, `#D4F338`).

---

## 🏗️ Repository Architecture

```
├── .github/workflows/ci.yml      # 🤖 GitHub Actions CI (Typecheck & Next.js Build)
├── HANDOVER_RUNBOOK.md           # 📋 Production Client Cutover Guide (Zero Manual Clicks)
├── UPWORK_PROPOSAL_KIT.md        # 💼 Upwork Proposal Hooks & 60s Loom Script
├── project/                      # 🌟 Multi-Page HTML Prototype Hub (17 Screens)
│   ├── index.html                # Master Interactive Directory
│   ├── 01_landing.html           # Public Landing Page & Sandbox Embed
│   ├── 12_dashboard_overview.html# Consolidated Treasury Command Deck
│   ├── 16_invoices_list.html     # Smart Invoicing Studio Sub-Ledger
│   ├── 17_invoice_create.html    # Full-Page Commercial Invoice Builder
│   ├── 18_invoice_detail.html    # Invoice Detail & Cryptographic Audit
│   ├── 19_customer_portal_view.html # Buyer Hosted Stripe Checkout
│   ├── 22_spend_management.html  # OpEx Spend Caps & Policy Guards
│   ├── 25_ai_cfo_feed.html       # AI CFO Copilot & Runway Simulator
│   └── 33_design_system_ui_kit.html # Design System Storybook
├── src/                          # 💻 Production Next.js 15 Application
│   ├── app/
│   │   ├── (auth)/login/         # 1-Click Persona Sign-In (Acme Owner, Nova Finance)
│   │   ├── (dashboard)/          # Treasury Workspace, Invoices, Spend, AI CFO
│   │   ├── landing/ & pricing/   # High-converting Marketing Pages
│   │   ├── portal/[invoiceId]/   # Customer Hosted Checkout Portal
│   │   ├── api/webhooks/stripe/  # Idempotent Stripe Webhook Handler
│   │   ├── globals.css           # Warm Fintech Design Tokens
│   │   └── layout.tsx            # Inset App Frame Root
│   ├── components/               # Modular UI & Feature Components
│   │   ├── layout/               # AppFrame, Sidebar, CanvasHeader
│   │   ├── treasury/             # MetricStrip, CashflowChart, SubLedgerTable, InvoicePaper
│   │   ├── ai-cfo/               # AnomalyPanel & Runway Scenario Simulator
│   │   └── spend/                # BudgetCapsTable & Spend Throttling
│   ├── actions/                  # Next.js Server Actions (Zod Schema Validation)
│   ├── lib/
│   │   ├── supabase/             # SSR Client & Server Helpers (Asynchronous Cookies)
│   │   ├── stripe/               # Stripe Client
│   │   └── data.ts               # Standalone Seed & Sandbox Data
│   └── types/                    # Strict TypeScript Interfaces
├── supabase/                     # 🗄️ Database Migrations & Seeds
│   ├── migrations/               # PostgreSQL Tables & Strict RLS Policies
│   └── seed.sql                  # 3 Verified Sandbox Tenants (Acme, Nova, Kinetix)
```

---

## ⚡ Quickstart (Local Development)

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
# Open http://localhost:3000
```

### 3. Production Build & Verification
```bash
npm run build
```

---

## 🛑 Golden Engineering Rules
1. **Migration-First Rule:** Zero manual dashboard clicks. All schema updates must be saved as `supabase/migrations/<timestamp>_<name>.sql`.
2. **Strict Multi-Tenant RLS:** Always enforce `tenant_id = (auth.jwt()->>'tenant_id')::uuid`.
3. **Idempotent Webhooks:** Deduplicate Stripe events using the `processed_events` table before modifying financial balances.
4. **Clean Dot Status:** Do not use candy bubble pill badges; use clean 6px dot status indicators (`● Paid`, `● Overdue`, `● Pending`).
