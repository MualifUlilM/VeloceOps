import Link from 'next/link';
import { Check, ArrowRight } from 'lucide-react';

export default function PricingPage() {
  const tiers = [
    {
      name: 'Seed / Startup',
      price: '$490',
      period: '/month',
      desc: 'Ideal for pre-Series A startups consolidating accounts receivable and cash visibility.',
      features: [
        'Single tenant instance',
        'Stripe ACH & Card reconciliation',
        'Up to $500k monthly cash volume',
        'Standard email notifications',
        'Community Discord & docs',
      ],
      highlighted: false,
      cta: 'Start 14-Day Pilot',
    },
    {
      name: 'Scale Treasury',
      price: '$1,490',
      period: '/month',
      desc: 'Engineered for high-velocity SaaS scaleups needing real-time AI CFO surveillance.',
      features: [
        'Multi-tenant RLS architecture (3 sub-orgs)',
        'Idempotent Stripe Webhook engine',
        'AI CFO Anomaly detection & scenario slider',
        'Up to $5M monthly transaction volume',
        'Dedicated Slack connect & 4-hour SLA',
      ],
      highlighted: true,
      cta: 'Deploy Scale Treasury',
    },
    {
      name: 'Enterprise Sovereign',
      price: '$3,890',
      period: '/month',
      desc: 'For multi-entity holding companies with global EUR/GBP/USD cross-border operations.',
      features: [
        'Unlimited isolated tenants & custom RLS policies',
        'Self-hosted Supabase migration runbook',
        'Custom pgvector embedding models',
        'Unlimited processing volume',
        '24/7 dedicated financial engineer support',
      ],
      highlighted: false,
      cta: 'Talk to Architecture Lead',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F2F2EE] text-[#121316]">
      <header className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#121316] flex items-center justify-center font-bold text-xs text-[#D4F338]">
            VO
          </div>
          <span className="font-bold text-base tracking-tight text-[#121316]">
            VeloceOps
          </span>
        </Link>
        <Link
          href="/"
          className="px-4 py-2 rounded-lg bg-[#121316] text-[#FFFFFF] text-xs font-bold hover:bg-[#434642]"
        >
          Open App Workspace
        </Link>
      </header>

      <section className="max-w-5xl mx-auto px-6 py-16 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold font-display tracking-tight text-[#121316] mb-4">
          Transparent, Predictable Infrastructure Pricing
        </h1>
        <p className="text-base text-[#5C605A] max-w-2xl mx-auto">
          No percentage tax on your volume. Pay fixed infrastructure fees for cryptographic isolation, automated reconciliation, and AI CFO intelligence.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 text-left">
          {tiers.map((t, idx) => (
            <div
              key={idx}
              className={`p-6 rounded-2xl flex flex-col justify-between transition-all ${
                t.highlighted
                  ? 'bg-[#FFFFFF] border-2 border-[#121316] shadow-xl relative'
                  : 'bg-[#FFFFFF] border border-[#E2E2DC] shadow-2xs'
              }`}
            >
              {t.highlighted && (
                <div className="absolute -top-3 left-6 px-3 py-0.5 rounded-full bg-[#D4F338] text-[#121316] font-mono text-[10px] font-bold border border-[#B5D618]">
                  RECOMMENDED FOR SCALEUPS
                </div>
              )}

              <div>
                <h3 className="text-lg font-bold text-[#121316] font-display">{t.name}</h3>
                <p className="text-xs text-[#5C605A] mt-1 mb-4">{t.desc}</p>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-3xl font-bold font-display text-[#121316] tabular">{t.price}</span>
                  <span className="text-xs text-[#5C605A] font-mono">{t.period}</span>
                </div>

                <div className="space-y-2.5 pt-4 border-t border-[#EBEBE6] text-xs">
                  {t.features.map((f, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#0B6B41] flex-shrink-0" />
                      <span className="text-[#434642]">{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8">
                <Link
                  href="/"
                  className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                    t.highlighted
                      ? 'bg-[#121316] text-[#FFFFFF] hover:bg-[#434642]'
                      : 'bg-[#F2F2EE] text-[#121316] hover:bg-[#EAEAE4] border border-[#D0D0C8]'
                  }`}
                >
                  <span>{t.cta}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
