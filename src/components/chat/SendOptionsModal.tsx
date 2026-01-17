import { Mail, Share2, X } from 'lucide-react';

interface SendOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectEmail: () => void;
  onSelectShare: () => void;
  canSend?: boolean;
}

export function SendOptionsModal({
  isOpen,
  onClose,
  onSelectEmail,
  onSelectShare,
  canSend = true,
}: SendOptionsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
      <div className="bg-white rounded-t-2xl w-full max-w-md p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-lg">Send Invoice</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          <button
            onClick={onSelectEmail}
            disabled={!canSend}
            className={`w-full flex items-center gap-4 p-4 border-2 border-gray-200 rounded-lg transition-colors ${
              canSend
                ? 'hover:border-blue-500 hover:bg-blue-50'
                : 'opacity-50 cursor-not-allowed'
            }`}
          >
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-left flex-1">
              <div className="font-medium">Send via Email</div>
              <div className="text-sm text-gray-600">Send directly from the app</div>
            </div>
          </button>

          <button
            onClick={onSelectShare}
            disabled={!canSend}
            className={`w-full flex items-center gap-4 p-4 border-2 border-gray-200 rounded-lg transition-colors ${
              canSend
                ? 'hover:border-blue-500 hover:bg-blue-50'
                : 'opacity-50 cursor-not-allowed'
            }`}
          >
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Share2 className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-left flex-1">
              <div className="font-medium">Share...</div>
              <div className="text-sm text-gray-600">Use native share options</div>
            </div>
          </button>
        </div>

        {!canSend && (
          <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-900">
            Complete required invoice fields before sending.
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full mt-4 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
