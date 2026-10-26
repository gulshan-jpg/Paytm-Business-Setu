import React from 'react';
import { 
  X, 
  Building2, 
  ShieldCheck, 
  MapPin, 
  Phone, 
  Mail, 
  CheckCircle2, 
  Download, 
  ExternalLink,
  Store,
  CreditCard,
  Wifi,
  FileCheck
} from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const handleDownloadCertificate = () => {
    soundManager.playSuccessPop();
    const element = document.createElement('a');
    const file = new Blob([
      `PAYTM FOR BUSINESS - VERIFIED MERCHANT CERTIFICATE\n` +
      `--------------------------------------------------\n` +
      `Merchant Name: Sharma General Store\n` +
      `Legal Entity: Sharma Retail Enterprises Private Limited\n` +
      `Merchant ID: PTM889012\n` +
      `Proprietor: Rajesh Kumar Sharma\n` +
      `GSTIN: 07AAAAA0000A1Z5 (Active Regular)\n` +
      `PAN: ABCDE1234F\n` +
      `Settlement Bank: HDFC Bank A/C ****4102 (IFSC: HDFC0001234)\n` +
      `Registered Address: Shop No. 14, Main Market, Sector 14, Gurugram, Haryana - 122001\n` +
      `Verification Date: 12 Jan 2026\n` +
      `Status: Full Enterprise KYC Verified\n` +
      `Issuer: One97 Communications Limited (Paytm)\n`
    ], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'Paytm_Merchant_Certificate_PTM889012.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#002970]/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-xl shadow-paytm-modal border border-[#E2E8F0] w-full max-w-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#002970] text-white px-5 py-4 flex items-center justify-between border-b border-[#001E53]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#00BAF2] text-[#002970] flex items-center justify-center font-bold">
              <Store size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold tracking-tight text-white">
                  Merchant Profile &amp; KYC
                </h3>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck size={12} /> KYC Verified
                </span>
              </div>
              <p className="text-xs text-sky-200">
                Sharma General Store • Merchant ID: #PTM889012
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-5 bg-[#F4F6F9]/60">
          <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#002970] text-[#00BAF2] font-black text-sm flex items-center justify-center border-2 border-[#00BAF2]">
                SG
              </div>
              <div>
                <p className="text-sm font-bold text-[#002970]">Rajesh Kumar Sharma</p>
                <p className="text-xs text-[#64748B]">Primary Account Signatory &amp; Store Owner</p>
                <span className="text-[11px] font-mono text-[#00BAF2] font-semibold">MID: PTM889012</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="bg-emerald-50 text-[#10B981] border border-emerald-200 text-xs font-bold px-2.5 py-1 rounded-md flex items-center gap-1">
                <CheckCircle2 size={13} /> Active Tier-1 Account
              </span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-sm space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#002970] border-b border-[#E2E8F0] pb-2 flex items-center gap-1.5">
              <Building2 size={14} className="text-[#00BAF2]" />
              <span>Business Registration &amp; Tax Identifiers</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[11px] text-[#64748B] block font-medium">Trade Name</span>
                <span className="font-bold text-[#0F172A] text-sm">Sharma General Store</span>
              </div>
              <div>
                <span className="text-[11px] text-[#64748B] block font-medium">Legal Entity Name</span>
                <span className="font-semibold text-[#0F172A]">Sharma Retail Enterprises Pvt. Ltd.</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="bg-[#F4F6F9] p-3 rounded-lg border border-[#E2E8F0]">
                <span className="text-[10px] text-[#64748B] font-bold uppercase block">GSTIN (Verified)</span>
                <span className="font-mono font-bold text-[#002970] text-xs">07AAAAA0000A1Z5</span>
                <span className="text-[10px] text-[#10B981] font-semibold flex items-center gap-1 mt-1">
                  <CheckCircle2 size={11} /> Regular Taxpayer • Active
                </span>
              </div>

              <div className="bg-[#F4F6F9] p-3 rounded-lg border border-[#E2E8F0]">
                <span className="text-[10px] text-[#64748B] font-bold uppercase block">Permanent Account (PAN)</span>
                <span className="font-mono font-bold text-[#002970] text-xs">ABCDE1234F</span>
                <span className="text-[10px] text-[#10B981] font-semibold flex items-center gap-1 mt-1">
                  <CheckCircle2 size={11} /> Aadhaar Verified
                </span>
              </div>
            </div>

            <div className="pt-2 flex items-start gap-2 text-xs text-[#0F172A] border-t border-slate-100">
              <MapPin size={15} className="text-[#00BAF2] shrink-0 mt-0.5" />
              <span>Shop No. 14, Main Market, Old Railway Road, Sector 14, Gurugram, Haryana - 122001</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#002970]">
                <CreditCard size={15} className="text-[#00BAF2]" />
                <span>Primary Bank Settlement</span>
              </div>
              <p className="text-xs font-bold text-[#0F172A]">HDFC Bank Limited</p>
              <p className="text-[11px] font-mono text-[#64748B]">Account: **** **** 4102</p>
              <p className="text-[11px] font-mono text-[#64748B]">IFSC: HDFC0001234</p>
              <span className="inline-block text-[10px] font-bold text-[#10B981] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Instant Settlement Enabled (0% Fee)
              </span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#002970]">
                <Wifi size={15} className="text-[#00BAF2]" />
                <span>Bound Hardware Device</span>
              </div>
              <p className="text-xs font-bold text-[#0F172A]">Paytm AI Soundbox v3</p>
              <p className="text-[11px] font-mono text-[#64748B]">Serial: SBX-DL-88912</p>
              <p className="text-[11px] text-[#64748B]">Network: 4G Airtel Active (Battery: 92%)</p>
              <span className="inline-block text-[10px] font-bold text-[#002970] bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                Paid Lifetime Merchant Subscription
              </span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-sm space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#002970]">
              Authorized Contact Channels
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2 text-[#0F172A]">
                <Phone size={14} className="text-[#00BAF2]" />
                <span>+91 1234567890 (Registered Mobile)</span>
              </div>
              <div className="flex items-center gap-2 text-[#0F172A]">
                <Mail size={14} className="text-[#00BAF2]" />
                <span className="truncate">rajesh@sharmakirana.in</span>
              </div>
            </div>
          </div>

        </div>

        <div className="bg-white px-5 py-3.5 border-t border-[#E2E8F0] flex items-center justify-between gap-3">
          <button
            onClick={handleDownloadCertificate}
            className="flex items-center gap-1.5 text-xs font-bold text-[#002970] hover:text-[#00BAF2] transition-colors"
          >
            <Download size={14} />
            <span>Download Merchant Certificate</span>
          </button>

          <button
            onClick={onClose}
            className="bg-[#002970] hover:bg-[#001E53] text-white px-5 py-2 rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

