import React from 'react';
import { cn } from './Button';
import { ChevronRight } from 'lucide-react';
import { Switch } from '../ui/switch'; // Reuse existing switch if available, or I'll make a simple one.

// I'll assume Switch exists in components/ui/switch based on file list.

interface CardRowProps {
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  onClick?: () => void;
  rightElement?: React.ReactNode; // For Toggle, Badge, or custom text
  showChevron?: boolean;
  className?: string;
  destructive?: boolean;
}

export function CardRow({ 
  icon, 
  title, 
  subtitle, 
  onClick, 
  rightElement, 
  showChevron = true, 
  className,
  destructive = false
}: CardRowProps) {
  
  // If rightElement is provided, we usually don't show chevron unless explicitly asked.
  // But let's follow the prop logic.
  
  const Component = onClick ? 'button' : 'div';
  
  return (
    <Component 
      onClick={onClick}
      className={cn(
        "w-full flex items-center p-4 bg-white rounded-[16px] border border-[#f5ebe0] shadow-sm active:scale-[0.99] transition-all text-left",
        onClick && "cursor-pointer hover:bg-[#faf9f8]",
        className
      )}
    >
      {icon && (
        <div className={cn("mr-4 text-[#6b4423]", destructive && "text-red-500")}>
          {icon}
        </div>
      )}
      
      <div className="flex-1 min-w-0">
        <h4 className={cn("text-[16px] font-medium text-[#2d2621] truncate", destructive && "text-red-600")}>
          {title}
        </h4>
        {subtitle && (
          <p className="text-[14px] text-[#8b7355] truncate mt-0.5">
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2 pl-4">
        {rightElement}
        {showChevron && !rightElement && (
          <ChevronRight className="w-5 h-5 text-[#d4c4b0]" />
        )}
      </div>
    </Component>
  );
}
