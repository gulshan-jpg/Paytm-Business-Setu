/**
 * Paytm Business Setu - Security & Compliance Utility
 * Standards: RBI Tokenization Guidelines, NPCI UPI Webhook Specifications, OWASP ASVS 4.0
 */

/**
 * Mask customer phone number in compliance with RBI customer data privacy rules.
 * Example: +91 98101 22910 -> +91 98*** **910
 */
export function maskPhoneNumber(phone: string): string {
  if (!phone) return '';
  const cleaned = phone.trim();
  if (cleaned.length < 8) return cleaned;
  
  // Extract trailing 3 digits and leading prefix
  const last3 = cleaned.slice(-3);
  const firstPrefix = cleaned.slice(0, Math.min(6, cleaned.length - 5));
  return `${firstPrefix}*** **${last3}`;
}

/**
 * Mask bank account number according to PCI-DSS / RBI tokenization guidelines.
 * Example: 50100412345678 -> **** **** 5678
 */
export function maskBankAccount(accountNo: string): string {
  if (!accountNo) return '';
  const digits = accountNo.replace(/\D/g, '');
  if (digits.length < 4) return '****';
  const last4 = digits.slice(-4);
  return `**** **** ${last4}`;
}

/**
 * Mask Permanent Account Number (PAN) according to Income Tax / UIDAI norms.
 * Example: ABCDE1234F -> ABC** ***4F
 */
export function maskPan(pan: string): string {
  if (!pan || pan.length !== 10) return pan;
  return `${pan.slice(0, 3)}** ***${pan.slice(-2)}`;
}

/**
 * Validates format of an Indian mobile number.
 * Must be 10 digits starting with 6, 7, 8, or 9 (with optional +91/91/0 prefix).
 */
export function validateIndianMobile(phone: string): boolean {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10 && /^[6-9]/.test(digits)) return true;
  if (digits.length === 12 && digits.startsWith('91') && /^[6-9]/.test(digits.slice(2))) return true;
  return false;
}

/**
 * Constant-time string equality check to prevent timing attacks during HMAC signature evaluation.
 */
export function timingSafeEqualString(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

/**
 * Client-safe Webhook HMAC-SHA256 signature simulator / verifier using Web Crypto API.
 */
export async function verifyPaytmWebhookSignature(
  rawPayload: string,
  receivedSignatureHex: string,
  secretKey: string
): Promise<boolean> {
  if (!rawPayload || !receivedSignatureHex || !secretKey) return false;

  try {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secretKey);
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify', 'sign']
    );

    const signatureBytes = new Uint8Array(
      receivedSignatureHex.match(/.{1,2}/g)?.map((byte) => parseInt(byte, 16)) || []
    );

    return await crypto.subtle.verify(
      'HMAC',
      cryptoKey,
      signatureBytes,
      encoder.encode(rawPayload)
    );
  } catch {
    return false;
  }
}

/**
 * In-memory Token Bucket Rate Limiter
 * Enforces API and notification throttle (e.g., max 1 reminder per customer per 24 hours).
 */
class RateLimiter {
  private timestamps: Map<string, number> = new Map();

  /**
   * Checks if an action on key is allowed within the cooldown period.
   * @param key Target identifier (e.g., customerId or merchantId)
   * @param cooldownSeconds Cooldown duration (default 86400s / 24h)
   */
  public isAllowed(key: string, cooldownSeconds: number = 86400): { allowed: boolean; remainingSeconds: number } {
    const now = Date.now();
    const lastTrigger = this.timestamps.get(key) || 0;
    const elapsedSeconds = (now - lastTrigger) / 1000;

    if (elapsedSeconds < cooldownSeconds) {
      return {
        allowed: false,
        remainingSeconds: Math.ceil(cooldownSeconds - elapsedSeconds)
      };
    }

    this.timestamps.set(key, now);
    return { allowed: true, remainingSeconds: 0 };
  }

  public reset(key: string) {
    this.timestamps.delete(key);
  }
}

export const rateLimiter = new RateLimiter();
