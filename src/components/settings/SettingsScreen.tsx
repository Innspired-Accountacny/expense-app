import { useState } from 'react';
import {
  Building2,
  Receipt,
  Bell,
  TrendingUp,
  Package,
  AlertCircle,
  ShieldCheck,
  Palette
} from 'lucide-react';
import { BusinessProfile, AppSettings, Invoice } from '../../types';
import { ExportPackScreen } from './ExportPackScreen';
import { VATTrackerScreen } from './VATTrackerScreen';
import { BusinessProfileEditScreen } from './BusinessProfileEditScreen';
import { CardRow } from '../design-system/CardRow';
import { SectionHeader } from '../design-system/SectionHeader';
import { Switch } from '../ui/switch';
import { DesignSystemPage } from '../design-system/DesignSystemPage';
import { TYPOGRAPHY, SPACING } from '../design-system/theme';

interface SettingsScreenProps {
  businessProfile: BusinessProfile;
  setBusinessProfile: (profile: BusinessProfile) => void;
  settings: AppSettings;
  setSettings: (settings: AppSettings) => void;
  invoices: Invoice[];
}

export function SettingsScreen({
  businessProfile,
  setBusinessProfile,
  settings,
  setSettings,
  invoices,
}: SettingsScreenProps) {
  const [activeScreen, setActiveScreen] = useState<'main' | 'export' | 'vat' | 'design' | 'profile'>('main');

  if (activeScreen === 'profile') {
    return (
      <BusinessProfileEditScreen
        businessProfile={businessProfile}
        setBusinessProfile={setBusinessProfile}
        onBack={() => setActiveScreen('main')}
      />
    );
  }

  if (activeScreen === 'export') {
    return (
      <ExportPackScreen
        settings={settings}
        setSettings={setSettings}
        onBack={() => setActiveScreen('main')}
      />
    );
  }

  if (activeScreen === 'vat') {
    return (
      <VATTrackerScreen
        invoices={invoices}
        onBack={() => setActiveScreen('main')}
      />
    );
  }

  if (activeScreen === 'design') {
    return (
      <DesignSystemPage
        onBack={() => setActiveScreen('main')}
      />
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#fdfaf7]">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-[#f5ebe0] px-6 pt-[calc(env(safe-area-inset-top)+2rem)] pb-4 sticky top-0 z-10">
        <h1 className={TYPOGRAPHY.h1}>Settings</h1>
      </div>

      {/* Settings List */}
      <div className="flex-1 overflow-y-auto pb-32 px-4 py-6 space-y-6">
        
        {/* Business Profile */}
        <section>
          <SectionHeader title="Business" />
          <div className="space-y-3">
            <CardRow
              title="Business Profile"
              subtitle={businessProfile.tradingName || businessProfile.legalName || "Manage details"}
              icon={<Building2 className="w-6 h-6" />}
              onClick={() => setActiveScreen('profile')}
            />
            
            {businessProfile.isVATRegistered && (
              <CardRow
                title="VAT Settings"
                subtitle={businessProfile.vatNumber}
                icon={<Receipt className="w-6 h-6" />}
                onClick={() => {}} // Navigate to VAT settings
              />
            )}
          </div>
        </section>

        {/* Automation & Reminders */}
        <section>
          <SectionHeader title="Automation" />
          <div className="space-y-3">
            <CardRow
              title="Weekly Digest"
              subtitle="Monday morning summary"
              icon={<Bell className="w-6 h-6" />}
              rightElement={
                <Switch
                  checked={settings.weeklyAdminReminder}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, weeklyAdminReminder: checked })
                  }
                />
              }
              showChevron={false}
            />

            <CardRow
              title="Auto-Chasing"
              subtitle="Remind overdue clients"
              icon={<AlertCircle className="w-6 h-6" />}
              rightElement={
                <Switch
                  checked={settings.automatedChasing}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, automatedChasing: checked })
                  }
                />
              }
              showChevron={false}
            />
            
            {settings.automatedChasing && (
              <div className="ml-2 text-[13px] font-medium text-[#8b7355] bg-[#fef3e7] rounded-[12px] p-3 border border-[#f5ebe0]">
                Will send gentle reminders 7 days after due date.
              </div>
            )}
          </div>
        </section>

        {/* Reporting */}
        <section>
          <SectionHeader title="Reporting" />
          <div className="space-y-3">
            {businessProfile.isVATRegistered && (
              <CardRow
                title="VAT Tracker"
                subtitle="Rolling 12-month view"
                icon={<TrendingUp className="w-6 h-6" />}
                onClick={() => setActiveScreen('vat')}
              />
            )}

            <CardRow
              title="Accountant Pack"
              subtitle="Export data for tax return"
              icon={<Package className="w-6 h-6" />}
              onClick={() => setActiveScreen('export')}
            />
          </div>
        </section>

         {/* Design System Link */}
         <section>
          <SectionHeader title="System" />
          <div className="space-y-3">
            <CardRow
              title="Design System"
              subtitle="View components & styles"
              icon={<Palette className="w-6 h-6" />}
              onClick={() => setActiveScreen('design')}
            />
          </div>
        </section>

        {/* App Info */}
        <div className="pt-4 pb-8 text-center">
          <div className="flex items-center justify-center gap-2 text-[#8b7355] mb-1">
             <ShieldCheck className="w-4 h-4" />
             <span className="text-[14px] font-medium">Secure & Local</span>
          </div>
          <div className="text-[12px] text-[#8b7355]/60">
            InvoiceChat v1.0.0 • London, UK
          </div>
        </div>
      </div>
    </div>
  );
}