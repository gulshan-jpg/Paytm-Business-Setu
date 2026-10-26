import React from 'react';
import { 
  LayoutDashboard, 
  ShieldCheck, 
  Zap, 
  Receipt,
  Store,
  ChevronRight,
  QrCode,
  BookOpen,
  UserCheck,
  Bot,
  Sparkles
} from 'lucide-react';
import { TabType } from '../types';

interface SidebarProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  onOpenQrModal: () => void;
  urgentLoanClaimed?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  onOpenQrModal,
  urgentLoanClaimed = false
}) => {
  const navItems = [
    {
      id: 'overview' as TabType,
      label: 'Overview',
      icon: LayoutDashboard,
      badge: 'Live',
      isCoreModule: false
    },
    {
      id: 'ask-priya' as TabType,
      label: 'Ask Priya',
      icon: Bot,
      badge: 'Module 1',
      description: 'Kirana Copilot & Store Intelligence',
      isCoreModule: true
    },
    {
      id: 'verify-refund' as TabType,
      label: 'Verify & Refund Shield',
      icon: ShieldCheck,
      badge: 'Module 2',
      description: 'Sub-380ms UTR & Auto-Refund',
      isCoreModule: true
    },
    {
      id: 'udhaar-ledger' as TabType,
      label: 'Udhaar Ledger & Recovery',
      icon: BookOpen,
      badge: 'Module 3',
      description: 'OCR & WhatsApp Dynamic QR',
      isCoreModule: true
    },
    {
      id: 'urgent-loan' as TabType,
      label: 'AI Statement & Urgent Loan',
      icon: Zap,
      badge: 'Module 4',
      description: 'Rs. 5,000 Zero-cost credit',
      isCoreModule: true
    },
    {
      id: 'transactions-settlements' as TabType,
      label: 'Transactions & Settlements',
      icon: Receipt,
      badge: '142 Txns',
      isCoreModule: false
    },
    {
      id: 'profile' as TabType,
      label: 'Merchant Profile & KYC',
      icon: UserCheck,
      badge: 'KYC',
      description: 'GSTIN, PAN & Bank',
      isCoreModule: false
    }
  ];

  return (
    <aside className="w-72 bg-white dark:bg-[#111827] border-r border-[#E2E8F0] dark:border-slate-800 flex flex-col justify-between shrink-0 select-none hidden md:flex min-h-[calc(100vh-61px)] transition-colors duration-200">
      <div className="p-4 space-y-5">
        
        {/* Merchant Store Quick Card */}
        <div 
          onClick={() => onSelectTab('profile')}
          className="bg-[#F4F6F9] dark:bg-slate-800/80 hover:bg-sky-50/60 dark:hover:bg-slate-700/60 rounded-xl p-3 border border-[#E2E8F0] dark:border-slate-700 hover:border-[#00BAF2] cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-xs text-[#64748B] dark:text-slate-400">
            <span className="font-semibold uppercase text-[10px] tracking-wider group-hover:text-[#00BAF2]">Active Terminal</span>
            <span className="flex items-center gap-1 font-bold text-[#10B981] bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800 text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
              Online
            </span>
          </div>
          <p className="text-xs font-bold text-[#002970] dark:text-white mt-1 truncate group-hover:text-[#00BAF2] transition-colors">
            Sharma General Store
          </p>
          <div className="flex items-center justify-between text-[11px] text-[#64748B] dark:text-slate-400 font-mono mt-0.5">
            <span>MID: #PTM889012</span>
            <span className="text-[#00BAF2] text-[10px] font-sans font-bold flex items-center">
              KYC Active <ChevronRight size={10} />
            </span>
          </div>
        </div>

        {/* Navigation Item Links */}
        <nav className="space-y-1">
          <p className="px-3 text-[10px] font-black uppercase tracking-wider text-[#64748B] dark:text-slate-400 mb-2">
            Main Operations Menu
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs transition-all ${
                  isActive 
                    ? 'bg-[#002970] text-white font-bold shadow-sm' 
                    : 'text-[#0F172A] dark:text-slate-200 hover:bg-[#F4F6F9] dark:hover:bg-slate-800 font-semibold'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <div className={`p-1.5 rounded-lg ${
                    isActive 
                      ? 'bg-[#00BAF2] text-[#002970]' 
                      : item.isCoreModule 
                        ? 'bg-[#00BAF2]/10 text-[#00BAF2] dark:bg-[#00BAF2]/20' 
                        : 'bg-slate-100 dark:bg-slate-800 text-[#002970] dark:text-slate-300'
                  }`}>
                    <Icon size={16} />
                  </div>
                  <div className="truncate">
                    <span className="block truncate">{item.label}</span>
                    {item.description && (
                      <span className={`block text-[10px] font-normal truncate ${
                        isActive ? 'text-sky-200' : 'text-[#64748B] dark:text-slate-400'
                      }`}>
                        {item.description}
                      </span>
                    )}
                  </div>
                </div>

                {item.badge && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                    isActive 
                      ? 'bg-white/20 text-white' 
                      : item.isCoreModule
                        ? 'bg-[#00BAF2] text-[#002970] font-black'
                        : 'bg-slate-100 dark:bg-slate-800 text-[#64748B] dark:text-slate-300'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Prototype Banner for Unbuilt Paytm Modules */}
        <div className="pt-2">
          <p className="px-3 text-[10px] font-black uppercase tracking-wider text-[#64748B] dark:text-slate-400 mb-1.5">
            Paytm Enterprise Apps
          </p>
          <div className="space-y-1">
            {[
              { label: 'Paytm Soundbox Ads Hub', tag: 'Demo' },
              { label: 'Merchant Khata Reconciliation', tag: 'Demo' },
              { label: 'Paytm Food & Billing POS', tag: 'Preview' }
            ].map((p, idx) => (
              <div 
                key={idx}
                className="px-3 py-1.5 rounded-lg text-[11px] text-[#64748B] dark:text-slate-400 flex items-center justify-between opacity-70 hover:opacity-100 transition-opacity cursor-not-allowed"
                title="Prototype simulation only"
              >
                <span>{p.label}</span>
                <span className="text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-500 px-1 rounded border border-slate-200 dark:border-slate-700">
                  {p.tag}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom Download Banner */}
      <div className="p-4 border-t border-[#E2E8F0] dark:border-slate-800 space-y-3">
        <button
          onClick={onOpenQrModal}
          className="w-full bg-gradient-to-r from-[#00BAF2] to-[#009EDC] hover:from-[#009EDC] hover:to-[#002970] text-white py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95"
        >
          <QrCode size={14} />
          <span>Print Store QR Standee</span>
        </button>

        <div className="flex items-center justify-between text-[10px] text-[#64748B] dark:text-slate-400 font-mono">
          <span>Paytm Core v4.8</span>
          <span className="text-[#10B981] font-bold">Encrypted 256-bit</span>
        </div>
      </div>
    </aside>
  );
};
