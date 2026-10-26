import React, { useState, useEffect } from 'react';
import { 
  TabType, 
  Transaction, 
  SoundboxTelemetry, 
  PaymentScreenshotOcr, 
  UrgentLoanState, 
  UdhaarEntry,
  PaperKhataParsedResult
} from './types';
import { 
  INITIAL_TRANSACTIONS, 
  INITIAL_SOUNDBOX_TELEMETRY,
  OCR_PRESET_SUCCESS,
  OCR_PRESET_STUCK,
  OCR_PRESET_BLURRY,
  INITIAL_URGENT_LOAN,
  INITIAL_UDHAAR_LEDGER
} from './data/mockData';
import { soundManager } from './utils/audio';

import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { BottomNavigation } from './components/BottomNavigation';
import { ToastNotification, ToastMessage } from './components/ToastNotification';

import { StoreQrModal } from './components/modals/StoreQrModal';
import { InstantSettlementModal } from './components/modals/InstantSettlementModal';
import { SoundboxSettingsModal } from './components/modals/SoundboxSettingsModal';
import { ProfileModal } from './components/modals/ProfileModal';

import { OverviewTab } from './components/tabs/OverviewTab';
import { AskPriyaTab } from './components/tabs/AskPriyaTab';
import { VerifyRefundTab } from './components/tabs/VerifyRefundTab';
import { UrgentLoanTab } from './components/tabs/UrgentLoanTab';
import { UdhaarLedgerTab } from './components/tabs/UdhaarLedgerTab';
import { TransactionsSettlementsTab } from './components/tabs/TransactionsSettlementsTab';
import { ProfileTab } from './components/tabs/ProfileTab';
import { IPhone16ProMaxView } from './components/IPhone16ProMaxView';
import { Smartphone, Monitor, ChevronRight, X, Sparkles, Wifi, Battery } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // Dark Mode State with HTML root class synchronization
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('paytm_theme') === 'dark';
  });

  // Mobile Simulator / Device Toggle State
  const [isMobileSimulated, setIsMobileSimulated] = useState<boolean>(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('paytm_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('paytm_theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
    soundManager.playSuccessPop();
  };

  const toggleMobileSimulated = () => {
    setIsMobileSimulated(prev => !prev);
    soundManager.playSuccessPop();
  };

  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [todayCollection, setTodayCollection] = useState<number>(18450);
  const [pendingSettlementAmount, setPendingSettlementAmount] = useState<number>(12100);
  const [telemetry, setTelemetry] = useState<SoundboxTelemetry>(INITIAL_SOUNDBOX_TELEMETRY);

  const [currentOcr, setCurrentOcr] = useState<PaymentScreenshotOcr>(OCR_PRESET_SUCCESS);
  const [udhaarLedger, setUdhaarLedger] = useState<UdhaarEntry[]>(INITIAL_UDHAAR_LEDGER);
  const [loanState, setLoanState] = useState<UrgentLoanState>(INITIAL_URGENT_LOAN);

  const [recoveredToday, setRecoveredToday] = useState<number>(0);

  // Modals state
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isSettlementModalOpen, setIsSettlementModalOpen] = useState(false);
  const [isSoundboxModalOpen, setIsSoundboxModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Toast Notification queue
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newToast: ToastMessage = { ...toast, id };
    setToasts(prev => [newToast, ...prev].slice(0, 4));
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // OCR Verification Handlers
  const handleSimulateSuccessScreenshot = () => {
    setCurrentOcr(OCR_PRESET_SUCCESS);
    soundManager.playSuccessPop();
    addToast({
      type: 'payment',
      title: 'Payment Verified (₹450)',
      description: 'UTR matched with Paytm backend switch'
    });
  };

  const handleSimulateStuckScreenshot = () => {
    setCurrentOcr(OCR_PRESET_STUCK);
    soundManager.playAlertPing();
    addToast({
      type: 'campaign',
      title: 'Bank Network Delay Detected',
      description: 'Auto-refund and Re-Pay QR are ready'
    });
  };

  const handleSimulateBlurryScreenshot = () => {
    setCurrentOcr(OCR_PRESET_BLURRY);
    soundManager.playAlertPing();
    addToast({
      type: 'review',
      title: 'Blurry / High Glare Detected',
      description: 'OCR confidence 32%. Please input 12-digit UTR manually.'
    });
  };

  const handleTriggerAutoRefundFromTab = () => {
    setCurrentOcr(prev => ({
      ...prev,
      status: 'refunded',
      refundInitiated: true,
      repayLinkGenerated: true,
      repayQrId: `REPAY_${Date.now()}`,
      verificationMessage: 'Auto-refund dispatched to customer bank. Fresh Re-Pay QR generated for seamless checkout.'
    }));
    soundManager.playSuccessPop();
    addToast({
      type: 'payment',
      title: 'Refund & Re-Pay QR Active',
      description: 'Customer can re-scan and pay fresh QR'
    });
  };

  // Urgent Loan Disbursement
  const handleDisburseUrgentLoan = () => {
    soundManager.playSuccessPop();
    setLoanState(prev => ({
      ...prev,
      isDisbursed: true,
      disbursedAt: 'Just now (Instant IMPS)',
      utrPayout: `PAYOUT_IMPS_${Date.now()}`
    }));
    addToast({
      type: 'payment',
      title: 'Emergency Working Capital Disbursed (₹5,000)',
      description: 'Credited to HDFC Bank ****4102. Auto-deducts 11:00 PM.'
    });
  };

  // Udhaar Handlers
  const handleAddUdhaarEntry = (newEntryData: Omit<UdhaarEntry, 'id' | 'daysOverdue' | 'isExcludedFromOffers' | 'status'>) => {
    soundManager.playSuccessPop();
    const today = new Date();
    const due = new Date(newEntryData.dueDate);
    const diffTime = today.getTime() - due.getTime();
    const daysOverdue = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
    const isExcludedFromOffers = daysOverdue > 7;

    const newEntry: UdhaarEntry = {
      ...newEntryData,
      id: `UDH_${Date.now()}`,
      daysOverdue,
      status: 'Unpaid',
      isExcludedFromOffers,
      createdDate: 'Today'
    };

    setUdhaarLedger(prev => [newEntry, ...prev]);
    addToast({
      type: 'payment',
      title: `Udhaar Recorded: ₹${newEntry.amount} for ${newEntry.name}`,
      description: 'Bahi-Khata ledger synced'
    });
  };

  const handleUpdateUdhaarEntry = (updatedEntry: UdhaarEntry) => {
    soundManager.playSuccessPop();
    const today = new Date();
    const due = new Date(updatedEntry.dueDate);
    const diffTime = today.getTime() - due.getTime();
    const daysOverdue = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
    const isExcludedFromOffers = updatedEntry.status !== 'Paid' && daysOverdue > 7;

    const finalUpdated: UdhaarEntry = {
      ...updatedEntry,
      daysOverdue,
      isExcludedFromOffers
    };

    setUdhaarLedger(prev => prev.map(entry => entry.id === finalUpdated.id ? finalUpdated : entry));
    addToast({
      type: 'payment',
      title: `Udhaar Record Updated: ${finalUpdated.name}`,
      description: `Balance: ₹${finalUpdated.amount}`
    });
  };

  const handleDeleteUdhaarEntry = (id: string) => {
    const entry = udhaarLedger.find(e => e.id === id);
    soundManager.playAlertPing();
    setUdhaarLedger(prev => prev.filter(e => e.id !== id));
    addToast({
      type: 'payment',
      title: 'Udhaar Entry Removed',
      description: entry ? `${entry.name} ledger removed` : 'Record deleted'
    });
  };

  const handleMarkPaidUdhaar = (id: string) => {
    soundManager.playSuccessPop();
    let clearedAmount = 0;
    setUdhaarLedger(prev => prev.map(item => {
      if (item.id === id) {
        clearedAmount = item.amount;
        return {
          ...item,
          status: 'Paid',
          isExcludedFromOffers: false,
          amount: 0,
          daysOverdue: 0,
          clearedAt: 'Just now via Paytm QR'
        };
      }
      return item;
    }));

    if (clearedAmount > 0) {
      setRecoveredToday(prev => prev + clearedAmount);
      setTodayCollection(prev => prev + clearedAmount);
    }

    addToast({
      type: 'payment',
      title: 'Udhaar Cleared via Paytm QR',
      description: `₹${clearedAmount} recovered and credited to wallet.`
    });
  };

  const handleSendReminderUdhaar = (id: string) => {
    soundManager.playSuccessPop();
    setUdhaarLedger(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status: 'Reminder Sent',
          lastReminderSent: 'Just now (WhatsApp)'
        };
      }
      return item;
    }));

    addToast({
      type: 'campaign',
      title: 'WhatsApp Reminder Dispatched',
      description: 'Includes dynamic ₹20 settlement cashback incentive'
    });
  };

  const handleImportPaperKhata = (results: PaperKhataParsedResult[]) => {
    soundManager.playSuccessPop();
    const newEntries: UdhaarEntry[] = results.map(item => ({
      id: `UDH_OCR_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      name: item.customerName,
      phone: item.phone,
      amount: item.amount,
      dueDate: item.date,
      daysOverdue: 0,
      status: 'Unpaid',
      isExcludedFromOffers: false,
      notes: item.notes,
      createdDate: 'Imported via Paper OCR'
    }));

    setUdhaarLedger(prev => [...newEntries, ...prev]);
    addToast({
      type: 'payment',
      title: `${results.length} Paper Khata Entries Digitized`,
      description: 'Bahi-Khata ledger updated with >96% confidence'
    });
  };

  // Instant Settlement Completion
  const handleSettlementComplete = (settledAmount: number) => {
    soundManager.playSuccessPop();
    setPendingSettlementAmount(0);
    addToast({
      type: 'payment',
      title: `Instant Settlement Complete: ₹${settledAmount.toLocaleString('en-IN')}`,
      description: 'Credited directly to HDFC Bank A/C ****4102 via IMPS.'
    });
  };

  // Main application content
  const renderMainContent = () => (
    <>
      {activeTab === 'overview' && (
        <OverviewTab
          todayCollection={todayCollection}
          transactionsCount={transactions.length}
          pendingSettlementAmount={pendingSettlementAmount}
          telemetry={telemetry}
          recentTransactions={transactions}
          onOpenQrModal={() => setIsQrModalOpen(true)}
          onOpenSettlementModal={() => setIsSettlementModalOpen(true)}
          onOpenSoundboxModal={() => setIsSoundboxModalOpen(true)}
          onNavigateToTab={setActiveTab}
          urgentLoanClaimed={loanState.isDisbursed}
        />
      )}

      {activeTab === 'ask-priya' && (
        <AskPriyaTab
          todayCollection={todayCollection}
          transactionsCount={transactions.length}
          pendingSettlementAmount={pendingSettlementAmount}
          telemetry={telemetry}
          transactions={transactions}
          udhaarLedger={udhaarLedger}
          offers={[]}
          onNavigateToTab={setActiveTab}
        />
      )}

      {activeTab === 'verify-refund' && (
        <VerifyRefundTab
          currentOcr={currentOcr}
          onUpdateOcr={setCurrentOcr}
          onSimulateSuccess={handleSimulateSuccessScreenshot}
          onSimulateStuck={handleSimulateStuckScreenshot}
          onTriggerAutoRefund={handleTriggerAutoRefundFromTab}
        />
      )}

      {activeTab === 'udhaar-ledger' && (
        <UdhaarLedgerTab
          ledger={udhaarLedger}
          recoveredToday={recoveredToday}
          onAddEntry={handleAddUdhaarEntry}
          onUpdateEntry={handleUpdateUdhaarEntry}
          onDeleteEntry={handleDeleteUdhaarEntry}
          onMarkPaid={handleMarkPaidUdhaar}
          onSendReminder={handleSendReminderUdhaar}
          onImportPaperKhata={handleImportPaperKhata}
        />
      )}

      {activeTab === 'urgent-loan' && (
        <UrgentLoanTab
          loanState={loanState}
          onClaimLoan={handleDisburseUrgentLoan}
        />
      )}

      {activeTab === 'transactions-settlements' && (
        <TransactionsSettlementsTab
          transactions={transactions}
          pendingSettlementAmount={pendingSettlementAmount}
          onOpenSettlementModal={() => setIsSettlementModalOpen(true)}
          onOpenQrModal={() => setIsQrModalOpen(true)}
        />
      )}

      {activeTab === 'profile' && (
        <ProfileTab />
      )}
    </>
  );

  return (
    <div className={`min-h-screen ${isMobileSimulated ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 py-4 px-3 flex flex-col items-center justify-center' : 'bg-[#F4F6F9] dark:bg-[#0B0F19]'} text-[#0F172A] dark:text-[#F8FAFC] font-sans transition-colors duration-200`}>
      
      {/* Toast Notification Stack */}
      <ToastNotification toasts={toasts} onDismiss={dismissToast} />

      {/* When Mobile Simulation Mode is ACTIVE */}
      {isMobileSimulated ? (
        <IPhone16ProMaxView
          todayCollection={todayCollection}
          transactionsCount={transactions.length}
          pendingSettlementAmount={pendingSettlementAmount}
          telemetry={telemetry}
          transactions={transactions}
          udhaarLedger={udhaarLedger}
          loanState={loanState}
          currentOcr={currentOcr}
          recoveredToday={recoveredToday}
          darkMode={darkMode}
          onToggleDarkMode={toggleDarkMode}
          onExitPhoneView={toggleMobileSimulated}
          onOpenQrModal={() => setIsQrModalOpen(true)}
          onOpenSettlementModal={() => setIsSettlementModalOpen(true)}
          onClaimLoan={handleDisburseUrgentLoan}
          onSimulateSuccessOcr={handleSimulateSuccessScreenshot}
          onSimulateStuckOcr={handleSimulateStuckScreenshot}
          onSimulateBlurryOcr={handleSimulateBlurryScreenshot}
          onUpdateOcr={setCurrentOcr}
          onTriggerAutoRefund={handleTriggerAutoRefundFromTab}
          onMarkPaidUdhaar={handleMarkPaidUdhaar}
          onSendReminderUdhaar={handleSendReminderUdhaar}
        />
      ) : (
        /* Regular Responsive Layout (Desktop / Tablet / Physical Phone) */
        <div className="flex-1 flex flex-col w-full">
          {/* Top Header */}
          <Header 
            telemetry={telemetry}
            onOpenQrModal={() => setIsQrModalOpen(true)}
            onOpenSoundboxModal={() => setIsSoundboxModalOpen(true)}
            onOpenProfileModal={() => setIsProfileModalOpen(true)}
            pendingSettlementAmount={pendingSettlementAmount}
            darkMode={darkMode}
            onToggleDarkMode={toggleDarkMode}
            isMobileSimulated={isMobileSimulated}
            onToggleMobileSimulated={toggleMobileSimulated}
            onNavigateToTab={setActiveTab}
          />

          {/* Main Layout with Sidebar */}
          <div className="flex-1 flex max-w-[1720px] w-full mx-auto">
            <Sidebar 
              activeTab={activeTab}
              onSelectTab={setActiveTab}
              onOpenQrModal={() => setIsQrModalOpen(true)}
              urgentLoanClaimed={loanState.isDisbursed}
            />

            {/* Main Content Pane */}
            <main className="flex-1 p-3 sm:p-5 md:p-6 overflow-y-auto pb-24 md:pb-8">
              {renderMainContent()}
            </main>
          </div>

          {/* Bottom Bar for physical mobile screens */}
          <BottomNavigation 
            activeTab={activeTab}
            onSelectTab={setActiveTab}
            transactionsCount={transactions.length}
          />
        </div>
      )}

      {/* Global Interactive Modals */}
      <StoreQrModal 
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
      />

      <InstantSettlementModal
        isOpen={isSettlementModalOpen}
        onClose={() => setIsSettlementModalOpen(false)}
        amount={pendingSettlementAmount}
        onSettlementComplete={handleSettlementComplete}
      />

      <SoundboxSettingsModal
        isOpen={isSoundboxModalOpen}
        onClose={() => setIsSoundboxModalOpen(false)}
        telemetry={telemetry}
        onUpdateTelemetry={(partial) => setTelemetry(prev => ({ ...prev, ...partial }))}
      />

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />

    </div>
  );
}

export default App;





