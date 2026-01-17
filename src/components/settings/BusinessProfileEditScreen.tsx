import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { BusinessProfile } from '../../types';
import { TYPOGRAPHY, SPACING } from '../design-system/theme';

interface BusinessProfileEditScreenProps {
  businessProfile: BusinessProfile;
  setBusinessProfile: (profile: BusinessProfile) => void;
  onBack: () => void;
}

export function BusinessProfileEditScreen({
  businessProfile,
  setBusinessProfile,
  onBack,
}: BusinessProfileEditScreenProps) {
  const [formData, setFormData] = useState({
    legalName: businessProfile.legalName || '',
    tradingName: businessProfile.tradingName || '',
    address: businessProfile.address || '',
    email: businessProfile.email || '',
    phone: businessProfile.phone || '',
    paymentTerms: businessProfile.paymentTerms || 'Due within 30 days',
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setBusinessProfile({ ...businessProfile, ...formData });
    onBack();
  };

  const isValid = formData.legalName && formData.address && formData.email && formData.phone;

  const inputClasses = "w-full px-4 py-3 bg-[#fdfaf7] border border-[#f5ebe0] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#6b4423]/30 focus:border-[#6b4423] transition-all text-[15px]";
  const labelClasses = "block text-sm font-medium mb-2 text-[#3d2817]";

  return (
    <div className="flex flex-col h-screen bg-[#fdfaf7]">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-[#f5ebe0] px-6 pt-[calc(env(safe-area-inset-top)+2rem)] pb-4 sticky top-0 z-10">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[#6b4423] mb-4 -ml-1"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Settings</span>
        </button>
        <h1 className={TYPOGRAPHY.h1}>Business Profile</h1>
        <p className="text-[#8b7355] text-[15px] mt-1">
          Update your business details and payment terms
        </p>
      </div>

      {/* Scrollable form content */}
      <form onSubmit={handleSave} className="flex-1 flex flex-col">
        <div className="flex-1 px-6 space-y-6 py-6 overflow-y-auto">
          <div>
            <label className={labelClasses}>
              Legal Name <span className="text-[#c1440e]">*</span>
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
            <label className={labelClasses}>
              Trading Name (Optional)
            </label>
            <input
              type="text"
              value={formData.tradingName}
              onChange={(e) => setFormData({ ...formData, tradingName: e.target.value })}
              className={inputClasses}
              placeholder="JS Plumbing Services"
            />
            <p className="text-xs text-[#8b7355] mt-2 px-1">If different from legal name</p>
          </div>

          <div>
            <label className={labelClasses}>
              Business Address <span className="text-[#c1440e]">*</span>
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
            <label className={labelClasses}>
              Email <span className="text-[#c1440e]">*</span>
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
            <label className={labelClasses}>
              Phone <span className="text-[#c1440e]">*</span>
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
            <label className={labelClasses}>
              Payment Terms
            </label>
            <input
              type="text"
              value={formData.paymentTerms}
              onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
              className={inputClasses}
              placeholder="Due within 30 days"
            />
            <p className="text-xs text-[#8b7355] mt-2 px-1">
              Default terms shown on invoices (e.g., "Due within 30 days", "Payment on receipt")
            </p>
          </div>
        </div>

        {/* Fixed bottom buttons */}
        <div className="px-6 pt-6 pb-[calc(2.5rem+env(safe-area-inset-bottom))] border-t border-[#f5ebe0] bg-white/80 backdrop-blur-md">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onBack}
              className="flex-1 px-4 py-3 border-2 border-[#f5ebe0] rounded-2xl font-medium hover:bg-[#fef3e7] transition-colors focus:outline-none focus:ring-2 focus:ring-[#6b4423]/30"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isValid}
              className="flex-1 px-4 py-3 bg-[#6b4423] text-white rounded-2xl font-medium hover:bg-[#5a3820] transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#6b4423]/30 focus:ring-offset-2"
            >
              Save Changes
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
