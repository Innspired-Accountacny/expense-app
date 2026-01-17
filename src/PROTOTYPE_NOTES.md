# InvoiceChat - Prototype Notes

## Overview
A mobile-first invoicing and expenses app for UK sole traders with a chat-first UI. This MVP includes comprehensive onboarding, invoice management, expense tracking, and UK VAT compliance features.

---

## Screen IDs & Primary User Journeys

### Onboarding Flow (OB-01 to OB-08)

**OB-01: Welcome Screen**
- Sign-in options: Apple ID, Google, Email
- Entry point to the app

**OB-02: Business Details Form**
- Captures: Legal name, trading name (optional), address, email, phone
- Progressive form with validation

**OB-03: VAT Status**
- Toggle: VAT registered yes/no
- Conditional: VAT number input (if registered)
- Info: VAT threshold guidance (£90,000)

**OB-04: VAT Pricing Mode** (Only shown if VAT registered)
- Segmented control: Gross (VAT inclusive) vs Net (VAT exclusive)
- Visual examples showing how each mode works
- Default setting with per-invoice override option

**OB-05: Invoice Style Presets**
- 8 preset cards with color previews
- Selection interface with visual feedback

**OB-06: Logo Upload**
- Upload logo option
- AI generate option (placeholder)
- Skip option

**OB-07: Invoice Preview**
- Sample invoice using selected style
- Shows all required UK invoice fields
- VAT vs non-VAT variants displayed correctly

**OB-08: Finish Onboarding**
- Confirmation screen
- Quick tips on app features
- "Go to app" CTA

---

### Main App Navigation

**Bottom Tab Bar** (Persistent on all main screens)
- Chat
- Invoices
- Expenses
- Settings

---

### Chat Tab (CHAT-01 to CHAT-03)

**CHAT-01: Chat Home**
- ChatGPT-style message interface
- Input bar with mic and attach icons
- Example: User types "Create and send invoice for John Smith for kitchen fitting for £1,200"
- AI responds with Draft Invoice Card component embedded in chat

**Draft Invoice Card** (Reusable Component)
- Shows:
  - Invoice number (allocated at draft creation, e.g., INV-00023)
  - Customer name + description
  - Invoice date + supply date/tax point
  - Total owed (GBP)
  - Stripe payment link toggle
- Actions: Approve, Edit, Reject
- Two variants:
  - Non-VAT: Simple totals
  - VAT: Shows net, VAT rate, VAT amount, gross total

**CHAT-02: Send Options Modal**
- "Send via Email" button
- "Share..." button (native share sheet style)

**CHAT-03: Share Confirmation Dialog**
- "Mark as sent" button
- "Not yet" button
- Explanation: Marking as sent locks the invoice number

---

### Invoices Tab (INV-01 to INV-03)

**INV-01: Invoices List**
- Segmented filter: All / Draft / Sent / Paid / Overdue
- List rows showing:
  - Invoice number
  - Customer name
  - Amount
  - Status chip
  - Date
- Empty state for no invoices

**INV-02: Invoice Detail**
- Full invoice summary
- Status chip
- Customer details
- Line items breakdown
- Totals (with VAT breakdown if applicable)
- Payment link section
- Actions:
  - Send/Share (with same flow as chat)
  - Void
  - Edit (for drafts)

**INV-03: Void Confirmation Modal**
- Warning: Number cannot be reused
- Record stays in history
- Destructive action confirmation

**Edit Invoice Screen** (Additional)
- Full form editor
- Customer details section
- Line items with add/remove
- Date fields (Invoice date + Tax point/Supply date)
- VAT toggle (if VAT registered)
- Stripe payment link toggle
- Notes field
- Totals preview
- Save/Cancel actions

---

### Expenses Tab (EXP-01 to EXP-03)

**EXP-01: Expenses List**
- List of expenses with:
  - Merchant name
  - Date
  - Amount
  - Category
- CTA: Add expense button

**EXP-02: Add Expense Method Chooser** (Modal)
- Receipt photo (camera)
- Upload file
- Forwarded email
- Info: Explains email forwarding address

**EXP-03: Draft Expense Preview Card**
- Same approve/edit/reject pattern as invoices
- Shows extracted data from receipt
- User confirms or edits before saving

---

### Settings Tab (SET-01 to SET-03)

**SET-01: Settings Home**
- Business Profile
- VAT Settings (only visible if VAT registered)
- Weekly Admin Reminders
- VAT Threshold Tracker (rolling 12-month indicator)
- Export Pack for Accountant
- Automated Chasing toggle (off by default)
- Sign Out

**SET-02: Weekly Admin Routine** (Not implemented in prototype)
- Checklist-style guided routine
- In-app reminder configuration

**SET-03: VAT Threshold Tracker**
- Visual progress bar showing rolling 12-month turnover
- Current: £45,000 / £90,000 threshold
- Color-coded: Green (safe), Amber (approaching), Red (exceeded)
- Monthly breakdown list
- Info box explaining VAT registration requirements

**Export Pack Screen**
- What's included: Invoices, expenses, VAT summary, reports
- Generate ZIP download button
- Accountant email field
- "Email accountant" button
- Confirmation: Emails accountant AND CCs user
- Year-end checklist preview

---

## UK Invoice Compliance

### Non-VAT Invoices Must Include:
✅ Sequential unique invoice number
✅ Supplier name + address + contact
✅ Sole trader legal name + trading name if different
✅ Customer name + address
✅ Invoice date + supply date
✅ Description of goods/services
✅ Amounts + total owed

### VAT Invoices Must Include:
✅ Sequential unique invoice number
✅ Supplier VAT registration number
✅ Tax point (time of supply)
✅ Invoice date (if different from tax point)
✅ Customer name + address
✅ Description/quantity/extent
✅ VAT rate + net + VAT amount + gross
✅ Total VAT in sterling + totals

---

## Invoice Numbering Rules

### Allocation
- Invoice number allocated **at Draft creation**
- Format: INV-XXXXX (zero-padded, sequential)

### Draft Deletion
- If Draft deleted **before send**, number returns to **reusable pool**
- Pool is FIFO (first available number reused)

### Sent Invoices
- Once marked as **Sent**, number is **locked forever**
- Cannot be deleted or number reused

### Voided Invoices
- Voided invoices **remain in history**
- Numbers **cannot be reused**
- Record is permanent for audit trail

---

## Global Send/Share Rules

### Every Outbound Action Supports:
1. **Email** (in-app email)
   - Requires customer email address
   - Validation: Shows error if email missing
   
2. **Share...** (native share sheet style)
   - Opens system share dialog
   - No email required

### Share Flow Confirmation:
- After selecting Email or Share...
- Modal appears: "Mark as sent?"
- Options:
  - **"Mark as sent"** → Status changes to Sent, number locked
  - **"Not yet"** → Shared but stays as Draft, number can be reused if deleted

---

## VAT Features

### VAT Toggle
- Only visible if user is VAT registered
- Controls VAT fields visibility throughout app

### VAT Pricing Mode (Set during onboarding)
- **Gross (VAT Inclusive)**: Amount entered = final price customer pays
  - Example: Enter £120 → Net £100 + VAT £20 = Gross £120
- **Net (VAT Exclusive)**: Amount entered = price before VAT
  - Example: Enter £100 → Net £100 + VAT £20 = Gross £120

### Per-Invoice Override
- Default mode set in onboarding
- Can be changed when editing individual invoices
- VAT can be toggled on/off per invoice (for VAT-registered users)

---

## Automated Chasing

### Default State
- **OFF by default**
- User must explicitly enable

### When Enabled
- Automated reminder emails for overdue invoices
- User controls frequency and messaging
- Respects "user approves" principle

---

## Additional Features

### Stripe Payment Links
- Toggle on/off per invoice
- Default: ON
- Included in invoice email/share
- Customers can pay directly

### Weekly Admin Routine
- Optional reminder system
- Guided checklist for weekly tasks
- Configurable in Settings

### Export Pack
- Generates ZIP file with:
  - All sent/paid invoices (PDFs)
  - All expenses with receipts
  - VAT summary report
  - Income/expense breakdown
  - Year-end checklist
- Can be downloaded or emailed to accountant
- **Must CC user** when emailing accountant

---

## Technical Implementation

### Components
- ✅ Reusable design system (buttons, inputs, cards, chips)
- ✅ Bottom tab navigation
- ✅ Modal dialogs
- ✅ Status chips
- ✅ Draft invoice card (VAT/non-VAT variants)
- ✅ Empty states
- ✅ Forms with validation

### Data Management
- Invoice number allocation with reusable pool
- Status transitions (draft → sent → paid/overdue/voided)
- VAT calculations based on pricing mode
- Chat message history with embedded draft invoices

### Responsive Design
- Mobile-first (max-width: 28rem / 448px)
- iPhone-optimized
- Safe area support for iOS notch
- Smooth animations and transitions

---

## User Journey Examples

### Journey 1: Create Invoice via Chat
1. User opens Chat tab
2. Types: "Create invoice for John Smith for kitchen fitting for £1,200"
3. AI creates draft invoice card in chat
4. User reviews, taps "Approve"
5. Send options modal appears
6. User selects "Send via Email"
7. Share confirmation: "Mark as sent" or "Not yet"
8. User chooses "Mark as sent"
9. Invoice sent, number locked, status = Sent

### Journey 2: Edit Draft Invoice
1. User navigates to Invoices tab
2. Filters to "Draft"
3. Taps on invoice
4. Taps "Edit"
5. Modifies line items, customer details
6. Taps "Save Changes"
7. Returns to invoice detail
8. Can now send or continue editing

### Journey 3: Track VAT Threshold
1. User opens Settings
2. Taps "VAT Threshold Tracker"
3. Sees progress: £45,000 / £90,000
4. Reviews monthly breakdown
5. Stays informed about registration requirement

### Journey 4: Export for Accountant
1. User opens Settings
2. Taps "Export Pack for Accountant"
3. Enters accountant email
4. Taps "Email Accountant"
5. Confirmation: Email sent to accountant + CC to user
6. Both receive ZIP with all year-end data

---

## Design Constraints Met

✅ iPhone-sized frames (mobile-first, max-width container)
✅ Auto Layout equivalent (Flexbox/Grid throughout)
✅ Reusable components (design system)
✅ Light mode only
✅ Accessible font sizes and hierarchy
✅ Concise UK-friendly copy (GBP, VAT wording)
✅ No background GPS tracking (mileage excluded from MVP)

---

## Compliance Confirmation

### UK Invoice Requirements
✅ All mandatory fields present
✅ Sequential numbering with audit trail
✅ VAT information when applicable
✅ Supplier and customer details complete

### VAT Rules
✅ VAT registration threshold tracking
✅ Proper VAT breakdown (net, rate, amount, gross)
✅ Tax point vs invoice date distinction
✅ VAT number display on VAT invoices

### Send/Share Rules
✅ User confirmation before marking as sent
✅ Email and Share options available
✅ Customer email validation for email send

### Invoice Numbering
✅ Allocated at draft creation
✅ Reusable pool for deleted drafts
✅ Permanent locking once sent
✅ Voided invoices kept in history

---

## Future Enhancements (Not in MVP)

- Mileage tracking with GPS
- Recurring invoices
- Multi-currency support
- Custom invoice templates
- Bank account reconciliation
- Advanced reporting dashboard
- Multi-user/team features
- Dark mode

---

## App Name & Branding

**InvoiceChat** - The smart invoicing and expenses app for UK sole traders

**Tagline**: Chat to create, approve to send

**Primary Color**: Blue (#2563eb) - Professional, trustworthy
**Accent Colors**: Success (green), Warning (amber), Danger (red)
