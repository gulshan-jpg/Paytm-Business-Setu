import React from 'react';
import { 
  LayoutDashboard, 
  ShieldCheck, 
  Zap, 
  Receipt,
  BookOpen,
  Bot,
  LucideIcon
} from 'lucide-react';
import { TabType } from '../types';

interface BottomNavigationProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  transactionsCount?: number;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onSelectTab,
  transactionsCount = 0
}) => {
  const navItems: {
    id: TabType;
    label: string;
    icon: LucideIcon;
    isSpecial?: boolean;
    badge?: string | number;
  }[] = [
    {
      id: 'overview',
      label: 'Home',
      icon: LayoutDashboard
    },
    {
      id: 'ask-priya',
      label: 'Ask Priya',
      icon: Bot,
      isSpecial: true,
      badge: 'AI'
    },
    {
      id: 'verify-refund',
      label: 'Verify',
      icon: ShieldCheck,
      badge: 'M2'
    },
    {
      id: 'udhaar-ledger',
      label: 'Khata AI',
      icon: BookOpen,
      badge: 'M3'
    },
    {
      id: 'urgent-loan',
      label: '0% Loan',
      icon: Zap,
      badge: 'M4'
    },
    {
      id: 'transactions-settlements',
      label: 'Passbook',
      icon: Receipt,
      badge: transactionsCount > 0 ? transactionsCount : undefined
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#111827]/95 backdrop-blur-md border-t border-[#E2E8F0] dark:border-slate-800 md:hidden shadow-lg px-2 py-1 transition-colors duration-200">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          if (item.isSpecial) {
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className="flex flex-col items-center justify-center -mt-5 group focus:outline-none"
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md transition-all ${
                  isActive 
                    ? 'bg-[#002970] text-[#00BAF2] ring-3 ring-[#00BAF2] scale-105' 
                    : 'bg-gradient-to-tr from-[#002970] to-[#00BAF2] text-white hover:scale-105'
                }`}>
                  <Icon size={22} className="animate-pulse" />
                </div>
                <span className={`text-[10px] font-bold mt-1 tracking-tight ${
                  isActive ? 'text-[#002970] dark:text-[#00BAF2]' : 'text-[#64748B] dark:text-slate-400'
                }`}>
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-lg transition-all relative ${
                isActive 
                  ? 'text-[#002970] dark:text-[#00BAF2] font-black' 
                  : 'text-[#64748B] dark:text-slate-400 hover:text-[#002970] font-medium'
              }`}
            >
              <div className="relative">
                <Icon size={18} className={isActive ? 'stroke-[2.5]' : 'stroke-2'} />
                {item.badge && (
                  <span className="absolute -top-1 -right-2 text-[8px] font-bold bg-[#00BAF2] text-white px-1 rounded-full leading-tight">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1 tracking-tight">
                {item.label}
              </span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#00BAF2] mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
