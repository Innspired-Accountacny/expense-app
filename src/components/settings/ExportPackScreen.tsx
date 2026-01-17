import { useState } from 'react';
import { ArrowLeft, Package, Mail, Download, CheckCircle } from 'lucide-react';
import { AppSettings } from '../../types';

interface ExportPackScreenProps {
  settings: AppSettings;
  setSettings: (settings: AppSettings) => void;
  onBack: () => void;
}

export function ExportPackScreen({ settings, setSettings, onBack }: ExportPackScreenProps) {
  const [accountantEmail, setAccountantEmail] = useState(settings.accountantEmail || '');
  const [userEmail, setUserEmail] = useState('user@example.com'); // Would come from auth
  const [showSuccess, setShowSuccess] = useState(false);

  const handleGenerateExport = () => {
    // In a real app, this would generate a ZIP file with all records
    alert('Generating export pack...\n\nIncluded:\n- All invoices\n- All expenses\n- VAT summary (if applicable)\n- Transaction log');
  };

  const handleEmailAccountant = () => {
    if (!accountantEmail) {
      alert('Please enter your accountant\'s email address');
      return;
    }

    // Save the accountant email
    setSettings({ ...settings, accountantEmail });

    // In a real app, this would send the email
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b border-border px-4 pt-[calc(env(safe-area-inset-top)+2rem)] pb-4 safe-area-top sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 text-muted-foreground hover:bg-secondary rounded-full transition-colors active:scale-95"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="font-bold text-xl text-primary">Export Pack</h1>
            <p className="text-sm text-muted-foreground">Year-end data for your accountant</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6 pb-32">
        {/* What's Included */}
        <div className="bg-white border border-border rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Package className="w-5 h-5 text-primary" />
            <h2 className="font-bold text-lg">What's Included</h2>
          </div>
          <ul className="space-y-3 text-sm text-foreground">
            <li className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              <span>All invoices (PDF format)</span>
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              <span>All expenses with receipts</span>
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              <span>VAT summary report (if applicable)</span>
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              <span>Transaction log (CSV)</span>
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              <span>Business profile information</span>
            </li>
          </ul>
        </div>

        {/* Download Option */}
        <div className="bg-white border border-border rounded-2xl p-5 shadow-sm">
          <h3 className="font-bold text-lg mb-4">Download Export</h3>
          <button
            onClick={handleGenerateExport}
            className="w-full flex items-center justify-center gap-2 px-4 py-4 bg-primary text-primary-foreground rounded-xl font-bold text-lg hover:bg-primary/90 transition-all active:scale-[0.98]"
          >
            <Download className="w-6 h-6" />
            Generate & Download ZIP
          </button>
          <p className="text-xs text-muted-foreground mt-3 text-center">
            Creates a secure ZIP file with all your records
          </p>
        </div>

        {/* Email Option */}
        <div className="bg-white border border-border rounded-2xl p-5 shadow-sm">
          <h3 className="font-bold text-lg mb-4">Email to Accountant</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Accountant's Email
              </label>
              <input
                type="email"
                value={accountantEmail}
                onChange={(e) => setAccountantEmail(e.target.value)}
                placeholder="accountant@example.com"
                className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-secondary/30"
              />
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
              <p className="text-sm text-blue-900 leading-relaxed">
                <Mail className="w-4 h-4 inline-block mr-1 mb-0.5" />
                <strong>Note:</strong> The export will be emailed to your accountant and a copy will be sent to <span className="font-medium">{userEmail}</span>
              </p>
            </div>

            <button
              onClick={handleEmailAccountant}
              disabled={!accountantEmail}
              className="w-full flex items-center justify-center gap-2 px-4 py-4 bg-green-600 text-white rounded-xl font-bold text-lg hover:bg-green-700 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Mail className="w-6 h-6" />
              Email Export Pack
            </button>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-secondary/30 border border-border rounded-2xl p-5">
          <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider mb-3">Year-End Checklist</h3>
          <ul className="space-y-2 text-sm text-foreground">
            <li className="flex gap-2"><span className="text-green-600">✓</span> Review all invoices for accuracy</li>
            <li className="flex gap-2"><span className="text-green-600">✓</span> Ensure all expenses have receipts</li>
            <li className="flex gap-2"><span className="text-green-600">✓</span> Reconcile bank statements</li>
            <li className="flex gap-2"><span className="text-green-600">✓</span> Check VAT calculations (if applicable)</li>
            <li className="flex gap-2"><span className="text-green-600">✓</span> Export and send to accountant</li>
          </ul>
        </div>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="fixed bottom-24 left-4 right-4 bg-green-600 text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 z-50 animate-slide-up">
          <CheckCircle className="w-6 h-6" />
          <span className="font-medium">Export pack sent successfully!</span>
        </div>
      )}
    </div>
  );
}
