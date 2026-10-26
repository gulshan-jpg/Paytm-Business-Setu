# Paytm Business Setu (Vyapar AI)

> **Autonomous Multimodal AI Operating System for Bharat’s Kirana Merchants**  
> Built for the **Paytm Hackathon** by **Team RONIX**

---

## 👥 Team Information — Team RONIX
* **Gulshan Gautam**
* **Dhananjay Sharma**
* **Harshit Patra**

---

## 📌 Executive Summary

India's 13+ million Kirana stores handle over \$600B in commerce, yet daily operations are plagued by:
1. **Counter Disputes & Audio Lag**: Telecom network lag delays Soundbox chimes, creating awkward 2–3 minute checkout stalemates or fraud via spoofed UPI screenshots.
2. **Unorganized Physical "Bahi-Khata"**: 25–35% of Kirana working capital is trapped in handwritten paper ledgers, causing forgotten dues and awkward collection conversations.
3. **Emergency Working Capital Gaps**: Traditional banks require CIBIL scores and collateral, leaving small merchants stranded when morning inventory distributors arrive.
4. **Data Blindness**: Kirana owners make critical decisions (store open/close timings, stocking, rush hours) based solely on intuition.

**Paytm Business Setu** transforms the Paytm merchant ecosystem into an autonomous, proactive Kirana Operating System using multimodal AI, computer vision, and real-time velocity underwriting.

---
## Deployed Link-https://paytm-business-setu.vercel.app/

## 🚀 4 Core Pillars (Deeply Powered by AI)

### 1. 🎙️ Ask Priya — Kirana Multimodal AI Business Copilot
* **Multimodal Voice & Chat Assistant**: Natural voice and text Kirana business advisor supporting Hindi & English queries.
* **Autonomous Telemetry Scanning**: Continuously scans live Soundbox transactions, hourly footfall, settlement balances, and pending udhaar ledgers.
* **Operational Intelligence**: Provides instant data-driven answers:
  * *"Aaj ki sales kitne ki hui?"* (Sales comparisons & weekday velocity).
  * *"Dukan kab band karni chahiye aur peak rush kab hai?"* (Pinpoints peak revenue windows, e.g., 5:45 PM – 9:15 PM driving 62% of gross revenue, and recommends ideal restock windows).

### 2. 🛡️ Vision Shield — Sub-380ms Neural OCR & Dispute Arbiter
* **Instant Screenshot Verification**: Sub-380ms computer vision OCR that extracts and verifies 12-digit UTR numbers across Google Pay, PhonePe, Paytm, and BHIM screenshots.
* **Anti-Fraud & Glare Protection**: Detects fake payment screenshot apps and high-glare/blurry images. When image confidence falls below the 80% safety floor, auto-reversal is blocked and merchant fallback UTR verification is triggered.
* **Auto-Refund & Dynamic Re-Pay QR**: For authentic payments stuck in bank transit, dispatches auto-refund webhooks and displays a dynamic Re-Pay QR for immediate checkout.

### 3. 📖 Neural Bahi-Khata — Document AI & Intelligent Udhaar Recovery
* **Paper Register OCR Scanner**: 1-tap AI scan that reads handwritten physical Hindi/English ledger entries and converts them into structured digital records.
* **Manual Entry & In-Line Edit**: Full add, edit, search, and delete capabilities for customer udhaar.
* **Automated WhatsApp Payment Reminders**: Sends official WhatsApp payment reminders with dynamic 1-tap instant Paytm QR links and automated 24-hour anti-spam cooldowns.

### 4. ⚡ 0% Urgent Capital — Velocity-Based Machine Learning Underwriting
* **Zero-CIBIL Algorithmic Underwriting**: Analyzes live daily QR payment velocity (e.g., ₹14,500/day across 120+ payments) rather than traditional credit scores.
* **Interactive Dynamic Sales Slider**: Interactive slider (₹5,000 to ₹60,000/day) that dynamically calculates instantaneous 35% credit limits.
* **Instant 60-Second Micro-Disbursal**: Disburses emergency restock credit (e.g., ₹5,000) directly via Paytm Payouts with automatic 11:00 PM settlement deduction at 0% APR.

---

## 📱 Cross-Platform Experience: Desktop & Dedicated iPhone 16 Pro Max View

* **Desktop View**: Enterprise-grade multi-pane merchant dashboard tailored to official Paytm enterprise branding (`#002970` Deep Navy, `#00BAF2` Electric Cyan).
* **Dedicated iPhone 16 Pro Max View**: 1-tap switch to a dedicated mobile shell (430px × 932px native viewport ratio) with native iOS Dynamic Island, tap-to-upload screenshot zone, paper khata scanner, and sales velocity slider.
* **Light / Dark Mode**: Seamless high-contrast theme switcher with local storage persistence.

---

## 🛠️ Technology Stack

| Layer | Technologies & Frameworks |
| :--- | :--- |
| **Frontend & Mobile Shell** | React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons |
| **Generative & Conversational AI** | Natural Language Processing, Time-Series Pattern Forecasting |
| **Computer Vision / OCR** | Document OCR pipeline for paper registers & UPI payment screenshots |
| **Speech Engine** | Web Speech API, Synthetic Audio Chimes, Voice Synthesis (Hindi/English) |
| **FinTech & Payments Rails** | NPCI Settlement Webhooks, Paytm QR Generator, UPI Switch APIs |

---

## 🏆 USP (Unique Selling Proposition)

1. **Grounded in Live Kirana Reality**: Ask Priya is hardwired to live Soundbox streams and payment velocity, not abstract generic knowledge.
2. **Sub-Second Fraud Arbiter**: Eliminates customer counter conflict with instant 380ms verification and auto-recovery.
3. **Zero-Friction Paper Digitization**: Bridges India's offline-to-online transition with 1-tap handwritten notebook scanning.
4. **Cashflow-Collateralized Lending**: Instant 0% restock credit repaid automatically from nightly settlements without paperwork.

---

## 💼 Business Model

1. **Freemium Core + Enterprise Suite (SaaS)**: Core Soundbox telemetry and dispute shielding remain free; advanced inventory forecasting and automated WhatsApp marketing available via *Setu Pro*.
2. **WhatsApp Recovery Convenience Fee**: Micro-transaction fee on digital udhaar recovered via automated WhatsApp QR links.
3. **Underwriting Spread & Merchant Payouts**: Commission on emergency restock credit lines in partnership with NBFCs and lending partners.
4. **Increased Merchant Deposit Float**: Automated 11:00 PM deduction increases daily ecosystem float.

---

## 💻 Local Setup & Development

```bash
# Clone repository
git clone https://github.com/wishsagarks/Paytm-Business-Setu.git
cd Paytm-Business-Setu

# Install dependencies
npm install

# Start development server
npm run dev

# Run production build & verify types
npm run build
```

---

*Developed by Team RONIX (Gulshan Gautam, Dhananjay Sharma, Harshit Patra) for the Paytm Hackathon.*
