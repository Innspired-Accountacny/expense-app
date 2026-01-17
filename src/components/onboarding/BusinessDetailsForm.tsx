import { useState } from 'react';
import { BusinessProfile } from '../../types';
import { ProgressIndicator } from './ProgressIndicator';

interface BusinessDetailsFormProps {
  profile: BusinessProfile;
  onUpdate: (profile: BusinessProfile) => void;
  onNext: () => void;
  onBack: () => void;
}

export function BusinessDetailsForm({ profile, onUpdate, onNext, onBack }: BusinessDetailsFormProps) {
  const [formData, setFormData] = useState({
    legalName: profile.legalName || '',
    tradingName: profile.tradingName || '',
    address: profile.address || '',
    email: profile.email || '',
    phone: profile.phone || '',
    paymentTerms: profile.paymentTerms || 'Due within 30 days',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({ ...profile, ...formData });
    onNext();
  };

  const isValid = formData.legalName && formData.address && formData.email && formData.phone;

  const inputClasses = "w-full px-4 py-3 bg-input-background border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all";

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="px-6 pt-[calc(env(safe-area-inset-top)+2rem)] pb-6 sticky top-0 bg-white z-10 border-b border-border/50">
        <ProgressIndicator currentStep={1} totalSteps={7} />
        
        <h2 className="text-2xl font-bold mb-2 mt-4">Business Details</h2>
        <p className="text-muted-foreground">
          Tell us about your business. This information will appear on your invoices.
        </p>
      </div>

      {/* Scrollable form content */}
      <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
        <div className="flex-1 px-6 space-y-6 py-6 overflow-y-auto">
          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">
              Legal Name <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              value={formData.legalName}
              onChange={(e) => setFormData({ ...formData, legalName: e.target.value })}
              className={inputClasses}
              placeholder="John Smith"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">
              Trading Name (Optional)
            </label>
            <input
              type="text"
              value={formData.tradingName}
              onChange={(e) => setFormData({ ...formData, tradingName: e.target.value })}
              className={inputClasses}
              placeholder="JS Plumbing Services"
            />
            <p className="text-xs text-muted-foreground mt-2 px-1">If different from legal name</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">
              Business Address <span className="text-destructive">*</span>
            </label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className={`${inputClasses} min-h-[120px] resize-none`}
              rows={5}
              placeholder="123 High Street&#10;London&#10;SW1A 1AA"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">
              Email <span className="text-destructive">*</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={inputClasses}
              placeholder="john@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">
              Phone <span className="text-destructive">*</span>
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className={inputClasses}
              placeholder="07700 900000"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">
              Payment Terms
            </label>
            <input
              type="text"
              value={formData.paymentTerms}
              onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
              className={inputClasses}
              placeholder="Due within 30 days"
            />
          </div>
        </div>

        {/* Fixed bottom buttons */}
        <div className="px-6 pt-6 pb-[calc(2.5rem+env(safe-area-inset-bottom))] border-t border-border bg-white">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onBack}
              className="flex-1 px-4 py-3 border-2 border-border rounded-2xl font-medium hover:bg-secondary transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={!isValid}
              className="flex-1 px-4 py-3 bg-primary text-primary-foreground rounded-2xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2"
            >
              Continue
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}