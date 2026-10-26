import React, { useState } from 'react';
import { X, CheckCircle2, Building, ShieldCheck, ArrowRight, Loader2, AlertTriangle, RefreshCw } from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface InstantSettlementModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  onSettlementComplete: (amountSettled: number) => void;
}

export const InstantSettlementModal: React.FC<InstantSettlementModalProps> = ({
  isOpen,
  onClose,
  amount,
  onSettlementComplete
}) => {
  const [step, setStep] = useState<'confirm' | 'processing' | 'success' | 'error'>('confirm');
  const [utrNumber, setUtrNumber] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleStartTransfer = async () => {
    setIsProcessing(true);
    setStep('processing');
    try {
      if (amount <= 0) {
        throw new Error('Settlement amount must be greater than zero.');
      }
      const generatedUtr = 'PTM' + Math.floor(100000000000 + Math.random() * 900000000000);
      setUtrNumber(generatedUtr);
      setStep('success');
      soundManager.playSuccessPop();
      onSettlementComplete(amount);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Bank IMPS gateway switch timed out. Zero funds deducted.');
      setStep('error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setStep('confirm');
    setErrorMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#002970]/60 backdrop-blur-xs animate-in fade-in">
      <div 
        className="bg-white rounded-xl max-w-md w-full shadow-paytm-modal border border-[#E2E8F0] overflow-hidden transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#002970] text-white p-4 flex items-center justify-between border-b border-[#001E53]">
          <div className="flex items-center gap-2">
            <Building size={18} className="text-[#00BAF2]" />
            <div>
              <h3 className="font-bold text-sm leading-tight">Instant Bank Settlement</h3>
              <p className="text-[11px] text-white/70">Paytm Fast-Payouts Engine (IMPS)</p>
            </div>
          </div>
          <button 
            onClick={handleReset}
            className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6">
          {step === 'confirm' && (
            <div className="space-y-4">
              <div className="text-center py-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Settlement Amount Ready
                </span>
                <div className="text-3xl font-extrabold text-[#002970] mt-1 font-mono">
                  Rs. {amount.toLocaleString('en-IN')}
                </div>
                <div className="inline-flex items-center gap-1.5 mt-2 bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200">
                  <ShieldCheck size={14} /> Zero Convenience Fee (0% MDR)
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Transferring To:</span>
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle2 size={12} /> Primary Bank A/C
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-red-100 text-red-700 font-bold text-xs flex items-center justify-center border border-red-200 font-mono">
                    HDFC
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">HDFC Bank Ltd.</p>
                    <p className="text-xs text-slate-600 font-mono">A/C: **** **** 4102</p>
                    <p className="text-[11px] text-slate-400 font-mono">IFSC: HDFC0001024</p>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 pt-1">
                <div className="flex justify-between">
                  <span>Gross Collection (Today)</span>
                  <span className="font-semibold text-slate-800 font-mono">Rs. {amount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Paytm Instant Transfer Fee</span>
                  <span className="text-emerald-600 font-bold">Rs. 0.00 (Free)</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Credit Time</span>
                  <span className="text-slate-800 font-medium">Real-Time IMPS Switch</span>
                </div>
              </div>

              <button
                onClick={handleStartTransfer}
                disabled={isProcessing}
                className="w-full bg-[#10B981] hover:bg-emerald-600 text-white font-bold py-3 rounded-lg text-sm transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2"
              >
                <span>Transfer Rs. {amount.toLocaleString('en-IN')} Now</span>
                <ArrowRight size={16} />
              </button>

              <p className="text-center text-[11px] text-slate-400">
                Scheduled end-of-day settlement executes at 11:00 PM automatically.
              </p>
            </div>
          )}

          {step === 'processing' && (
            <div className="py-8 flex flex-col items-center justify-center text-center space-y-4">
              <Loader2 size={40} className="text-[#00BAF2] animate-spin" />
              <div>
                <h4 className="font-bold text-base text-[#002970]">Initiating Fast Bank IMPS...</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-xs">
                  Routing payment instruction through NPCI/IMPS switch to HDFC Bank A/C ****4102.
                </p>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="py-4 text-center space-y-4 animate-in zoom-in-95">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center border-2 border-emerald-300">
                <CheckCircle2 size={32} />
              </div>

              <div>
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                  Settlement Completed
                </span>
                <h3 className="text-2xl font-black text-[#002970] mt-0.5 font-mono">
                  Rs. {amount.toLocaleString('en-IN')} Credited
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Transferred to HDFC Bank A/C ****4102
                </p>
              </div>

              <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 text-left text-xs space-y-1 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-500">Bank UTR / Ref:</span>
                  <span className="font-bold text-slate-800">{utrNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Switch Status:</span>
                  <span className="text-emerald-600 font-bold">IMPS_SUCCESS</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Timestamp:</span>
                  <span className="text-slate-800">{new Date().toLocaleTimeString()}</span>
                </div>
              </div>

              <button
                onClick={handleReset}
                className="w-full bg-[#002970] hover:bg-[#001E53] text-white font-bold py-2.5 rounded-lg text-xs transition-colors"
              >
                Close
              </button>
            </div>
          )}

          {step === 'error' && (
            <div className="py-4 text-center space-y-4 animate-in zoom-in-95">
              <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 mx-auto flex items-center justify-center border-2 border-red-300">
                <AlertTriangle size={30} />
              </div>

              <div>
                <span className="text-xs font-bold text-red-600 uppercase tracking-wider">
                  Settlement Interrupted
                </span>
                <h3 className="text-xl font-black text-[#002970] mt-0.5">
                  Bank Switch Acknowledgment Failed
                </h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed max-w-sm mx-auto">
                  {errorMessage || 'NPCI IMPS switch did not return an authorized transfer payload. Balance remains 100% safe in your Paytm merchant account.'}
                </p>
              </div>

              <div className="bg-red-50/70 border border-red-200 rounded-lg p-3 text-left text-xs font-mono space-y-1 text-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-500">Error Code:</span>
                  <span className="font-bold text-red-700">IMPS_GATEWAY_TIMEOUT_504</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Deduction Status:</span>
                  <span className="font-bold text-emerald-700">0.00 INR (Zero Loss)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Suggested Action:</span>
                  <span className="text-slate-800">Retry or wait for 11 PM auto-cycle</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={handleReset}
                  className="w-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold py-2.5 rounded-lg text-xs transition-colors"
                >
                  Dismiss
                </button>
                <button
                  onClick={handleStartTransfer}
                  className="w-full bg-[#002970] hover:bg-[#001E53] text-white font-bold py-2.5 rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <RefreshCw size={13} />
                  <span>Retry Transfer</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
