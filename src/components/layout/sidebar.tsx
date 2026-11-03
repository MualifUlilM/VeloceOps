'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Landmark, 
  ReceiptText, 
  PieChart, 
  Sparkles, 
  Users2, 
  ShieldCheck, 
  ExternalLink,
  ChevronRight,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tenant } from '@/types/veloceops';

interface SidebarProps {
  currentTenant: Tenant;
  onSelectTenant: (tenant: Tenant) => void;
  tenants: Tenant[];
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function Sidebar({
  currentTenant,
  onSelectTenant,
  tenants,
  isMobileOpen = false,
  onCloseMobile,
}: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    {
      label: 'Treasury & Liquidity',
      href: '/',
      icon: Landmark,
      badge: null,
    },
    {
      label: 'Smart Invoices',
      href: '/invoices',
      icon: ReceiptText,
      badge: '5 Active',
    },
    {
      label: 'Spend Management',
      href: '/spend',
      icon: PieChart,
      badge: '1 Alert',
    },
    {
      label: 'AI CFO Copilot',
      href: '/ai-cfo',
      icon: Sparkles,
      badge: '2 Recs',
      highlight: true,
    },
  ];

  const adminItems = [
    {
      label: 'Team & RBAC',
      href: '/settings/team',
      icon: Users2,
    },
    {
      label: 'Security & RLS',
      href: '/settings/security',
      icon: ShieldCheck,
    },
  ];

  const renderContent = () => (
    <div className="flex flex-col justify-between h-full select-none text-[#121316]">
      <div>
        {/* Brand Header */}
        <div className="flex items-center justify-between pb-6 pt-2">
          <Link
            href="/"
            onClick={onCloseMobile}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-7 h-7 rounded-md bg-[#121316] flex items-center justify-center font-bold text-xs text-[#D4F338] shadow-xs group-hover:scale-105 transition-transform">
              VO
            </div>
            <div>
              <span className="font-bold tracking-tight text-[15px] text-[#121316] block leading-none">
                VeloceOps
              </span>
              <span className="text-[11px] font-medium text-[#5C605A] tracking-wider uppercase">
                B2B Treasury OS
              </span>
            </div>
          </Link>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#EAEAE4] text-[#434642] font-semibold">
              v1.0
            </span>
            {onCloseMobile && (
              <button
                onClick={onCloseMobile}
                className="lg:hidden p-1 rounded-md text-[#5C605A] hover:bg-[#EAEAE4] hover:text-[#121316]"
                title="Close navigation"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Tenant Switcher Selector */}
        <div className="mb-6 p-2 rounded-xl bg-[#EAEAE4]/60 border border-[#E2E2DC]">
          <div className="text-[10px] font-mono uppercase tracking-wider text-[#5C605A] px-1 mb-1 font-semibold flex items-center justify-between">
            <span>Active Tenant</span>
            <span className="text-[#0B6B41] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0B6B41] animate-pulse"></span>
              Live RLS
            </span>
          </div>
          <select
            value={currentTenant.id}
            onChange={(e) => {
              const found = tenants.find((t) => t.id === e.target.value);
              if (found) {
                onSelectTenant(found);
                if (onCloseMobile) onCloseMobile();
              }
            }}
            className="w-full bg-[#FFFFFF] border border-[#D0D0C8] text-xs font-semibold rounded-lg px-2.5 py-1.5 text-[#121316] outline-none focus:border-[#121316] transition-colors cursor-pointer"
          >
            {tenants.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} ({t.currency})
              </option>
            ))}
          </select>
        </div>

        {/* Core Navigation */}
        <div className="space-y-1">
          <p className="text-[10px] font-mono uppercase tracking-wider text-[#5C605A] px-2.5 mb-2 font-semibold">
            Operations
          </p>
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onCloseMobile}
                className={cn(
                  'flex items-center justify-between px-2.5 py-2 rounded-lg text-[13px] font-medium transition-all group',
                  isActive
                    ? 'bg-[#FFFFFF] text-[#121316] shadow-xs font-semibold border border-[#E2E2DC]'
                    : 'text-[#434642] hover:text-[#121316] hover:bg-[#FFFFFF]/60'
                )}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={cn(
                      'w-4 h-4 transition-colors',
                      isActive ? 'text-[#121316]' : 'text-[#5C605A] group-hover:text-[#121316]'
                    )}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={cn(
                      'text-[10px] font-mono font-medium px-1.5 py-0.5 rounded',
                      item.highlight
                        ? 'bg-[#D4F338] text-[#121316] font-semibold'
                        : 'bg-[#EAEAE4] text-[#434642]'
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Governance & RBAC */}
        <div className="space-y-1 mt-6">
          <p className="text-[10px] font-mono uppercase tracking-wider text-[#5C605A] px-2.5 mb-2 font-semibold">
            Governance
          </p>
          {adminItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onCloseMobile}
                className={cn(
                  'flex items-center justify-between px-2.5 py-2 rounded-lg text-[13px] font-medium transition-all group',
                  isActive
                    ? 'bg-[#FFFFFF] text-[#121316] shadow-xs font-semibold border border-[#E2E2DC]'
                    : 'text-[#434642] hover:text-[#121316] hover:bg-[#FFFFFF]/60'
                )}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={cn(
                      'w-4 h-4 transition-colors',
                      isActive ? 'text-[#121316]' : 'text-[#5C605A] group-hover:text-[#121316]'
                    )}
                  />
                  <span>{item.label}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-[#5C605A] opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            );
          })}
        </div>
      </div>

      {/* Connected Vaults & Sandbox Switcher footer */}
      <div className="pt-4 border-t border-[#E2E2DC]/80 space-y-3 mt-6">
        <div className="p-3 rounded-xl bg-[#FFFFFF] border border-[#E2E2DC] shadow-2xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-medium text-[#5C605A]">Connected Vault</span>
            <span className="w-2 h-2 rounded-full bg-[#0B6B41]" title="Synchronized with Fedwire"></span>
          </div>
          <div className="text-[13px] font-semibold text-[#121316] truncate">
            Mercury Treasury ACH
          </div>
          <div className="text-[11px] font-mono text-[#5C605A] tabular">
            **** 4892 • Auto-Reconcile ON
          </div>
        </div>

        <div className="flex items-center justify-between px-1 text-[11px] text-[#5C605A]">
          <Link href="/landing" onClick={onCloseMobile} className="hover:text-[#121316] transition-colors">
            Landing
          </Link>
          <span className="text-[#E2E2DC]">•</span>
          <Link href="/pricing" onClick={onCloseMobile} className="hover:text-[#121316] transition-colors">
            Pricing
          </Link>
          <span className="text-[#E2E2DC]">•</span>
          <Link href="/project/index.html" target="_blank" className="hover:text-[#121316] flex items-center gap-0.5 transition-colors">
            <span>HTMLs</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar: Visible on lg and above - Sticky pinned viewport */}
      <aside className="hidden lg:flex w-64 flex-shrink-0 flex-col justify-between p-4 pl-5 select-none text-[#121316] lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)] overflow-y-auto">
        {renderContent()}
      </aside>

      {/* Mobile Drawer: Slide-over for small screens */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop blur */}
          <div
            className="fixed inset-0 bg-[#121316]/40 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />

          {/* Drawer container */}
          <div className="relative w-72 max-w-[85vw] bg-[#F2F2EE] h-full shadow-2xl p-4 flex flex-col justify-between overflow-y-auto z-10 animate-slideRight">
            {renderContent()}
          </div>
        </div>
      )}
    </>
  );
}
