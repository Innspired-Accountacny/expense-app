import { useState } from 'react';
import { BusinessProfile } from '../../types';
import { ProgressIndicator } from './ProgressIndicator';
import { Upload, Sparkles } from 'lucide-react';

interface LogoUploadFormProps {
  profile: BusinessProfile;
  onUpdate: (profile: BusinessProfile) => void;
  onNext: () => void;
  onBack: () => void;
}

export function LogoUploadForm({ profile, onUpdate, onNext, onBack }: LogoUploadFormProps) {
  const [logo, setLogo] = useState(profile.logo || '');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleContinue = () => {
    onUpdate({
      ...profile,
      logo: logo || undefined,
    });
    onNext();
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="px-6 pt-[calc(env(safe-area-inset-top)+2rem)] pb-6 sticky top-0 bg-white z-10 border-b border-border/50">
        <ProgressIndicator currentStep={5} totalSteps={7} />
        
        <h2 className="text-2xl font-bold mb-2 mt-4">Business Logo</h2>
        <p className="text-muted-foreground">
          Add a logo to your invoices (optional). You can skip this step.
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pb-6 pt-6 overflow-y-auto">
        <div className="space-y-4">
          {logo ? (
            <div className="border-2 border-border rounded-2xl p-8 text-center">
              <img src={logo} alt="Logo preview" className="max-h-32 mx-auto mb-4" />
              <button
                onClick={() => setLogo('')}
                className="text-sm text-destructive hover:underline"
              >
                Remove logo
              </button>
            </div>
          ) : (
            <>
              <label className="block border-2 border-dashed border-border rounded-2xl p-10 text-center cursor-pointer hover:border-primary/50 transition-colors">
                <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <div className="font-medium mb-1">Upload Logo</div>
                <div className="text-sm text-muted-foreground">PNG, JPG or SVG (max 2MB)</div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-muted-foreground">or</span>
                </div>
              </div>

              <button
                onClick={() => {
                  // In a real app, this would generate an AI logo
                  alert('AI logo generation coming soon!');
                }}
                className="w-full px-4 py-4 border-2 border-primary text-primary rounded-2xl font-medium hover:bg-accent transition-colors flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Generate with AI
              </button>
            </>
          )}
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