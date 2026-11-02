# VeloceOps — Production Cutover & Handover Runbook
**Document Version:** 1.0.0 (Production Ready)  
**Author / Lead Engineer:** Hanif Daffa N.  
**Target Audience:** Client Engineering Lead, DevOps, and Finance Ops Team  
**Designated Principle:** Zero Manual Clicks in Web Dashboards (100% Declarative & Auditable)

---

## 1. System Overview & Architecture Topology

VeloceOps is a multi-tenant B2B Treasury & Smart Invoicing Operating System built on:
- **Application Engine:** Next.js 15 (App Router, React 19, Server Components & Server Actions)
- **Database & Identity:** Supabase (PostgreSQL 16, Row-Level Security, pgvector, Realtime)
- **Payment & Ledger:** Stripe Invoicing, ACH Sweeps & Idempotent Webhook Engine
- **Styling Architecture:** Tailwind CSS v4, Satoshi & IBM Plex Mono typography, Inset App Frame (20px canvas radius)

---

## 2. Prerequisites & Access Requirements

Before executing the cutover, ensure the following credentials and tools are prepared:
- [x] Node.js 20+ and npm 10+ installed locally.
- [x] Supabase CLI installed (`npm install -g supabase` or via `npx supabase`).
- [x] Client Supabase Production Project Reference (`<CLIENT_PROD_PROJECT_REF>`).
- [x] Stripe Production Account API Keys (`sk_live_...` and Webhook Secret `whsec_...`).
- [x] Vercel Organization or Production Account.

---

## 3. Step-by-Step Production Cutover Runbook

### Step 1: Authenticate and Link Supabase Production
Run the following commands in the root of the repository:

```bash
# 1. Login to Supabase CLI with your organization account
npx supabase login

# 2. Link your local project to the client's production database
npx supabase link --project-ref <CLIENT_PROD_PROJECT_REF>
```

### Step 2: Push Database Migrations (Zero Manual Clicks)
Execute all declarative SQL migrations to create the core tables, constraints, and Row-Level Security (RLS) policies:

```bash
# Push migrations in supabase/migrations/
npx supabase db push
```

*Verification:*  
Ensure all 7 core tables are created:
1. `public.tenants`
2. `public.tenant_users`
3. `public.invoices`
4. `public.invoice_items`
5. `public.ledger_entries`
6. `public.budget_caps`
7. `public.processed_events`

### Step 3: Seed Baseline Data (Optional / Tenant Setup)
For staging verification or initial baseline setup:

```bash
# Populate initial sandbox tenants (Acme Cloud, Nova Logistics, Kinetix AI)
npx supabase db reset --linked
# OR execute seed file:
psql "<PRODUCTION_DATABASE_URL>" -f supabase/seed.sql
```

### Step 4: Configure Stripe Webhook Endpoint
In the client's Stripe Dashboard:
1. Navigate to **Developers -> Webhooks -> Add destination**.
2. **Endpoint URL:** `https://<YOUR_PRODUCTION_DOMAIN>/api/webhooks/stripe`
3. **Select Events to listen to:**
   - `invoice.paid`
   - `payment_intent.succeeded`
   - `charge.refunded`
4. Copy the **Signing Secret** (`whsec_...`).

> [!NOTE]
> VeloceOps enforces **Idempotent Webhook Handling** via `public.processed_events`. If Stripe sends duplicate webhooks, the system returns `200 OK` without double-crediting cash or double-decrementing accounts receivable.

### Step 5: Vercel Production Deployment
1. Connect the GitHub repository `MualifUlilM/VeloceOps` to Vercel.
2. In **Project Settings -> Environment Variables**, configure:

| Environment Variable | Description | Example |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase API URL | `https://xyzcompany.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Anon Public Key | `eyJhbGci...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Admin Secret Key | `eyJhbGci...` |
| `STRIPE_SECRET_KEY` | Stripe Live Secret Key | `sk_live_...` |
| `STRIPE_WEBHOOK_SECRET` | Stripe Live Webhook Signing Secret | `whsec_...` |

3. Trigger deployment:
```bash
vercel --prod
```

---

## 4. Post-Cutover Verification & Smoke Test Checklist

Execute these verification checks immediately after cutover:

- [ ] **RLS Isolation Test:**
  - Login as Tenant A (`acme_01`).
  - Attempt to query invoice data from Tenant B (`nova_eu`).
  - *Expected result:* Query returns 0 rows due to database-level PostgreSQL policy.
- [ ] **Idempotent Webhook Replay Test:**
  - Send the same Stripe `invoice.paid` event payload twice.
  - *Expected result:* First execution updates status to `PAID` and adds ledger entry. Second execution returns `idempotent_duplicate: true` with zero balance mutation.
- [ ] **Document Inspector Verification:**
  - Click any invoice row in the Sub-Ledger.
  - *Expected result:* Live Invoice Paper updates seamlessly with SHA-256 audit proof.
- [ ] **Print & Export Test:**
  - Verify "Export CSV" generates a clean formatted CSV file.
  - Verify "Print / PDF" renders a clean printable invoice without navigation chrome.

---

## 5. Ongoing Maintenance & Emergency Contacts

- **Lead Engineer:** Hanif Daffa N.
- **Security Issue Reporting:** security@veloceops.dev
- **Repository Issues:** [https://github.com/MualifUlilM/VeloceOps/issues](https://github.com/MualifUlilM/VeloceOps/issues)
