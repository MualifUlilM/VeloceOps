'use client';

import { use } from 'react';
import Link from 'next/link';
import { AppFrame } from '@/components/layout/app-frame';
import { InvoicePaper } from '@/components/treasury/invoice-paper';
import { ArrowLeft } from 'lucide-react';

export default function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const invoiceId = unwrappedParams.id;

  return (
    <AppFrame
      title="Invoice Audit Detail"
      subtitle={`Immutable cryptographic ledger document verification for ${invoiceId}.`}
      renderCanvasContent={({ invoices, onMarkAsPaid }) => {
        const invoice = invoices.find((i) => i.id === invoiceId) || invoices[0];

        return (
          <div className="max-w-3xl mx-auto p-6 space-y-4">
            <Link
              href="/invoices"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-[#5C605A] hover:text-[#121316] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Invoices Sub-Ledger</span>
            </Link>

            <InvoicePaper invoice={invoice} onMarkAsPaid={onMarkAsPaid} />
          </div>
        );
      }}
    />
  );
}
