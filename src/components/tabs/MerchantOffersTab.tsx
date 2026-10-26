import React, { useState } from 'react';
import { 
  Tag, 
  Smartphone, 
  CheckCircle2, 
  Plus, 
  ToggleLeft, 
  ToggleRight, 
  Check, 
  Pencil, 
  Trash2, 
  X, 
  AlertCircle
} from 'lucide-react';
import { MerchantOffer } from '../../types';
import { soundManager } from '../../utils/audio';

interface MerchantOffersTabProps {
  offers: MerchantOffer[];
  onToggleOffer: (id: string) => void;
  onAddOffer: (newOffer: Omit<MerchantOffer, 'id' | 'todayRedemptions'>) => void;
  onUpdateOffer: (updatedOffer: MerchantOffer) => void;
  onDeleteOffer: (id: string) => void;
  onApplyDealOnCustomerApp: (offerId: string) => void;
  customerSavedDeal: boolean;
}

export const MerchantOffersTab: React.FC<MerchantOffersTabProps> = ({
  offers,
  onToggleOffer,
  onAddOffer,
  onUpdateOffer,
  onDeleteOffer,
  onApplyDealOnCustomerApp,
  customerSavedDeal
}) => {
  const [activePreviewOfferId, setActivePreviewOfferId] = useState<string>(
    offers[0]?.id || 'OFFER_10'
  );

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<MerchantOffer | null>(null);
  const [deletingOffer, setDeletingOffer] = useState<MerchantOffer | null>(null);

  const [formTitle, setFormTitle] = useState('');
  const [formDiscount, setFormDiscount] = useState<number>(10);
  const [isCustomDiscount, setIsCustomDiscount] = useState(false);
  const [formCustomDiscount, setFormCustomDiscount] = useState('');

  const [formMinSpend, setFormMinSpend] = useState<number>(150);
  const [isCustomMinSpend, setIsCustomMinSpend] = useState(false);
  const [formCustomMinSpend, setFormCustomMinSpend] = useState('');

  const [formValidity, setFormValidity] = useState('7 Days');

  const activeOffer = offers.find(o => o.id === activePreviewOfferId) || offers[0] || {
    id: 'DEFAULT',
    title: 'Flat Rs. 10 OFF on Grocery Essentials',
    discountAmount: 10,
    minSpend: 150,
    todayRedemptions: 0,
    isActive: true,
    targetAudience: '',
    validity: '7 Days'
  };

  const openCreateModal = () => {
    setFormTitle('Weekend Kirana Special');
    setFormDiscount(10);
    setIsCustomDiscount(false);
    setFormCustomDiscount('');
    setFormMinSpend(150);
    setIsCustomMinSpend(false);
    setFormCustomMinSpend('');
    setFormValidity('7 Days');
    setIsAddModalOpen(true);
  };

  const openEditModal = (offer: MerchantOffer) => {
    setEditingOffer(offer);
    setFormTitle(offer.title);
    
    if ([10, 20, 50].includes(offer.discountAmount)) {
      setFormDiscount(offer.discountAmount);
      setIsCustomDiscount(false);
      setFormCustomDiscount('');
    } else {
      setIsCustomDiscount(true);
      setFormCustomDiscount(offer.discountAmount.toString());
      setFormDiscount(offer.discountAmount);
    }

    if ([150, 300, 500].includes(offer.minSpend)) {
      setFormMinSpend(offer.minSpend);
      setIsCustomMinSpend(false);
      setFormCustomMinSpend('');
    } else {
      setIsCustomMinSpend(true);
      setFormCustomMinSpend(offer.minSpend.toString());
      setFormMinSpend(offer.minSpend);
    }

    setFormValidity(offer.validity || '7 Days');
  };

  const handleSaveNewOffer = (e: React.FormEvent) => {
    e.preventDefault();
    const finalDiscount = isCustomDiscount ? (parseInt(formCustomDiscount) || 10) : formDiscount;
    const finalMinSpend = isCustomMinSpend ? (parseInt(formCustomMinSpend) || 150) : formMinSpend;

    const newOfferData = {
      title: formTitle.trim() || `Flat Rs. ${finalDiscount} OFF Special`,
      discountAmount: finalDiscount,
      minSpend: finalMinSpend,
      isActive: true,
      targetAudience: '',
      validity: formValidity || '7 Days'
    };

    onAddOffer(newOfferData);
    setIsAddModalOpen(false);
    soundManager.playSuccessPop();
  };

  const handleUpdateOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOffer) return;

    const finalDiscount = isCustomDiscount ? (parseInt(formCustomDiscount) || 10) : formDiscount;
    const finalMinSpend = isCustomMinSpend ? (parseInt(formCustomMinSpend) || 150) : formMinSpend;

    const updated: MerchantOffer = {
      ...editingOffer,
      title: formTitle.trim() || editingOffer.title,
      discountAmount: finalDiscount,
      minSpend: finalMinSpend,
      validity: formValidity || '7 Days'
    };

    onUpdateOffer(updated);
    setEditingOffer(null);
    soundManager.playSuccessPop();
  };

  const handleConfirmDelete = () => {
    if (!deletingOffer) return;
    onDeleteOffer(deletingOffer.id);

    if (activePreviewOfferId === deletingOffer.id) {
      const remaining = offers.filter(o => o.id !== deletingOffer.id);
      if (remaining.length > 0) {
        setActivePreviewOfferId(remaining[0].id);
      }
    }

    setDeletingOffer(null);
    soundManager.playAlertPing();
  };

  const handleApplyOnCustomerApp = () => {
    onApplyDealOnCustomerApp(activeOffer.id);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-[#002970] via-[#003896] to-[#002970] text-white rounded-xl p-4 sm:p-5 shadow-paytm-card border border-[#00BAF2]/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#00BAF2] text-[#002970]">
              <Tag size={18} />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#00BAF2]">
              Module 4: Loyalty &amp; Retention Engine
            </span>
          </div>
          <h2 className="text-xl font-black tracking-tight text-white mt-1">
            Check Merchant Offers &amp; Instant Dynamic Builder
          </h2>
          <p className="text-xs text-white/80 mt-1 max-w-2xl leading-relaxed">
            Manage cashback deals flashed to customers after scanning your Paytm QR.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white/10 px-3.5 py-2 rounded-lg border border-white/15 text-right">
            <span className="text-[10px] text-sky-200 block uppercase font-bold tracking-wider">Active Deals</span>
            <span className="text-base font-black text-[#00BAF2] font-mono">{offers.filter(o => o.isActive).length} Live</span>
          </div>
          <div className="bg-white/10 px-3.5 py-2 rounded-lg border border-white/15 text-right">
            <span className="text-[10px] text-emerald-200 block uppercase font-bold tracking-wider">Redemptions</span>
            <span className="text-base font-black text-[#10B981] font-mono">
              {offers.reduce((acc, curr) => acc + curr.todayRedemptions, 0)} Total
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-xl p-5 border border-[#E2E8F0] shadow-paytm-card space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-[#002970]">Active Store Offers</h3>
                <p className="text-xs text-[#64748B]">Click any row to sync live on customer phone</p>
              </div>

              <button
                onClick={openCreateModal}
                className="flex items-center justify-center gap-1.5 bg-[#00BAF2] hover:bg-[#009EDC] text-white font-bold px-3.5 py-2 rounded-lg text-xs transition-all shadow-sm active:scale-95 shrink-0"
              >
                <Plus size={15} />
                <span>+ Create New Offer</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-[#64748B] text-[10px] uppercase font-bold tracking-wider bg-[#F8FAFC]">
                    <th className="py-2.5 px-3">Offer Title</th>
                    <th className="py-2.5 px-3">Discount</th>
                    <th className="py-2.5 px-3">Min Spend</th>
                    <th className="py-2.5 px-3">Validity</th>
                    <th className="py-2.5 px-3">Claims</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {offers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400">
                        No active offers configured. Click "+ Create New Offer" above to add your first deal.
                      </td>
                    </tr>
                  ) : (
                    offers.map((offer) => {
                      const isCurrentlyPreviewed = offer.id === activeOffer.id;

                      return (
                        <tr 
                          key={offer.id} 
                          onClick={() => setActivePreviewOfferId(offer.id)}
                          className={`cursor-pointer transition-colors ${
                            isCurrentlyPreviewed 
                              ? 'bg-sky-50/70 border-l-4 border-l-[#00BAF2]' 
                              : 'hover:bg-slate-50/80'
                          }`}
                        >
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-[#002970]">{offer.title}</span>
                              {isCurrentlyPreviewed && (
                                <span className="text-[9px] bg-[#00BAF2] text-white font-bold px-1.5 py-0.2 rounded font-mono">
                                  Previewing
                                </span>
                              )}
                            </div>
                          </td>

                          <td className="py-3 px-3">
                            <span className="font-bold text-[#10B981] font-mono">
                              Rs. {offer.discountAmount} OFF
                            </span>
                          </td>

                          <td className="py-3 px-3 font-semibold text-slate-700">
                            Min Rs. {offer.minSpend}
                          </td>

                          <td className="py-3 px-3 text-slate-600 font-mono text-[11px]">
                            {offer.validity || '7 Days'}
                          </td>

                          <td className="py-3 px-3">
                            <span className="bg-emerald-50 text-[#10B981] font-bold px-2 py-0.5 rounded text-[11px] font-mono border border-emerald-200">
                              {offer.todayRedemptions} claims
                            </span>
                          </td>

                          <td className="py-3 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => onToggleOffer(offer.id)}
                              className="focus:outline-none"
                              title="Toggle offer status"
                            >
                              {offer.isActive ? (
                                <ToggleRight size={22} className="text-[#10B981] inline-block" />
                              ) : (
                                <ToggleLeft size={22} className="text-slate-300 inline-block" />
                              )}
                            </button>
                          </td>

                          <td className="py-3 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => openEditModal(offer)}
                                className="p-1.5 rounded-md hover:bg-slate-100 text-slate-600 hover:text-[#002970] transition-colors"
                                title="Edit this offer"
                              >
                                <Pencil size={14} />
                              </button>

                              <button
                                onClick={() => setDeletingOffer(offer)}
                                className="p-1.5 rounded-md hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
                                title="Delete this offer"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

          </div>

          <div className="bg-[#F4F6F9] rounded-lg p-3 border border-[#E2E8F0] flex items-center justify-between text-[11px] text-[#64748B]">
            <span className="flex items-center gap-1.5 font-bold text-[#002970]">
              <Tag size={13} className="text-[#00BAF2]" />
              Redemption Strategy:
            </span>
            <span>Rs. 10 (Daily essentials) • Rs. 20 (Pantry pack) • Rs. 50 (Bulk grocery)</span>
          </div>

        </div>

        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full max-w-[340px] bg-slate-900 rounded-[36px] p-3 shadow-2xl border-4 border-slate-800 relative">
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-4 bg-slate-900 rounded-b-xl z-20 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-slate-950" />
            </div>

            <div className="bg-[#F4F6F9] rounded-[28px] overflow-hidden min-h-[560px] flex flex-col justify-between text-slate-800 text-xs">
              <div>
                <div className="bg-[#002970] text-white p-4 pt-6 text-center space-y-1">
                  <span className="text-[10px] tracking-wider uppercase font-semibold text-sky-200">
                    Paytm UPI Payment Success
                  </span>
                  <div className="flex items-center justify-center gap-1.5 my-1">
                    <CheckCircle2 size={20} className="text-[#10B981]" />
                    <span className="text-xl font-black text-white">Paid Rs. 180</span>
                  </div>
                  <p className="text-[11px] text-white/90">to <strong>Sharma General Store</strong></p>
                  <p className="text-[9px] text-white/60 font-mono">UPI Ref: 428910398211</p>
                </div>

                <div className="p-3.5 space-y-3">
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-dashed border-[#F59E0B] rounded-xl p-3.5 text-center shadow-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="inline-block bg-[#002970] text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Store Reward
                      </span>
                      <span className="text-[9px] text-[#F59E0B] font-bold">
                        {activeOffer.validity || 'Valid 7 Days'}
                      </span>
                    </div>

                    <h4 className="text-xs font-black text-[#002970] leading-snug">
                      Check Merchant Offers - Tap to Save Rs. {activeOffer.discountAmount} on your next Rs. {activeOffer.minSpend} purchase at Sharma Store!
                    </h4>

                    <p className="text-[10px] text-[#64748B]">
                      {activeOffer.title}
                    </p>

                    <button
                      onClick={handleApplyOnCustomerApp}
                      className={`w-full py-2 px-3 rounded-lg text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 ${
                        customerSavedDeal
                          ? 'bg-[#10B981] text-white'
                          : 'bg-[#00BAF2] hover:bg-[#009EDC] text-white active:scale-95'
                      }`}
                    >
                      {customerSavedDeal ? (
                        <>
                          <Check size={14} />
                          <span>Deal Saved in Your Paytm Wallet!</span>
                        </>
                      ) : (
                        <>
                          <Tag size={13} />
                          <span>Apply Deal &amp; Save Offer</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1.5 text-[10px] text-slate-600">
                    <div className="flex items-center justify-between">
                      <span>Reward Partner</span>
                      <strong className="text-[#002970]">Sharma General Store</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Voucher Value</span>
                      <strong className="text-[#10B981] font-mono">Rs. {activeOffer.discountAmount} Direct Discount</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Min Order</span>
                      <strong className="text-slate-800">Rs. {activeOffer.minSpend}</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Validity</span>
                      <strong className="text-amber-700">{activeOffer.validity || '7 Days'}</strong>
                    </div>
                  </div>

                </div>
              </div>

              <div className="bg-white border-t border-slate-200 p-2 flex items-center justify-around text-[9px] text-slate-400">
                <span className="font-bold text-[#002970]">Home</span>
                <span>Passbook</span>
                <span>UPI Money</span>
                <span>Offers</span>
              </div>

            </div>

            <div className="w-24 h-1 bg-slate-700 rounded-full mx-auto mt-2" />
          </div>

          <p className="text-xs text-[#64748B] text-center mt-2">
            Live Customer Preview
          </p>

        </div>

      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-paytm-modal max-w-md w-full border border-[#E2E8F0] overflow-hidden">
            
            <div className="bg-[#002970] text-white px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Plus size={16} className="text-[#00BAF2]" />
                <h3 className="text-sm font-bold tracking-tight">Create New Offer</h3>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-white/60 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveNewOffer} className="p-5 space-y-4 text-xs">
              
              {/* Offer Title */}
              <div className="space-y-1">
                <label className="font-bold text-[#0F172A] uppercase tracking-wider text-[10px]">
                  Offer Title
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Weekend Grocery Special"
                  className="w-full py-2 px-3 bg-[#F4F6F9] border border-[#E2E8F0] rounded-lg text-slate-800 focus:outline-none focus:border-[#00BAF2]"
                />
              </div>

              {/* Discount Amount */}
              <div className="space-y-1.5">
                <label className="font-bold text-[#0F172A] uppercase tracking-wider text-[10px]">
                  Discount Amount (INR)
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[10, 20, 50].map((amt) => (
                    <button
                      type="button"
                      key={amt}
                      onClick={() => {
                        setFormDiscount(amt);
                        setIsCustomDiscount(false);
                      }}
                      className={`py-2 px-2 rounded-lg border text-center font-bold transition-all ${
                        !isCustomDiscount && formDiscount === amt
                          ? 'bg-[#002970] text-white border-[#002970]'
                          : 'bg-[#F4F6F9] text-slate-700 border-[#E2E8F0] hover:bg-slate-100'
                      }`}
                    >
                      Rs. {amt}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setIsCustomDiscount(true)}
                    className={`py-2 px-2 rounded-lg border text-center font-bold transition-all ${
                      isCustomDiscount
                        ? 'bg-[#002970] text-white border-[#002970]'
                        : 'bg-[#F4F6F9] text-slate-700 border-[#E2E8F0] hover:bg-slate-100'
                    }`}
                  >
                    Custom
                  </button>
                </div>

                {isCustomDiscount && (
                  <div className="pt-1">
                    <input
                      type="number"
                      required
                      min="1"
                      placeholder="Enter discount in Rs."
                      value={formCustomDiscount}
                      onChange={(e) => setFormCustomDiscount(e.target.value)}
                      className="w-full py-2 px-3 bg-[#F4F6F9] border border-[#00BAF2] rounded-lg text-slate-800 focus:outline-none font-mono"
                    />
                  </div>
                )}
              </div>

              {/* Minimum Basket Value Threshold */}
              <div className="space-y-1.5">
                <label className="font-bold text-[#0F172A] uppercase tracking-wider text-[10px]">
                  Minimum Basket Spend
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[150, 300, 500].map((thresh) => (
                    <button
                      type="button"
                      key={thresh}
                      onClick={() => {
                        setFormMinSpend(thresh);
                        setIsCustomMinSpend(false);
                      }}
                      className={`py-2 px-2 rounded-lg border text-center font-bold transition-all ${
                        !isCustomMinSpend && formMinSpend === thresh
                          ? 'bg-[#00BAF2] text-white border-[#00BAF2]'
                          : 'bg-[#F4F6F9] text-slate-700 border-[#E2E8F0] hover:bg-slate-100'
                      }`}
                    >
                      Rs. {thresh}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setIsCustomMinSpend(true)}
                    className={`py-2 px-2 rounded-lg border text-center font-bold transition-all ${
                      isCustomMinSpend
                        ? 'bg-[#00BAF2] text-white border-[#00BAF2]'
                        : 'bg-[#F4F6F9] text-slate-700 border-[#E2E8F0] hover:bg-slate-100'
                    }`}
                  >
                    Custom
                  </button>
                </div>

                {isCustomMinSpend && (
                  <div className="pt-1">
                    <input
                      type="number"
                      required
                      min="10"
                      placeholder="Enter minimum spend in Rs."
                      value={formCustomMinSpend}
                      onChange={(e) => setFormCustomMinSpend(e.target.value)}
                      className="w-full py-2 px-3 bg-[#F4F6F9] border border-[#00BAF2] rounded-lg text-slate-800 focus:outline-none font-mono"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#0F172A] uppercase tracking-wider text-[10px]">
                  Validity Window
                </label>
                <select
                  value={formValidity}
                  onChange={(e) => setFormValidity(e.target.value)}
                  className="w-full py-2 px-3 bg-[#F4F6F9] border border-[#E2E8F0] rounded-lg text-slate-800 focus:outline-none focus:border-[#00BAF2]"
                >
                  <option value="48 Hours">48 Hours</option>
                  <option value="7 Days">7 Days</option>
                  <option value="15 Days">15 Days</option>
                  <option value="30 Days">30 Days</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="py-2 px-4 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-5 rounded-lg bg-[#00BAF2] hover:bg-[#009EDC] text-white font-bold transition-all shadow-sm active:scale-95"
                >
                  Save Offer
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {editingOffer && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-paytm-modal max-w-md w-full border border-[#E2E8F0] overflow-hidden">
            
            <div className="bg-[#002970] text-white px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Pencil size={16} className="text-[#00BAF2]" />
                <h3 className="text-sm font-bold tracking-tight">Edit Offer</h3>
              </div>
              <button 
                onClick={() => setEditingOffer(null)}
                className="text-white/60 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUpdateOffer} className="p-5 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-[#0F172A] uppercase tracking-wider text-[10px]">
                  Offer Title
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full py-2 px-3 bg-[#F4F6F9] border border-[#E2E8F0] rounded-lg text-slate-800 focus:outline-none focus:border-[#00BAF2]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-[#0F172A] uppercase tracking-wider text-[10px]">
                  Discount Amount (INR)
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[10, 20, 50].map((amt) => (
                    <button
                      type="button"
                      key={amt}
                      onClick={() => {
                        setFormDiscount(amt);
                        setIsCustomDiscount(false);
                      }}
                      className={`py-2 px-2 rounded-lg border text-center font-bold transition-all ${
                        !isCustomDiscount && formDiscount === amt
                          ? 'bg-[#002970] text-white border-[#002970]'
                          : 'bg-[#F4F6F9] text-slate-700 border-[#E2E8F0] hover:bg-slate-100'
                      }`}
                    >
                      Rs. {amt}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setIsCustomDiscount(true)}
                    className={`py-2 px-2 rounded-lg border text-center font-bold transition-all ${
                      isCustomDiscount
                        ? 'bg-[#002970] text-white border-[#002970]'
                        : 'bg-[#F4F6F9] text-slate-700 border-[#E2E8F0] hover:bg-slate-100'
                    }`}
                  >
                    Custom
                  </button>
                </div>

                {isCustomDiscount && (
                  <div className="pt-1">
                    <input
                      type="number"
                      required
                      min="1"
                      placeholder="Enter custom discount in Rs."
                      value={formCustomDiscount}
                      onChange={(e) => setFormCustomDiscount(e.target.value)}
                      className="w-full py-2 px-3 bg-[#F4F6F9] border border-[#00BAF2] rounded-lg text-slate-800 focus:outline-none font-mono"
                    />
                  </div>
                )}
              </div>

              {/* Minimum Basket Value Threshold */}
              <div className="space-y-1.5">
                <label className="font-bold text-[#0F172A] uppercase tracking-wider text-[10px]">
                  Minimum Basket Spend
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[150, 300, 500].map((thresh) => (
                    <button
                      type="button"
                      key={thresh}
                      onClick={() => {
                        setFormMinSpend(thresh);
                        setIsCustomMinSpend(false);
                      }}
                      className={`py-2 px-2 rounded-lg border text-center font-bold transition-all ${
                        !isCustomMinSpend && formMinSpend === thresh
                          ? 'bg-[#00BAF2] text-white border-[#00BAF2]'
                          : 'bg-[#F4F6F9] text-slate-700 border-[#E2E8F0] hover:bg-slate-100'
                      }`}
                    >
                      Rs. {thresh}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setIsCustomMinSpend(true)}
                    className={`py-2 px-2 rounded-lg border text-center font-bold transition-all ${
                      isCustomMinSpend
                        ? 'bg-[#00BAF2] text-white border-[#00BAF2]'
                        : 'bg-[#F4F6F9] text-slate-700 border-[#E2E8F0] hover:bg-slate-100'
                    }`}
                  >
                    Custom
                  </button>
                </div>

                {isCustomMinSpend && (
                  <div className="pt-1">
                    <input
                      type="number"
                      required
                      min="10"
                      placeholder="Enter custom minimum spend in Rs."
                      value={formCustomMinSpend}
                      onChange={(e) => setFormCustomMinSpend(e.target.value)}
                      className="w-full py-2 px-3 bg-[#F4F6F9] border border-[#00BAF2] rounded-lg text-slate-800 focus:outline-none font-mono"
                    />
                  </div>
                )}
              </div>

              {/* Offer Expiry / Validity Date */}
              <div className="space-y-1">
                <label className="font-bold text-[#0F172A] uppercase tracking-wider text-[10px]">
                  Validity Window
                </label>
                <select
                  value={formValidity}
                  onChange={(e) => setFormValidity(e.target.value)}
                  className="w-full py-2 px-3 bg-[#F4F6F9] border border-[#E2E8F0] rounded-lg text-slate-800 focus:outline-none focus:border-[#00BAF2]"
                >
                  <option value="48 Hours">48 Hours</option>
                  <option value="7 Days">7 Days</option>
                  <option value="15 Days">15 Days</option>
                  <option value="30 Days">30 Days</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingOffer(null)}
                  className="py-2 px-4 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-5 rounded-lg bg-[#002970] hover:bg-[#001E53] text-white font-bold transition-all shadow-sm active:scale-95"
                >
                  Update Offer
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {deletingOffer && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-paytm-modal max-w-sm w-full border border-[#E2E8F0] p-5 space-y-4">
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-200">
                <AlertCircle size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#0F172A]">Delete Offer</h3>
                <p className="text-xs text-[#64748B]">{deletingOffer.title}</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to delete this offer? It will no longer flash on customer payment screens.
            </p>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeletingOffer(null)}
                className="py-2 px-4 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold transition-colors text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="py-2 px-4 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold transition-all shadow-sm active:scale-95 text-xs"
              >
                Confirm Delete
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
