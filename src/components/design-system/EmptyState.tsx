import React from 'react';
import { cn } from './Button';
import { Button } from './Button';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({ icon, title, description, actionLabel, onAction, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-center", className)}>
      <div className="w-16 h-16 rounded-full bg-[#fef3e7] flex items-center justify-center mb-6 text-[#6b4423]">
        {icon}
      </div>
      
      <h3 className="text-[20px] font-bold text-[#2d2621] mb-2">
        {title}
      </h3>
      
      <p className="text-[15px] text-[#8b7355] max-w-[280px] leading-relaxed mb-8">
        {description}
      </p>
      
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="primary">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
