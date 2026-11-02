'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { INITIAL_INVOICES } from '@/lib/data';
import { formatCurrency } from '@/lib/utils';
import { ShieldCheck, CheckCircle2, Lock, ArrowLeft, CreditCard } from 'lucide-react';

export default function CustomerPortalPage({ params }: { params: Promise<{ invoiceId: string }> }) {
  const unwrappedParams = use(params);
  const invoiceId = unwrappedParams.invoiceId;

  const invoice = INITIAL_INVOICES.find((i) => i.id === invoiceId) || INITIAL_INVOICES[0];
  const [isPaid, setIsPaid] = useState(invoice.status === 'PAID');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsPaid(true);
      setIsProcessing(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#F2F2EE] flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-[#FFFFFF] rounded-[20px] border border-[#E2E2DC] shadow-lg p-6 sm:p-8 space-y-6">
        {/* Brand Header */}
        <div className="flex items-center justify-between pb-6 border-b border-[#EBEBE6]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-[#121316] flex items-center justify-center font-bold text-xs text-[#D4F338]">
              VO
            </div>
            <div>
              <span className="font-bold text-sm text-[#121316] block">VeloceOps Checkout</span>
              <span className="text-[11px] text-[#5C605A]">Hosted B2B Payment Portal</span>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#0B6B41]">
            <Lock className="w-3 h-3" />
            256-bit TLS Encrypted
          </span>
        </div>

        {/* Invoice Summary */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono uppercase text-[#5C605A]">Invoice Total Due</span>
            {isPaid ? (
              <span className="inline-flex items-center gap-1 text-xs font-mono text-[#0B6B41] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0B6B41]"></span>
                Paid & Settled
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs font-mono text-[#8C4608] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8C4608]"></span>
                Payment Pending
              </span>
            )}
          </div>
          <div className="text-3xl font-bold font-display text-[#121316] tabular">
            {formatCurrency(invoice.total_amount, invoice.currency)}
          </div>
          <p className="text-xs text-[#5C605A] mt-1">
            Issued to <span className="font-semibold text-[#121316]">{invoice.customer_name}</span> for {invoice.invoice_number}.
          </p>
        </div>

        {/* Line Items List */}
        <div className="border border-[#EBEBE6] rounded-xl p-4 bg-[#F8F8F5] space-y-2 text-xs">
          <div className="font-mono text-[10px] uppercase text-[#5C605A] font-semibold">
            Deliverables
          </div>
          {(invoice.items || []).map((it, idx) => (
            <div key={idx} className="flex justify-between items-center py-1 border-b border-[#EBEBE6] last:border-0">
              <span className="text-[#121316] font-medium">{it.description}</span>
              <span className="font-mono font-bold text-[#121316] tabular">
                {formatCurrency(it.total_price, invoice.currency)}
              </span>
            </div>
          ))}
        </div>

        {/* Payment Action */}
        {isPaid ? (
          <div className="p-4 rounded-xl bg-[#E6F6EE] border border-[#0B6B41]/20 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-[#0B6B41] mx-auto" />
            <h4 className="font-bold text-sm text-[#0B6B41]">Payment Successfully Confirmed</h4>
            <p className="text-xs text-[#0B6B41]/80 font-mono">
              ACH Settlement Receipt: rct_9024f2b1a03c
            </p>
          </div>
        ) : (
          <button
            onClick={handlePay}
            disabled={isProcessing}
            className="w-full py-3 rounded-xl bg-[#121316] text-[#FFFFFF] font-bold text-sm hover:bg-[#434642] active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-60"
          >
            <CreditCard className="w-4 h-4 text-[#D4F338]" />
            <span>{isProcessing ? 'Authorizing Fedwire / ACH...' : 'Authorize Stripe Payment'}</span>
          </button>
        )}

        <div className="text-center pt-2">
          <Link
            href="/"
            className="text-xs text-[#5C605A] hover:text-[#121316] transition-colors inline-flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to VeloceOps Workspace</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
