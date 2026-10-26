# Paytm Business Setu (Paytm Saathi — Vyapar AI)

Autonomous AI copilot for Kirana commerce:  
* **Vision Shield**: Sub-380ms UPI screenshot fraud & tamper checks with UTR auto-resolution.  
* **Neural Bahi-Khata**: OCR digitisation of paper ledgers + automated WhatsApp collections & discount revoking.  
* **Liquidity Underwriter**: Intraday QR velocity loans at 0% APR via EOD batch recovery.

Production-ready merchant dashboard prototype designed for a live 3-minute hackathon pitch, strictly conforming to official Paytm enterprise branding and design hierarchy with zero emojis.

---

## Official Paytm Enterprise Palette

| Element | Color Name | Hex Code | Purpose |
| :--- | :--- | :--- | :--- |
| **Primary Navy** | Paytm Deep Navy | `#002970` | Top header, active nav anchors, dark buttons |
| **Primary Blue** | Paytm Electric Cyan | `#00BAF2` | Primary CTA buttons, active accents, badges |
| **Hover Blue** | Paytm Darker Blue | `#009EDC` | Hover transitions on primary buttons |
| **Background Slate** | Off-White / Light Gray | `#F4F6F9` | Main page background |
| **Card Surface** | Pure White | `#FFFFFF` | Metric containers with `#E2E8F0` border |
| **Success Green** | Paytm Success Green | `#10B981` | Positive revenue, verified UTR, instant credit |
| **Warning Amber** | Alert Amber | `#F59E0B` | Stuck payments, bank switch lag |
| **Main Text** | Dark Slate | `#0F172A` | Primary typography |
| **Muted Text** | Subtitle Gray | `#64748B` | Labels, timestamps, secondary information |

---

## Core Architecture & Value Modules

### 1. Top Header Bar
* **Official Branding**: Paytm Business Setu | Vyapar AI
* **Merchant Outlet**: Sharma General Store — Merchant ID: `#PTM889012`
* **Hardware Status**: Paytm AI Soundbox v3 | Status: Online | Battery: 92% | 4G Active
* **Quick Action**: Download Store QR Poster

### 2. Navigation Sidebar Tabs
1. **Overview**: Collections (Rs. 18,450), 142 txns, hourly rush chart, recent payments stream, and quick shortcuts.
2. **Verify & Refund Shield (Vision Shield)**: Solves Soundbox audio lag & telecom delays. Instant OCR matches UTR (#984102938102) in 380ms. For stuck customer debits, triggers automated bank auto-refund while generating a fresh dynamic Re-Pay QR code to eliminate retail disputes.
3. **AI Statement & Urgent Loan (Liquidity Underwriter)**: 24-hour zero-cost working capital for retail kirana inventory. Analyzes daily QR velocity (Rs. 14,500/day across 120 txns) and bank health score (94/100). Disburses Rs. 5,000 credit instantly to HDFC Bank Account ****4102 via Paytm Payouts with auto-deduction at 11:00 PM tonight (Rs. 0 interest).
4. **Neural Bahi-Khata (Udhaar Ledger)**: Paper ledger OCR digitization, automated customer balance tracking, and WhatsApp payment collection reminders.
5. **Check Merchant Offers**: Customer loyalty & repeat engine with full CRUD offer management:
   - **Add Offer (Create)**: "+ Create New Offer" modal to define custom discounts, minimum spend basket thresholds, validity windows, and target audiences.
   - **Edit Offer (Update)**: Pre-filled modal to update discount amounts, spend requirements, or validity on live offers.
   - **Delete Offer (Delete)**: Confirmation prompt to safely decommission retired campaigns with instant preview fallback.
   - **Real-Time Customer Mobile Preview Sync**: Right-side customer smartphone simulator reflects active offer selections, edits, and additions instantaneously.
6. **Transactions & Settlements**: Full transaction ledger, auto nightly 11:00 PM settlement schedule, and instant IMPS transfer modal.

---
## Deployed Link-https://paytm-business-setu.vercel.app/

## Local Development & Production Build

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```
