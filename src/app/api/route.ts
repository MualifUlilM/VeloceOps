import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://veloce-ops-ochre.vercel.app';

  return NextResponse.json({
    name: 'VeloceOps Autonomous B2B Finance REST API Suite',
    version: '1.2.0',
    documentation: 'Production-ready headless API endpoints for web, mobile, and third-party integrations.',
    base_url: baseUrl,
    authentication: 'Public Sandbox Demo Mode enabled (Cookie / Bearer token supported)',
    endpoints: [
      {
        path: '/api/treasury',
        methods: ['GET'],
        description: 'Get executive treasury overview: operating cash, MRR, net burn rate, runway months, and cashflow summary.',
        query_params: {
          tenant_id: 'Optional tenant UUID (default: Acme Cloud Inc. USD)',
        },
        curl: `curl -s "${baseUrl}/api/treasury"`,
      },
      {
        path: '/api/invoices',
        methods: ['GET', 'POST'],
        description: 'Query invoices with status/search filtering, or issue a new cryptographically verified B2B invoice.',
        query_params: {
          tenant_id: 'Optional tenant UUID',
          status: 'Filter by PENDING | PAID | OVERDUE | ALL (default: ALL)',
          search: 'Search by client name or invoice number',
        },
        curl: `curl -s "${baseUrl}/api/invoices?status=PENDING"`,
      },
      {
        path: '/api/invoices/[id]',
        methods: ['GET', 'PATCH', 'DELETE'],
        description: 'Retrieve invoice detail, mark as PAID, or void an existing invoice.',
        curl: `curl -s "${baseUrl}/api/invoices/b0000000-0000-0000-0000-000000000001"`,
      },
      {
        path: '/api/spend',
        methods: ['GET'],
        description: 'Retrieve departmental budget caps, actual spend, utilization percentages, and threshold alert states.',
        curl: `curl -s "${baseUrl}/api/spend"`,
      },
      {
        path: '/api/tenants',
        methods: ['GET'],
        description: 'List available company tenants, currencies, and operating cash balances.',
        curl: `curl -s "${baseUrl}/api/tenants"`,
      },
      {
        path: '/api/ai-cfo',
        methods: ['GET', 'POST'],
        description: 'Autonomous financial surveillance engine, anomaly detection, and Copilot Q&A.',
        curl: `curl -s -X POST "${baseUrl}/api/ai-cfo" -H "Content-Type: application/json" -d '{"action": "ask", "query": "How to extend runway by 6 months?"}'`,
      },
      {
        path: '/api/webhooks/stripe',
        methods: ['POST'],
        description: 'Stripe webhook receiver with idempotency guard and automated double-entry ledger settlement.',
        curl: `curl -s -X POST "${baseUrl}/api/webhooks/stripe" -H "Content-Type: application/json" -d '{"type": "invoice.paid"}'`,
      },
    ],
  });
}
