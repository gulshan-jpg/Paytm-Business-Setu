import React from 'react';
import { 
  LayoutDashboard, 
  ShieldCheck, 
  Zap, 
  Tag, 
  Receipt,
  Store,
  ChevronRight,
  QrCode,
  BookOpen,
  UserCheck
} from 'lucide-react';
import { TabType } from '../types';

interface SidebarProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  onOpenQrModal: () => void;
  urgentLoanClaimed?: boolean;
  offersCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  onOpenQrModal,
  urgentLoanClaimed = false,
  offersCount = 3
}) => {
  const navItems = [
    {
      id: 'overview' as TabType,
      label: 'Overview',
      icon: LayoutDashboard,
      badge: 'Live'
    },
    {
      id: 'verify-refund' as TabType,
      label: 'Verify & Refund Shield',
      icon: ShieldCheck,
      badge: 'Module 1',
      description: 'Soundbox audio delay solver'
    },
    {
      id: 'udhaar-ledger' as TabType,
      label: 'Udhaar Ledger & Recovery',
      icon: BookOpen,
      badge: 'Module 2',
      description: 'OCR & Offer Exclusion'
    },
    {
      id: 'urgent-loan' as TabType,
      label: 'AI Statement & Urgent Loan',
      icon: Zap,
      badge: 'Module 3',
      description: 'Rs. 5,000 Zero-cost credit'
    },
    {
      id: 'merchant-offers' as TabType,
      label: 'Check Merchant Offers',
      icon: Tag,
      badge: 'Module 4',
      description: 'Repeat customer engine'
    },
    {
      id: 'transactions-settlements' as TabType,
      label: 'Transactions & Settlements',
      icon: Receipt,
      badge: '142 Txns'
    },
    {
      id: 'profile' as TabType,
      label: 'Merchant Profile & KYC',
      icon: UserCheck,
      badge: 'KYC',
      description: 'GSTIN, PAN & Bank'
    }
  ];

  return (
    <aside className="w-72 bg-white border-r border-[#E2E8F0] flex flex-col justify-between shrink-0 select-none hidden md:flex min-h-[calc(100vh-61px)]">
      <div className="p-4 space-y-6">
        
        <div 
          onClick={() => onSelectTab('profile')}
          className="bg-[#F4F6F9] hover:bg-sky-50/60 rounded-lg p-3 border border-[#E2E8F0] hover:border-[#00BAF2] cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-xs text-[#64748B]">
            <span className="font-semibold uppercase text-[10px] tracking-wider group-hover:text-[#00BAF2]">Active Terminal</span>
            <span className="flex items-center gap-1 font-bold text-[#10B981] bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
              Online
            </span>
          </div>
          <p className="text-xs font-bold text-[#002970] mt-1 truncate group-hover:text-[#00BAF2] transition-colors">
            Sharma General Store
          </p>
          <div className="flex items-center justify-between text-[11px] text-[#64748B] font-mono mt-0.5">
            <span>MID: #PTM889012</span>
            <span className="text-[#00BAF2] font-sans font-bold text-[10px]">View Profile</span>
          </div>
        </div>

        <div className="space-y-1.5">
          <p className="px-3 text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
            Navigation Menu
          </p>

          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-lg text-left transition-all group ${
                  isActive
                    ? 'bg-[#002970] text-white shadow-sm'
                    : 'text-[#0F172A] hover:bg-[#F4F6F9]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-md transition-colors ${
                    isActive 
                      ? 'bg-[#00BAF2] text-[#002970]' 
                      : 'bg-[#F4F6F9] text-[#002970] group-hover:bg-[#E2E8F0]'
                  }`}>
                    <Icon size={18} />
                  </div>
                  <div>
                    <span className={`text-xs font-bold block ${isActive ? 'text-white' : 'text-[#0F172A]'}`}>
                      {item.label}
                    </span>
                    {item.description && (
                      <span className={`text-[10px] block truncate max-w-[140px] ${
                        isActive ? 'text-sky-200' : 'text-[#64748B]'
                      }`}>
                        {item.description}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded font-mono ${
                    isActive
                      ? 'bg-white/20 text-[#00BAF2]'
                      : 'bg-slate-100 text-[#64748B]'
                  }`}>
                    {item.badge}
                  </span>
                  <ChevronRight size={13} className={isActive ? 'text-[#00BAF2]' : 'text-slate-300 group-hover:text-slate-500'} />
                </div>
              </button>
            );
          })}
        </div>

      </div>

      <div className="p-4 border-t border-[#E2E8F0] space-y-3">
        <div className="bg-gradient-to-br from-sky-50 to-blue-50/60 p-3.5 rounded-lg border border-sky-200/80">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-[#002970] text-white">
              <QrCode size={16} />
            </div>
            <div>
              <p className="text-xs font-bold text-[#002970]">Store QR Standee</p>
              <p className="text-[10px] text-[#64748B]">Scan to pay with any UPI app</p>
            </div>
          </div>
          <button
            onClick={onOpenQrModal}
            className="w-full mt-2.5 bg-[#00BAF2] hover:bg-[#009EDC] text-white py-1.5 px-3 rounded text-xs font-bold transition-all shadow-sm active:scale-95"
          >
            Download QR Poster
          </button>
        </div>

        <div className="text-[11px] text-[#64748B] flex items-center justify-between px-1">
          <span>Paytm Business Setu</span>
          <span className="font-semibold text-[#002970]">Enterprise Core</span>
        </div>
      </div>
    </aside>
  );
};
