export type TabType = 
  | 'overview'
  | 'verify-refund'
  | 'udhaar-ledger'
  | 'urgent-loan'
  | 'transactions-settlements'
  | 'profile' | 'ask-priya';

export type PaymentMethod = 'Paytm UPI' | 'Soundbox' | 'Paytm Wallet' | 'RuPay Card' | 'Net Banking';
export type PaymentStatus = 'Success' | 'Refunded' | 'Pending';

export interface Transaction {
  id: string;
  rrn: string;
  time: string;
  timestamp: number;
  customerName: string;
  phone: string;
  method: PaymentMethod;
  amount: number;
  status: PaymentStatus;
  soundboxBroadcasted: boolean;
  orderNotes?: string;
}

export interface SoundboxTelemetry {
  deviceId: string;
  model: string;
  batteryLevel: number;
  isCharging: boolean;
  networkStatus: '4G Active' | '3G Weak' | 'Offline';
  carrier: string;
  language: string;
  volume: number;
  lastBroadcastTime: string;
  broadcastsToday: number;
  signalStrengthDbm: number;
}

export interface PaymentScreenshotOcr {
  id: string;
  screenshotType: 'success' | 'stuck' | 'blurry';
  utr: string;
  date: string;
  time: string;
  amount: number;
  customerName: string;
  customerPhone: string;
  app: 'Google Pay' | 'PhonePe' | 'Paytm UPI' | 'BHIM' | 'Unknown';
  status: 'verified' | 'stuck' | 'refunded' | 'unreadable';
  verificationMessage: string;
  confidenceScore?: number;
  refundInitiated: boolean;
  repayLinkGenerated: boolean;
  repayQrId?: string;
}

export interface UrgentLoanState {
  dailyQrAverage: number;
  dailyTxnCount: number;
  bankHealthScore: number;
  preApprovedAmount: number;
  interestAmount: number;
  autoDeductTime: string;
  bankAccountMasked: string;
  isDisbursed: boolean;
  disbursedAt?: string;
  utrPayout?: string;
}

export interface MerchantOffer {
  id: string;
  title: string;
  discountAmount: number;
  minSpend: number;
  todayRedemptions: number;
  isActive: boolean;
  targetAudience: string;
  validity?: string;
}

export interface UdhaarEntry {
  id: string;
  name: string;
  phone: string;
  amount: number;
  dueDate: string;
  daysOverdue: number;
  status: 'Unpaid' | 'Reminder Sent' | 'Paid';
  isExcludedFromOffers: boolean;
  notes: string;
  lastReminderSent?: string;
  createdDate?: string;
  clearedAt?: string;
}

export interface PaperKhataParsedResult {
  customerName: string;
  phone: string;
  amount: number;
  date: string;
  notes: string;
  confidence: number;
}

export interface UdhaarCustomer {
  id: string;
  name: string;
  phone: string;
  amountDue: number;
  daysOverdue: number;
  lastPurchaseDate: string;
  items: string[];
  discountIncentiveAttached: boolean;
  discountAmount: number;
  status: 'Unpaid' | 'Reminded' | 'Settled';
  reminderCount: number;
}

export interface VoiceTickerEntry {
  id: string;
  time: string;
  rawInput: string;
  parsedName: string;
  parsedAmount: number;
  intent: 'ADD_CREDIT' | 'SUBTRACT_CREDIT' | 'BALANCE_CHECK';
  confidence: number;
  ownerVerified: boolean;
  status: 'AI Parsed & Updated' | 'Processing' | 'Verified';
}

export interface CustomerReview {
  id: string;
  customerName: string;
  phoneMasked: string;
  rating: number;
  time: string;
  orderAmount: number;
  comment: string;
  verifiedQrOrder: boolean;
  trustScore: number;
  totalVisits: number;
  priorApologyCouponsClaimed: number;
  abuseFlag?: boolean;
  abuseReason?: string;
  recoveryStatus?: string;
  couponDetails?: {
    code: string;
    amount: number;
    sentAt: string;
    expiresIn: string;
    redeemed: boolean;
  };
}

export interface CustomerCohort {
  id: string;
  name: string;
  count: number;
  tag: string;
  description: string;
  avgOrderValue: number;
  potentialRevenue: number;
  recommendedOffer: string;
  churnRisk: 'High' | 'Medium' | 'Low';
}

export interface IndividualCustomer {
  id: string;
  name: string;
  phone: string;
  lastVisit: string;
  totalOrders: number;
  avgOrderValue: number;
  status: 'Active' | 'Dormant' | 'VIP';
}

export interface AssistantQuery {
  id: string;
  question: string;
  hindiTranslation: string;
  category: string;
  spokenResponseHindi: string;
  spokenResponseEnglish: string;
  summaryTitle: string;
  metrics: {
    label: string;
    value: string;
    sublabel?: string;
    trend?: 'up' | 'down' | 'neutral';
  }[];
  details: string;
}


