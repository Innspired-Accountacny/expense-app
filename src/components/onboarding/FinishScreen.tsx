import { Check } from 'lucide-react';

interface FinishScreenProps {
  onFinish: () => void;
}

export function FinishScreen({ onFinish }: FinishScreenProps) {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-[calc(env(safe-area-inset-top)+1rem)]">
      <div className="flex-1 flex flex-col items-center justify-center max-w-sm w-full">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <Check className="w-10 h-10 text-green-600" />
        </div>
        
        <h2 className="text-3xl font-bold mb-3 text-center">You're All Set!</h2>
        <p className="text-muted-foreground text-center mb-8">
          Your account is ready. Start creating invoices and tracking expenses with AI assistance.
        </p>

        <div className="w-full bg-accent rounded-2xl p-5 mb-8">
          <h3 className="font-medium mb-4">Quick Tips:</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <span>Use the Chat tab to create invoices with natural language</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <span>Snap photos of receipts to capture expenses</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <span>Enable weekly admin reminders in Settings</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <span>Track your VAT threshold in Settings</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="w-full max-w-sm pb-[calc(2rem+env(safe-area-inset-bottom))]">
        <button
          onClick={onFinish}
          className="w-full px-4 py-4 bg-primary text-primary-foreground rounded-2xl font-medium hover:bg-primary/90 transition-colors"
        >
          Go to App
        </button>
      </div>
    </div>
  );
}