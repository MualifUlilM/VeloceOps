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
          <div className="space-y-4 sm:space-y-6 w-full max-w-full overflow-hidden box-border">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 border-b border-[#EBEBE6] divide-y sm:divide-y-0 sm:divide-x divide-[#EBEBE6] bg-[#FFFFFF] w-full">
              <div className="p-3.5 sm:p-6 min-w-0">
                <span className="text-[10px] sm:text-[11px] font-mono uppercase text-[#5C605A] block mb-1 font-semibold">
                  Quarterly Approved Cap
                </span>
                <span className="text-xl sm:text-2xl font-bold font-display text-[#121316] tabular">
                  $47,000.00
                </span>
                <p className="text-[11px] text-[#5C605A] mt-1">Across 3 Operating Units</p>
              </div>

              <div className="p-3.5 sm:p-6 min-w-0">
                <span className="text-[10px] sm:text-[11px] font-mono uppercase text-[#5C605A] block mb-1 font-semibold">
                  Actual Spend Realized
                </span>
                <span className="text-xl sm:text-2xl font-bold font-display text-[#121316] tabular">
                  $42,380.00
                </span>
                <p className="text-[11px] text-[#0B6B41] font-mono mt-1 font-semibold">90.1% Utilized</p>
              </div>

              <div className="p-3.5 sm:p-6 min-w-0">
                <span className="text-[10px] sm:text-[11px] font-mono uppercase text-[#5C605A] block mb-1 font-semibold">
                  Policy Breaches
                </span>
                <span className="text-xl sm:text-2xl font-bold font-display text-[#B91C1C] tabular">
                  1 Alert
                </span>
                <p className="text-[11px] text-[#5C605A] mt-1">AWS Egress Outlier Throttled</p>
              </div>
            </div>

            {/* Departmental Table */}
            <div className="w-full max-w-full overflow-x-auto min-w-0">
              <BudgetCapsTable
                budgetCaps={INITIAL_BUDGET_CAPS}
                currency={currentTenant.currency}
              />
            </div>
          </div>
        );
      }}
    />
  );
}
