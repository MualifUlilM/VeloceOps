-- ==============================================================================
-- VeloceOps Core Schema & Row-Level Security Migration
-- Migration: 20261024000001_core_schema.sql
-- Stack: Supabase PostgreSQL 16
-- Rule: Migration-First (No manual dashboard clicks)
-- ==============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Organizations / Tenants Table
CREATE TABLE IF NOT EXISTS public.tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    operating_cash NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Tenant Users & RBAC Table
CREATE TABLE IF NOT EXISTS public.tenant_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('OWNER', 'FINANCE', 'VIEWER')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(tenant_id, user_id)
);

-- 4. Invoices Table
CREATE TABLE IF NOT EXISTS public.invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    invoice_number VARCHAR(50) NOT NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    payment_method VARCHAR(50) NOT NULL DEFAULT 'Stripe ACH Direct',
    status VARCHAR(20) NOT NULL CHECK (status IN ('PENDING', 'PAID', 'OVERDUE')),
    issued_date DATE NOT NULL DEFAULT CURRENT_DATE,
    due_date DATE NOT NULL,
    total_amount NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    stripe_invoice_id VARCHAR(100),
    stripe_payment_intent_id VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(tenant_id, invoice_number)
);

-- 5. Invoice Items Table
CREATE TABLE IF NOT EXISTS public.invoice_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    total_price NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. Financial Ledger Entries (Audit-Proof GAAP Accounting)
CREATE TABLE IF NOT EXISTS public.ledger_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    invoice_id UUID REFERENCES public.invoices(id) ON DELETE SET NULL,
    account_code VARCHAR(10) NOT NULL, -- e.g. '1100' (Cash), '1200' (AR), '4100' (Rev)
    account_name VARCHAR(100) NOT NULL,
    entry_type VARCHAR(10) NOT NULL CHECK (entry_type IN ('DEBIT', 'CREDIT')),
    amount NUMERIC(15, 2) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. Departmental Budget Caps & Spend Controls
CREATE TABLE IF NOT EXISTS public.budget_caps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    department VARCHAR(100) NOT NULL,
    cap_amount NUMERIC(15, 2) NOT NULL,
    current_spend NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    period VARCHAR(10) NOT NULL DEFAULT 'Q4_2026',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(tenant_id, department, period)
);

-- 8. Idempotent Stripe Webhook Events Store
CREATE TABLE IF NOT EXISTS public.processed_events (
    event_id VARCHAR(100) PRIMARY KEY,
    event_type VARCHAR(50) NOT NULL,
    processed_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenant_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ledger_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budget_caps ENABLE ROW LEVEL SECURITY;

-- Helper Function to Extract Tenant ID from JWT claims
CREATE OR REPLACE FUNCTION public.current_tenant_id()
RETURNS UUID AS $$
BEGIN
    RETURN (auth.jwt() ->> 'tenant_id')::uuid;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Invoices RLS Policy
CREATE POLICY "tenant_isolation_invoices_select"
ON public.invoices FOR SELECT
USING (tenant_id = public.current_tenant_id());

CREATE POLICY "rbac_invoices_write"
ON public.invoices FOR INSERT
WITH CHECK (
    tenant_id = public.current_tenant_id()
    AND (auth.jwt() ->> 'app_role') IN ('OWNER', 'FINANCE')
);

CREATE POLICY "rbac_invoices_update"
ON public.invoices FOR UPDATE
USING (
    tenant_id = public.current_tenant_id()
    AND (auth.jwt() ->> 'app_role') IN ('OWNER', 'FINANCE')
);

-- Ledger Entries RLS Policy
CREATE POLICY "tenant_isolation_ledger_select"
ON public.ledger_entries FOR SELECT
USING (tenant_id = public.current_tenant_id());

-- Budget Caps RLS Policy
CREATE POLICY "tenant_isolation_budget_select"
ON public.budget_caps FOR SELECT
USING (tenant_id = public.current_tenant_id());
