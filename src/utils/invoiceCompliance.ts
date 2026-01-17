import { BusinessProfile, Invoice } from '../types';

const isBlank = (value?: string | null) => !value || value.trim().length === 0;

const isValidDate = (value?: string) => {
  if (!value) return false;
  const parsed = new Date(value);
  return !Number.isNaN(parsed.getTime());
};

const isFiniteNumber = (value?: number) =>
  typeof value === 'number' && Number.isFinite(value);

export function getMissingComplianceFields(
  invoice: Invoice,
  businessProfile: BusinessProfile,
): string[] {
  const missing: string[] = [];

  if (isBlank(businessProfile.legalName)) {
    missing.push('Supplier legal name');
  }
  if (isBlank(businessProfile.address)) {
    missing.push('Supplier address');
  }
  const hasContact =
    !isBlank(businessProfile.email) || !isBlank(businessProfile.phone);
  if (!hasContact) {
    missing.push('Supplier contact (email or phone)');
  }
  if (businessProfile.isVATRegistered && isBlank(businessProfile.vatNumber)) {
    missing.push('VAT number');
  }

  if (isBlank(invoice.customerName)) {
    missing.push('Customer name');
  }
  if (isBlank(invoice.customerAddress)) {
    missing.push('Customer address');
  }

  if (isBlank(invoice.invoiceNumber)) {
    missing.push('Invoice number');
  }

  const invoiceDateValid = isValidDate(invoice.invoiceDate);
  if (!invoiceDateValid) {
    missing.push('Invoice date');
  }

  const supplyDateValid = isValidDate(invoice.supplyDate) || invoiceDateValid;
  if (!supplyDateValid) {
    missing.push('Supply date');
  }

  if (!invoice.lineItems || invoice.lineItems.length === 0) {
    missing.push('Line items');
  } else {
    invoice.lineItems.forEach((item, index) => {
      const itemIndex = index + 1;
      if (isBlank(item.description)) {
        missing.push(`Line item ${itemIndex} description`);
      }
      if (!isFiniteNumber(item.quantity)) {
        missing.push(`Line item ${itemIndex} quantity`);
      }
      if (!isFiniteNumber(item.rate)) {
        missing.push(`Line item ${itemIndex} rate`);
      }
    });
  }

  return missing;
}
