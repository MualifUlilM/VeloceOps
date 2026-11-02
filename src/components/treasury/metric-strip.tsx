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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-b border-[#EBEBE6] divide-y sm:divide-y-0 sm:divide-x divide-[#EBEBE6] bg-[#FFFFFF]">
      {/* Metric 1: Operating Cash Balance */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#5C605A] font-semibold">
            Operating Cash
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#0B6B41] font-medium">
            <ArrowUpRight className="w-3.5 h-3.5" />
            +8.4%
          </span>
        </div>
        <div className="text-2xl font-bold tracking-tight text-[#121316] font-display tabular">
          {formatCurrency(operatingCash, currency)}
        </div>
        <p className="text-[11px] text-[#5C605A] mt-1 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#0B6B41]"></span>
          <span>Fedwire & ACH Sweep Ready</span>
        </p>
      </div>

      {/* Metric 2: Accounts Receivable */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#5C605A] font-semibold">
            Accounts Receivable
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#8C4608] font-medium">
            <Clock className="w-3.5 h-3.5" />
            DSO 28d
          </span>
        </div>
        <div className="text-2xl font-bold tracking-tight text-[#121316] font-display tabular">
          {formatCurrency(receivables, currency)}
        </div>
        <p className="text-[11px] text-[#5C605A] mt-1 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#8C4608]"></span>
          <span>2 Overdue • 1 Pending Invoices</span>
        </p>
      </div>

      {/* Metric 3: Monthly Burn & Runway */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#5C605A] font-semibold">
            Monthly Burn & Runway
          </span>
          <span className="text-[11px] font-mono text-[#434642] font-semibold">
            {runwayMonths.toFixed(1)} Mos
          </span>
        </div>
        <div className="text-2xl font-bold tracking-tight text-[#121316] font-display tabular">
          {formatCurrency(burnRate, currency)}
          <span className="text-xs font-normal text-[#5C605A]"> /mo</span>
        </div>
        <p className="text-[11px] text-[#5C605A] mt-1">
          Zero-cash threshold: <span className="font-semibold text-[#121316]">Dec 2027</span>
        </p>
      </div>

      {/* Metric 4: Net Contract ARR */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#5C605A] font-semibold">
            Contracted ARR
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#0B6B41] font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            {nrr}% NRR
          </span>
        </div>
        <div className="text-2xl font-bold tracking-tight text-[#121316] font-display tabular">
          {formatCurrency(arr, currency)}
        </div>
        <p className="text-[11px] text-[#5C605A] mt-1">
          B2B Enterprise Cohort Growth
        </p>
      </div>
    </div>
  );
}
