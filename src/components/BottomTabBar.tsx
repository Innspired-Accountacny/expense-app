import { MessageCircle, FileText, Receipt, Settings } from 'lucide-react';

type Tab = 'chat' | 'invoices' | 'expenses' | 'settings';

interface BottomTabBarProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export function BottomTabBar({ activeTab, onTabChange }: BottomTabBarProps) {
  const tabs = [
    { id: 'chat' as Tab, icon: MessageCircle, label: 'Chat' },
    { id: 'invoices' as Tab, icon: FileText, label: 'Invoices' },
    { id: 'expenses' as Tab, icon: Receipt, label: 'Expenses' },
    { id: 'settings' as Tab, icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border safe-area-bottom z-10">
      <div className="max-w-md mx-auto flex items-center">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 flex flex-col items-center gap-2 py-4 transition-colors active:bg-secondary ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <Icon className={`w-8 h-8 ${isActive ? 'fill-primary' : ''}`} />
              <span className="text-base font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}