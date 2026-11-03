'use client';

import { TrendingUp, ArrowUpRight, ArrowDownRight, Clock, ShieldAlert } from 'lucide-react';
import { CurrencyCode } from '@/types/veloceops';
import { formatCurrency } from '@/lib/utils';

interface MetricStripProps {
  operatingCash: number;
  receivables: number;
  burnRate: number;
  runwayMonths: number;
  arr: number;
  nrr: number;
  currency: CurrencyCode;
}

export function MetricStrip({
  operatingCash,
  receivables,
  burnRate,
  runwayMonths,
  arr,
  nrr,
  currency,
}: MetricStripProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 border-b border-[#EBEBE6] divide-x divide-y lg:divide-y-0 divide-[#EBEBE6] bg-[#FFFFFF] w-full max-w-full overflow-hidden">
      {/* Metric 1: Operating Cash Balance */}
      <div className="p-4 sm:p-5 min-w-0">
        <div className="flex items-center justify-between mb-0.5 sm:mb-2 gap-1">
          <span className="text-[9px] sm:text-[11px] font-mono uppercase tracking-wider text-[#5C605A] font-semibold truncate">
            Operating Cash
          </span>
          <span className="inline-flex items-center gap-0.5 text-[9px] sm:text-[11px] font-mono text-[#0B6B41] font-medium flex-shrink-0">
            <ArrowUpRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            +8.4%
          </span>
        </div>
        <div className="text-sm sm:text-2xl font-bold tracking-tight text-[#121316] font-display tabular truncate">
          {formatCurrency(operatingCash, currency)}
        </div>
        <p className="text-[9px] sm:text-[11px] text-[#5C605A] mt-0.5 sm:mt-1 flex items-center gap-1 truncate">
          <span className="w-1.5 h-1.5 rounded-full bg-[#0B6B41] flex-shrink-0"></span>
          <span className="truncate">ACH Sweep Ready</span>
        </p>
      </div>

      {/* Metric 2: Accounts Receivable */}
      <div className="p-4 sm:p-5 min-w-0">
        <div className="flex items-center justify-between mb-0.5 sm:mb-2 gap-1">
          <span className="text-[9px] sm:text-[11px] font-mono uppercase tracking-wider text-[#5C605A] font-semibold truncate">
            Receivables
          </span>
          <span className="inline-flex items-center gap-0.5 text-[9px] sm:text-[11px] font-mono text-[#8C4608] font-medium flex-shrink-0">
            <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            DSO 28d
          </span>
        </div>
        <div className="text-sm sm:text-2xl font-bold tracking-tight text-[#121316] font-display tabular truncate">
          {formatCurrency(receivables, currency)}
        </div>
        <p className="text-[9px] sm:text-[11px] text-[#5C605A] mt-0.5 sm:mt-1 flex items-center gap-1 truncate">
          <span className="w-1.5 h-1.5 rounded-full bg-[#8C4608] flex-shrink-0"></span>
          <span className="truncate">2 Overdue • 1 Pending</span>
        </p>
      </div>

      {/* Metric 3: Monthly Burn & Runway */}
      <div className="p-4 sm:p-5 min-w-0">
        <div className="flex items-center justify-between mb-0.5 sm:mb-2 gap-1">
          <span className="text-[9px] sm:text-[11px] font-mono uppercase tracking-wider text-[#5C605A] font-semibold truncate">
            Monthly Burn
          </span>
          <span className="text-[9px] sm:text-[11px] font-mono text-[#434642] font-semibold flex-shrink-0">
            {runwayMonths.toFixed(1)} Mo
          </span>
        </div>
        <div className="text-sm sm:text-2xl font-bold tracking-tight text-[#121316] font-display tabular truncate">
          {formatCurrency(burnRate, currency)}
        </div>
        <p className="text-[9px] sm:text-[11px] text-[#5C605A] mt-0.5 sm:mt-1 truncate">
          Threshold: <span className="font-semibold text-[#121316]">Dec 2027</span>
        </p>
      </div>

      {/* Metric 4: Net Contract ARR */}
      <div className="p-4 sm:p-5 min-w-0">
        <div className="flex items-center justify-between mb-0.5 sm:mb-2 gap-1">
          <span className="text-[9px] sm:text-[11px] font-mono uppercase tracking-wider text-[#5C605A] font-semibold truncate">
            Contracted ARR
          </span>
          <span className="inline-flex items-center gap-0.5 text-[9px] sm:text-[11px] font-mono text-[#0B6B41] font-semibold flex-shrink-0">
            <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            {nrr}%
          </span>
        </div>
        <div className="text-sm sm:text-2xl font-bold tracking-tight text-[#121316] font-display tabular truncate">
          {formatCurrency(arr, currency)}
        </div>
        <p className="text-[9px] sm:text-[11px] text-[#5C605A] mt-0.5 sm:mt-1 truncate">
          Cohort Growth
        </p>
      </div>
    </div>
  );
}
