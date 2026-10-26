import React, { useState } from 'react';
import { 
  TabType, 
  Transaction, 
  SoundboxTelemetry, 
  PaymentScreenshotOcr, 
  UrgentLoanState, 
  MerchantOffer,
  UdhaarEntry,
  PaperKhataParsedResult
} from './types';
import { 
  INITIAL_TRANSACTIONS, 
  INITIAL_SOUNDBOX_TELEMETRY,
  OCR_PRESET_SUCCESS,
  OCR_PRESET_STUCK,
  INITIAL_URGENT_LOAN,
  INITIAL_MERCHANT_OFFERS,
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
import { VerifyRefundTab } from './components/tabs/VerifyRefundTab';
import { UrgentLoanTab } from './components/tabs/UrgentLoanTab';
import { MerchantOffersTab } from './components/tabs/MerchantOffersTab';
import { UdhaarLedgerTab } from './components/tabs/UdhaarLedgerTab';
import { TransactionsSettlementsTab } from './components/tabs/TransactionsSettlementsTab';
import { ProfileTab } from './components/tabs/ProfileTab';

export function App() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [todayCollection, setTodayCollection] = useState<number>(18450);
  const [pendingSettlementAmount, setPendingSettlementAmount] = useState<number>(12100);
  const [telemetry, setTelemetry] = useState<SoundboxTelemetry>(INITIAL_SOUNDBOX_TELEMETRY);

  const [currentOcr, setCurrentOcr] = useState<PaymentScreenshotOcr>(OCR_PRESET_SUCCESS);
  const [udhaarLedger, setUdhaarLedger] = useState<UdhaarEntry[]>(INITIAL_UDHAAR_LEDGER);
  const [recoveredToday, setRecoveredToday] = useState<number>(3450);
  const [loanState, setLoanState] = useState<UrgentLoanState>(INITIAL_URGENT_LOAN);
  const [offers, setOffers] = useState<MerchantOffer[]>(INITIAL_MERCHANT_OFFERS);
  const [customerSavedDeal, setCustomerSavedDeal] = useState<boolean>(false);

  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isSettlementModalOpen, setIsSettlementModalOpen] = useState(false);
  const [isSoundboxModalOpen, setIsSoundboxModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = 'toast_' + Date.now();
    setToasts(prev => [ { ...toast, id }, ...prev.slice(0, 3) ]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const handleSimulateSuccessScreenshot = () => {
    setCurrentOcr({ ...OCR_PRESET_SUCCESS });
    soundManager.playSuccessPop();
    addToast({
      type: 'payment',
      title: 'Screenshot Verified',
      description: 'Extracted UTR #984102938102 matched with backend webhook.',
      subtext: 'Google Pay • Rs. 450'
    });
  };

  const handleSimulateStuckScreenshot = () => {
    setCurrentOcr({ ...OCR_PRESET_STUCK, refundInitiated: false, repayLinkGenerated: false });
    soundManager.playAlertPing();
    addToast({
      type: 'review',
      title: 'Payment Delay Detected',
      description: 'Stuck in Customer Bank Network. Issue instant auto-refund to eliminate conflict.',
      subtext: 'PhonePe • Rs. 620'
    });
  };

  const handleTriggerAutoRefundFromTab = () => {
    setCurrentOcr(prev => ({
      ...prev,
      refundInitiated: true,
      repayLinkGenerated: true
    }));
    soundManager.playSuccessPop();
    addToast({
      type: 'payment',
      title: 'Auto-Refund Initiated',
      description: 'Customer bank instructed for reversal. Dynamic Re-Pay QR code presented.',
      subtext: 'NPCI Auto-Reversal Switch'
    });
  };

  const handleDisburseUrgentLoan = () => {
    setLoanState(prev => ({
      ...prev,
      isDisbursed: true,
      disbursedAt: 'Just now (120s)'
    }));
    soundManager.playSuccessPop();
    addToast({
      type: 'payment',
      title: 'Rs. 5,000 Emergency Loan Credited',
      description: 'Rs. 5,000 Credited instantly to HDFC Bank Account ****4102 via Paytm Payouts.',
      subtext: 'Auto-deducted from today\'s evening collections at 11:00 PM • Interest: Rs. 0'
    });
  };

  const handleAddOffer = (newOfferData: Omit<MerchantOffer, 'id' | 'todayRedemptions'>) => {
    const newOffer: MerchantOffer = {
      ...newOfferData,
      id: 'OFFER_' + Date.now(),
      todayRedemptions: 0
    };

    setOffers(prev => [newOffer, ...prev]);
    setCustomerSavedDeal(false);
    addToast({
      type: 'campaign',
      title: 'Offer Created & Live',
      description: `"${newOffer.title}" (Rs. ${newOffer.discountAmount} OFF on Min Rs. ${newOffer.minSpend}) is now flashing on customer checkout screens.`,
      subtext: 'Paytm Business Setu Marketing'
    });
  };

  const handleUpdateOffer = (updatedOffer: MerchantOffer) => {
    setOffers(prev => prev.map(o => o.id === updatedOffer.id ? updatedOffer : o));
    setCustomerSavedDeal(false);
    addToast({
      type: 'campaign',
      title: 'Offer Updated',
      description: `"${updatedOffer.title}" updated: Rs. ${updatedOffer.discountAmount} OFF on Min Rs. ${updatedOffer.minSpend}.`,
      subtext: 'Synchronized with Customer Terminals'
    });
  };

  const handleDeleteOffer = (id: string) => {
    const offerToDelete = offers.find(o => o.id === id);
    setOffers(prev => prev.filter(o => o.id !== id));
    setCustomerSavedDeal(false);
    addToast({
      type: 'review',
      title: 'Offer Deleted',
      description: `Offer "${offerToDelete?.title || id}" was deleted from live terminals.`,
      subtext: 'Removed from Customer Mobile Stream'
    });
  };

  const handleToggleOffer = (id: string) => {
    setOffers(prev => prev.map(o => {
      if (o.id === id) {
        const nextState = !o.isActive;
        addToast({
          type: 'campaign',
          title: nextState ? 'Offer Activated' : 'Offer Paused',
          description: `"${o.title}" is now ${nextState ? 'active' : 'paused'}.`,
          subtext: 'Status Synced'
        });
        return { ...o, isActive: nextState };
      }
      return o;
    }));
  };

  const handleApplyCustomerDeal = (offerId: string) => {
    const targetOffer = offers.find(o => o.id === offerId) || offers[0];
    setCustomerSavedDeal(true);

    if (targetOffer) {
      setOffers(prev => prev.map(o => o.id === targetOffer.id ? { ...o, todayRedemptions: o.todayRedemptions + 1 } : o));
    }

    soundManager.playSuccessPop();
    addToast({
      type: 'campaign',
      title: 'Customer Deal Activated',
      description: `Customer applied Rs. ${targetOffer?.discountAmount || 10} OFF on next Rs. ${targetOffer?.minSpend || 150} spend at Sharma General Store.`,
      subtext: 'Deal Saved in Customer Paytm Wallet'
    });
  };

  const handleAddUdhaarEntry = (newEntryData: Omit<UdhaarEntry, 'id' | 'daysOverdue' | 'isExcludedFromOffers' | 'status'>) => {
    let daysOverdue = 0;
    if (newEntryData.dueDate) {
      const due = new Date(newEntryData.dueDate);
      const today = new Date();
      const diffTime = today.getTime() - due.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      daysOverdue = diffDays > 0 ? diffDays : 0;
    }
    // Overdue threshold: borrowers overdue > 7 days forfeit store offer eligibility
    const isExcludedFromOffers = daysOverdue > 7;

    const newEntry: UdhaarEntry = {
      ...newEntryData,
      id: 'UDH_' + Date.now().toString().slice(-4),
      daysOverdue,
      status: 'Unpaid',
      isExcludedFromOffers,
      createdDate: 'Today'
    };

    setUdhaarLedger(prev => [newEntry, ...prev]);
    soundManager.playSuccessPop();
    addToast({
      type: 'payment',
      title: 'Udhaar Entry Created',
      description: `Rs. ${newEntry.amount.toLocaleString('en-IN')} recorded for ${newEntry.name}.`,
      subtext: isExcludedFromOffers ? 'Excluded from store offers (Overdue > 7 days)' : 'Bahi-Khata Digital Sync'
    });
  };

  const handleUpdateUdhaarEntry = (updatedEntry: UdhaarEntry) => {
    let daysOverdue = updatedEntry.daysOverdue;
    if (updatedEntry.dueDate) {
      const due = new Date(updatedEntry.dueDate);
      const today = new Date();
      const diffTime = today.getTime() - due.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      daysOverdue = diffDays > 0 ? diffDays : 0;
    }
    const isExcludedFromOffers = updatedEntry.status !== 'Paid' && daysOverdue > 7;

    const finalizedEntry: UdhaarEntry = {
      ...updatedEntry,
      daysOverdue,
      isExcludedFromOffers
    };

    setUdhaarLedger(prev => prev.map(e => e.id === finalizedEntry.id ? finalizedEntry : e));
    soundManager.playSuccessPop();
    addToast({
      type: 'campaign',
      title: 'Udhaar Entry Updated',
      description: `Record for ${finalizedEntry.name} updated: Rs. ${finalizedEntry.amount.toLocaleString('en-IN')}.`,
      subtext: 'Bahi-Khata Digital Sync'
    });
  };

  const handleDeleteUdhaarEntry = (id: string) => {
    const entryToDelete = udhaarLedger.find(e => e.id === id);
    setUdhaarLedger(prev => prev.filter(e => e.id !== id));
    soundManager.playAlertPing();
    addToast({
      type: 'review',
      title: 'Udhaar Entry Deleted',
      description: `Ledger entry for ${entryToDelete?.name || id} removed from records.`,
      subtext: 'Digital Bahi-Khata'
    });
  };

  const handleMarkPaidUdhaar = (id: string) => {
    const entry = udhaarLedger.find(e => e.id === id);
    if (!entry) return;
    const clearedAmount = entry.amount;

    setUdhaarLedger(prev => prev.map(e => {
      if (e.id === id) {
        return {
          ...e,
          amount: 0,
          status: 'Paid',
          isExcludedFromOffers: false,
          daysOverdue: 0,
          clearedAt: 'Today via Paytm QR'
        };
      }
      return e;
    }));

    setRecoveredToday(prev => prev + clearedAmount);
    soundManager.playSuccessPop();
    addToast({
      type: 'payment',
      title: 'Udhaar Cleared & Offers Restored',
      description: `Rs. ${clearedAmount.toLocaleString('en-IN')} received from ${entry.name}. Store coupon & cashback eligibility restored immediately.`,
      subtext: 'Paytm Dynamic QR Instant Recovery'
    });
  };

  const handleSendReminderUdhaar = (id: string) => {
    const entry = udhaarLedger.find(e => e.id === id);
    if (!entry) return;

    setUdhaarLedger(prev => prev.map(e => {
      if (e.id === id) {
        return {
          ...e,
          status: 'Reminder Sent',
          lastReminderSent: 'Just now'
        };
      }
      return e;
    }));

    soundManager.playSuccessPop();
    addToast({
      type: 'campaign',
      title: 'WhatsApp Reminder Dispatched',
      description: `Dynamic Paytm QR payment link sent to ${entry.name} (${entry.phone}).`,
      subtext: 'WhatsApp Cloud API Gateway'
    });
  };

  const handleImportPaperKhata = (scans: PaperKhataParsedResult[]) => {
    const importedEntries: UdhaarEntry[] = scans.map((scan, idx) => ({
      id: 'UDH_OCR_' + (Date.now() + idx).toString().slice(-4),
      name: scan.customerName,
      phone: scan.phone,
      amount: scan.amount,
      dueDate: '2026-10-31',
      daysOverdue: 0,
      status: 'Unpaid',
      isExcludedFromOffers: false,
      notes: scan.notes,
      createdDate: scan.date
    }));

    setUdhaarLedger(prev => [...importedEntries, ...prev]);
    soundManager.playSuccessPop();
    addToast({
      type: 'payment',
      title: 'Physical Register Imported',
      description: `Successfully converted ${scans.length} paper records into digital udhaar entries with OCR accuracy >95%.`,
      subtext: 'AI Vision OCR Engine'
    });
  };

  const handleSettlementComplete = (amountSettled: number) => {
    setPendingSettlementAmount(0);
    soundManager.playSuccessPop();
    addToast({
      type: 'payment',
      title: 'Bank Transfer Completed',
      description: `Rs. ${amountSettled.toLocaleString('en-IN')} transferred to HDFC Bank ****4102 via IMPS.`,
      subtext: '0% Convenience Fee'
    });
  };

  return (
    <div className="min-h-screen bg-[#F4F6F9] flex flex-col font-sans text-[#0F172A]">
      <ToastNotification toasts={toasts} onDismiss={dismissToast} />

      <Header
        telemetry={telemetry}
        onOpenQrModal={() => setIsQrModalOpen(true)}
        onOpenSoundboxModal={() => setIsSoundboxModalOpen(true)}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        pendingSettlementAmount={pendingSettlementAmount}
      />

      <div className="flex-1 flex w-full">
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          onOpenQrModal={() => setIsQrModalOpen(true)}
          urgentLoanClaimed={loanState.isDisbursed}
          offersCount={offers.length}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 md:pb-8 overflow-y-auto max-w-[1440px]">
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

          {activeTab === 'verify-refund' && (
            <VerifyRefundTab
              currentOcr={currentOcr}
              onUpdateOcr={setCurrentOcr}
              onSimulateSuccess={handleSimulateSuccessScreenshot}
              onSimulateStuck={handleSimulateStuckScreenshot}
              onTriggerAutoRefund={handleTriggerAutoRefundFromTab}
            />
          )}

          {activeTab === 'urgent-loan' && (
            <UrgentLoanTab
              loanState={loanState}
              onClaimLoan={handleDisburseUrgentLoan}
            />
          )}

          {activeTab === 'merchant-offers' && (
            <MerchantOffersTab
              offers={offers}
              onToggleOffer={handleToggleOffer}
              onAddOffer={handleAddOffer}
              onUpdateOffer={handleUpdateOffer}
              onDeleteOffer={handleDeleteOffer}
              onApplyDealOnCustomerApp={handleApplyCustomerDeal}
              customerSavedDeal={customerSavedDeal}
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
        </main>
      </div>

      <BottomNavigation
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        transactionsCount={transactions.length}
      />

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />

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
        onUpdateTelemetry={(patch) => setTelemetry(prev => ({ ...prev, ...patch }))}
      />

    </div>
  );
}

export default App;
