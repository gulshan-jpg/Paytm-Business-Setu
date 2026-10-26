import React from 'react';
import { 
  Building2, 
  ShieldCheck, 
  FileText, 
  MapPin, 
  Mail, 
  Phone, 
  CheckCircle2, 
  ExternalLink,
  QrCode
} from 'lucide-react';

export const ProfileTab: React.FC = () => {
  const handleDownloadAgreement = () => {
    const file = new Blob([
      `PAYTM FOR BUSINESS - MERCHANT ONBOARDING AGREEMENT\n` +
      `--------------------------------------------------\n` +
      `Entity: Sharma Retail Enterprises Private Limited\n` +
      `Trade Name: Sharma General Store\n` +
      `Merchant ID: PTM889012\n` +
      `Signatory: Rajesh Kumar Sharma\n` +
      `GSTIN: 07AAAAA0000A1Z5\n` +
      `Terminal Plan: Lifetime Soundbox v3\n` +
      `Status: Fully Executed & Active\n`
    ], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Paytm_Merchant_Agreement_PTM889012.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-[#002970] via-[#003896] to-[#002970] text-white rounded-xl p-5 shadow-paytm-card border border-[#00BAF2]/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#00BAF2] text-[#002970]">
              <Building2 size={16} />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#00BAF2]">
              Verified Merchant Account
            </span>
          </div>
          <h2 className="text-lg font-black tracking-tight text-white mt-1">
            Sharma General Store (Main Bazar Outlet)
          </h2>
          <p className="text-xs text-white/80 mt-1">
            Merchant ID: <strong className="font-mono text-white">#PTM889012</strong> • Category: Grocery &amp; Supermarket (MCC 5411)
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 px-3.5 py-1.5 rounded-xl text-xs font-bold">
          <ShieldCheck size={16} />
          <span>Full Enterprise KYC Verified</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-5 border border-[#E2E8F0] shadow-paytm-card space-y-4">
          <h3 className="text-sm font-bold text-[#002970] border-b border-[#E2E8F0] pb-2">
            Business &amp; Tax Registration (GSTIN)
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-[#64748B] font-medium">Trade Name</span>
              <p className="font-bold text-[#002970] text-sm mt-0.5">Sharma General Store</p>
            </div>

            <div>
              <span className="text-slate-400 font-medium">Legal Entity Name</span>
              <p className="font-semibold text-slate-800 mt-0.5">Sharma Retail Enterprises Private Limited</p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-400 font-semibold uppercase">GSTIN (Verified)</span>
                <p className="font-mono font-bold text-slate-800 mt-0.5">07AAAAA0000A1Z5</p>
                <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-1 mt-1">
                  <CheckCircle2 size={11} /> Active Regular
                </span>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Permanent Account (PAN)</span>
                <p className="font-mono font-bold text-slate-800 mt-0.5">ABCDE1234F</p>
                <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-1 mt-1">
                  <CheckCircle2 size={11} /> Linked to Aadhaar
                </span>
              </div>
            </div>

            <div className="pt-2 flex items-start gap-2 text-slate-600">
              <MapPin size={15} className="text-slate-400 shrink-0 mt-0.5" />
              <span>Shop No. 14, Main Market, Old Railway Road, Sector 14, Gurugram, Haryana - 122001</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-paytm-card space-y-4">
          <h3 className="text-sm font-bold text-[#002970] border-b border-slate-100 pb-2">
            Authorized Signatory &amp; Credentials
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-slate-400 font-medium">Proprietor / Signatory</span>
              <p className="font-bold text-slate-800 text-sm mt-0.5">Rajesh Kumar Sharma</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-[#00BAF2]" />
                <div>
                  <span className="text-[10px] text-slate-400">Registered Phone</span>
                  <p className="font-mono font-bold text-slate-800">+91 98112 88910</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Mail size={14} className="text-[#00BAF2]" />
                <div>
                  <span className="text-[10px] text-slate-400">Business Email</span>
                  <p className="font-medium text-slate-800 truncate">rajesh@sharmakirana.in</p>
                </div>
              </div>
            </div>

            {/* Soundbox device binding */}
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 mt-3 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700">Paired Hardware Device</span>
                <span className="text-[10px] bg-blue-100 text-[#002970] font-bold px-2 py-0.5 rounded">
                  Soundbox v3
                </span>
              </div>
              <p className="text-[11px] font-mono text-slate-500">Device Serial: SBX-DL-88912</p>
              <p className="text-[11px] text-emerald-600 font-medium">Subscription: Paid Lifetime Merchant Plan</p>
            </div>

            <div className="pt-2 flex items-center justify-between text-slate-500">
              <span>Merchant Contract: Active</span>
              <button 
                onClick={handleDownloadAgreement}
                className="text-[#00BAF2] hover:underline flex items-center gap-1 font-semibold"
              >
                Download Merchant Agreement <ExternalLink size={12} />
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
