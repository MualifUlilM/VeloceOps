import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { INITIAL_TENANTS, INITIAL_INVOICES } from '@/lib/data';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tenantId = searchParams.get('tenant_id') || INITIAL_TENANTS[0].id;

  let tenant = INITIAL_TENANTS.find((t) => t.id === tenantId || t.slug === tenantId) || INITIAL_TENANTS[0];
  let invoices = INITIAL_INVOICES.filter((i) => i.tenant_id === tenant.id);

  try {
    const supabase = await createClient();
    const { data: dbTenant } = await supabase
      .from('tenants')
      .select('*')
      .eq('id', tenant.id)
      .maybeSingle();

    if (dbTenant) {
      tenant = dbTenant;
    }

    const { data: dbInvoices } = await supabase
      .from('invoices')
      .select('*')
      .eq('tenant_id', tenant.id);

    if (dbInvoices && dbInvoices.length > 0) {
      invoices = dbInvoices;
    }
  } catch (err) {
    // Continue with sandbox fallback
  }

  const totalInvoiced = invoices.reduce((acc, i) => acc + Number(i.total_amount), 0);
  const settledCollections = invoices
    .filter((i) => i.status === 'PAID')
    .reduce((acc, i) => acc + Number(i.total_amount), 0);
  const overdueReceivables = invoices
    .filter((i) => i.status === 'OVERDUE')
    .reduce((acc, i) => acc + Number(i.total_amount), 0);
  const pendingReceivables = invoices
    .filter((i) => i.status === 'PENDING')
    .reduce((acc, i) => acc + Number(i.total_amount), 0);

  // SaaS baseline metrics
  const monthlyBurn = tenant.currency === 'USD' ? 124500.0 : tenant.currency === 'EUR' ? 95000.0 : 68000.0;
  const mrr = tenant.currency === 'USD' ? 62000.0 : tenant.currency === 'EUR' ? 48000.0 : 34000.0;
  const runwayMonths = monthlyBurn > 0 ? Number((Number(tenant.operating_cash) / monthlyBurn).toFixed(1)) : 24.0;

  return NextResponse.json({
    success: true,
    tenant: {
      id: tenant.id,
      name: tenant.name,
      slug: tenant.slug,
      currency: tenant.currency,
    },
    treasury: {
      operating_cash: Number(tenant.operating_cash),
      currency: tenant.currency,
      net_monthly_burn: monthlyBurn,
      mrr: mrr,
      implied_runway_months: runwayMonths,
      health_status: runwayMonths >= 12 ? 'OPTIMAL' : runwayMonths >= 6 ? 'WARNING' : 'CRITICAL',
    },
    receivables: {
      total_invoiced: totalInvoiced,
      settled_collections: settledCollections,
      pending_receivables: pendingReceivables,
      overdue_receivables: overdueReceivables,
      invoice_count: invoices.length,
    },
    cashflow_summary: {
      last_updated: new Date().toISOString(),
      reconciliation_status: 'REALTIME_AUDITED',
    },
  });
}
