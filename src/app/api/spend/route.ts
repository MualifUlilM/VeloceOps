import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { INITIAL_BUDGET_CAPS, INITIAL_TENANTS } from '@/lib/data';
import { BudgetCap } from '@/types/veloceops';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tenantId = searchParams.get('tenant_id') || INITIAL_TENANTS[0].id;

  let budgetCaps: BudgetCap[] = INITIAL_BUDGET_CAPS;

  try {
    const supabase = await createClient();
    const { data: dbCaps, error } = await supabase
      .from('budget_caps')
      .select('*')
      .eq('tenant_id', tenantId);

    if (!error && dbCaps && dbCaps.length > 0) {
      budgetCaps = dbCaps;
    }
  } catch {
    // Sandbox fallback
  }

  const enrichedCaps = budgetCaps.map((cap) => {
    const utilization = Number(((cap.current_spend / cap.cap_amount) * 100).toFixed(1));
    const status = utilization >= 100 ? 'BREACHED' : utilization >= 80 ? 'WARNING' : 'HEALTHY';
    const remaining = Math.max(0, cap.cap_amount - cap.current_spend);

    return {
      id: cap.id,
      department: cap.department,
      cap_amount: cap.cap_amount,
      current_spend: cap.current_spend,
      remaining_buffer: remaining,
      utilization_percentage: utilization,
      status,
      period: cap.period,
    };
  });

  const totalCap = enrichedCaps.reduce((acc, c) => acc + c.cap_amount, 0);
  const totalSpend = enrichedCaps.reduce((acc, c) => acc + c.current_spend, 0);
  const totalUtilization = totalCap > 0 ? Number(((totalSpend / totalCap) * 100).toFixed(1)) : 0;
  const breachedCount = enrichedCaps.filter((c) => c.status === 'BREACHED').length;
  const warningCount = enrichedCaps.filter((c) => c.status === 'WARNING').length;

  return NextResponse.json({
    success: true,
    tenant_id: tenantId,
    period: 'Q4 2026',
    summary: {
      total_allocated_budget: totalCap,
      total_actual_spend: totalSpend,
      overall_utilization_pct: totalUtilization,
      breached_departments: breachedCount,
      warning_departments: warningCount,
      healthy_departments: enrichedCaps.length - breachedCount - warningCount,
    },
    departments: enrichedCaps,
  });
}
