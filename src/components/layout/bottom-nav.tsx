'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Landmark, ReceiptText, PieChart, Sparkles, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BottomNavProps {
  onOpenMenu: () => void;
}

export function BottomNav({ onOpenMenu }: BottomNavProps) {
  const pathname = usePathname();

  const items = [
    {
      label: 'Treasury',
      href: '/',
      icon: Landmark,
    },
    {
      label: 'Invoices',
      href: '/invoices',
      icon: ReceiptText,
    },
    {
      label: 'Spend',
      href: '/spend',
      icon: PieChart,
    },
    {
      label: 'AI CFO',
      href: '/ai-cfo',
      icon: Sparkles,
      hasDot: true,
    },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FFFFFF]/95 backdrop-blur-md border-t border-[#E2E2DC] px-2 py-1.5 flex items-center justify-around shadow-md safe-bottom">
      {items.map((it) => {
        const isActive = pathname === it.href || (it.href !== '/' && pathname.startsWith(it.href));
        const Icon = it.icon;

        return (
          <Link
            key={it.href}
            href={it.href}
            className={cn(
              'flex flex-col items-center justify-center py-1 px-3 rounded-lg text-[10px] font-medium transition-colors relative',
              isActive
                ? 'text-[#121316] font-bold'
                : 'text-[#5C605A] hover:text-[#121316]'
            )}
          >
            <div className="relative">
              <Icon className={cn('w-4 h-4 mb-0.5', isActive && 'text-[#121316]')} />
              {it.hasDot && (
                <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-[#D4F338] border border-[#121316]" />
              )}
            </div>
            <span>{it.label}</span>
          </Link>
        );
      })}

      {/* Menu / Drawer Trigger */}
      <button
        onClick={onOpenMenu}
        className="flex flex-col items-center justify-center py-1 px-3 rounded-lg text-[10px] font-medium text-[#5C605A] hover:text-[#121316] transition-colors cursor-pointer"
        title="Open organization and settings drawer"
      >
        <Menu className="w-4 h-4 mb-0.5" />
        <span>Menu</span>
      </button>
    </nav>
  );
}
