# Next MVP Task (pick one)

## Make invoice previews data-bound and compliant

**Why this is the highest unblocker**

- The app has a styled invoice preview (`src/components/InvoiceStyleRenderer.tsx`), but it uses placeholder invoice number/customer/date values, so the “preview” isn’t compliant for real invoices.
- The invoice detail view is data-bound (`src/components/invoices/InvoiceDetailScreen.tsx`) but does not show supplier (business profile) fields required for UK compliance.
- Fixing this unblocks multiple baseline items at once: invoice compliance (E) and the send/export flows that depend on a trustworthy preview (D, J).

**Scope (no redesign)**

- Keep all existing templates and styling; only pass real `Invoice` + `BusinessProfile` data into the renderer.
- Option A: extend `InvoiceStyleRenderer` props to accept the missing invoice fields (invoice number, customer details, invoice/supply dates) and render them instead of hardcoded samples.
- Option B: introduce a small wrapper (e.g., `InvoiceDocumentRenderer`) that binds `Invoice` + `BusinessProfile` and delegates to the existing style templates.

**Acceptance criteria**

- Preview shows: unique invoice number, supplier name/address/contact, legal + trading name (if different), customer name/address, invoice date + supply date/tax point, line items + totals; and VAT fields when VAT-registered.
