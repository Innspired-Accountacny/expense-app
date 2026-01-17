import { BusinessProfile, LineItem, Invoice } from '../../types';
import { ProgressIndicator } from './ProgressIndicator';
import { InvoiceDocumentRenderer } from '../invoices/InvoiceDocumentRenderer';

interface InvoicePreviewFormProps {
  profile: BusinessProfile;
  onNext: () => void;
  onBack: () => void;
}

const getSampleItems = (amount: number): LineItem[] => [
  {
    id: '1',
    description: 'Professional Services - Strategic Planning & Consultation',
    quantity: 1,
    rate: amount * 0.6,
    vatRate: 20
  },
  {
    id: '2',
    description: 'Implementation Phase 1 - Core system architecture setup',
    quantity: 1,
    rate: amount * 0.3,
    vatRate: 20
  },
  {
    id: '3',
    description: 'Hourly Support',
    quantity: 2,
    rate: amount * 0.05,
    vatRate: 20
  }
];

export function InvoicePreviewForm({ profile, onNext, onBack }: InvoicePreviewFormProps) {
  const selectedStyle = profile.invoiceStyle || 'modern';
  const previewInvoice: Invoice = {
    id: 'preview',
    invoiceNumber: '-',
    status: 'draft',
    customerName: '-',
    customerAddress: '-',
    invoiceDate: new Date().toISOString().split('T')[0],
    supplyDate: new Date().toISOString().split('T')[0],
    lineItems: getSampleItems(100),
    includeStripeLink: false,
    createdAt: new Date().toISOString(),
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="px-6 pt-[calc(env(safe-area-inset-top)+2rem)] pb-6 sticky top-0 bg-white z-10 border-b border-border/50">
        <ProgressIndicator currentStep={6} totalSteps={7} />
        
        <h2 className="text-2xl font-bold mb-2 mt-4">Invoice Preview</h2>
        <p className="text-muted-foreground">
          Here's how your invoices will look. You can customise further in settings.
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pb-6 pt-6 overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-lg border border-border overflow-hidden">
          <InvoiceDocumentRenderer
            styleId={selectedStyle}
            invoice={previewInvoice}
            businessProfile={profile}
          />
        </div>
      </div>

      {/* Fixed bottom buttons */}
      <div className="px-6 pt-6 pb-[calc(2.5rem+env(safe-area-inset-bottom))] border-t border-border bg-white">
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 px-4 py-3 border-2 border-border rounded-2xl font-medium hover:bg-secondary transition-colors"
          >
            Back
          </button>
          <button
            onClick={onNext}
            className="flex-1 px-4 py-3 bg-primary text-primary-foreground rounded-2xl font-medium hover:bg-primary/90 transition-colors"
          >
            Looks Good
          </button>
        </div>
      </div>
    </div>
  );
}
