import React from 'react';
import { Button } from './Button';
import { Input } from './Input';
import { CardRow } from './CardRow';
import { SectionHeader } from './SectionHeader';
import { EmptyState } from './EmptyState';
import { SPACING, RADIUS, TYPOGRAPHY, COLORS } from './theme';
import { User, Settings, FileText, ChevronRight, Inbox } from 'lucide-react';

export function DesignSystemPage({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen bg-[#fdfaf7] px-6 pb-24 pt-[calc(env(safe-area-inset-top)+2rem)]">
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="mr-4 text-[#6b4423]">
          <ChevronRight className="w-6 h-6 rotate-180" />
        </button>
        <h1 className={TYPOGRAPHY.h1}>Design System</h1>
      </div>

      <div className="space-y-8">
        {/* Colors */}
        <section>
          <SectionHeader title="Colors" />
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="h-20 rounded-[16px] bg-[#6b4423]"></div>
              <p className={TYPOGRAPHY.body}>Brand Brown</p>
              <p className={TYPOGRAPHY.helper}>#6b4423</p>
            </div>
            <div className="space-y-2">
              <div className="h-20 rounded-[16px] bg-[#fdfaf7] border border-gray-200"></div>
              <p className={TYPOGRAPHY.body}>Cream Background</p>
              <p className={TYPOGRAPHY.helper}>#fdfaf7</p>
            </div>
          </div>
        </section>

        {/* Typography */}
        <section>
          <SectionHeader title="Typography" />
          <div className="space-y-4 bg-white p-6 rounded-[16px] border border-[#f5ebe0]">
            <div>
              <p className="text-xs text-muted-foreground mb-1">H1 / 30-32px Bold</p>
              <h1 className={TYPOGRAPHY.h1}>The quick brown fox</h1>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">H2 / 22-24px Bold</p>
              <h2 className={TYPOGRAPHY.h2}>Jumps over the dog</h2>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Body / 15-16px</p>
              <p className={TYPOGRAPHY.body}>
                Consistency is key to a premium native feel.
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Helper / 13-14px</p>
              <p className={TYPOGRAPHY.helper}>
                Use this for secondary information.
              </p>
            </div>
          </div>
        </section>

        {/* Buttons */}
        <section>
          <SectionHeader title="Buttons" />
          <div className="space-y-4">
            <Button className="w-full" variant="primary">Primary Button</Button>
            <Button className="w-full" variant="secondary">Secondary Button</Button>
            <Button className="w-full" variant="tertiary">Tertiary Button</Button>
            <Button className="w-full" variant="primary" disabled>Disabled</Button>
            <Button className="w-full" variant="primary" isLoading>Loading</Button>
          </div>
        </section>

        {/* Inputs */}
        <section>
          <SectionHeader title="Inputs" />
          <div className="space-y-4">
            <Input label="Email Address" placeholder="hello@example.com" />
            <Input 
              label="With Helper" 
              placeholder="Enter value" 
              helperText="This helps the user understand."
            />
            <Input 
              label="With Error" 
              defaultValue="Invalid Value" 
              error="This field is required"
            />
            <Input 
              label="With Icon" 
              leftIcon={<User className="w-5 h-5" />} 
              placeholder="Username"
            />
          </div>
        </section>

        {/* Card Rows */}
        <section>
          <SectionHeader title="Card Rows" />
          <div className="space-y-3">
            <CardRow 
              title="Profile Settings" 
              subtitle="Manage your personal info" 
              icon={<User className="w-5 h-5" />}
              onClick={() => {}}
            />
            <CardRow 
              title="Notifications" 
              subtitle="Push and email alerts" 
              icon={<Settings className="w-5 h-5" />}
              rightElement={<div className="text-xs font-bold bg-red-100 text-red-600 px-2 py-1 rounded-full">New</div>}
            />
             <CardRow 
              title="Delete Account" 
              icon={<FileText className="w-5 h-5" />}
              destructive
              onClick={() => {}}
            />
          </div>
        </section>
        
        {/* Empty State */}
        <section>
            <SectionHeader title="Empty State" />
            <div className="bg-white rounded-[16px] border border-[#f5ebe0] overflow-hidden">
                <EmptyState 
                    icon={<Inbox className="w-8 h-8" />}
                    title="No Invoices Yet"
                    description="Create your first invoice to get started getting paid."
                    actionLabel="Create Invoice"
                    onAction={() => {}}
                />
            </div>
        </section>
      </div>
    </div>
  );
}
