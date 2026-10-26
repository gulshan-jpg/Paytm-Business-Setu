import React, { useState } from 'react';
import { 
  BookOpen, 
  Upload, 
  Plus, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  RotateCcw, 
  QrCode, 
  MessageSquare, 
  Pencil, 
  Trash2, 
  X, 
  Send, 
  Calendar, 
  Phone, 
  User, 
  FileText, 
  Clock, 
  ShieldAlert, 
  ShieldCheck, 
  Check, 
  Camera, 
  RefreshCw, 
  ArrowRight,
  ExternalLink,
  Ban
} from 'lucide-react';
import { UdhaarEntry, PaperKhataParsedResult } from '../../types';
import { PAPER_KHATA_PRESET } from '../../data/mockData';
import { soundManager } from '../../utils/audio';

interface UdhaarLedgerTabProps {
  ledger: UdhaarEntry[];
  recoveredToday: number;
  onAddEntry: (newEntry: Omit<UdhaarEntry, 'id' | 'daysOverdue' | 'isExcludedFromOffers' | 'status'>) => void;
  onUpdateEntry: (updatedEntry: UdhaarEntry) => void;
  onDeleteEntry: (id: string) => void;
  onMarkPaid: (id: string) => void;
  onSendReminder: (id: string) => void;
  onImportPaperKhata: (entries: PaperKhataParsedResult[]) => void;
}

export const UdhaarLedgerTab: React.FC<UdhaarLedgerTabProps> = ({
  ledger,
  recoveredToday,
  onAddEntry,
  onUpdateEntry,
  onDeleteEntry,
  onMarkPaid,
  onSendReminder,
  onImportPaperKhata
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Overdue' | 'Excluded' | 'Pending' | 'Paid'>('All');

  const [selectedCustomerForPreview, setSelectedCustomerForPreview] = useState<UdhaarEntry>(
    ledger.find(e => e.status !== 'Paid') || ledger[0]
  );

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<UdhaarEntry | null>(null);
  const [deletingEntry, setDeletingEntry] = useState<UdhaarEntry | null>(null);
  const [clearedReceiptEntry, setClearedReceiptEntry] = useState<UdhaarEntry | null>(null);

  const [isScanningPaper, setIsScanningPaper] = useState(false);
  const [scannedResults, setScannedResults] = useState<PaperKhataParsedResult[] | null>(null);

  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formAmount, setFormAmount] = useState<number | ''>('');
  const [formDueDate, setFormDueDate] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const validateIndianMobile = (phone: string): boolean => {
    const digits = phone.replace(/\D/g, '');
    if (digits.length === 10 && /^[6-9]/.test(digits)) return true;
    if (digits.length === 12 && digits.startsWith('91') && /^[6-9]/.test(digits.slice(2))) return true;
    return false;
  };

  const activeUnpaidEntries = ledger.filter(e => e.status !== 'Paid');
  const totalOutstanding = activeUnpaidEntries.reduce((acc, curr) => acc + curr.amount, 0);
  const overdueCount = ledger.filter(e => e.daysOverdue > 0 && e.status !== 'Paid').length;
  const excludedFromOffersCount = ledger.filter(e => e.isExcludedFromOffers && e.status !== 'Paid').length;

  const filteredLedger = ledger.filter((entry) => {
    const matchesSearch = 
      entry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.phone.includes(searchTerm) ||
      entry.notes.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (statusFilter === 'Overdue') return entry.daysOverdue > 0 && entry.status !== 'Paid';
    if (statusFilter === 'Excluded') return entry.isExcludedFromOffers && entry.status !== 'Paid';
    if (statusFilter === 'Pending') return entry.status !== 'Paid';
    if (statusFilter === 'Paid') return entry.status === 'Paid';

    return true;
  });

  const openCreateModal = () => {
    setFormName('');
    setFormPhone('+91 ');
    setFormAmount('');
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    setFormDueDate(nextWeek.toISOString().split('T')[0]);
    setFormNotes('');
    setPhoneError('');
    setIsAddModalOpen(true);
  };

  const openEditModal = (entry: UdhaarEntry) => {
    setEditingEntry(entry);
    setFormName(entry.name);
    setFormPhone(entry.phone);
    setFormAmount(entry.amount);
    setFormDueDate(entry.dueDate);
    setFormNotes(entry.notes);
    setPhoneError('');
  };

  const handleSaveNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formAmount) return;

    if (!validateIndianMobile(formPhone)) {
      setPhoneError('Please enter a valid 10-digit Indian mobile number (e.g., +91 98110 12345).');
      return;
    }

    onAddEntry({
      name: formName.trim(),
      phone: formPhone.trim(),
      amount: Number(formAmount),
      dueDate: formDueDate || new Date().toISOString().split('T')[0],
      notes: formNotes.trim()
    });

    setIsAddModalOpen(false);
    soundManager.playSuccessPop();
  };

  const handleSaveUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEntry || !formAmount) return;

    if (!validateIndianMobile(formPhone)) {
      setPhoneError('Please enter a valid 10-digit Indian mobile number (e.g., +91 98110 12345).');
      return;
    }

    const updated: UdhaarEntry = {
      ...editingEntry,
      name: formName.trim() || editingEntry.name,
      phone: formPhone.trim() || editingEntry.phone,
      amount: Number(formAmount),
      dueDate: formDueDate || editingEntry.dueDate,
      notes: formNotes.trim() || editingEntry.notes
    };

    onUpdateEntry(updated);
    setEditingEntry(null);
    soundManager.playSuccessPop();
  };

  const handleConfirmDelete = () => {
    if (!deletingEntry) return;
    onDeleteEntry(deletingEntry.id);
    setDeletingEntry(null);
    soundManager.playAlertPing();
  };

  const handleMarkPaidAction = (entry: UdhaarEntry) => {
    onMarkPaid(entry.id);
    setClearedReceiptEntry({ ...entry, status: 'Paid', amount: 0, isExcludedFromOffers: false });
    soundManager.playSuccessPop();
  };

  const handleSimulatePaperScan = () => {
    setIsScanningPaper(true);
    try {
      setScannedResults(PAPER_KHATA_PRESET);
      soundManager.playSuccessPop();
    } finally {
      setIsScanningPaper(false);
    }
  };

  const handleConfirmImport = () => {
    if (!scannedResults) return;
    onImportPaperKhata(scannedResults);
    setScannedResults(null);
    soundManager.playSuccessPop();
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-[#002970] via-[#003896] to-[#002970] text-white rounded-xl p-4 sm:p-5 shadow-paytm-card border border-[#00BAF2]/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#00BAF2] text-[#002970]">
              <BookOpen size={18} />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#00BAF2]">
              Module 2: Udhaar Ledger &amp; AI Recovery Engine (Bahi-Khata AI)
            </span>
          </div>
          <h2 className="text-xl font-black tracking-tight text-white mt-1">
            Udhaar Ledger &amp; Overdue Enforcement
          </h2>
          <p className="text-xs text-white/80 mt-1 max-w-xl">
            Physical register OCR scanner, automated WhatsApp reminders, and dynamic store offer exclusion for overdue borrowers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={openCreateModal}
            className="flex items-center gap-1.5 bg-[#00BAF2] hover:bg-[#009EDC] text-white font-bold px-4 py-2 rounded-lg text-xs transition-all shadow-sm active:scale-95"
          >
            <Plus size={15} />
            <span>Add Manual Udhaar Entry</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white rounded-xl p-4 border border-[#E2E8F0] shadow-paytm-card space-y-1">
          <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">
            Total Outstanding Udhaar
          </span>
          <p className="text-2xl font-black text-[#002970] tracking-tight font-mono">
            Rs. {totalOutstanding.toLocaleString('en-IN')}
          </p>
          <span className="text-[11px] text-[#64748B] block">
            Across {activeUnpaidEntries.length} active borrower accounts
          </span>
        </div>

        <div className="bg-white rounded-xl p-4 border border-[#E2E8F0] shadow-paytm-card space-y-1">
          <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">
            Overdue Borrowers
          </span>
          <p className="text-2xl font-black text-[#F59E0B] tracking-tight font-mono">
            {overdueCount} Accounts
          </p>
          <span className="text-[11px] text-[#F59E0B] block font-medium">
            Past due date threshold
          </span>
        </div>

        <div className="bg-white rounded-xl p-4 border border-sky-200 shadow-paytm-card space-y-1 bg-sky-50/20">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#002970] uppercase tracking-wider">
              WhatsApp Reminders
            </span>
            <span className="w-2 h-2 rounded-full bg-[#00BAF2] animate-pulse" />
          </div>
          <p className="text-2xl font-black text-[#002970] tracking-tight font-mono">
            {ledger.filter(e => e.status === 'Reminder Sent').length} Sent Today
          </p>
          <span className="text-[10px] text-sky-700 block font-semibold">
            Dispatched with 1-Tap Paytm QR
          </span>
        </div>

        <div className="bg-white rounded-xl p-4 border border-[#E2E8F0] shadow-paytm-card space-y-1">
          <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">
            Recovered Today (Paytm QR)
          </span>
          <p className="text-2xl font-black text-[#10B981] tracking-tight font-mono">
            +Rs. {recoveredToday.toLocaleString('en-IN')}
          </p>
          <span className="text-[11px] text-[#10B981] block font-medium">
            Instant settlement to HDFC Bank
          </span>
        </div>

      </div>

      <div className="bg-white rounded-xl p-5 border border-[#E2E8F0] shadow-paytm-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-[#002970] text-white">
              <Camera size={16} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#002970]">AI Physical Khata Register OCR Scanner</h3>
              <p className="text-xs text-[#64748B]">Scan handwritten ledger pages to digitize customer credits</p>
            </div>
          </div>

          <span className="text-[10px] bg-sky-50 text-[#002970] px-2 py-0.5 rounded font-mono font-bold self-start sm:self-auto">
            Neural Text Extraction
          </span>
        </div>

        {/* Upload Dropzone & Demo Presets */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          
          <div 
            onClick={handleSimulatePaperScan}
            className="md:col-span-8 border-2 border-dashed border-[#00BAF2]/40 hover:border-[#00BAF2] bg-[#F4F6F9]/80 hover:bg-sky-50/50 rounded-xl p-4 text-center transition-all cursor-pointer group"
          >
            {isScanningPaper ? (
              <div className="py-4 flex flex-col items-center justify-center space-y-2">
                <RefreshCw size={24} className="text-[#00BAF2] animate-spin" />
                <p className="text-xs font-bold text-[#002970]">Analyzing Hindi / English handwriting...</p>
                <p className="text-[11px] text-[#64748B]">Parsing names, mobile numbers, and ledger tallies in 420ms</p>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#00BAF2]/10 text-[#002970] flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                  <Upload size={18} className="text-[#00BAF2]" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-[#002970]">
                    Scan / Upload Paper Khata Register Photo
                  </p>
                  <p className="text-[11px] text-[#64748B]">
                    Drag photo or click to simulate register scanning
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="md:col-span-4">
            <button
              onClick={handleSimulatePaperScan}
              className="w-full bg-[#002970] hover:bg-[#001E53] text-white p-3 rounded-xl text-left transition-all shadow-xs group"
            >
              <span className="text-[10px] font-bold text-[#00BAF2] uppercase block tracking-wider">
                Click Demo Preset:
              </span>
              <span className="text-xs font-bold block text-white mt-0.5">
                Simulate Paper Register Scan (Ramesh - Rs. 1,200, Suresh - Rs. 850)
              </span>
            </button>
          </div>

        </div>

        {scannedResults && (
          <div className="bg-sky-50/60 border border-sky-200 rounded-xl p-4 space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#002970] flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-[#10B981]" />
                Extracted Entries (Confidence: 97%)
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Parsed in 410ms</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {scannedResults.map((item, idx) => (
                <div key={idx} className="bg-white p-3 rounded-lg border border-slate-200 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <strong className="text-[#002970]">{item.customerName}</strong>
                    <span className="font-black text-[#002970] font-mono">Rs. {item.amount}</span>
                  </div>
                  <div className="text-[11px] text-[#64748B] flex justify-between">
                    <span>{item.phone}</span>
                    <span>Date: {item.date}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 pt-0.5">Notes: {item.notes}</p>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                onClick={() => setScannedResults(null)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-white"
              >
                Discard
              </button>
              <button
                onClick={handleConfirmImport}
                className="px-4 py-1.5 rounded-lg bg-[#10B981] hover:bg-emerald-600 text-white text-xs font-bold shadow-xs active:scale-95"
              >
                Confirm &amp; Import to Digital Udhaar Ledger
              </button>
            </div>
          </div>
        )}

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-paytm-card overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search customer, phone, or items..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#F4F6F9] rounded-lg border border-[#E2E8F0] focus:outline-none focus:border-[#00BAF2]"
                />
              </div>

              <div className="flex items-center gap-1.5 flex-wrap text-xs">
                {(['All', 'Overdue', 'Excluded', 'Pending', 'Paid'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setStatusFilter(filter)}
                    className={`px-2.5 py-1 rounded-md font-semibold text-[11px] transition-all ${
                      statusFilter === filter
                        ? 'bg-[#002970] text-white shadow-xs'
                        : 'bg-[#F4F6F9] text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>

            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-[#64748B] text-[10px] uppercase font-bold tracking-wider bg-[#F8FAFC]">
                    <th className="py-2.5 px-3">Customer Details</th>
                    <th className="py-2.5 px-3">Amount</th>
                    <th className="py-2.5 px-3">Due Status</th>
                    <th className="py-2.5 px-3 text-center">Reminder &amp; Recovery Status</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredLedger.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400">
                        No Udhaar records found for selected filter.
                      </td>
                    </tr>
                  ) : (
                    filteredLedger.map((entry) => {
                      const isSelectedForPreview = selectedCustomerForPreview?.id === entry.id;

                      return (
                        <tr 
                          key={entry.id} 
                          onClick={() => setSelectedCustomerForPreview(entry)}
                          className={`cursor-pointer transition-colors ${
                            isSelectedForPreview 
                              ? 'bg-sky-50/70 border-l-4 border-l-[#00BAF2]' 
                              : 'hover:bg-slate-50/80'
                          }`}
                        >
                          {/* Customer */}
                          <td className="py-3 px-3">
                            <div className="font-bold text-[#002970] flex items-center gap-1.5">
                              <span>{entry.name}</span>
                              {entry.status === 'Paid' && (
                                <span className="text-[9px] bg-emerald-50 text-[#10B981] border border-emerald-200 px-1.5 py-0.2 rounded font-bold">
                                  Paid
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-[#64748B] font-mono">{entry.phone}</div>
                            <div className="text-[10px] text-slate-400 truncate max-w-[200px] mt-0.5">
                              {entry.notes}
                            </div>
                          </td>

                          {/* Amount */}
                          <td className="py-3 px-3">
                            <span className={`font-black text-sm font-mono ${
                              entry.status === 'Paid' ? 'text-slate-400 line-through' : 'text-[#002970]'
                            }`}>
                              Rs. {entry.amount.toLocaleString('en-IN')}
                            </span>
                          </td>

                          {/* Due Status */}
                          <td className="py-3 px-3">
                            {entry.status === 'Paid' ? (
                              <span className="text-[10px] text-[#10B981] font-bold block">
                                Cleared via QR
                              </span>
                            ) : entry.daysOverdue > 0 ? (
                              <div>
                                <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded font-mono">
                                  Overdue {entry.daysOverdue} Days
                                </span>
                                <span className="text-[9px] text-[#64748B] block mt-0.5">Due: {entry.dueDate}</span>
                              </div>
                            ) : (
                              <div>
                                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                                  Payment Pending
                                </span>
                                <span className="text-[9px] text-[#64748B] block mt-0.5">Due: {entry.dueDate}</span>
                              </div>
                            )}

                            {entry.lastReminderSent && entry.status !== 'Paid' && (
                              <span className="text-[9px] text-[#00BAF2] block mt-0.5 font-medium">
                                Sent: {entry.lastReminderSent}
                              </span>
                            )}
                          </td>

                          {/* 3. REMINDER & RECOVERY STATUS */}
                          <td className="py-3 px-3 text-center">
                            {entry.status === 'Paid' ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#10B981] bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                                <ShieldCheck size={11} />
                                Account Settled
                              </span>
                            ) : entry.status === 'Reminder Sent' ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-sky-700 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded-full">
                                <MessageSquare size={11} className="text-[#00BAF2]" />
                                Reminder Sent Today
                              </span>
                            ) : entry.daysOverdue > 0 ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                                <Clock size={11} className="text-amber-600" />
                                Overdue ({entry.daysOverdue}d) • Send Reminder
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                                Within Credit Term
                              </span>
                            )}
                          </td>

                          {/* Row Actions */}
                          <td className="py-3 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-1">
                              {entry.status !== 'Paid' && (
                                <button
                                  onClick={() => onSendReminder(entry.id)}
                                  className="p-1.5 rounded-md hover:bg-emerald-50 text-[#10B981] transition-colors"
                                  title="Send WhatsApp Reminder with Paytm QR"
                                >
                                  <MessageSquare size={14} />
                                </button>
                              )}

                              {entry.status !== 'Paid' && (
                                <button
                                  onClick={() => handleMarkPaidAction(entry)}
                                  className="p-1.5 rounded-md hover:bg-emerald-50 text-[#10B981] transition-colors"
                                  title="Mark Paid & Settle Account"
                                >
                                  <CheckCircle2 size={14} />
                                </button>
                              )}

                              <button
                                onClick={() => openEditModal(entry)}
                                className="p-1.5 rounded-md hover:bg-slate-100 text-slate-600 hover:text-[#002970] transition-colors"
                                title="Edit Entry"
                              >
                                <Pencil size={14} />
                              </button>

                              <button
                                onClick={() => setDeletingEntry(entry)}
                                className="p-1.5 rounded-md hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
                                title="Delete Entry"
                              >
                                <Trash2 size={14} />
                              </button>

                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

          </div>

        </div>

        {/* Right: 2. AUTOMATED WHATSAPP REMINDER SYSTEM PREVIEW (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          
          <div className="bg-white rounded-xl p-5 border border-[#E2E8F0] shadow-paytm-card space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded-md bg-[#10B981] text-white">
                  <MessageSquare size={14} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#002970]">WhatsApp Reminder Engine</h3>
                  <p className="text-[11px] text-[#64748B]">Auto-generates dynamic QR links</p>
                </div>
              </div>
              <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded font-mono">
                API Live
              </span>
            </div>

            {/* Target Customer Info */}
            <div className="bg-[#F4F6F9] p-3 rounded-lg border border-[#E2E8F0] space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#64748B]">Selected Recipient:</span>
                <strong className="text-[#002970]">{selectedCustomerForPreview.name}</strong>
              </div>
              <div className="flex justify-between items-center text-[11px] text-[#64748B]">
                <span>Balance: <strong className="text-slate-800 font-mono">Rs. {selectedCustomerForPreview.amount}</strong></span>
                <span>{selectedCustomerForPreview.phone}</span>
              </div>
            </div>

            {/* Sample Reminder Preview Box (Exact text format) */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">
                Sample Reminder Preview:
              </span>

              <div className="bg-[#EBF7F2] border border-[#10B981]/30 rounded-xl p-3.5 space-y-2 text-xs text-slate-800 relative">
                <p className="leading-relaxed font-sans">
                  Namaste <strong className="text-[#002970]">{selectedCustomerForPreview.name}</strong>, your pending Udhaar balance at Sharma General Store is <strong className="text-[#002970]">Rs. {selectedCustomerForPreview.amount}</strong>. Click here to pay via Paytm QR: <span className="text-[#00BAF2] underline font-mono break-all">https://paytm.me/qr/sharma?amt={selectedCustomerForPreview.amount}&amp;ref={selectedCustomerForPreview.id}</span>
                </p>

                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-[#10B981]/20">
                  <span>Paytm Business Setu Gateway</span>
                  <span className="text-[#10B981] font-bold">Includes Instant UPI Switch</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onSendReminder(selectedCustomerForPreview.id)}
              disabled={selectedCustomerForPreview.status === 'Paid' || selectedCustomerForPreview.status === 'Reminder Sent'}
              className={`w-full py-2.5 px-4 rounded-lg text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 ${
                selectedCustomerForPreview.status === 'Paid'
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                  : selectedCustomerForPreview.status === 'Reminder Sent'
                  ? 'bg-amber-50 text-amber-700 border border-amber-200 cursor-not-allowed'
                  : 'bg-[#10B981] hover:bg-emerald-600 text-white active:scale-95'
              }`}
            >
              <Send size={13} />
              <span>
                {selectedCustomerForPreview.status === 'Paid' 
                  ? 'Account Cleared (No Reminder Needed)' 
                  : selectedCustomerForPreview.status === 'Reminder Sent'
                  ? `Reminder Sent Today (24h Cooldown Active)`
                  : `Send WhatsApp to ${selectedCustomerForPreview.name}`}
              </span>
            </button>

            {selectedCustomerForPreview.status === 'Reminder Sent' && (
              <p className="text-[10px] text-amber-700 bg-amber-50/80 p-2 rounded border border-amber-200">
                TRAI / Meta Anti-Spam Policy: A payment reminder template was already dispatched to this customer today. Cooldown expires at midnight.
              </p>
            )}

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-[11px] text-slate-600 space-y-1">
              <strong className="text-slate-800 block">Offer Exclusion Policy:</strong>
              <p className="leading-relaxed">
                Customers overdue past 7 days automatically lose coupon &amp; cashback access at terminal. Clearing balance instantly restores full eligibility.
              </p>
            </div>

          </div>

        </div>

      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-paytm-modal max-w-md w-full border border-[#E2E8F0] overflow-hidden">
            
            <div className="bg-[#002970] text-white px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Plus size={16} className="text-[#00BAF2]" />
                <h3 className="text-sm font-bold tracking-tight">Add Manual Udhaar Entry</h3>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="text-white/60 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveNew} className="p-5 space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-[#0F172A] uppercase tracking-wider text-[10px]">
                  Customer Name
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full py-2 px-3 bg-[#F4F6F9] border border-[#E2E8F0] rounded-lg text-slate-800 focus:outline-none focus:border-[#00BAF2]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#0F172A] uppercase tracking-wider text-[10px]">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  required
                  value={formPhone}
                  onChange={(e) => {
                    setFormPhone(e.target.value);
                    if (phoneError) setPhoneError('');
                  }}
                  placeholder="+91 98110 00000"
                  className="w-full py-2 px-3 bg-[#F4F6F9] border border-[#E2E8F0] rounded-lg text-slate-800 focus:outline-none focus:border-[#00BAF2] font-mono"
                />
                {phoneError && (
                  <p className="text-[10px] text-red-600 font-semibold">{phoneError}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#0F172A] uppercase tracking-wider text-[10px]">
                    Udhaar Amount (INR)
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formAmount}
                    onChange={(e) => setFormAmount(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="e.g. 500"
                    className="w-full py-2 px-3 bg-[#F4F6F9] border border-[#E2E8F0] rounded-lg text-slate-800 focus:outline-none focus:border-[#00BAF2] font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#0F172A] uppercase tracking-wider text-[10px]">
                    Due Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formDueDate}
                    onChange={(e) => setFormDueDate(e.target.value)}
                    className="w-full py-2 px-3 bg-[#F4F6F9] border border-[#E2E8F0] rounded-lg text-slate-800 focus:outline-none focus:border-[#00BAF2]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#0F172A] uppercase tracking-wider text-[10px]">
                  Purchase Description / Notes
                </label>
                <input
                  type="text"
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="e.g. Basmati Rice 5kg, Mustard Oil 2L"
                  className="w-full py-2 px-3 bg-[#F4F6F9] border border-[#E2E8F0] rounded-lg text-slate-800 focus:outline-none focus:border-[#00BAF2]"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="py-2 px-4 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-5 rounded-lg bg-[#00BAF2] hover:bg-[#009EDC] text-white font-bold transition-all shadow-sm active:scale-95"
                >
                  Save Entry
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {editingEntry && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-paytm-modal max-w-md w-full border border-[#E2E8F0] overflow-hidden">
            
            <div className="bg-[#002970] text-white px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Pencil size={16} className="text-[#00BAF2]" />
                <h3 className="text-sm font-bold tracking-tight">Edit Udhaar Entry</h3>
              </div>
              <button onClick={() => setEditingEntry(null)} className="text-white/60 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveUpdate} className="p-5 space-y-3.5 text-xs">
              
              <div className="space-y-1">
                <label className="font-bold text-[#0F172A] uppercase tracking-wider text-[10px]">
                  Customer Name
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full py-2 px-3 bg-[#F4F6F9] border border-[#E2E8F0] rounded-lg text-slate-800 focus:outline-none focus:border-[#00BAF2]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#0F172A] uppercase tracking-wider text-[10px]">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  required
                  value={formPhone}
                  onChange={(e) => {
                    setFormPhone(e.target.value);
                    if (phoneError) setPhoneError('');
                  }}
                  className="w-full py-2 px-3 bg-[#F4F6F9] border border-[#E2E8F0] rounded-lg text-slate-800 focus:outline-none focus:border-[#00BAF2] font-mono"
                />
                {phoneError && (
                  <p className="text-[10px] text-red-600 font-semibold">{phoneError}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#0F172A] uppercase tracking-wider text-[10px]">
                    Udhaar Amount (INR)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formAmount}
                    onChange={(e) => setFormAmount(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full py-2 px-3 bg-[#F4F6F9] border border-[#E2E8F0] rounded-lg text-slate-800 focus:outline-none focus:border-[#00BAF2] font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#0F172A] uppercase tracking-wider text-[10px]">
                    Due Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formDueDate}
                    onChange={(e) => setFormDueDate(e.target.value)}
                    className="w-full py-2 px-3 bg-[#F4F6F9] border border-[#E2E8F0] rounded-lg text-slate-800 focus:outline-none focus:border-[#00BAF2]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#0F172A] uppercase tracking-wider text-[10px]">
                  Purchase Description / Notes
                </label>
                <input
                  type="text"
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full py-2 px-3 bg-[#F4F6F9] border border-[#E2E8F0] rounded-lg text-slate-800 focus:outline-none focus:border-[#00BAF2]"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingEntry(null)}
                  className="py-2 px-4 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-5 rounded-lg bg-[#002970] hover:bg-[#001E53] text-white font-bold transition-all shadow-sm active:scale-95"
                >
                  Update Entry
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {deletingEntry && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-paytm-modal max-w-sm w-full border border-[#E2E8F0] p-5 space-y-4">
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-200">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#0F172A]">Delete Udhaar Entry</h3>
                <p className="text-xs text-[#64748B]">{deletingEntry.name}</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to delete this record (Rs. {deletingEntry.amount}) for <strong>{deletingEntry.name}</strong>?
            </p>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeletingEntry(null)}
                className="py-2 px-4 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="py-2 px-4 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold transition-all shadow-sm active:scale-95 text-xs"
              >
                Confirm Delete
              </button>
            </div>

          </div>
        </div>
      )}

      {clearedReceiptEntry && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-paytm-modal max-w-sm w-full border border-[#E2E8F0] p-6 text-center space-y-4">
            
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#10B981] mx-auto flex items-center justify-center border border-emerald-200">
              <ShieldCheck size={26} />
            </div>

            <div>
              <h3 className="text-base font-bold text-[#002970]">Udhaar Cleared Successfully</h3>
              <p className="text-xs text-[#10B981] font-semibold mt-0.5">
                {clearedReceiptEntry.name} is now eligible for all store deals
              </p>
            </div>

            <div className="bg-[#F4F6F9] p-3 rounded-lg border border-[#E2E8F0] text-xs space-y-1 text-left">
              <div className="flex justify-between">
                <span className="text-slate-500">Customer</span>
                <strong className="text-slate-800">{clearedReceiptEntry.name}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status</span>
                <strong className="text-[#10B981]">Paid in Full</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Store Offer Access</span>
                <strong className="text-[#10B981]">Active &amp; Restored</strong>
              </div>
            </div>

            <button
              onClick={() => setClearedReceiptEntry(null)}
              className="w-full bg-[#002970] hover:bg-[#001E53] text-white font-bold py-2 rounded-lg text-xs transition-colors"
            >
              Done
            </button>

          </div>
        </div>
      )}

    </div>
  );
};
