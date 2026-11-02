'use client';

import { ShieldCheck, Plus, RefreshCw, Zap } from 'lucide-react';
import { Tenant, UserRole } from '@/types/veloceops';
import Link from 'next/link';

interface CanvasHeaderProps {
  currentTenant: Tenant;
  userRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  onSimulateWebhook?: () => void;
  isSimulating?: boolean;
  title?: string;
  subtitle?: string;
}

export function CanvasHeader({
  currentTenant,
  userRole,
  onSelectRole,
  onSimulateWebhook,
  isSimulating = false,
  title = 'Treasury & Liquidity Engine',
  subtitle = 'Real-time multi-tenant cash position, sub-ledger receivables, and AI CFO surveillance.',
}: CanvasHeaderProps) {
  return (
    <header className="px-7 py-5 border-b border-[#EBEBE6] flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-[#FFFFFF] rounded-t-[20px]">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#5C605A]">
            Overview
          </span>
          <span className="text-[#5C605A] text-xs">/</span>
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#121316] font-semibold">
            {currentTenant.name}
          </span>
          <span className="text-[#E2E2DC]">•</span>
          {/* CLEAN DOT INDICATOR - NO BUBBLE PILL */}
          <div className="inline-flex items-center gap-1.5 text-[11px] font-mono text-[#434642]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0B6B41]"></span>
            <span>Protected by RLS</span>
            <span className="text-[#5C605A]">•</span>
            <span className="font-semibold text-[#121316]">{currentTenant.slug}</span>
            <span className="text-[#5C605A]">({userRole})</span>
          </div>
        </div>
        <h1 className="text-xl font-bold tracking-tight text-[#121316] font-display">
          {title}
        </h1>
        <p className="text-xs text-[#5C605A] mt-0.5 max-w-xl">
          {subtitle}
        </p>
      </div>

      <div className="flex items-center gap-2.5 flex-wrap">
        {/* Role Switcher */}
        <div className="flex items-center gap-1.5 bg-[#F8F8F5] border border-[#E2E2DC] px-2.5 py-1.5 rounded-lg text-xs">
          <span className="text-[11px] font-mono text-[#5C605A] uppercase">Role:</span>
          <select
            value={userRole}
            onChange={(e) => onSelectRole(e.target.value as UserRole)}
            className="bg-transparent font-semibold text-[#121316] outline-none cursor-pointer"
          >
            <option value="OWNER">OWNER</option>
            <option value="FINANCE">FINANCE</option>
            <option value="VIEWER">VIEWER</option>
          </select>
        </div>

        {/* Simulate Stripe Webhook Button */}
        {onSimulateWebhook && (
          <button
            onClick={onSimulateWebhook}
            disabled={isSimulating}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#F8F8F5] text-[#121316] border border-[#D0D0C8] hover:bg-[#EAEAE4] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
            title="Simulate Stripe invoice.paid webhook"
          >
            <Zap className={`w-3.5 h-3.5 text-[#8C4608] ${isSimulating ? 'animate-spin' : ''}`} />
            <span>{isSimulating ? 'Reconciling...' : 'Simulate Webhook'}</span>
          </button>
        )}

        {/* Create Invoice Action */}
        <Link
          href="/invoices/new"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#D4F338] text-[#121316] border border-[#B5D618] hover:bg-[#C5E627] active:scale-[0.98] transition-all shadow-2xs"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>New Invoice</span>
        </Link>
      </div>
    </header>
  );
}
