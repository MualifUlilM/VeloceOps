'use client';

import { useState } from 'react';
import { AppFrame } from '@/components/layout/app-frame';
import { MetricStrip } from '@/components/treasury/metric-strip';
import { CashflowChart } from '@/components/treasury/cashflow-chart';
import { SubLedgerTable } from '@/components/treasury/subledger-table';
import { InvoicePaper } from '@/components/treasury/invoice-paper';
import { AnomalyPanel } from '@/components/ai-cfo/anomaly-panel';
import { INITIAL_ANOMALIES } from '@/lib/data';
import { Search, Filter, Download } from 'lucide-react';
import { InvoiceStatus } from '@/types/veloceops';

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | 'ALL'>('ALL');
  const [mobileTab, setMobileTab] = useState<'table' | 'paper'>('table');

  return (
    <AppFrame
      title="Treasury & Liquidity Engine"
      subtitle="Real-time multi-tenant cash position, sub-ledger receivables, and AI CFO surveillance."
      renderCanvasContent={({ currentTenant, invoices, selectedInvoice, setSelectedInvoice, onMarkAsPaid }) => {
        // Calculate AR
        const receivables = invoices
          .filter((i) => i.status !== 'PAID')
          .reduce((acc, curr) => acc + curr.total_amount, 0);

        // Filter invoices by search and status
        const filteredInvoices = invoices.filter((inv) => {
          const matchQuery =
            inv.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            inv.invoice_number.toLowerCase().includes(searchQuery.toLowerCase());
          const matchStatus = statusFilter === 'ALL' || inv.status === statusFilter;
          return matchQuery && matchStatus;
        });

        const handleSelectRow = (inv: typeof filteredInvoices[0]) => {
          setSelectedInvoice(inv);
          setMobileTab('paper');
        };

        return (
          <div className="flex flex-col">
            {/* 1. Metric Strip */}
            <MetricStrip
              operatingCash={currentTenant.operating_cash}
              receivables={receivables}
              burnRate={42380}
              runwayMonths={currentTenant.operating_cash / 42380}
              arr={528000}
              nrr={109.4}
              currency={currentTenant.currency}
            />

            {/* 2. Cashflow Chart */}
            <CashflowChart currency={currentTenant.currency} />

            {/* 3. Sub-Ledger Master / Detail Split View */}
            <div className="p-4 sm:p-6 border-b border-[#EBEBE6] bg-[#FFFFFF] w-full max-w-full overflow-hidden box-border">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 sm:gap-4 mb-3 sm:mb-4">
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-[#121316] font-display">
                    Accounts Receivable Sub-Ledger
                  </h2>
                  <p className="text-[11px] sm:text-xs text-[#5C605A] mt-0.5 line-clamp-1 sm:line-clamp-none">
                    Click any counterparty row to inspect cryptographic document and payment state.
                  </p>
                </div>

                {/* Search & Filter Toolbar */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                  <div className="relative flex-1">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#5C605A]" />
                    <input
                      type="text"
                      placeholder="Filter counterparties..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8 pr-2.5 py-1 text-xs bg-[#F8F8F5] border border-[#E2E2DC] rounded-lg text-[#121316] placeholder-[#5C605A] outline-none focus:border-[#121316] transition-colors w-full sm:w-44"
                    />
                  </div>

                  <div className="grid grid-cols-4 sm:flex items-center bg-[#F8F8F5] border border-[#E2E2DC] rounded-lg p-0.5 text-xs w-full sm:w-auto">
                    {(['ALL', 'PENDING', 'OVERDUE', 'PAID'] as const).map((s) => (
                      <button
                        key={s}
                        onClick={() => setStatusFilter(s)}
                        className={`px-1.5 sm:px-2 py-1 sm:py-0.5 rounded text-[10px] sm:text-[11px] font-mono transition-colors cursor-pointer text-center whitespace-nowrap ${
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
              </div>

              {/* Mobile View Segmented Tab (Visible on small screens) */}
              <div className="lg:hidden flex items-center p-0.5 sm:p-1 bg-[#F2F2EE] rounded-xl border border-[#E2E2DC] mb-3 w-full">
                <button
                  onClick={() => setMobileTab('table')}
                  className={`flex-1 py-1.5 text-[11px] font-semibold rounded-lg transition-all truncate px-1 ${
                    mobileTab === 'table'
                      ? 'bg-[#FFFFFF] text-[#121316] shadow-2xs font-bold'
                      : 'text-[#5C605A]'
                  }`}
                >
                  Sub-Ledger ({filteredInvoices.length})
                </button>
                <button
                  onClick={() => setMobileTab('paper')}
                  className={`flex-1 py-1.5 text-[11px] font-semibold rounded-lg transition-all truncate px-1 ${
                    mobileTab === 'paper'
                      ? 'bg-[#FFFFFF] text-[#121316] shadow-2xs font-bold'
                      : 'text-[#5C605A]'
                  }`}
                >
                  Document {selectedInvoice ? `(${selectedInvoice.invoice_number})` : ''}
                </button>
              </div>

              {/* Master-Detail Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full min-w-0">
                {/* Table Left: 7 cols */}
                <div
                  className={`lg:col-span-7 border border-[#EBEBE6] rounded-xl overflow-hidden shadow-2xs min-w-0 w-full ${
                    mobileTab === 'table' ? 'block' : 'hidden lg:block'
                  }`}
                >
                  <SubLedgerTable
                    invoices={filteredInvoices}
                    selectedInvoiceId={selectedInvoice?.id || null}
                    onSelectInvoice={handleSelectRow}
                  />
                </div>

                {/* Document Inspector Right: 5 cols */}
                <div
                  className={`lg:col-span-5 sticky top-4 min-w-0 w-full ${
                    mobileTab === 'paper' ? 'block' : 'hidden lg:block'
                  }`}
                >
                  <InvoicePaper invoice={selectedInvoice} onMarkAsPaid={onMarkAsPaid} />
                </div>
              </div>
            </div>

            {/* 4. AI CFO Autonomous Surveillance */}
            <AnomalyPanel
              anomalies={INITIAL_ANOMALIES}
              currency={currentTenant.currency}
            />
          </div>
        );
      }}
    />
  );
}
