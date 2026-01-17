import { useState } from 'react';
import { Plus, Camera, Upload, Mail, Search, X, Inbox } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Expense } from '../../types';
import { formatCurrency } from '../../utils/invoiceCalculations';
import { EmptyState } from '../design-system/EmptyState';
import { Input } from '../design-system/Input';
import { Button } from '../design-system/Button';
import { CardRow } from '../design-system/CardRow'; // We can use this for the modal options
import { TYPOGRAPHY, COLORS } from '../design-system/theme';

interface ExpensesScreenProps {
  expenses: Expense[];
  setExpenses: (expenses: Expense[]) => void;
}

export function ExpensesScreen({ expenses, setExpenses }: ExpensesScreenProps) {
  const [showAddMethod, setShowAddMethod] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredExpenses = expenses.filter(
    (expense) =>
      searchQuery === '' ||
      expense.merchant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expense.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddMethodSelect = (method: string) => {
    setShowAddMethod(false);
    if (method === 'photo') {
      alert('Camera functionality - would open camera to capture receipt');
    } else if (method === 'upload') {
      alert('Upload functionality - would open file picker');
    } else if (method === 'email') {
      alert('Email forwarding - would show email forwarding instructions');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#fdfaf7]">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-[#f5ebe0] px-6 pt-[calc(env(safe-area-inset-top)+2rem)] pb-6 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className={TYPOGRAPHY.h1}>Expenses</h1>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddMethod(true)}
            className="w-[48px] h-[48px] rounded-[16px] bg-[#6b4423] text-white flex items-center justify-center shadow-lg hover:bg-[#6b4423]/90 transition-all"
          >
            <Plus className="w-6 h-6" />
          </motion.button>
        </div>

        {/* Search */}
        <div>
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search expenses..."
            leftIcon={<Search className="w-5 h-5" />}
            className="bg-[#fef8f3] border-none"
          />
        </div>
      </div>

      {/* Expense List */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 pb-32">
        {filteredExpenses.length === 0 ? (
          <EmptyState
            icon={<Inbox className="w-8 h-8" />}
            title={expenses.length === 0 ? 'No expenses yet' : 'No matching expenses'}
            description={
              expenses.length === 0
                ? 'Add your first expense by tapping the + button'
                : 'Try adjusting your search query'
            }
          />
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredExpenses.map((expense, index) => (
              <motion.div
                key={expense.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                className="bg-white border border-[#f5ebe0] rounded-[16px] p-5 shadow-sm active:scale-[0.98] transition-transform relative overflow-hidden"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 mr-4">
                    <div className="font-semibold text-[16px] leading-tight mb-1 text-[#2d2621]">{expense.merchant}</div>
                    <div className="text-[13px] font-medium text-[#8b7355] bg-[#f5ebe0] px-2 py-0.5 rounded-md inline-block">
                        {expense.category}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-[16px] text-[#2d2621]">{formatCurrency(expense.amount)}</div>
                    {expense.status === 'draft' && (
                      <div className="text-[11px] font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full mt-1 inline-block border border-amber-100">
                        Draft
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-[13px] text-[#8b7355] mt-2 pt-2 border-t border-dashed border-[#f5ebe0] flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#d4c4b0]" />
                    {new Date(expense.date).toLocaleDateString('en-GB')}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Add Method Modal */}
      <AnimatePresence>
        {showAddMethod && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddMethod(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[24px] z-50 p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] shadow-2xl"
            >
              <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6" />
              
              <div className="flex justify-between items-center mb-6">
                <h3 className={TYPOGRAPHY.h2}>Add Expense</h3>
                <button 
                  onClick={() => setShowAddMethod(false)}
                  className="p-2 bg-[#f5ebe0] rounded-full text-[#2d2621] hover:bg-[#e6dccf]"
                >
                    <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 mb-8">
                <CardRow
                    title="Scan Receipt"
                    subtitle="Snap a photo with your camera"
                    icon={<Camera className="w-6 h-6" />}
                    onClick={() => handleAddMethodSelect('photo')}
                />
                <CardRow
                    title="Upload File"
                    subtitle="Choose PDF or image from device"
                    icon={<Upload className="w-6 h-6" />}
                    onClick={() => handleAddMethodSelect('upload')}
                />
                 <CardRow
                    title="Forward Email"
                    subtitle="Send digital receipts via email"
                    icon={<Mail className="w-6 h-6" />}
                    onClick={() => handleAddMethodSelect('email')}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}