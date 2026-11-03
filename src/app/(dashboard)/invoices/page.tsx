'use client';

import { useState } from 'react';
import { AppFrame } from '@/components/layout/app-frame';
import { SubLedgerTable } from '@/components/treasury/subledger-table';
import { InvoicePaper } from '@/components/treasury/invoice-paper';
import { Search, Plus, Download, Filter } from 'lucide-react';
import { Invoice, InvoiceStatus } from '@/types/veloceops';
import Link from 'next/link';

export default function InvoicesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | 'ALL'>('ALL');
  const [mobileTab, setMobileTab] = useState<'table' | 'paper'>('table');

  const handleExportCSV = (invoicesToExport: Invoice[], tenantSlug: string) => {
    const headers = ['Invoice Number', 'Customer Name', 'Billing Email', 'Payment Method', 'Status', 'Issued Date', 'Due Date', 'Total Amount', 'Currency'];
    const rows = invoicesToExport.map((inv) => [
      inv.invoice_number,
      `"${inv.customer_name.replace(/"/g, '""')}"`,
      inv.customer_email,
      `"${inv.payment_method}"`,
      inv.status,
      inv.issued_date,
      inv.due_date,
      inv.total_amount.toFixed(2),
      inv.currency,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `veloceops-invoices-${tenantSlug}-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

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
          <div className="p-3.5 sm:p-6 space-y-4 sm:space-y-6 w-full max-w-full overflow-hidden box-border">
            {/* Quick KPI Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 w-full">
              <div className="p-3.5 sm:p-4 rounded-xl border border-[#E2E2DC] bg-[#F8F8F5]">
                <span className="text-[10px] sm:text-[11px] font-mono uppercase text-[#5C605A] block mb-1 font-semibold">
                  Total Receivables Pool
                </span>
                <span className="text-lg sm:text-xl font-bold font-display text-[#121316] tabular">
                  ${totalInvoiced.toLocaleString()}
                </span>
              </div>
              <div className="p-3.5 sm:p-4 rounded-xl border border-[#E2E2DC] bg-[#F8F8F5]">
                <span className="text-[10px] sm:text-[11px] font-mono uppercase text-[#5C605A] block mb-1 font-semibold">
                  Settled Collections
                </span>
                <span className="text-lg sm:text-xl font-bold font-display text-[#0B6B41] tabular">
                  ${totalPaid.toLocaleString()}
                </span>
              </div>
              <div className="p-3.5 sm:p-4 rounded-xl border border-[#E2E2DC] bg-[#F8F8F5]">
                <span className="text-[10px] sm:text-[11px] font-mono uppercase text-[#5C605A] block mb-1 font-semibold">
                  Outstanding & Overdue
                </span>
                <span className="text-lg sm:text-xl font-bold font-display text-[#B91C1C] tabular">
                  ${(totalInvoiced - totalPaid).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Filter Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4 w-full">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto">
                <div className="relative flex-1 sm:w-56">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#5C605A]" />
                  <input
                    type="text"
                    placeholder="Search invoice or customer..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 pr-3 py-1.5 text-xs bg-[#FFFFFF] border border-[#E2E2DC] rounded-lg text-[#121316] placeholder-[#5C605A] outline-none focus:border-[#121316] transition-colors w-full"
                  />
                </div>

                <div className="flex items-center justify-between sm:justify-start bg-[#F8F8F5] border border-[#E2E2DC] rounded-lg p-1 text-xs">
                  {(['ALL', 'PENDING', 'OVERDUE', 'PAID'] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setStatusFilter(s)}
                      className={`flex-1 sm:flex-none px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-mono transition-colors cursor-pointer text-center ${
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

              <div className="flex items-center justify-between sm:justify-end gap-2 w-full md:w-auto">
                <button
                  onClick={() => handleExportCSV(filteredInvoices, currentTenant.slug)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#FFFFFF] text-[#121316] border border-[#D0D0C8] hover:bg-[#F2F2EE] transition-colors cursor-pointer"
                  title="Download verified invoices CSV"
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

            {/* Mobile View Segmented Tab (Visible on small screens) */}
            <div className="lg:hidden flex items-center p-1 bg-[#F2F2EE] rounded-xl border border-[#E2E2DC]">
              <button
                onClick={() => setMobileTab('table')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  mobileTab === 'table'
                    ? 'bg-[#FFFFFF] text-[#121316] shadow-2xs font-bold'
                    : 'text-[#5C605A]'
                }`}
              >
                Invoices Table ({filteredInvoices.length})
              </button>
              <button
                onClick={() => setMobileTab('paper')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  mobileTab === 'paper'
                    ? 'bg-[#FFFFFF] text-[#121316] shadow-2xs font-bold'
                    : 'text-[#5C605A]'
                }`}
              >
                Document {selectedInvoice ? `(${selectedInvoice.invoice_number})` : ''}
              </button>
            </div>

            {/* Split View */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full min-w-0">
              <div
                className={`lg:col-span-7 border border-[#EBEBE6] rounded-xl overflow-hidden shadow-2xs min-w-0 w-full ${
                  mobileTab === 'table' ? 'block' : 'hidden lg:block'
                }`}
              >
                <SubLedgerTable
                  invoices={filteredInvoices}
                  selectedInvoiceId={selectedInvoice?.id || null}
                  onSelectInvoice={(inv) => {
                    setSelectedInvoice(inv);
                    setMobileTab('paper');
                  }}
                />
              </div>

              <div
                className={`lg:col-span-5 sticky top-4 min-w-0 w-full ${
                  mobileTab === 'paper' ? 'block' : 'hidden lg:block'
                }`}
              >
                <InvoicePaper invoice={selectedInvoice} onMarkAsPaid={onMarkAsPaid} />
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
