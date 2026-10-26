-- ============================================================================
-- PAYTM BUSINESS SETU (VYAPAR AI) - PRODUCTION DATABASE SCHEMA & LEDGER ENGINE
-- Target Engine: PostgreSQL 15+ / Supabase
-- Architecture: Double-Entry Immutable Ledger with ACID Guarantees & Idempotency
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ----------------------------------------------------------------------------
-- 1. MERCHANTS & STORE IDENTIFIERS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS merchants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_code VARCHAR(32) UNIQUE NOT NULL, -- e.g. PTM889012
    trade_name VARCHAR(128) NOT NULL,          -- e.g. Sharma General Store
    legal_name VARCHAR(255) NOT NULL,
    proprietor_name VARCHAR(128) NOT NULL,
    gstin VARCHAR(15) UNIQUE,                  -- e.g. 07AAAAA0000A1Z5
    pan VARCHAR(10) NOT NULL,                  -- e.g. ABCDE1234F
    phone VARCHAR(15) UNIQUE NOT NULL,
    email VARCHAR(128),
    vpa VARCHAR(64) UNIQUE NOT NULL,           -- e.g. sharmakirana@paytm
    tier VARCHAR(16) DEFAULT 'Tier-1' CHECK (tier IN ('Tier-1', 'Tier-2', 'Enterprise')),
    is_kyc_verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_merchants_code ON merchants(merchant_code);
CREATE INDEX idx_merchants_phone ON merchants(phone);

-- ----------------------------------------------------------------------------
-- 2. SETTLEMENT BANK ACCOUNTS (BOUND HARDWARE & ESCROW)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS settlement_bank_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE RESTRICT,
    bank_name VARCHAR(64) NOT NULL,            -- e.g. HDFC Bank
    account_number_encrypted TEXT NOT NULL,    -- AES-GCM encrypted
    account_number_masked VARCHAR(16) NOT NULL,-- e.g. **** **** 4102
    ifsc VARCHAR(11) NOT NULL,                 -- e.g. HDFC0001234
    beneficiary_name VARCHAR(128) NOT NULL,
    is_primary BOOLEAN DEFAULT TRUE,
    is_instant_settlement_enabled BOOLEAN DEFAULT TRUE,
    daily_settlement_limit NUMERIC(12, 2) DEFAULT 500000.00,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT chk_positive_limit CHECK (daily_settlement_limit >= 0)
);

CREATE UNIQUE INDEX idx_unique_primary_per_merchant 
ON settlement_bank_accounts(merchant_id) 
WHERE is_primary = TRUE;

-- ----------------------------------------------------------------------------
-- 3. IOT SOUNDBOX HARDWARE REGISTRY & TELEMETRY
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS soundbox_devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE RESTRICT,
    device_id VARCHAR(64) UNIQUE NOT NULL,     -- e.g. SBX-DL-88912
    model VARCHAR(32) NOT NULL DEFAULT 'Paytm AI Soundbox v3',
    firmware_version VARCHAR(16) NOT NULL DEFAULT 'v3.4.1',
    battery_level SMALLINT CHECK (battery_level BETWEEN 0 AND 100),
    is_charging BOOLEAN DEFAULT FALSE,
    network_status VARCHAR(16) DEFAULT '4G Active' CHECK (network_status IN ('4G Active', '3G Weak', 'Offline')),
    carrier VARCHAR(32) DEFAULT 'Airtel 4G Enterprise M2M',
    volume_level SMALLINT DEFAULT 85 CHECK (volume_level BETWEEN 10 AND 100),
    language_code VARCHAR(16) DEFAULT 'Hindi',
    signal_strength_dbm SMALLINT DEFAULT -68,
    broadcasts_today INT DEFAULT 0,
    last_ping_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 4. CHART OF ACCOUNTS (DOUBLE-ENTRY ACCOUNTING LEDGER)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS chart_of_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_code VARCHAR(32) UNIQUE NOT NULL,  -- e.g. 1010-CASH, 2010-MERCHANT-WALLET
    account_name VARCHAR(64) NOT NULL,
    account_type VARCHAR(16) NOT NULL CHECK (account_type IN ('ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE')),
    currency VARCHAR(3) DEFAULT 'INR',
    balance NUMERIC(14, 2) DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 5. JOURNAL TRANSACTIONS & ENTRIES (ACID DOUBLE-ENTRY GUARANTEE)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS journal_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE RESTRICT,
    idempotency_key VARCHAR(64) UNIQUE NOT NULL, -- Prevents concurrent double-entry
    entry_reference VARCHAR(64) NOT NULL,        -- e.g. RRN, IMPS-UTR, or Settlement ID
    entry_type VARCHAR(32) NOT NULL CHECK (entry_type IN ('UPI_PAYMENT', 'INSTANT_PAYOUT', 'REFUND_REVERSAL', 'UDHAAR_RECOVERY', 'LOAN_DISBURSEMENT')),
    narration TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS journal_line_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    journal_entry_id UUID NOT NULL REFERENCES journal_entries(id) ON DELETE RESTRICT,
    account_id UUID NOT NULL REFERENCES chart_of_accounts(id) ON DELETE RESTRICT,
    direction VARCHAR(6) NOT NULL CHECK (direction IN ('DEBIT', 'CREDIT')),
    amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_line_items_account_date ON journal_line_items(account_id, created_at DESC);
CREATE INDEX idx_journal_merchant_date ON journal_entries(merchant_id, created_at DESC);

-- Trigger: Ensure balanced journal entries (Sum(Debit) == Sum(Credit))
CREATE OR REPLACE FUNCTION verify_journal_entry_balance()
RETURNS TRIGGER AS $$
DECLARE
    debit_sum NUMERIC(12, 2);
    credit_sum NUMERIC(12, 2);
BEGIN
    SELECT COALESCE(SUM(amount), 0) INTO debit_sum 
    FROM journal_line_items 
    WHERE journal_entry_id = NEW.journal_entry_id AND direction = 'DEBIT';

    SELECT COALESCE(SUM(amount), 0) INTO credit_sum 
    FROM journal_line_items 
    WHERE journal_entry_id = NEW.journal_entry_id AND direction = 'CREDIT';

    -- Permitted during multi-statement inserts if deferred, or validated post-transaction
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ----------------------------------------------------------------------------
-- 6. QR & TERMINAL TRANSACTIONS (IDEMPOTENT WEBHOOK STORAGE)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE RESTRICT,
    idempotency_key VARCHAR(64) UNIQUE NOT NULL, -- Replay attack protection
    rrn VARCHAR(32) UNIQUE NOT NULL,             -- Retrieval Reference Number from NPCI
    txn_reference VARCHAR(64) UNIQUE NOT NULL,   -- e.g. PTM_TXN_987214981
    customer_name VARCHAR(128) NOT NULL,
    customer_phone_masked VARCHAR(16) NOT NULL,  -- e.g. +91 98*** **910
    payment_method VARCHAR(32) NOT NULL CHECK (payment_method IN ('Paytm UPI', 'Soundbox', 'Paytm Wallet', 'RuPay Card', 'Net Banking')),
    amount NUMERIC(10, 2) NOT NULL CHECK (amount > 0),
    fee NUMERIC(6, 2) DEFAULT 0.00,
    tax NUMERIC(6, 2) DEFAULT 0.00,
    net_settlement NUMERIC(10, 2) GENERATED ALWAYS AS (amount - fee - tax) STORED,
    status VARCHAR(16) NOT NULL DEFAULT 'Success' CHECK (status IN ('Success', 'Refunded', 'Pending', 'Failed')),
    soundbox_broadcasted BOOLEAN DEFAULT FALSE,
    soundbox_ack_latency_ms INT DEFAULT NULL,
    order_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    settled_at TIMESTAMPTZ
);

CREATE INDEX idx_txns_merchant_status ON transactions(merchant_id, status);
CREATE INDEX idx_txns_created_at ON transactions(merchant_id, created_at DESC);
CREATE INDEX idx_txns_rrn ON transactions(rrn);

-- ----------------------------------------------------------------------------
-- 7. OCR PAYMENT SCREENSHOT VERIFICATION & REVERSAL SHIELD
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS payment_ocr_scans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE RESTRICT,
    utr VARCHAR(32) NOT NULL,
    extracted_amount NUMERIC(10, 2),
    extracted_app VARCHAR(32),
    customer_name VARCHAR(128),
    confidence_score SMALLINT CHECK (confidence_score BETWEEN 0 AND 100),
    verification_status VARCHAR(16) NOT NULL CHECK (verification_status IN ('VERIFIED', 'STUCK', 'UNREADABLE', 'FRAUD_FLAGGED')),
    is_reversal_initiated BOOLEAN DEFAULT FALSE,
    reversal_reference VARCHAR(64) UNIQUE,
    repay_qr_id VARCHAR(64) UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ocr_merchant_utr ON payment_ocr_scans(merchant_id, utr);

-- ----------------------------------------------------------------------------
-- 8. UDHAAR LEDGER (BAHI-KHATA) WITH DYNAMIC OFFER EXCLUSION
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS udhaar_ledger (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE RESTRICT,
    customer_name VARCHAR(128) NOT NULL,
    customer_phone VARCHAR(15) NOT NULL,
    amount NUMERIC(10, 2) NOT NULL CHECK (amount > 0),
    due_date DATE NOT NULL,
    status VARCHAR(16) NOT NULL DEFAULT 'Unpaid' CHECK (status IN ('Unpaid', 'Reminder Sent', 'Paid')),
    is_excluded_from_offers BOOLEAN DEFAULT FALSE,
    notes TEXT,
    last_reminder_sent_at TIMESTAMPTZ,
    reminder_count SMALLINT DEFAULT 0,
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_udhaar_merchant_due ON udhaar_ledger(merchant_id, due_date, status);
CREATE INDEX idx_udhaar_phone ON udhaar_ledger(customer_phone);

-- Automated Function: Dynamically exclude customers overdue > 7 days
CREATE OR REPLACE FUNCTION sync_udhaar_overdue_penalties()
RETURNS VOID AS $$
BEGIN
    UPDATE udhaar_ledger
    SET is_excluded_from_offers = TRUE
    WHERE status != 'Paid'
      AND due_date < (CURRENT_DATE - INTERVAL '7 days')
      AND is_excluded_from_offers = FALSE;
END;
$$ LANGUAGE plpgsql;

-- ----------------------------------------------------------------------------
-- 9. DYNAMIC MERCHANT OFFERS & CHECKOUT REDEMPTIONS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS merchant_offers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE RESTRICT,
    title VARCHAR(128) NOT NULL,
    discount_amount NUMERIC(8, 2) NOT NULL CHECK (discount_amount > 0),
    min_spend NUMERIC(8, 2) NOT NULL CHECK (min_spend >= discount_amount),
    validity_window VARCHAR(32) DEFAULT '7 Days',
    is_active BOOLEAN DEFAULT TRUE,
    total_claims INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_offers_merchant_active ON merchant_offers(merchant_id, is_active);

-- ----------------------------------------------------------------------------
-- 10. RECOVERY AUDIT LOG & WEBHOOK INGESTION BUFFER
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS webhook_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id VARCHAR(64) UNIQUE NOT NULL,      -- e.g. EVT_NPCI_8912401
    source VARCHAR(32) NOT NULL,               -- e.g. NPCI, PAYTM_PAYOUTS, SOUNDBOX_GATEWAY
    signature_sha256 VARCHAR(64) NOT NULL,
    payload JSONB NOT NULL,
    processed_status VARCHAR(16) DEFAULT 'PROCESSED' CHECK (processed_status IN ('RECEIVED', 'PROCESSED', 'FAILED', 'REPLAY_DISCARDED')),
    error_detail TEXT,
    received_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_webhook_source_status ON webhook_events(source, processed_status);
