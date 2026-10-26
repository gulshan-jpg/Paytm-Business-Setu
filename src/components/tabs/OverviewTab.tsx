import React from 'react';
import { 
  TrendingUp, 
  ArrowUpRight, 
  QrCode, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  Download, 
  Share2, 
  Zap, 
  ArrowRight, 
  ShieldCheck, 
  Receipt, 
  Smartphone, 
  Check,
  BookOpen,
  Bot,
  Sparkles,
  Layers,
  FileSpreadsheet,
  Megaphone,
  CreditCard,
  Star
} from 'lucide-react';
import { Transaction, SoundboxTelemetry, TabType } from '../../types';
import { HOURLY_DATA } from '../../data/mockData';

interface OverviewTabProps {
  todayCollection: number;
  transactionsCount: number;
  pendingSettlementAmount: number;
  telemetry: SoundboxTelemetry;
  recentTransactions: Transaction[];
  onOpenQrModal: () => void;
  onOpenSettlementModal: () => void;
  onOpenSoundboxModal: () => void;
  onNavigateToTab: (tab: TabType) => void;
  urgentLoanClaimed?: boolean;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  todayCollection,
  transactionsCount,
  pendingSettlementAmount,
  telemetry,
  recentTransactions,
  onOpenQrModal,
  onOpenSettlementModal,
  onOpenSoundboxModal,
  onNavigateToTab,
  urgentLoanClaimed = false
}) => {
  const maxHourlySales = Math.max(...HOURLY_DATA.map(d => d.sales));

  return (
    <div className="space-y-6">
      
      {/* Ask Priya Hero Banner - Clickable Copilot Invitation */}
      <div 
        onClick={() => onNavigateToTab('ask-priya')} 
        className="bg-gradient-to-r from-[#002970] via-[#003da5] to-[#002970] text-white rounded-2xl p-4 md:p-5 border-2 border-[#00BAF2] shadow-lg cursor-pointer hover:shadow-xl hover:border-white transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group relative overflow-hidden"
      >
        <div className="flex items-center gap-3.5 relative z-10">
          <div className="w-13 h-13 rounded-2xl bg-[#00BAF2] text-[#002970] flex items-center justify-center font-black shrink-0 shadow-md group-hover:scale-105 transition-transform">
            <span className="text-2xl font-black">P</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm md:text-base font-bold text-white flex items-center gap-1.5">
                Ask Priya
                <span className="bg-[#00BAF2] text-[#002970] text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Module 1 • Main Feature
                </span>
              </h3>
            </div>
            <p className="text-xs text-sky-200 mt-0.5">
              Live Kirana advisor with female voice: instant answers on Peak hours, Shop timings, Bahi-Khata udhaar, and 0% capital.
            </p>
          </div>
        </div>
        <button className="bg-[#00BAF2] group-hover:bg-white group-hover:text-[#002970] text-[#002970] font-black px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all shrink-0 shadow-sm relative z-10">
          <span>Talk to Priya</span>
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Top Settlement Alert Strip */}
      <div className="bg-gradient-to-r from-[#002970] via-[#003896] to-[#002970] text-white rounded-xl p-4 shadow-paytm-card border border-[#00BAF2]/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#00BAF2]/20 border border-[#00BAF2]/40 flex items-center justify-center text-[#00BAF2] shrink-0">
            <Zap size={20} className="fill-[#00BAF2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold tracking-tight">
                Pending Settlement: Rs. {pendingSettlementAmount.toLocaleString('en-IN')}
              </h2>
              <span className="text-[10px] font-bold bg-[#10B981] text-white px-2 py-0.5 rounded-full">
                0% Fee Active
              </span>
            </div>
            <p className="text-xs text-sky-200 mt-0.5">
              Scheduled auto-settlement to HDFC Bank A/C ****4102 at 11:00 PM tonight. Instant IMPS available now.
            </p>
          </div>
        </div>

        <button 
          onClick={onOpenSettlementModal}
          className="bg-[#00BAF2] hover:bg-[#009EDC] text-white px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 shrink-0 active:scale-95"
        >
          <span>Transfer Instantly</span>
          <ArrowRight size={14} />
        </button>
      </div>

      {/* Top Row: Metric Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Today's Gross Collections */}
        <div className="bg-white dark:bg-[#111827] rounded-xl p-4 border border-[#E2E8F0] dark:border-slate-800 shadow-paytm-card relative overflow-hidden group hover:border-[#00BAF2]/50 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Today's Gross Collection
            </span>
            <span className="flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-semibold">
              <TrendingUp size={11} /> +18.4%
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#002970] dark:text-white tracking-tight">
              Rs. {todayCollection.toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-slate-500 font-medium">gross</span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            Across <strong className="text-slate-800 dark:text-slate-200">{transactionsCount} transactions</strong> • Avg Ticket: <strong className="text-[#002970] dark:text-[#00BAF2]">Rs. 130</strong>
          </p>

          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
            <span>Paytm UPI: 82%</span>
            <button 
              onClick={() => onNavigateToTab('transactions-settlements')}
              className="text-[#00BAF2] hover:underline font-semibold flex items-center gap-0.5"
            >
              View Passbook <ArrowUpRight size={12} />
            </button>
          </div>
          <div className="absolute top-0 right-0 h-1 w-full bg-gradient-to-r from-[#00BAF2] to-[#002970]" />
        </div>

        {/* Pending Bank Settlement */}
        <div className="bg-white dark:bg-[#111827] rounded-xl p-4 border border-[#E2E8F0] dark:border-slate-800 shadow-paytm-card relative overflow-hidden group hover:border-[#00BAF2]/50 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Pending Bank Settlement
            </span>
            <span className="flex items-center gap-1 text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 font-medium">
              <Clock size={11} /> Auto 11:00 PM
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#002970] dark:text-white tracking-tight">
              Rs. {pendingSettlementAmount.toLocaleString('en-IN')}
            </span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-1">
            Linked to: <strong className="text-slate-800 dark:text-slate-200 font-medium">HDFC Bank A/C ****4102</strong>
          </p>

          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
            <span className="text-emerald-600 font-medium">0% Transfer Fee</span>
            <button 
              onClick={onOpenSettlementModal}
              className="text-[#10B981] hover:underline font-bold flex items-center gap-0.5"
            >
              Settle Now <ArrowUpRight size={12} />
            </button>
          </div>
          <div className="absolute top-0 right-0 h-1 w-full bg-gradient-to-r from-emerald-500 to-teal-400" />
        </div>

        {/* Active Soundbox Status */}
        <div className="bg-white dark:bg-[#111827] rounded-xl p-4 border border-[#E2E8F0] dark:border-slate-800 shadow-paytm-card relative overflow-hidden group hover:border-[#00BAF2]/50 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Active Soundbox Status
            </span>
            <span className="flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-semibold">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              Online &amp; Chime Ready
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-[#002970] dark:text-white flex items-center gap-1.5">
              <span>Paytm AI Soundbox v3</span>
              <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded font-mono font-bold">4G Active</span>
            </span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            Language: <strong className="text-slate-800 dark:text-slate-200">{telemetry.language}</strong> • Battery: <strong className="text-emerald-600">{telemetry.batteryLevel}%</strong>
          </p>

          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
            <span>{telemetry.broadcastsToday} broadcasts today</span>
            <button 
              onClick={onOpenSoundboxModal}
              className="text-[#00BAF2] hover:text-[#002970] font-semibold flex items-center gap-0.5"
            >
              Diagnostics <ChevronRight size={12} />
            </button>
          </div>
          <div className="absolute top-0 right-0 h-1 w-full bg-gradient-to-r from-[#00BAF2] to-blue-600" />
        </div>

      </div>

      {/* 4 CORE PROJECT PILLARS (HIGHLIGHTED) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
          <div>
            <h3 className="text-base font-black text-[#002970] dark:text-white flex items-center gap-2">
              <Star size={18} className="text-[#00BAF2] fill-[#00BAF2]" />
              <span>4 Core Pillars of Paytm Business Setu (Primary Features)</span>
            </h3>
            <p className="text-xs text-[#64748B] dark:text-slate-400">
              The 4 foundational pillars designed for Kirana merchants — click any card to interact with the live engine.
            </p>
          </div>
          <span className="text-xs font-bold text-[#002970] dark:text-[#00BAF2] bg-sky-50 dark:bg-slate-800 px-3 py-1 rounded-full border border-sky-200 dark:border-slate-700">
            100% Interactive
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Pillar 1: Ask Priya */}
          <div 
            onClick={() => onNavigateToTab('ask-priya')}
            className="bg-white dark:bg-[#111827] rounded-2xl p-5 border-2 border-[#00BAF2] shadow-md hover:shadow-xl cursor-pointer transition-all group relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black text-white bg-[#002970] dark:bg-[#00BAF2] dark:text-[#002970] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Pillar 1
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-ping" />
            </div>

            <div className="mt-4 space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#00BAF2]/10 text-[#00BAF2] flex items-center justify-center font-black">
                  P
                </div>
                <h4 className="text-base font-black text-[#002970] dark:text-white group-hover:text-[#00BAF2] transition-colors">
                  Ask Priya
                </h4>
              </div>
              <p className="text-xs text-[#64748B] dark:text-slate-400 leading-relaxed">
                Kirana advisor with girl voice: peak traffic windows, open/do-not-close hours &amp; full store data scan.
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-black text-[#00BAF2]">
              <span>Ask Priya Now</span>
              <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform" />
            </div>
            <div className="absolute top-0 left-0 w-1.5 h-full bg-[#00BAF2]" />
          </div>

          {/* Pillar 2: Verify & Refund Shield */}
          <div 
            onClick={() => onNavigateToTab('verify-refund')}
            className="bg-white dark:bg-[#111827] rounded-2xl p-5 border border-[#E2E8F0] dark:border-slate-800 hover:border-[#00BAF2] shadow-paytm-card hover:shadow-md cursor-pointer transition-all group relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black text-[#002970] bg-blue-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Pillar 2
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
            </div>

            <div className="mt-4 space-y-1.5">
              <div className="flex items-center gap-2">
                <ShieldCheck size={20} className="text-[#00BAF2]" />
                <h4 className="text-base font-black text-[#002970] dark:text-white group-hover:text-[#00BAF2] transition-colors">
                  Verify &amp; Refund
                </h4>
              </div>
              <p className="text-xs text-[#64748B] dark:text-slate-400 leading-relaxed">
                Sub-380ms UTR screenshot verification and instant bank auto-refund with dynamic Re-Pay QR.
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-[#00BAF2]">
              <span>Scan Screenshot</span>
              <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform" />
            </div>
            <div className="absolute top-0 left-0 w-1.5 h-full bg-[#00BAF2]" />
          </div>

          {/* Pillar 3: Udhaar Ledger & Recovery */}
          <div 
            onClick={() => onNavigateToTab('udhaar-ledger')}
            className="bg-white dark:bg-[#111827] rounded-2xl p-5 border border-[#E2E8F0] dark:border-slate-800 hover:border-[#00BAF2] shadow-paytm-card hover:shadow-md cursor-pointer transition-all group relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Pillar 3
              </span>
              <span className="text-[10px] text-amber-600 font-bold bg-amber-100/60 px-1.5 rounded">
                Bahi-Khata
              </span>
            </div>

            <div className="mt-4 space-y-1.5">
              <div className="flex items-center gap-2">
                <BookOpen size={20} className="text-[#00BAF2]" />
                <h4 className="text-base font-black text-[#002970] dark:text-white group-hover:text-[#00BAF2] transition-colors">
                  Neural Bahi-Khata
                </h4>
              </div>
              <p className="text-xs text-[#64748B] dark:text-slate-400 leading-relaxed">
                Paper register OCR digitization, automated WhatsApp QR collection links, and automated reminders.
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-[#00BAF2]">
              <span>Manage Khata</span>
              <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform" />
            </div>
            <div className="absolute top-0 left-0 w-1.5 h-full bg-[#00BAF2]" />
          </div>

          {/* Pillar 4: Urgent Loan */}
          <div 
            onClick={() => onNavigateToTab('urgent-loan')}
            className="bg-white dark:bg-[#111827] rounded-2xl p-5 border border-[#E2E8F0] dark:border-slate-800 hover:border-[#00BAF2] shadow-paytm-card hover:shadow-md cursor-pointer transition-all group relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Pillar 4
              </span>
              <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100/60 px-1.5 rounded">
                0% APR
              </span>
            </div>

            <div className="mt-4 space-y-1.5">
              <div className="flex items-center gap-2">
                <Zap size={20} className="text-[#00BAF2]" />
                <h4 className="text-base font-black text-[#002970] dark:text-white group-hover:text-[#00BAF2] transition-colors">
                  0% Urgent Capital
                </h4>
              </div>
              <p className="text-xs text-[#64748B] dark:text-slate-400 leading-relaxed">
                Instant ₹5,000 credit for restock underwritten by QR velocity with auto 11 PM deduction.
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-[#00BAF2]">
              <span>{urgentLoanClaimed ? 'Loan Active' : 'Check Eligibility'}</span>
              <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform" />
            </div>
            <div className="absolute top-0 left-0 w-1.5 h-full bg-[#00BAF2]" />
          </div>

        </div>
      </div>

      {/* Hourly Sales Visualizer */}
      <div className="bg-white dark:bg-[#111827] rounded-xl p-5 border border-[#E2E8F0] dark:border-slate-800 shadow-paytm-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-[#002970] dark:text-white flex items-center gap-2">
              <span>Today's Hourly Sales Velocity</span>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold">
                Peak: 7:00 PM (Rs. 5,200)
              </span>
            </h3>
            <p className="text-xs text-[#64748B] dark:text-slate-400">
              Live Soundbox transactions grouped by hour. Highlighted bars indicate prime grocery rush hours.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs text-[#64748B] dark:text-slate-400 font-medium">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-[#00BAF2]" /> Rush Windows (6 PM–8:30 PM)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-[#002970]" /> Regular Hours
            </span>
          </div>
        </div>

        {/* Visual Bar Chart */}
        <div className="pt-2">
          <div className="flex items-end gap-1.5 sm:gap-2 h-44 px-2 w-full">
            {HOURLY_DATA.map((item, index) => {
              const heightPercent = Math.max(12, Math.round((item.sales / maxHourlySales) * 100));
              const isPeak = item.hour === '06 PM' || item.hour === '07 PM' || item.hour === '08 PM' || item.hour === '09 AM';
              return (
                <div key={index} className="flex-1 min-w-0 flex flex-col items-center gap-1.5 group relative h-full justify-end">
                  {/* Tooltip on hover */}
                  <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-[#002970] text-white text-[10px] py-1 px-2 rounded pointer-events-none whitespace-nowrap z-20 shadow-lg">
                    <p className="font-bold">Rs. {item.sales.toLocaleString('en-IN')}</p>
                    <p className="text-sky-200">{item.count} payments</p>
                  </div>

                  <div 
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full rounded-t-md transition-all group-hover:scale-105 duration-200 ${
                      isPeak 
                        ? 'bg-gradient-to-t from-[#00BAF2] to-sky-300 shadow-xs' 
                        : 'bg-gradient-to-t from-[#002970] to-[#003896] dark:from-slate-700 dark:to-slate-600'
                    }`}
                  />
                  <span className="text-[9px] font-mono font-medium text-slate-500 dark:text-slate-400 truncate w-full text-center">
                    {item.hour.split(' ')[0]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Official Paytm Enterprise Ecosystem Apps (Simulated / Prototype Showcase) */}
      <div className="bg-white dark:bg-[#111827] rounded-xl p-5 border border-[#E2E8F0] dark:border-slate-800 shadow-paytm-card space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#002970] dark:text-white flex items-center gap-2">
              <Layers size={14} className="text-[#00BAF2]" />
              <span>Official Paytm Merchant Business Suite (Connected Services)</span>
            </h4>
            <p className="text-[11px] text-[#64748B] dark:text-slate-400">These additional services are part of the Paytm enterprise ecosystem preview.</p>
          </div>
          <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
            Prototype Preview
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-[#F8FAFC] dark:bg-slate-800/50 opacity-80 hover:opacity-100 transition-opacity">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-[#002970] dark:text-white">Paytm Soundbox Ad-Network</span>
              <span className="text-[9px] bg-slate-200 text-slate-600 px-1 rounded font-bold">Demo</span>
            </div>
            <p className="text-[11px] text-[#64748B] dark:text-slate-400">Earn ₹150–₹400/month by enabling 3-second sponsored audio jingles (Coca-Cola, Amul) post customer payments.</p>
          </div>

          <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-[#F8FAFC] dark:bg-slate-800/50 opacity-80 hover:opacity-100 transition-opacity">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-[#002970] dark:text-white">GST B2B Invoicing Automator</span>
              <span className="text-[9px] bg-slate-200 text-slate-600 px-1 rounded font-bold">Demo</span>
            </div>
            <p className="text-[11px] text-[#64748B] dark:text-slate-400">Automatic GSTR-1 CSV sync for wholesale supplier billings and tax reconciliation directly from QR data.</p>
          </div>

          <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-[#F8FAFC] dark:bg-slate-800/50 opacity-80 hover:opacity-100 transition-opacity">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-[#002970] dark:text-white">Paytm Card POS Machine (Bluetooth)</span>
              <span className="text-[9px] bg-slate-200 text-slate-600 px-1 rounded font-bold">Demo</span>
            </div>
            <p className="text-[11px] text-[#64748B] dark:text-slate-400">Pair your pocket RuPay/Visa/MasterCard tap-to-pay mini POS device with zero monthly rental.</p>
          </div>
        </div>
      </div>

    </div>
  );
};
