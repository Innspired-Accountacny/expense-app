import { LineItem } from '../types';
import { formatCurrency } from '../utils/invoiceCalculations';

export interface InvoiceDocument {
  supplier: {
    legalName: string;
    tradingName: string;
    address: string;
    email: string;
    phone: string;
    vatNumber: string;
    logo?: string;
  };
  customer: {
    name: string;
    address: string;
  };
  meta: {
    invoiceNumber: string;
    invoiceDate: string;
    supplyDate: string;
    dueDate: string;
  };
  lineItems: LineItem[];
  totals: {
    net: number;
    vat: number;
    gross: number;
  };
  isVATRegistered: boolean;
  vatPricingMode: 'gross' | 'net';
  paymentTerms: string;
  notes?: string;
  bankDetails?: string;
}

interface InvoiceStyleRendererProps {
  styleId: string;
  document: InvoiceDocument;
}

export function InvoiceStyleRenderer({ styleId, document }: InvoiceStyleRendererProps) {
  const {
    supplier,
    customer,
    meta,
    lineItems,
    totals,
    isVATRegistered,
    paymentTerms,
    notes,
    bankDetails,
  } = document;

  const legalName = supplier.legalName;
  const tradingName = supplier.tradingName;
  const hasTradingName = tradingName !== '-' && tradingName.trim().length > 0;
  const hasLegalName = legalName !== '-' && legalName.trim().length > 0;
  const showLegalName = hasTradingName && hasLegalName && tradingName !== legalName;
  const displayName = hasTradingName ? tradingName : legalName;
  const customerAddressLines = customer.address
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
  const customerAddressLine1 = customerAddressLines[0] || '-';
  const customerAddressLine2 = customerAddressLines[1] || '-';
  const customerAddressLine3 = customerAddressLines[2] || '-';
  const customerAddressSingleLine =
    customerAddressLines.length > 0
      ? customerAddressLines.join(', ')
      : '-';

  const businessAddress = supplier.address;
  const email = supplier.email;
  const phone = supplier.phone;
  const vatNumber = supplier.vatNumber;
  const logo = supplier.logo;
  const dueDate = meta.dueDate;
  const invoiceDate = meta.invoiceDate;
  const supplyDate = meta.supplyDate;
  const invoiceNumber = meta.invoiceNumber;

  const netAmount = totals.net;
  const vatAmount = totals.vat;
  const totalAmount = totals.gross;

  // Shared Notes and Bank Details Component
  const NotesAndBankDetails = ({ className = "" }: { className?: string }) => {
    // Only render if there's content
    if (!notes && !bankDetails) return null;

    return (
      <div className={className}>
        {notes && (
          <div className="mb-3">
            <p className="font-semibold mb-1">Notes</p>
            <p className="text-sm whitespace-pre-line">{notes}</p>
          </div>
        )}
        {bankDetails && (
          <div>
            <p className="font-semibold mb-1">Bank Details</p>
            <p className="text-sm whitespace-pre-line">{bankDetails}</p>
          </div>
        )}
      </div>
    );
  };

  // Shared Compliance Block Component
  const ComplianceFooter = ({ className = "text-xs text-muted-foreground mt-8 pt-8 border-t border-border" }) => (
    <div className={className}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
           <p className="font-semibold mb-1">Supplier Details</p>
           {showLegalName && <p>Legal Name: {legalName}</p>}
           <p>Contact: {email} • {phone}</p>
        </div>
        <div className="md:text-right">
           <p className="font-semibold mb-1">Payment Terms</p>
           <p>{paymentTerms}</p>
           <p>Due Date: {dueDate}</p>
        </div>
      </div>
    </div>
  );

  // Shared Line Items Renderer (Stacked Layout)
  const RenderLineItems = ({ variant = 'default' }: { variant?: 'default' | 'boxed' | 'clean' }) => {
    return (
       <div className="w-full">
          {lineItems.map((item, index) => (
            <div 
                key={item.id} 
                className={`py-4 ${
                    variant === 'boxed' ? '' : 
                    index < lineItems.length - 1 ? 'border-b border-gray-200' : ''
                }`}
            >
                <div className="mb-2">
                    <p className={`font-medium text-sm leading-relaxed ${variant === 'clean' ? 'text-lg' : ''}`}>
                        {item.description}
                    </p>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <div className="text-muted-foreground">
                        {item.quantity} x {formatCurrency(item.rate)}
                        {isVATRegistered && (item.vatRate || 0) > 0 && (
                          <span className="text-xs ml-1 opacity-75">(VAT {item.vatRate}%)</span>
                        )}
                    </div>
                    <div className="font-semibold whitespace-nowrap pl-4">
                        {formatCurrency(item.quantity * item.rate)}
                    </div>
                </div>
            </div>
          ))}
       </div>
    );
  };

  const renderModern = () => (
    <div className="p-8 bg-white h-full flex flex-col">
      <div className="flex-1">
        {/* Header */}
        <div className="flex justify-between items-start mb-12">
           <div>
              {logo && (
                <img src={logo} alt="Logo" className="h-12 mb-6" />
              )}
              <div className="border-l-4 border-primary pl-4">
                <h1 className="text-3xl font-light mb-1">INVOICE</h1>
                <p className="text-muted-foreground tracking-wide">#{invoiceNumber}</p>
              </div>
           </div>
           <div className="text-right text-sm space-y-1">
              <p className="font-semibold text-lg">{displayName}</p>
              {showLegalName && <p className="text-xs text-muted-foreground">Legal: {legalName}</p>}
              <p className="text-muted-foreground whitespace-pre-line">{businessAddress}</p>
              <p className="text-muted-foreground">{email}</p>
              <p className="text-muted-foreground">{phone}</p>
              {isVATRegistered && vatNumber && (
                <p className="text-muted-foreground mt-1">VAT: {vatNumber}</p>
              )}
           </div>
        </div>
        
        {/* Client & Dates */}
        <div className="grid grid-cols-2 gap-8 mb-12">
          <div className="bg-accent/50 p-6 rounded-xl">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Bill to</p>
            <p className="font-medium text-lg">{customer.name}</p>
            <p className="text-sm text-muted-foreground mt-1">{customerAddressLine1}</p>
            <p className="text-sm text-muted-foreground">{customerAddressLine2}</p>
          </div>
          <div className="space-y-4 text-right">
             <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Invoice Date</p>
                <p className="font-medium">{invoiceDate}</p>
             </div>
             <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Supply Date</p>
                <p className="font-medium">{supplyDate}</p>
             </div>
             <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Due Date</p>
                <p className="font-medium">{dueDate}</p>
             </div>
          </div>
        </div>

        {/* Line Items */}
        <div className="mb-8">
           <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 border-b border-gray-200 pb-2">Description / Details</div>
           <RenderLineItems />
        </div>

        {/* Totals */}
        <div className="flex justify-end mb-12">
          <div className="w-72 space-y-3">
            {isVATRegistered && (
              <>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Net Amount</span>
                  <span>{formatCurrency(netAmount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">VAT</span>
                  <span>{formatCurrency(vatAmount)}</span>
                </div>
              </>
            )}
            <div className="flex justify-between text-xl font-light border-t-2 border-primary pt-4">
              <span>Total Due</span>
              <span>{formatCurrency(totalAmount)}</span>
            </div>
            {isVATRegistered && <p className="text-[10px] text-right text-muted-foreground">All amounts in GBP</p>}
          </div>
        </div>

        {/* Notes and Bank Details */}
        <NotesAndBankDetails className="text-xs text-muted-foreground mb-8" />
      </div>
      
      {/* Footer */}
      <ComplianceFooter className="text-xs text-muted-foreground border-t border-gray-100 pt-6 mt-auto" />
    </div>
  );

  const renderClassic = () => (
    <div className="p-8 bg-white h-full flex flex-col font-serif">
      <div className="flex-1">
        {/* Header */}
        <div className="border-b-4 border-gray-800 pb-8 mb-8">
           <div className="flex justify-between items-start">
             <div>
               <h1 className="text-4xl font-bold mb-2 tracking-tight">INVOICE</h1>
               <div className="space-y-1 text-sm">
                  <div className="flex gap-2">
                     <span className="font-semibold w-24">Invoice #:</span>
                     <span>{invoiceNumber}</span>
                  </div>
                  <div className="flex gap-2">
                     <span className="font-semibold w-24">Date:</span>
                     <span>{invoiceDate}</span>
                  </div>
                  <div className="flex gap-2">
                     <span className="font-semibold w-24">Tax Point:</span>
                     <span>{supplyDate}</span>
                  </div>
                  <div className="flex gap-2">
                     <span className="font-semibold w-24">Due Date:</span>
                     <span>{dueDate}</span>
                  </div>
               </div>
             </div>
             <div className="text-right">
               {logo && <img src={logo} alt="Logo" className="h-16 mb-4 ml-auto" />}
               <p className="font-bold text-xl">{displayName}</p>
               {showLegalName && <p className="text-xs italic">Legal Name: {legalName}</p>}
               <p className="text-sm text-gray-600 whitespace-pre-line mt-1">{businessAddress}</p>
               <div className="text-sm text-gray-600 mt-2">
                 <p>{email}</p>
                 <p>{phone}</p>
                 {isVATRegistered && vatNumber && <p>VAT Reg: {vatNumber}</p>}
               </div>
             </div>
           </div>
        </div>

        {/* Bill To */}
        <div className="mb-8">
           <h3 className="text-sm font-bold uppercase tracking-widest border-b border-gray-300 pb-1 mb-3 w-48">Bill To</h3>
           <p className="font-bold text-lg">{customer.name}</p>
           <p className="text-sm text-gray-600">{customerAddressLine1}</p>
           <p className="text-sm text-gray-600">{customerAddressLine2}</p>
        </div>

        {/* Items - Stacked Layout with Classic Border Style */}
        <div className="mb-8 border border-gray-300">
           <div className="bg-gray-100 px-4 py-2 border-b border-gray-300 font-bold text-sm">Description</div>
           <div className="divide-y divide-gray-300">
              {lineItems.map((item) => (
                <div key={item.id} className="p-4">
                   <div className="mb-2">
                      <p className="font-medium text-sm leading-relaxed">
                         {item.description}
                      </p>
                   </div>
                   <div className="flex justify-between items-center text-sm">
                      <div className="text-gray-600">
                         {item.quantity} x {formatCurrency(item.rate)}
                         {isVATRegistered && (item.vatRate || 0) > 0 && (
                           <span className="text-xs ml-1 opacity-75">(VAT {item.vatRate}%)</span>
                         )}
                      </div>
                      <div className="font-semibold whitespace-nowrap pl-4">
                         {formatCurrency(item.quantity * item.rate)}
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-64 border border-gray-300 p-4 bg-gray-50">
            {isVATRegistered && (
              <>
                <div className="flex justify-between mb-2 text-sm">
                  <span>Subtotal</span>
                  <span>{formatCurrency(netAmount)}</span>
                </div>
                <div className="flex justify-between mb-2 text-sm">
                  <span>VAT</span>
                  <span>{formatCurrency(vatAmount)}</span>
                </div>
                <div className="h-px bg-gray-300 my-2"></div>
              </>
            )}
            <div className="flex justify-between font-bold text-lg">
              <span>TOTAL</span>
              <span>{formatCurrency(totalAmount)}</span>
            </div>
            {isVATRegistered && <p className="text-[10px] text-gray-500 mt-2">All amounts in GBP</p>}
          </div>
        </div>

        {/* Notes and Bank Details */}
        <NotesAndBankDetails className="text-xs text-gray-600 mt-12" />
      </div>

      <div className="mt-12 text-center text-xs text-gray-500 border-t border-gray-300 pt-4">
          <p>{showLegalName ? legalName : displayName} • {businessAddress.split('\\\\n').join(', ')}</p>
          <p>Payment Due: {dueDate} • {paymentTerms}</p>
      </div>
    </div>
  );

  const renderBold = () => (
    <div className="p-8 bg-white h-full flex flex-col font-sans">
      <div className="flex-1">
        {/* Header */}
        <div className="flex justify-between items-start mb-12">
           <div>
              <h1 className="text-6xl font-black tracking-tighter mb-4">INVOICE</h1>
              <div className="bg-black text-white px-4 py-2 inline-block">
                 <span className="font-bold tracking-widest">#{invoiceNumber}</span>
              </div>
           </div>
           <div className="text-right">
              {logo && <img src={logo} alt="Logo" className="h-20 mb-4 ml-auto" />}
              <p className="font-bold text-xl mb-1">{displayName}</p>
              {showLegalName && <p className="text-xs text-gray-500 mb-1">{legalName}</p>}
              <p className="text-sm text-gray-500">{email}</p>
              <p className="text-sm text-gray-500">{phone}</p>
              {isVATRegistered && vatNumber && <p className="text-sm text-gray-500 font-mono mt-1">VAT: {vatNumber}</p>}
           </div>
        </div>

        {/* Black Block Info */}
        <div className="bg-black text-white p-6 mb-12">
           {/* Customer Info */}
           <div className="mb-6 pb-6 border-b border-gray-700">
              <p className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">Billed To</p>
              <p className="text-xl font-bold">{customer.name}</p>
              <p className="text-sm text-gray-400 mt-1">{customerAddressSingleLine}</p>
           </div>
           
           {/* Date Fields - Stacked layout on mobile to prevent overlap */}
           <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1">
                 <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Invoice Date</p>
                 <p className="font-bold text-left sm:text-right">{invoiceDate}</p>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1">
                 <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Supply Date (Tax Point)</p>
                 <p className="font-bold text-left sm:text-right">{supplyDate}</p>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1">
                 <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Due Date</p>
                 <p className="font-bold text-amber-400 text-left sm:text-right">{dueDate}</p>
              </div>
           </div>
        </div>

        {/* Items */}
        <div className="mb-12">
            <div className="border-b-4 border-black pb-2 mb-4">
                <p className="font-black text-xl uppercase">Description</p>
            </div>
            <RenderLineItems />
        </div>

        {/* Totals */}
        <div className="flex justify-end">
           <div className="w-80">
              {isVATRegistered && (
                 <div className="space-y-2 mb-4 text-right">
                    <div className="flex justify-between text-lg font-medium">
                       <span className="text-gray-500">Net</span>
                       <span>{formatCurrency(netAmount)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-medium">
                       <span className="text-gray-500">VAT</span>
                       <span>{formatCurrency(vatAmount)}</span>
                    </div>
                 </div>
              )}
              <div className="bg-black text-white p-6 flex justify-between items-center text-2xl font-black">
                 <span>TOTAL</span>
                 <span>{formatCurrency(totalAmount)}</span>
              </div>
           </div>
        </div>

        {/* Notes and Bank Details */}
        <NotesAndBankDetails className="text-xs text-gray-600 mt-12" />
      </div>
      
      {/* Footer */}
      <div className="mt-12 pt-8 border-t-2 border-gray-100 text-xs text-gray-400 flex justify-between">
         <div>
            <p className="font-bold text-black mb-1">Supplier</p>
            <p>{showLegalName ? legalName : displayName}</p>
            <p>{businessAddress.split('\\n')[0]}...</p>
         </div>
         <div className="text-right">
            <p className="font-bold text-black mb-1">Terms</p>
            <p>Due by {dueDate}</p>
         </div>
      </div>
    </div>
  );

  const renderMinimal = () => (
    <div className="p-12 bg-white h-full flex flex-col font-sans text-sm">
      <div className="flex-1">
         {/* Top Bar */}
         <div className="flex justify-between items-start mb-16">
            <div>
               <p className="font-medium text-gray-600 mb-1 text-xs uppercase tracking-wider">Invoice</p>
               <p className="text-xl font-semibold tracking-tight text-gray-900">{invoiceNumber}</p>
            </div>
            <div className="text-right">
               {logo && <img src={logo} alt="Logo" className="h-8 mb-4 ml-auto" />}
               <p className="font-semibold text-gray-900">{displayName}</p>
               <p className="text-gray-600 text-sm">{businessAddress.replace(/\n/g, ', ')}</p>
               <p className="text-gray-600 text-sm mt-1">{email}</p>
            </div>
         </div>

         {/* Grid Info */}
         <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-16">
            <div className="col-span-1 sm:col-span-2">
               <p className="text-gray-600 mb-2 text-xs uppercase tracking-wider font-medium">Billed To</p>
               <p className="font-semibold text-gray-900">{customer.name}</p>
               <p className="text-gray-600 text-sm">{customerAddressSingleLine}</p>
            </div>
            <div>
               <p className="text-gray-600 mb-2 text-xs uppercase tracking-wider font-medium">Issued</p>
               <p className="font-semibold text-gray-900">{invoiceDate}</p>
            </div>
             <div>
               <p className="text-gray-600 mb-2 text-xs uppercase tracking-wider font-medium">Due</p>
               <p className="font-semibold text-gray-900">{dueDate}</p>
            </div>
         </div>

         {/* Line Items */}
         <div className="mb-16">
            <RenderLineItems />
         </div>

         {/* Breakdown */}
         <div className="flex justify-end border-t border-gray-200 pt-8">
            <div className="w-full sm:w-72 space-y-3">
               {isVATRegistered && (
                  <>
                     <div className="flex justify-between text-sm text-gray-600">
                        <span>Net</span>
                        <span className="font-medium">{formatCurrency(netAmount)}</span>
                     </div>
                     <div className="flex justify-between text-sm text-gray-600">
                        <span>VAT</span>
                        <span className="font-medium">{formatCurrency(vatAmount)}</span>
                     </div>
                     <div className="h-px bg-gray-200"></div>
                  </>
               )}
               <div className="flex justify-between font-semibold text-base text-gray-900">
                  <span>Total</span>
                  <span>{formatCurrency(totalAmount)}</span>
               </div>
            </div>
         </div>

         {/* Notes and Bank Details */}
         <NotesAndBankDetails className="text-xs text-gray-500 mt-8" />
      </div>

      <div className="mt-auto pt-8 text-xs text-gray-500 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
         <div>
            {showLegalName && <p className="mb-1">Legal: {legalName}</p>}
            {isVATRegistered && vatNumber && <p>VAT: {vatNumber}</p>}
         </div>
         <div className="sm:text-right">
            <p>Supply Date: {supplyDate}</p>
         </div>
      </div>
    </div>
  );

  const renderProfessional = () => (
    <div className="p-8 bg-white h-full flex flex-col border-4 border-gray-200">
       <div className="flex-1">
          {/* Header Box */}
          <div className="border-b-2 border-gray-200 pb-8 mb-8">
             {/* Changed to flex-col on mobile to prevent Amount Due overlap */}
             <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
                <div>
                   <h1 className="text-3xl font-bold text-gray-800 mb-2">INVOICE</h1>
                   <div className="flex gap-4 text-sm text-gray-600">
                      <div>
                         <span className="font-semibold block text-xs uppercase text-gray-400">Number</span>
                         <span>{invoiceNumber}</span>
                      </div>
                      <div>
                         <span className="font-semibold block text-xs uppercase text-gray-400">Date</span>
                         <span>{invoiceDate}</span>
                      </div>
                      <div>
                         <span className="font-semibold block text-xs uppercase text-gray-400">Due</span>
                         <span>{dueDate}</span>
                      </div>
                   </div>
                </div>
                {/* Full width on mobile for amount due box */}
                <div className="text-right p-4 bg-gray-50 border border-gray-200 rounded w-full sm:w-auto">
                   <p className="text-xs font-bold text-gray-500 uppercase mb-1">Amount Due</p>
                   <p className="text-2xl font-bold text-primary whitespace-nowrap">{formatCurrency(totalAmount)}</p>
                </div>
             </div>
          </div>

          {/* Addresses */}
          <div className="grid grid-cols-2 gap-8 mb-8">
             <div>
                <p className="text-xs font-bold text-gray-400 uppercase mb-3">From</p>
                <div className="p-4 border border-gray-200 rounded-lg">
                   <p className="font-bold text-gray-800">{displayName}</p>
                   <p className="text-sm text-gray-600 whitespace-pre-line mt-1">{businessAddress}</p>
                   <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500 space-y-1">
                      <p>{email}</p>
                      <p>{phone}</p>
                      {isVATRegistered && vatNumber && <p>VAT: {vatNumber}</p>}
                   </div>
                </div>
             </div>
             <div>
                <p className="text-xs font-bold text-gray-400 uppercase mb-3">To</p>
                 <div className="p-4 border border-gray-200 rounded-lg bg-gray-50/50">
                   <p className="font-bold text-gray-800">{customer.name}</p>
                   <p className="text-sm text-gray-600">{customerAddressLine1}</p>
                   <p className="text-sm text-gray-600">{customerAddressLine2}</p>
                </div>
             </div>
          </div>

          {/* Items */}
          <div className="mb-8">
             <div className="bg-gray-100 px-4 py-3 rounded-t-lg font-bold text-gray-700 text-sm border border-gray-200 border-b-0">
                Description
             </div>
             <div className="border border-gray-200 rounded-b-lg p-4">
                <RenderLineItems />
             </div>
          </div>

          {/* Totals */}
          <div className="flex justify-end">
             <div className="w-72">
                {isVATRegistered && (
                   <div className="space-y-2 mb-4 px-4">
                      <div className="flex justify-between text-sm text-gray-600">
                         <span>Subtotal</span>
                         <span>{formatCurrency(netAmount)}</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                         <span>VAT</span>
                         <span>{formatCurrency(vatAmount)}</span>
                      </div>
                   </div>
                )}
                <div className="bg-gray-800 text-white p-4 rounded-lg flex justify-between font-bold text-lg">
                   <span>Total</span>
                   <span>{formatCurrency(totalAmount)}</span>
                </div>
             </div>
          </div>

          {/* Notes and Bank Details */}
          <NotesAndBankDetails className="text-xs text-gray-600 mt-12" />
       </div>

       <div className="mt-8 text-center text-xs text-gray-400">
          <p>Supply Date: {supplyDate} • {showLegalName ? `Legal Name: ${legalName}` : 'Thank you for your business'}</p>
       </div>
    </div>
  );

  const renderCreative = () => (
    <div className="p-8 bg-white h-full flex flex-col font-sans">
       <div className="flex-1">
          {/* Gradient Header */}
          <div className="bg-gradient-to-r from-primary to-amber-500 rounded-3xl p-8 text-white mb-8 shadow-lg shadow-amber-100">
             <div className="flex justify-between items-start">
                <div>
                   <h1 className="text-4xl font-bold mb-2">Invoice</h1>
                   <p className="opacity-80 font-mono">#{invoiceNumber}</p>
                </div>
                <div className="text-right bg-white/10 backdrop-blur-md rounded-2xl p-4">
                   <p className="text-xs opacity-70 uppercase tracking-wider mb-1">Due Amount</p>
                   <p className="text-2xl font-bold">{formatCurrency(totalAmount)}</p>
                </div>
             </div>
             {/* Adjusted to wrap on smaller screens to prevent truncation */}
             <div className="mt-8 flex flex-wrap gap-6 text-sm opacity-90">
                <div>
                   <p className="text-xs opacity-60 uppercase mb-1">Date</p>
                   <p className="font-semibold">{invoiceDate}</p>
                </div>
                <div>
                   <p className="text-xs opacity-60 uppercase mb-1">Due</p>
                   <p className="font-semibold">{dueDate}</p>
                </div>
                <div>
                   <p className="text-xs opacity-60 uppercase mb-1">Tax Point</p>
                   <p className="font-semibold">{supplyDate}</p>
                </div>
             </div>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-2 gap-6 mb-8">
             <div className="bg-gray-50 p-6 rounded-3xl">
                <p className="text-xs font-bold text-primary mb-3 uppercase tracking-wider">From</p>
                <p className="font-bold text-lg mb-1">{displayName}</p>
                <p className="text-sm text-gray-600 whitespace-pre-line mb-3">{businessAddress}</p>
                <div className="text-xs text-gray-500 space-y-1">
                   <p>{email}</p>
                   {isVATRegistered && vatNumber && <p>VAT: {vatNumber}</p>}
                </div>
             </div>
             <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100">
                <p className="text-xs font-bold text-amber-600 mb-3 uppercase tracking-wider">To</p>
                <p className="font-bold text-lg mb-1">{customer.name}</p>
                <p className="text-sm text-gray-600">{customerAddressSingleLine}</p>
             </div>
          </div>

          {/* Items */}
          <div className="bg-white border border-gray-100 shadow-sm rounded-3xl p-6 mb-8">
             <p className="text-xs font-bold text-gray-400 mb-4 uppercase tracking-wider">Description</p>
             <RenderLineItems />
          </div>

          {/* Totals Bubble */}
          <div className="flex justify-end">
             <div className="bg-gradient-to-br from-primary to-amber-700 text-white p-8 rounded-3xl w-full max-w-sm shadow-xl shadow-amber-100/50">
                {isVATRegistered && (
                   <div className="space-y-3 mb-6 border-b border-white/20 pb-6">
                      <div className="flex justify-between opacity-90">
                         <span>Net Amount</span>
                         <span>{formatCurrency(netAmount)}</span>
                      </div>
                      <div className="flex justify-between opacity-90">
                         <span>VAT</span>
                         <span>{formatCurrency(vatAmount)}</span>
                      </div>
                   </div>
                )}
                <div className="flex justify-between text-2xl font-bold">
                   <span>Total</span>
                   <span>{formatCurrency(totalAmount)}</span>
                </div>
             </div>
          </div>

          {/* Notes and Bank Details */}
          <NotesAndBankDetails className="text-xs text-gray-500 mt-12" />
       </div>

       <div className="mt-8 text-center text-xs text-gray-400">
          {showLegalName && <p>Registered as: {legalName}</p>}
       </div>
    </div>
  );

  const renderElegant = () => (
    <div className="p-8 bg-white h-full flex flex-col font-serif">
       <div className="flex-1">
          <div className="text-center mb-12">
             {logo && <img src={logo} alt="Logo" className="h-16 mx-auto mb-6" />}
             <div className="inline-block border-y border-gray-800 py-2 px-8 mb-4">
                <h1 className="text-3xl tracking-[0.2em] font-light uppercase">Invoice</h1>
             </div>
             <p className="text-sm text-gray-500 font-sans tracking-widest">NO. {invoiceNumber}</p>
          </div>

          <div className="flex justify-between mb-12 text-sm">
             <div className="w-1/3 text-center">
                <p className="font-sans text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">From</p>
                <p className="font-bold text-lg mb-2">{displayName}</p>
                <p className="text-gray-600 leading-relaxed mb-4">{businessAddress}</p>
                <p className="text-xs text-gray-500 font-sans">{email}</p>
             </div>
             <div className="w-1/3 text-center border-x border-gray-100 px-4">
                <p className="font-sans text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Details</p>
                <div className="space-y-2 text-gray-600">
                   <p>Date: {invoiceDate}</p>
                   <p>Supply: {supplyDate}</p>
                   <p>Due: {dueDate}</p>
                   {isVATRegistered && vatNumber && <p className="pt-2">VAT: {vatNumber}</p>}
                </div>
             </div>
             <div className="w-1/3 text-center">
                <p className="font-sans text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">To</p>
                <p className="font-bold text-lg mb-2">{customer.name}</p>
                <p className="text-gray-600 leading-relaxed">{customerAddressSingleLine}</p>
             </div>
          </div>

          <div className="mb-12">
             <div className="border-b border-gray-200 pb-2 mb-4 text-center">
                <p className="font-sans text-xs font-bold uppercase tracking-widest text-gray-400">Description</p>
             </div>
             <div className="py-2">
                <RenderLineItems variant="clean" />
             </div>
          </div>

          <div className="flex justify-center">
             <div className="w-80 text-center">
                {isVATRegistered && (
                   <div className="space-y-2 mb-4 pb-4 border-b border-gray-100 text-sm text-gray-600">
                      <div className="flex justify-between">
                         <span className="italic">Subtotal</span>
                         <span>{formatCurrency(netAmount)}</span>
                      </div>
                      <div className="flex justify-between">
                         <span className="italic">VAT</span>
                         <span>{formatCurrency(vatAmount)}</span>
                      </div>
                   </div>
                )}
                <div className="flex justify-between text-2xl border-t border-gray-800 pt-4">
                   <span className="font-light italic">Total</span>
                   <span className="font-bold">{formatCurrency(totalAmount)}</span>
                </div>
             </div>
          </div>

          {/* Notes and Bank Details */}
          <NotesAndBankDetails className="text-xs text-gray-500 mt-12 text-center" />
       </div>

       <div className="mt-12 pt-6 border-t border-gray-100 text-center text-xs text-gray-400 font-sans">
          {showLegalName && <p className="mb-1">Legal Name: {legalName}</p>}
          <p>Thank you for your business</p>
       </div>
    </div>
  );

  const renderCompact = () => (
    <div className="p-6 bg-white h-full flex flex-col font-sans text-sm">
       <div className="flex-1">
          <div className="flex justify-between items-start mb-6 border-b-2 border-gray-800 pb-4">
             <div>
                <h1 className="text-xl font-bold">INVOICE</h1>
                <div className="flex gap-3 text-xs text-gray-500 mt-1">
                   <span>#{invoiceNumber}</span>
                   <span>•</span>
                   <span>{invoiceDate}</span>
                </div>
             </div>
             <div className="text-right text-xs">
                <p className="font-bold">{displayName}</p>
                <p className="text-gray-500">{email}</p>
                <p className="text-gray-500">{phone}</p>
             </div>
          </div>

          <div className="bg-gray-50 p-3 rounded mb-6 text-xs">
             <div className="flex justify-between mb-2">
                <span className="text-gray-500">Bill To</span>
                <span className="font-medium">{customer.name}</span>
             </div>
             <div className="flex justify-between mb-2">
                <span className="text-gray-500">Due Date</span>
                <span className="font-medium">{dueDate}</span>
             </div>
             <div className="flex justify-between">
                <span className="text-gray-500">Tax Point</span>
                <span className="font-medium">{supplyDate}</span>
             </div>
          </div>

          <div className="mb-6">
             <RenderLineItems />
          </div>

          <div className="flex justify-end">
             <div className="w-full bg-gray-50 p-3 rounded space-y-2 text-xs">
                {isVATRegistered && (
                   <>
                      <div className="flex justify-between text-gray-500">
                         <span>Net</span>
                         <span>{formatCurrency(netAmount)}</span>
                      </div>
                      <div className="flex justify-between text-gray-500">
                         <span>VAT</span>
                         <span>{formatCurrency(vatAmount)}</span>
                      </div>
                      <div className="h-px bg-gray-200"></div>
                   </>
                )}
                <div className="flex justify-between font-bold text-base">
                   <span>Total</span>
                   <span>{formatCurrency(totalAmount)}</span>
                </div>
             </div>
          </div>

          {/* Notes and Bank Details */}
          <NotesAndBankDetails className="text-[10px] text-gray-500 mt-4" />
       </div>

       <div className="mt-4 pt-4 border-t border-gray-100 text-[10px] text-gray-400 text-center">
          <p>{businessAddress.split('\\n').join(', ')}</p>
          {showLegalName && <p>Legal: {legalName}</p>}
          {isVATRegistered && vatNumber && <p>VAT: {vatNumber}</p>}
       </div>
    </div>
  );

  const previewComponents: Record<string, () => JSX.Element> = {
    modern: renderModern,
    classic: renderClassic,
    bold: renderBold,
    minimal: renderMinimal,
    professional: renderProfessional,
    creative: renderCreative,
    elegant: renderElegant,
    compact: renderCompact,
  };

  const renderPreview = previewComponents[styleId] || renderModern;

  return <>{renderPreview()}</>;
}
