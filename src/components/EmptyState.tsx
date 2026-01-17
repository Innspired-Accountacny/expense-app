import { FileText, Ghost } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export function EmptyState({ title, description, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center h-full">
      <div className="w-20 h-20 bg-secondary/50 rounded-full flex items-center justify-center mb-6 animate-pulse">
        {icon || <Ghost className="w-10 h-10 text-muted-foreground/60" />}
      </div>
      <h3 className="font-bold text-xl text-foreground mb-2">{title}</h3>
      <p className="text-base text-muted-foreground max-w-xs leading-relaxed">{description}</p>
    </div>
  );
}
