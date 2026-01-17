# Mobile Spacing Standards

This document outlines the standardized spacing patterns used throughout the app to ensure consistent bottom padding across all screens and modals, particularly for mobile devices with home indicators (safe areas).

## Background

On iOS devices with a home indicator (iPhone X and later), there's a safe area at the bottom of the screen that must be respected to prevent UI elements from being obscured or too close to the screen edge. The CSS environment variable `env(safe-area-inset-bottom)` provides this spacing (typically ~34px on devices with a home indicator, 0px otherwise).

However, simply using `env(safe-area-inset-bottom)` is not enough - we also need base padding above buttons to ensure proper spacing on all devices.

## Standard Patterns

### 1. Onboarding Form Screens (with Back/Continue buttons)

**Pattern:** `px-6 pt-6 pb-[calc(2.5rem+env(safe-area-inset-bottom))] border-t border-border bg-white`

**Usage:** Bottom button container in full-screen forms

**Components using this:**
- `/components/onboarding/BusinessDetailsForm.tsx`
- `/components/onboarding/VATStatusForm.tsx`
- `/components/onboarding/VATPricingModeForm.tsx`
- `/components/onboarding/InvoiceStyleForm.tsx`
- `/components/onboarding/LogoUploadForm.tsx`
- `/components/onboarding/InvoicePreviewForm.tsx`

**Example:**
```tsx
{/* Fixed bottom buttons */}
<div className="px-6 pt-6 pb-[calc(2.5rem+env(safe-area-inset-bottom))] border-t border-border bg-white">
  <div className="flex gap-3">
    <button>Back</button>
    <button>Continue</button>
  </div>
</div>
```

**Breakdown:**
- `px-6`: Horizontal padding (24px)
- `pt-6`: Top padding (24px) - creates space above the buttons
- `pb-[calc(2.5rem+env(safe-area-inset-bottom))]`: Bottom padding = 40px base + safe area
- `border-t`: Top border to separate from content
- Total bottom spacing: 40px + safe area (typically 0-34px)

### 2. Welcome/Finish Screens (centered layout)

**Pattern:** `pb-[calc(2rem+env(safe-area-inset-bottom))]`

**Usage:** Bottom button container in centered welcome/completion screens

**Components using this:**
- `/components/onboarding/WelcomeScreen.tsx`
- `/components/onboarding/FinishScreen.tsx`

**Example:**
```tsx
<div className="w-full max-w-sm pb-[calc(2rem+env(safe-area-inset-bottom))]">
  <button>Continue</button>
</div>
```

**Breakdown:**
- `pb-[calc(2rem+env(safe-area-inset-bottom))]`: Bottom padding = 32px base + safe area
- Slightly less padding than forms (32px vs 40px) since there's no border-top

### 3. Bottom Sheet Modals

**Pattern:** `p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))]`

**Usage:** Bottom sheet modals that slide up from the bottom

**Components using this:**
- `/components/chat/SendOptionsModal.tsx`
- `/components/chat/ShareConfirmationModal.tsx`
- `/components/expenses/ExpensesScreen.tsx` (Add Expense modal)

**Example:**
```tsx
<div className="bg-white rounded-t-2xl w-full max-w-md p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] animate-slide-up">
  {/* Modal content */}
</div>
```

**Breakdown:**
- `p-6`: All-around padding (24px)
- `pb-[calc(1.5rem+env(safe-area-inset-bottom))]`: Override bottom padding = 24px base + safe area
- The override is necessary because `p-6` would apply 24px, but we need 24px + safe area

### 4. Centered Dialog Modals

**Pattern:** `p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]`

**Usage:** Centered confirmation dialogs

**Components using this:**
- `/components/invoices/InvoiceDetailScreen.tsx` (Void confirmation modal)

**Example:**
```tsx
<div className="fixed inset-0 z-50 flex items-center justify-center p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
  <div className="bg-white rounded-3xl p-6 max-w-sm w-full">
    {/* Modal content */}
  </div>
</div>
```

**Breakdown:**
- The outer container gets padding to ensure the modal doesn't touch screen edges
- `pb-[calc(1rem+env(safe-area-inset-bottom))]`: Extra bottom padding to account for safe area

### 5. Fixed Tab Bar

**Pattern:** `safe-area-bottom` utility class

**Usage:** Bottom navigation tab bar

**Components using this:**
- `/components/BottomTabBar.tsx`

**Example:**
```tsx
<div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border safe-area-bottom z-10">
  {/* Tab buttons */}
</div>
```

**Breakdown:**
- `safe-area-bottom` is defined in `/styles/globals.css` as `padding-bottom: env(safe-area-inset-bottom)`
- This is appropriate for the tab bar since it needs only the safe area spacing, no additional padding

## Common Mistakes to Avoid

### ❌ Using `safe-area-bottom` class alone for button containers
```tsx
<div className="p-6 safe-area-bottom">
  <button>Continue</button>
</div>
```
**Problem:** On desktop or devices without a home indicator, `env(safe-area-inset-bottom)` is 0, meaning the button will touch the screen edge (only 24px from `p-6`).

### ✅ Correct approach
```tsx
<div className="px-6 pt-6 pb-[calc(2.5rem+env(safe-area-inset-bottom))]">
  <button>Continue</button>
</div>
```
**Why:** This ensures 40px base padding + safe area, providing adequate spacing on all devices.

## Testing Checklist

When adding new screens or modals with bottom buttons:

- [ ] Test on desktop browser (should have adequate bottom spacing even without safe area)
- [ ] Test on iOS simulator with home indicator (iPhone 14/15)
- [ ] Test on iOS simulator without home indicator (iPhone SE)
- [ ] Verify buttons don't touch the screen edge on any device
- [ ] Verify consistent spacing with other similar screens

## Reference: CSS Custom Properties

From `/styles/globals.css`:

```css
.safe-area-bottom {
  padding-bottom: env(safe-area-inset-bottom);
}

.safe-area-top {
  padding-top: env(safe-area-inset-top);
}
```

## Future Additions

When creating new components with bottom buttons or modals, refer to this document and use the appropriate pattern based on the component type. If you need a new pattern, document it here with clear examples and rationale.
