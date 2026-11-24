import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu as MenuIcon, X, Calendar } from 'lucide-react'
import { MagneticButton } from './ui/MagneticButton'
import { AmbientSoundscape } from './AmbientSoundscape'
import { CircadianAtmosphere } from './CircadianAtmosphere'
import { WhatsAppIcon } from './ui/WhatsAppIcon'
import { SITE_CONFIG } from '../config/site'

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    let frameId = 0
    let ticking = false

    const handleScroll = () => {
      if (ticking) return
      ticking = true
      frameId = window.requestAnimationFrame(() => {
        const nextScrolled = window.scrollY > 25
        setIsScrolled((current) => current === nextScrolled ? current : nextScrolled)
        ticking = false
      })
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.cancelAnimationFrame(frameId)
    }
  }, [])

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [location.pathname])

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Our Story', path: '/story' },
    { name: 'Curated Menu', path: '/menu' },
    { name: 'Ambience', path: '/gallery' },
    { name: 'Contact', path: '/contact' },
  ]

  return (
    <>
      <header
        className={`navbar-header fixed top-0 left-0 w-full z-50 transition-all duration-400 ${
          isScrolled
            ? 'bg-[#08090b]/92 backdrop-blur-2xl border-b border-[#d4af37]/20 py-3 shadow-[0_10px_35px_rgba(0,0,0,0.7)]'
            : 'bg-gradient-to-b from-[#08090b]/90 via-[#08090b]/30 to-transparent py-3.5 sm:py-4'
        }`}
      >
        <div className="max-w-[1500px] w-full mx-auto px-4 sm:px-6 md:px-8 xl:px-12 flex items-center justify-between gap-4 lg:gap-8">
          {/* Brand Logo */}
          <Link
            to="/"
            className="group flex flex-col items-start focus:outline-none shrink-0 mr-0 lg:mr-8 xl:mr-10"
          >
            <div className="flex items-center gap-2">
              <span className="font-cinzel text-xl sm:text-2xl font-bold tracking-[0.22em] text-[#f7ecd7] group-hover:text-[#d4af37] transition-colors">
                COMPYLO
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-pulse" />
            </div>
            <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.3em] text-[#caa065] font-sans font-medium">
              Fine Dining
            </span>
          </Link>

          {/* Desktop Navigation Links — Spacious, Single Line, Never Wrapped */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-8 mx-auto">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`nav-link-item relative text-[11px] xl:text-xs uppercase tracking-[0.2em] font-medium transition-colors py-1.5 whitespace-nowrap ${
                    isActive ? 'nav-link-active text-[#d4af37]' : 'text-[#c8cbd5] hover:text-[#f7ecd7]'
                  }`}
                >
                  {link.name}
                  {isActive ? (
                    <motion.span
                      layoutId="navUnderline"
                      className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#d4af37]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  ) : (
                    <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#d4af37]/60 transition-all duration-300 hover:w-full" />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Action CTAs (Right Side) */}
          <div className="hidden lg:flex items-center gap-2.5 xl:gap-3.5 shrink-0 ml-auto">
            {/* Real-Time Circadian Lighting Controller */}
            <CircadianAtmosphere />

            {/* Acoustic Lounge Ambient Soundscape */}
            <AmbientSoundscape />

            <Link to="/reservation">
              <MagneticButton
                variant="gold"
                className="py-2.5 px-4 xl:px-5 text-[10px] xl:text-[11px] tracking-[0.18em] whitespace-nowrap"
              >
                <Calendar className="w-3.5 h-3.5" />
                Reserve Table
              </MagneticButton>
            </Link>
          </div>

          {/* Mobile Right Controls: Circadian + Soundscape + Hamburger */}
          <div className="flex items-center gap-1.5 sm:gap-2 lg:hidden">
            <CircadianAtmosphere />
            <div className="hidden sm:block">
              <AmbientSoundscape />
            </div>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 sm:p-2 text-[#d4af37] hover:text-[#f7ecd7] transition-colors focus:outline-none cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="mobile-nav-drawer fixed inset-0 z-40 bg-[#08090b]/98 backdrop-blur-2xl flex flex-col justify-between p-6 sm:p-8 pt-24 lg:hidden border-b border-[#d4af37]/20"
          >
            <div className="flex flex-col gap-5 text-center mt-4">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#d4af37] font-semibold">
                Main Navigation
              </span>
              {navLinks.map((link, idx) => {
                const isActive = location.pathname === link.path
                return (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Link
                      to={link.path}
                      className={`font-serif text-2xl tracking-wide transition-colors ${
                        isActive ? 'text-[#d4af37] font-semibold' : 'text-[#edebe6] hover:text-[#d4af37]'
                      }`}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                )
              })}
            </div>

            <div className="flex flex-col gap-3 mt-6 pb-6 border-t border-[#d4af37]/20 pt-6">
              <Link
                to="/reservation"
                className="w-full bg-gradient-to-r from-[#d4af37] to-[#b88646] text-[#08090b] font-sans text-xs uppercase tracking-[0.2em] font-semibold py-3.5 flex items-center justify-center gap-2 shadow-lg rounded-sm"
              >
                <Calendar className="w-4 h-4" />
                Reserve a Table
              </Link>

              <a
                href={SITE_CONFIG.buildWhatsAppUrl(
                  `Hello ${SITE_CONFIG.name} Restaurant, I would like to inquire about a table reservation.`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full border border-[#25D366]/60 text-[#25D366] font-sans text-xs uppercase tracking-[0.2em] py-3 text-center flex items-center justify-center gap-2 hover:bg-[#25D366]/10 rounded-sm"
              >
                <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
                Direct WhatsApp Concierge
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
