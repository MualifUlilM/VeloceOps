'use client';

import { AppFrame } from '@/components/layout/app-frame';
import { AnomalyPanel } from '@/components/ai-cfo/anomaly-panel';
import { INITIAL_ANOMALIES } from '@/lib/data';
import { Sparkles, BrainCircuit, Activity } from 'lucide-react';

export default function AiCfoPage() {
  return (
    <AppFrame
      title="AI CFO Autonomous Surveillance"
      subtitle="Continuously detects cash leaks, predicts invoice default risks, and optimizes burn rate via pgvector."
      renderCanvasContent={({ currentTenant }) => {
        return (
          <div className="space-y-4 sm:space-y-6 w-full max-w-full overflow-hidden box-border">
            <AnomalyPanel
              anomalies={INITIAL_ANOMALIES}
              currency={currentTenant.currency}
            />

            <div className="p-4 sm:p-6 bg-[#FFFFFF] border-t border-[#EBEBE6] w-full max-w-full overflow-hidden">
              <div className="flex items-center gap-2 mb-3">
                <BrainCircuit className="w-4 h-4 text-[#121316] flex-shrink-0" />
                <h3 className="text-sm font-bold text-[#121316] font-display">
                  pgvector Heuristic Model & Embedding Similarity
                </h3>
              </div>
              <p className="text-xs text-[#5C605A] max-w-2xl mb-4 leading-relaxed">
                VeloceOps embeds invoice historical payment latency, vendor billing frequency, and balance fluctuation into 1536-dimensional vectors. Anomaly thresholds trigger alerts when cosine distance exceeds 0.35 against baseline tenant cohorts.
              </p>

              <div className="p-3.5 sm:p-4 rounded-xl bg-[#F8F8F5] border border-[#E2E2DC] font-mono text-[10px] sm:text-[11px] text-[#434642] space-y-1 overflow-x-auto w-full max-w-full">
                <div className="whitespace-nowrap">SELECT id, title, cosine_distance(embedding, target_vector) as distance</div>
                <div className="whitespace-nowrap">FROM public.cfo_embeddings</div>
                <div className="whitespace-nowrap">WHERE tenant_id = current_tenant_id() AND distance &gt; 0.35</div>
                <div className="whitespace-nowrap">ORDER BY distance DESC LIMIT 5;</div>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
