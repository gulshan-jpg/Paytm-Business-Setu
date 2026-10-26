import React from 'react';
import { 
  LayoutDashboard, 
  ShieldCheck, 
  Zap, 
  Tag, 
  Receipt,
  BookOpen,
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
      label: 'Overview',
      icon: LayoutDashboard
    },
    {
      id: 'verify-refund',
      label: 'Verify',
      icon: ShieldCheck,
      badge: 'M1'
    },
    {
      id: 'udhaar-ledger',
      label: 'Khata AI',
      icon: BookOpen,
      badge: 'M2'
    },
    {
      id: 'urgent-loan',
      label: 'Urgent Loan',
      icon: Zap,
      isSpecial: true,
      badge: 'M3'
    },
    {
      id: 'merchant-offers',
      label: 'Offers',
      icon: Tag,
      badge: 'M4'
    },
    {
      id: 'transactions-settlements',
      label: 'Settlements',
      icon: Receipt,
      badge: transactionsCount > 0 ? transactionsCount : undefined
    }
  ];

  return (
    <nav 
      aria-label="Mobile Bottom Navigation" 
      className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-[#E2E8F0] shadow-[0_-4px_16px_rgba(0,41,112,0.08)] select-none"
    >
      <div className="max-w-md mx-auto px-2 flex items-center justify-between h-16">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          if (item.isSpecial) {
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className="relative -top-3 flex flex-col items-center focus:outline-none group"
              >
                <div 
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-md ${
                    isActive 
                      ? 'bg-[#002970] ring-4 ring-[#00BAF2]/30 text-[#00BAF2] scale-105' 
                      : 'bg-[#00BAF2] hover:bg-[#009EDC] text-white group-hover:scale-105'
                  }`}
                >
                  <Icon size={22} className={isActive ? 'animate-pulse' : ''} />
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <span 
                    className={`text-[10px] font-bold tracking-tight ${
                      isActive ? 'text-[#002970]' : 'text-slate-600'
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 relative transition-all focus:outline-none ${
                isActive ? 'text-[#002970]' : 'text-[#64748B]'
              }`}
            >
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 h-0.5 w-8 bg-[#00BAF2] rounded-full" />
              )}

              <div className="relative">
                <Icon 
                  size={19} 
                  className={`transition-transform ${
                    isActive 
                      ? 'text-[#00BAF2] stroke-[2.4] scale-110' 
                      : 'text-[#64748B]'
                  }`} 
                />

                {item.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-3 min-w-[14px] h-3.5 px-0.5 rounded-full bg-[#00BAF2] text-white text-[9px] font-bold flex items-center justify-center leading-none font-mono">
                    {item.badge}
                  </span>
                )}
              </div>

              <span 
                className={`text-[10px] mt-1 truncate max-w-[64px] ${
                  isActive 
                    ? 'font-bold text-[#002970]' 
                    : 'font-medium text-[#64748B]'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
