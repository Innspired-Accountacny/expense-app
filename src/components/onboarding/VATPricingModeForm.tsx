import { useState } from 'react';
import { BusinessProfile } from '../../types';
import { ProgressIndicator } from './ProgressIndicator';

interface VATPricingModeFormProps {
  profile: BusinessProfile;
  onUpdate: (profile: BusinessProfile) => void;
  onNext: () => void;
  onBack: () => void;
}

export function VATPricingModeForm({ profile, onUpdate, onNext, onBack }: VATPricingModeFormProps) {
  const [pricingMode, setPricingMode] = useState<'gross' | 'net'>(profile.vatPricingMode || 'net');

  const handleContinue = () => {
    onUpdate({
      ...profile,
      vatPricingMode: pricingMode,
    });
    onNext();
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="px-6 pt-[calc(env(safe-area-inset-top)+2rem)] pb-6 sticky top-0 bg-white z-10 border-b border-border/50">
        <ProgressIndicator currentStep={3} totalSteps={7} />
        
        <h2 className="text-2xl font-bold mb-2 mt-4">VAT Pricing Mode</h2>
        <p className="text-muted-foreground">
          Choose how you normally enter prices. You can override this per invoice later.
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 space-y-4 py-6 overflow-y-auto">
        <button
          onClick={() => setPricingMode('net')}
          className={`w-full flex items-start gap-4 p-5 border-2 rounded-2xl transition-all text-left ${
            pricingMode === 'net' ? 'border-primary bg-accent' : 'border-border'
          }`}
        >
          <input
            type="radio"
            id="mode-net"
            name="pricing"
            checked={pricingMode === 'net'}
            onChange={() => setPricingMode('net')}
            className="w-5 h-5 text-primary focus:ring-2 focus:ring-primary/30 mt-0.5 flex-shrink-0"
          />
          <div className="flex-1">
            <div className="font-medium mb-1">VAT Exclusive (Net)</div>
            <div className="text-sm text-muted-foreground mb-2">
              Enter prices without VAT. VAT is added on top.
            </div>
            <div className="text-sm text-primary bg-accent/50 px-3 py-2 rounded-xl">
              Example: Enter £100, invoice shows £100 + £20 VAT = £120 total
            </div>
          </div>
        </button>

        <button
          onClick={() => setPricingMode('gross')}
          className={`w-full flex items-start gap-4 p-5 border-2 rounded-2xl transition-all text-left ${
            pricingMode === 'gross' ? 'border-primary bg-accent' : 'border-border'
          }`}
        >
          <input
            type="radio"
            id="mode-gross"
            name="pricing"
            checked={pricingMode === 'gross'}
            onChange={() => setPricingMode('gross')}
            className="w-5 h-5 text-primary focus:ring-2 focus:ring-primary/30 mt-0.5 flex-shrink-0"
          />
          <div className="flex-1">
            <div className="font-medium mb-1">VAT Inclusive (Gross)</div>
            <div className="text-sm text-muted-foreground mb-2">
              Enter prices including VAT. VAT is calculated within.
            </div>
            <div className="text-sm text-primary bg-accent/50 px-3 py-2 rounded-xl">
              Example: Enter £120, invoice shows £100 + £20 VAT = £120 total
            </div>
          </div>
        </button>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <p className="text-sm text-amber-800">
            <strong>Note:</strong> This is your default setting. You can change it for individual invoices when needed.
          </p>
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
    </div>
  );
}