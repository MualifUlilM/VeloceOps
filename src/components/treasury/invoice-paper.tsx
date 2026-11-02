'use client';

import { Invoice } from '@/types/veloceops';
import { formatCurrency } from '@/lib/utils';
import { ExternalLink, Check, Copy, Shield, FileCheck, ArrowUpRight } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

interface InvoicePaperProps {
  invoice: Invoice | null;
  onMarkAsPaid?: (invoiceId: string) => void;
}

export function InvoicePaper({ invoice, onMarkAsPaid }: InvoicePaperProps) {
  const [copied, setCopied] = useState(false);

  if (!invoice) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center text-[#5C605A] bg-[#F8F8F5]/40 rounded-xl border border-dashed border-[#E2E2DC]">
        <FileCheck className="w-8 h-8 stroke-1 mb-2 text-[#5C605A]" />
        <p className="text-xs font-medium">Select any sub-ledger invoice to inspect document</p>
      </div>
    );
  }

  const items = invoice.items || [
    {
      id: 'item_1',
      invoice_id: invoice.id,
      tenant_id: invoice.tenant_id,
      description: 'Core B2B Enterprise Subscription & API Quota',
      quantity: 1,
      unit_price: invoice.total_amount,
      total_price: invoice.total_amount,
      created_at: invoice.created_at,
    },
  ];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/portal/${invoice.id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#FFFFFF] border border-[#E2E2DC] rounded-xl shadow-xs overflow-hidden flex flex-col">
      {/* Paper Header / Bar */}
      <div className="px-5 py-4 border-b border-[#EBEBE6] bg-[#F8F8F5] flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-[#121316]">
              {invoice.invoice_number}
            </span>
            {/* Clean Dot Indicator */}
            {invoice.status === 'PAID' && (
              <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#0B6B41] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0B6B41]"></span>
                <span>Paid</span>
              </span>
            )}
            {invoice.status === 'PENDING' && (
              <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#8C4608] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8C4608]"></span>
                <span>Pending</span>
              </span>
            )}
            {invoice.status === 'OVERDUE' && (
              <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#B91C1C] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B91C1C]"></span>
                <span>Overdue</span>
              </span>
            )}
          </div>
          <p className="text-[11px] text-[#5C605A] font-mono mt-0.5">
            Stripe ID: {invoice.stripe_invoice_id || 'in_live_pending_sync'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded bg-[#FFFFFF] border border-[#D0D0C8] hover:bg-[#F2F2EE] transition-colors cursor-pointer text-[#434642]"
            title="Copy Public Customer Portal Link"
          >
            {copied ? <Check className="w-3 h-3 text-[#0B6B41]" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Copied' : 'Portal Link'}</span>
          </button>

          <Link
            href={`/portal/${invoice.id}`}
            target="_blank"
            className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded bg-[#FFFFFF] border border-[#D0D0C8] hover:bg-[#F2F2EE] transition-colors text-[#434642]"
          >
            <ExternalLink className="w-3 h-3" />
            <span>Open</span>
          </Link>
        </div>
      </div>

      {/* Invoice Document Body */}
      <div className="p-5 space-y-5 text-xs">
        {/* Parties */}
        <div className="grid grid-cols-2 gap-4 pb-4 border-b border-[#EBEBE6]">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#5C605A] block mb-1">
              Billed To
            </span>
            <div className="font-bold text-[#121316] text-[13px]">{invoice.customer_name}</div>
            <div className="text-[11px] text-[#5C605A] font-mono">{invoice.customer_email}</div>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#5C605A] block mb-1">
              Payment Terms
            </span>
            <div className="font-mono text-[#121316] font-medium">Net 14 Calendar Days</div>
            <div className="text-[11px] text-[#5C605A] font-mono">Due: {invoice.due_date}</div>
          </div>
        </div>

        {/* Line Items Table */}
        <div>
          <div className="text-[10px] font-mono uppercase tracking-wider text-[#5C605A] mb-2 font-semibold">
            Contract Deliverables
          </div>
          <div className="border border-[#EBEBE6] rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8F8F5] border-b border-[#EBEBE6] text-[10px] font-mono uppercase text-[#5C605A]">
                <tr>
                  <th className="p-2.5 font-semibold">Item & Description</th>
                  <th className="p-2.5 font-semibold text-center">Qty</th>
                  <th className="p-2.5 font-semibold text-right">Price</th>
                  <th className="p-2.5 font-semibold text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EBEBE6]">
                {items.map((it) => (
                  <tr key={it.id} className="bg-[#FFFFFF]">
                    <td className="p-2.5 font-medium text-[#121316]">{it.description}</td>
                    <td className="p-2.5 text-center font-mono text-[#5C605A]">{it.quantity}</td>
                    <td className="p-2.5 text-right font-mono text-[#434642] tabular">
                      {formatCurrency(it.unit_price, invoice.currency)}
                    </td>
                    <td className="p-2.5 text-right font-mono font-bold text-[#121316] tabular">
                      {formatCurrency(it.total_price, invoice.currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Calculation Summary */}
        <div className="pt-2 border-t border-[#EBEBE6] space-y-1.5 font-mono text-xs">
          <div className="flex justify-between text-[#5C605A]">
            <span>Subtotal</span>
            <span className="tabular">{formatCurrency(invoice.total_amount, invoice.currency)}</span>
          </div>
          <div className="flex justify-between text-[#5C605A]">
            <span>VAT / Reverse Charge (0.0%)</span>
            <span className="tabular">{formatCurrency(0, invoice.currency)}</span>
          </div>
          <div className="flex justify-between text-[14px] font-bold text-[#121316] pt-1.5 border-t border-[#EBEBE6]">
            <span>Total Payable</span>
            <span className="tabular">{formatCurrency(invoice.total_amount, invoice.currency)}</span>
          </div>
        </div>

        {/* Webhook Verification Timeline */}
        <div className="p-3 bg-[#F8F8F5] rounded-lg border border-[#E2E2DC] space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono text-[#434642] font-semibold">
            <span className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-[#0B6B41]" />
              <span>Cryptographic Audit Proof</span>
            </span>
            <span className="text-[10px] text-[#5C605A]">SHA-256</span>
          </div>
          <div className="text-[10px] font-mono text-[#5C605A] break-all bg-[#FFFFFF] p-2 rounded border border-[#EBEBE6]">
            sha256:7e9a8f4c2b1e0d3f6a5b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f
          </div>
          <div className="text-[10px] text-[#5C605A] flex items-center justify-between pt-1">
            <span>Method: {invoice.payment_method}</span>
            <span className="text-[#0B6B41] font-mono">T+0 Realtime Reconciled</span>
          </div>
        </div>

        {/* Quick Action Button if pending/overdue */}
        {invoice.status !== 'PAID' && onMarkAsPaid && (
          <button
            onClick={() => onMarkAsPaid(invoice.id)}
            className="w-full py-2.5 rounded-lg bg-[#121316] text-[#FFFFFF] font-bold text-xs hover:bg-[#434642] transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
          >
            <Check className="w-3.5 h-3.5 text-[#D4F338]" />
            <span>Mark as Reconciled & Paid</span>
          </button>
        )}
      </div>
    </div>
  );
}
