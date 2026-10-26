import React, { useState } from 'react';
import { 
  Zap, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  Sliders, 
  ArrowRight,
  ShieldCheck,
  Building,
  Check,
  Target,
  BarChart3
} from 'lucide-react';
import { UrgentLoanState } from '../../types';

interface UrgentLoanTabProps {
  loanState: UrgentLoanState;
  onClaimLoan: () => void;
}

export const UrgentLoanTab: React.FC<UrgentLoanTabProps> = ({
  loanState,
  onClaimLoan
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const [calcMode, setCalcMode] = useState<'sales-to-loan' | 'loan-to-sales'>('sales-to-loan');
  const [simulatedSales, setSimulatedSales] = useState<number>(14500);
  const [targetLoanAmount, setTargetLoanAmount] = useState<number>(10000);

  // Underwriting algorithm: Loan eligibility capped at 35% of daily gross QR turnover, rounded to 500 INR tranches
  const eligibleLoanFromSales = Math.max(1000, Math.round((simulatedSales * 0.35) / 500) * 500);

  // Inverse turnover calculation: Daily velocity required to service target credit tier
  const requiredSalesForLoan = Math.round((targetLoanAmount / 0.35) / 500) * 500;
  const currentStoreDailySales = 14500;
  const salesGap = Math.max(0, requiredSalesForLoan - currentStoreDailySales);
  const isCurrentlyEligible = targetLoanAmount <= 5000;

  const handleClaim = () => {
    setIsProcessing(true);
    try {
      onClaimLoan();
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-[#002970] via-[#003896] to-[#002970] text-white rounded-xl p-4 sm:p-5 shadow-paytm-card border border-[#00BAF2]/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#00BAF2] text-[#002970]">
              <Zap size={18} />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#00BAF2]">
              Module 3: 24-Hour Micro-Liquidity
            </span>
          </div>
          <h2 className="text-xl font-black tracking-tight text-white mt-1">
            AI Statement &amp; Urgent Loan
          </h2>
          <p className="text-xs text-white/80 mt-1 max-w-xl">
            Instant 24-hour zero-cost credit line underwritten by daily QR sales velocity.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white/10 px-3.5 py-2 rounded-lg border border-white/15 text-right">
            <span className="text-[10px] text-sky-200 block uppercase font-bold tracking-wider">Approval</span>
            <span className="text-base font-black text-[#00BAF2] font-mono">120 Sec</span>
          </div>
          <div className="bg-white/10 px-3.5 py-2 rounded-lg border border-white/15 text-right">
            <span className="text-[10px] text-emerald-200 block uppercase font-bold tracking-wider">Interest</span>
            <span className="text-base font-black text-[#10B981] font-mono">Rs. 0 (0%)</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-xl p-5 border border-[#E2E8F0] shadow-paytm-card space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-[#002970]">Pre-Approved Credit Offer</h3>
                <p className="text-xs text-[#64748B]">Immediate payout to linked bank</p>
              </div>
              <span className="text-[10px] bg-emerald-50 text-[#10B981] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                Grade A+ Underwriting
              </span>
            </div>

            {/* Offer Callout */}
            <div className="bg-gradient-to-br from-blue-50/80 to-white p-4 rounded-xl border border-[#00BAF2]/40 space-y-2">
              <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">
                Instant Credit Line
              </span>
              <p className="text-2xl font-black text-[#002970] tracking-tight">
                Rs. 5,000 <span className="text-xs font-semibold text-[#10B981]">at Rs. 0 Interest</span>
              </p>
              <p className="text-xs text-[#64748B]">
                Credit to: <strong className="text-slate-800">{loanState.bankAccountMasked}</strong>
              </p>

              <div className="bg-white p-2.5 rounded-lg border border-slate-200 flex items-center justify-between text-[11px] text-[#002970] font-medium mt-2">
                <span className="flex items-center gap-1">
                  <Clock size={13} className="text-[#00BAF2]" />
                  Auto-Settlement:
                </span>
                <span className="font-bold">11:00 PM tonight (Rs. 0 Fee)</span>
              </div>
            </div>

            {/* Underwriting Telemetry Badges */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-[#F4F6F9] p-2.5 rounded-lg border border-[#E2E8F0]">
                <span className="text-[10px] text-[#64748B] uppercase font-bold block">Current QR Sales</span>
                <span className="font-bold text-[#002970]">Rs. 14,500 / day</span>
                <span className="text-[10px] text-[#10B981] block mt-0.5">120 txns</span>
              </div>
              <div className="bg-[#F4F6F9] p-2.5 rounded-lg border border-[#E2E8F0]">
                <span className="text-[10px] text-[#64748B] uppercase font-bold block">Health Score</span>
                <span className="font-bold text-[#10B981] font-mono">94 / 100</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Zero bounced debits</span>
              </div>
            </div>

            {loanState.isDisbursed ? (
              <div className="bg-emerald-50 border border-[#10B981]/50 rounded-lg p-3.5 space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-[#10B981] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-emerald-950">
                      Rs. 5,000 Credited to HDFC Bank ****4102 via Paytm Payouts
                    </h4>
                    <p className="text-[11px] text-emerald-800 mt-0.5">
                      Auto-settles from 11:00 PM collections. Ref: PYTM_IMPS_89410.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={handleClaim}
                disabled={isProcessing}
                className="w-full bg-[#00BAF2] hover:bg-[#009EDC] text-white py-2.5 px-4 rounded-lg text-xs font-bold transition-all shadow-sm active:scale-98 flex items-center justify-center gap-1.5"
              >
                <Zap size={15} />
                <span>{isProcessing ? 'Processing Instant Transfer...' : 'Claim 2-Minute Emergency Loan'}</span>
              </button>
            )}

          </div>

        </div>

        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-xl p-5 border border-[#E2E8F0] shadow-paytm-card space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-[#002970] flex items-center gap-2">
                  <Sliders size={16} className="text-[#00BAF2]" />
                  Loan &amp; Sales Eligibility Calculator
                </h3>
                <p className="text-xs text-[#64748B]">Simulate credit limits or check required daily QR sales</p>
              </div>

              <div className="flex items-center bg-[#F4F6F9] p-1 rounded-lg border border-[#E2E8F0] text-xs">
                <button
                  onClick={() => setCalcMode('sales-to-loan')}
                  className={`px-3 py-1 rounded-md font-bold transition-all ${
                    calcMode === 'sales-to-loan'
                      ? 'bg-[#002970] text-white shadow-xs'
                      : 'text-slate-600 hover:text-[#002970]'
                  }`}
                >
                  By Daily Sales
                </button>
                <button
                  onClick={() => setCalcMode('loan-to-sales')}
                  className={`px-3 py-1 rounded-md font-bold transition-all ${
                    calcMode === 'loan-to-sales'
                      ? 'bg-[#002970] text-white shadow-xs'
                      : 'text-slate-600 hover:text-[#002970]'
                  }`}
                >
                  By Loan Target
                </button>
              </div>
            </div>

            {calcMode === 'sales-to-loan' ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[#0F172A] uppercase tracking-wider text-[11px]">
                      Daily QR Sales Velocity
                    </label>
                    <span className="text-base font-black text-[#002970] font-mono">
                      Rs. {simulatedSales.toLocaleString('en-IN')} / day
                    </span>
                  </div>

                  <input
                    type="range"
                    min="5000"
                    max="60000"
                    step="1000"
                    value={simulatedSales}
                    onChange={(e) => setSimulatedSales(parseInt(e.target.value))}
                    className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#00BAF2]"
                  />

                  <div className="flex justify-between text-[10px] text-[#64748B] font-mono">
                    <span>Min: Rs. 5,000</span>
                    <span className="font-bold text-[#00BAF2]">Current: Rs. 14,500</span>
                    <span>Max: Rs. 60,000</span>
                  </div>
                </div>

                <div className="bg-[#F4F6F9] p-4 rounded-xl border border-[#E2E8F0] grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  <div>
                    <span className="text-[10px] text-[#64748B] uppercase font-bold tracking-wider block">
                      Eligible 24-Hour Emergency Loan
                    </span>
                    <p className="text-2xl font-black text-[#10B981] font-mono mt-0.5">
                      Rs. {eligibleLoanFromSales.toLocaleString('en-IN')}
                    </p>
                    <span className="text-[11px] text-[#64748B]">
                      35% of daily volume • 0% APR
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-700 sm:border-l sm:border-slate-200 sm:pl-4">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Est. Daily Transactions</span>
                      <strong className="font-mono">{Math.round(simulatedSales / 120)} txns</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Auto-Deduction</span>
                      <strong className="text-[#002970]">11:00 PM Tonight</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Interest Payable</span>
                      <strong className="text-[#10B981]">Rs. 0</strong>
                    </div>
                  </div>
                </div>

              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#0F172A] uppercase tracking-wider text-[11px] block">
                    Select Desired Loan Amount:
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {[3000, 5000, 10000, 15000, 20000].map((amt) => {
                      const isSelected = targetLoanAmount === amt;
                      return (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => setTargetLoanAmount(amt)}
                          className={`py-2 px-1 rounded-lg border text-center transition-all ${
                            isSelected
                              ? 'bg-[#002970] text-white border-[#002970] shadow-sm font-bold'
                              : 'bg-[#F4F6F9] hover:bg-slate-100 text-[#0F172A] border-[#E2E8F0] font-semibold'
                          }`}
                        >
                          <span className="text-xs block">Rs. {amt.toLocaleString('en-IN')}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Calculation Result: Is Amount K Liye Kitni Sale Krni Pdegi */}
                <div className="bg-[#F4F6F9] p-4 rounded-xl border border-[#E2E8F0] space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                    <div>
                      <span className="text-[10px] text-[#64748B] uppercase font-bold tracking-wider block">
                        Required Daily QR Sales for Rs. {targetLoanAmount.toLocaleString('en-IN')}
                      </span>
                      <p className="text-2xl font-black text-[#002970] font-mono mt-0.5">
                        Rs. {requiredSalesForLoan.toLocaleString('en-IN')} <span className="text-xs font-normal text-slate-500">/ day</span>
                      </p>
                    </div>

                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full border self-start sm:self-auto ${
                      isCurrentlyEligible
                        ? 'bg-emerald-50 text-[#10B981] border-emerald-200'
                        : 'bg-amber-50 text-[#F59E0B] border-amber-200'
                    }`}>
                      {isCurrentlyEligible ? 'Eligible Today' : `Requires +Rs. ${salesGap.toLocaleString('en-IN')} Sales`}
                    </span>
                  </div>

                  {/* Visual Progress Bar: Current vs Required */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-[#64748B]">Current Store Average: <strong>Rs. 14,500/day</strong></span>
                      <span className="font-bold text-[#002970]">Target: Rs. {requiredSalesForLoan.toLocaleString('en-IN')}</span>
                    </div>

                    <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          isCurrentlyEligible ? 'bg-[#10B981]' : 'bg-[#00BAF2]'
                        }`}
                        style={{ width: `${Math.min(100, Math.round((currentStoreDailySales / requiredSalesForLoan) * 100))}%` }}
                      />
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-600">
                    {isCurrentlyEligible 
                      ? "Your current daily QR collection volume already qualifies for this loan." 
                      : `Increase daily QR volume by ~${Math.round(salesGap / 120)} transactions to unlock this limit.`}
                  </p>
                </div>

              </div>
            )}

            {/* Quick Rule Tag Strip */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-[#64748B]">
              <span>Formula: 35% of daily collection</span>
              <span>•</span>
              <span>Zero interest (Rs. 0)</span>
              <span>•</span>
              <span>No collateral</span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
