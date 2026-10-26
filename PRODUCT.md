# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js 15 (App Router), TypeScript, Tailwind CSS, shadcn/ui, Supabase (PostgreSQL with Row-Level Security and CLI migrations in `supabase/migrations/`), Stripe webhook simulation, and AI CFO Copilot. Reference UI specification delivered as interactive HTML/CSS (`veloceops-ui-design-reference.html`).

## Users

1. **Primary Evaluator Audience:** US, UK, and EU startup founders, CTOs, and SMB owners on Upwork evaluating Hanif Daffa N.'s (`Top Rated`, `100% JSS`, `$30K+ earned`) full-stack SaaS engineering capability within a 45–90 second portfolio review window.
2. **Simulated Product End-Users:** SaaS founders, finance managers, and read-only investors/auditors managing multi-account company treasury, customer invoicing, departmental budgets, and subscription revenue metrics.

## Product Purpose

**VeloceOps** is a Multi-Tenant B2B SaaS Finance, Smart Invoicing, and AI Revenue Operations platform. Its purpose is to demonstrate production-grade multi-tenant data isolation (PostgreSQL Row-Level Security), Role-Based Access Control (RBAC), automated Stripe payment-to-ledger reconciliation, departmental burn control, and SaaS conversion funnel telemetry in one cohesive application.

## Positioning

Unlike static front-end dashboard mockups, VeloceOps provides a zero-friction, 1-click live sandbox where a prospective client can switch between two contrasting company tenants (`Acme Cloud Inc.` in USD and `Northstar Digital Studio` in EUR), toggle RBAC roles (`Owner`, `Finance Manager`, `Read-Only Investor`) to see live permission enforcement, and trigger a simulated Stripe `invoice.payment_succeeded` webhook that reconciles directly into the general ledger and cash balance.

## Operating Context

- Evaluated primarily on desktop and laptop viewports (`1280px–1440px+`) by technical founders and hiring managers browsing Upwork proposals and portfolio links.
- Developed by 1 Full-Stack Developer + AI over a 4-week sprint cycle using an isolated dev Supabase instance and handed over via 1-command Supabase CLI migrations (`supabase db push` and `supabase db seed`).

## Capabilities and Constraints

- **Module 0 (Reviewer Sandbox Controller):** 1-click demo login, live Tenant switcher (`Acme Cloud USD` vs `Northstar EUR`), live RBAC Role switcher (`Owner`, `Finance Manager`, `Investor Viewer`), RLS SQL & Architecture inspector drawer, and 1-click `reset_demo_data()` RPC trigger.
- **Module 1 (Executive Treasury Overview):** Consolidated cash balance across connected accounts, MRR, net monthly burn, implied cash runway, 12-month inflow/outflow telemetry chart, actionable overdue/budget alerts, and recent general ledger entries.
- **Module 2 (Smart Invoicing & Stripe Simulator):** Invoice list, live document preview, and 1-click Stripe payment webhook simulation that updates invoice status, ledger entries, and account balances simultaneously.
- **Module 3 (Multi-Account Ledger & Internal Transfers):** Connected accounts strip, filterable/sortable transaction table, CSV export, and internal account-to-account fund transfers.
- **Module 4 (Department Budgets):** Category budget envelopes with threshold state indicators (`<80%` healthy, `80–99%` approaching limit, `>=100%` breached) and transaction drill-down.
- **Module 5 (SaaS Growth & Funnel Telemetry):** 4-stage acquisition-to-paid conversion funnel with automatic bottleneck highlighting and cohort retention matrix.
- **Module 6 (AI CFO Copilot & Security Audit Logs):** Contextual financial assistant with 1-click analytical prompts and an immutable security/RBAC audit log table.

## Evidence on Hand

- Confirmed Upwork profile metrics for Hanif Daffa N. (`Top Rated`, `100% JSS`, `$30K+` total earnings, 31 completed jobs).
- Pre-seeded synthetic demonstration datasets for two fictional tenants (`Acme Cloud Inc.` and `Northstar Digital Studio`), explicitly labeled as sandbox demonstration data.

## Product Principles

1. **Immediate Proof Over Claims:** Visitors must experience multi-tenant isolation, RBAC locking, and Stripe-to-ledger reconciliation interactively within 15 seconds without signing up.
2. **Earned Financial Authority:** Every screen must read as a trustworthy, high-craft financial operating instrument with unmistakable hierarchy, legible typography, and zero AI-template clichés.
3. **Migration-First Engineering:** Every database table, RLS policy, RPC function, and seed record must live in version-controlled SQL migrations for frictionless handover.

## Accessibility & Inclusion

WCAG AA contrast compliance (`>= 4.5:1` for body and functional UI text, `>= 3:1` for large display text), minimum `12px` functional UI text floor, keyboard-navigable controls, and strict `tabular-nums` alignment on all numerical figures.
