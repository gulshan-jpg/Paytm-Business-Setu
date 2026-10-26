import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Upload, 
  RotateCcw, 
  QrCode, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Smartphone, 
  Check, 
  Volume2, 
  AlertOctagon, 
  Search 
} from 'lucide-react';
import { PaymentScreenshotOcr } from '../../types';
import { OCR_PRESET_SUCCESS, OCR_PRESET_STUCK, OCR_PRESET_BLURRY } from '../../data/mockData';
import { soundManager } from '../../utils/audio';

interface VerifyRefundTabProps {
  currentOcr: PaymentScreenshotOcr;
  onUpdateOcr: (ocr: PaymentScreenshotOcr) => void;
  onSimulateSuccess: () => void;
  onSimulateStuck: () => void;
  onTriggerAutoRefund: () => void;
}

export const VerifyRefundTab: React.FC<VerifyRefundTabProps> = ({
  currentOcr,
  onUpdateOcr,
  onSimulateSuccess,
  onSimulateStuck,
  onTriggerAutoRefund
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [showRePayModal, setShowRePayModal] = useState(false);
  const [manualUtr, setManualUtr] = useState('');
  const [manualError, setManualError] = useState('');

  const handlePresetSelect = (preset: PaymentScreenshotOcr) => {
    onUpdateOcr({ ...preset });
    setManualError('');
  };

  const handleManualUtrVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUtr = manualUtr.trim();
    if (!/^\d{12}$/.test(cleanUtr)) {
      setManualError('UTR must be exactly 12 numeric digits as printed on customer UPI passbook.');
      return;
    }
    setManualError('');
    soundManager.playSuccessPop();
    onUpdateOcr({
      id: 'OCR_MANUAL_' + Date.now(),
      screenshotType: 'success',
      utr: cleanUtr,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      amount: 450,
      customerName: 'Verified via NPCI Switch',
      customerPhone: '+91 98101 22910',
      app: 'Paytm UPI',
      status: 'verified',
      verificationMessage: `Manual UTR #${cleanUtr} confirmed directly with NPCI settlement switch. Payment authenticated.`,
      confidenceScore: 100,
      refundInitiated: false,
      repayLinkGenerated: false
    });
    setManualUtr('');
  };

  const handleExecuteRefund = () => {
    onTriggerAutoRefund();
    setShowRePayModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-[#002970] via-[#003896] to-[#002970] text-white rounded-xl p-4 sm:p-5 shadow-paytm-card border border-[#00BAF2]/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#00BAF2] text-[#002970]">
              <ShieldCheck size={18} />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#00BAF2]">
              Module 1: Payment Assurance
            </span>
          </div>
          <h2 className="text-xl font-black tracking-tight text-white mt-1">
            Verify &amp; Refund Shield
          </h2>
          <p className="text-xs text-white/80 mt-1 max-w-xl">
            Instant 380ms OCR verification and auto-reversal for stuck customer UPI payments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white/10 px-3.5 py-2 rounded-lg border border-white/15 text-right">
            <span className="text-[10px] text-sky-200 block uppercase font-bold tracking-wider">Detection Speed</span>
            <span className="text-base font-black text-[#00BAF2] font-mono">380 ms</span>
          </div>
          <div className="bg-white/10 px-3.5 py-2 rounded-lg border border-white/15 text-right">
            <span className="text-[10px] text-emerald-200 block uppercase font-bold tracking-wider">Dispute Shield</span>
            <span className="text-base font-black text-[#10B981] font-mono">100% Protected</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-xl p-5 border border-[#E2E8F0] shadow-paytm-card space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#002970] flex items-center gap-2">
                <Smartphone size={16} className="text-[#00BAF2]" />
                Payment Screenshot Scanner
              </h3>
              <span className="text-[10px] bg-slate-100 text-[#64748B] px-2 py-0.5 rounded font-mono font-semibold">
                AI OCR
              </span>
            </div>

            {/* Dropzone Container */}
            <div 
              onClick={onSimulateSuccess}
              className="border-2 border-dashed border-[#00BAF2]/40 hover:border-[#00BAF2] bg-[#F4F6F9]/80 hover:bg-sky-50/50 rounded-xl p-5 text-center transition-all cursor-pointer group"
            >
              {isScanning ? (
                <div className="py-4 flex flex-col items-center justify-center space-y-2">
                  <RefreshCw size={24} className="text-[#00BAF2] animate-spin" />
                  <p className="text-xs font-bold text-[#002970]">Parsing UTR with NPCI switch...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center space-y-2">
                  <div className="w-10 h-10 rounded-full bg-[#00BAF2]/10 text-[#002970] flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Upload size={20} className="text-[#00BAF2]" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#002970]">
                      Upload or Scan Customer Payment Screenshot
                    </p>
                    <p className="text-[11px] text-[#64748B] mt-0.5">
                      Supports Google Pay, PhonePe, Paytm, and BHIM
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2 pt-1 border-t border-slate-100">
              <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block">
                Audit Presets &amp; Edge Cases:
              </span>
              
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handlePresetSelect(OCR_PRESET_SUCCESS)}
                  className={`p-2 rounded-lg border text-left transition-all ${
                    currentOcr.screenshotType === 'success'
                      ? 'bg-emerald-50/80 border-[#10B981]'
                      : 'bg-white border-[#E2E8F0] hover:border-emerald-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#002970]">Success</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                  </div>
                  <p className="text-[10px] text-[#64748B] font-mono mt-0.5">Rs. 450</p>
                </button>

                <button
                  onClick={() => handlePresetSelect(OCR_PRESET_STUCK)}
                  className={`p-2 rounded-lg border text-left transition-all ${
                    currentOcr.screenshotType === 'stuck'
                      ? 'bg-amber-50/80 border-[#F59E0B]'
                      : 'bg-white border-[#E2E8F0] hover:border-amber-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#002970]">Stuck</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
                  </div>
                  <p className="text-[10px] text-[#64748B] font-mono mt-0.5">Rs. 620</p>
                </button>

                <button
                  onClick={() => handlePresetSelect(OCR_PRESET_BLURRY)}
                  className={`p-2 rounded-lg border text-left transition-all ${
                    currentOcr.screenshotType === 'blurry'
                      ? 'bg-red-50/80 border-red-500'
                      : 'bg-white border-[#E2E8F0] hover:border-red-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-red-700">Blurry / Glare</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  </div>
                  <p className="text-[10px] text-red-600 font-mono mt-0.5">Conf: 32%</p>
                </button>
              </div>
            </div>

            <div className="bg-[#F4F6F9] rounded-lg p-2.5 border border-[#E2E8F0] flex items-center gap-2 text-[11px] text-[#64748B]">
              <Volume2 size={14} className="text-[#00BAF2] shrink-0" />
              <span>Resolves checkout disputes during Soundbox audio or telecom lag.</span>
            </div>

          </div>

        </div>

        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-xl p-5 border border-[#E2E8F0] shadow-paytm-card space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-[#002970]">OCR Verification Results</h3>
                <p className="text-xs text-[#64748B]">Matched with NPCI switch in real-time</p>
              </div>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border flex items-center gap-1 font-mono ${
                currentOcr.status === 'verified'
                  ? 'bg-emerald-50 text-[#10B981] border-emerald-300'
                  : currentOcr.status === 'unreadable'
                  ? 'bg-red-50 text-red-700 border-red-300'
                  : 'bg-amber-50 text-[#F59E0B] border-amber-300'
              }`}>
                {currentOcr.status === 'verified' ? (
                  <CheckCircle2 size={13} />
                ) : currentOcr.status === 'unreadable' ? (
                  <AlertOctagon size={13} />
                ) : (
                  <AlertTriangle size={13} />
                )}
                {currentOcr.status === 'verified' 
                  ? 'Authenticated' 
                  : currentOcr.status === 'unreadable' 
                  ? 'OCR Inconclusive' 
                  : 'Stuck in Bank Switch'}
              </span>
            </div>

            {currentOcr.status === 'verified' ? (
              <div className="bg-emerald-50 border border-[#10B981]/40 rounded-lg p-3 flex items-start gap-2.5">
                <Check size={16} className="text-[#10B981] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-emerald-900">
                    Payment Verified with Paytm Backend Webhook (UTR #{currentOcr.utr})
                  </h4>
                  <p className="text-[11px] text-emerald-800 mt-0.5">
                    Funds confirmed in settlement balance.
                  </p>
                </div>
              </div>
            ) : currentOcr.status === 'unreadable' ? (
              <div className="bg-red-50 border border-red-300 rounded-lg p-3.5 space-y-3">
                <div className="flex items-start gap-2.5">
                  <AlertOctagon size={18} className="text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-red-900">
                      OCR Verification Blocked: High Screen Glare / Blur Detected
                    </h4>
                    <p className="text-[11px] text-red-800 mt-0.5 leading-relaxed">
                      Confidence score: {currentOcr.confidenceScore || 32}% (Safety threshold: 80%). Reversal blocked to prevent unauthorized deductions.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleManualUtrVerify} className="space-y-1.5 pt-2 border-t border-red-200">
                  <label className="text-[10px] font-bold text-[#002970] uppercase tracking-wider block">
                    Fallback: Enter 12-Digit Customer UTR Manually
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. 984102938102"
                      value={manualUtr}
                      onChange={(e) => setManualUtr(e.target.value.replace(/\D/g, '').slice(0, 12))}
                      className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-mono focus:outline-none focus:border-[#00BAF2]"
                    />
                    <button
                      type="submit"
                      className="bg-[#002970] hover:bg-[#001E53] text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 shrink-0"
                    >
                      <Search size={13} />
                      <span>Verify UTR</span>
                    </button>
                  </div>
                  {manualError && (
                    <p className="text-[10px] text-red-600 font-semibold">{manualError}</p>
                  )}
                </form>
              </div>
            ) : (
              <div className="bg-amber-50 border border-[#F59E0B]/50 rounded-lg p-3 flex items-start gap-2.5">
                <AlertTriangle size={16} className="text-[#F59E0B] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-amber-900">
                    Payment Status: Stuck in Customer Bank Network
                  </h4>
                  <p className="text-[11px] text-amber-800 mt-0.5">
                    Customer bank debited Rs. {currentOcr.amount}, but merchant account uncredited due to NPCI switch timeout.
                  </p>
                </div>
              </div>
            )}

            {/* Extracted Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-[#F4F6F9] p-3 rounded-lg border border-[#E2E8F0]">
              <div>
                <span className="text-[10px] text-[#64748B] uppercase font-bold block">UTR Number</span>
                <span className="text-xs font-bold font-mono text-[#002970] block mt-0.5">{currentOcr.utr}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#64748B] uppercase font-bold block">Amount</span>
                <span className="text-sm font-black text-[#002970] block mt-0.5">Rs. {currentOcr.amount}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#64748B] uppercase font-bold block">Customer</span>
                <span className="text-xs font-bold text-[#0F172A] block mt-0.5">{currentOcr.customerName}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#64748B] uppercase font-bold block">Time</span>
                <span className="text-xs font-medium text-[#64748B] block mt-0.5">{currentOcr.time}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#64748B]">
              <span>App: <strong className="text-[#002970]">{currentOcr.app}</strong></span>
              <span>NPCI Latency: <strong className="text-[#10B981] font-mono">14ms</strong></span>
            </div>

          </div>

          {/* Trust-Protect Auto-Refund & Re-Pay Card */}
          <div className="bg-white rounded-xl p-5 border border-[#E2E8F0] shadow-paytm-card space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-[#002970] text-white">
                  <RotateCcw size={15} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#002970]">Trust-Protect Auto-Refund &amp; Re-Pay</h3>
                  <p className="text-xs text-[#64748B]">Zero-conflict resolution for stuck customer payments</p>
                </div>
              </div>
            </div>

            {currentOcr.refundInitiated ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3.5 space-y-2.5">
                <div className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-[#10B981] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-emerald-900">
                      Refund initiated to customer bank. Fresh Paytm QR payment link generated to prevent double-deduction.
                    </h4>
                  </div>
                </div>

                <div className="bg-white p-2.5 rounded-lg border border-emerald-200 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <QrCode size={18} className="text-[#002970]" />
                    <span className="text-xs font-bold text-[#002970]">Dynamic Re-Pay QR: Rs. {currentOcr.amount}</span>
                  </div>

                  <button
                    onClick={() => setShowRePayModal(true)}
                    className="bg-[#00BAF2] hover:bg-[#009EDC] text-white font-bold text-xs px-3 py-1.5 rounded transition-all shadow-xs"
                  >
                    View Re-Pay QR
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Concise text replacing the previous wordy paragraph */}
                <p className="text-xs text-[#64748B]">
                  Trigger instant NPCI bank auto-reversal and generate a fresh customer Re-Pay QR.
                </p>

                <button
                  onClick={handleExecuteRefund}
                  disabled={currentOcr.status === 'verified' || currentOcr.status === 'unreadable'}
                  className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-xs font-bold transition-all shadow-sm ${
                    currentOcr.status === 'verified' || currentOcr.status === 'unreadable'
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                      : 'bg-[#00BAF2] hover:bg-[#009EDC] text-white active:scale-98'
                  }`}
                >
                  <RotateCcw size={14} />
                  <span>
                    {currentOcr.status === 'unreadable' 
                      ? 'Auto-Reversal Disabled: Valid UTR Required' 
                      : 'Issue Instant Auto-Refund & Request Re-Pay'}
                  </span>
                </button>
              </div>
            )}

          </div>

        </div>

      </div>

      {showRePayModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-paytm-modal max-w-sm w-full border border-[#E2E8F0] p-5 text-center space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <span className="text-xs font-bold text-[#002970]">Dynamic Re-Pay QR</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                Shield Active
              </span>
            </div>

            <div className="bg-[#002970] text-white p-3 rounded-lg text-center">
              <p className="text-xs font-bold">Sharma General Store</p>
              <p className="text-xl font-black text-[#00BAF2] mt-0.5">Rs. {currentOcr.amount}</p>
              <p className="text-[10px] text-sky-200">{currentOcr.customerName}</p>
            </div>

            <div className="py-1 flex justify-center">
              <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-xs relative">
                <QrCode size={130} className="text-[#002970]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white px-1.5 py-0.5 rounded text-[9px] font-black text-[#002970] shadow-sm">
                    Paytm
                  </div>
                </div>
              </div>
            </div>

            <p className="text-xs text-[#64748B]">
              Scan with any UPI app. Prior stuck Rs. {currentOcr.amount} is queued for bank auto-reversal.
            </p>

            <button
              onClick={() => setShowRePayModal(false)}
              className="w-full bg-[#002970] hover:bg-[#001E53] text-white font-bold py-2 rounded-lg text-xs transition-colors"
            >
              Close Standee
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
