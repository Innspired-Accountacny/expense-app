import { ArrowLeft, Send, Ban, Mail, Share2, CreditCard, Eye } from 'lucide-react';
import { useState } from 'react';
import { Invoice, BusinessProfile, InvoiceNumberPool } from '../../types';
import { StatusChip } from '../StatusChip';
import { formatCurrency, calculateInvoiceTotals } from '../../utils/invoiceCalculations';
import { lockInvoiceNumber } from '../../utils/invoiceNumbering';
import { getMissingComplianceFields } from '../../utils/invoiceCompliance';
import { InvoicePreviewModal } from '../chat/InvoicePreviewModal';
import { motion, AnimatePresence } from 'motion/react';

interface InvoiceDetailScreenProps {
  invoice: Invoice;
  businessProfile: BusinessProfile;
  onBack: () => void;
  onUpdate: (invoice: Invoice) => void;
  invoiceNumberPool: InvoiceNumberPool;
  setInvoiceNumberPool: (pool: InvoiceNumberPool) => void;
  onGoToSettings: () => void;
}

export function InvoiceDetailScreen({
  invoice,
  businessProfile,
  onBack,
  onUpdate,
  invoiceNumberPool,
  setInvoiceNumberPool,
  onGoToSettings,
}: InvoiceDetailScreenProps) {
  const [showVoidConfirmation, setShowVoidConfirmation] = useState(false);
  const [showInvoicePreview, setShowInvoicePreview] = useState(false);
  const missingFields = getMissingComplianceFields(invoice, businessProfile);
  const canSend = missingFields.length === 0;

  const totals = calculateInvoiceTotals(
    invoice.lineItems,
    businessProfile.isVATRegistered,
    businessProfile.vatPricingMode
  );

  const handleVoid = () => {
    const voidedInvoice: Invoice = {
      ...invoice,
      status: 'voided',
      voidedAt: new Date().toISOString(),
    };

    // Lock the number (voided invoices keep their numbers)
    const updatedPool = lockInvoiceNumber(invoice.invoiceNumber, invoiceNumberPool);
    setInvoiceNumberPool(updatedPool);

    onUpdate(voidedInvoice);
    setShowVoidConfirmation(false);
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b border-border px-4 pt-[calc(env(safe-area-inset-top)+2rem)] pb-4 safe-area-top sticky top-0 z-10">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={onBack}
            className="p-2 text-muted-foreground hover:text-primary hover:bg-secondary rounded-full transition-colors active:scale-95"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <h1 className="font-bold text-xl text-primary">Invoice Details</h1>
            <p className="text-sm text-muted-foreground font-mono">#{invoice.invoiceNumber}</p>
          </div>
          <StatusChip status={invoice.status} />
          <button
            onClick={() => setShowInvoicePreview(true)}
            className="p-2 text-muted-foreground hover:text-primary hover:bg-secondary rounded-full transition-colors active:scale-95"
            aria-label="Preview invoice"
          >
            <Eye className="w-5 h-5" />
          </button>
        </div>

        {/* Actions */}
        {invoice.status === 'draft' && (
          <div className="flex gap-3">
            <button
              disabled={!canSend}
              className="flex-1 px-4 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-all active:scale-[0.98] shadow-sm flex items-center justify-center gap-2 text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
              Send Invoice
            </button>
          </div>
        )}

        {invoice.status === 'sent' && (
          <div className="flex gap-3">
            <button className="flex-1 px-4 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-all active:scale-[0.98] shadow-sm text-base">
              Mark Paid
            </button>
            <button
              onClick={() => setShowVoidConfirmation(true)}
              className="px-6 py-3 border border-destructive text-destructive rounded-xl font-medium hover:bg-destructive/5 transition-all active:scale-[0.98] text-base"
            >
              Void
            </button>
          </div>
        )}
      </div>

      {/* Invoice Content */}
      <div className="flex-1 overflow-y-auto px-5 py-6 space-y-8 pb-32">
        {/* Customer Info */}
        <div className="bg-white rounded-2xl border border-border p-5 shadow-sm">
            <div className="flex items-start justify-between">
                <div>
                    <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Bill to</div>
                    <div className="font-bold text-xl text-foreground mb-1">{invoice.customerName}</div>
                    {(invoice.customerAddress || invoice.customerEmail) && (
                        <div className="space-y-1 mt-2">
                             {invoice.customerAddress && (
                                <div className="text-base text-muted-foreground whitespace-pre-line leading-relaxed">
                                    {invoice.customerAddress}
                                </div>
                             )}
                             {invoice.customerEmail && (
                                <div className="text-base text-primary font-medium">{invoice.customerEmail}</div>
                             )}
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl border border-border p-4 shadow-sm">
            <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Invoice Date</div>
            <div className="font-medium text-lg text-foreground">
              {new Date(invoice.invoiceDate).toLocaleDateString('en-GB')}
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-border p-4 shadow-sm">
            <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">
              {businessProfile.isVATRegistered ? 'Tax Point' : 'Supply Date'}
            </div>
            <div className="font-medium text-lg text-foreground">
              {new Date(invoice.supplyDate).toLocaleDateString('en-GB')}
            </div>
          </div>
        </div>

        {/* Line Items */}
        <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
          <div className="bg-secondary/30 px-5 py-3 border-b border-border">
              <h3 className="font-bold text-primary">Items</h3>
          </div>
          <div className="divide-y divide-border">
            {invoice.lineItems.map((item) => (
              <div key={item.id} className="p-5">
                <div className="flex justify-between items-start mb-2">
                    <div className="font-medium text-lg text-foreground flex-1 pr-4">{item.description}</div>
                    <div className="font-bold text-lg text-foreground">
                        {formatCurrency(item.quantity * item.rate)}
                    </div>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>
                    {item.quantity} × {formatCurrency(item.rate)}
                  </span>
                  {businessProfile.isVATRegistered && (
                    <span className="bg-secondary px-2 py-0.5 rounded text-xs font-medium text-foreground">VAT {item.vatRate}%</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notes */}
        {invoice.notes && (
          <div>
            <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 px-2">Notes</div>
            <div className="text-base text-foreground whitespace-pre-line bg-white border border-border rounded-2xl p-5 shadow-sm">
              {invoice.notes}
            </div>
          </div>
        )}

        {/* Payment Link */}
        {invoice.includeStripeLink && (
          <div className="flex items-start gap-4 p-5 bg-indigo-50 border border-indigo-100 rounded-2xl">
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 text-indigo-600">
                <CreditCard className="w-5 h-5" />
            </div>
            <div>
                <div className="font-bold text-indigo-900 mb-1">Online Payment Enabled</div>
                <div className="text-sm text-indigo-700 leading-relaxed">
                    Client can pay instantly via card.
                </div>
            </div>
          </div>
        )}

        {/* Totals */}
        <div className="bg-white rounded-2xl border border-border p-6 shadow-sm space-y-3">
          {businessProfile.isVATRegistered ? (
            <>
              <div className="flex justify-between text-base">
                <span className="text-muted-foreground">Net Amount</span>
                <span className="font-medium font-mono">{formatCurrency(totals.net)}</span>
              </div>
              <div className="flex justify-between text-base">
                <span className="text-muted-foreground">VAT</span>
                <span className="font-medium font-mono">{formatCurrency(totals.vat)}</span>
              </div>
              <div className="flex justify-between pt-4 border-t border-dashed border-border mt-2">
                <span className="font-bold text-xl text-primary">Total Due</span>
                <span className="font-bold text-2xl text-primary font-mono">{formatCurrency(totals.gross)}</span>
              </div>
            </>
          ) : (
            <div className="flex justify-between items-center">
              <span className="font-bold text-xl text-primary">Total Due</span>
              <span className="font-bold text-2xl text-primary font-mono">{formatCurrency(totals.gross)}</span>
            </div>
          )}
        </div>

        {/* Timestamps */}
        <div className="pt-2 text-center space-y-2 text-xs text-muted-foreground pb-4">
          <div className="flex justify-center gap-2">
            <span>Created</span>
            <span className="font-medium">{new Date(invoice.createdAt).toLocaleString('en-GB')}</span>
          </div>
          {invoice.sentAt && (
            <div className="flex justify-center gap-2">
              <span>Sent</span>
              <span className="font-medium">{new Date(invoice.sentAt).toLocaleString('en-GB')}</span>
            </div>
          )}
          {invoice.paidAt && (
            <div className="flex justify-center gap-2 text-emerald-600">
              <span>Paid</span>
              <span className="font-medium">{new Date(invoice.paidAt).toLocaleString('en-GB')}</span>
            </div>
          )}
          {invoice.voidedAt && (
            <div className="flex justify-center gap-2 text-destructive">
              <span>Voided</span>
              <span className="font-medium">{new Date(invoice.voidedAt).toLocaleString('en-GB')}</span>
            </div>
          )}
        </div>
      </div>

      {/* Void Confirmation Modal */}
      <AnimatePresence>
        {showVoidConfirmation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={() => setShowVoidConfirmation(false)}
            />
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-3xl p-6 max-w-sm w-full relative z-10 shadow-xl"
            >
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center animate-pulse">
                  <Ban className="w-8 h-8 text-red-600" />
                </div>
              </div>
              <h3 className="font-bold text-2xl mb-2 text-center text-foreground">Void Invoice?</h3>
              <p className="text-base text-muted-foreground mb-8 text-center leading-relaxed">
                This invoice will be marked as voided. The invoice number{' '}
                <strong className="text-foreground font-mono bg-secondary px-1 rounded">{invoice.invoiceNumber}</strong>{' '}
                will remain in your records but cannot be reused.
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleVoid}
                  className="w-full py-4 bg-destructive text-destructive-foreground rounded-xl font-bold text-lg hover:bg-destructive/90 transition-all active:scale-[0.98]"
                >
                  Confirm Void
                </button>
                <button
                  onClick={() => setShowVoidConfirmation(false)}
                  className="w-full py-4 bg-transparent text-muted-foreground hover:text-foreground rounded-xl font-medium text-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <InvoicePreviewModal
        isOpen={showInvoicePreview}
        onClose={() => setShowInvoicePreview(false)}
        invoice={invoice}
        profile={businessProfile}
        onStyleChange={() => {}}
        mode="preview-only"
        onGoToSettings={onGoToSettings}
      />
    </div>
  );
}
