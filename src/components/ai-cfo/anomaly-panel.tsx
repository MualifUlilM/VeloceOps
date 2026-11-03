'use client';

import { useState } from 'react';
import { AnomalyDetection, CurrencyCode } from '@/types/veloceops';
import { formatCurrency } from '@/lib/utils';
import { Sparkles, AlertTriangle, ArrowRight, CheckCircle2, Sliders, Zap } from 'lucide-react';

interface AnomalyPanelProps {
  anomalies: AnomalyDetection[];
  currency: CurrencyCode;
}

export function AnomalyPanel({ anomalies: initialAnomalies, currency }: AnomalyPanelProps) {
  const [anomalies, setAnomalies] = useState(initialAnomalies);
  const [resolvedIds, setResolvedIds] = useState<string[]>([]);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const [scenarioRunwayAdd, setScenarioRunwayAdd] = useState(1.2);

  const handleExecuteAction = (ano: AnomalyDetection) => {
    setResolvedIds((prev) => [...prev, ano.id]);
    setFeedbackMsg(`Action executed: "${ano.actionLabel}" successfully queued.`);
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  return (
    <div className="p-4 sm:p-6 bg-[#FFFFFF] border-b border-[#EBEBE6] w-full max-w-full overflow-hidden box-border">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-[#121316] text-[#D4F338]">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <h2 className="text-base font-bold text-[#121316] font-display">
              AI CFO Autonomous Surveillance
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F8F8F5] text-[#434642] border border-[#E2E2DC]">
              pgvector + SQL Rules
            </span>
          </div>
          <p className="text-xs text-[#5C605A] mt-1">
            Real-time heuristic & vector detection of cash leaks, overdue receivables, and departmental spend spikes.
          </p>
        </div>

        {feedbackMsg && (
          <div className="px-3 py-1.5 rounded-lg bg-[#E6F6EE] border border-[#0B6B41]/20 text-[#0B6B41] text-xs font-medium flex items-center gap-1.5 animate-fadeIn">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{feedbackMsg}</span>
          </div>
        )}
      </div>

      {/* Grid of Detected Anomalies */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        {anomalies.map((ano) => {
          const isResolved = resolvedIds.includes(ano.id);
          const isOverdue = ano.kind === 'OVERDUE_RECEIVABLE';

          return (
            <div
              key={ano.id}
              className={`p-3.5 sm:p-4 rounded-xl border transition-all min-w-0 ${
                isResolved
                  ? 'bg-[#F8F8F5]/60 border-[#E2E2DC] opacity-60'
                  : 'bg-[#FFFFFF] border-[#E2E2DC] shadow-xs hover:border-[#D0D0C8]'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      isResolved ? 'bg-[#0B6B41]' : isOverdue ? 'bg-[#B91C1C]' : 'bg-[#8C4608]'
                    }`}
                  />
                  <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-[#5C605A] truncate">
                    {ano.kind.replace('_', ' ')}
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-[#121316] tabular flex-shrink-0">
                  {formatCurrency(ano.amount, currency)}
                </span>
              </div>

              <h3 className="text-sm font-bold text-[#121316] mb-1 leading-snug">
                {ano.title}
              </h3>
              <p className="text-xs text-[#5C605A] leading-relaxed mb-4">
                {ano.description}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-[#EBEBE6] text-xs">
                <div>
                  {ano.runwayImpactMonths && (
                    <span className="text-[11px] font-mono text-[#0B6B41] font-semibold">
                      +{ano.runwayImpactMonths} Mo Runway Impact
                    </span>
                  )}
                  {ano.monthlySavings && (
                    <span className="text-[11px] font-mono text-[#0B6B41] font-semibold">
                      +{formatCurrency(ano.monthlySavings, currency)}/mo Cost Reduction
                    </span>
                  )}
                </div>

                {isResolved ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#0B6B41] font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Resolved
                  </span>
                ) : (
                  <button
                    onClick={() => handleExecuteAction(ano)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#121316] text-[#FFFFFF] hover:bg-[#434642] active:scale-95 transition-all cursor-pointer flex-shrink-0"
                  >
                    <span>{ano.actionLabel}</span>
                    <ArrowRight className="w-3 h-3 text-[#D4F338]" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Runway Scenario Simulator */}
      <div className="mt-6 p-3.5 sm:p-4 rounded-xl bg-[#F8F8F5] border border-[#E2E2DC] w-full max-w-full">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Sliders className="w-3.5 h-3.5 text-[#121316] flex-shrink-0" />
              <span className="text-xs font-bold text-[#121316]">
                Interactive Runway Scenario Simulator
              </span>
            </div>
            <p className="text-[11px] text-[#5C605A] mt-0.5">
              Simulate recovery of overdue receivables and departmental budget reallocations on zero-cash horizon.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between sm:justify-end gap-3 sm:gap-4 w-full md:w-auto">
            <div className="flex items-center gap-2">
              <span className="text-[11px] sm:text-xs font-mono text-[#5C605A]">Target:</span>
              <input
                type="range"
                min="0.2"
                max="3.0"
                step="0.1"
                value={scenarioRunwayAdd}
                onChange={(e) => setScenarioRunwayAdd(parseFloat(e.target.value))}
                className="w-24 sm:w-28 accent-[#121316] cursor-pointer"
              />
              <span className="font-mono text-xs font-bold text-[#121316] tabular">
                +{scenarioRunwayAdd.toFixed(1)} Mos
              </span>
            </div>
            <div className="px-2.5 py-1 rounded bg-[#D4F338] text-[#121316] text-xs font-mono font-bold border border-[#B5D618] flex-shrink-0">
              Dec 2027 Projected
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
