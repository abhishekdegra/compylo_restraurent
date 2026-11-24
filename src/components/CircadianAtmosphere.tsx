import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCircadianTheme, THEME_DETAILS, type CircadianTheme } from '../context/ThemeContext'
import { Clock, Sparkles, Check, ChevronDown, Radio } from 'lucide-react'

export const CircadianAtmosphere: React.FC = () => {
  const { theme, isAuto, currentTime, setTheme, toggleAuto } = useCircadianTheme()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const currentDetails = THEME_DETAILS[theme]

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick)
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [isOpen])

  const themesList: CircadianTheme[] = ['dawn', 'zenith', 'dusk', 'noir']

  return (
    <div ref={menuRef} className="relative z-50">
      {/* Navbar Trigger Pill */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="circadian-trigger-btn flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#d4af37]/35 bg-[#12151b]/80 hover:bg-[#181b24] hover:border-[#d4af37]/70 backdrop-blur-md transition-all duration-300 shadow-[0_2px_12px_rgba(0,0,0,0.4)] cursor-pointer group"
        aria-label="Circadian Atmosphere Controller"
      >
        <span className="text-sm leading-none">{currentDetails.icon}</span>
        <div className="flex items-center gap-1.5 text-[10px] uppercase font-sans tracking-wider text-[#f5eedf]">
          <span className="circadian-time font-mono text-[#d4af37] font-semibold">{currentTime}</span>
          <span className="hidden sm:inline text-[#8a8d98]">•</span>
          <span className="circadian-mode hidden sm:inline truncate max-w-[95px] font-semibold group-hover:text-[#d4af37] transition-colors">
            {currentDetails.shortName}
          </span>
        </div>
        {isAuto && (
          <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-pulse" title="Auto Circadian Sync Active" />
        )}
        <ChevronDown className={`w-3 h-3 text-[#d4af37] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Floating Atmosphere Popover */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="circadian-popover absolute right-0 mt-3 w-[calc(100vw-2rem)] max-w-80 sm:w-96 sm:max-w-none p-4 sm:p-5 bg-[#0e1015]/98 border border-[#d4af37]/45 rounded-sm shadow-[0_20px_60px_rgba(0,0,0,0.9)] backdrop-blur-2xl transition-all duration-300"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#d4af37]/20">
              <div>
                <span className="text-[9px] uppercase tracking-[0.28em] text-[#d4af37] font-sans font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-[#d4af37]" />
                  Atmospheric Lighting
                </span>
                <h4 className="font-cinzel text-sm font-semibold text-[#f7ecd7] mt-0.5">
                  Select Dining Ambiance
                </h4>
              </div>

              <div className="flex items-center gap-1.5 bg-[#181b24] px-2.5 py-1 rounded-full border border-[#d4af37]/30">
                <Clock className="w-3 h-3 text-[#d4af37]" />
                <span className="font-mono text-xs text-[#edebe6] font-semibold">{currentTime}</span>
              </div>
            </div>

            {/* Auto-Sync Toggle Banner */}
            <div className="circadian-auto-box mt-3.5 mb-3 p-2.5 bg-[#161922] border border-[#d4af37]/25 rounded-sm flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Radio className={`w-3.5 h-3.5 ${isAuto ? 'text-[#d4af37] animate-pulse' : 'text-[#8a8d98]'}`} />
                <div>
                  <div className="text-[11px] font-sans font-semibold text-[#f5eedf]">
                    Auto Time Sync
                  </div>
                  <div className="text-[9px] text-[#8a8d98]">
                    Automatically adapts to your current local time
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={toggleAuto}
                className={`circadian-auto-btn text-[10px] uppercase font-sans tracking-wider px-2.5 py-1 rounded-none border transition-colors cursor-pointer ${
                  isAuto
                    ? 'bg-[#d4af37] text-[#08090b] font-bold border-[#d4af37]'
                    : 'border-[#d4af37]/40 text-[#edebe6] hover:border-[#d4af37]'
                }`}
              >
                {isAuto ? 'Enabled' : 'Enable'}
              </button>
            </div>

            {/* 4 Ambiance Options */}
            <div className="space-y-2 mt-2">
              {themesList.map((tKey) => {
                const opt = THEME_DETAILS[tKey]
                const isSelected = theme === tKey

                return (
                  <button
                    key={tKey}
                    type="button"
                    onClick={() => {
                      setTheme(tKey)
                    }}
                    className={`circadian-theme-btn w-full p-2.5 rounded-sm text-left border transition-all duration-200 flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'is-selected bg-[#1e2330] border-[#d4af37] shadow-[0_0_15px_rgba(212,175,55,0.25)] ring-1 ring-[#d4af37]'
                        : 'bg-[#12151b]/70 border-[#d4af37]/15 hover:border-[#d4af37]/50 hover:bg-[#161922]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl shrink-0">{opt.icon}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="circadian-theme-name font-cinzel text-xs font-semibold text-[#f7ecd7]">
                            {opt.name}
                          </span>
                          <span className="circadian-theme-hours text-[9px] text-[#caa065] font-mono">
                            {opt.hours}
                          </span>
                        </div>
                        <p className="circadian-theme-sub text-[10px] text-[#a5a8b5] font-sans font-light mt-0.5">
                          {opt.subname}
                        </p>
                      </div>
                    </div>

                    {isSelected ? (
                      <div className="w-5 h-5 rounded-full bg-[#d4af37] text-[#08090b] flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    ) : (
                      <div
                        className="w-3 h-3 rounded-full border border-white/20 shrink-0"
                        style={{ backgroundColor: opt.themeColor }}
                      />
                    )}
                  </button>
                )
              })}
            </div>

            <div className="mt-3.5 pt-2.5 border-t border-white/5 text-[10px] text-[#8a8d98] text-center font-serif italic">
              "Harmonizing culinary atmosphere with the natural rhythm of light."
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
