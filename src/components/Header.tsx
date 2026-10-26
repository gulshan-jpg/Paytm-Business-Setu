import React, { useState } from 'react';
import { 
  QrCode, 
  Wifi, 
  BatteryMedium, 
  ChevronDown, 
  Store, 
  CheckCircle2, 
  ShieldCheck, 
  Download,
  HelpCircle,
  User,
  CreditCard,
  Building2,
  ExternalLink,
  Sun,
  Moon,
  Smartphone,
  Monitor
} from 'lucide-react';
import { SoundboxTelemetry, TabType } from '../types';

interface HeaderProps {
  telemetry: SoundboxTelemetry;
  onOpenQrModal: () => void;
  onOpenSoundboxModal: () => void;
  onOpenProfileModal: () => void;
  pendingSettlementAmount: number;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  isMobileSimulated?: boolean;
  onToggleMobileSimulated?: () => void;
  onNavigateToTab?: (tab: TabType) => void;
}

export const Header: React.FC<HeaderProps> = ({
  telemetry,
  onOpenQrModal,
  onOpenSoundboxModal,
  onOpenProfileModal,
  pendingSettlementAmount,
  darkMode,
  onToggleDarkMode,
  isMobileSimulated = false,
  onToggleMobileSimulated,
  onNavigateToTab
}) => {
  const [storeDropdownOpen, setStoreDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-[#002970] text-white shadow-paytm-header border-b border-[#001E53]">
      <div className="max-w-[1720px] mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Left Side: Official Paytm Business Logo & Outlet */}
        <div className="flex items-center gap-3 sm:gap-6 flex-wrap sm:flex-nowrap">
          <div 
            onClick={() => onNavigateToTab && onNavigateToTab('overview')}
            className="flex items-center gap-2 select-none cursor-pointer"
          >
            <div className="flex items-baseline bg-white px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md shadow-sm">
              <span className="text-[#002970] font-black tracking-tight text-lg sm:text-xl">Pay</span>
              <span className="text-[#00BAF2] font-black tracking-tight text-lg sm:text-xl">tm</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="text-xs sm:text-sm font-black tracking-tight text-white uppercase">
                  for Business
                </span>
              </div>
              <span className="text-[9px] sm:text-[10px] text-sky-200 font-semibold tracking-wider uppercase leading-none">
                Merchant Operations Suite
              </span>
            </div>
          </div>

          <div className="h-6 w-px bg-white/20 hidden md:block" />

          {/* Store Switcher Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setStoreDropdownOpen(!storeDropdownOpen)}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/15 px-2.5 py-1.5 rounded-lg border border-white/15 transition-all text-left group"
            >
              <div className="w-6 h-6 rounded-md bg-[#00BAF2]/20 flex items-center justify-center text-[#00BAF2] shrink-0">
                <Store size={14} />
              </div>
              <div className="flex flex-col max-w-[130px] sm:max-w-[180px]">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-semibold tracking-tight text-white group-hover:text-[#00BAF2] transition-colors truncate">
                    Sharma General Store
                  </span>
                  <CheckCircle2 size={12} className="text-[#10B981] shrink-0" />
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-300 truncate">
                  <span>MID: #PTM889012</span>
                  <span className="hidden sm:inline text-white/40">•</span>
                  <span className="hidden sm:inline text-[#10B981] font-medium">Sec-14</span>
                </div>
              </div>
              <ChevronDown size={13} className="text-white/60 ml-0.5 group-hover:text-white" />
            </button>

            {storeDropdownOpen && (
              <div 
                className="absolute left-0 mt-2 w-72 bg-white text-gray-800 rounded-xl shadow-paytm-modal border border-[#E2E8F0] py-2 z-50 animate-in fade-in slide-in-from-top-2"
                onClick={() => setStoreDropdownOpen(false)}
              >
                <div className="px-3 py-1.5 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Your Merchant Outlets</span>
                  <span className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-medium">1 Active</span>
                </div>
                
                <div className="p-2 space-y-1">
                  <div className="p-2.5 rounded-lg bg-[#00BAF2]/10 border border-[#00BAF2]/30 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-[#002970]">Sharma General Store (Main)</p>
                      <p className="text-[11px] text-slate-500">Sector 14 Market, Gurugram</p>
                    </div>
                    <span className="text-[10px] font-bold text-[#10B981] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Active
                    </span>
                  </div>
                </div>

                <div className="p-2 border-t border-slate-100">
                  <button 
                    onClick={() => onOpenProfileModal()}
                    className="w-full text-left px-3 py-1.5 text-xs text-[#00BAF2] hover:bg-slate-50 rounded font-semibold flex items-center justify-between"
                  >
                    <span>Manage Outlet Details</span>
                    <ExternalLink size={12} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Center: Hardware Status Pill (Desktop only) */}
        <div className="hidden lg:flex items-center gap-3">
          <div 
            onClick={onOpenSoundboxModal}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/15 px-3 py-1.5 rounded-full border border-white/15 cursor-pointer transition-all"
            title="Soundbox v3 Diagnostics & Telemetry"
          >
            <div className="relative flex items-center justify-center">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#10B981]" />
            </div>
            
            <span className="text-xs font-medium text-white/90">
              Soundbox v3: <strong className="text-[#10B981]">Online</strong>
            </span>

            <span className="text-white/30">•</span>

            <div className="flex items-center gap-1 text-xs text-white/80">
              <BatteryMedium size={14} className="text-[#10B981]" />
              <span>{telemetry.batteryLevel}%</span>
            </div>

            <span className="text-white/30">•</span>

            <div className="flex items-center gap-1 text-xs text-white/80">
              <Wifi size={13} className="text-[#00BAF2]" />
              <span>4G Active</span>
            </div>
          </div>
        </div>

        {/* Right Side: Quick Ask Priya, Phone/Desktop Switcher, Theme Switcher & Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Ask Priya Quick Button in Header */}
          {onNavigateToTab && (
            <button
              onClick={() => onNavigateToTab('ask-priya')}
              className="hidden sm:flex items-center gap-1.5 bg-[#00BAF2] hover:bg-[#009EDC] text-[#002970] font-black text-xs px-3 py-1.5 rounded-lg shadow-sm transition-all active:scale-95"
            >
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
              <span>Ask Priya</span>
            </button>
          )}

          {/* Device Switcher (Desktop <-> Phone View Simulation) */}
          {onToggleMobileSimulated && (
            <button
              onClick={onToggleMobileSimulated}
              title={isMobileSimulated ? "Switch to Desktop View" : "Switch to Mobile Phone View"}
              className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs px-2.5 py-1.5 rounded-lg transition-all active:scale-95"
            >
              {isMobileSimulated ? (
                <>
                  <Monitor size={14} className="text-[#00BAF2]" />
                  <span className="hidden sm:inline">Desktop View</span>
                </>
              ) : (
                <>
                  <Smartphone size={14} className="text-amber-300" />
                  <span className="hidden sm:inline">Phone View</span>
                </>
              )}
            </button>
          )}

          {/* Small Theme Toggle (Dark / Light Mode) */}
          <button
            onClick={onToggleDarkMode}
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all active:scale-95"
          >
            {darkMode ? (
              <Sun size={15} className="text-amber-300" />
            ) : (
              <Moon size={15} className="text-sky-200" />
            )}
          </button>

          {/* Profile Avatar & Dropdown */}
          <div className="relative">
            <button 
              onClick={() => {
                setProfileDropdownOpen(!profileDropdownOpen);
                setStoreDropdownOpen(false);
              }}
              title="Merchant Profile & Settings"
              className="w-8 h-8 rounded-full bg-white text-[#002970] font-black text-xs flex items-center justify-center border-2 border-[#00BAF2] shadow-xs hover:scale-105 transition-transform focus:outline-none"
            >
              SG
            </button>

            {profileDropdownOpen && (
              <div 
                className="absolute right-0 mt-2 w-72 bg-white text-gray-800 rounded-xl shadow-paytm-modal border border-[#E2E8F0] p-3 z-50 animate-in fade-in slide-in-from-top-2"
                onClick={() => setProfileDropdownOpen(false)}
              >
                <div className="flex items-center gap-3 pb-3 border-b border-[#E2E8F0]">
                  <div className="w-10 h-10 rounded-full bg-[#002970] text-[#00BAF2] font-black text-sm flex items-center justify-center border-2 border-[#00BAF2]">
                    SG
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#002970]">Rajesh Kumar Sharma</p>
                    <p className="text-[11px] text-[#64748B]">Sharma General Store</p>
                    <span className="text-[10px] font-mono font-semibold text-[#00BAF2]">MID: #PTM889012</span>
                  </div>
                </div>

                <div className="py-2.5 space-y-1.5 border-b border-[#E2E8F0]">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#64748B]">Enterprise KYC</span>
                    <span className="text-[#10B981] font-bold flex items-center gap-1 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                      <CheckCircle2 size={11} /> Verified
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#64748B]">Settlement Bank</span>
                    <span className="font-mono text-[#002970] font-semibold">HDFC ****4102</span>
                  </div>
                </div>

                <div className="pt-2 space-y-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setProfileDropdownOpen(false);
                      onOpenProfileModal();
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold bg-[#00BAF2] hover:bg-[#009EDC] text-white flex items-center justify-between transition-colors shadow-xs"
                  >
                    <span>View Full Profile &amp; KYC</span>
                    <ExternalLink size={13} />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setProfileDropdownOpen(false);
                      onOpenQrModal();
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold text-[#002970] hover:bg-[#F4F6F9] flex items-center gap-2 transition-colors"
                  >
                    <QrCode size={14} className="text-[#00BAF2]" />
                    <span>Store QR Standee</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setProfileDropdownOpen(false);
                      onOpenSoundboxModal();
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold text-[#002970] hover:bg-[#F4F6F9] flex items-center gap-2 transition-colors"
                  >
                    <Wifi size={14} className="text-[#00BAF2]" />
                    <span>Soundbox v3 Diagnostics</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </header>
  );
};
