import React from 'react';
import { cn } from './Button';

interface SectionHeaderProps {
  title: string;
  action?: React.ReactNode;
  className?: string;
}

export function SectionHeader({ title, action, className }: SectionHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between py-2 mb-2", className)}>
      <h3 className="text-[13px] font-bold tracking-wider text-[#8b7355] uppercase pl-1">
        {title}
      </h3>
      {action && <div>{action}</div>}
    </div>
  );
}
