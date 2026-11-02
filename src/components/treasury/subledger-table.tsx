'use client';

import { Invoice, InvoiceStatus } from '@/types/veloceops';
import { formatCurrency } from '@/lib/utils';
import { CheckCircle2, AlertCircle, Clock, ChevronRight } from 'lucide-react';

interface SubLedgerTableProps {
  invoices: Invoice[];
  selectedInvoiceId: string | null;
  onSelectInvoice: (invoice: Invoice) => void;
}

export function SubLedgerTable({
  invoices,
  selectedInvoiceId,
  onSelectInvoice,
}: SubLedgerTableProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const renderStatusDot = (status: InvoiceStatus) => {
    switch (status) {
      case 'PAID':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-mono text-[#0B6B41] font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0B6B41]"></span>
            <span>Paid</span>
          </span>
        );
      case 'OVERDUE':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-mono text-[#B91C1C] font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B91C1C]"></span>
            <span>Overdue</span>
          </span>
        );
      case 'PENDING':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-mono text-[#8C4608] font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8C4608]"></span>
            <span>Pending</span>
          </span>
        );
    }
  };

  return (
    <div className="flex-1 overflow-x-auto">
      <table className="w-full text-left text-xs border-collapse">
        <thead>
          <tr className="border-b border-[#EBEBE6] bg-[#F8F8F5] text-[#5C605A] font-mono text-[11px] uppercase tracking-wider">
            <th className="py-3 px-4 font-semibold">Account / Counterparty</th>
            <th className="py-3 px-4 font-semibold">Invoice No.</th>
            <th className="py-3 px-4 font-semibold">Status</th>
            <th className="py-3 px-4 font-semibold">Due Date</th>
            <th className="py-3 px-4 font-semibold text-right">Settled Amount</th>
            <th className="py-3 px-2"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#EBEBE6]">
          {invoices.map((inv) => {
            const isSelected = selectedInvoiceId === inv.id;
            return (
              <tr
                key={inv.id}
                onClick={() => onSelectInvoice(inv)}
                className={`cursor-pointer transition-colors group ${
                  isSelected
                    ? 'bg-[#F4F4F0] font-medium'
                    : 'hover:bg-[#F8F8F5]/80 bg-[#FFFFFF]'
                }`}
              >
                {/* Counterparty avatar and name */}
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-md bg-[#F2F2EE] border border-[#E2E2DC] flex items-center justify-center font-mono font-bold text-[10px] text-[#121316]">
                      {getInitials(inv.customer_name)}
                    </div>
                    <div>
                      <div className="font-semibold text-[#121316] text-[13px] leading-tight">
                        {inv.customer_name}
                      </div>
                      <div className="text-[11px] text-[#5C605A] font-mono">
                        {inv.payment_method}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Invoice Number */}
                <td className="py-3 px-4 font-mono text-[#434642] font-medium">
                  {inv.invoice_number}
                </td>

                {/* Status Dot */}
                <td className="py-3 px-4 whitespace-nowrap">
                  {renderStatusDot(inv.status)}
                </td>

                {/* Due Date */}
                <td className="py-3 px-4 font-mono text-[#5C605A]">
                  {inv.due_date}
                </td>

                {/* Amount */}
                <td className="py-3 px-4 text-right font-mono text-[13px] font-bold text-[#121316] tabular">
                  {formatCurrency(inv.total_amount, inv.currency)}
                </td>

                {/* Arrow indicator */}
                <td className="py-3 px-2 text-right">
                  <ChevronRight
                    className={`w-4 h-4 transition-transform text-[#5C605A] ${
                      isSelected ? 'text-[#121316] translate-x-0.5' : 'opacity-40 group-hover:opacity-100'
                    }`}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
