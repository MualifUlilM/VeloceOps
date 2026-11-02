'use client';

import { useState } from 'react';
import { AppFrame } from '@/components/layout/app-frame';
import { SubLedgerTable } from '@/components/treasury/subledger-table';
import { InvoicePaper } from '@/components/treasury/invoice-paper';
import { Search, Plus, Download, Filter } from 'lucide-react';
import { InvoiceStatus } from '@/types/veloceops';
import Link from 'next/link';

export default function InvoicesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | 'ALL'>('ALL');

  return (
    <AppFrame
      title="Smart Invoicing & Accounts Receivable"
      subtitle="Issue cryptographically verified B2B invoices with automated Stripe payment links and RLS multi-tenant protection."
      renderCanvasContent={({ currentTenant, invoices, selectedInvoice, setSelectedInvoice, onMarkAsPaid }) => {
        const filteredInvoices = invoices.filter((inv) => {
          const matchQuery =
            inv.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            inv.invoice_number.toLowerCase().includes(searchQuery.toLowerCase());
          const matchStatus = statusFilter === 'ALL' || inv.status === statusFilter;
          return matchQuery && matchStatus;
        });

        const totalInvoiced = invoices.reduce((acc, i) => acc + i.total_amount, 0);
        const totalPaid = invoices
          .filter((i) => i.status === 'PAID')
          .reduce((acc, i) => acc + i.total_amount, 0);

        return (
          <div className="p-6 space-y-6">
            {/* Quick KPI Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-[#E2E2DC] bg-[#F8F8F5]">
                <span className="text-[11px] font-mono uppercase text-[#5C605A] block mb-1">
                  Total Receivables Pool
                </span>
                <span className="text-xl font-bold font-display text-[#121316] tabular">
                  ${totalInvoiced.toLocaleString()}
                </span>
              </div>
              <div className="p-4 rounded-xl border border-[#E2E2DC] bg-[#F8F8F5]">
                <span className="text-[11px] font-mono uppercase text-[#5C605A] block mb-1">
                  Settled Collections
                </span>
                <span className="text-xl font-bold font-display text-[#0B6B41] tabular">
                  ${totalPaid.toLocaleString()}
                </span>
              </div>
              <div className="p-4 rounded-xl border border-[#E2E2DC] bg-[#F8F8F5]">
                <span className="text-[11px] font-mono uppercase text-[#5C605A] block mb-1">
                  Outstanding & Overdue
                </span>
                <span className="text-xl font-bold font-display text-[#B91C1C] tabular">
                  ${(totalInvoiced - totalPaid).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Filter Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#5C605A]" />
                  <input
                    type="text"
                    placeholder="Search invoice or customer..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 pr-3 py-1.5 text-xs bg-[#FFFFFF] border border-[#E2E2DC] rounded-lg text-[#121316] placeholder-[#5C605A] outline-none focus:border-[#121316] transition-colors w-60"
                  />
                </div>

                <div className="flex items-center bg-[#F8F8F5] border border-[#E2E2DC] rounded-lg p-1 text-xs">
                  {(['ALL', 'PENDING', 'OVERDUE', 'PAID'] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setStatusFilter(s)}
                      className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors cursor-pointer ${
                        statusFilter === s
                          ? 'bg-[#FFFFFF] text-[#121316] font-bold shadow-2xs'
                          : 'text-[#5C605A] hover:text-[#121316]'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert('Exporting verified invoices CSV for audit...')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#FFFFFF] text-[#121316] border border-[#D0D0C8] hover:bg-[#F2F2EE] transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
                <Link
                  href="/invoices/new"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#D4F338] text-[#121316] border border-[#B5D618] hover:bg-[#C5E627] transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Issue New Invoice</span>
                </Link>
              </div>
            </div>

            {/* Split View */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-7 border border-[#EBEBE6] rounded-xl overflow-hidden shadow-2xs">
                <SubLedgerTable
                  invoices={filteredInvoices}
                  selectedInvoiceId={selectedInvoice?.id || null}
                  onSelectInvoice={setSelectedInvoice}
                />
              </div>

              <div className="lg:col-span-5 sticky top-4">
                <InvoicePaper invoice={selectedInvoice} onMarkAsPaid={onMarkAsPaid} />
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
