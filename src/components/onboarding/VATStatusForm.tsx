import { useState } from 'react';
import { BusinessProfile } from '../../types';
import { ProgressIndicator } from './ProgressIndicator';

interface VATStatusFormProps {
  profile: BusinessProfile;
  onUpdate: (profile: BusinessProfile) => void;
  onNext: () => void;
  onBack: () => void;
}

export function VATStatusForm({ profile, onUpdate, onNext, onBack }: VATStatusFormProps) {
  const [isVATRegistered, setIsVATRegistered] = useState(profile.isVATRegistered);
  const [vatNumber, setVatNumber] = useState(profile.vatNumber || '');

  const handleContinue = () => {
    onUpdate({
      ...profile,
      isVATRegistered,
      vatNumber: isVATRegistered ? vatNumber : undefined,
    });
    onNext();
  };

  const isValid = !isVATRegistered || (isVATRegistered && vatNumber.trim().length > 0);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="px-6 pt-[calc(env(safe-area-inset-top)+2rem)] pb-6 sticky top-0 bg-white z-10 border-b border-border/50">
        <ProgressIndicator currentStep={2} totalSteps={7} />
        
        <h2 className="text-2xl font-bold mb-2 mt-4">VAT Registration</h2>
        <p className="text-muted-foreground">
          Are you VAT registered? This determines the information required on your invoices.
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 space-y-3 py-6">
        <button
          onClick={() => setIsVATRegistered(false)}
          className={`w-full flex items-start gap-4 p-4 border-2 rounded-2xl transition-all ${!isVATRegistered ? 'border-primary bg-accent' : 'border-border'}`}
        >
          <input
            type="radio"
            id="vat-no"
            name="vat"
            checked={!isVATRegistered}
            onChange={() => setIsVATRegistered(false)}
            className="w-5 h-5 text-primary focus:ring-2 focus:ring-primary/30 mt-0.5"
          />
          <div className="flex-1 text-left">
            <div className="font-medium mb-1">Not VAT registered</div>
            <div className="text-sm text-muted-foreground">Standard invoices only</div>
          </div>
        </button>

        <button
          onClick={() => setIsVATRegistered(true)}
          className={`w-full flex items-start gap-4 p-4 border-2 rounded-2xl transition-all ${isVATRegistered ? 'border-primary bg-accent' : 'border-border'}`}
        >
          <input
            type="radio"
            id="vat-yes"
            name="vat"
            checked={isVATRegistered}
            onChange={() => setIsVATRegistered(true)}
            className="w-5 h-5 text-primary focus:ring-2 focus:ring-primary/30 mt-0.5"
          />
          <div className="flex-1 text-left">
            <div className="font-medium mb-1">VAT registered</div>
            <div className="text-sm text-muted-foreground">VAT-compliant invoices</div>
          </div>
        </button>

        {isVATRegistered && (
          <div className="pt-2">
            <label className="block text-sm font-medium mb-3">
              VAT Registration Number <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              value={vatNumber}
              onChange={(e) => setVatNumber(e.target.value)}
              className="w-full px-4 py-3 bg-input-background border border-border rounded-2xl focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
              placeholder="GB123456789"
              required
            />
            <p className="text-xs text-muted-foreground mt-2">
              Your VAT number will appear on all invoices
            </p>
          </div>
        )}
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
            disabled={!isValid}
            className="flex-1 px-4 py-3 bg-primary text-primary-foreground rounded-2xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
