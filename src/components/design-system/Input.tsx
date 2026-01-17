import React from 'react';
import { cn } from './Button'; // Reusing local cn

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, helperText, error, leftIcon, ...props }, ref) => {
    return (
      <div className="w-full space-y-2">
        {label && (
          <label className="text-[14px] font-medium text-[#2d2621]/80 ml-1">
            {label}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              "w-full h-[48px] rounded-[16px] border border-transparent bg-[#fff] px-4 text-[16px] text-[#2d2621] shadow-sm ring-1 ring-[#e5e5e5] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6b4423] focus:border-transparent transition-all",
              leftIcon && "pl-11",
              error && "ring-red-500 focus:ring-red-500",
              className
            )}
            {...props}
          />
        </div>

        {error ? (
          <p className="text-[13px] text-red-500 ml-1 font-medium">{error}</p>
        ) : helperText ? (
          <p className="text-[13px] text-[#8b7355] ml-1">{helperText}</p>
        ) : null}
      </div>
    );
  }
);
Input.displayName = "DSInput";
