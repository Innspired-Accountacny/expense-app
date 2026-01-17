import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export function Input({ label, error, helperText, className = '', ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium mb-1.5 text-[var(--color-text)]">
          {label}
        </label>
      )}
      <input
        className={`w-full px-3 py-2.5 border rounded-lg bg-white text-[var(--color-text)] 
          ${error ? 'border-[var(--color-danger)]' : 'border-[var(--color-border)]'}
          focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-opacity-50
          disabled:bg-gray-50 disabled:text-gray-500 ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-[var(--color-danger)]">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">{helperText}</p>
      )}
    </div>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({ label, error, className = '', ...props }: TextareaProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium mb-1.5 text-[var(--color-text)]">
          {label}
        </label>
      )}
      <textarea
        className={`w-full px-3 py-2.5 border rounded-lg bg-white text-[var(--color-text)]
          ${error ? 'border-[var(--color-danger)]' : 'border-[var(--color-border)]'}
          focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-opacity-50
          disabled:bg-gray-50 disabled:text-gray-500 ${className}`}
        rows={4}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-[var(--color-danger)]">{error}</p>
      )}
    </div>
  );
}

interface ToggleProps {
  label?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export function Toggle({ label, checked, onChange, disabled }: ToggleProps) {
  return (
    <div className="flex items-center justify-between">
      {label && (
        <label className="text-sm font-medium text-[var(--color-text)]">{label}</label>
      )}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors
          ${checked ? 'bg-[var(--color-primary)]' : 'bg-gray-300'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform
            ${checked ? 'translate-x-6' : 'translate-x-1'}`}
        />
      </button>
    </div>
  );
}

interface SegmentedControlProps {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  fullWidth?: boolean;
}

export function SegmentedControl({ options, value, onChange, fullWidth = true }: SegmentedControlProps) {
  return (
    <div className={`inline-flex bg-[var(--color-surface)] p-1 rounded-lg ${fullWidth ? 'w-full' : ''}`}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors
            ${value === option.value 
              ? 'bg-white text-[var(--color-text)] shadow-sm' 
              : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'}`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
