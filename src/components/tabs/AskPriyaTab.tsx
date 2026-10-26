import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Clock, 
  Store, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  Volume2, 
  VolumeX, 
  RotateCcw,
  BookOpen,
  Zap,
  HelpCircle,
  Calendar,
  DollarSign,
  UserCheck
} from 'lucide-react';
import { 
  Transaction, 
  UdhaarEntry, 
  MerchantOffer, 
  SoundboxTelemetry,
  TabType 
} from '../../types';
import { HOURLY_DATA, DAY_WISE_DATA } from '../../data/mockData';
import { soundManager } from '../../utils/audio';

interface AskPriyaTabProps {
  todayCollection: number;
  transactionsCount: number;
  pendingSettlementAmount: number;
  telemetry: SoundboxTelemetry;
  transactions: Transaction[];
  udhaarLedger: UdhaarEntry[];
  offers: MerchantOffer[];
  onNavigateToTab: (tab: TabType) => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'priya';
  text: string;
  hindiText?: string;
  timestamp: string;
  metrics?: { label: string; value: string; trend?: 'up' | 'down' | 'neutral' }[];
  suggestedAction?: {
    label: string;
    tab: TabType;
  };
}

export const AskPriyaTab: React.FC<AskPriyaTabProps> = ({
  todayCollection,
  transactionsCount,
  pendingSettlementAmount,
  telemetry,
  transactions,
  udhaarLedger,
  offers,
  onNavigateToTab
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_welcome',
      sender: 'priya',
      text: "Namaste! I am Priya, your dedicated Kirana business advisor. I continuously scan your hourly transaction velocity, Bahi-Khata ledgers, and bank settlement batches. What would you like to know about Sharma General Store today?",
      hindiText: "नमस्ते! मैं प्रिया हूँ, आपकी दुकान की बिजनेस सलाहकार। मैंने आज की कुल बिक्री, ग्राहकों का उधार, और व्यस्त समय का पूरा विश्लेषण कर लिया है। आप मुझसे कुछ भी पूछ सकते हैं!",
      timestamp: 'Just now',
      metrics: [
        { label: "Today's Gross Sales", value: `₹${todayCollection.toLocaleString('en-IN')}`, trend: 'up' },
        { label: "Active Pending Udhaar", value: `₹${udhaarLedger.filter(u => u.status !== 'Paid').reduce((acc, u) => acc + u.amount, 0).toLocaleString('en-IN')}`, trend: 'neutral' },
        { label: "Peak Sales Window", value: "6 PM – 8:30 PM", trend: 'up' }
      ]
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Available female voices pool
  const [femaleVoice, setFemaleVoice] = useState<SpeechSynthesisVoice | null>(null);

  // Initialize and select a female voice (Hindi/English)
  useEffect(() => {
    if (!('speechSynthesis' in window)) return;

    const pickVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      // Look for female voice matching Hindi or Indian English or generic female name
      const bestFemale = voices.find(v => 
        (v.lang.includes('hi') || v.lang.includes('IN') || v.lang.includes('en')) &&
        (v.name.toLowerCase().includes('female') || 
         v.name.toLowerCase().includes('zira') || 
         v.name.toLowerCase().includes('priya') || 
         v.name.toLowerCase().includes('swara') || 
         v.name.toLowerCase().includes('veena') ||
         v.name.toLowerCase().includes('heera') ||
         v.name.toLowerCase().includes('aditi') ||
         v.name.toLowerCase().includes('samantha') ||
         v.name.toLowerCase().includes('google hindi') ||
         v.name.toLowerCase().includes('natural'))
      ) || voices.find(v => v.lang.startsWith('hi')) || voices[0];

      if (bestFemale) {
        setFemaleVoice(bestFemale);
      }
    };

    pickVoice();
    window.speechSynthesis.onvoiceschanged = pickVoice;
  }, []);

  // Auto scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Derived live analytics
  const totalUdhaarDue = udhaarLedger.filter(u => u.status !== 'Paid').reduce((acc, u) => acc + u.amount, 0);
  const highRiskUdhaar = udhaarLedger.filter(u => u.status !== 'Paid' && u.daysOverdue > 7);

  // Question presets for quick 1-click merchant convenience
  const QUICK_QUESTIONS = [
    {
      icon: Clock,
      query: "What are my peak rush hours?",
      hindi: "दुकान में सबसे ज्यादा भीड़ किस समय होती है?"
    },
    {
      icon: Store,
      query: "When should I open & when should I NOT close the shop?",
      hindi: "दुकान कब खोलनी चाहिए और किस समय बिल्कुल बंद नहीं करनी चाहिए?"
    },
    {
      icon: BookOpen,
      query: "How much Udhaar is overdue & who should I recover from first?",
      hindi: "उधार में कितना फंसा है और सबसे पहले किससे मांगना है?"
    },
    {
      icon: DollarSign,
      query: "What is my bank settlement status & 0% working capital eligibility?",
      hindi: "आज का सेटलमेंट और ₹5,000 इमरजेंसी लोन का क्या स्टेटस है?"
    },
    {
      icon: TrendingUp,
      query: "How are my sales performing compared to last week?",
      hindi: "पिछले हफ्ते की तुलना में मेरी दुकान की ग्रोथ कैसी है?"
    }
  ];

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query) return;

    soundManager.playSuccessPop();

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputQuery('');
    setIsTyping(true);

    // Business Analytical Reasoning
    setTimeout(() => {
      const lower = query.toLowerCase();
      let responseText = "";
      let responseHindi = "";
      let metrics: { label: string; value: string; trend?: 'up' | 'down' | 'neutral' }[] | undefined = undefined;
      let action: { label: string; tab: TabType } | undefined = undefined;

      if (lower.includes('peak') || lower.includes('rush') || lower.includes('busy') || lower.includes('bheed') || lower.includes('ghante')) {
        responseText = `Based on today's 142 QR transactions, your main shopping rush is concentrated in the evening between 06:00 PM and 08:30 PM. Your absolute highest peak hour is 07:00 PM with ₹5,200 collected across 42 payments. There is also a secondary morning tea/breakfast rush at 09:00 AM (₹3,850 across 32 customers).`;
        responseHindi = `आज के डेटा के अनुसार, आपकी दुकान में सबसे ज्यादा भीड़ शाम 6:00 PM से रात 8:30 PM के बीच होती है। शाम 7:00 बजे सबसे ज्यादा ₹5,200 की बिक्री हुई। सुबह 9:00 बजे भी नाश्ते के समय 32 ग्राहकों का रश रहा।`;
        metrics = [
          { label: 'Absolute Peak Hour', value: '07:00 PM (₹5,200)', trend: 'up' },
          { label: 'Morning Peak Hour', value: '09:00 AM (₹3,850)', trend: 'up' },
          { label: 'Afternoon Slump', value: '02:00 PM (₹450)', trend: 'down' }
        ];
        action = { label: 'View Hourly Sales Visualizer', tab: 'overview' };
      } 
      else if (lower.includes('open') || lower.includes('close') || lower.includes('timing') || lower.includes('shutter') || lower.includes('band') || lower.includes('khol')) {
        responseText = `Recommended Operational Schedule:\n• Optimal Opening Time: 07:30 AM to catch the ₹3,850 morning peak starting at 8:00 AM.\n• Crucial Do-Not-Close Window: NEVER close or shut counter between 05:45 PM and 09:15 PM! This 3.5-hour period generates 62% (₹11,450) of your entire day's gross revenue.\n• Best Restock / Lunch Break: 01:30 PM to 03:30 PM, where sales average under ₹550/hr across only 3-4 visits.`;
        responseHindi = `दुकान खोलने और बंद करने का सटीक समय:\n• सुबह खोलने का समय: 7:30 AM तक दुकान खोल लें क्योंकि 8:00 AM से दूध-नाश्ते का रश शुरू होता है।\n• भूलकर भी बंद न करें: शाम 5:45 PM से रात 9:15 PM के बीच काउंटर बिल्कुल बंद न करें! आपकी दिन की 62% कमाई (₹11,450) इसी समय होती है।\n• आराम/स्टॉक भरने का समय: दोपहर 1:30 PM से 3:30 PM (सिर्फ ₹450-₹600 की बिक्री)।`;
        metrics = [
          { label: 'Evening Revenue Share', value: '62% (₹11,450)', trend: 'up' },
          { label: 'Do Not Close Window', value: '5:45 PM – 9:15 PM', trend: 'up' },
          { label: 'Optimal Restock Time', value: '1:30 PM – 3:30 PM', trend: 'down' }
        ];
        action = { label: 'Check Overview Dashboard', tab: 'overview' };
      }
      else if (lower.includes('udhaar') || lower.includes('khata') || lower.includes('debt') || lower.includes('recover') || lower.includes('baaki')) {
        const topBorrower = udhaarLedger.find(u => u.amount >= 2000) || udhaarLedger[0];
        responseText = `Your live Bahi-Khata ledger has ₹${totalUdhaarDue.toLocaleString('en-IN')} pending across ${udhaarLedger.filter(u => u.status !== 'Paid').length} customers. You have ${highRiskUdhaar.length} high-risk customers overdue beyond 7 days. You should immediately push WhatsApp QR reminders to ${topBorrower.name} (₹${topBorrower.amount.toLocaleString('en-IN')}, ${topBorrower.daysOverdue} days overdue).`;
        responseHindi = `आपके बही-खाते में कुल ₹${totalUdhaarDue.toLocaleString('en-IN')} का उधार बकाया है। 7 दिन से ज्यादा पुराने ${highRiskUdhaar.length} ग्राहक हैं। सबसे पहले ${topBorrower.name} (₹${topBorrower.amount}) को WhatsApp QR लिंक भेजकर रिकवर करें।`;
        metrics = [
          { label: 'Total Active Udhaar', value: `₹${totalUdhaarDue.toLocaleString('en-IN')}`, trend: 'down' },
          { label: 'High Risk (>7 Days)', value: `${highRiskUdhaar.length} Customers`, trend: 'down' },
          { label: 'Recovered This Week', value: '₹4,150 via WhatsApp', trend: 'up' }
        ];
        action = { label: 'Open Udhaar Ledger & Send WhatsApp QR', tab: 'udhaar-ledger' };
      }
      else if (lower.includes('loan') || lower.includes('settlement') || lower.includes('credit') || lower.includes('paisa') || lower.includes('capital') || lower.includes('bank')) {
        responseText = `Your current bank settlement balance is ₹${pendingSettlementAmount.toLocaleString('en-IN')}, scheduled to auto-settle to HDFC Bank (****4102) tonight at 11:00 PM at 0% fee.\nAdditionally, based on your daily QR velocity of ₹14,500/day, you have an Instant Pre-Approved Emergency Loan of ₹5,000 at 0% APR available right now via Paytm Payouts!`;
        responseHindi = `आपका आज का बैंक सेटलमेंट ₹${pendingSettlementAmount.toLocaleString('en-IN')} है, जो रात 11:00 बजे बिना किसी चार्ज के आपके HDFC बैंक (****4102) में जमा हो जाएगा। साथ ही, आपकी ₹14,500/दिन की QR बिक्री के आधार पर आपको ₹5,000 का 0% ब्याज वाला इमरजेंसी लोन तुरंत मिल सकता है!`;
        metrics = [
          { label: 'Pending Settlement', value: `₹${pendingSettlementAmount.toLocaleString('en-IN')}`, trend: 'up' },
          { label: 'Pre-Approved 0% Loan', value: '₹5,000 Instant', trend: 'up' },
          { label: 'Underwriting Score', value: '94/100 (Tier-1)', trend: 'up' }
        ];
        action = { label: 'Claim ₹5,000 Emergency Loan', tab: 'urgent-loan' };
      }
      else if (lower.includes('growth') || lower.includes('sale') || lower.includes('bikri') || lower.includes('compare') || lower.includes('last week')) {
        responseText = `Sharma General Store is outperforming last week's baseline! Today's ₹${todayCollection.toLocaleString('en-IN')} across ${transactionsCount} orders is +18.4% higher than last Tuesday (₹15,580). Your average grocery basket size has increased from ₹118 to ₹130.`;
        responseHindi = `आपकी दुकान पिछले हफ्ते से 18.4% बेहतर चल रही है! आज की कुल बिक्री ₹${todayCollection.toLocaleString('en-IN')} है, जबकि पिछले मंगलवार को ₹15,580 थी। औसत बिल साइज ₹118 से बढ़कर ₹130 हो गया है।`;
        metrics = [
          { label: "Today's Collection", value: `₹${todayCollection.toLocaleString('en-IN')}`, trend: 'up' },
          { label: 'Week-on-Week Growth', value: '+18.4% (₹2,870)', trend: 'up' },
          { label: 'Average Basket Size', value: '₹130', trend: 'up' }
        ];
        action = { label: 'View Transactions Stream', tab: 'transactions-settlements' };
      }
      else {
        responseText = `I have analyzed Sharma General Store's dataset. Today you've processed ${transactionsCount} QR payments generating ₹${todayCollection.toLocaleString('en-IN')}. Outstanding Udhaar stands at ₹${totalUdhaarDue.toLocaleString('en-IN')}, and ₹${pendingSettlementAmount.toLocaleString('en-IN')} is awaiting nightly 11 PM settlement. Your Soundbox battery is healthy at ${telemetry.batteryLevel}%. How can I help you optimize further?`;
        responseHindi = `मैंने दुकान का पूरा डेटा स्कैन कर लिया है। आज ${transactionsCount} पेमेंट्स से ₹${todayCollection.toLocaleString('en-IN')} आए हैं, बही-खाते में ₹${totalUdhaarDue.toLocaleString('en-IN')} बकाया है, और रात 11 बजे ₹${pendingSettlementAmount.toLocaleString('en-IN')} बैंक में सेटल होंगे। साउंडबॉक्स 92% चार्ज है।`;
      }

      const priyaReply: ChatMessage = {
        id: `priya_${Date.now()}`,
        sender: 'priya',
        text: responseText,
        hindiText: responseHindi,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        metrics,
        suggestedAction: action
      };

      setMessages(prev => [...prev, priyaReply]);
      setIsTyping(false);
      soundManager.playAlertPing();
    }, 600);
  };

  // Female voice audio synthesis
  const handleSpeak = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }
    // High-clarity female pitch and smooth pace
    utterance.pitch = 1.35;
    utterance.rate = 0.95;
    utterance.lang = 'hi-IN';
    
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-[#002970] via-[#003da5] to-[#002970] text-white rounded-2xl p-5 md:p-6 shadow-paytm-card border border-[#00BAF2]/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#00BAF2] to-sky-200 text-[#002970] flex items-center justify-center font-black shadow-lg shrink-0 relative">
            <span className="text-2xl font-black">P</span>
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#10B981] border-2 border-[#002970] animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black tracking-tight text-white">Ask Priya</h2>
              <span className="bg-[#00BAF2]/20 border border-[#00BAF2]/40 text-[#00BAF2] text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles size={11} /> Module 1: Kirana Business Copilot
              </span>
            </div>
            <p className="text-xs text-sky-200 mt-1">
              Live advisor scanning your transactions, Soundbox logs, Bahi-Khata registers, and peak traffic trends.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl border border-white/15 text-xs text-white">
          <Store size={14} className="text-[#00BAF2]" />
          <span>Sharma General Store • Live Store Advisor</span>
        </div>
      </div>

      {/* Main Conversation Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Chat Window */}
        <div className="lg:col-span-2 bg-white dark:bg-[#111827] rounded-2xl border border-[#E2E8F0] dark:border-slate-800 shadow-sm flex flex-col h-[650px] overflow-hidden">
          
          {/* Chat Messages Log */}
          <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-4 bg-[#F8FAFC] dark:bg-slate-900/50">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'priya' && (
                  <div className="w-8 h-8 rounded-full bg-[#002970] text-[#00BAF2] flex items-center justify-center shrink-0 font-bold text-xs mt-1 shadow-xs border border-[#00BAF2]">
                    P
                  </div>
                )}

                <div className={`max-w-[85%] rounded-2xl p-4 shadow-xs text-xs space-y-3 ${
                  msg.sender === 'user' 
                    ? 'bg-[#002970] text-white rounded-br-none' 
                    : 'bg-white dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 text-[#0F172A] dark:text-slate-100 rounded-bl-none'
                }`}>
                  <div className="flex items-center justify-between gap-3 text-[10px] text-[#64748B] dark:text-slate-400">
                    <span className="font-bold">{msg.sender === 'user' ? 'Merchant (You)' : 'Priya'}</span>
                    <span>{msg.timestamp}</span>
                  </div>

                  {/* Primary text */}
                  <p className="text-xs leading-relaxed whitespace-pre-line font-medium">
                    {msg.text}
                  </p>

                  {/* Hindi Translation Subtext for Priya */}
                  {msg.hindiText && (
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-700 text-[#002970] dark:text-sky-300 font-medium italic text-[11px] leading-relaxed bg-sky-50/50 dark:bg-slate-800/80 p-2.5 rounded-lg border border-sky-100 dark:border-slate-700">
                      🇮🇳 {msg.hindiText}
                    </div>
                  )}

                  {/* Metrics preview cards if provided */}
                  {msg.metrics && msg.metrics.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
                      {msg.metrics.map((m, idx) => (
                        <div key={idx} className="bg-[#F4F6F9] dark:bg-slate-900 p-2.5 rounded-lg border border-[#E2E8F0] dark:border-slate-700 text-center">
                          <span className="text-[10px] text-[#64748B] dark:text-slate-400 block font-semibold truncate">{m.label}</span>
                          <span className={`text-xs font-black mt-0.5 block ${
                            m.trend === 'up' ? 'text-[#10B981]' : m.trend === 'down' ? 'text-[#F59E0B]' : 'text-[#002970] dark:text-sky-400'
                          }`}>
                            {m.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Action Link Button if provided */}
                  {msg.suggestedAction && (
                    <div className="pt-1">
                      <button
                        onClick={() => onNavigateToTab(msg.suggestedAction!.tab)}
                        className="w-full bg-[#00BAF2] hover:bg-[#009EDC] text-white font-bold py-2 px-3 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs"
                      >
                        <span>{msg.suggestedAction.label}</span>
                        <Zap size={13} />
                      </button>
                    </div>
                  )}

                  {/* Girl Voice Audio Speak button */}
                  {msg.sender === 'priya' && msg.hindiText && (
                    <div className="flex justify-end pt-1">
                      <button
                        onClick={() => handleSpeak(msg.hindiText!)}
                        className="text-[10px] text-[#00BAF2] hover:text-[#002970] dark:hover:text-white font-bold flex items-center gap-1 transition-colors bg-sky-50 dark:bg-slate-700 px-2.5 py-1 rounded-md border border-sky-200 dark:border-slate-600"
                      >
                        {isSpeaking ? <VolumeX size={12} className="text-rose-500" /> : <Volume2 size={12} className="text-[#00BAF2]" />}
                        <span>{isSpeaking ? 'Stop Audio' : "Listen to Priya's Voice"}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-[#64748B] p-2">
                <div className="w-7 h-7 rounded-full bg-[#002970] text-[#00BAF2] flex items-center justify-center font-bold text-xs border border-[#00BAF2]">
                  P
                </div>
                <div className="flex items-center gap-1 bg-white dark:bg-slate-800 px-3 py-2 rounded-xl border border-[#E2E8F0] dark:border-slate-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00BAF2] animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00BAF2] animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00BAF2] animate-bounce [animation-delay:0.4s]" />
                  <span className="text-[11px] text-[#64748B] dark:text-slate-400 ml-1.5 font-medium">Scanning all store data...</span>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Input Bar */}
          <div className="p-3.5 bg-white dark:bg-[#111827] border-t border-[#E2E8F0] dark:border-slate-800 flex items-center gap-2">
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask Priya: 'What is my peak hour?', 'When to open shop?', 'Who owes udhaar?'..."
              className="flex-1 bg-[#F4F6F9] dark:bg-slate-800 border border-[#CBD5E1] dark:border-slate-700 focus:border-[#00BAF2] focus:ring-1 focus:ring-[#00BAF2] rounded-xl px-4 py-2.5 text-xs text-[#0F172A] dark:text-white outline-none transition-all placeholder:text-[#94A3B8]"
            />
            <button
              onClick={() => handleSend()}
              disabled={!inputQuery.trim() || isTyping}
              className="bg-[#002970] hover:bg-[#001E53] disabled:opacity-50 text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm shrink-0 active:scale-95"
            >
              <span>Ask Priya</span>
              <Send size={14} />
            </button>
          </div>
        </div>

        {/* Right 1 Col: Quick Queries & Live Store Health */}
        <div className="space-y-4">
          
          {/* Quick Prompts Panel */}
          <div className="bg-white dark:bg-[#111827] rounded-2xl p-4 border border-[#E2E8F0] dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-[#E2E8F0] dark:border-slate-800">
              <Sparkles size={16} className="text-[#00BAF2]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#002970] dark:text-white">
                Frequently Asked Insights
              </h3>
            </div>

            <div className="space-y-2">
              {QUICK_QUESTIONS.map((q, idx) => {
                const Icon = q.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSend(q.query)}
                    className="w-full text-left p-2.5 rounded-xl border border-[#E2E8F0] dark:border-slate-800 hover:border-[#00BAF2] dark:hover:border-[#00BAF2] hover:bg-sky-50/50 dark:hover:bg-slate-800/50 transition-all group flex items-start gap-2.5"
                  >
                    <div className="p-1.5 rounded-lg bg-[#002970]/5 group-hover:bg-[#00BAF2] group-hover:text-white text-[#002970] dark:text-slate-300 transition-colors shrink-0 mt-0.5">
                      <Icon size={14} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#0F172A] dark:text-slate-200 group-hover:text-[#002970] dark:group-hover:text-[#00BAF2] transition-colors leading-snug">
                        {q.query}
                      </p>
                      <p className="text-[10px] text-[#64748B] dark:text-slate-400 mt-0.5 font-medium truncate">
                        {q.hindi}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Real-time Data Feeds Scanned by Priya */}
          <div className="bg-white dark:bg-[#111827] rounded-2xl p-4 border border-[#E2E8F0] dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#002970] dark:text-white pb-2 border-b border-[#E2E8F0] dark:border-slate-800 flex items-center justify-between">
              <span>Data Sources Scanned</span>
              <span className="text-[10px] font-bold text-[#10B981] flex items-center gap-1">
                <CheckCircle2 size={11} /> 100% Synced
              </span>
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#F8FAFC] dark:bg-slate-900">
                <span className="text-[#64748B] dark:text-slate-400">QR Payment Stream</span>
                <span className="font-bold text-[#002970] dark:text-sky-300">142 Txns (₹{todayCollection.toLocaleString('en-IN')})</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#F8FAFC] dark:bg-slate-900">
                <span className="text-[#64748B] dark:text-slate-400">Udhaar Ledger</span>
                <span className="font-bold text-[#F59E0B]">{udhaarLedger.filter(u => u.status !== 'Paid').length} Unpaid (₹{totalUdhaarDue.toLocaleString('en-IN')})</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#F8FAFC] dark:bg-slate-900">
                <span className="text-[#64748B] dark:text-slate-400">Bank Settlement</span>
                <span className="font-bold text-[#10B981]">₹{pendingSettlementAmount.toLocaleString('en-IN')} (11:00 PM)</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#F8FAFC] dark:bg-slate-900">
                <span className="text-[#64748B] dark:text-slate-400">Peak Sales Window</span>
                <span className="font-bold text-[#00BAF2]">6:00 PM – 8:30 PM</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#F8FAFC] dark:bg-slate-900">
                <span className="text-[#64748B] dark:text-slate-400">Soundbox Telemetry</span>
                <span className="font-bold text-[#002970] dark:text-sky-300">Online (92% Battery, 4G)</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
