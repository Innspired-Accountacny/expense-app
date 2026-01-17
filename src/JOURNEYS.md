# Primary User Journeys

## Journey Map: Screen IDs and Flow

### Journey 1: New User Onboarding
**Goal**: Complete business setup and see first invoice preview

**Flow**:
1. **OB-01**: Welcome Screen → User chooses sign-in method
2. **OB-02**: Business Details → Enter legal name, trading name, address, email, phone
3. **OB-03**: VAT Status → Choose VAT registered Yes/No, enter VAT number if yes
4. **OB-04**: VAT Pricing Mode → Choose Gross (inclusive) or Net (exclusive) - only if VAT registered
5. **OB-05**: Invoice Style → Select from 8 preset styles
6. **OB-06**: Logo Upload → Upload logo or generate with AI (optional)
7. **OB-07**: Invoice Preview → See sample invoice with their details
8. **OB-08**: Finish → Receive welcome tips and go to app

**Outcome**: User lands on **CHAT-01** (Chat home screen)

---

### Journey 2: Create and Send Invoice via Chat
**Goal**: Use natural language to create and send an invoice

**Flow**:
1. **CHAT-01**: Chat home
   - User types: "Create and send invoice for John Smith for kitchen fitting for £500"
   - AI creates draft invoice card in chat
   
2. **CHAT-01** (cont.): Draft appears in conversation
   - User sees **Draft Invoice Card** with:
     - Invoice number (e.g., INV-00001)
     - Customer: John Smith
     - Description: Kitchen fitting
     - Total: £500 (or £500 + VAT if VAT registered)
     - Stripe payment link toggle
   - Actions: Approve, Edit, Reject

3. **User clicks Approve**
   - **CHAT-02**: Send Options Modal appears
     - "Send via Email" button
     - "Share..." button
     - Cancel button

4. **User selects "Send via Email"** (or "Share...")
   - Modal closes
   - **CHAT-03**: Share Confirmation Dialog appears
     - "Mark as sent" button (locks invoice number)
     - "Not yet" button (saves as draft)
     - Info text: "Marking as sent will lock the invoice number permanently"

5. **User clicks "Mark as sent"**
   - Invoice status changes to Sent
   - Invoice number INV-00001 is now locked forever
   - Assistant confirms: "Invoice INV-00001 has been marked as sent and is now locked"

6. **User clicks "Not yet"**
   - Invoice saved as draft
   - Invoice number NOT locked yet (can be released if deleted)
   - Assistant confirms: "Invoice INV-00001 saved as draft. You can send it later from Invoices tab"

**Outcome**: Invoice created and either sent (locked) or saved as draft

---

### Journey 3: View and Manage Invoices
**Goal**: Browse invoices and view details

**Flow**:
1. **INV-01**: Invoices List Screen
   - Search bar at top
   - Filter tabs: All, Draft, Sent, Paid, Overdue
   - List of invoices showing:
     - Invoice number
     - Customer name
     - Status chip
     - Date
     - Amount

2. **User taps an invoice**
   - **INV-02**: Invoice Detail Screen
     - Full invoice preview
     - Customer details
     - Line items
     - Notes
     - Payment link info
     - Totals (Net + VAT + Gross if VAT registered)
     - Action buttons based on status:
       - Draft: "Send" button
       - Sent: "Mark Paid" + "Void" buttons
       - Paid: Read-only
       - Voided: Read-only with void timestamp

3. **User clicks "Void"** (on Sent invoice)
   - **INV-03**: Void Confirmation Modal
     - Warning: "Invoice number INV-00023 will remain in records but cannot be reused"
     - Cancel / Void Invoice buttons
   
4. **User confirms void**
   - Invoice status → Voided
   - Invoice number remains locked (cannot be reused)
   - Void timestamp recorded
   - Returns to INV-02 with updated status

**Outcome**: User can review all invoices and change status

---

### Journey 4: Add Expense
**Goal**: Capture an expense via receipt photo

**Flow**:
1. **EXP-01**: Expenses List Screen
   - Search bar
   - List of expenses (merchant, date, amount, category)
   - Floating + button

2. **User taps + button**
   - **EXP-02**: Add Expense Method Chooser (modal)
     - "Receipt Photo" option
     - "Upload File" option
     - "Forwarded Email" option
     - Cancel button

3. **User selects "Receipt Photo"**
   - Camera opens (would open in real app)
   - User takes photo
   - AI extracts merchant, amount, date
   
4. **EXP-03**: Draft Expense Preview Card (in chat or expenses tab)
   - Shows extracted data
   - Actions: Approve, Edit, Reject
   
5. **User clicks Approve**
   - Expense saved to expenses list
   - Returns to **EXP-01** with new expense visible

**Outcome**: Expense captured and stored

---

### Journey 5: Configure Settings
**Goal**: Enable weekly admin reminders and set up accountant export

**Flow**:
1. **SET-01**: Settings Home Screen
   - **Business Section**:
     - Business Profile
     - VAT Settings (only if VAT registered)
   
   - **Automation Section**:
     - Weekly Admin Reminder toggle
     - Automated Chasing toggle (with warning: "Off by default")
   
   - **Reporting Section**:
     - VAT Threshold Tracker (only if VAT registered)
     - Export Pack for Accountant

2. **User toggles "Weekly Admin Reminder" ON**
   - Setting saved immediately
   - User will receive weekly checklist prompts

3. **User taps "Export Pack for Accountant"**
   - **SET-03**: Export Pack Screen
     - Shows what's included:
       - All invoices (PDF)
       - All expenses with receipts
       - VAT summary (if applicable)
       - Transaction log (CSV)
       - Business profile
     
     - "Generate & Download ZIP" button
     - Email section:
       - Accountant email input field
       - Note: "Will email accountant and CC user@example.com"
       - "Email Export Pack" button

4. **User enters accountant email and clicks "Email Export Pack"**
   - Export generated
   - Email sent to accountant with CC to user
   - Success message appears
   - Email address saved for future use

**Outcome**: Settings configured, export pack sent

---

### Journey 6: VAT Threshold Tracking (VAT Registered Users Only)
**Goal**: Monitor progress toward VAT registration threshold

**Flow**:
1. **SET-01**: Settings → User taps "VAT Threshold Tracker"

2. **SET-02**: VAT Tracker Screen (custom screen)
   - Progress bar showing percentage of £85,000 threshold
   - Status indicator:
     - Green: "Well below threshold" (< 70%)
     - Amber: "Approaching threshold" (70-90%)
     - Red: "Near or over threshold" (> 90%)
   
   - Shows:
     - Rolling 12-month turnover
     - VAT registration threshold (£85,000)
     - Remaining headroom
   
   - Recent invoices list (last 12 months)
   - Info box explaining VAT registration requirements
   - Warning if approaching/over threshold

**Outcome**: User aware of VAT status and can plan accordingly

---

## Compliance Rules (Enforced in All Journeys)

### Invoice Numbering Rules
✅ **Draft created** → Number allocated immediately (e.g., INV-00005)
✅ **Draft deleted** → Number returned to reusable pool
✅ **Invoice sent** → Number locked forever (cannot be changed or reused)
✅ **Invoice voided** → Number remains locked (cannot be reused)
✅ **Reuse pool** → Released numbers reused before incrementing sequence

### Send Confirmation Rules
✅ Every outbound action offers: **Email** or **Share...**
✅ Both paths show confirmation: **"Mark as sent"** vs **"Not yet"**
✅ Only "Mark as sent" changes status to Sent and locks number
✅ "Not yet" saves as draft (number can still be released if deleted)

### VAT Rules
✅ VAT toggle only visible if user is VAT registered
✅ VAT pricing mode set during onboarding (can be changed per invoice)
✅ VAT invoices show: Net, VAT rate, VAT amount, Gross
✅ Non-VAT invoices show: Total only
✅ Tax point vs Supply Date labeling based on VAT status

### Automation Rules
✅ Automated chasing is **OFF by default**
✅ User must explicitly enable it
✅ Warning shown when toggling ON

---

## Screen Inventory

### Onboarding Screens (8 total)
- OB-01: Welcome
- OB-02: Business Details
- OB-03: VAT Status
- OB-04: VAT Pricing Mode (conditional)
- OB-05: Invoice Style
- OB-06: Logo Upload
- OB-07: Invoice Preview
- OB-08: Finish

### Main App Screens
**Chat Tab**:
- CHAT-01: Chat home with message history
- CHAT-02: Send Options Modal
- CHAT-03: Share Confirmation Modal

**Invoices Tab**:
- INV-01: Invoices list with filters
- INV-02: Invoice detail view
- INV-03: Void confirmation modal

**Expenses Tab**:
- EXP-01: Expenses list
- EXP-02: Add expense method chooser
- EXP-03: Draft expense preview

**Settings Tab**:
- SET-01: Settings home
- SET-02: Weekly admin routine (can be built as sub-screen)
- SET-03: Export pack screen
- VAT Tracker screen (custom, navigated from SET-01)

### Reusable Components
- Bottom Tab Bar (persistent across all main app screens)
- Draft Invoice Card (VAT and non-VAT variants)
- Status Chips (Draft, Sent, Paid, Overdue, Voided)
- Empty States
- Progress Indicator

---

## Key Interactions

### Invoice Creation via Chat (Natural Language Examples)
✅ "Create invoice for John Smith for kitchen fitting for £500"
✅ "Invoice Sarah Jones £1,200 for web design"
✅ "Send invoice to ABC Ltd for consulting £850"

### Filter Interactions (Invoices Tab)
✅ Tap filter chips: All, Draft, Sent, Paid, Overdue
✅ Search by invoice number or customer name

### Toggle States (Settings)
✅ Weekly Admin Reminder: OFF → ON
✅ Automated Chasing: OFF → ON (with warning)

### Send Flow States
1. Draft invoice in chat
2. Approve → Send Options Modal
3. Choose Email/Share → Share Confirmation
4. Choose "Mark as sent" → Sent + Locked
5. Choose "Not yet" → Draft + Unlocked

---

This journey map covers all primary user flows and screen transitions in the MVP.
