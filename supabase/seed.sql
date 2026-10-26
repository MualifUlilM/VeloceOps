-- ==============================================================================
-- VeloceOps Database Seed File
-- Path: supabase/seed.sql
-- Contains: 3 Multi-Tenant Sandbox Organizations & Verified Sub-Ledger Data
-- ==============================================================================

-- 1. Insert Tenants
INSERT INTO public.tenants (id, slug, name, currency, operating_cash)
VALUES 
    ('a0000000-0000-0000-0000-000000000001', 'acme_01', 'Acme Cloud Inc.', 'USD', 148920.00),
    ('a0000000-0000-0000-0000-000000000002', 'nova_eu', 'Nova Logistics GmbH', 'EUR', 284500.00),
    ('a0000000-0000-0000-0000-000000000003', 'kinetix_uk', 'Kinetix AI Labs', 'GBP', 92400.00)
ON CONFLICT (id) DO NOTHING;

-- 2. Insert Invoices for Acme Cloud Inc. (USD)
INSERT INTO public.invoices (id, tenant_id, invoice_number, customer_name, customer_email, payment_method, status, issued_date, due_date, total_amount, currency)
VALUES
    ('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'INV-2026-092', 'Stripe Inc.', 'ap-treasury@stripe.com', 'Stripe ACH Direct', 'PAID', '2026-10-21', '2026-10-21', 18400.00, 'USD'),
    ('b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'INV-2026-091', 'Vercel Enterprise', 'finance@vercel.com', 'Fedwire Transfer', 'PENDING', '2026-10-19', '2026-11-02', 12450.00, 'USD'),
    ('b0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'INV-2026-089', 'Linear Orbit Ltd', 'billing@linearorbit.io', 'Stripe Checkout Link', 'OVERDUE', '2026-09-26', '2026-10-10', 14200.00, 'USD'),
    ('b0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'INV-2026-088', 'Supabase Inc.', 'accounts@supabase.io', 'Stripe ACH Direct', 'PAID', '2026-09-18', '2026-09-19', 24000.00, 'USD'),
    ('b0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001', 'INV-2026-085', 'Retool Corp', 'ap@retool.com', 'Corporate Card', 'OVERDUE', '2026-09-10', '2026-09-24', 4800.00, 'USD')
ON CONFLICT (id) DO NOTHING;

-- 3. Insert Invoice Line Items for INV-2026-092
INSERT INTO public.invoice_items (invoice_id, tenant_id, description, quantity, unit_price, total_price)
VALUES
    ('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Enterprise Platform License (Annual Pool)', 1, 14800.00, 14800.00),
    ('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Dedicated SOC2 Audit Log & SLA Add-on', 1, 3600.00, 3600.00)
ON CONFLICT DO NOTHING;

-- 4. Insert Department Budget Caps (Spend Controls)
INSERT INTO public.budget_caps (tenant_id, department, cap_amount, current_spend, period)
VALUES
    ('a0000000-0000-0000-0000-000000000001', 'Cloud Infrastructure (AWS + Supabase)', 15000.00, 16410.00, 'Q4_2026'),
    ('a0000000-0000-0000-0000-000000000001', 'Core Product Engineering Payroll', 22000.00, 19200.00, 'Q4_2026'),
    ('a0000000-0000-0000-0000-000000000001', 'Demand Gen & Outbound RevOps', 10000.00, 6770.00, 'Q4_2026')
ON CONFLICT DO NOTHING;
