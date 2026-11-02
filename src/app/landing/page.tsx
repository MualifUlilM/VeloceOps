import Link from 'next/link';
import { ArrowRight, ShieldCheck, Zap, Sparkles, Database, Check } from 'lucide-react';

export default function MarketingPage() {
  return (
    <div className="min-h-screen bg-[#F2F2EE] text-[#121316]">
      {/* Navigation Header */}
      <header className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#121316] flex items-center justify-center font-bold text-xs text-[#D4F338]">
            VO
          </div>
          <div>
            <span className="font-bold text-base tracking-tight text-[#121316] block leading-none">
              VeloceOps
            </span>
            <span className="text-[10px] font-mono text-[#5C605A] tracking-wider uppercase">
              B2B Treasury OS
            </span>
          </div>
        </div>

        <nav className="flex items-center gap-6 text-xs font-semibold">
          <Link href="/pricing" className="text-[#434642] hover:text-[#121316] transition-colors">
            Pricing
          </Link>
          <Link href="/project/06_security_compliance.html" target="_blank" className="text-[#434642] hover:text-[#121316] transition-colors">
            Security & RLS
          </Link>
          <Link
            href="/login"
            className="px-4 py-2 rounded-lg bg-[#FFFFFF] border border-[#D0D0C8] hover:bg-[#EAEAE4] text-[#121316] transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/"
            className="px-4 py-2 rounded-lg bg-[#D4F338] text-[#121316] border border-[#B5D618] font-bold hover:bg-[#C5E627] transition-all shadow-xs"
          >
            Launch Sandbox
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-6 pt-16 pb-20 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFFFFF] border border-[#E2E2DC] text-xs font-mono text-[#434642] mb-6 shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-[#0B6B41] animate-pulse"></span>
          <span>Next.js 15 • Supabase RLS • Stripe Idempotent Webhooks</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-[#121316] font-display max-w-3xl mx-auto leading-[1.1]">
          High-Velocity B2B Treasury & Smart Invoicing OS.
        </h1>

        <p className="mt-5 text-base sm:text-lg text-[#5C605A] max-w-2xl mx-auto leading-relaxed">
          Engineered for high-growth SaaS and enterprise workflows. Real-time multi-tenant cash position, sub-ledger receivables, and autonomous AI CFO surveillance.
        </p>

        <div className="mt-8 flex items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#121316] text-[#FFFFFF] font-bold text-sm hover:bg-[#434642] active:scale-98 transition-all shadow-md"
          >
            <span>Enter Live Operating System</span>
            <ArrowRight className="w-4 h-4 text-[#D4F338]" />
          </Link>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#FFFFFF] text-[#121316] font-bold text-sm border border-[#D0D0C8] hover:bg-[#EAEAE4] transition-all"
          >
            <span>View Architecture & Pricing</span>
          </Link>
        </div>

        {/* Hero Interactive App Mockup Preview */}
        <div className="mt-14 p-2 bg-[#FFFFFF] rounded-[24px] border border-[#E2E2DC] shadow-xl">
          <div className="rounded-[18px] bg-[#F8F8F5] border border-[#EBEBE6] p-4 text-left font-mono text-xs text-[#5C605A] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#E2E2DC]"></span>
              <span className="w-3 h-3 rounded-full bg-[#E2E2DC]"></span>
              <span className="w-3 h-3 rounded-full bg-[#E2E2DC]"></span>
              <span className="ml-2 text-[#121316] font-semibold">https://veloceops.dev/app/acme_01</span>
            </div>
            <span className="text-[#0B6B41] font-semibold">RLS Isolation Active</span>
          </div>
          <div className="p-8 text-center bg-[#FFFFFF] rounded-b-[18px]">
            <div className="text-2xl font-bold font-display text-[#121316] mb-2">
              Multi-Tenant Sandbox Pre-loaded with 3 Organizations
            </div>
            <p className="text-xs text-[#5C605A] max-w-lg mx-auto mb-6">
              Acme Cloud Inc. ($148.9k Operating Cash), Nova Logistics GmbH (€284.5k), and Kinetix AI Labs (£92.4k).
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#D4F338] text-[#121316] font-bold text-xs border border-[#B5D618] hover:bg-[#C5E627]"
            >
              Open Interactive Workspace
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="max-w-6xl mx-auto px-6 py-16 border-t border-[#E2E2DC]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#E2E2DC] shadow-2xs">
            <div className="p-2.5 rounded-lg bg-[#F8F8F5] border border-[#E2E2DC] w-fit mb-4 text-[#121316]">
              <ShieldCheck className="w-5 h-5 text-[#0B6B41]" />
            </div>
            <h3 className="text-base font-bold text-[#121316] font-display mb-2">
              PostgreSQL Row-Level Security
            </h3>
            <p className="text-xs text-[#5C605A] leading-relaxed">
              Every invoice, ledger transaction, and budget cap is isolated by cryptographic JWT claims at the database kernel level. Zero cross-tenant data leakage.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#E2E2DC] shadow-2xs">
            <div className="p-2.5 rounded-lg bg-[#F8F8F5] border border-[#E2E2DC] w-fit mb-4 text-[#121316]">
              <Zap className="w-5 h-5 text-[#8C4608]" />
            </div>
            <h3 className="text-base font-bold text-[#121316] font-display mb-2">
              Idempotent Stripe Webhooks
            </h3>
            <p className="text-xs text-[#5C605A] leading-relaxed">
              Automated reconciliation engine deduplicates Stripe event payloads via transactional locking in <code className="text-[#121316] font-mono">processed_events</code>.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#E2E2DC] shadow-2xs">
            <div className="p-2.5 rounded-lg bg-[#F8F8F5] border border-[#E2E2DC] w-fit mb-4 text-[#121316]">
              <Sparkles className="w-5 h-5 text-[#121316]" />
            </div>
            <h3 className="text-base font-bold text-[#121316] font-display mb-2">
              AI CFO Copilot Surveillance
            </h3>
            <p className="text-xs text-[#5C605A] leading-relaxed">
              Heuristic and vector analysis scans overdue counterparties, warns against OpEx department spend spikes, and extends cash runway.
            </p>
          </div>
        </div>
      </section>

      {/* Developer Profile Section */}
      <footer className="max-w-6xl mx-auto px-6 py-12 border-t border-[#E2E2DC] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs text-[#5C605A]">
        <div>
          <span className="font-bold text-[#121316]">VeloceOps Architecture</span> — Built by <span className="font-semibold text-[#121316]">Hanif Daffa N.</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/project/index.html" target="_blank" className="hover:text-[#121316] underline">
            HTML Prototypes Hub
          </Link>
          <Link href="/login" className="hover:text-[#121316] underline">
            Auth Sign In
          </Link>
          <span className="font-mono text-[11px]">Next.js 15 + Supabase</span>
        </div>
      </footer>
    </div>
  );
}
