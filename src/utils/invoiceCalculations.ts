import { LineItem } from '../types';

export function calculateLineItemTotals(
  item: LineItem,
  isVATRegistered: boolean,
  vatPricingMode: 'gross' | 'net' = 'net'
) {
  const subtotal = item.quantity * item.rate;
  
  if (!isVATRegistered) {
    return {
      subtotal,
      vat: 0,
      total: subtotal,
    };
  }

  let net: number;
  let vat: number;
  let gross: number;

  if (vatPricingMode === 'gross') {
    // Amount entered is VAT inclusive
    gross = subtotal;
    net = gross / (1 + item.vatRate / 100);
    vat = gross - net;
  } else {
    // Amount entered is VAT exclusive
    net = subtotal;
    vat = net * (item.vatRate / 100);
    gross = net + vat;
  }

  return {
    subtotal: net,
    vat,
    total: gross,
  };
}

export function calculateInvoiceTotals(
  lineItems: LineItem[],
  isVATRegistered: boolean,
  vatPricingMode: 'gross' | 'net' = 'net'
) {
  let totalNet = 0;
  let totalVAT = 0;
  let totalGross = 0;

  lineItems.forEach((item) => {
    const itemTotals = calculateLineItemTotals(item, isVATRegistered, vatPricingMode);
    totalNet += itemTotals.subtotal;
    totalVAT += itemTotals.vat;
    totalGross += itemTotals.total;
  });

  return {
    net: totalNet,
    vat: totalVAT,
    gross: totalGross,
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(amount);
}
