import { useState } from 'react';
import { X, ChevronLeft } from 'lucide-react';
import { BusinessProfile, Invoice } from '../../types';
import { getMissingComplianceFields } from '../../utils/invoiceCompliance';
import { InvoiceDocumentRenderer } from '../invoices/InvoiceDocumentRenderer';

interface InvoicePreviewModalProps {
  invoice: Invoice;
  profile: BusinessProfile;
  isOpen: boolean;
  onClose: () => void;
  onStyleChange: (styleId: string) => void;
  mode?: 'style-select' | 'preview-only';
  onGoToSettings?: () => void;
}

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

export function InvoicePreviewModal({
  invoice,
  profile,
  isOpen,
  onClose,
  onStyleChange,
  mode = 'style-select',
  onGoToSettings,
}: InvoicePreviewModalProps) {
  const [currentStyle, setCurrentStyle] = useState(profile.invoiceStyle || 'modern');
  const [showStyleSelector, setShowStyleSelector] = useState(false);
  const missingFields = getMissingComplianceFields(invoice, profile);
  const isStyleSelect = mode === 'style-select';

  const currentStyleInfo = styles.find(s => s.id === currentStyle);

  const handleSelectStyle = (styleId: string) => {
    setCurrentStyle(styleId);
    onStyleChange(styleId);
    setShowStyleSelector(false);
  };

  if (!isOpen) return null;

  if (showStyleSelector && isStyleSelect) {
    return (
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" 
        onClick={onClose}
      >
        <div 
          className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden" 
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 md:p-6 border-b border-[#f5ebe0] bg-white shrink-0">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowStyleSelector(false)}
                className="w-10 h-10 rounded-full bg-[#fef3e7] hover:bg-[#f5ebe0] transition-colors flex items-center justify-center"
              >
                <ChevronLeft className="w-5 h-5 text-[#6b4423]" />
              </button>
              <div>
                <h3 className="font-semibold text-lg text-[#2d2621]">Choose Invoice Style</h3>
                <p className="text-sm text-[#8b7355]">Select a template for this invoice</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-[#fef3e7] hover:bg-[#f5ebe0] transition-colors flex items-center justify-center"
            >
              <X className="w-5 h-5 text-[#6b4423]" />
            </button>
          </div>

          {/* Style Grid */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#fdfaf7]">
            <div className="grid grid-cols-2 gap-4">
              {styles.map((style) => (
                <button
                  key={style.id}
                  onClick={() => handleSelectStyle(style.id)}
                  className={`p-4 rounded-2xl border-2 transition-all text-left hover:scale-105 ${
                    currentStyle === style.id
                      ? 'border-[#6b4423] bg-[#fef8f3] shadow-md'
                      : 'border-[#f5ebe0] bg-white hover:border-[#8b7355]'
                  }`}
                >
                  <h4 className={`font-semibold mb-1 ${
                    currentStyle === style.id ? 'text-[#6b4423]' : 'text-[#2d2621]'
                  }`}>
                    {style.name}
                  </h4>
                  <p className="text-sm text-[#8b7355]">{style.description}</p>
                  {currentStyle === style.id && (
                    <div className="mt-3 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#6b4423]" />
                      <span className="text-xs font-medium text-[#6b4423]">Selected</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 md:p-6 border-t border-[#f5ebe0] bg-white shrink-0">
            <button
              onClick={() => setShowStyleSelector(false)}
              className="w-full px-4 py-3 bg-[#6b4423] text-white rounded-2xl font-medium hover:bg-[#5a3820] transition-colors shadow-sm"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" 
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-[#f5ebe0] bg-white shrink-0 z-10">
          <div>
            <h3 className="font-semibold text-lg text-[#2d2621]">Invoice Preview</h3>
            <p className="text-sm text-[#8b7355]">
              {currentStyleInfo?.name} Style • Invoice #{invoice.invoiceNumber}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-[#fef3e7] hover:bg-[#f5ebe0] transition-colors flex items-center justify-center"
            aria-label="Close preview"
          >
            <X className="w-5 h-5 text-[#6b4423]" />
          </button>
        </div>

        {missingFields.length > 0 && (
          <div className="px-4 md:px-6 pt-4">
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="font-semibold text-amber-900">Missing required fields</p>
                  <ul className="mt-2 text-sm text-amber-900/80 list-disc list-inside space-y-1">
                    {missingFields.map((field) => (
                      <li key={field}>{field}</li>
                    ))}
                  </ul>
                </div>
                {onGoToSettings && (
                  <button
                    onClick={() => {
                      onGoToSettings();
                      onClose();
                    }}
                    className="px-3 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors"
                  >
                    Go to Settings
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Preview Content - Scrollable */}
        <div className="flex-1 overflow-y-auto bg-[#fdfaf7] w-full relative">
          <div className="min-h-full p-4 md:p-8 flex items-center justify-center">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-xl overflow-hidden ring-1 ring-black/5">
              <InvoiceDocumentRenderer
                styleId={currentStyle}
                invoice={invoice}
                businessProfile={profile}
              />
            </div>
          </div>
        </div>

        {/* Footer - Fixed */}
        <div className="p-4 md:p-6 border-t border-[#f5ebe0] bg-white shrink-0 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border-2 border-[#f5ebe0] text-[#2d2621] rounded-2xl font-medium hover:bg-[#fef3e7] transition-colors"
          >
            Close
          </button>
          {isStyleSelect && (
            <button
              onClick={() => setShowStyleSelector(true)}
              className="flex-1 px-4 py-3 bg-[#6b4423] text-white rounded-2xl font-medium hover:bg-[#5a3820] transition-colors shadow-sm"
            >
              Change Style
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
