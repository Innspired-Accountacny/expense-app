import { InvoiceStatus } from '../types';

interface StatusChipProps {
  status: InvoiceStatus;
}

export function StatusChip({ status }: StatusChipProps) {
  const config = {
    draft: { 
      bg: 'bg-amber-100/80', 
      text: 'text-amber-800', 
      border: 'border-amber-200',
      label: 'Draft' 
    },
    sent: { 
      bg: 'bg-sky-100/80', 
      text: 'text-sky-800', 
      border: 'border-sky-200',
      label: 'Sent' 
    },
    paid: { 
      bg: 'bg-emerald-100/80', 
      text: 'text-emerald-800', 
      border: 'border-emerald-200',
      label: 'Paid' 
    },
    overdue: { 
      bg: 'bg-rose-100/80', 
      text: 'text-rose-800', 
      border: 'border-rose-200',
      label: 'Overdue' 
    },
    voided: { 
      bg: 'bg-slate-100/80', 
      text: 'text-slate-800', 
      border: 'border-slate-200',
      label: 'Voided' 
    },
  };

  const { bg, text, border, label } = config[status];

  return (
    <span className={`${bg} ${text} border ${border} px-2.5 py-0.5 text-xs font-semibold rounded-full uppercase tracking-wide`}>
      {label}
    </span>
  );
}
