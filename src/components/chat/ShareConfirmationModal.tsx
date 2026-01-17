import { CheckCircle, Clock, X } from 'lucide-react';

interface ShareConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMarkAsSent: () => void;
  onNotYet: () => void;
  canMarkAsSent?: boolean;
  missingFields?: string[];
}

export function ShareConfirmationModal({
  isOpen,
  onClose,
  onMarkAsSent,
  onNotYet,
  canMarkAsSent = true,
  missingFields = [],
}: ShareConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
      <div className="bg-white rounded-t-2xl w-full max-w-md p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-lg">Share Confirmation</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-6">
          Have you sent the invoice to your customer?
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-900">
            <strong>Important:</strong> Marking as sent will lock the invoice number permanently. It cannot be changed or reused, even if the invoice is later voided.
          </p>
        </div>

        {missingFields.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-amber-900 font-medium mb-2">Sending is blocked</p>
            <p className="text-sm text-amber-900/80">
              Missing: {missingFields.join(', ')}
            </p>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={onMarkAsSent}
            disabled={!canMarkAsSent}
            className={`w-full flex items-center gap-3 p-4 rounded-lg transition-colors ${
              canMarkAsSent
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-blue-600 text-white opacity-50 cursor-not-allowed'
            }`}
          >
            <CheckCircle className="w-5 h-5" />
            <div className="text-left flex-1">
              <div className="font-medium">Mark as Sent</div>
              <div className="text-sm opacity-90">Lock invoice and update status</div>
            </div>
          </button>

          <button
            onClick={onNotYet}
            className="w-full flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors"
          >
            <Clock className="w-5 h-5 text-gray-600" />
            <div className="text-left flex-1">
              <div className="font-medium">Not Yet</div>
              <div className="text-sm text-gray-600">Save as draft for now</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
