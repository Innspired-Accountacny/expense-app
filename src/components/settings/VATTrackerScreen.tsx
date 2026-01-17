import { ArrowLeft, TrendingUp, Info } from 'lucide-react';
import { Invoice } from '../../types';
import { calculateInvoiceTotals, formatCurrency } from '../../utils/invoiceCalculations';

interface VATTrackerScreenProps {
  invoices: Invoice[];
  onBack: () => void;
}

export function VATTrackerScreen({ invoices, onBack }: VATTrackerScreenProps) {
  const VAT_THRESHOLD = 85000; // Current UK VAT registration threshold

  // Calculate rolling 12-month total
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

  const recentInvoices = invoices.filter((invoice) => {
    const invoiceDate = new Date(invoice.invoiceDate);
    return invoiceDate >= twelveMonthsAgo && invoice.status !== 'voided';
  });

  // Calculate total taxable turnover (net amounts)
  const totalTurnover = recentInvoices.reduce((sum, invoice) => {
    const totals = calculateInvoiceTotals(invoice.lineItems, false, 'net');
    return sum + totals.net;
  }, 0);

  const percentageOfThreshold = (totalTurnover / VAT_THRESHOLD) * 100;
  const remainingBeforeThreshold = VAT_THRESHOLD - totalTurnover;

  // Determine status
  let status: 'safe' | 'warning' | 'critical';
  let statusColor: string;
  let statusText: string;

  if (percentageOfThreshold < 70) {
    status = 'safe';
    statusColor = 'text-green-600';
    statusText = 'Well below threshold';
  } else if (percentageOfThreshold < 90) {
    status = 'warning';
    statusColor = 'text-amber-600';
    statusText = 'Approaching threshold';
  } else {
    status = 'critical';
    statusColor = 'text-red-600';
    statusText = 'Near or over threshold';
  }

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
            <h1 className="font-bold text-xl text-primary">VAT Threshold Tracker</h1>
            <p className="text-sm text-muted-foreground">Rolling 12-month indicator</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6 pb-32">
        {/* Progress Card */}
        <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className={`w-5 h-5 ${statusColor}`} />
              <span className={`font-bold ${statusColor}`}>{statusText}</span>
            </div>
            <span className="text-sm font-medium text-muted-foreground">
              {Math.round(percentageOfThreshold)}%
            </span>
          </div>

          {/* Progress Bar */}
          <div className="h-4 bg-secondary rounded-full overflow-hidden mb-6">
            <div
              className={`h-full transition-all duration-1000 ease-out rounded-full ${
                status === 'safe'
                  ? 'bg-green-500'
                  : status === 'warning'
                  ? 'bg-amber-500'
                  : 'bg-red-500'
              }`}
              style={{ width: `${Math.min(percentageOfThreshold, 100)}%` }}
            />
          </div>

          {/* Amounts */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Rolling 12-month turnover</span>
              <span className="font-bold text-lg text-foreground">{formatCurrency(totalTurnover)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">VAT registration threshold</span>
              <span className="font-medium text-lg text-muted-foreground">{formatCurrency(VAT_THRESHOLD)}</span>
            </div>
            <div className="flex justify-between pt-4 border-t border-dashed border-border">
              <span className="text-sm font-medium text-muted-foreground">Remaining headroom</span>
              <span className={`font-bold text-xl ${remainingBeforeThreshold > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(Math.max(0, remainingBeforeThreshold))}
              </span>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 p-2 rounded-full flex-shrink-0">
               <Info className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-sm text-blue-900">
              <p className="font-bold mb-1">About VAT Registration</p>
              <p className="leading-relaxed opacity-90">
                You must register for VAT if your taxable turnover exceeds <span className="font-bold">£{(VAT_THRESHOLD / 1000).toFixed(0)}k</span> in any rolling 12-month period. This tracker helps you monitor your progress.
              </p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h3 className="font-bold text-lg mb-4 px-2">Recent Invoices (Last 12 Months)</h3>
          <div className="space-y-3">
            {recentInvoices.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground bg-secondary/30 rounded-2xl border border-border border-dashed">
                No invoices in the last 12 months
              </div>
            ) : (
              recentInvoices.slice(0, 10).map((invoice) => {
                const totals = calculateInvoiceTotals(invoice.lineItems, false, 'net');
                return (
                  <div
                    key={invoice.id}
                    className="flex items-center justify-between py-4 px-5 bg-white border border-border rounded-xl shadow-sm"
                  >
                    <div>
                      <div className="font-mono text-xs font-bold text-primary mb-0.5 opacity-80">
                        #{invoice.invoiceNumber}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(invoice.invoiceDate).toLocaleDateString('en-GB')}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg">{formatCurrency(totals.net)}</div>
                      <div className="text-xs font-medium text-muted-foreground bg-secondary px-2 py-0.5 rounded-md inline-block mt-1">Net</div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Warning if approaching */}
        {status !== 'safe' && (
          <div className={`border ${status === 'warning' ? 'border-amber-200 bg-amber-50' : 'border-red-200 bg-red-50'} rounded-2xl p-5 shadow-sm`}>
            <p className={`text-base font-medium ${status === 'warning' ? 'text-amber-900' : 'text-red-900'} leading-relaxed`}>
              <strong>Action needed:</strong> You're {status === 'warning' ? 'approaching' : 'near or over'} the VAT registration threshold. Consider consulting with an accountant about VAT registration.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
