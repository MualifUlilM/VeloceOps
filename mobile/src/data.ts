import { Tenant, Invoice, BudgetCap, AnomalyDetection } from './types';

export const INITIAL_TENANTS: Tenant[] = [
  {
    id: 'a0000000-0000-0000-0000-000000000001',
    slug: 'acme_01',
    name: 'Acme Cloud Inc.',
    currency: 'USD',
    operating_cash: 148920.00,
  },
  {
    id: 'a0000000-0000-0000-0000-000000000002',
    slug: 'nova_eu',
    name: 'Nova Logistics GmbH',
    currency: 'EUR',
    operating_cash: 284500.00,
  },
  {
    id: 'a0000000-0000-0000-0000-000000000003',
    slug: 'kinetix_uk',
    name: 'Kinetix AI Labs',
    currency: 'GBP',
    operating_cash: 92400.00,
  },
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'b1',
    tenant_id: 'a0000000-0000-0000-0000-000000000001',
    invoice_number: 'INV-2026-092',
    customer_name: 'Stripe Inc.',
    customer_email: 'ap-treasury@stripe.com',
    payment_method: 'Stripe ACH Direct',
    status: 'PAID',
    issued_date: '2026-10-21',
    due_date: '2026-10-21',
    total_amount: 18400.00,
    currency: 'USD',
    items: [
      { id: 'i1', description: 'Enterprise Platform License (Annual)', quantity: 1, unit_price: 14800, total_price: 14800 },
      { id: 'i2', description: 'Dedicated SOC2 Audit SLA Add-on', quantity: 1, unit_price: 3600, total_price: 3600 },
    ],
  },
  {
    id: 'b2',
    tenant_id: 'a0000000-0000-0000-0000-000000000001',
    invoice_number: 'INV-2026-091',
    customer_name: 'Vercel Enterprise',
    customer_email: 'finance@vercel.com',
    payment_method: 'Fedwire Transfer',
    status: 'PENDING',
    issued_date: '2026-10-19',
    due_date: '2026-11-02',
    total_amount: 12450.00,
    currency: 'USD',
    items: [
      { id: 'i3', description: 'Edge Infrastructure Routing Optimization', quantity: 1, unit_price: 12450, total_price: 12450 },
    ],
  },
  {
    id: 'b3',
    tenant_id: 'a0000000-0000-0000-0000-000000000001',
    invoice_number: 'INV-2026-089',
    customer_name: 'Linear Orbit Ltd',
    customer_email: 'billing@linearorbit.io',
    payment_method: 'Stripe Checkout Link',
    status: 'OVERDUE',
    issued_date: '2026-09-26',
    due_date: '2026-10-10',
    total_amount: 14200.00,
    currency: 'USD',
    items: [
      { id: 'i4', description: 'PostgreSQL Multi-Tenant Replication Pack', quantity: 1, unit_price: 14200, total_price: 14200 },
    ],
  },
  {
    id: 'b4',
    tenant_id: 'a0000000-0000-0000-0000-000000000001',
    invoice_number: 'INV-2026-088',
    customer_name: 'Supabase Inc.',
    customer_email: 'accounts@supabase.io',
    payment_method: 'Stripe ACH Direct',
    status: 'PAID',
    issued_date: '2026-09-18',
    due_date: '2026-09-19',
    total_amount: 24000.00,
    currency: 'USD',
  },
  {
    id: 'b5',
    tenant_id: 'a0000000-0000-0000-0000-000000000001',
    invoice_number: 'INV-2026-085',
    customer_name: 'Retool Corp',
    customer_email: 'ap@retool.com',
    payment_method: 'Corporate Card',
    status: 'OVERDUE',
    issued_date: '2026-09-10',
    due_date: '2026-09-24',
    total_amount: 4800.00,
    currency: 'USD',
  },
];

export const INITIAL_BUDGET_CAPS: BudgetCap[] = [
  {
    id: 'bc1',
    tenant_id: 'a0000000-0000-0000-0000-000000000001',
    department: 'Cloud Infrastructure (AWS)',
    cap_amount: 15000.00,
    current_spend: 16410.00,
    period: 'Q4 2026',
  },
  {
    id: 'bc2',
    tenant_id: 'a0000000-0000-0000-0000-000000000001',
    department: 'Product Engineering Payroll',
    cap_amount: 22000.00,
    current_spend: 19200.00,
    period: 'Q4 2026',
  },
  {
    id: 'bc3',
    tenant_id: 'a0000000-0000-0000-0000-000000000001',
    department: 'Demand Gen & RevOps',
    cap_amount: 10000.00,
    current_spend: 6770.00,
    period: 'Q4 2026',
  },
];

export const INITIAL_ANOMALIES: AnomalyDetection[] = [
  {
    id: 'ano1',
    kind: 'OVERDUE_RECEIVABLE',
    title: 'Linear Orbit Ltd — 14d Overdue',
    description: 'INV-2026-089 is 14 days overdue. Recovery probability decreases weekly.',
    amount: 14200.00,
    runwayImpactMonths: 0.8,
    actionLabel: 'Send Escalation Notice',
  },
  {
    id: 'ano2',
    kind: 'SPEND_CAP_SPIKE',
    title: 'Cloud Infrastructure Spike',
    description: 'Q4 spend exceeds cap by +$1,410.00 due to cross-region NAT Gateway replication.',
    amount: 16410.00,
    monthlySavings: 1850.00,
    actionLabel: 'Apply Egress Throttle',
  },
];

export function formatCurrency(amount: number, currency: 'USD' | 'EUR' | 'GBP' = 'USD'): string {
  const sym = currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '$';
  return sym + amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
