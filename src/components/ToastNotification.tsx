import React from 'react';
import { CheckCircle2, AlertTriangle, Send, X, Volume2, Bot } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'voice' | 'review' | 'campaign' | 'payment' | 'assistant';
  title: string;
  description: string;
  subtext?: string;
}

interface ToastNotificationProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastNotification: React.FC<ToastNotificationProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-16 right-6 z-50 space-y-2 pointer-events-none max-w-sm w-full">
      {toasts.map((toast) => {
        const isVoice = toast.type === 'voice';
        const isReview = toast.type === 'review';
        const isCampaign = toast.type === 'campaign';
        const isPayment = toast.type === 'payment';
        const isAssistant = toast.type === 'assistant';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto rounded-xl p-3.5 shadow-2xl border text-white transition-all transform animate-in slide-in-from-top-4 ${
              isVoice 
                ? 'bg-[#001E53] border-[#00BAF2]' 
                : isReview 
                ? 'bg-amber-950 border-amber-400' 
                : isCampaign 
                ? 'bg-emerald-950 border-emerald-400' 
                : isAssistant
                ? 'bg-sky-950 border-sky-400'
                : 'bg-[#002970] border-blue-400'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2.5">
                <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                  isVoice ? 'bg-[#00BAF2] text-[#002970]' :
                  isReview ? 'bg-amber-400 text-amber-950' :
                  isCampaign ? 'bg-emerald-400 text-emerald-950' :
                  isAssistant ? 'bg-sky-400 text-sky-950' :
                  'bg-blue-400 text-blue-950'
                }`}>
                  {isVoice && <Volume2 size={16} />}
                  {isReview && <AlertTriangle size={16} />}
                  {isCampaign && <Send size={16} />}
                  {isPayment && <CheckCircle2 size={16} />}
                  {isAssistant && <Bot size={16} />}
                </div>

                <div>
                  <h5 className="font-bold text-xs text-white leading-tight">
                    {toast.title}
                  </h5>
                  <p className="text-[11px] text-slate-200 mt-0.5 leading-snug">
                    {toast.description}
                  </p>
                  {toast.subtext && (
                    <span className="inline-block mt-1 text-[10px] font-mono text-[#00BAF2] bg-white/10 px-1.5 py-0.2 rounded">
                      {toast.subtext}
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={() => onDismiss(toast.id)}
                className="text-white/60 hover:text-white p-1 rounded transition-colors shrink-0"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
