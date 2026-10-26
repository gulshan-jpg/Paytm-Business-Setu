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
  Tag, 
  Receipt, 
  Smartphone, 
  Check,
  BookOpen
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
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[10px] font-bold px-2 py-0.5 rounded-full">
                0% MDR
              </span>
            </div>
            <p className="text-xs text-white/80 mt-0.5">
              Auto-Settlement scheduled at <strong className="text-white">11:00 PM tonight</strong> to HDFC Bank Account ****4102. Or settle instantly right now.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <button
            onClick={onOpenSettlementModal}
            className="flex-1 md:flex-none flex items-center justify-center gap-1.5 bg-[#10B981] hover:bg-emerald-600 text-white font-bold px-4 py-2 rounded-lg text-xs transition-all shadow-sm active:scale-95"
          >
            <ArrowUpRight size={14} />
            <span>Transfer Instantly</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 border border-[#E2E8F0] shadow-paytm-card relative overflow-hidden group hover:border-[#00BAF2]/50 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Today's Collection
            </span>
            <span className="flex items-center gap-0.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <TrendingUp size={12} /> +18.4%
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#002970] tracking-tight">
              Rs. {todayCollection.toLocaleString('en-IN')}
            </span>
          </div>

          <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
            <strong className="text-slate-800 font-semibold">{transactionsCount} Transactions</strong> via QR &amp; Soundbox
          </p>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Avg Ticket Size: <strong className="text-slate-700">Rs. {Math.round(todayCollection / (transactionsCount || 1))}</strong></span>
            <button 
              onClick={() => onNavigateToTab('transactions-settlements')}
              className="text-[#00BAF2] hover:text-[#002970] font-semibold flex items-center gap-0.5"
            >
              View Feed <ChevronRight size={12} />
            </button>
          </div>
          <div className="absolute top-0 right-0 h-1 w-full bg-gradient-to-r from-[#002970] to-[#00BAF2]" />
        </div>

        {/* Metric 2: Pending Bank Settlement */}
        <div className="bg-white rounded-xl p-4 border border-[#E2E8F0] shadow-paytm-card relative overflow-hidden group hover:border-[#00BAF2]/50 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Pending Bank Settlement
            </span>
            <span className="flex items-center gap-1 text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 font-medium">
              <Clock size={11} /> Auto 11:00 PM
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#002970] tracking-tight">
              Rs. {pendingSettlementAmount.toLocaleString('en-IN')}
            </span>
          </div>

          <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
            Linked to: <strong className="text-slate-800 font-medium">HDFC Bank A/C ****4102</strong>
          </p>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
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

        <div className="bg-white rounded-xl p-4 border border-[#E2E8F0] shadow-paytm-card relative overflow-hidden group hover:border-[#00BAF2]/50 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Active Soundbox Status
            </span>
            <span className="flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-semibold">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              Online &amp; Chime Ready
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-[#002970] flex items-center gap-1.5">
              <span>Paytm AI Soundbox v3</span>
              <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded font-mono font-bold">4G Active</span>
            </span>
          </div>

          <p className="text-xs text-slate-500 mt-2">
            Language: <strong className="text-slate-800">{telemetry.language}</strong> • Battery: <strong className="text-emerald-600">{telemetry.batteryLevel}%</strong>
          </p>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
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

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#002970]">Paytm Business Setu Core Modules</h3>
            <p className="text-xs text-[#64748B]">Specialized retail capabilities built directly into your merchant workflow</p>
          </div>
          <span className="text-xs font-bold text-[#00BAF2] font-mono">
            4 Ready Modules
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div 
            onClick={() => onNavigateToTab('verify-refund')}
            className="bg-white rounded-xl p-5 border border-[#E2E8F0] hover:border-[#00BAF2] shadow-paytm-card cursor-pointer transition-all group relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#002970] bg-blue-50 px-2 py-0.5 rounded font-mono uppercase">
                Module 1
              </span>
              <span className="w-2 h-2 rounded-full bg-[#10B981]" />
            </div>

            <div className="mt-3 space-y-1">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-[#00BAF2]" />
                <h4 className="text-sm font-bold text-[#002970] group-hover:text-[#00BAF2] transition-colors">
                  Verify &amp; Refund Shield
                </h4>
              </div>
              <p className="text-xs text-[#64748B]">
                Instant 380ms UPI verification and auto-reversal for stuck customer payments.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#00BAF2]">
              <span>Scan Screenshot</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
            <div className="absolute top-0 left-0 w-1 h-full bg-[#00BAF2]" />
          </div>

          <div 
            onClick={() => onNavigateToTab('udhaar-ledger')}
            className="bg-white rounded-xl p-5 border border-[#E2E8F0] hover:border-[#00BAF2] shadow-paytm-card cursor-pointer transition-all group relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#002970] bg-blue-50 px-2 py-0.5 rounded font-mono uppercase">
                Module 2
              </span>
              <span className="text-[10px] text-amber-700 font-bold bg-amber-50 px-1.5 rounded">
                Bahi-Khata AI
              </span>
            </div>

            <div className="mt-3 space-y-1">
              <div className="flex items-center gap-2">
                <BookOpen size={18} className="text-[#00BAF2]" />
                <h4 className="text-sm font-bold text-[#002970] group-hover:text-[#00BAF2] transition-colors">
                  Udhaar &amp; Recovery
                </h4>
              </div>
              <p className="text-xs text-[#64748B]">
                Physical register OCR, WhatsApp QR links, and overdue offer locks.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#00BAF2]">
              <span>Manage Khata</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
            <div className="absolute top-0 left-0 w-1 h-full bg-[#002970]" />
          </div>

          <div 
            onClick={() => onNavigateToTab('urgent-loan')}
            className="bg-white rounded-xl p-5 border border-[#E2E8F0] hover:border-[#00BAF2] shadow-paytm-card cursor-pointer transition-all group relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#002970] bg-blue-50 px-2 py-0.5 rounded font-mono uppercase">
                Module 3
              </span>
              <span className="text-[10px] text-[#10B981] font-bold bg-emerald-50 px-1.5 rounded">
                Rs. 0 Interest
              </span>
            </div>

            <div className="mt-3 space-y-1">
              <div className="flex items-center gap-2">
                <Zap size={18} className="text-[#00BAF2]" />
                <h4 className="text-sm font-bold text-[#002970] group-hover:text-[#00BAF2] transition-colors">
                  AI Statement &amp; Urgent Loan
                </h4>
              </div>
              <p className="text-xs text-[#64748B]">
                Pre-approved Rs. 5,000 zero-cost credit line auto-settled at 11:00 PM tonight.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#00BAF2]">
              <span>{urgentLoanClaimed ? 'Loan Active (Rs. 5,000)' : 'Claim Emergency Credit'}</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
            <div className="absolute top-0 left-0 w-1 h-full bg-[#00BAF2]" />
          </div>

          <div 
            onClick={() => onNavigateToTab('merchant-offers')}
            className="bg-white rounded-xl p-5 border border-[#E2E8F0] hover:border-[#00BAF2] shadow-paytm-card cursor-pointer transition-all group relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#002970] bg-blue-50 px-2 py-0.5 rounded font-mono uppercase">
                Module 4
              </span>
              <span className="text-[10px] text-sky-700 font-bold bg-sky-50 px-1.5 rounded">
                +32% Repeat
              </span>
            </div>

            <div className="mt-3 space-y-1">
              <div className="flex items-center gap-2">
                <Tag size={18} className="text-[#00BAF2]" />
                <h4 className="text-sm font-bold text-[#002970] group-hover:text-[#00BAF2] transition-colors">
                  Check Merchant Offers
                </h4>
              </div>
              <p className="text-xs text-[#64748B]">
                Post-payment rewards (Rs. 10 to Rs. 50 OFF) flashing directly in customer phones.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#00BAF2]">
              <span>Configure Offers</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
            <div className="absolute top-0 left-0 w-1 h-full bg-[#002970]" />
          </div>

        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl p-5 border border-[#E2E8F0] shadow-paytm-card">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div>
              <h3 className="text-sm font-bold text-[#002970]">Hourly Collection Trend</h3>
              <p className="text-xs text-slate-500">Peak customer footfall between 06:00 PM – 08:00 PM</p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center gap-1 text-slate-500">
                <span className="w-2.5 h-2.5 bg-[#002970] rounded-sm" /> Today
              </span>
              <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono font-medium">
                15 Time Slots
              </span>
            </div>
          </div>

          <div className="h-52 flex items-end justify-between gap-1.5 pt-6 pb-2 border-b border-slate-100">
            {HOURLY_DATA.map((item, idx) => {
              const heightPercent = Math.round((item.sales / maxHourlySales) * 100);
              const isPeak = item.sales >= 4800;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1 group relative">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-10 bg-slate-900 text-white text-[10px] py-1 px-2 rounded pointer-events-none z-10 whitespace-nowrap shadow-lg">
                    Rs. {item.sales} ({item.count} txns)
                  </div>

                  <div className="w-full flex justify-center h-36 items-end">
                    <div 
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full max-w-[20px] rounded-t transition-all ${
                        isPeak 
                          ? 'bg-[#00BAF2] hover:bg-sky-400' 
                          : 'bg-[#002970]/80 hover:bg-[#002970]'
                      }`}
                    />
                  </div>
                  <span className="text-[9px] text-slate-400 group-hover:text-slate-800 transition-colors truncate">
                    {item.hour.replace(' ', '')}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#00BAF2]" /> Peak Evening Rush (7 PM): Rs. 5,200 (42 payments)
            </span>
            <span className="text-slate-400 font-mono text-[11px]">Updated every 60s</span>
          </div>
        </div>

        <div className="bg-gradient-to-b from-blue-50/70 to-white rounded-xl p-5 border border-blue-200/80 shadow-paytm-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-[#002970] text-white">
                  <QrCode size={18} />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-[#002970]">Printable Store QR</h3>
                  <p className="text-[11px] text-slate-500 font-mono">sharmageneral@paytm</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                Active
              </span>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-xs text-center my-2">
              <div className="bg-[#002970] text-white py-1 rounded-t-lg -mx-3 -mt-3 text-[10px] font-bold flex items-center justify-center gap-1">
                <span>Paytm Business Setu Standee</span>
              </div>
              <div className="py-3 flex flex-col items-center">
                <div className="w-24 h-24 bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center relative overflow-hidden">
                  <QrCode size={64} className="text-[#002970]" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white px-1 rounded text-[8px] font-bold text-[#002970] shadow-sm">
                      Paytm
                    </div>
                  </div>
                </div>
                <p className="text-xs font-bold text-[#002970] mt-1.5">Sharma General Store</p>
                <p className="text-[10px] text-slate-400 font-mono">Scan &amp; Pay using any UPI App</p>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <button
              onClick={onOpenQrModal}
              className="w-full bg-[#002970] hover:bg-[#001E53] text-white py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
            >
              <Download size={13} />
              <span>Download Printable Poster</span>
            </button>

            <button
              onClick={onOpenQrModal}
              className="w-full bg-white hover:bg-slate-50 text-slate-700 py-1.5 rounded-lg text-xs font-semibold transition-colors border border-slate-200 flex items-center justify-center gap-1"
            >
              <Share2 size={12} />
              <span>Share QR with Customer</span>
            </button>
          </div>
        </div>

      </div>

      <div className="bg-white rounded-xl p-5 border border-[#E2E8F0] shadow-paytm-card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-[#002970]">Recent QR &amp; Soundbox Transactions</h3>
            <span className="flex items-center gap-1 text-[11px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold border border-emerald-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live Stream
            </span>
          </div>
          <button
            onClick={() => onNavigateToTab('transactions-settlements')}
            className="text-xs font-bold text-[#00BAF2] hover:text-[#002970] transition-colors flex items-center gap-1"
          >
            View All ({transactionsCount}) <ChevronRight size={14} />
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {recentTransactions.slice(0, 4).map((txn) => (
            <div key={txn.id} className="py-3 flex items-center justify-between hover:bg-slate-50/70 px-2 rounded-lg transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-50 text-[#002970] font-bold text-xs flex items-center justify-center border border-blue-100">
                  {txn.customerName.slice(0, 1)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800">{txn.customerName}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{txn.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    <span>{txn.method}</span>
                    <span>•</span>
                    <span className="font-mono text-slate-400">RRN: {txn.rrn}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span className="text-sm font-black text-emerald-600 font-mono">
                  +Rs. {txn.amount.toLocaleString('en-IN')}
                </span>
                <div className="flex items-center justify-end gap-1 text-[10px] text-slate-400 mt-0.5">
                  <CheckCircle2 size={11} className="text-emerald-500" />
                  <span>Success</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
