'use client';

import { BudgetCap, CurrencyCode } from '@/types/veloceops';
import { formatCurrency } from '@/lib/utils';
import { PieChart, ShieldAlert, CheckCircle2, Sliders } from 'lucide-react';

interface BudgetCapsTableProps {
  budgetCaps: BudgetCap[];
  currency: CurrencyCode;
}

export function BudgetCapsTable({ budgetCaps, currency }: BudgetCapsTableProps) {
  return (
    <div className="p-6 bg-[#FFFFFF]">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-[#121316] text-[#D4F338]">
              <PieChart className="w-3.5 h-3.5" />
            </div>
            <h2 className="text-base font-bold text-[#121316] font-display">
              Departmental Spend Caps & Policy Guards
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F8F8F5] text-[#434642] border border-[#E2E2DC]">
              Hard Limit Enforcement
            </span>
          </div>
          <p className="text-xs text-[#5C605A] mt-1">
            Autonomous card throttling and approval routing triggered when department spend approaches threshold limits.
          </p>
        </div>
      </div>

      <div className="border border-[#EBEBE6] rounded-xl overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#F8F8F5] border-b border-[#EBEBE6] font-mono text-[11px] uppercase tracking-wider text-[#5C605A]">
            <tr>
              <th className="py-3 px-4 font-semibold">Department & Scope</th>
              <th className="py-3 px-4 font-semibold">Period</th>
              <th className="py-3 px-4 font-semibold text-right">Budget Cap</th>
              <th className="py-3 px-4 font-semibold text-right">Current Spend</th>
              <th className="py-3 px-4 font-semibold w-48">Utilization Meter</th>
              <th className="py-3 px-4 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EBEBE6]">
            {budgetCaps.map((cap) => {
              const pct = (cap.current_spend / cap.cap_amount) * 100;
              const isOver = pct > 100;
              const isWarning = pct >= 85 && !isOver;

              return (
                <tr key={cap.id} className="hover:bg-[#F8F8F5]/80 bg-[#FFFFFF] transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-[#121316] text-[13px]">
                    {cap.department}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[#5C605A]">
                    {cap.period}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-medium text-[#434642] tabular">
                    {formatCurrency(cap.cap_amount, currency)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-[#121316] tabular">
                    {formatCurrency(cap.current_spend, currency)}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="w-full">
                      <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                        <span className="text-[#5C605A]">{pct.toFixed(1)}%</span>
                        <span className={isOver ? 'text-[#B91C1C] font-bold' : 'text-[#5C605A]'}>
                          {isOver ? `+${(pct - 100).toFixed(1)}% Exceeded` : 'In Policy'}
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-[#EAEAE4] overflow-hidden">
                        <div
                          style={{ width: `${Math.min(100, pct)}%` }}
                          className={`h-full rounded-full transition-all ${
                            isOver
                              ? 'bg-[#B91C1C]'
                              : isWarning
                              ? 'bg-[#8C4608]'
                              : 'bg-[#121316]'
                          }`}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {isOver ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-mono text-[#B91C1C] font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#B91C1C]"></span>
                        <span>Spike Alert</span>
                      </span>
                    ) : isWarning ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-mono text-[#8C4608] font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#8C4608]"></span>
                        <span>Near Cap</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs font-mono text-[#0B6B41] font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0B6B41]"></span>
                        <span>Healthy</span>
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
