import React, { useState } from 'react';
import { X, Download, Printer, Copy, Check, ShieldCheck } from 'lucide-react';

interface StoreQrModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StoreQrModal: React.FC<StoreQrModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [customAmount, setCustomAmount] = useState('');
  const upiId = 'sharmakirana@paytm';

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadStandee = () => {
    const content = 
      `PAYTM BUSINESS SETU - ALL-IN-ONE STORE QR STANDEE\n` +
      `-------------------------------------------------\n` +
      `Store: Sharma General Store\n` +
      `Merchant ID: PTM889012\n` +
      `UPI VPA: ${upiId}\n` +
      `Fixed Amount: ${customAmount ? 'Rs. ' + customAmount : 'Open Amount'}\n` +
      `Routing: Paytm Payouts & Soundbox v3 Protected\n` +
      `Accepted Apps: Paytm, PhonePe, Google Pay, BHIM UPI\n` +
      `Generated: ${new Date().toLocaleString()}\n`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Paytm_Business_Setu_QR_${customAmount ? customAmount + 'INR_' : ''}Sharma_Store.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#002970]/60 backdrop-blur-xs animate-in fade-in">
      <div 
        className="bg-white rounded-xl max-w-md w-full shadow-paytm-modal border border-[#E2E8F0] overflow-hidden transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#002970] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-white px-2 py-0.5 rounded font-black text-sm">
              <span className="text-[#002970]">Pay</span>
              <span className="text-[#00BAF2]">tm</span>
            </div>
            <div>
              <h3 className="font-bold text-sm leading-tight">All-in-One Store QR Code</h3>
              <p className="text-[11px] text-white/70">Accept UPI from any app at 0% fee</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 flex flex-col items-center text-center bg-gradient-to-b from-slate-50 to-white">
          <div className="w-full max-w-[320px] bg-white rounded-xl border-2 border-[#00BAF2] shadow-sm p-5 flex flex-col items-center relative overflow-hidden">
            <div className="w-full bg-[#002970] -mt-5 -mx-5 px-4 py-2.5 mb-4 text-white flex items-center justify-between">
              <div className="flex items-baseline">
                <span className="font-black text-lg text-white">Pay</span>
                <span className="font-black text-lg text-[#00BAF2]">tm</span>
                <span className="text-[10px] font-bold text-white/80 uppercase ml-1">Business Setu</span>
              </div>
              <span className="text-[10px] bg-[#00BAF2] text-[#002970] font-black px-2 py-0.5 rounded-full uppercase">
                Zero Fee
              </span>
            </div>

            <p className="text-sm font-bold text-[#002970]">Sharma General Store</p>
            <p className="text-xs text-slate-500 font-mono mt-0.5">MID: PTM889012</p>

            {/* QR Graphic with centered Paytm logo */}
            <div className="my-4 p-3 bg-white rounded-xl border border-slate-200 shadow-inner relative flex items-center justify-center">
              <svg 
                className="w-48 h-48"
                viewBox="0 0 200 200" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Simulated high-fidelity QR Pattern */}
                <rect width="200" height="200" fill="white" />
                {/* Corner Eyes */}
                <rect x="15" y="15" width="45" height="45" rx="6" fill="#002970" />
                <rect x="23" y="23" width="29" height="29" rx="3" fill="white" />
                <rect x="29" y="29" width="17" height="17" rx="2" fill="#00BAF2" />

                <rect x="140" y="15" width="45" height="45" rx="6" fill="#002970" />
                <rect x="148" y="23" width="29" height="29" rx="3" fill="white" />
                <rect x="154" y="29" width="17" height="17" rx="2" fill="#00BAF2" />

                <rect x="15" y="140" width="45" height="45" rx="6" fill="#002970" />
                <rect x="23" y="148" width="29" height="29" rx="3" fill="white" />
                <rect x="29" y="154" width="17" height="17" rx="2" fill="#00BAF2" />

                {/* QR Data Grid Dots */}
                <g fill="#002970">
                  <rect x="70" y="20" width="8" height="8" rx="1" />
                  <rect x="85" y="20" width="8" height="8" rx="1" />
                  <rect x="100" y="20" width="8" height="8" rx="1" />
                  <rect x="115" y="20" width="8" height="8" rx="1" />

                  <rect x="70" y="35" width="8" height="8" rx="1" />
                  <rect x="115" y="35" width="8" height="8" rx="1" />

                  <rect x="70" y="50" width="8" height="8" rx="1" />
                  <rect x="85" y="50" width="8" height="8" rx="1" />
                  <rect x="100" y="50" width="8" height="8" rx="1" />
                  <rect x="115" y="50" width="8" height="8" rx="1" />

                  <rect x="20" y="70" width="8" height="8" rx="1" />
                  <rect x="35" y="70" width="8" height="8" rx="1" />
                  <rect x="50" y="70" width="8" height="8" rx="1" />
                  <rect x="70" y="70" width="8" height="8" rx="1" />
                  <rect x="100" y="70" width="8" height="8" rx="1" />
                  <rect x="140" y="70" width="8" height="8" rx="1" />
                  <rect x="170" y="70" width="8" height="8" rx="1" />

                  <rect x="20" y="85" width="8" height="8" rx="1" />
                  <rect x="50" y="85" width="8" height="8" rx="1" />
                  <rect x="130" y="85" width="8" height="8" rx="1" />
                  <rect x="160" y="85" width="8" height="8" rx="1" />

                  <rect x="20" y="100" width="8" height="8" rx="1" />
                  <rect x="35" y="100" width="8" height="8" rx="1" />
                  <rect x="65" y="100" width="8" height="8" rx="1" />
                  <rect x="135" y="100" width="8" height="8" rx="1" />
                  <rect x="165" y="100" width="8" height="8" rx="1" />

                  <rect x="20" y="115" width="8" height="8" rx="1" />
                  <rect x="50" y="115" width="8" height="8" rx="1" />
                  <rect x="75" y="115" width="8" height="8" rx="1" />
                  <rect x="110" y="115" width="8" height="8" rx="1" />
                  <rect x="145" y="115" width="8" height="8" rx="1" />

                  <rect x="70" y="140" width="8" height="8" rx="1" />
                  <rect x="90" y="140" width="8" height="8" rx="1" />
                  <rect x="110" y="140" width="8" height="8" rx="1" />
                  <rect x="130" y="140" width="8" height="8" rx="1" />
                  <rect x="150" y="140" width="8" height="8" rx="1" />
                  <rect x="170" y="140" width="8" height="8" rx="1" />

                  <rect x="70" y="155" width="8" height="8" rx="1" />
                  <rect x="105" y="155" width="8" height="8" rx="1" />
                  <rect x="135" y="155" width="8" height="8" rx="1" />
                  <rect x="165" y="155" width="8" height="8" rx="1" />

                  <rect x="70" y="170" width="8" height="8" rx="1" />
                  <rect x="85" y="170" width="8" height="8" rx="1" />
                  <rect x="115" y="170" width="8" height="8" rx="1" />
                  <rect x="145" y="170" width="8" height="8" rx="1" />
                  <rect x="175" y="170" width="8" height="8" rx="1" />
                </g>

                {/* Center Badge */}
                <circle cx="100" cy="100" r="20" fill="white" />
                <circle cx="100" cy="100" r="17" fill="#002970" />
                <text x="100" y="104" textAnchor="middle" fill="#00BAF2" fontSize="9" fontWeight="900" fontFamily="sans-serif">
                  Paytm
                </text>
              </svg>
            </div>

            {/* Custom Amount Indicator (if entered) */}
            {customAmount && (
              <div className="mb-2 bg-emerald-50 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200">
                Amount: ₹{Number(customAmount).toLocaleString('en-IN')}
              </div>
            )}

            {/* Accepted UPI Apps row */}
            <div className="w-full pt-2 border-t border-slate-100 flex items-center justify-center gap-2 text-[10px] text-slate-500 flex-wrap">
              <span className="font-semibold text-slate-700">Accepted:</span>
              <span className="bg-slate-100 px-1.5 py-0.5 rounded font-medium">Paytm</span>
              <span className="bg-slate-100 px-1.5 py-0.5 rounded font-medium">GPay</span>
              <span className="bg-slate-100 px-1.5 py-0.5 rounded font-medium">PhonePe</span>
              <span className="bg-slate-100 px-1.5 py-0.5 rounded font-medium">BHIM</span>
            </div>

            {/* Bottom Standee Strip */}
            <div className="w-full bg-slate-50 -mb-5 -mx-5 mt-3 px-3 py-2 text-[10px] text-slate-600 flex items-center justify-between border-t border-slate-100">
              <span className="flex items-center gap-1 font-medium">
                <ShieldCheck size={12} className="text-[#10B981]" /> Paytm Soundbox Protected
              </span>
              <span className="font-mono text-slate-500">NPCI / BHIM UPI</span>
            </div>

          </div>

          {/* UPI ID & Copy */}
          <div className="w-full max-w-[320px] mt-4 flex items-center justify-between bg-slate-100 px-3 py-2 rounded-lg border border-slate-200">
            <div className="text-left">
              <p className="text-[10px] text-slate-500 uppercase font-semibold">Store VPA / UPI ID</p>
              <p className="text-xs font-mono font-bold text-slate-800">{upiId}</p>
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium px-2.5 py-1.5 rounded border border-slate-300 transition-colors"
            >
              {copied ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          {/* Optional Amount Preset */}
          <div className="w-full max-w-[320px] mt-3">
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Generate with fixed amount (₹)"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                className="flex-1 text-xs border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:border-[#00BAF2]"
              />
              {customAmount && (
                <button
                  onClick={() => setCustomAmount('')}
                  className="text-xs text-slate-400 hover:text-slate-600 px-2"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          <div className="w-full max-w-[320px] grid grid-cols-2 gap-2.5 mt-4">
            <button
              onClick={handleDownloadStandee}
              className="flex items-center justify-center gap-1.5 bg-[#002970] hover:bg-[#001E53] text-white py-2 rounded-lg font-semibold text-xs transition-colors shadow-sm"
            >
              <Download size={14} />
              <span>Download Standee</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center justify-center gap-1.5 bg-[#00BAF2] hover:bg-sky-500 text-[#002970] font-bold py-2 rounded-lg text-xs transition-colors shadow-sm"
            >
              <Printer size={14} />
              <span>Print Poster</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
