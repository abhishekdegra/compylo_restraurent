import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUp, Check } from 'lucide-react'
import { sanitizeInput, isValidEmail, ActionRateLimiter } from '../utils/security'

const newsletterLimiter = new ActionRateLimiter('newsletter_sub', 3000)

// Custom sleek SVGs for brand socials
const InstagramIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
)

const FacebookIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.456 5 15.58 5H18V0h-3.808C10.595 0 9 1.583 9 4.615V8z" />
  </svg>
)

const TwitterXIcon = () => (
  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

export const Footer: React.FC = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [honeypot, setHoneypot] = useState('')

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()

    // 1. Bot Honeypot Check
    if (honeypot) return

    // 2. Rate Limiting Check
    if (!newsletterLimiter.canProceed()) {
      setErrorMessage('Please wait a moment before trying again.')
      return
    }

    // 3. Email Validation & Sanitization
    const cleanEmail = sanitizeInput(newsletterEmail, 100)
    if (!isValidEmail(cleanEmail)) {
      setErrorMessage('Please enter a valid email address.')
      return
    }

    setErrorMessage('')
    newsletterLimiter.recordAction()
    setSubscribed(true)
    setTimeout(() => {
      setSubscribed(false)
      setNewsletterEmail('')
    }, 4000)
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="footer-container bg-[#050608] border-t border-[#d4af37]/20 text-[#8a8d98] relative overflow-hidden pt-20 pb-12 transition-colors duration-500">
      {/* Top Gold Gradient Trim */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#d4af37]/70 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-16 border-b border-white/5">
          {/* Brand Intro Column */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-cinzel text-2xl font-bold tracking-[0.25em] text-[#f7ecd7]">
                COMPYLO
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
            </div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#caa065] font-sans font-medium">
              Fine Dining &bull; Est. 2024
            </p>
            <p className="font-serif italic text-sm text-[#a5a8b5] max-w-sm leading-relaxed font-light pt-2">
              A refined dining destination where classical technique meets innovative botanical cuisine.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-4 pt-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37] hover:border-[#d4af37] hover:bg-[#d4af37]/10 transition-colors"
                aria-label="Instagram"
              >
                <InstagramIcon />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37] hover:border-[#d4af37] hover:bg-[#d4af37]/10 transition-colors"
                aria-label="Facebook"
              >
                <FacebookIcon />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37] hover:border-[#d4af37] hover:bg-[#d4af37]/10 transition-colors"
                aria-label="X Twitter"
              >
                <TwitterXIcon />
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-cinzel text-xs uppercase tracking-[0.25em] text-[#f7ecd7] font-semibold mb-4">
              The Experience
            </h4>
            <ul className="space-y-2.5 text-xs font-sans">
              <li>
                <Link to="/story" className="hover:text-[#d4af37] transition-colors">
                  Our Culinary Heritage &amp; Chef
                </Link>
              </li>
              <li>
                <Link to="/menu" className="hover:text-[#d4af37] transition-colors">
                  Seasonal &amp; Tasting Menus
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-[#d4af37] transition-colors">
                  Atmosphere &amp; Private Salon
                </Link>
              </li>
              <li>
                <Link to="/reservation" className="hover:text-[#d4af37] transition-colors">
                  VIP WhatsApp Reservation
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#d4af37] transition-colors">
                  Location, Hours &amp; Valet
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="font-cinzel text-xs uppercase tracking-[0.25em] text-[#f7ecd7] font-semibold mb-2">
              The Epicurean Gazette
            </h4>
            <p className="text-xs text-[#a5a8b5] font-light leading-relaxed">
              Receive private invitations to seasonal menu debuts, rare truffle arrivals, and winemakers' dinners.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              {/* Invisible Honeypot */}
              <input
                type="text"
                name="hp_newsletter"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="hidden opacity-0 absolute -left-[9999px] pointer-events-none"
              />

              <div className="flex">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => {
                    setNewsletterEmail(e.target.value)
                    if (errorMessage) setErrorMessage('')
                  }}
                  placeholder="Enter your email address"
                  className="bg-[#111318] border border-[#d4af37]/30 focus:border-[#d4af37] text-xs text-[#f5eedf] px-3.5 py-3 w-full focus:outline-none"
                />
                <button
                  type="submit"
                  className="bg-gradient-to-r from-[#d4af37] to-[#caa065] text-[#08090b] text-[10px] uppercase font-bold tracking-widest px-5 hover:brightness-110 transition-all cursor-pointer whitespace-nowrap"
                >
                  {subscribed ? <Check className="w-4 h-4" /> : 'Join'}
                </button>
              </div>

              {errorMessage && (
                <p className="text-[11px] text-red-400 font-sans">
                  {errorMessage}
                </p>
              )}

              {subscribed && (
                <p className="text-[11px] text-[#d4af37] font-serif italic">
                  Thank you. You have been added to our private register.
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] font-sans gap-4">
          <p className="text-[#8a8d98]">
            &copy; {new Date().getFullYear()} COMPYLO Restaurant &amp; Gastronomy. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-[#d4af37] transition-colors">Privacy Policy</a>
            <span>&bull;</span>
            <a href="#" className="hover:text-[#d4af37] transition-colors">Terms of Hospitality</a>
            <span>&bull;</span>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 text-[#d4af37] hover:text-[#f7ecd7] transition-colors cursor-pointer"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
