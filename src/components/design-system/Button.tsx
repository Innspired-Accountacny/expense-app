import React from 'react';
import { cn } from '@/lib/utils'; // Assuming this exists, otherwise I'll need to create it or import clsx/tailwind-merge directly.
// Actually, looking at file list, /components/ui/utils.ts exists. Let's check imports later. 
// I'll stick to standard 'clsx' and 'tailwind-merge' if available, or just standard template literals if simple.
// Wait, I saw /components/ui/utils.ts in the file list. I should check its content or just define a local cn.

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'destructive';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', isLoading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    
    const baseStyles = "h-[48px] rounded-[16px] px-6 font-medium text-[16px] transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none";
    
    const variants = {
      primary: "bg-[#6b4423] text-white hover:bg-[#6b4423]/90 shadow-sm",
      secondary: "bg-[#f5ebe0] text-[#2d2621] hover:bg-[#e6dccf]", // Light background
      tertiary: "bg-transparent text-[#6b4423] hover:bg-[#6b4423]/5 underline-offset-4 hover:underline",
      destructive: "bg-red-50 text-red-600 hover:bg-red-100",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], className)}
        disabled={isLoading || disabled}
        {...props}
      >
        {isLoading && <span className="animate-spin mr-2">⏳</span>} {/* Simple loader for now */}
        {!isLoading && leftIcon}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);
Button.displayName = "DSButton";
