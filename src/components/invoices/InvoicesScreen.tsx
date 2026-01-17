import { useState } from 'react';
import { Plus, Search, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BusinessProfile, Invoice, InvoiceStatus, InvoiceNumberPool } from '../../types';
import { StatusChip } from '../StatusChip';
import { formatCurrency, calculateInvoiceTotals } from '../../utils/invoiceCalculations';
import { InvoiceDetailScreen } from './InvoiceDetailScreen';
import { EmptyState } from '../design-system/EmptyState';
import { Input } from '../design-system/Input';
import { TYPOGRAPHY } from '../design-system/theme';

interface InvoicesScreenProps {
  businessProfile: BusinessProfile;
  invoices: Invoice[];
  setInvoices: (invoices: Invoice[]) => void;
  invoiceNumberPool: InvoiceNumberPool;
  setInvoiceNumberPool: (pool: InvoiceNumberPool) => void;
  onGoToSettings: () => void;
}

export function InvoicesScreen({
  businessProfile,
  invoices,
  setInvoices,
  invoiceNumberPool,
  setInvoiceNumberPool,
  onGoToSettings,
}: InvoicesScreenProps) {
  const [selectedFilter, setSelectedFilter] = useState<InvoiceStatus | 'all'>('all');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filters: Array<{ value: InvoiceStatus | 'all'; label: string }> = [
    { value: 'all', label: 'All' },
    { value: 'draft', label: 'Draft' },
    { value: 'sent', label: 'Sent' },
    { value: 'paid', label: 'Paid' },
    { value: 'overdue', label: 'Overdue' },
  ];

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesFilter = selectedFilter === 'all' || invoice.status === selectedFilter;
    const matchesSearch =
      searchQuery === '' ||
      invoice.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (selectedInvoice) {
    return (
      <InvoiceDetailScreen
        invoice={selectedInvoice}
        businessProfile={businessProfile}
        onBack={() => setSelectedInvoice(null)}
        onUpdate={(updated) => {
          setInvoices(invoices.map((inv) => (inv.id === updated.id ? updated : inv)));
          setSelectedInvoice(updated);
        }}
        invoiceNumberPool={invoiceNumberPool}
        setInvoiceNumberPool={setInvoiceNumberPool}
        onGoToSettings={onGoToSettings}
      />
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#fdfaf7]">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-[#f5ebe0] px-6 pt-[calc(env(safe-area-inset-top)+2rem)] pb-6 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className={TYPOGRAPHY.h1}>Invoices</h1>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="w-[48px] h-[48px] rounded-[16px] bg-[#6b4423] text-white flex items-center justify-center shadow-lg hover:bg-[#6b4423]/90 transition-all"
          >
            <Plus className="w-6 h-6" />
          </motion.button>
        </div>

        {/* Search */}
        <div className="mb-4">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search invoices..."
            leftIcon={<Search className="w-5 h-5" />}
            className="bg-[#fef8f3] border-none"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-6 px-6 scrollbar-hide">
          {filters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setSelectedFilter(filter.value)}
              className={`px-5 py-2.5 rounded-[12px] font-medium text-[14px] whitespace-nowrap transition-all border ${
                selectedFilter === filter.value
                  ? 'bg-[#6b4423] text-white border-[#6b4423] shadow-sm'
                  : 'bg-white text-[#8b7355] border-[#f5ebe0] hover:border-[#6b4423]/30 hover:text-[#2d2621]'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Invoice List */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 pb-32">
        {filteredInvoices.length === 0 ? (
          <EmptyState
            icon={<FileText className="w-8 h-8" />}
            title={invoices.length === 0 ? 'No invoices yet' : 'No matching invoices'}
            description={
              invoices.length === 0
                ? 'Create your first invoice using the Chat tab'
                : 'Try adjusting your filters or search query'
            }
          />
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredInvoices.map((invoice, index) => {
              const totals = calculateInvoiceTotals(
                invoice.lineItems,
                businessProfile.isVATRegistered,
                businessProfile.vatPricingMode
              );

              return (
                <motion.div
                  key={invoice.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  onClick={() => setSelectedInvoice(invoice)}
                  className="bg-white border border-[#f5ebe0] rounded-[16px] p-5 shadow-sm active:scale-[0.98] transition-transform cursor-pointer relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#f5ebe0]/50 to-transparent rounded-bl-full -mr-8 -mt-8 pointer-events-none" />
                  
                  <div className="relative">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="font-mono font-bold text-[13px] text-[#6b4423]/80 mb-1">
                          #{invoice.invoiceNumber}
                        </div>
                        <div className="font-semibold text-[16px] leading-tight text-[#2d2621]">{invoice.customerName}</div>
                      </div>
                      <StatusChip status={invoice.status} />
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="text-[14px] text-[#8b7355]">
                        {new Date(invoice.invoiceDate).toLocaleDateString('en-GB')}
                      </div>
                      <div className="font-bold text-[18px] text-[#2d2621]">
                        {formatCurrency(totals.gross)}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
