'use client';

import { useState } from 'react';
import { Sidebar } from './sidebar';
import { CanvasHeader } from './canvas-header';
import { Tenant, UserRole, Invoice } from '@/types/veloceops';
import { INITIAL_TENANTS, INITIAL_INVOICES } from '@/lib/data';

interface AppFrameProps {
  children?: React.ReactNode;
  renderCanvasContent?: (context: {
    currentTenant: Tenant;
    userRole: UserRole;
    invoices: Invoice[];
    selectedInvoice: Invoice | null;
    setSelectedInvoice: (inv: Invoice | null) => void;
    onMarkAsPaid: (id: string) => void;
  }) => React.ReactNode;
  title?: string;
  subtitle?: string;
}

export function AppFrame({
  children,
  renderCanvasContent,
  title,
  subtitle,
}: AppFrameProps) {
  const [tenants, setTenants] = useState<Tenant[]>(INITIAL_TENANTS);
  const [currentTenant, setCurrentTenant] = useState<Tenant>(INITIAL_TENANTS[0]);
  const [userRole, setUserRole] = useState<UserRole>('OWNER');
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(INITIAL_INVOICES[0]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filter invoices for current tenant
  const tenantInvoices = invoices.filter((i) => i.tenant_id === currentTenant.id);

  // Webhook Simulation handler
  const handleSimulateWebhook = async () => {
    setIsSimulating(true);

    // Find the first unpaid invoice (pending or overdue)
    const targetInvoice = tenantInvoices.find((i) => i.status !== 'PAID') || tenantInvoices[0];

    setTimeout(() => {
      if (targetInvoice) {
        // 1. Mark as PAID
        setInvoices((prev) =>
          prev.map((inv) =>
            inv.id === targetInvoice.id ? { ...inv, status: 'PAID' } : inv
          )
        );

        // Update selected if matching
        if (selectedInvoice?.id === targetInvoice.id) {
          setSelectedInvoice({ ...targetInvoice, status: 'PAID' });
        }

        // 2. Increment cash balance
        setCurrentTenant((prev) => ({
          ...prev,
          operating_cash: prev.operating_cash + targetInvoice.total_amount,
        }));

        setToastMessage(
          `Webhook Reconciled! ${targetInvoice.invoice_number} paid via Stripe ACH. +$${targetInvoice.total_amount.toLocaleString()} added to cash balance.`
        );
      } else {
        setToastMessage('All invoices are already reconciled and paid!');
      }

      setIsSimulating(false);
      setTimeout(() => setToastMessage(null), 5000);
    }, 700);
  };

  const handleMarkAsPaid = (invoiceId: string) => {
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id === invoiceId) {
          setCurrentTenant((t) => ({ ...t, operating_cash: t.operating_cash + inv.total_amount }));
          return { ...inv, status: 'PAID' };
        }
        return inv;
      })
    );

    if (selectedInvoice?.id === invoiceId) {
      setSelectedInvoice((prev) => (prev ? { ...prev, status: 'PAID' } : null));
    }

    setToastMessage(`Invoice #${invoiceId.slice(0, 8)} manually marked as reconciled.`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="min-h-screen bg-[#F2F2EE] flex p-3 md:p-4 gap-4 overflow-x-hidden">
      {/* Left Sidebar */}
      <Sidebar
        currentTenant={currentTenant}
        onSelectTenant={(t) => {
          setCurrentTenant(t);
          const first = invoices.find((i) => i.tenant_id === t.id);
          setSelectedInvoice(first || null);
        }}
        tenants={tenants}
      />

      {/* Main Inset Canvas (Linear / Attio style: 20px radius) */}
      <main className="flex-1 min-w-0 bg-[#FFFFFF] rounded-[20px] border border-[#E2E2DC] shadow-sm flex flex-col overflow-hidden">
        <CanvasHeader
          currentTenant={currentTenant}
          userRole={userRole}
          onSelectRole={setUserRole}
          onSimulateWebhook={handleSimulateWebhook}
          isSimulating={isSimulating}
          title={title}
          subtitle={subtitle}
        />

        {/* Global Toast Notification */}
        {toastMessage && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-[#121316] text-[#FFFFFF] text-xs font-mono flex items-center justify-between shadow-lg animate-fadeIn border border-[#434642]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#D4F338] animate-pulse"></span>
              <span>{toastMessage}</span>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="text-[#D4F338] hover:underline ml-4 text-[11px] font-bold cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          {renderCanvasContent
            ? renderCanvasContent({
                currentTenant,
                userRole,
                invoices: tenantInvoices,
                selectedInvoice,
                setSelectedInvoice,
                onMarkAsPaid: handleMarkAsPaid,
              })
            : children}
        </div>
      </main>
    </div>
  );
}
