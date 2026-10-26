import React, { useState } from 'react';
import { 
  Wifi, 
  Battery, 
  Store, 
  CheckCircle2, 
  ShieldCheck, 
  BookOpen, 
  Zap, 
  Receipt, 
  Bot, 
  Send, 
  Clock, 
  TrendingUp, 
  ArrowUpRight, 
  ChevronRight, 
  QrCode, 
  Volume2, 
  VolumeX, 
  Moon, 
  Sun, 
  Monitor,
  Camera,
  Upload,
  User,
  ArrowRight,
  Plus,
  MessageSquare,
  Edit2,
  FileText,
  Sliders,
  RefreshCw,
  Search,
  Check,
  X
} from 'lucide-react';
import { 
  Transaction, 
  SoundboxTelemetry, 
  PaymentScreenshotOcr, 
  UrgentLoanState, 
  UdhaarEntry,
  PaperKhataParsedResult
} from '../types';
import { HOURLY_DATA, OCR_PRESET_SUCCESS, OCR_PRESET_STUCK, OCR_PRESET_BLURRY, PAPER_KHATA_PRESET } from '../data/mockData';
import { soundManager } from '../utils/audio';

interface IPhone16ProMaxViewProps {
  todayCollection: number;
  transactionsCount: number;
  pendingSettlementAmount: number;
  telemetry: SoundboxTelemetry;
  transactions: Transaction[];
  udhaarLedger: UdhaarEntry[];
  loanState: UrgentLoanState;
  currentOcr: PaymentScreenshotOcr;
  recoveredToday: number;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onExitPhoneView: () => void;
  onOpenQrModal: () => void;
  onOpenSettlementModal: () => void;
  onClaimLoan: () => void;
  onSimulateSuccessOcr: () => void;
  onSimulateStuckOcr: () => void;
  onSimulateBlurryOcr?: () => void;
  onUpdateOcr?: (ocr: PaymentScreenshotOcr) => void;
  onTriggerAutoRefund: () => void;
  onAddUdhaarEntry?: (newEntry: Omit<UdhaarEntry, 'id' | 'daysOverdue' | 'isExcludedFromOffers' | 'status'>) => void;
  onUpdateUdhaarEntry?: (updated: UdhaarEntry) => void;
  onMarkPaidUdhaar: (id: string) => void;
  onSendReminderUdhaar: (id: string) => void;
  onImportPaperKhata?: (results: PaperKhataParsedResult[]) => void;
}

export const IPhone16ProMaxView: React.FC<IPhone16ProMaxViewProps> = ({
  todayCollection,
  transactionsCount,
  pendingSettlementAmount,
  telemetry,
  transactions,
  udhaarLedger,
  loanState,
  currentOcr,
  recoveredToday,
  darkMode,
  onToggleDarkMode,
  onExitPhoneView,
  onOpenQrModal,
  onOpenSettlementModal,
  onClaimLoan,
  onSimulateSuccessOcr,
  onSimulateStuckOcr,
  onSimulateBlurryOcr,
  onUpdateOcr,
  onTriggerAutoRefund,
  onAddUdhaarEntry,
  onUpdateUdhaarEntry,
  onMarkPaidUdhaar,
  onSendReminderUdhaar,
  onImportPaperKhata
}) => {
  // Mobile dedicated tab state
  const [mobileTab, setMobileTab] = useState<'home' | 'priya' | 'verify' | 'khata' | 'loan'>('home');
  
  // Ask Priya in-phone chat state
  const [priyaChat, setPriyaChat] = useState<{ sender: 'priya' | 'user'; text: string; hindi?: string; time: string }[]>([
    {
      sender: 'priya',
      text: "Namaste! I am Priya, your live Kirana business copilot. Ask me anything about your rush hours, shop timings, or pending udhaar.",
      hindi: "नमस्ते! मैं प्रिया हूँ, आपकी दुकान की एडवाइजर। अपनी दुकान के व्यस्त समय या उधार के बारे में कुछ भी पूछें।",
      time: "Just now"
    }
  ]);
  const [priyaInput, setPriyaInput] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Vision Shield (Verify) mobile state
  const [isScanningScreenshot, setIsScanningScreenshot] = useState(false);
  const [selectedPresetType, setSelectedPresetType] = useState<'success' | 'stuck' | 'blurry'>('success');

  // Vision shield manual fallback state
  const [manualUtrInput, setManualUtrInput] = useState('');
  const [manualUtrError, setManualUtrError] = useState('');

  // Khata mobile state (Add / Edit / Scan Paper modal)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<UdhaarEntry | null>(null);
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('+91 98110 ');
  const [formAmount, setFormAmount] = useState('');
  const [formDueDate, setFormDueDate] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [isScanningPaper, setIsScanningPaper] = useState(false);
  const [khataSearch, setKhataSearch] = useState('');

  // Loan mobile state (Statement Fetching & Slider Calculator)
  const [isStatementFetched, setIsStatementFetched] = useState(true);
  const [isFetchingStatement, setIsFetchingStatement] = useState(false);
  const [simulatedSales, setSimulatedSales] = useState<number>(14500);

  const totalUdhaarDue = udhaarLedger.filter(u => u.status !== 'Paid').reduce((acc, u) => acc + u.amount, 0);

  // Dynamic loan calculation matching desktop (35% of daily sales)
  const eligibleLoanFromSales = Math.max(1000, Math.round((simulatedSales * 0.35) / 500) * 500);

  const handleSendPriya = (textToSend?: string) => {
    const q = (textToSend || priyaInput).trim();
    if (!q) return;

    soundManager.playSuccessPop();
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    setPriyaChat(prev => [...prev, { sender: 'user', text: q, time: nowTime }]);
    if (!textToSend) setPriyaInput('');

    setTimeout(() => {
      let ans = "";
      let hindiAns = "";
      const lower = q.toLowerCase();

      if (lower.includes('peak') || lower.includes('rush') || lower.includes('busy')) {
        ans = "Your highest peak rush is 06:00 PM – 08:30 PM. Peak single hour is 07:00 PM (₹5,200 across 42 transactions). Morning peak is 09:00 AM (₹3,850).";
        hindiAns = "आपकी दुकान की सबसे ज्यादा बिक्री शाम 6:00 PM से रात 8:30 PM के बीच होती है। 7:00 PM पर ₹5,200 की सर्वाधिक कमाई हुई।";
      } else if (lower.includes('open') || lower.includes('close') || lower.includes('time') || lower.includes('band')) {
        ans = "Recommended opening: 07:30 AM. CRITICAL: NEVER shut the shop between 05:45 PM and 09:15 PM! This 3.5-hr window drives 62% (₹11,450) of gross sales.";
        hindiAns = "दुकान 7:30 AM तक खोल लें। शाम 5:45 PM से 9:15 PM के बीच काउंटर बिल्कुल बंद न करें (दिन की 62% कमाई इसी समय होती है)।";
      } else if (lower.includes('udhaar') || lower.includes('khata') || lower.includes('debt')) {
        ans = `Total pending Udhaar is ₹${totalUdhaarDue.toLocaleString('en-IN')}. Rajesh Verma (₹2,100, 24 days overdue) should be sent an immediate WhatsApp reminder.`;
        hindiAns = `कुल ₹${totalUdhaarDue.toLocaleString('en-IN')} का उधार बाकी है। सबसे पहले राजेश वर्मा (₹2,100) को WhatsApp QR भेजें।`;
      } else {
        ans = `Sharma General Store is active! Today: ₹${todayCollection.toLocaleString('en-IN')} across ${transactionsCount} txns. Auto-settlement of ₹${pendingSettlementAmount.toLocaleString('en-IN')} at 11:00 PM.`;
        hindiAns = `आज की कुल बिक्री ₹${todayCollection.toLocaleString('en-IN')} है। रात 11:00 बजे ₹${pendingSettlementAmount.toLocaleString('en-IN')} बैंक में सेटल होंगे।`;
      }

      setPriyaChat(prev => [...prev, { sender: 'priya', text: ans, hindi: hindiAns, time: nowTime }]);
      soundManager.playAlertPing();
    }, 500);
  };

  const handleSpeak = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const utter = new SpeechSynthesisUtterance(text);
    utter.pitch = 1.35;
    utter.rate = 0.95;
    utter.lang = 'hi-IN';
    utter.onend = () => setIsSpeaking(false);
    utter.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utter);
  };

  const handleTriggerUploadScan = (type: 'success' | 'stuck' | 'blurry') => {
    setIsScanningScreenshot(true);
    setSelectedPresetType(type);
    soundManager.playSuccessPop();
    setTimeout(() => {
      setIsScanningScreenshot(false);
      if (type === 'success') onSimulateSuccessOcr();
      else if (type === 'stuck') onSimulateStuckOcr();
      else if (type === 'blurry' && onSimulateBlurryOcr) onSimulateBlurryOcr();
    }, 700);
  };

  const handleManualUtrSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanUtr = manualUtrInput.trim();
    if (!/^\d{12}$/.test(cleanUtr)) {
      setManualUtrError('UTR must be 12 numeric digits');
      return;
    }
    setManualUtrError('');
    soundManager.playSuccessPop();
    if (onUpdateOcr) {
      onUpdateOcr({
        id: 'OCR_MANUAL_' + Date.now(),
        screenshotType: 'success',
        utr: cleanUtr,
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        amount: 450,
        customerName: 'Verified via NPCI Switch',
        customerPhone: '+91 98101 22910',
        app: 'Paytm UPI',
        status: 'verified',
        verificationMessage: `Manual UTR #${cleanUtr} confirmed directly with NPCI settlement switch. Payment authenticated.`,
        confidenceScore: 100,
        refundInitiated: false,
        repayLinkGenerated: false
      });
    }
    setManualUtrInput('');
  };

  const handleOpenAddKhata = () => {
    setEditingEntry(null);
    setFormName('');
    setFormPhone('+91 98110 ');
    setFormAmount('');
    const d = new Date();
    d.setDate(d.getDate() + 7);
    setFormDueDate(d.toISOString().split('T')[0]);
    setFormNotes('');
    setIsAddModalOpen(true);
  };

  const handleOpenEditKhata = (entry: UdhaarEntry) => {
    setEditingEntry(entry);
    setFormName(entry.name);
    setFormPhone(entry.phone);
    setFormAmount(entry.amount.toString());
    setFormDueDate(entry.dueDate);
    setFormNotes(entry.notes);
    setIsAddModalOpen(true);
  };

  const handleSaveKhata = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formAmount) return;

    if (editingEntry && onUpdateUdhaarEntry) {
      onUpdateUdhaarEntry({
        ...editingEntry,
        name: formName.trim(),
        phone: formPhone.trim(),
        amount: Number(formAmount),
        dueDate: formDueDate || editingEntry.dueDate,
        notes: formNotes.trim()
      });
    } else if (onAddUdhaarEntry) {
      onAddUdhaarEntry({
        name: formName.trim(),
        phone: formPhone.trim(),
        amount: Number(formAmount),
        dueDate: formDueDate || new Date().toISOString().split('T')[0],
        notes: formNotes.trim()
      });
    }
    setIsAddModalOpen(false);
    soundManager.playSuccessPop();
  };

  const handleScanPaperRegister = () => {
    setIsScanningPaper(true);
    soundManager.playSuccessPop();
    setTimeout(() => {
      setIsScanningPaper(false);
      if (onImportPaperKhata) {
        onImportPaperKhata(PAPER_KHATA_PRESET);
      }
    }, 900);
  };

  const handleFetchStatement = () => {
    setIsFetchingStatement(true);
    soundManager.playSuccessPop();
    setTimeout(() => {
      setIsFetchingStatement(false);
      setIsStatementFetched(true);
    }, 800);
  };

  return (
    <div className="w-full flex flex-col items-center justify-center p-2 sm:p-6 animate-in fade-in duration-200">
      
      {/* Floating Exit / Switcher Bar above iPhone */}
      <div className="w-full max-w-[440px] mb-3 flex items-center justify-between px-4 py-2 rounded-2xl bg-slate-900/90 text-white backdrop-blur-md border border-slate-700 shadow-xl">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs font-black tracking-tight text-[#00BAF2]">iPhone 16 Pro Max Preview</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleDarkMode}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition-colors"
            title="Toggle theme"
          >
            {darkMode ? <Sun size={14} className="text-amber-300" /> : <Moon size={14} className="text-sky-300" />}
          </button>
          <button
            onClick={onExitPhoneView}
            className="flex items-center gap-1.5 bg-[#00BAF2] hover:bg-white hover:text-[#002970] text-[#002970] text-xs font-black px-3 py-1.5 rounded-xl transition-all shadow-sm"
          >
            <Monitor size={13} />
            <span>Switch to Desktop</span>
          </button>
        </div>
      </div>

      {/* iPhone 16 Pro Max Physical Chasis (430px x 932px native viewport ratio) */}
      <div className="w-full max-w-[430px] h-[910px] bg-[#F4F6F9] dark:bg-[#0B0F19] rounded-[52px] shadow-[0_25px_70px_-15px_rgba(0,0,0,0.85)] border-[10px] border-[#2C2D30] ring-4 ring-[#1C1D20] flex flex-col overflow-hidden relative select-none">
        
        {/* Dynamic Island & Native iOS Status Header */}
        <div className="bg-[#002970] text-white pt-3 pb-2 px-7 flex items-center justify-between z-50 shrink-0">
          <span className="text-[13px] font-bold tracking-tight">09:41</span>
          
          {/* Dynamic Island Capsule */}
          <div className="h-6 w-32 bg-black rounded-full flex items-center justify-between px-3 shadow-inner">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#1C1D20] border border-slate-700" />
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono font-bold tracking-tight">5G</span>
            <Wifi size={13} />
            <Battery size={15} className="text-[#10B981] fill-[#10B981]" />
          </div>
        </div>

        {/* Paytm for Business App Bar */}
        <div className="bg-[#002970] text-white px-4 py-2.5 flex items-center justify-between border-b border-[#001E53] shrink-0">
          <div className="flex items-center gap-2">
            <div className="flex items-baseline bg-white px-2 py-0.5 rounded shadow-sm">
              <span className="text-[#002970] font-black text-sm">Pay</span>
              <span className="text-[#00BAF2] font-black text-sm">tm</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-black tracking-tight leading-none">for Business</span>
              <span className="text-[9px] text-[#00BAF2] font-bold uppercase mt-0.5">Sharma General Store</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={onOpenQrModal}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[#00BAF2]"
              title="Store QR"
            >
              <QrCode size={16} />
            </button>
            <div className="w-7 h-7 rounded-full bg-white text-[#002970] font-black text-[10px] flex items-center justify-center border border-[#00BAF2]">
              SG
            </div>
          </div>
        </div>

        {/* Scrollable Phone App Body */}
        <div className="flex-1 overflow-y-auto p-3.5 space-y-4 pb-24 scroll-smooth">
          
          {/* ================= VIEW: HOME ================= */}
          {mobileTab === 'home' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              
              {/* Primary Collection Card */}
              <div className="bg-gradient-to-br from-[#002970] via-[#003896] to-[#002970] text-white rounded-2xl p-4 shadow-md border border-[#00BAF2]/30 relative overflow-hidden">
                <div className="flex items-center justify-between mb-1 text-[11px] text-sky-200">
                  <span>Today's Total Collection</span>
                  <span className="text-[#10B981] font-bold bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-400/30">
                    +18.4% WoW
                  </span>
                </div>
                <div className="text-3xl font-black tracking-tight">
                  ₹{todayCollection.toLocaleString('en-IN')}
                </div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/15 text-[11px] text-slate-200">
                  <span>{transactionsCount} QR Payments</span>
                  <span className="text-[#00BAF2] font-bold">Soundbox: Online (92%)</span>
                </div>
              </div>

              {/* Bank Settlement Bar */}
              <div className="bg-white dark:bg-[#161F30] rounded-xl p-3 border border-[#E2E8F0] dark:border-slate-800 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#64748B] dark:text-slate-400 uppercase font-bold block">
                    Pending Bank Settlement
                  </span>
                  <span className="text-lg font-black text-[#002970] dark:text-white">
                    ₹{pendingSettlementAmount.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-medium block">
                    Auto-credit 11:00 PM • 0% Fee
                  </span>
                </div>
                <button
                  onClick={onOpenSettlementModal}
                  className="bg-[#10B981] hover:bg-emerald-600 text-white font-bold text-xs px-3 py-1.5 rounded-lg shadow-sm"
                >
                  Settle Now
                </button>
              </div>

              {/* 4 CORE PILLARS GRID (ALL 4 WITH THE EXACT SAME HIGH-CONTRAST PAYTM CYAN/NAVY ACCENTS) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-black text-[#002970] dark:text-white px-1">
                  <span>4 Core Operations Modules</span>
                  <span className="text-[10px] text-[#00BAF2] uppercase font-bold">Touch to Open</span>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  {/* Card 1: Ask Priya */}
                  <div 
                    onClick={() => setMobileTab('priya')}
                    className="bg-white dark:bg-[#161F30] p-3 rounded-xl border-2 border-[#00BAF2] shadow-sm active:scale-95 transition-all cursor-pointer relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[9px] font-black bg-[#00BAF2] text-[#002970] px-2 py-0.5 rounded-md uppercase">
                        Module 1
                      </span>
                      <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-6 h-6 rounded-md bg-[#00BAF2]/10 text-[#00BAF2] font-black text-xs flex items-center justify-center">
                        P
                      </div>
                      <h4 className="text-xs font-black text-[#002970] dark:text-white">Ask Priya</h4>
                    </div>
                    <p className="text-[10px] text-[#64748B] dark:text-slate-400 mt-1 line-clamp-2">
                      Voice copilot for peak rush &amp; store timings.
                    </p>
                    <div className="absolute top-0 left-0 w-1 h-full bg-[#00BAF2]" />
                  </div>

                  {/* Card 2: Verify & Refund */}
                  <div 
                    onClick={() => setMobileTab('verify')}
                    className="bg-white dark:bg-[#161F30] p-3 rounded-xl border-2 border-[#00BAF2] shadow-sm active:scale-95 transition-all cursor-pointer relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[9px] font-black bg-[#00BAF2] text-[#002970] px-2 py-0.5 rounded-md uppercase">
                        Module 2
                      </span>
                      <ShieldCheck size={13} className="text-[#00BAF2]" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-6 h-6 rounded-md bg-[#00BAF2]/10 text-[#00BAF2] font-black text-xs flex items-center justify-center">
                        <ShieldCheck size={13} />
                      </div>
                      <h4 className="text-xs font-black text-[#002970] dark:text-white">Verify &amp; Refund</h4>
                    </div>
                    <p className="text-[10px] text-[#64748B] dark:text-slate-400 mt-1 line-clamp-2">
                      Scan screenshot, 380ms UTR &amp; Re-Pay QR.
                    </p>
                    <div className="absolute top-0 left-0 w-1 h-full bg-[#00BAF2]" />
                  </div>

                  {/* Card 3: Udhaar Ledger */}
                  <div 
                    onClick={() => setMobileTab('khata')}
                    className="bg-white dark:bg-[#161F30] p-3 rounded-xl border-2 border-[#00BAF2] shadow-sm active:scale-95 transition-all cursor-pointer relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[9px] font-black bg-[#00BAF2] text-[#002970] px-2 py-0.5 rounded-md uppercase">
                        Module 3
                      </span>
                      <BookOpen size={13} className="text-[#00BAF2]" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-6 h-6 rounded-md bg-[#00BAF2]/10 text-[#00BAF2] font-black text-xs flex items-center justify-center">
                        <BookOpen size={13} />
                      </div>
                      <h4 className="text-xs font-black text-[#002970] dark:text-white">Bahi-Khata</h4>
                    </div>
                    <p className="text-[10px] text-[#64748B] dark:text-slate-400 mt-1 line-clamp-2">
                      ₹{totalUdhaarDue.toLocaleString('en-IN')} due • Add/edit &amp; paper OCR.
                    </p>
                    <div className="absolute top-0 left-0 w-1 h-full bg-[#00BAF2]" />
                  </div>

                  {/* Card 4: Urgent Loan */}
                  <div 
                    onClick={() => setMobileTab('loan')}
                    className="bg-white dark:bg-[#161F30] p-3 rounded-xl border-2 border-[#00BAF2] shadow-sm active:scale-95 transition-all cursor-pointer relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[9px] font-black bg-[#00BAF2] text-[#002970] px-2 py-0.5 rounded-md uppercase">
                        Module 4
                      </span>
                      <Zap size={13} className="text-[#00BAF2]" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-6 h-6 rounded-md bg-[#00BAF2]/10 text-[#00BAF2] font-black text-xs flex items-center justify-center">
                        <Zap size={13} />
                      </div>
                      <h4 className="text-xs font-black text-[#002970] dark:text-white">0% Urgent Loan</h4>
                    </div>
                    <p className="text-[10px] text-[#64748B] dark:text-slate-400 mt-1 line-clamp-2">
                      Fetch statement &amp; sales-to-loan slider.
                    </p>
                    <div className="absolute top-0 left-0 w-1 h-full bg-[#00BAF2]" />
                  </div>
                </div>
              </div>

              {/* Recent Payments Feed */}
              <div className="bg-white dark:bg-[#161F30] rounded-xl p-3 border border-[#E2E8F0] dark:border-slate-800 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-[#002970] dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                  <span>Live Payments Feed</span>
                  <span className="text-[10px] text-[#00BAF2]">142 Done Today</span>
                </div>
                <div className="space-y-2">
                  {transactions.slice(0, 3).map((t) => (
                    <div key={t.id} className="flex items-center justify-between text-xs py-1">
                      <div>
                        <p className="font-bold text-[#0F172A] dark:text-slate-200">{t.customerName}</p>
                        <p className="text-[10px] text-[#64748B] dark:text-slate-400">{t.time} • {t.method}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-[#10B981]">+₹{t.amount}</p>
                        <span className="text-[9px] bg-emerald-50 text-emerald-700 px-1 rounded">Success</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ================= VIEW: ASK PRIYA ================= */}
          {mobileTab === 'priya' && (
            <div className="space-y-3 animate-in fade-in duration-150">
              <div className="bg-gradient-to-r from-[#002970] to-[#003da5] text-white p-3 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#00BAF2] text-[#002970] font-black text-sm flex items-center justify-center">
                    P
                  </div>
                  <div>
                    <h3 className="text-xs font-bold">Ask Priya (Kirana Advisor)</h3>
                    <p className="text-[10px] text-sky-200">Female Voice Assistant</p>
                  </div>
                </div>
                <button
                  onClick={() => setMobileTab('home')}
                  className="text-xs text-sky-200 hover:text-white font-bold"
                >
                  Close
                </button>
              </div>

              {/* Chat Stream */}
              <div className="bg-white dark:bg-[#161F30] rounded-xl p-3 border border-[#E2E8F0] dark:border-slate-800 min-h-[350px] max-h-[420px] overflow-y-auto space-y-3 text-xs">
                {priyaChat.map((m, idx) => (
                  <div key={idx} className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`p-2.5 rounded-xl max-w-[85%] ${
                      m.sender === 'user'
                        ? 'bg-[#002970] text-white rounded-br-none'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-none border border-slate-200 dark:border-slate-700'
                    }`}>
                      <p className="leading-snug">{m.text}</p>
                      {m.hindi && (
                        <p className="text-[10px] text-[#002970] dark:text-sky-300 italic mt-1.5 pt-1 border-t border-slate-200 dark:border-slate-700">
                          🇮🇳 {m.hindi}
                        </p>
                      )}
                      {m.sender === 'priya' && m.hindi && (
                        <button
                          onClick={() => handleSpeak(m.hindi!)}
                          className="text-[10px] text-[#00BAF2] font-bold flex items-center gap-1 mt-1 hover:underline"
                        >
                          <Volume2 size={11} /> {isSpeaking ? 'Playing...' : "Listen to Voice"}
                        </button>
                      )}
                    </div>
                    <span className="text-[9px] text-slate-400 mt-0.5">{m.time}</span>
                  </div>
                ))}
              </div>

              {/* Quick Prompts */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 text-[10px]">
                <button 
                  onClick={() => handleSendPriya("What are my peak rush hours?")}
                  className="bg-sky-50 dark:bg-slate-800 text-[#002970] dark:text-sky-300 font-bold px-2.5 py-1 rounded-full border border-sky-200 shrink-0"
                >
                  Peak rush hours?
                </button>
                <button 
                  onClick={() => handleSendPriya("When should I open & NOT close?")}
                  className="bg-sky-50 dark:bg-slate-800 text-[#002970] dark:text-sky-300 font-bold px-2.5 py-1 rounded-full border border-sky-200 shrink-0"
                >
                  Open / Close Timings?
                </button>
                <button 
                  onClick={() => handleSendPriya("Who owes udhaar?")}
                  className="bg-sky-50 dark:bg-slate-800 text-[#002970] dark:text-sky-300 font-bold px-2.5 py-1 rounded-full border border-sky-200 shrink-0"
                >
                  Udhaar Status?
                </button>
              </div>

              {/* Input Box */}
              <div className="flex gap-1.5">
                <input
                  type="text"
                  value={priyaInput}
                  onChange={(e) => setPriyaInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendPriya()}
                  placeholder="Ask Priya in Hindi or English..."
                  className="flex-1 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 outline-none"
                />
                <button
                  onClick={() => handleSendPriya()}
                  className="bg-[#002970] text-white px-3.5 py-2 rounded-xl text-xs font-bold"
                >
                  Ask
                </button>
              </div>
            </div>
          )}

          {/* ================= VIEW: VERIFY & REFUND (WITH UPLOAD SCREENSHOT SCAN) ================= */}
          {mobileTab === 'verify' && (
            <div className="space-y-3 animate-in fade-in duration-150">
              
              {/* Header */}
              <div className="bg-gradient-to-r from-[#002970] to-[#003da5] text-white p-3 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={18} className="text-[#00BAF2]" />
                  <div>
                    <h3 className="text-xs font-bold">Vision Shield (Verify &amp; Refund)</h3>
                    <p className="text-[10px] text-sky-200">Sub-380ms UTR cross-check</p>
                  </div>
                </div>
                <button onClick={() => setMobileTab('home')} className="text-xs text-sky-200 hover:text-white font-bold">
                  Home
                </button>
              </div>

              {/* Upload Screenshot Dropzone Box */}
              <div 
                onClick={() => handleTriggerUploadScan('success')}
                className="border-2 border-dashed border-[#00BAF2] bg-white dark:bg-[#161F30] hover:bg-sky-50/50 dark:hover:bg-slate-800/60 rounded-2xl p-4 text-center cursor-pointer transition-all active:scale-98 shadow-sm"
              >
                {isScanningScreenshot ? (
                  <div className="py-4 flex flex-col items-center justify-center space-y-2">
                    <RefreshCw size={24} className="text-[#00BAF2] animate-spin" />
                    <p className="text-xs font-bold text-[#002970] dark:text-white">
                      Scanning OCR with NPCI Settlement Switch...
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="w-12 h-12 rounded-full bg-[#00BAF2]/10 text-[#00BAF2] flex items-center justify-center">
                      <Upload size={22} />
                    </div>
                    <div>
                      <p className="text-xs font-black text-[#002970] dark:text-white">
                        Tap to Upload / Scan Payment Screenshot
                      </p>
                      <p className="text-[10px] text-[#64748B] dark:text-slate-400 mt-0.5">
                        Supports Google Pay, PhonePe, Paytm UPI &amp; BHIM
                      </p>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[9px] bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded font-mono">
                        Camera Scan
                      </span>
                      <span className="text-[9px] bg-sky-50 dark:bg-slate-700 text-[#00BAF2] px-2 py-0.5 rounded font-mono font-bold">
                        380ms Match
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Edge Case Simulators */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-[#64748B] dark:text-slate-400 uppercase tracking-wider block px-1">
                  Simulate Counter Edge Cases:
                </span>
                <div className="grid grid-cols-3 gap-1.5 text-xs">
                  <button 
                    onClick={() => handleTriggerUploadScan('success')}
                    className="p-2 rounded-xl border-2 border-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-bold active:scale-95 transition-all text-left"
                  >
                    <span className="block text-[11px] leading-tight font-black">✓ Valid</span>
                    <span className="text-[9px] font-normal text-emerald-700 dark:text-emerald-300">₹450 • GPay</span>
                  </button>
                  <button 
                    onClick={() => handleTriggerUploadScan('stuck')}
                    className="p-2 rounded-xl border-2 border-amber-400 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 font-bold active:scale-95 transition-all text-left"
                  >
                    <span className="block text-[11px] leading-tight font-black">⚠️ Stuck</span>
                    <span className="text-[9px] font-normal text-amber-700 dark:text-amber-300">₹620 • Refund</span>
                  </button>
                  <button 
                    onClick={() => handleTriggerUploadScan('blurry')}
                    className="p-2 rounded-xl border-2 border-rose-400 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 font-bold active:scale-95 transition-all text-left"
                  >
                    <span className="block text-[11px] leading-tight font-black">📷 Blurry</span>
                    <span className="text-[9px] font-normal text-rose-700 dark:text-rose-300">32% Glare</span>
                  </button>
                </div>
              </div>

              {/* Active Scan Result Box */}
              <div className={`p-3.5 rounded-2xl border-2 ${
                currentOcr.status === 'verified' ? 'bg-emerald-50/90 dark:bg-emerald-950/30 border-emerald-400' :
                currentOcr.status === 'stuck' ? 'bg-amber-50/90 dark:bg-amber-950/30 border-amber-400' : 
                'bg-rose-50/90 dark:bg-rose-950/30 border-rose-400'
              } shadow-sm space-y-2`}>
                <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800 pb-2">
                  <span className="text-xs font-mono font-black text-[#002970] dark:text-white">
                    UTR: {currentOcr.utr}
                  </span>
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                    currentOcr.status === 'verified' ? 'bg-emerald-500 text-white' :
                    currentOcr.status === 'stuck' ? 'bg-amber-500 text-white' : 'bg-rose-500 text-white'
                  }`}>
                    {currentOcr.status === 'unreadable' ? 'BLUR DETECTED' : currentOcr.status}
                  </span>
                </div>

                <div className="text-xs space-y-1">
                  <div className="flex justify-between text-slate-700 dark:text-slate-300">
                    <span>Customer:</span>
                    <strong className="text-[#002970] dark:text-white">{currentOcr.customerName} ({currentOcr.app})</strong>
                  </div>
                  <div className="flex justify-between text-slate-700 dark:text-slate-300">
                    <span>Amount Scanned:</span>
                    <strong className="text-base font-black text-[#002970] dark:text-white">₹{currentOcr.amount}</strong>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 pt-1 leading-snug">
                    {currentOcr.verificationMessage}
                  </p>
                </div>

                {/* Auto-Refund CTA if stuck */}
                {currentOcr.status === 'stuck' && (
                  <div className="pt-2">
                    <button
                      onClick={onTriggerAutoRefund}
                      className="w-full bg-[#00BAF2] hover:bg-[#009EDC] text-white py-2 px-3 rounded-xl text-xs font-black shadow-sm flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                    >
                      <Zap size={14} />
                      <span>Trigger Auto-Refund &amp; Re-Pay QR</span>
                    </button>
                  </div>
                )}

                {/* Fallback Manual UTR input if unreadable/blurry */}
                {(currentOcr.status === 'unreadable' || currentOcr.screenshotType === 'blurry') && (
                  <div className="pt-2 border-t border-rose-200 dark:border-rose-900/50 space-y-1.5">
                    <label className="text-[10px] font-bold text-rose-800 dark:text-rose-300 uppercase tracking-wide block">
                      Fallback: Enter 12-Digit Customer UTR
                    </label>
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        value={manualUtrInput}
                        onChange={(e) => {
                          setManualUtrInput(e.target.value.replace(/\D/g, '').slice(0, 12));
                          setManualUtrError('');
                        }}
                        placeholder="e.g. 984102938102"
                        className="flex-1 bg-white dark:bg-[#0B0F19] border border-rose-300 dark:border-rose-800 rounded-xl px-2.5 py-1.5 text-xs font-mono outline-none"
                      />
                      <button
                        onClick={handleManualUtrSubmit}
                        className="bg-[#002970] hover:bg-[#001E53] text-white px-3 py-1.5 rounded-xl text-xs font-bold active:scale-95 transition-all shrink-0"
                      >
                        Verify UTR
                      </button>
                    </div>
                    {manualUtrError && (
                      <p className="text-[10px] text-rose-600 font-medium">{manualUtrError}</p>
                    )}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* ================= VIEW: BAHI-KHATA (WITH MANUAL ADD / EDIT & PAPER OCR SCAN) ================= */}
          {mobileTab === 'khata' && (
            <div className="space-y-3 animate-in fade-in duration-150">
              
              {/* Header */}
              <div className="bg-gradient-to-r from-[#002970] to-[#003da5] text-white p-3 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen size={18} className="text-[#00BAF2]" />
                  <div>
                    <h3 className="text-xs font-bold">Neural Bahi-Khata Ledger</h3>
                    <p className="text-[10px] text-sky-200">Total Due: ₹{totalUdhaarDue.toLocaleString('en-IN')}</p>
                  </div>
                </div>
                <button onClick={() => setMobileTab('home')} className="text-xs text-sky-200 hover:text-white font-bold">
                  Home
                </button>
              </div>

              {/* Action Buttons: Scan Paper Register & Add Manually */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleScanPaperRegister}
                  disabled={isScanningPaper}
                  className="bg-[#00BAF2] hover:bg-[#009EDC] text-white p-2.5 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
                >
                  <Camera size={14} />
                  <span>{isScanningPaper ? 'Scanning Paper...' : 'Scan Paper Khata'}</span>
                </button>
                <button
                  onClick={handleOpenAddKhata}
                  className="bg-[#002970] hover:bg-[#001E53] text-white p-2.5 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
                >
                  <Plus size={14} />
                  <span>Add New Udhaar</span>
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={khataSearch}
                  onChange={(e) => setKhataSearch(e.target.value)}
                  placeholder="Search customer name or phone..."
                  className="w-full bg-white dark:bg-[#161F30] border border-slate-200 dark:border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs outline-none"
                />
              </div>

              {/* Ledger Entries List */}
              <div className="space-y-2">
                {udhaarLedger
                  .filter(u => u.name.toLowerCase().includes(khataSearch.toLowerCase()) || u.phone.includes(khataSearch))
                  .map((u) => (
                    <div key={u.id} className="bg-white dark:bg-[#161F30] p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-2 shadow-xs">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-black text-slate-900 dark:text-white text-xs">{u.name}</p>
                          <p className="text-[10px] text-slate-500 font-mono">{u.phone}</p>
                        </div>
                        <div className="text-right">
                          <p className={`font-black text-sm ${u.status === 'Paid' ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {u.status === 'Paid' ? 'PAID' : `₹${u.amount.toLocaleString('en-IN')}`}
                          </p>
                          <span className="text-[9px] text-slate-400">Due: {u.dueDate}</span>
                        </div>
                      </div>

                      <p className="text-[10px] text-slate-500 bg-slate-50 dark:bg-slate-800/80 p-1.5 rounded">
                        Notes: {u.notes}
                      </p>

                      {/* Action Bar per row */}
                      <div className="flex items-center gap-1.5 pt-1 border-t border-slate-100 dark:border-slate-800">
                        {u.status !== 'Paid' && (
                          <>
                            <button
                              onClick={() => onSendReminderUdhaar(u.id)}
                              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-1.5 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 active:scale-95 transition-all"
                            >
                              <MessageSquare size={12} />
                              <span>{u.status === 'Reminder Sent' ? 'Reminder Sent' : 'Send Reminder'}</span>
                            </button>
                            <button
                              onClick={() => onMarkPaidUdhaar(u.id)}
                              className="bg-[#00BAF2] hover:bg-[#009EDC] text-white px-2.5 py-1.5 rounded-lg text-[10px] font-bold"
                            >
                              Mark Paid
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleOpenEditKhata(u)}
                          className="bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-800 dark:text-white px-2 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1"
                        >
                          <Edit2 size={11} />
                          <span>Edit</span>
                        </button>
                      </div>
                    </div>
                  ))}
              </div>

              {/* Add / Edit Modal Overlay inside Phone */}
              {isAddModalOpen && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 animate-in fade-in">
                  <div className="bg-white dark:bg-[#161F30] rounded-2xl w-full max-w-[380px] p-4 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                      <h4 className="text-xs font-black text-[#002970] dark:text-white">
                        {editingEntry ? 'Edit Udhaar Customer' : 'Add New Udhaar Entry'}
                      </h4>
                      <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                        <X size={16} />
                      </button>
                    </div>

                    <form onSubmit={handleSaveKhata} className="space-y-2.5 text-xs">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Customer Name</label>
                        <input
                          type="text"
                          required
                          value={formName}
                          onChange={(e) => setFormName(e.target.value)}
                          placeholder="e.g. Ramesh Kumar"
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Phone Number</label>
                        <input
                          type="text"
                          required
                          value={formPhone}
                          onChange={(e) => setFormPhone(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs outline-none"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Amount (₹)</label>
                          <input
                            type="number"
                            required
                            value={formAmount}
                            onChange={(e) => setFormAmount(e.target.value)}
                            placeholder="500"
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Due Date</label>
                          <input
                            type="date"
                            value={formDueDate}
                            onChange={(e) => setFormDueDate(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs outline-none"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Grocery Items / Notes</label>
                        <input
                          type="text"
                          value={formNotes}
                          onChange={(e) => setFormNotes(e.target.value)}
                          placeholder="e.g. 5kg Atta, Mustard Oil"
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs outline-none"
                        />
                      </div>

                      <div className="flex gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setIsAddModalOpen(false)}
                          className="flex-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 py-2 rounded-lg font-bold"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="flex-1 bg-[#00BAF2] hover:bg-[#009EDC] text-white py-2 rounded-lg font-black"
                        >
                          {editingEntry ? 'Update' : 'Save Entry'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* ================= VIEW: 0% URGENT LOAN (WITH STATEMENT FETCH & SALES SLIDER) ================= */}
          {mobileTab === 'loan' && (
            <div className="space-y-3 animate-in fade-in duration-150">
              
              {/* Header */}
              <div className="bg-gradient-to-r from-[#002970] to-[#003da5] text-white p-3 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap size={18} className="text-[#00BAF2]" />
                  <div>
                    <h3 className="text-xs font-bold">0% Urgent Working Capital</h3>
                    <p className="text-[10px] text-sky-200">Velocity Underwriting</p>
                  </div>
                </div>
                <button onClick={() => setMobileTab('home')} className="text-xs text-sky-200 hover:text-white font-bold">
                  Home
                </button>
              </div>

              {/* Fetch Bank Statement Box */}
              <div className="bg-white dark:bg-[#161F30] p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#002970] dark:text-white flex items-center gap-1.5">
                    <FileText size={14} className="text-[#00BAF2]" />
                    <span>Paytm Statement Fetch</span>
                  </span>
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold">
                    Grade A+ (94/100)
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Daily QR Velocity: <strong className="text-slate-800 dark:text-white">₹14,500/day</strong> across 120 payments.
                </p>
                <button
                  onClick={handleFetchStatement}
                  disabled={isFetchingStatement}
                  className="w-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-[#002970] dark:text-sky-300 font-bold py-1.5 rounded-lg text-xs flex items-center justify-center gap-1"
                >
                  <RefreshCw size={12} className={isFetchingStatement ? "animate-spin" : ""} />
                  <span>{isFetchingStatement ? "Syncing Statement..." : "Re-Sync Live Statement"}</span>
                </button>
              </div>

              {/* Main Pre-approved Loan Offer */}
              <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white p-4 rounded-2xl shadow-md space-y-2">
                <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-wider text-emerald-200">
                  <span>Pre-Approved Credit Limit</span>
                  <span className="bg-white/20 px-2 py-0.5 rounded">0% Interest</span>
                </div>
                <div className="text-3xl font-black tracking-tight">₹5,000</div>
                <p className="text-xs text-emerald-100">
                  Instant IMPS to HDFC Bank ****4102. Auto-settles from 11:00 PM tonight.
                </p>

                <button
                  onClick={onClaimLoan}
                  disabled={loanState.isDisbursed}
                  className="w-full bg-white text-emerald-900 hover:bg-emerald-50 disabled:bg-emerald-200 font-black py-2.5 rounded-xl text-xs shadow-sm mt-1 transition-all"
                >
                  {loanState.isDisbursed ? '✓ ₹5,000 Disbursed (IMPS)' : 'Claim 2-Minute Emergency Loan'}
                </button>
              </div>

              {/* Dynamic Sales & Loan Slider Calculator */}
              <div className="bg-white dark:bg-[#161F30] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#002970] dark:text-white flex items-center gap-1.5">
                    <Sliders size={14} className="text-[#00BAF2]" />
                    <span>Loan Eligibility Slider</span>
                  </span>
                  <span className="text-[10px] font-bold text-[#00BAF2] font-mono">
                    35% Velocity Rule
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Daily Sales:</span>
                    <strong className="text-slate-900 dark:text-white font-mono">₹{simulatedSales.toLocaleString('en-IN')}/day</strong>
                  </div>
                  <input
                    type="range"
                    min="5000"
                    max="60000"
                    step="1000"
                    value={simulatedSales}
                    onChange={(e) => setSimulatedSales(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#00BAF2]"
                  />
                  <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                    <span>₹5,000</span>
                    <span className="text-[#00BAF2] font-bold">Now: ₹14,500</span>
                    <span>₹60,000</span>
                  </div>
                </div>

                {/* Calculated Loan Limit */}
                <div className="bg-slate-50 dark:bg-slate-800/80 p-3 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Eligible 24-Hr Loan</span>
                    <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                      ₹{eligibleLoanFromSales.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="text-right text-[10px] text-slate-500">
                    <p>Interest: <strong className="text-emerald-600">₹0 (0% APR)</strong></p>
                    <p>Auto-Deduct: <strong className="text-[#002970] dark:text-sky-300">11:00 PM</strong></p>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Dedicated Native Mobile Bottom Navigation Bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-white/95 dark:bg-[#111827]/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-3 py-2 flex items-center justify-around z-40">
          <button 
            onClick={() => setMobileTab('home')}
            className={`flex flex-col items-center text-[10px] font-bold ${mobileTab === 'home' ? 'text-[#002970] dark:text-[#00BAF2]' : 'text-slate-400'}`}
          >
            <Store size={18} />
            <span>Home</span>
          </button>

          <button 
            onClick={() => setMobileTab('verify')}
            className={`flex flex-col items-center text-[10px] font-bold ${mobileTab === 'verify' ? 'text-[#002970] dark:text-[#00BAF2]' : 'text-slate-400'}`}
          >
            <ShieldCheck size={18} />
            <span>Verify</span>
          </button>

          {/* Center Floating Ask Priya Button */}
          <button 
            onClick={() => setMobileTab('priya')}
            className="flex flex-col items-center -mt-6 focus:outline-none"
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-sm shadow-lg border-2 border-white transition-all ${
              mobileTab === 'priya' ? 'bg-[#002970] text-[#00BAF2] scale-105' : 'bg-gradient-to-tr from-[#00BAF2] to-[#002970] text-white'
            }`}>
              P
            </div>
            <span className={`text-[10px] font-bold mt-0.5 ${mobileTab === 'priya' ? 'text-[#002970] dark:text-[#00BAF2]' : 'text-slate-500'}`}>
              Priya
            </span>
          </button>

          <button 
            onClick={() => setMobileTab('khata')}
            className={`flex flex-col items-center text-[10px] font-bold ${mobileTab === 'khata' ? 'text-[#002970] dark:text-[#00BAF2]' : 'text-slate-400'}`}
          >
            <BookOpen size={18} />
            <span>Khata</span>
          </button>

          <button 
            onClick={() => setMobileTab('loan')}
            className={`flex flex-col items-center text-[10px] font-bold ${mobileTab === 'loan' ? 'text-[#002970] dark:text-[#00BAF2]' : 'text-slate-400'}`}
          >
            <Zap size={18} />
            <span>0% Loan</span>
          </button>
        </div>

        {/* iPhone Native Home Bar */}
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-400/80 dark:bg-slate-600 rounded-full pointer-events-none z-50" />
      </div>

    </div>
  );
};
