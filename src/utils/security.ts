/**
 * Security and sanitization utilities.
 * Protects against XSS, injection, spamming, and automated abuse.
 */

/**
 * Sanitizes plain text input by stripping HTML tags, control characters,
 * and restricting length to prevent payload inflation attacks.
 */
export function sanitizeInput(input: string, maxLength = 250): string {
  if (typeof input !== 'string') return ''

  return (
    input
      // Strip potential script/HTML tags
      .replace(/<[^>]*>?/gm, '')
      // Remove null bytes and non-printable control characters
      .replace(/[\u0000-\u0008\u000B-\u000C\u000E-\u001F\u007F-\u009F]/g, '')
      // Trim excessive whitespace
      .trim()
      // Enforce strict max length
      .slice(0, maxLength)
  )
}

/**
 * Validates email format using safe RFC 5322 subset without ReDoS vulnerability.
 */
export function isValidEmail(email: string): boolean {
  if (!email || email.length > 254) return false
  // Safe regex that avoids backtracking explosion
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/
  return emailRegex.test(email.trim())
}

/**
 * Validates international phone format.
 */
export function isValidPhone(phone: string): boolean {
  if (!phone) return true // Optional field in some forms
  const digits = phone.replace(/\D/g, '')
  return digits.length >= 7 && digits.length <= 15
}

/**
 * Client-side Rate Limiter / Cooldown manager.
 * Prevents rapid-fire repeated clicks, bot hammering, and DoS attempts on WhatsApp redirects.
 */
export class ActionRateLimiter {
  private key: string
  private cooldownMs: number

  constructor(key: string, cooldownMs = 3000) {
    this.key = `rate_limit_${key}`
    this.cooldownMs = cooldownMs
  }

  public canProceed(): boolean {
    try {
      const lastAction = sessionStorage.getItem(this.key)
      if (!lastAction) return true

      const elapsed = Date.now() - parseInt(lastAction, 10)
      return elapsed >= this.cooldownMs
    } catch {
      return true
    }
  }

  public recordAction(): void {
    try {
      sessionStorage.setItem(this.key, Date.now().toString())
    } catch {
      // Storage might be disabled in private browsing
    }
  }

  public getRemainingSeconds(): number {
    try {
      const lastAction = sessionStorage.getItem(this.key)
      if (!lastAction) return 0
      const elapsed = Date.now() - parseInt(lastAction, 10)
      const remaining = Math.ceil((this.cooldownMs - elapsed) / 1000)
      return remaining > 0 ? remaining : 0
    } catch {
      return 0
    }
  }
}
