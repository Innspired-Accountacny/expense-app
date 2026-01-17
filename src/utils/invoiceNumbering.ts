import { InvoiceNumberPool } from '../types';

export function allocateInvoiceNumber(pool: InvoiceNumberPool): { number: string; updatedPool: InvoiceNumberPool } {
  // First check if there are any released numbers available
  if (pool.releasedNumbers.length > 0) {
    const reusedNumber = Math.min(...pool.releasedNumbers);
    return {
      number: formatInvoiceNumber(reusedNumber),
      updatedPool: {
        ...pool,
        releasedNumbers: pool.releasedNumbers.filter(n => n !== reusedNumber),
      },
    };
  }

  // Otherwise allocate the next sequential number
  const newNumber = pool.nextNumber;
  return {
    number: formatInvoiceNumber(newNumber),
    updatedPool: {
      ...pool,
      nextNumber: pool.nextNumber + 1,
    },
  };
}

export function releaseInvoiceNumber(invoiceNumber: string, pool: InvoiceNumberPool): InvoiceNumberPool {
  const numericPart = parseInt(invoiceNumber.replace('INV-', ''), 10);
  
  // Only release if not locked
  if (!pool.lockedNumbers.includes(numericPart)) {
    return {
      ...pool,
      releasedNumbers: [...pool.releasedNumbers, numericPart].sort((a, b) => a - b),
    };
  }
  
  return pool;
}

export function lockInvoiceNumber(invoiceNumber: string, pool: InvoiceNumberPool): InvoiceNumberPool {
  const numericPart = parseInt(invoiceNumber.replace('INV-', ''), 10);
  
  return {
    ...pool,
    lockedNumbers: [...pool.lockedNumbers, numericPart],
    releasedNumbers: pool.releasedNumbers.filter(n => n !== numericPart),
  };
}

function formatInvoiceNumber(num: number): string {
  return `INV-${String(num).padStart(5, '0')}`;
}
