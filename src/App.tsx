import { useState, useEffect } from "react";
import { WelcomeScreen } from "./components/onboarding/WelcomeScreen";
import { BusinessDetailsForm } from "./components/onboarding/BusinessDetailsForm";
import { VATStatusForm } from "./components/onboarding/VATStatusForm";
import { VATPricingModeForm } from "./components/onboarding/VATPricingModeForm";
import { InvoiceStyleForm } from "./components/onboarding/InvoiceStyleForm";
import { LogoUploadForm } from "./components/onboarding/LogoUploadForm";
import { InvoicePreviewForm } from "./components/onboarding/InvoicePreviewForm";
import { FinishScreen } from "./components/onboarding/FinishScreen";
import { BottomTabBar } from "./components/BottomTabBar";
import { ChatScreen } from "./components/chat/ChatScreen";
import { InvoicesScreen } from "./components/invoices/InvoicesScreen";
import { ExpensesScreen } from "./components/expenses/ExpensesScreen";
import { SettingsScreen } from "./components/settings/SettingsScreen";
import {
  BusinessProfile,
  Invoice,
  Expense,
  AppSettings,
  InvoiceNumberPool,
} from "./types";

type Tab = "chat" | "invoices" | "expenses" | "settings";

export default function App() {
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [onboardingComplete, setOnboardingComplete] =
    useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("chat");

  const [businessProfile, setBusinessProfile] =
    useState<BusinessProfile>({
      legalName: "",
      address: "",
      email: "",
      phone: "",
      isVATRegistered: false,
      invoiceStyle: "modern",
      paymentTerms: "Due within 30 days",
    });

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [settings, setSettings] = useState<AppSettings>({
    weeklyAdminReminder: false,
    automatedChasing: false,
  });

  const [invoiceNumberPool, setInvoiceNumberPool] =
    useState<InvoiceNumberPool>({
      nextNumber: 1,
      releasedNumbers: [],
      lockedNumbers: [],
    });

  // Check if onboarding was completed previously
  useEffect(() => {
    const savedProfile = localStorage.getItem(
      "businessProfile",
    );
    const savedOnboardingComplete = localStorage.getItem(
      "onboardingComplete",
    );

    if (savedProfile && savedOnboardingComplete === "true") {
      setBusinessProfile(JSON.parse(savedProfile));
      setOnboardingComplete(true);
    }

    const savedInvoices = localStorage.getItem("invoices");
    if (savedInvoices) {
      setInvoices(JSON.parse(savedInvoices));
    }

    const savedExpenses = localStorage.getItem("expenses");
    if (savedExpenses) {
      setExpenses(JSON.parse(savedExpenses));
    }

    const savedSettings = localStorage.getItem("settings");
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }

    const savedPool = localStorage.getItem("invoiceNumberPool");
    if (savedPool) {
      setInvoiceNumberPool(JSON.parse(savedPool));
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    if (onboardingComplete) {
      localStorage.setItem(
        "businessProfile",
        JSON.stringify(businessProfile),
      );
      localStorage.setItem("onboardingComplete", "true");
    }
  }, [businessProfile, onboardingComplete]);

  useEffect(() => {
    localStorage.setItem("invoices", JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem("settings", JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(
      "invoiceNumberPool",
      JSON.stringify(invoiceNumberPool),
    );
  }, [invoiceNumberPool]);

  const handleFinishOnboarding = () => {
    setOnboardingComplete(true);
    setActiveTab("chat");
  };

  // Onboarding screens
  if (!onboardingComplete) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <div className="flex-1">
          {onboardingStep === 0 && (
            <WelcomeScreen
              onContinue={() => setOnboardingStep(1)}
            />
          )}
          {onboardingStep === 1 && (
            <BusinessDetailsForm
              profile={businessProfile}
              onUpdate={setBusinessProfile}
              onNext={() => setOnboardingStep(2)}
              onBack={() => setOnboardingStep(0)}
            />
          )}
          {onboardingStep === 2 && (
            <VATStatusForm
              profile={businessProfile}
              onUpdate={setBusinessProfile}
              onNext={() => {
                if (businessProfile.isVATRegistered) {
                  setOnboardingStep(3);
                } else {
                  setOnboardingStep(4);
                }
              }}
              onBack={() => setOnboardingStep(1)}
            />
          )}
          {onboardingStep === 3 && (
            <VATPricingModeForm
              profile={businessProfile}
              onUpdate={setBusinessProfile}
              onNext={() => setOnboardingStep(4)}
              onBack={() => setOnboardingStep(2)}
            />
          )}
          {onboardingStep === 4 && (
            <InvoiceStyleForm
              profile={businessProfile}
              onUpdate={setBusinessProfile}
              onNext={() => setOnboardingStep(5)}
              onBack={() => {
                if (businessProfile.isVATRegistered) {
                  setOnboardingStep(3);
                } else {
                  setOnboardingStep(2);
                }
              }}
            />
          )}
          {onboardingStep === 5 && (
            <LogoUploadForm
              profile={businessProfile}
              onUpdate={setBusinessProfile}
              onNext={() => setOnboardingStep(6)}
              onBack={() => setOnboardingStep(4)}
            />
          )}
          {onboardingStep === 6 && (
            <InvoicePreviewForm
              profile={businessProfile}
              onNext={() => setOnboardingStep(7)}
              onBack={() => setOnboardingStep(5)}
            />
          )}
          {onboardingStep === 7 && (
            <FinishScreen onFinish={handleFinishOnboarding} />
          )}
        </div>
      </div>
    );
  }

  // Main app
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto bg-white min-h-screen">
        {activeTab === "chat" && (
          <ChatScreen
            businessProfile={businessProfile}
            setBusinessProfile={setBusinessProfile}
            invoices={invoices}
            setInvoices={setInvoices}
            invoiceNumberPool={invoiceNumberPool}
            setInvoiceNumberPool={setInvoiceNumberPool}
            onGoToSettings={() => setActiveTab("settings")}
          />
        )}
        {activeTab === "invoices" && (
          <InvoicesScreen
            businessProfile={businessProfile}
            invoices={invoices}
            setInvoices={setInvoices}
            invoiceNumberPool={invoiceNumberPool}
            setInvoiceNumberPool={setInvoiceNumberPool}
            onGoToSettings={() => setActiveTab("settings")}
          />
        )}
        {activeTab === "expenses" && (
          <ExpensesScreen
            expenses={expenses}
            setExpenses={setExpenses}
          />
        )}
        {activeTab === "settings" && (
          <SettingsScreen
            businessProfile={businessProfile}
            setBusinessProfile={setBusinessProfile}
            settings={settings}
            setSettings={setSettings}
            invoices={invoices}
          />
        )}

        <BottomTabBar
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>
    </div>
  );
}
