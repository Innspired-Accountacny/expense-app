import { useState } from 'react';
import { BusinessProfile, LineItem, Invoice } from '../../types';
import { ProgressIndicator } from './ProgressIndicator';
import { Check, X, Eye } from 'lucide-react';
import { InvoiceDocumentRenderer } from '../invoices/InvoiceDocumentRenderer';

interface InvoiceStyleFormProps {
  profile: BusinessProfile;
  onUpdate: (profile: BusinessProfile) => void;
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

const createPreviewInvoice = (amount: number): Invoice => ({
  id: 'preview',
  invoiceNumber: '-',
  status: 'draft',
  customerName: '-',
  customerAddress: '-',
  invoiceDate: new Date().toISOString().split('T')[0],
  supplyDate: new Date().toISOString().split('T')[0],
  lineItems: getSampleItems(amount),
  includeStripeLink: false,
  createdAt: new Date().toISOString(),
});

const styles = [
  { id: 'modern', name: 'Modern', description: 'Clean and minimal' },
  { id: 'classic', name: 'Classic', description: 'Traditional layout' },
  { id: 'bold', name: 'Bold', description: 'Strong typography' },
  { id: 'minimal', name: 'Minimal', description: 'Ultra-clean' },
  { id: 'professional', name: 'Professional', description: 'Business-focused' },
  { id: 'creative', name: 'Creative', description: 'Modern and vibrant' },
  { id: 'elegant', name: 'Elegant', description: 'Sophisticated' },
  { id: 'compact', name: 'Compact', description: 'Space-efficient' },
];

function InvoicePreview({ styleId }: { styleId: string }) {
  const previewStyles: Record<string, React.ReactNode> = {
    modern: (
      <div className="space-y-1">
        <div className="h-2 w-12 bg-primary rounded"></div>
        <div className="h-1 w-full bg-gray-300 rounded"></div>
        <div className="h-1 w-3/4 bg-gray-200 rounded"></div>
        <div className="h-1 w-1/2 bg-gray-200 rounded"></div>
      </div>
    ),
    classic: (
      <div className="border-t-2 border-gray-400 pt-1 space-y-1">
        <div className="flex justify-between">
          <div className="h-1.5 w-10 bg-gray-400 rounded"></div>
          <div className="h-1.5 w-8 bg-gray-300 rounded"></div>
        </div>
        <div className="h-1 w-full bg-gray-200 rounded"></div>
        <div className="h-1 w-2/3 bg-gray-200 rounded"></div>
      </div>
    ),
    bold: (
      <div className="space-y-1.5">
        <div className="h-3 w-16 bg-gray-900 rounded"></div>
        <div className="h-1 w-full bg-gray-400 rounded"></div>
        <div className="h-1 w-full bg-gray-300 rounded"></div>
        <div className="h-1.5 w-1/2 bg-gray-900 rounded"></div>
      </div>
    ),
    minimal: (
      <div className="space-y-2">
        <div className="h-1 w-10 bg-gray-300 rounded"></div>
        <div className="space-y-0.5">
          <div className="h-0.5 w-full bg-gray-200 rounded"></div>
          <div className="h-0.5 w-3/4 bg-gray-200 rounded"></div>
          <div className="h-0.5 w-1/2 bg-gray-200 rounded"></div>
        </div>
      </div>
    ),
    professional: (
      <div className="border border-gray-300 p-1 space-y-1">
        <div className="flex justify-between items-start">
          <div className="h-1.5 w-12 bg-gray-400 rounded"></div>
          <div className="h-1 w-8 bg-gray-300 rounded"></div>
        </div>
        <div className="h-1 w-full bg-gray-200 rounded"></div>
        <div className="h-1 w-2/3 bg-gray-200 rounded"></div>
      </div>
    ),
    creative: (
      <div className="space-y-1">
        <div className="h-2.5 w-14 bg-gradient-to-r from-primary to-amber-400 rounded-lg"></div>
        <div className="flex gap-1">
          <div className="h-1 w-1/3 bg-primary/30 rounded"></div>
          <div className="h-1 w-1/2 bg-amber-300/30 rounded"></div>
        </div>
        <div className="h-1 w-full bg-gray-200 rounded"></div>
      </div>
    ),
    elegant: (
      <div className="space-y-1.5">
        <div className="text-center">
          <div className="h-2 w-12 bg-gray-800 rounded mx-auto mb-1"></div>
          <div className="h-0.5 w-16 bg-gray-300 rounded mx-auto"></div>
        </div>
        <div className="h-1 w-full bg-gray-200 rounded"></div>
        <div className="h-1 w-3/4 bg-gray-200 rounded mx-auto"></div>
      </div>
    ),
    compact: (
      <div className="space-y-0.5 text-[0.5rem]">
        <div className="flex justify-between">
          <div className="h-1 w-8 bg-gray-400 rounded"></div>
          <div className="h-1 w-6 bg-gray-300 rounded"></div>
        </div>
        <div className="h-0.5 w-full bg-gray-200 rounded"></div>
        <div className="h-0.5 w-full bg-gray-200 rounded"></div>
        <div className="h-0.5 w-2/3 bg-gray-200 rounded"></div>
        <div className="h-1 w-10 bg-gray-900 rounded mt-1"></div>
      </div>
    ),
  };

  return previewStyles[styleId] || previewStyles.modern;
}

function FullInvoicePreview({ styleId, profile, onClose, onSelect }: { styleId: string; profile: BusinessProfile; onClose: () => void; onSelect: () => void }) {
  const styleName = styles.find(s => s.id === styleId)?.name;
  const styleDesc = styles.find(s => s.id === styleId)?.description;
  const previewInvoice = createPreviewInvoice(500);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 safe-area-top safe-area-bottom" onClick={onClose}>
      <div 
        className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Fixed */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-border bg-white shrink-0 z-10">
          <div>
            <h3 className="font-semibold text-lg">{styleName} Style</h3>
            <p className="text-sm text-muted-foreground">{styleDesc}</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-secondary hover:bg-border transition-colors flex items-center justify-center"
            aria-label="Close preview"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preview Content - Scrollable */}
        <div className="flex-1 overflow-y-auto bg-secondary/30 w-full relative">
           {/* Added consistent padding for scroll area */}
           <div className="min-h-full p-4 md:p-8 flex items-center justify-center">
              <div className="bg-white rounded-xl shadow-lg w-full max-w-xl overflow-hidden ring-1 ring-black/5">
                <InvoiceDocumentRenderer
                  styleId={styleId}
                  invoice={previewInvoice}
                  businessProfile={profile}
                />
              </div>
           </div>
        </div>

        {/* Footer - Fixed */}
        <div className="p-4 md:p-6 border-t border-border bg-white shrink-0 flex gap-3 safe-area-bottom">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border-2 border-border text-foreground rounded-2xl font-medium hover:bg-secondary transition-colors"
          >
            Close
          </button>
          <button
            onClick={onSelect}
            className="flex-1 px-4 py-3 bg-primary text-primary-foreground rounded-2xl font-medium hover:bg-primary/90 transition-colors shadow-sm"
          >
            Select This Style
          </button>
        </div>
      </div>
    </div>
  );
}

export function InvoiceStyleForm({ profile, onUpdate, onNext, onBack }: InvoiceStyleFormProps) {
  const [selectedStyle, setSelectedStyle] = useState(profile.invoiceStyle || 'modern');
  const [previewStyle, setPreviewStyle] = useState<string | null>(null);

  const handleContinue = () => {
    onUpdate({
      ...profile,
      invoiceStyle: selectedStyle,
    });
    onNext();
  };

  const handleSelectFromPreview = () => {
    if (previewStyle) {
      setSelectedStyle(previewStyle);
      setPreviewStyle(null);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="px-6 pt-[calc(env(safe-area-inset-top)+2rem)] pb-6 sticky top-0 bg-white z-10 border-b border-border/50">
        <ProgressIndicator currentStep={4} totalSteps={7} />
        
        <h2 className="text-2xl font-bold mb-2 mt-4">Invoice Style</h2>
        <p className="text-muted-foreground">
          Choose a style for your invoices. This affects the layout and appearance.
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pb-6 pt-6 overflow-y-auto">
        <div className="grid grid-cols-2 gap-3">
          {styles.map((style) => (
            <div key={style.id} className="relative">
              <button
                onClick={() => setSelectedStyle(style.id)}
                className={`w-full p-4 border-2 rounded-2xl transition-all text-left ${
                  selectedStyle === style.id
                    ? 'border-primary bg-accent'
                    : 'border-border hover:border-primary/30'
                }`}
              >
                {selectedStyle === style.id && (
                  <div className="absolute top-3 right-3 w-6 h-6 bg-primary rounded-full flex items-center justify-center z-10">
                    <Check className="w-3.5 h-3.5 text-primary-foreground" />
                  </div>
                )}
                <div className="font-medium text-sm mb-1">{style.name}</div>
                <div className="text-xs text-muted-foreground mb-3">{style.description}</div>
                <div className="h-16 bg-secondary rounded-xl border border-border flex items-center justify-center p-3">
                  <InvoicePreview styleId={style.id} />
                </div>
              </button>
              
              {/* Preview button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setPreviewStyle(style.id);
                }}
                className="absolute bottom-3 right-3 w-8 h-8 bg-white border-2 border-border rounded-full flex items-center justify-center hover:bg-primary hover:border-primary hover:text-primary-foreground transition-colors z-10 shadow-sm"
                title={`Preview ${style.name}`}
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>
          ))}
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
            onClick={handleContinue}
            className="flex-1 px-4 py-3 bg-primary text-primary-foreground rounded-2xl font-medium hover:bg-primary/90 transition-colors"
          >
            Continue
          </button>
        </div>
      </div>

      {/* Preview Modal */}
      {previewStyle && (
        <FullInvoicePreview
          styleId={previewStyle}
          profile={profile}
          onClose={() => setPreviewStyle(null)}
          onSelect={handleSelectFromPreview}
        />
      )}
    </div>
  );
}
