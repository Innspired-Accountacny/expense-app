# InvoiceChat - UK Sole Trader Invoicing App

A mobile-first invoicing and expenses application designed specifically for UK sole traders with AI-powered chat interface.

## Key Features

### ✅ UK Compliance
- Full UK invoice compliance (non-VAT and VAT invoices)
- VAT registration support with pricing modes (Gross/Net)
- Invoice numbering with proper allocation and locking rules
- VAT threshold tracking (rolling 12-month)
- Year-end export pack for accountants

### 🤖 AI-Powered Chat
- Natural language invoice creation
- Chat-first UI for quick operations
- AI suggests, user approves (no silent actions)

### 📄 Invoice Management
- Sequential invoice numbering (INV-00001, INV-00002, etc.)
- Draft invoices allocate numbers immediately
- Numbers returned to pool if draft deleted before sending
- Numbers locked forever once invoice is sent
- Voided invoices keep their numbers (cannot be reused)

### 💰 VAT Support
- Optional VAT registration
- Two pricing modes:
  - **Gross (VAT Inclusive)**: Enter prices including VAT
  - **Net (VAT Exclusive)**: Enter prices before VAT
- VAT calculations per line item
- Proper VAT invoice fields (tax point, VAT number, etc.)

### 📧 Send & Share Workflow
- Two send methods: Email (in-app) or Share (native sheet)
- Mandatory confirmation: "Mark as sent" or "Not yet"
- Only marks invoice as Sent when explicitly confirmed
- Stripe payment links (optional per invoice)

### 💳 Expenses
- Multiple capture methods:
  - Receipt photo
  - File upload
  - Forwarded emails
- Category tracking
- Draft approval workflow

### ⚙️ Settings & Automation
- Weekly admin reminders (optional)
- Automated invoice chasing (OFF by default)
- VAT threshold tracker
- Export pack for accountant (with CC to user)
- Year-end checklist

## Application Structure

### Screens

#### Onboarding (OB-01 to OB-08)
1. **OB-01**: Welcome + Sign in options
2. **OB-02**: Business details form
3. **OB-03**: VAT registration status
4. **OB-04**: VAT pricing mode (if VAT registered)
5. **OB-05**: Invoice style selection
6. **OB-06**: Logo upload
7. **OB-07**: Invoice preview
8. **OB-08**: Finish screen

#### Main App - Bottom Tab Navigation
- **Chat**: AI assistant with invoice creation
- **Invoices**: List, filter, view, manage invoices
- **Expenses**: Track and categorize expenses
- **Settings**: Business profile, VAT, automation, exports

### Key Components

- `BottomTabBar`: Persistent navigation
- `DraftInvoiceCard`: Invoice preview with VAT/non-VAT variants
- `StatusChip`: Invoice status indicators
- `ProgressIndicator`: Onboarding progress
- `EmptyState`: No content states

### Business Logic

#### Invoice Numbering (`utils/invoiceNumbering.ts`)
- Allocates sequential numbers
- Maintains pool of released numbers
- Tracks locked numbers (sent/voided)
- Reuses released numbers before incrementing

#### VAT Calculations (`utils/invoiceCalculations.ts`)
- Calculates net, VAT, and gross amounts
- Supports both pricing modes
- Per-line-item VAT rates
- Total calculations for invoices

### Data Persistence

Currently uses `localStorage` for:
- Business profile
- Invoices
- Expenses
- Settings
- Invoice number pool

## Invoice Number Lifecycle

1. **Draft Created**: Number allocated (e.g., INV-00005)
2. **Draft Deleted**: Number returned to reusable pool
3. **Invoice Sent**: Number locked forever
4. **Invoice Voided**: Number remains locked, cannot be reused

## VAT Compliance

### Non-VAT Invoices Include:
- Sequential unique invoice number
- Supplier name, address, contact
- Legal name + trading name (if different)
- Customer name + address
- Invoice date + supply date
- Description of goods/services
- Amounts + total owed

### VAT Invoices Include:
- All non-VAT fields PLUS:
- VAT registration number
- Tax point (time of supply)
- Description/quantity/extent
- VAT rate + net + VAT amount + gross
- Total VAT in sterling

## Technical Stack

- React 18
- TypeScript
- Tailwind CSS v4
- Local state management with React hooks
- localStorage for persistence

## Future Enhancements

This MVP can be extended with:
- Supabase backend for cloud sync
- Multi-device support
- Mileage tracking (GPS)
- Bank integration
- Recurring invoices
- Client portal
- Payment gateway integration

## Notes

- Mobile-first design (iPhone-sized viewport)
- Light mode only in MVP
- Designed for UK market specifically
- Complies with HMRC invoice requirements
- No PII collection without explicit user consent
