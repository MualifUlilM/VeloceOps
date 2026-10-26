export type CurrencyCode = 'USD' | 'EUR' | 'GBP';

export type UserRole = 'OWNER' | 'FINANCE' | 'VIEWER';

export type InvoiceStatus = 'PENDING' | 'PAID' | 'OVERDUE';

export interface Tenant {
  id: string;
  slug: string;
  name: string;
  currency: CurrencyCode;
  operating_cash: number;
  created_at: string;
}

export interface TenantUser {
  id: string;
  tenant_id: string;
  user_id: string;
  role: UserRole;
  created_at: string;
}

export interface InvoiceItem {
  id: string;
  invoice_id: string;
  tenant_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
}

export interface Invoice {
  id: string;
  tenant_id: string;
  invoice_number: string;
  customer_name: string;
  customer_email: string;
  payment_method: string;
  status: InvoiceStatus;
  issued_date: string;
  due_date: string;
  total_amount: number;
  currency: CurrencyCode;
  stripe_invoice_id?: string;
  stripe_payment_intent_id?: string;
  items?: InvoiceItem[];
  created_at: string;
}

export interface LedgerEntry {
  id: string;
  tenant_id: string;
  invoice_id?: string;
  account_code: string;
  account_name: string;
  entry_type: 'DEBIT' | 'CREDIT';
  amount: number;
  description: string;
  created_at: string;
}

export interface BudgetCap {
  id: string;
  tenant_id: string;
  department: string;
  cap_amount: number;
  current_spend: number;
  period: string;
  created_at: string;
}

export interface AnomalyDetection {
  id: string;
  kind: 'OVERDUE_RECEIVABLE' | 'SPEND_CAP_SPIKE';
  title: string;
  description: string;
  amount: number;
  runwayImpactMonths?: number;
  monthlySavings?: number;
  actionLabel: string;
  actionHandler: string;
}
