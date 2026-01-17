import { useState, useRef, useEffect } from 'react';
import { Send, Mic, Paperclip } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BusinessProfile, Invoice, InvoiceNumberPool, LineItem } from '../../types';
import { DraftInvoiceCard } from '../DraftInvoiceCard';
import { allocateInvoiceNumber, lockInvoiceNumber, releaseInvoiceNumber } from '../../utils/invoiceNumbering';
import { getMissingComplianceFields } from '../../utils/invoiceCompliance';
import { SendOptionsModal } from './SendOptionsModal';
import { ShareConfirmationModal } from './ShareConfirmationModal';
import { InvoicePreviewModal } from './InvoicePreviewModal';
import { TYPOGRAPHY, COLORS } from '../design-system/theme';

interface ChatScreenProps {
  businessProfile: BusinessProfile;
  setBusinessProfile: (profile: BusinessProfile) => void;
  invoices: Invoice[];
  setInvoices: (invoices: Invoice[]) => void;
  invoiceNumberPool: InvoiceNumberPool;
  setInvoiceNumberPool: (pool: InvoiceNumberPool) => void;
  onGoToSettings: () => void;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  invoice?: Invoice;
  timestamp: Date;
}

export function ChatScreen({
  businessProfile,
  setBusinessProfile,
  invoices,
  setInvoices,
  invoiceNumberPool,
  setInvoiceNumberPool,
  onGoToSettings,
}: ChatScreenProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm your invoicing assistant. I can help you create invoices, track expenses, and manage your business. Try saying something like:\n\n\"Create and send invoice for John Smith for kitchen fitting for £500\"",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [pendingInvoice, setPendingInvoice] = useState<Invoice | null>(null);
  const [previewInvoice, setPreviewInvoice] = useState<Invoice | null>(null);
  const [showSendOptions, setShowSendOptions] = useState(false);
  const [showShareConfirmation, setShowShareConfirmation] = useState(false);
  const [selectedSendMethod, setSelectedSendMethod] = useState<'email' | 'share' | null>(null);
  const [showInvoicePreview, setShowInvoicePreview] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const pendingMissingFields = pendingInvoice
    ? getMissingComplianceFields(pendingInvoice, businessProfile)
    : [];
  const canSendPending = pendingMissingFields.length === 0;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  const createInvoiceFromNaturalLanguage = (text: string): Invoice | null => {
    // Simple parser for demo - in production this would use AI
    const lowerText = text.toLowerCase();
    
    // Try to extract customer name, description, and amount
    const customerMatch = text.match(/for ([A-Z][a-z]+ [A-Z][a-z]+)/);
    const amountMatch = text.match(/£(\d+(?:,\d{3})*(?:\.\d{2})?)/);
    const descriptionMatch = text.match(/for (.+?) for £/);

    if (!customerMatch || !amountMatch) {
      return null;
    }

    const amount = parseFloat(amountMatch[1].replace(',', ''));
    const customerName = customerMatch[1];
    const description = descriptionMatch ? descriptionMatch[1] : 'Service provided';

    const { number, updatedPool } = allocateInvoiceNumber(invoiceNumberPool);
    setInvoiceNumberPool(updatedPool);

    const lineItem: LineItem = {
      id: Math.random().toString(36).substr(2, 9),
      description: description,
      quantity: 1,
      rate: amount,
      vatRate: 20,
    };

    const invoice: Invoice = {
      id: Math.random().toString(36).substr(2, 9),
      invoiceNumber: number,
      status: 'draft',
      customerName: customerName,
      customerAddress: '',
      invoiceDate: new Date().toISOString().split('T')[0],
      supplyDate: new Date().toISOString().split('T')[0],
      lineItems: [lineItem],
      includeStripeLink: true,
      createdAt: new Date().toISOString(),
    };

    return invoice;
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);

    // Try to create invoice from natural language
    const invoice = createInvoiceFromNaturalLanguage(input);

    if (invoice) {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I've created a draft invoice based on your request. Please review it below:",
        invoice: invoice,
        timestamp: new Date(),
      };
      // Simulate network delay for better feel
      setTimeout(() => {
        setMessages(prev => [...prev, assistantMessage]);
      }, 600);
    } else {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I didn't quite catch that. Could you try again? For example:\n\n\"Create invoice for [Customer Name] for [description] for £[amount]\"",
        timestamp: new Date(),
      };
      setTimeout(() => {
        setMessages(prev => [...prev, assistantMessage]);
      }, 600);
    }

    setInput('');
  };

  const handleApprove = (invoice: Invoice) => {
    setPendingInvoice(invoice);
    setShowSendOptions(true);
  };

  const handleEdit = (invoice: Invoice) => {
    // In a full implementation, this would navigate to the edit screen
    alert('Edit functionality - would open edit screen');
  };

  const handleReject = (invoice: Invoice) => {
    // Release the invoice number back to the pool
    const updatedPool = releaseInvoiceNumber(invoice.invoiceNumber, invoiceNumberPool);
    setInvoiceNumberPool(updatedPool);

    const assistantMessage: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: "No problem! The invoice has been discarded. How else can I help?",
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, assistantMessage]);
  };

  const handleSendMethodSelect = (method: 'email' | 'share') => {
    if (!canSendPending) return;
    setSelectedSendMethod(method);
    setShowSendOptions(false);
    setShowShareConfirmation(true);
  };

  const handleMarkAsSent = () => {
    if (pendingInvoice) {
      const missingFields = getMissingComplianceFields(pendingInvoice, businessProfile);
      if (missingFields.length > 0) {
        return;
      }
      // Lock the invoice number
      const updatedPool = lockInvoiceNumber(pendingInvoice.invoiceNumber, invoiceNumberPool);
      setInvoiceNumberPool(updatedPool);

      // Update invoice status
      const sentInvoice: Invoice = {
        ...pendingInvoice,
        status: 'sent',
        sentAt: new Date().toISOString(),
      };

      setInvoices([...invoices, sentInvoice]);

      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Great! Invoice ${pendingInvoice.invoiceNumber} has been marked as sent and is now locked. The invoice number cannot be reused.`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);

      setPendingInvoice(null);
      setShowShareConfirmation(false);
    }
  };

  const handleNotYet = () => {
    if (pendingInvoice) {
      // Save as draft but don't lock the number
      setInvoices([...invoices, pendingInvoice]);

      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Invoice ${pendingInvoice.invoiceNumber} has been saved as a draft. You can send it later from the Invoices tab.`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);

      setPendingInvoice(null);
      setShowShareConfirmation(false);
    }
  };

  const handlePreviewClick = (invoice: Invoice) => {
    setPreviewInvoice(invoice);
    setShowInvoicePreview(true);
  };

  const handleStyleChange = (styleId: string) => {
    setBusinessProfile({ ...businessProfile, invoiceStyle: styleId });
  };

  return (
    <div className="flex flex-col h-screen bg-[#fdfaf7]">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-[#f5ebe0] px-6 pt-[calc(env(safe-area-inset-top)+2rem)] pb-6 sticky top-0 z-10">
        <h1 className={TYPOGRAPHY.h1}>Chat</h1>
        <p className="text-[16px] text-[#8b7355] mt-1">AI Assistant</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 bg-[#fdfaf7] pb-32">
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[90%] rounded-[24px] px-5 py-4 shadow-sm ${
                  message.role === 'user'
                    ? 'bg-[#6b4423] text-white rounded-br-[4px]'
                    : 'bg-white border border-[#f5ebe0] rounded-bl-[4px] text-[#2d2621]'
                }`}
              >
                <p className="text-[16px] whitespace-pre-wrap leading-relaxed">{message.content}</p>
                {message.invoice && (
                  <div className="mt-4">
                    <DraftInvoiceCard
                      invoice={message.invoice}
                      isVATRegistered={businessProfile.isVATRegistered}
                      vatPricingMode={businessProfile.vatPricingMode}
                      onClick={() => handlePreviewClick(message.invoice!)}
                      onApprove={() => handleApprove(message.invoice!)}
                      onEdit={() => handleEdit(message.invoice!)}
                      onReject={() => handleReject(message.invoice!)}
                    />
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="fixed bottom-[88px] left-0 right-0 bg-white/95 backdrop-blur-md border-t border-[#f5ebe0] px-4 py-3 z-20">
        <div className="max-w-md mx-auto flex items-end gap-3">
          <button className="p-3 text-[#8b7355] hover:text-[#6b4423] active:bg-[#f5ebe0] rounded-full transition-colors flex-shrink-0">
            <Paperclip className="w-6 h-6" />
          </button>
          
          <div className="flex-1 bg-[#fef8f3] rounded-[24px] px-4 py-3 min-h-[56px] flex items-center border border-[#f5ebe0]">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Type a message..."
              rows={1}
              className="flex-1 bg-transparent border-0 text-[16px] focus:outline-none placeholder:text-[#8b7355]/60 resize-none py-1 max-h-[120px] text-[#2d2621]"
            />
            <button className="ml-2 text-[#8b7355] hover:text-[#6b4423] active:opacity-70 transition-colors flex-shrink-0 self-end mb-1">
              <Mic className="w-6 h-6" />
            </button>
          </div>
          
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="p-3 bg-[#6b4423] text-white rounded-full hover:bg-[#6b4423]/90 active:scale-95 transition-all flex-shrink-0 disabled:opacity-50 disabled:active:scale-100 shadow-md"
          >
            <Send className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Modals */}
      <SendOptionsModal
        isOpen={showSendOptions}
        onClose={() => setShowSendOptions(false)}
        onSelectEmail={() => handleSendMethodSelect('email')}
        onSelectShare={() => handleSendMethodSelect('share')}
        canSend={canSendPending}
      />

      <ShareConfirmationModal
        isOpen={showShareConfirmation}
        onClose={() => setShowShareConfirmation(false)}
        onMarkAsSent={handleMarkAsSent}
        onNotYet={handleNotYet}
        canMarkAsSent={canSendPending}
        missingFields={pendingMissingFields}
      />

      {previewInvoice && (
        <InvoicePreviewModal
          isOpen={showInvoicePreview}
          onClose={() => setShowInvoicePreview(false)}
          invoice={previewInvoice}
          profile={businessProfile}
          onStyleChange={handleStyleChange}
          mode="style-select"
          onGoToSettings={onGoToSettings}
        />
      )}
    </div>
  );
}
