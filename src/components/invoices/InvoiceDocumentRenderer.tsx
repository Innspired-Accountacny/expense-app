import { BusinessProfile, Invoice, LineItem } from '../../types';
import { calculateInvoiceTotals } from '../../utils/invoiceCalculations';
import { InvoiceDocument, InvoiceStyleRenderer } from '../InvoiceStyleRenderer';

interface InvoiceDocumentRendererProps {
  invoice: Invoice;
  businessProfile: BusinessProfile;
  styleId: string;
}

const toDisplayValue = (value?: string) =>
  value && value.trim().length > 0 ? value : '-';

const formatDate = (value?: string) => {
  if (!value) return '-';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return '-';
  return parsed.toLocaleDateString('en-GB');
};

const parsePaymentTermsDays = (value?: string) => {
  if (!value) return 30;
  const match = value.match(/(\d+)\s*day/i);
  if (!match) return 30;
  return Number.parseInt(match[1], 10);
};

const calculateDueDate = (invoiceDate?: string, paymentTerms?: string) => {
  if (!invoiceDate) return '-';
  const parsed = new Date(invoiceDate);
  if (Number.isNaN(parsed.getTime())) return '-';
  const dueDate = new Date(parsed);
  dueDate.setDate(dueDate.getDate() + parsePaymentTermsDays(paymentTerms));
  return dueDate.toLocaleDateString('en-GB');
};

const normalizeLineItems = (
  lineItems: LineItem[],
  isVATRegistered: boolean,
): LineItem[] =>
  lineItems.map((item) => ({
    ...item,
    description: toDisplayValue(item.description),
    quantity: Number.isFinite(item.quantity) ? item.quantity : 0,
    rate: Number.isFinite(item.rate) ? item.rate : 0,
    vatRate: Number.isFinite(item.vatRate)
      ? item.vatRate
      : isVATRegistered
        ? 20
        : 0,
  }));

export function InvoiceDocumentRenderer({
  invoice,
  businessProfile,
  styleId,
}: InvoiceDocumentRendererProps) {
  const isVATRegistered = businessProfile.isVATRegistered;
  const vatPricingMode = businessProfile.vatPricingMode ?? 'net';
  const lineItems = normalizeLineItems(invoice.lineItems || [], isVATRegistered);
  const totals = calculateInvoiceTotals(lineItems, isVATRegistered, vatPricingMode);

  const document: InvoiceDocument = {
    supplier: {
      legalName: toDisplayValue(businessProfile.legalName),
      tradingName: toDisplayValue(businessProfile.tradingName),
      address: toDisplayValue(businessProfile.address),
      email: toDisplayValue(businessProfile.email),
      phone: toDisplayValue(businessProfile.phone),
      vatNumber: isVATRegistered
        ? toDisplayValue(businessProfile.vatNumber)
        : '-',
      logo: businessProfile.logo,
    },
    customer: {
      name: toDisplayValue(invoice.customerName),
      address: toDisplayValue(invoice.customerAddress),
    },
    meta: {
      invoiceNumber: toDisplayValue(invoice.invoiceNumber),
      invoiceDate: formatDate(invoice.invoiceDate),
      supplyDate: formatDate(invoice.supplyDate || invoice.invoiceDate),
      dueDate: calculateDueDate(invoice.invoiceDate, businessProfile.paymentTerms),
    },
    lineItems,
    totals,
    isVATRegistered,
    vatPricingMode,
    paymentTerms: toDisplayValue(businessProfile.paymentTerms),
    notes: invoice.notes,
    bankDetails: invoice.bankDetails,
  };

  return <InvoiceStyleRenderer styleId={styleId} document={document} />;
}
