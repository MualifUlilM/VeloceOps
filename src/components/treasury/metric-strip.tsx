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
    <div className="grid grid-cols-2 lg:grid-cols-4 border-b border-[#EBEBE6] divide-x divide-y lg:divide-y-0 divide-[#EBEBE6] bg-[#FFFFFF]">
      {/* Metric 1: Operating Cash Balance */}
      <div className="p-3.5 sm:p-5">
        <div className="flex items-center justify-between mb-1 sm:mb-2">
          <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-[#5C605A] font-semibold">
            Operating Cash
          </span>
          <span className="inline-flex items-center gap-0.5 text-[10px] sm:text-[11px] font-mono text-[#0B6B41] font-medium">
            <ArrowUpRight className="w-3 h-3" />
            +8.4%
          </span>
        </div>
        <div className="text-lg sm:text-2xl font-bold tracking-tight text-[#121316] font-display tabular">
          {formatCurrency(operatingCash, currency)}
        </div>
        <p className="text-[10px] sm:text-[11px] text-[#5C605A] mt-1 flex items-center gap-1 truncate">
          <span className="w-1.5 h-1.5 rounded-full bg-[#0B6B41] flex-shrink-0"></span>
          <span className="truncate">ACH Sweep Ready</span>
        </p>
      </div>

      {/* Metric 2: Accounts Receivable */}
      <div className="p-3.5 sm:p-5">
        <div className="flex items-center justify-between mb-1 sm:mb-2">
          <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-[#5C605A] font-semibold">
            Receivables
          </span>
          <span className="inline-flex items-center gap-0.5 text-[10px] sm:text-[11px] font-mono text-[#8C4608] font-medium">
            <Clock className="w-3 h-3" />
            DSO 28d
          </span>
        </div>
        <div className="text-lg sm:text-2xl font-bold tracking-tight text-[#121316] font-display tabular">
          {formatCurrency(receivables, currency)}
        </div>
        <p className="text-[10px] sm:text-[11px] text-[#5C605A] mt-1 flex items-center gap-1 truncate">
          <span className="w-1.5 h-1.5 rounded-full bg-[#8C4608] flex-shrink-0"></span>
          <span className="truncate">2 Overdue • 1 Pending</span>
        </p>
      </div>

      {/* Metric 3: Monthly Burn & Runway */}
      <div className="p-3.5 sm:p-5">
        <div className="flex items-center justify-between mb-1 sm:mb-2">
          <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-[#5C605A] font-semibold">
            Monthly Burn
          </span>
          <span className="text-[10px] sm:text-[11px] font-mono text-[#434642] font-semibold">
            {runwayMonths.toFixed(1)} Mo
          </span>
        </div>
        <div className="text-lg sm:text-2xl font-bold tracking-tight text-[#121316] font-display tabular">
          {formatCurrency(burnRate, currency)}
        </div>
        <p className="text-[10px] sm:text-[11px] text-[#5C605A] mt-1 truncate">
          Threshold: <span className="font-semibold text-[#121316]">Dec 2027</span>
        </p>
      </div>

      {/* Metric 4: Net Contract ARR */}
      <div className="p-3.5 sm:p-5">
        <div className="flex items-center justify-between mb-1 sm:mb-2">
          <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-[#5C605A] font-semibold">
            Contracted ARR
          </span>
          <span className="inline-flex items-center gap-0.5 text-[10px] sm:text-[11px] font-mono text-[#0B6B41] font-semibold">
            <TrendingUp className="w-3 h-3" />
            {nrr}%
          </span>
        </div>
        <div className="text-lg sm:text-2xl font-bold tracking-tight text-[#121316] font-display tabular">
          {formatCurrency(arr, currency)}
        </div>
        <p className="text-[10px] sm:text-[11px] text-[#5C605A] mt-1 truncate">
          Cohort Growth
        </p>
      </div>
    </div>
  );
}
