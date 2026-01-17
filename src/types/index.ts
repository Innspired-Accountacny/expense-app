export interface BusinessProfile {
  legalName: string;
  tradingName?: string;
  address: string;
  email: string;
  phone: string;
  isVATRegistered: boolean;
  vatNumber?: string;
  vatPricingMode?: 'gross' | 'net'; // gross = VAT inclusive, net = VAT exclusive
  logo?: string;
  invoiceStyle: string;
  paymentTerms?: string; // Default: "Due within 30 days"
}

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number; // per unit price
  vatRate: number; // percentage (e.g., 20 for 20%)
}

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'voided';

export interface Invoice {
  id: string;
  invoiceNumber: string;
  status: InvoiceStatus;
  customerName: string;
  customerAddress: string;
  customerEmail?: string;
  invoiceDate: string;
  supplyDate: string; // tax point
  lineItems: LineItem[];
  notes?: string;
  bankDetails?: string; // Optional bank transfer details
  includeStripeLink: boolean;
  stripePaymentLink?: string;
  createdAt: string;
  sentAt?: string;
  paidAt?: string;
  voidedAt?: string;
}

export interface Expense {
  id: string;
  merchant: string;
  amount: number;
  category: string;
  date: string;
  receiptUrl?: string;
  status: 'draft' | 'approved';
}

export interface AppSettings {
  weeklyAdminReminder: boolean;
  automatedChasing: boolean;
  accountantEmail?: string;
}

export interface OnboardingState {
  currentStep: number;
  businessProfile: Partial<BusinessProfile>;
  completed: boolean;
}

export interface InvoiceNumberPool {
  nextNumber: number;
  releasedNumbers: number[]; // numbers returned from deleted drafts
  lockedNumbers: number[]; // numbers from sent/voided invoices
}