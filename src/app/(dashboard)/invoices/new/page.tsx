'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppFrame } from '@/components/layout/app-frame';
import { Plus, Trash2, ArrowLeft, ShieldCheck, Check } from 'lucide-react';
import { createInvoiceAction } from '@/actions/invoices';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
}

export default function NewInvoicePage() {
  const router = useRouter();
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Stripe ACH Direct');
  const [dueDate, setDueDate] = useState('2026-11-15');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [items, setItems] = useState<LineItem[]>([
    {
      id: '1',
      description: 'Enterprise API Platform License (Annual)',
      quantity: 1,
      unit_price: 15000,
    },
  ]);

  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        description: '',
        quantity: 1,
        unit_price: 1000,
      },
    ]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length > 1) {
      setItems((prev) => prev.filter((i) => i.id !== id));
    }
  };

  const handleUpdateItem = (id: string, field: keyof LineItem, val: any) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, [field]: val } : i))
    );
  };

  const subtotal = items.reduce((acc, i) => acc + i.quantity * i.unit_price, 0);

  const handleSubmit = async (tenantId: string) => {
    if (!customerName || !customerEmail) {
      setErrorMsg('Please enter customer name and email.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    const res = await createInvoiceAction({
      tenant_id: tenantId,
      customer_name: customerName,
      customer_email: customerEmail,
      payment_method: paymentMethod,
      due_date: dueDate,
      currency: 'USD',
      items: items.map((it) => ({
        description: it.description,
        quantity: Number(it.quantity),
        unit_price: Number(it.unit_price),
      })),
    });

    setIsSubmitting(false);

    if (res.success) {
      router.push('/invoices');
    } else {
      setErrorMsg(res.error || 'Failed to issue invoice.');
    }
  };

  return (
    <AppFrame
      title="Issue Enterprise Invoice"
      subtitle="Create cryptographic B2B invoice with instant Stripe Hosted Portal link and automated ledger entry."
      renderCanvasContent={({ currentTenant }) => (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
          <Link
            href="/invoices"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-[#5C605A] hover:text-[#121316] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Invoices Sub-Ledger</span>
          </Link>

          {errorMsg && (
            <div className="p-3 bg-[#FEE2E2] border border-[#B91C1C]/30 text-[#B91C1C] rounded-lg text-xs font-medium">
              {errorMsg}
            </div>
          )}

          <div className="p-6 bg-[#FFFFFF] border border-[#E2E2DC] rounded-xl shadow-xs space-y-6">
            {/* Counterparty Information */}
            <div>
              <h3 className="text-sm font-bold text-[#121316] font-display mb-4">
                Counterparty & Settlement Terms
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-mono uppercase text-[#5C605A] block mb-1">
                    Customer / Company Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. OpenAI Global LLC"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-[#D0D0C8] bg-[#F8F8F5] text-[#121316] outline-none focus:border-[#121316]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono uppercase text-[#5C605A] block mb-1">
                    Billing Email (AP Contact)
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. ap-treasury@openai.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-[#D0D0C8] bg-[#F8F8F5] text-[#121316] outline-none focus:border-[#121316]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono uppercase text-[#5C605A] block mb-1">
                    Payment Method Rails
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-[#D0D0C8] bg-[#F8F8F5] text-[#121316] outline-none focus:border-[#121316]"
                  >
                    <option value="Stripe ACH Direct">Stripe ACH Direct (0.8% cap $5)</option>
                    <option value="Fedwire Transfer">Fedwire Domestic Wire</option>
                    <option value="Corporate Card">Corporate Card (Visa / Amex)</option>
                    <option value="SEPA B2B Direct Debit">SEPA B2B Direct Debit (EUR)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-mono uppercase text-[#5C605A] block mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-[#D0D0C8] bg-[#F8F8F5] text-[#121316] outline-none focus:border-[#121316]"
                  />
                </div>
              </div>
            </div>

            {/* Line Items */}
            <div className="pt-4 border-t border-[#EBEBE6]">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-[#121316] font-display">
                  Contract Deliverables & Line Items
                </h3>
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#121316] hover:underline cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Line Item</span>
                </button>
              </div>

              <div className="space-y-3">
                {items.map((it, idx) => (
                  <div key={it.id} className="flex items-center gap-3">
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="Description (e.g. Dedicated SOC2 SLA Add-on)"
                        value={it.description}
                        onChange={(e) => handleUpdateItem(it.id, 'description', e.target.value)}
                        className="w-full text-xs p-2 rounded-lg border border-[#D0D0C8] bg-[#F8F8F5] text-[#121316] outline-none focus:border-[#121316]"
                      />
                    </div>
                    <div className="w-20">
                      <input
                        type="number"
                        min="1"
                        placeholder="Qty"
                        value={it.quantity}
                        onChange={(e) => handleUpdateItem(it.id, 'quantity', Number(e.target.value))}
                        className="w-full text-xs p-2 rounded-lg border border-[#D0D0C8] bg-[#F8F8F5] text-[#121316] outline-none focus:border-[#121316] text-center"
                      />
                    </div>
                    <div className="w-32">
                      <input
                        type="number"
                        min="0"
                        step="100"
                        placeholder="Unit Price"
                        value={it.unit_price}
                        onChange={(e) => handleUpdateItem(it.id, 'unit_price', Number(e.target.value))}
                        className="w-full text-xs p-2 rounded-lg border border-[#D0D0C8] bg-[#F8F8F5] text-[#121316] outline-none focus:border-[#121316] text-right font-mono"
                      />
                    </div>
                    <div className="w-28 text-right font-mono text-xs font-bold text-[#121316] tabular">
                      {formatCurrency(it.quantity * it.unit_price, currentTenant.currency)}
                    </div>
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(it.id)}
                        className="p-1.5 text-[#5C605A] hover:text-[#B91C1C] transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Total and Submit */}
            <div className="pt-4 border-t border-[#EBEBE6] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-2 text-xs font-mono text-[#5C605A]">
                <ShieldCheck className="w-4 h-4 text-[#0B6B41]" />
                <span>Auto-signed with Tenant RLS policy</span>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-[11px] font-mono text-[#5C605A] block">Total Amount</span>
                  <span className="text-xl font-bold font-display text-[#121316] tabular">
                    {formatCurrency(subtotal, currentTenant.currency)}
                  </span>
                </div>

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleSubmit(currentTenant.id)}
                  className="px-5 py-2.5 rounded-lg bg-[#D4F338] text-[#121316] font-bold text-xs border border-[#B5D618] hover:bg-[#C5E627] active:scale-98 transition-all cursor-pointer shadow-xs disabled:opacity-50"
                >
                  {isSubmitting ? 'Issuing Document...' : 'Issue & Publish Invoice'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    />
  );
}
