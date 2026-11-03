'use client';

import { useState } from 'react';
import { CurrencyCode } from '@/types/veloceops';
import { formatCurrency, formatShortCurrency } from '@/lib/utils';

interface CashflowChartProps {
  currency: CurrencyCode;
}

export function CashflowChart({ currency }: CashflowChartProps) {
  const [period, setPeriod] = useState<'30D' | '90D' | '12M'>('30D');

  // Realistic time-series data for the 3 timeframes
  const dataMap = {
    '30D': [
      { label: 'Oct 01', inflow: 28400, outflow: 14200, balance: 135000 },
      { label: 'Oct 06', inflow: 16200, outflow: 9800, balance: 141400 },
      { label: 'Oct 11', inflow: 34100, outflow: 18500, balance: 157000 },
      { label: 'Oct 16', inflow: 12000, outflow: 24000, balance: 145000 },
      { label: 'Oct 21', inflow: 42400, outflow: 11200, balance: 176200 },
      { label: 'Oct 26', inflow: 18400, outflow: 8500, balance: 186100 },
      { label: 'Oct 31', inflow: 22000, outflow: 16000, balance: 192100 },
    ],
    '90D': [
      { label: 'Aug W1', inflow: 62000, outflow: 38000, balance: 115000 },
      { label: 'Aug W3', inflow: 48000, outflow: 41000, balance: 122000 },
      { label: 'Sep W1', inflow: 74000, outflow: 39000, balance: 157000 },
      { label: 'Sep W3', inflow: 51000, outflow: 44000, balance: 164000 },
      { label: 'Oct W1', inflow: 83000, outflow: 42000, balance: 205000 },
      { label: 'Oct W3', inflow: 69000, outflow: 38000, balance: 236000 },
    ],
    '12M': [
      { label: 'Nov', inflow: 110000, outflow: 68000, balance: 90000 },
      { label: 'Jan', inflow: 142000, outflow: 72000, balance: 160000 },
      { label: 'Mar', inflow: 168000, outflow: 81000, balance: 247000 },
      { label: 'May', inflow: 185000, outflow: 89000, balance: 343000 },
      { label: 'Jul', inflow: 210000, outflow: 94000, balance: 459000 },
      { label: 'Sep', inflow: 245000, outflow: 102000, balance: 602000 },
    ],
  };

  const currentData = dataMap[period];
  const maxVal = Math.max(...currentData.map((d) => Math.max(d.inflow, d.outflow)));

  return (
    <div className="p-3 sm:p-6 border-b border-[#EBEBE6] bg-[#FFFFFF] w-full max-w-full overflow-hidden box-border">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 sm:gap-4 mb-3 sm:mb-6">
        <div>
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            <h2 className="text-xs sm:text-sm font-bold text-[#121316] font-display">
              Cashflow Velocity
            </h2>
            <span className="text-[9px] sm:text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#F8F8F5] text-[#434642] border border-[#E2E2DC]">
              T+0 Reconciled
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-[#5C605A] mt-0.5 line-clamp-1 sm:line-clamp-none">
            Net operating cash delta comparing customer collections against outflows.
          </p>
        </div>

        {/* Timeframe Segmented Control */}
        <div className="flex items-center p-0.5 sm:p-1 bg-[#F2F2EE] rounded-lg border border-[#E2E2DC] self-start sm:self-auto">
          {(['30D', '90D', '12M'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setPeriod(t)}
              className={`px-2 sm:px-3 py-0.5 sm:py-1 text-[11px] sm:text-xs font-mono font-medium rounded-md transition-all cursor-pointer ${
                period === t
                  ? 'bg-[#FFFFFF] text-[#121316] shadow-2xs font-semibold'
                  : 'text-[#5C605A] hover:text-[#121316]'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* SVG / HTML Bar & Trend Representation */}
      <div className="relative pt-2 pb-1 w-full max-w-full overflow-hidden">
        <div className="h-32 sm:h-44 flex items-end gap-1 sm:gap-4 justify-between px-0.5 sm:px-2 w-full max-w-full">
          {currentData.map((d, idx) => {
            const inflowHeight = (d.inflow / maxVal) * 105;
            const outflowHeight = (d.outflow / maxVal) * 105;

            return (
              <div key={idx} className="flex-1 flex flex-col items-center group relative min-w-0">
                {/* Tooltip on hover (desktop only to prevent mobile touch lateral scroll expansion) */}
                <div
                  className={`hidden sm:block opacity-0 group-hover:opacity-100 transition-opacity absolute -top-12 z-20 pointer-events-none bg-[#121316] text-[#FFFFFF] text-[10px] font-mono px-2 py-1 rounded shadow-lg whitespace-nowrap ${
                    idx >= currentData.length - 2 ? 'right-0' : 'left-1/2 -translate-x-1/2'
                  }`}
                >
                  <div>Inflow: {formatCurrency(d.inflow, currency)}</div>
                  <div>Outflow: {formatCurrency(d.outflow, currency)}</div>
                </div>

                {/* Bars */}
                <div className="w-full flex items-end justify-center gap-0.5 sm:gap-1.5">
                  {/* Inflow bar (Volt Lime) */}
                  <div
                    style={{ height: `${Math.max(6, inflowHeight)}px` }}
                    className="w-1/2 max-w-[12px] sm:max-w-[18px] bg-[#D4F338] rounded-t-xs sm:rounded-t-sm border-t border-x border-[#B5D618] transition-all group-hover:brightness-105"
                  />
                  {/* Outflow bar (Charcoal) */}
                  <div
                    style={{ height: `${Math.max(6, outflowHeight)}px` }}
                    className="w-1/2 max-w-[12px] sm:max-w-[18px] bg-[#121316] rounded-t-xs sm:rounded-t-sm border-t border-x border-[#434642] transition-all group-hover:brightness-125"
                  />
                </div>

                {/* X-Axis Label */}
                <span className="text-[8px] sm:text-[10px] font-mono text-[#5C605A] mt-1.5 group-hover:text-[#121316] transition-colors truncate max-w-full text-center">
                  {d.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-5 mt-3 pt-2 border-t border-[#EBEBE6] text-[10px] sm:text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-xs bg-[#D4F338] border border-[#B5D618] flex-shrink-0" />
            <span className="text-[#434642]">Inflows</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-xs bg-[#121316] flex-shrink-0" />
            <span className="text-[#434642]">Outflows</span>
          </div>
        </div>
      </div>
    </div>
  );
}
