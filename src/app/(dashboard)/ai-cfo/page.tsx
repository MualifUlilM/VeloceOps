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
          <div className="space-y-6">
            <AnomalyPanel
              anomalies={INITIAL_ANOMALIES}
              currency={currentTenant.currency}
            />

            <div className="p-6 bg-[#FFFFFF] border-t border-[#EBEBE6]">
              <div className="flex items-center gap-2 mb-3">
                <BrainCircuit className="w-4 h-4 text-[#121316]" />
                <h3 className="text-sm font-bold text-[#121316] font-display">
                  pgvector Heuristic Model & Embedding Similarity
                </h3>
              </div>
              <p className="text-xs text-[#5C605A] max-w-2xl mb-4 leading-relaxed">
                VeloceOps embeds invoice historical payment latency, vendor billing frequency, and balance fluctuation into 1536-dimensional vectors. Anomaly thresholds trigger alerts when cosine distance exceeds 0.35 against baseline tenant cohorts.
              </p>

              <div className="p-4 rounded-xl bg-[#F8F8F5] border border-[#E2E2DC] font-mono text-[11px] text-[#434642] space-y-1">
                <div>SELECT id, title, cosine_distance(embedding, target_vector) as distance</div>
                <div>FROM public.cfo_embeddings</div>
                <div>WHERE tenant_id = current_tenant_id() AND distance &gt; 0.35</div>
                <div>ORDER BY distance DESC LIMIT 5;</div>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
