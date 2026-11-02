export type CurrencyCode = 'USD' | 'EUR' | 'GBP';
export type UserRole = 'OWNER' | 'FINANCE' | 'VIEWER';
export type InvoiceStatus = 'PENDING' | 'PAID' | 'OVERDUE';

export interface Tenant {
  id: string;
  slug: string;
  name: string;
  currency: CurrencyCode;
  operating_cash: number;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total_price: number;
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
  items?: InvoiceItem[];
}

export interface BudgetCap {
  id: string;
  tenant_id: string;
  department: string;
  cap_amount: number;
  current_spend: number;
  period: string;
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
}
