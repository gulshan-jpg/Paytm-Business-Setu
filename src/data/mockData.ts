import { 
  Transaction, 
  SoundboxTelemetry,
  PaymentScreenshotOcr,
  UrgentLoanState,
  MerchantOffer,
  UdhaarCustomer,
  UdhaarEntry,
  PaperKhataParsedResult,
  VoiceTickerEntry,
  CustomerCohort,
  IndividualCustomer,
  CustomerReview,
  AssistantQuery
} from '../types';

export const INITIAL_SOUNDBOX_TELEMETRY: SoundboxTelemetry = {
  deviceId: 'SBX-DL-88912',
  model: 'Paytm AI Soundbox v3.0 Pro',
  batteryLevel: 92,
  isCharging: false,
  networkStatus: '4G Active',
  carrier: 'Airtel IoT Enterprise',
  language: 'Hindi',
  volume: 85,
  lastBroadcastTime: 'Just now (09:42 PM)',
  broadcastsToday: 142,
  signalStrengthDbm: -68
};

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'PTM_TXN_987214981',
    rrn: '428910398211',
    time: '09:41 PM',
    timestamp: Date.now() - 60000,
    customerName: 'Suresh Kumar',
    phone: '+91 98112 00412',
    method: 'Paytm UPI',
    amount: 320,
    status: 'Success',
    soundboxBroadcasted: true,
    orderNotes: 'Amul Butter 500g, Bread, Eggs'
  },
  {
    id: 'PTM_TXN_987214980',
    rrn: '428910398210',
    time: '09:35 PM',
    timestamp: Date.now() - 360000,
    customerName: 'Priya Sharma',
    phone: '+91 98711 99201',
    method: 'Paytm UPI',
    amount: 1450,
    status: 'Success',
    soundboxBroadcasted: true,
    orderNotes: 'Basmati Rice 5kg, Fortune Mustard Oil 2L'
  },
  {
    id: 'PTM_TXN_987214979',
    rrn: '428910398209',
    time: '09:28 PM',
    timestamp: Date.now() - 780000,
    customerName: 'Amit Bansal',
    phone: '+91 98290 33419',
    method: 'Soundbox',
    amount: 75,
    status: 'Success',
    soundboxBroadcasted: true,
    orderNotes: 'Thums Up 750ml, Kurkure'
  },
  {
    id: 'PTM_TXN_987214978',
    rrn: '428910398208',
    time: '09:18 PM',
    timestamp: Date.now() - 1380000,
    customerName: 'Rajesh Verma',
    phone: '+91 98991 90812',
    method: 'Paytm Wallet',
    amount: 540,
    status: 'Success',
    soundboxBroadcasted: true,
    orderNotes: 'Aashirvaad Chakki Atta 5kg'
  },
  {
    id: 'PTM_TXN_987214977',
    rrn: '428910398207',
    time: '09:05 PM',
    timestamp: Date.now() - 2160000,
    customerName: 'Sunita Devi',
    phone: '+91 99104 12389',
    method: 'Paytm UPI',
    amount: 210,
    status: 'Success',
    soundboxBroadcasted: true,
    orderNotes: 'Tata Salt, Haldi, Mirch Powder'
  },
  {
    id: 'PTM_TXN_987214976',
    rrn: '428910398206',
    time: '08:52 PM',
    timestamp: Date.now() - 2940000,
    customerName: 'Vikram Malhotra',
    phone: '+91 97118 44012',
    method: 'RuPay Card',
    amount: 890,
    status: 'Success',
    soundboxBroadcasted: true,
    orderNotes: 'Cadbury Celebrations, Dry Fruits'
  },
  {
    id: 'PTM_TXN_987214975',
    rrn: '428910398205',
    time: '08:40 PM',
    timestamp: Date.now() - 3660000,
    customerName: 'Meena Rawat',
    phone: '+91 98103 77124',
    method: 'Paytm UPI',
    amount: 110,
    status: 'Refunded',
    soundboxBroadcasted: false,
    orderNotes: 'Item out of stock - UPI refund initiated'
  },
  {
    id: 'PTM_TXN_987214974',
    rrn: '428910398204',
    time: '08:25 PM',
    timestamp: Date.now() - 4560000,
    customerName: 'Ramesh Chander',
    phone: '+91 98114 77210',
    method: 'Paytm UPI',
    amount: 450,
    status: 'Success',
    soundboxBroadcasted: true,
    orderNotes: 'Partial Udhaar payment cleared via QR'
  }
];

export const INITIAL_UDHAAR_CUSTOMERS: UdhaarCustomer[] = [
  {
    id: 'UDH_001',
    name: 'Ramesh Chander',
    phone: '+91 98114 77210',
    amountDue: 200,
    daysOverdue: 4,
    lastPurchaseDate: '21 Oct 2026',
    items: ['Mother Dairy Toned Milk 2 pkt', 'Brown Bread'],
    discountIncentiveAttached: true,
    discountAmount: 20,
    status: 'Unpaid',
    reminderCount: 1
  },
  {
    id: 'UDH_002',
    name: 'Suresh Sharma',
    phone: '+91 98711 44021',
    amountDue: 1240,
    daysOverdue: 18,
    lastPurchaseDate: '07 Oct 2026',
    items: ['Aashirvaad Atta 10kg', 'Fortune Sunflower Oil 5L', 'Surf Excel 2kg'],
    discountIncentiveAttached: true,
    discountAmount: 50,
    status: 'Unpaid',
    reminderCount: 3
  },
  {
    id: 'UDH_003',
    name: 'Sunita Devi',
    phone: '+91 99104 12389',
    amountDue: 780,
    daysOverdue: 12,
    lastPurchaseDate: '13 Oct 2026',
    items: ['Tata Tea Gold 500g', 'Amul Pure Ghee 1L'],
    discountIncentiveAttached: false,
    discountAmount: 20,
    status: 'Reminded',
    reminderCount: 2
  },
  {
    id: 'UDH_004',
    name: 'Rajesh Verma (Teacher)',
    phone: '+91 98991 90812',
    amountDue: 2100,
    daysOverdue: 24,
    lastPurchaseDate: '01 Oct 2026',
    items: ['Monthly Grocery Pack', 'Patanjali Dals', 'Colgate Total'],
    discountIncentiveAttached: true,
    discountAmount: 75,
    status: 'Unpaid',
    reminderCount: 4
  },
  {
    id: 'UDH_005',
    name: 'Amit Bansal',
    phone: '+91 98290 33419',
    amountDue: 350,
    daysOverdue: 2,
    lastPurchaseDate: '23 Oct 2026',
    items: ['Cold Drinks 2L', 'Namkeen Haldiram', 'Cadbury Silk'],
    discountIncentiveAttached: false,
    discountAmount: 15,
    status: 'Unpaid',
    reminderCount: 0
  },
  {
    id: 'UDH_006',
    name: 'Kavita Patel',
    phone: '+91 97118 66520',
    amountDue: 890,
    daysOverdue: 9,
    lastPurchaseDate: '16 Oct 2026',
    items: ['Dabur Honey 500g', 'Quaker Oats', 'Badam Giri 250g'],
    discountIncentiveAttached: true,
    discountAmount: 30,
    status: 'Reminded',
    reminderCount: 1
  }
];

export const INITIAL_VOICE_TICKER: VoiceTickerEntry[] = [
  {
    id: 'VTC_01',
    time: '09:14 AM',
    rawInput: 'Log 200 Udhaar for Ramesh',
    parsedName: 'Ramesh Chander',
    parsedAmount: 200,
    intent: 'ADD_CREDIT',
    confidence: 0.99,
    ownerVerified: true,
    status: 'AI Parsed & Updated'
  },
  {
    id: 'VTC_02',
    time: '08:42 AM',
    rawInput: 'Suresh Sharma ka 350 rupaye jama kar lo',
    parsedName: 'Suresh Sharma',
    parsedAmount: 350,
    intent: 'SUBTRACT_CREDIT',
    confidence: 0.98,
    ownerVerified: true,
    status: 'AI Parsed & Updated'
  },
  {
    id: 'VTC_03',
    time: '08:15 AM',
    rawInput: 'Sunita ji ka total baaki kitna hai',
    parsedName: 'Sunita Devi',
    parsedAmount: 780,
    intent: 'BALANCE_CHECK',
    confidence: 0.97,
    ownerVerified: true,
    status: 'AI Parsed & Updated'
  }
];

export const INITIAL_COHORTS: CustomerCohort[] = [
  {
    id: 'cohort_churn',
    name: '14 Churned Regulars',
    tag: 'Not visited in 14+ days',
    count: 14,
    description: 'Customers who shopped 3+ times/month earlier but made zero purchases in the last 14 days.',
    avgOrderValue: 540,
    potentialRevenue: 7560,
    recommendedOffer: 'Flat 30 OFF on 250 Paytm QR grocery order',
    churnRisk: 'High'
  },
  {
    id: 'cohort_weekend',
    name: '22 Weekend Buyers',
    tag: 'Shop mostly Sat-Sun evening',
    count: 22,
    description: 'Working professionals and families who do large basket bulk grocery purchases on weekends.',
    avgOrderValue: 880,
    potentialRevenue: 19360,
    recommendedOffer: 'Flat 50 Cashback on Weekend Kirana Basket',
    churnRisk: 'Medium'
  },
  {
    id: 'cohort_high_value',
    name: '8 High-Value Shoppers',
    tag: 'Avg basket size over 850',
    count: 8,
    description: 'Top 5% gross margin spenders buying premium brands (Fortune, Nescafe, Ferrero).',
    avgOrderValue: 1350,
    potentialRevenue: 10800,
    recommendedOffer: 'VIP 5% Store Credit on next 2 visits',
    churnRisk: 'Low'
  }
];

export const INDIVIDUAL_CUSTOMERS: IndividualCustomer[] = [
  {
    id: 'CUST_01',
    name: 'Ramesh Chander',
    phone: '+91 98114 77210',
    lastVisit: '4 days ago',
    totalOrders: 18,
    avgOrderValue: 420,
    status: 'Active'
  },
  {
    id: 'CUST_02',
    name: 'Suresh Sharma',
    phone: '+91 98711 44021',
    lastVisit: '18 days ago',
    totalOrders: 24,
    avgOrderValue: 680,
    status: 'Dormant'
  },
  {
    id: 'CUST_03',
    name: 'Priya Sharma',
    phone: '+91 98711 99201',
    lastVisit: 'Today',
    totalOrders: 32,
    avgOrderValue: 1250,
    status: 'VIP'
  },
  {
    id: 'CUST_04',
    name: 'Sunita Devi',
    phone: '+91 99104 12389',
    lastVisit: '12 days ago',
    totalOrders: 14,
    avgOrderValue: 510,
    status: 'Dormant'
  },
  {
    id: 'CUST_05',
    name: 'Rajesh Verma',
    phone: '+91 98991 90812',
    lastVisit: '24 days ago',
    totalOrders: 40,
    avgOrderValue: 890,
    status: 'Dormant'
  },
  {
    id: 'CUST_06',
    name: 'Amit Bansal',
    phone: '+91 98290 33419',
    lastVisit: 'Today',
    totalOrders: 9,
    avgOrderValue: 280,
    status: 'Active'
  },
  {
    id: 'CUST_07',
    name: 'Vikram Malhotra',
    phone: '+91 97118 44012',
    lastVisit: 'Today',
    totalOrders: 16,
    avgOrderValue: 920,
    status: 'VIP'
  },
  {
    id: 'CUST_08',
    name: 'Kavita Patel',
    phone: '+91 97118 66520',
    lastVisit: '9 days ago',
    totalOrders: 11,
    avgOrderValue: 560,
    status: 'Active'
  }
];

export const INITIAL_REVIEWS: CustomerReview[] = [
  {
    id: 'REV_101',
    customerName: 'Gaurav K.',
    phoneMasked: '+91 98101 44102',
    rating: 1,
    time: '12 mins ago',
    orderAmount: 340,
    verifiedQrOrder: true,
    trustScore: 92,
    totalVisits: 18,
    priorApologyCouponsClaimed: 1,
    abuseFlag: false,
    comment: 'Milk packet missing from morning delivery bag. Please look into this.',
    recoveryStatus: 'Apology Coupon Sent',
    couponDetails: {
      code: 'SORRY15',
      amount: 15,
      sentAt: '12 mins ago (in 4.2 sec)',
      expiresIn: '48 hrs',
      redeemed: true
    }
  },
  {
    id: 'REV_102',
    customerName: 'Sameer Khan',
    phoneMasked: '+91 98110 33491',
    rating: 1,
    time: '28 mins ago',
    orderAmount: 65,
    verifiedQrOrder: true,
    trustScore: 34,
    totalVisits: 3,
    priorApologyCouponsClaimed: 1,
    abuseFlag: true,
    abuseReason: '30-Day Cooldown Active: Prior apology coupon claimed 6 days ago (Policy: Max 1 per 30 days).',
    comment: 'Store was crowded, give me free compensation voucher.',
    recoveryStatus: 'Voucher Suppressed (Cooldown Active)'
  },
  {
    id: 'REV_103',
    customerName: 'Anjali Singhal',
    phoneMasked: '+91 97170 88219',
    rating: 5,
    time: '45 mins ago',
    orderAmount: 1250,
    verifiedQrOrder: true,
    trustScore: 98,
    totalVisits: 32,
    priorApologyCouponsClaimed: 0,
    abuseFlag: false,
    comment: 'Always fresh veggies and accurate Soundbox confirmation. Best kirana in Sector 14.',
    recoveryStatus: 'No Action Needed'
  },
  {
    id: 'REV_104',
    customerName: 'Mohit Rao',
    phoneMasked: '+91 99990 12093',
    rating: 5,
    time: '2 hours ago',
    orderAmount: 480,
    verifiedQrOrder: true,
    trustScore: 95,
    totalVisits: 14,
    priorApologyCouponsClaimed: 0,
    abuseFlag: false,
    comment: 'Quick billing and polite store boys.',
    recoveryStatus: 'No Action Needed'
  },
  {
    id: 'REV_105',
    customerName: 'Harish Chandra',
    phoneMasked: '+91 98113 45890',
    rating: 4,
    time: '3 hours ago',
    orderAmount: 890,
    verifiedQrOrder: true,
    trustScore: 88,
    totalVisits: 9,
    priorApologyCouponsClaimed: 0,
    abuseFlag: false,
    comment: 'Good stock, accepted Paytm RuPay credit card without any hassle.',
    recoveryStatus: 'No Action Needed'
  }
];

export const HOURLY_DATA = [
  { hour: '07 AM', sales: 1200, count: 12 },
  { hour: '08 AM', sales: 2400, count: 24 },
  { hour: '09 AM', sales: 3850, count: 32 },
  { hour: '10 AM', sales: 2100, count: 18 },
  { hour: '11 AM', sales: 1450, count: 11 },
  { hour: '12 PM', sales: 950, count: 7 },
  { hour: '01 PM', sales: 600, count: 4 },
  { hour: '02 PM', sales: 450, count: 3 },
  { hour: '03 PM', sales: 800, count: 6 },
  { hour: '04 PM', sales: 1350, count: 10 },
  { hour: '05 PM', sales: 2800, count: 22 },
  { hour: '06 PM', sales: 4100, count: 34 },
  { hour: '07 PM', sales: 5200, count: 42 },
  { hour: '08 PM', sales: 4850, count: 38 },
  { hour: '09 PM', sales: 3450, count: 28 }
];

export const DAY_WISE_DATA = [
  { day: 'Monday', sales: 17200, count: 134 },
  { day: 'Tuesday (Today)', sales: 18450, count: 142 },
  { day: 'Wednesday (Last Wk)', sales: 16800, count: 128 },
  { day: 'Thursday (Last Wk)', sales: 17500, count: 131 },
  { day: 'Friday (Last Wk)', sales: 19100, count: 145 },
  { day: 'Saturday (Last Wk)', sales: 23650, count: 178 },
  { day: 'Sunday (Last Wk)', sales: 24800, count: 189 }
];

export const ASSISTANT_PRESETS: AssistantQuery[] = [
  {
    id: 'q_sales_today',
    question: 'Aaj ki sales kitne ki hui?',
    hindiTranslation: 'आज की कुल बिक्री कितनी हुई?',
    category: 'sales',
    spokenResponseHindi: 'Sharma Kirana Store par aaj kul 142 transactions hue hain, jinki kul bikri atharah hazaar chaar sau pachaas rupaye hai. Pichle mangalwar ke muqable atharah dashamlav chaar pratishat zyada hai.',
    spokenResponseEnglish: 'Today total collection is 18,450 rupees across 142 transactions, which is up by 18.4% compared to last week.',
    summaryTitle: "Today's Gross Store Collection",
    metrics: [
      { label: "Today's Collection", value: '₹18,450', sublabel: '+18.4% vs last week', trend: 'up' },
      { label: 'Completed Transactions', value: '142', sublabel: 'QR + Soundbox' },
      { label: 'Average Ticket Size', value: '₹130', sublabel: 'Grocery Basket' }
    ],
    details: 'Collection peaked between 06:00 PM and 08:00 PM. Paytm UPI contributed 82% of total payments.'
  },
  {
    id: 'q_growth_last_week',
    question: 'Last week se kitni bikri badhi hai?',
    hindiTranslation: 'पिछले हफ्ते की तुलना में बिक्री कितनी बढ़ी है?',
    category: 'growth',
    spokenResponseHindi: 'Pichle hafte isi din tak pandrah hazaar paanch sau assi rupaye ki bikri hui thi. Is hafte do hazaar aath sau sattar rupaye yaani atharah dashamlav chaar pratishat zyada bikri hui hai.',
    spokenResponseEnglish: 'Compared to 15,580 rupees last Tuesday, sales grew by 2,870 rupees or 18.4% this week.',
    summaryTitle: 'Week-on-Week Growth Analysis',
    metrics: [
      { label: 'This Tuesday', value: '₹18,450', trend: 'up' },
      { label: 'Last Tuesday', value: '₹15,580', sublabel: 'Baseline' },
      { label: 'Net Gain', value: '+₹2,870', sublabel: '+18.4% Growth', trend: 'up' }
    ],
    details: 'The growth was driven by 24 additional evening QR payments and customer retention campaigns.'
  },
  {
    id: 'q_peak_timeslots',
    question: 'Kis time slot me sabse zyada bikri hoti hai?',
    hindiTranslation: 'किस समय स्लॉट में सबसे ज्यादा बिक्री होती है?',
    category: 'timeslots',
    spokenResponseHindi: 'Sabse zyada bikri sham 6:00 baje se 8:00 baje ke beech hoti hai. Sham 7:00 baje peak sales paanch hazaar do sau rupaye rahi jisme bayalees payments Paytm QR par aaye.',
    spokenResponseEnglish: 'Peak shopping rush happens between 6:00 PM and 8:00 PM. The highest single hour was 7:00 PM with 5,200 rupees across 42 payments.',
    summaryTitle: 'Peak Hourly Sales Windows',
    metrics: [
      { label: 'Peak Hour (7:00 PM)', value: '₹5,200', sublabel: '42 Transactions', trend: 'up' },
      { label: 'Morning Peak (9:00 AM)', value: '₹3,850', sublabel: '32 Transactions' },
      { label: 'Afternoon Slump (2:00 PM)', value: '₹450', sublabel: '3 Transactions', trend: 'down' }
    ],
    details: 'Staff scheduling suggestion: Deploy 2 counter boys between 06:00 PM and 08:30 PM for faster checkout.'
  },
  {
    id: 'q_day_trends',
    question: 'Kis day kitni bikri hui aur kya trend chal raha hai?',
    hindiTranslation: 'किस दिन कितनी बिक्री हुई और क्या ट्रेंड चल रहा है?',
    category: 'trends',
    spokenResponseHindi: 'Somwar ko satrah hazaar do sau, Mangalwar ko atharah hazaar chaar sau pachaas, aur Ravivar ko chaubees hazaar aath sau rupaye ki bikri hui thi. Kul saat dino me ek lakh chauthees hazaar paanch sau rupaye ka turnover raha.',
    spokenResponseEnglish: 'Sales trended upwards: Monday was 17,200, Tuesday is 18,450, and Sunday had the highest sales of 24,800. 7-day volume stands at 1,34,500 rupees.',
    summaryTitle: '7-Day Turnover & Trajectory',
    metrics: [
      { label: '7-Day Turnover', value: '₹1,34,500', sublabel: 'Weekly Run Rate', trend: 'up' },
      { label: 'Highest Day (Sunday)', value: '₹24,800', sublabel: 'Weekend Rush' },
      { label: 'Daily Average', value: '₹19,214', sublabel: 'Across 7 days' }
    ],
    details: 'Weekend sales account for 36% of total revenue. Tuesday collection is trending 12% above monthly weekday average.'
  },
  {
    id: 'q_udhaar_status',
    question: 'Udhaar me kya chal raha hai aur kitna pending hai?',
    hindiTranslation: 'उधार बही-खाते में क्या चल रहा है और कितना पेंडिंग है?',
    category: 'udhaar',
    spokenResponseHindi: 'Kul 6 grahakon ka aath hazaar chhah sau chaalees rupaye udhaar baaki hai. Sabse zyada udhaar Rajesh Verma ji ka do hazaar ek sau rupaye hai jo chaubees din purana hai. Aaj Ramesh ji ka do sau rupaye ka hisaab update hua hai.',
    spokenResponseEnglish: 'Total outstanding Udhaar is 8,640 rupees across 6 borrowers. Oldest pending is Rajesh Verma with 2,100 rupees for 24 days. Ramesh settled 200 rupees today.',
    summaryTitle: 'Active Udhaar & Overdue Exposure',
    metrics: [
      { label: 'Total Udhaar Due', value: '₹8,640', sublabel: 'Across 6 Customers', trend: 'down' },
      { label: 'High Risk (>14 Days)', value: '₹3,340', sublabel: '2 Customers Overdue' },
      { label: 'Recovered This Week', value: '₹4,150', sublabel: 'Via WhatsApp QR Links', trend: 'up' }
    ],
    details: 'Automated 20 rupees Paytm QR settlement incentives are active for 4 customers to speed up recovery.'
  },
  {
    id: 'q_settlement_pending',
    question: 'Pending bank settlement kitna hai aur kab credit hoga?',
    hindiTranslation: 'पेंडिंग बैंक सेटलमेंट कितना है और कब क्रेडिट होगा?',
    category: 'settlement',
    spokenResponseHindi: 'Aapka baarah hazaar ek sau rupaye bank settlement ke liye ready hai. Yeh aaj raat gyarah baje HDFC bank account 4102 me bina kisi fee ke transfer ho jayega. Aap abhi turant bhi transfer kar sakte hain.',
    spokenResponseEnglish: 'You have 12,100 rupees ready for settlement. It will auto-settle to HDFC Bank ****4102 at 11:00 PM tonight at zero fees, or you can transfer immediately.',
    summaryTitle: 'Bank Settlement & Payout Status',
    metrics: [
      { label: 'Settlement Balance', value: '₹12,100', sublabel: 'Ready for payout', trend: 'up' },
      { label: 'Linked Account', value: 'HDFC Bank', sublabel: 'A/C: ****4102' },
      { label: 'Auto Transfer Time', value: '11:00 PM Tonight', sublabel: 'Zero Convenience Fee' }
    ],
    details: 'Penny-drop verification confirmed. Funds settle via RBI IMPS switch instantly on demand.'
  }
];

export const OCR_PRESET_SUCCESS: PaymentScreenshotOcr = {
  id: 'OCR_SUCC_01',
  screenshotType: 'success',
  utr: '984102938102',
  date: '26 Oct 2026',
  time: '12:48 PM',
  amount: 450,
  customerName: 'Rohit Malhotra',
  customerPhone: '+91 98101 22910',
  app: 'Google Pay',
  status: 'verified',
  verificationMessage: 'Payment Verified with Paytm Backend Webhook (UTR #984102938102). Funds credited to merchant wallet.',
  refundInitiated: false,
  repayLinkGenerated: false
};

export const OCR_PRESET_STUCK: PaymentScreenshotOcr = {
  id: 'OCR_STUCK_01',
  screenshotType: 'stuck',
  utr: '984102774190',
  date: '26 Oct 2026',
  time: '12:51 PM',
  amount: 620,
  customerName: 'Ananya Verma',
  customerPhone: '+91 98711 44521',
  app: 'PhonePe',
  status: 'stuck',
  verificationMessage: 'Payment Status: Stuck in Customer Bank Network (NPCI switch timeout). Customer bank debited but Paytm webhook not fired.',
  refundInitiated: false,
  repayLinkGenerated: false
};

export const OCR_PRESET_BLURRY: PaymentScreenshotOcr = {
  id: 'OCR_BLUR_01',
  screenshotType: 'blurry',
  utr: 'UNREADABLE',
  date: '26 Oct 2026',
  time: '01:05 PM',
  amount: 0,
  customerName: 'Unrecognized Subject',
  customerPhone: '+91 **********',
  app: 'Unknown',
  status: 'unreadable',
  confidenceScore: 32,
  verificationMessage: 'OCR Scan Aborted: Image confidence score 32% (Safety floor: 80%). Screen reflection, blur, or glare detected. Auto-reversal disabled to prevent fraudulent deduction. Merchant must input 12-digit UTR manually.',
  refundInitiated: false,
  repayLinkGenerated: false
};

export const INITIAL_URGENT_LOAN: UrgentLoanState = {
  dailyQrAverage: 14500,
  dailyTxnCount: 120,
  bankHealthScore: 94,
  preApprovedAmount: 5000,
  interestAmount: 0,
  autoDeductTime: '11:00 PM tonight',
  bankAccountMasked: 'HDFC Bank Account ****4102',
  isDisbursed: false,
  disbursedAt: undefined,
  utrPayout: undefined
};

export const INITIAL_MERCHANT_OFFERS: MerchantOffer[] = [
  {
    id: 'OFFER_10',
    title: 'Flat Rs. 10 OFF on Grocery Essentials',
    discountAmount: 10,
    minSpend: 150,
    todayRedemptions: 28,
    isActive: true,
    targetAudience: 'All QR Customers spending over Rs. 150',
    validity: '7 Days'
  },
  {
    id: 'OFFER_20',
    title: 'Super Saver Rs. 20 OFF on Pantry Stash',
    discountAmount: 20,
    minSpend: 300,
    todayRedemptions: 14,
    isActive: true,
    targetAudience: 'Repeat shoppers spending over Rs. 300',
    validity: '30 Days'
  },
  {
    id: 'OFFER_50',
    title: 'Mega Kirana Rs. 50 OFF on Bulk Orders',
    discountAmount: 50,
    minSpend: 500,
    todayRedemptions: 6,
    isActive: false,
    targetAudience: 'High-value basket shoppers spending over Rs. 500',
    validity: '15 Days'
  }
];

export const INITIAL_UDHAAR_LEDGER: UdhaarEntry[] = [
  {
    id: 'UDH_001',
    name: 'Rajesh Verma (Teacher)',
    phone: '+91 98991 90812',
    amount: 2100,
    dueDate: '2026-10-02',
    daysOverdue: 24,
    status: 'Reminder Sent',
    isExcludedFromOffers: true,
    notes: 'Aashirvaad Atta 10kg, Fortune Oil 5L',
    lastReminderSent: 'Today, 09:30 AM',
    createdDate: '25 Sep 2026'
  },
  {
    id: 'UDH_002',
    name: 'Suresh Sharma',
    phone: '+91 98711 44021',
    amount: 1240,
    dueDate: '2026-10-08',
    daysOverdue: 18,
    status: 'Unpaid',
    isExcludedFromOffers: true,
    notes: 'Surf Excel 2kg, Dettol Soap pack, Rice 5kg',
    lastReminderSent: 'Yesterday, 06:15 PM',
    createdDate: '01 Oct 2026'
  },
  {
    id: 'UDH_003',
    name: 'Sunita Devi',
    phone: '+91 99104 12389',
    amount: 780,
    dueDate: '2026-10-14',
    daysOverdue: 12,
    status: 'Unpaid',
    isExcludedFromOffers: true,
    notes: 'Tata Tea Gold 500g, Amul Ghee 1L',
    lastReminderSent: '22 Oct 2026',
    createdDate: '07 Oct 2026'
  },
  {
    id: 'UDH_004',
    name: 'Ramesh Chander',
    phone: '+91 98114 77210',
    amount: 200,
    dueDate: '2026-10-22',
    daysOverdue: 4,
    status: 'Unpaid',
    isExcludedFromOffers: false,
    notes: 'Mother Dairy Milk 2 pkt, Brown Bread',
    lastReminderSent: undefined,
    createdDate: '19 Oct 2026'
  },
  {
    id: 'UDH_005',
    name: 'Kavita Gupta',
    phone: '+91 98109 23118',
    amount: 420,
    dueDate: '2026-10-24',
    daysOverdue: 2,
    status: 'Unpaid',
    isExcludedFromOffers: false,
    notes: 'Maggi 12-pack, Butter Cookies',
    lastReminderSent: undefined,
    createdDate: '21 Oct 2026'
  },
  {
    id: 'UDH_006',
    name: 'Vikram Mehra',
    phone: '+91 98710 99421',
    amount: 0,
    dueDate: '2026-10-18',
    daysOverdue: 0,
    status: 'Paid',
    isExcludedFromOffers: false,
    notes: 'Basmati Rice 10kg, Haldiram Snacks',
    lastReminderSent: '20 Oct 2026',
    createdDate: '10 Oct 2026',
    clearedAt: 'Today, 11:20 AM via Paytm QR'
  }
];

export const PAPER_KHATA_PRESET: PaperKhataParsedResult[] = [
  {
    customerName: 'Ramesh Kumar',
    phone: '+91 98110 55412',
    amount: 1200,
    date: '25 Oct 2026',
    notes: 'Basmati Rice 5kg, Mustard Oil 2L',
    confidence: 98
  },
  {
    customerName: 'Suresh Gupta',
    phone: '+91 98712 88910',
    amount: 850,
    date: '24 Oct 2026',
    notes: 'Aashirvaad Atta 10kg, Sugar 2kg',
    confidence: 96
  }
];
