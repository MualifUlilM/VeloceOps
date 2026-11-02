'use client';

import { AppFrame } from '@/components/layout/app-frame';
import { BudgetCapsTable } from '@/components/spend/budget-caps-table';
import { INITIAL_BUDGET_CAPS } from '@/lib/data';
import { CreditCard, ShieldCheck, AlertCircle } from 'lucide-react';

export default function SpendPage() {
  return (
    <AppFrame
      title="Spend Management & Budget Caps"
      subtitle="Corporate virtual cards, real-time OpEx limits, and autonomous spend policy guards."
      renderCanvasContent={({ currentTenant }) => {
        return (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 border-b border-[#EBEBE6] divide-y sm:divide-y-0 sm:divide-x divide-[#EBEBE6] bg-[#FFFFFF]">
              <div className="p-6">
                <span className="text-[11px] font-mono uppercase text-[#5C605A] block mb-1">
                  Quarterly Approved Cap
                </span>
                <span className="text-2xl font-bold font-display text-[#121316] tabular">
                  $47,000.00
                </span>
                <p className="text-[11px] text-[#5C605A] mt-1">Across 3 Operating Units</p>
              </div>

              <div className="p-6">
                <span className="text-[11px] font-mono uppercase text-[#5C605A] block mb-1">
                  Actual Spend Realized
                </span>
                <span className="text-2xl font-bold font-display text-[#121316] tabular">
                  $42,380.00
                </span>
                <p className="text-[11px] text-[#0B6B41] font-mono mt-1 font-semibold">90.1% Utilized</p>
              </div>

              <div className="p-6">
                <span className="text-[11px] font-mono uppercase text-[#5C605A] block mb-1">
                  Policy Breaches
                </span>
                <span className="text-2xl font-bold font-display text-[#B91C1C] tabular">
                  1 Alert
                </span>
                <p className="text-[11px] text-[#5C605A] mt-1">AWS Egress Outlier Throttled</p>
              </div>
            </div>

            {/* Departmental Table */}
            <BudgetCapsTable
              budgetCaps={INITIAL_BUDGET_CAPS}
              currency={currentTenant.currency}
            />
          </div>
        );
      }}
    />
  );
}
