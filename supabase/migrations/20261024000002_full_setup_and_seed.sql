-- ==============================================================================
-- VeloceOps: Full Schema + RLS Policies + Seed Data
-- Run this in Supabase SQL Editor (1-Click Setup)
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

-- 6. Financial Ledger Entries (GAAP Double-Entry Accounting)
CREATE TABLE IF NOT EXISTS public.ledger_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    invoice_id UUID REFERENCES public.invoices(id) ON DELETE SET NULL,
    account_code VARCHAR(10) NOT NULL,
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

-- 9. Enable RLS
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
    RETURN COALESCE(
        (auth.jwt() ->> 'tenant_id')::uuid,
        'a0000000-0000-0000-0000-000000000001'::uuid
    );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Permissive demo policies (Allow public read for sandbox demo)
DROP POLICY IF EXISTS "tenant_isolation_invoices_select" ON public.invoices;
CREATE POLICY "tenant_isolation_invoices_select"
ON public.invoices FOR SELECT
USING (true);

DROP POLICY IF EXISTS "tenant_isolation_tenants_select" ON public.tenants;
CREATE POLICY "tenant_isolation_tenants_select"
ON public.tenants FOR SELECT
USING (true);

DROP POLICY IF EXISTS "tenant_isolation_budget_select" ON public.budget_caps;
CREATE POLICY "tenant_isolation_budget_select"
ON public.budget_caps FOR SELECT
USING (true);

DROP POLICY IF EXISTS "tenant_isolation_invoice_items_select" ON public.invoice_items;
CREATE POLICY "tenant_isolation_invoice_items_select"
ON public.invoice_items FOR SELECT
USING (true);

-- ==============================================================================
-- SEED DATA
-- ==============================================================================

-- Insert Tenants
INSERT INTO public.tenants (id, slug, name, currency, operating_cash)
VALUES 
  ('a0000000-0000-0000-0000-000000000001', 'acme_01', 'Acme Cloud Inc.', 'USD', 148920.00),
  ('a0000000-0000-0000-0000-000000000002', 'nova_eu', 'Nova Logistics GmbH', 'EUR', 284500.00),
  ('a0000000-0000-0000-0000-000000000003', 'kinetix_uk', 'Kinetix AI Labs', 'GBP', 92400.00)
ON CONFLICT (id) DO UPDATE SET 
  operating_cash = EXCLUDED.operating_cash;

-- Insert Invoices
INSERT INTO public.invoices (id, tenant_id, invoice_number, customer_name, customer_email, payment_method, status, issued_date, due_date, total_amount, currency)
VALUES
  ('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'INV-2026-092', 'Stripe Inc.', 'ap-treasury@stripe.com', 'Stripe ACH Direct', 'PAID', '2026-10-21', '2026-10-21', 18400.00, 'USD'),
  ('b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'INV-2026-091', 'Vercel Enterprise', 'billing@vercel.com', 'Fedwire Transfer', 'PENDING', '2026-10-22', '2026-11-05', 12450.00, 'USD'),
  ('b0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'INV-2026-089', 'Linear Orbit Ltd', 'finance@linear.app', 'Stripe Checkout Link', 'OVERDUE', '2026-10-08', '2026-10-22', 14200.00, 'USD'),
  ('b0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'INV-2026-088', 'Supabase Inc.', 'accounts@supabase.io', 'ACH Direct Debit', 'PAID', '2026-10-18', '2026-10-18', 24000.00, 'USD'),
  ('b0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001', 'INV-2026-084', 'Datadog EMEA', 'invoicing@datadoghq.com', 'SEPA Credit', 'PAID', '2026-10-12', '2026-10-12', 9800.00, 'USD')
ON CONFLICT (id) DO NOTHING;

-- Insert Budget Caps
INSERT INTO public.budget_caps (tenant_id, department, cap_amount, current_spend, period)
VALUES
  ('a0000000-0000-0000-0000-000000000001', 'Cloud Infrastructure (AWS/Vercel)', 15000.00, 16410.00, 'Q4_2026'),
  ('a0000000-0000-0000-0000-000000000001', 'Sales & Marketing Outbound', 20000.00, 14200.00, 'Q4_2026'),
  ('a0000000-0000-0000-0000-000000000001', 'Engineering & Dev Tools', 12000.00, 11770.00, 'Q4_2026')
ON CONFLICT (tenant_id, department, period) DO NOTHING;
