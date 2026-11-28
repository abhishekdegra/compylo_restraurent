import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { WhatsAppIcon } from './ui/WhatsAppIcon'
import { SITE_CONFIG } from '../config/site'
import { ActionRateLimiter } from '../utils/security'

const floatingLimiter = new ActionRateLimiter('floating_wa_click', 2500)

export const FloatingWhatsApp: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(true)

  const handleWhatsAppClick = () => {
    if (!floatingLimiter.canProceed()) return
    floatingLimiter.recordAction()

    const message = `Hello ${SITE_CONFIG.name} Concierge! I would like to inquire about table availability and reservations.`
    const url = SITE_CONFIG.buildWhatsAppUrl(message)
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex items-center gap-3">
      {/* Floating Tooltip */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="hidden sm:flex items-center gap-2.5 bg-[#12151b]/95 border border-[#d4af37]/40 py-2 px-3.5 shadow-2xl backdrop-blur-md rounded-full"
          >
            <span className="w-2 h-2 rounded-full bg-[#25D366] animate-ping" />
            <span className="text-[11px] font-sans text-[#f7ecd7] font-medium tracking-wide">
              VIP WhatsApp Concierge
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowTooltip(false)
              }}
              className="text-[#8a8d98] hover:text-[#d4af37] p-0.5 ml-1 cursor-pointer"
              aria-label="Dismiss tooltip"
            >
              <X className="w-3 h-3" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Real WhatsApp Floating Action Button */}
      <motion.button
        onClick={handleWhatsAppClick}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.94 }}
        className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white flex items-center justify-center shadow-[0_8px_32px_rgba(37,211,102,0.5)] cursor-pointer group border border-white/25 transition-colors"
        aria-label={`Chat on WhatsApp with ${SITE_CONFIG.name} Concierge`}
      >
        <WhatsAppIcon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#d4af37] border-2 border-[#08090b] rounded-full" />
      </motion.button>
    </div>
  )
}
