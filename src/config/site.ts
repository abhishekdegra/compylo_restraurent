/**
 * Centralized, secure site configuration.
 * Reads environment variables with safe, validated defaults.
 */

// Digits-only sanitization for phone numbers used in wa.me
const cleanDigits = (num: string): string => num.replace(/\D/g, '')
const siteName = import.meta.env.VITE_SITE_NAME || 'Kafeholic'

export const SITE_CONFIG = {
  name: siteName,
  legalName: `${siteName} Restaurant & Fine Dining`,
  
  // WhatsApp Contact (digits only, e.g., 919876543210)
  whatsappNumber: cleanDigits(import.meta.env.VITE_WHATSAPP_NUMBER || '919876543210'),
  
  // Display contact info
  phoneDisplay: import.meta.env.VITE_CONTACT_PHONE || '+91 98765 43210',
  phoneTel: import.meta.env.VITE_CONTACT_PHONE_TEL || '+919876543210',
  email: import.meta.env.VITE_CONTACT_EMAIL || 'concierge@kafeholic.example',
  
  address: `The ${siteName} Estate, 42 King's Promenade, Diplomatic Enclave, New Delhi`,
  
  // Helper to construct secure, sanitized WhatsApp URLs
  buildWhatsAppUrl(messageText: string): string {
    const sanitizedNumber = cleanDigits(this.whatsappNumber)
    const encodedMessage = encodeURIComponent(messageText.trim())
    return `https://wa.me/${sanitizedNumber}?text=${encodedMessage}`
  },
} as const
