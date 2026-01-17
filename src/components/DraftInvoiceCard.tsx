import { Invoice } from '../types';
import { formatCurrency, calculateInvoiceTotals } from '../utils/invoiceCalculations';
import { Calendar, User, CreditCard, X, Check, Pencil } from 'lucide-react';
import { TYPOGRAPHY, COLORS } from './design-system/theme';

interface DraftInvoiceCardProps {
  invoice: Invoice;
  isVATRegistered: boolean;
  vatPricingMode?: 'gross' | 'net';
  onApprove?: () => void;
  onEdit?: () => void;
  onReject?: () => void;
  onClick?: () => void;
  showActions?: boolean;
}

export function DraftInvoiceCard({
  invoice,
  isVATRegistered,
  vatPricingMode = 'net',
  onApprove,
  onEdit,
  onReject,
  onClick,
  showActions = true,
}: DraftInvoiceCardProps) {
  const totals = calculateInvoiceTotals(invoice.lineItems, isVATRegistered, vatPricingMode);

  return (
    <div className="bg-white rounded-[16px] border border-[#f5ebe0] shadow-sm overflow-hidden w-full max-w-sm mx-auto">
      {/* Header Band */}
      <div className="bg-[#fef8f3] px-4 py-3 border-b border-[#f5ebe0] flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
          <span className="text-[11px] font-bold text-[#6b4423] uppercase tracking-wider">Draft Invoice</span>
        </div>
        <span className="font-mono text-[13px] font-medium text-[#8b7355]">#{invoice.invoiceNumber}</span>
      </div>

      <div 
        className={`p-5 space-y-6 ${onClick ? 'cursor-pointer hover:bg-[#fdfaf7]/50 transition-colors' : ''}`}
        onClick={onClick}
      >
        {/* Customer Section */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-[#fef3e7] rounded-full flex items-center justify-center flex-shrink-0">
            <User className="w-5 h-5 text-[#6b4423]" />
          </div>
          <div>
            <div className={TYPOGRAPHY.label + " mb-0.5"}>Bill to</div>
            <div className="font-semibold text-[16px] text-[#2d2621]">{invoice.customerName}</div>
          </div>
        </div>

        {/* Line Items Preview */}
        <div className="bg-[#fdfaf7] rounded-[12px] p-4 space-y-3 border border-[#f5ebe0]">
            {invoice.lineItems.slice(0, 2).map((item, idx) => (
                <div key={idx} className="flex justify-between items-start text-[14px]">
                    <span className="text-[#2d2621] flex-1 pr-4">{item.description}</span>
                    <span className="font-mono font-medium text-[#6b4423]">{formatCurrency(item.rate * item.quantity)}</span>
                </div>
            ))}
            {invoice.lineItems.length > 2 && (
                <div className="text-[12px] text-[#8b7355] italic pt-1 border-t border-[#f5ebe0]/50">
                    +{invoice.lineItems.length - 2} more items...
                </div>
            )}
        </div>

        {/* Dates */}
        <div className="flex gap-6">
            <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#8b7355]" />
                <div className="text-[14px]">
                    <span className="text-[#8b7355] mr-1">Date:</span>
                    <span className="font-medium text-[#2d2621]">{new Date(invoice.invoiceDate).toLocaleDateString('en-GB')}</span>
                </div>
            </div>
        </div>

        {/* Totals Block */}
        <div className="flex justify-between items-end border-t border-dashed border-[#f5ebe0] pt-4">
            <div className="text-[14px] text-[#8b7355]">Total Due</div>
            <div className="text-[20px] font-bold text-[#6b4423]">{formatCurrency(totals.gross)}</div>
        </div>
        
        {isVATRegistered && (
            <div className="flex justify-end gap-3 text-[12px] text-[#8b7355]">
                <span>Net: {formatCurrency(totals.net)}</span>
                <span>VAT: {formatCurrency(totals.vat)}</span>
            </div>
        )}

        {/* Stripe Badge */}
        {invoice.includeStripeLink && (
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-1 rounded-[8px] w-fit border border-emerald-100">
                <CreditCard className="w-3 h-3" />
                <span>Online payment enabled</span>
            </div>
        )}
      </div>

      {/* Actions Footer */}
      {showActions && (
        <div className="grid grid-cols-3 divide-x divide-[#f5ebe0] border-t border-[#f5ebe0] bg-gray-50/30">
          {onReject && (
            <button
              onClick={onReject}
              className="py-3.5 flex items-center justify-center text-[#8b7355] hover:bg-red-50 hover:text-red-600 transition-colors active:bg-red-100"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          {onEdit && (
            <button
              onClick={onEdit}
              className="py-3.5 flex items-center justify-center text-[#8b7355] hover:bg-orange-50 hover:text-orange-600 transition-colors active:bg-orange-100"
            >
              <Pencil className="w-5 h-5" />
            </button>
          )}
          {onApprove && (
            <button
              onClick={onApprove}
              className="py-3.5 flex items-center justify-center text-[#6b4423] font-medium hover:bg-[#6b4423]/5 transition-colors active:bg-[#6b4423]/10"
            >
              <span className="mr-1 text-[14px]">Approve</span>
              <Check className="w-5 h-5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}