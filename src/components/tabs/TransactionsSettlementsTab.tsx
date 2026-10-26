import React, { useState } from 'react';
import { 
  Receipt, 
  Search, 
  Filter, 
  ArrowUpRight, 
  CheckCircle2, 
  Clock, 
  RotateCcw, 
  Download, 
  Building, 
  Landmark, 
  ShieldCheck,
  QrCode,
  Check,
  X
} from 'lucide-react';
import { Transaction } from '../../types';

interface TransactionsSettlementsTabProps {
  transactions: Transaction[];
  pendingSettlementAmount: number;
  onOpenSettlementModal: () => void;
  onOpenQrModal: () => void;
}

export const TransactionsSettlementsTab: React.FC<TransactionsSettlementsTabProps> = ({
  transactions,
  pendingSettlementAmount,
  onOpenSettlementModal,
  onOpenQrModal
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [receiptTxn, setReceiptTxn] = useState<Transaction | null>(null);

  const filtered = transactions.filter((txn) => {
    const matchesSearch = 
      txn.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.rrn.includes(searchTerm) ||
      txn.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMethod = selectedMethod === 'All' || txn.method === selectedMethod;
    const matchesStatus = selectedStatus === 'All' || txn.status === selectedStatus;
    return matchesSearch && matchesMethod && matchesStatus;
  });

  const handleExportCsv = () => {
    const headers = 'Transaction ID,RRN,Customer Name,Phone,Method,Amount,Status,Time\n';
    const rows = filtered
      .map(t => `${t.id},${t.rrn},"${t.customerName}",${t.phone},${t.method},${t.amount},${t.status},"${t.time}"`)
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Paytm_Settlements_Export_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Settlement Announcement Banner */}
      <div className="bg-gradient-to-r from-[#002970] via-[#003896] to-[#002970] text-white rounded-xl p-5 shadow-paytm-card border border-[#00BAF2]/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#00BAF2]/20 border border-[#00BAF2]/40 flex items-center justify-center text-[#00BAF2] shrink-0">
            <Landmark size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold tracking-tight">
                Pending Bank Settlement: Rs. {pendingSettlementAmount.toLocaleString('en-IN')}
              </h2>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[10px] font-bold px-2 py-0.5 rounded-full">
                0% Fee
              </span>
            </div>
            <p className="text-xs text-white/80 mt-0.5">
              Auto-Settlement scheduled at <strong className="text-white">11:00 PM tonight</strong> to HDFC Bank Account ****4102. Or transfer instantly now.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenSettlementModal}
          className="flex items-center gap-1.5 bg-[#10B981] hover:bg-emerald-600 text-white font-bold px-4 py-2 rounded-lg text-xs transition-all shadow-sm active:scale-95"
        >
          <ArrowUpRight size={14} />
          <span>Settle Instantly Now</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl p-4 border border-[#E2E8F0] shadow-paytm-card space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          
          {/* Search Box */}
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by customer name, RRN, or order ID..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-[#F4F6F9] rounded-lg border border-[#E2E8F0] focus:outline-none focus:border-[#00BAF2] transition-colors"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={selectedMethod}
              onChange={(e) => setSelectedMethod(e.target.value)}
              className="text-xs py-2 px-3 bg-[#F4F6F9] border border-[#E2E8F0] rounded-lg text-slate-700 focus:outline-none focus:border-[#00BAF2]"
            >
              <option value="All">All Methods</option>
              <option value="Paytm UPI">Paytm UPI</option>
              <option value="Soundbox">Soundbox</option>
              <option value="Paytm Wallet">Paytm Wallet</option>
              <option value="RuPay Card">RuPay Card</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="text-xs py-2 px-3 bg-[#F4F6F9] border border-[#E2E8F0] rounded-lg text-slate-700 focus:outline-none focus:border-[#00BAF2]"
            >
              <option value="All">All Statuses</option>
              <option value="Success">Success</option>
              <option value="Refunded">Refunded</option>
              <option value="Pending">Pending</option>
            </select>
          </div>

        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-paytm-card overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-[#002970]">QR &amp; Soundbox Transaction Ledger</h3>
            <span className="text-[11px] bg-sky-50 text-[#00BAF2] px-2 py-0.5 rounded font-bold font-mono">
              {filtered.length} Recorded
            </span>
          </div>
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 text-xs text-[#002970] hover:text-[#00BAF2] font-semibold transition-colors"
          >
            <Download size={13} />
            <span>Export CSV</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-[#64748B] text-[10px] uppercase font-bold tracking-wider bg-[#F8FAFC]">
                <th className="py-3 px-4">Transaction Details</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Payment Method</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((txn) => (
                <tr key={txn.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-bold text-[#002970] font-mono text-[11px]">{txn.id}</div>
                    <div className="text-[10px] text-[#64748B] font-mono">RRN: {txn.rrn} • {txn.time}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-800">{txn.customerName}</div>
                    <div className="text-[10px] text-[#64748B] font-mono">{txn.phone}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium text-[11px]">
                      {txn.method}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="font-black text-sm text-[#10B981] font-mono">
                      +Rs. {txn.amount.toLocaleString('en-IN')}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      txn.status === 'Success'
                        ? 'bg-emerald-50 text-[#10B981] border-emerald-200'
                        : txn.status === 'Refunded'
                        ? 'bg-blue-50 text-[#00BAF2] border-blue-200'
                        : 'bg-amber-50 text-[#F59E0B] border-amber-200'
                    }`}>
                      <CheckCircle2 size={11} />
                      {txn.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setReceiptTxn(txn)}
                      className="text-xs font-bold text-[#00BAF2] hover:text-[#002970] transition-colors"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {receiptTxn && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-paytm-modal max-w-sm w-full border border-[#E2E8F0] p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold text-[#002970]">Paytm Payment Receipt</span>
              <button onClick={() => setReceiptTxn(null)} className="text-slate-400 hover:text-slate-700">
                <X size={16} />
              </button>
            </div>

            <div className="bg-[#002970] text-white p-4 rounded-lg text-center space-y-1">
              <p className="text-xs font-bold">Sharma General Store</p>
              <p className="text-2xl font-black text-[#00BAF2]">Rs. {receiptTxn.amount}</p>
              <p className="text-[10px] text-emerald-300 font-bold">Payment Received Successfully</p>
            </div>

            <div className="space-y-2 text-xs divide-y divide-slate-100">
              <div className="pt-2 flex justify-between">
                <span className="text-slate-500">Customer</span>
                <strong className="text-slate-800">{receiptTxn.customerName}</strong>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-slate-500">RRN (UTR)</span>
                <strong className="font-mono text-slate-800">{receiptTxn.rrn}</strong>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-slate-500">Time</span>
                <strong className="text-slate-800">{receiptTxn.time}</strong>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-slate-500">Payment Channel</span>
                <strong className="text-slate-800">{receiptTxn.method}</strong>
              </div>
              {receiptTxn.orderNotes && (
                <div className="pt-2 flex justify-between">
                  <span className="text-slate-500">Items</span>
                  <strong className="text-slate-800 text-right">{receiptTxn.orderNotes}</strong>
                </div>
              )}
            </div>

            <button
              onClick={() => {
                window.print();
                setReceiptTxn(null);
              }}
              className="w-full bg-[#00BAF2] hover:bg-[#009EDC] text-white font-bold py-2 rounded-lg text-xs transition-colors shadow-sm"
            >
              Print Receipt Slip
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
