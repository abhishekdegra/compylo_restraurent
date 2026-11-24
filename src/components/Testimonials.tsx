import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TESTIMONIALS } from '../data/testimonialData'
import { AnimatedSection } from './ui/AnimatedSection'
import { GoldDivider } from './ui/GoldDivider'
import { Star, Quote, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react'

export const Testimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(true)
  const [isPaused, setIsPaused] = useState(false)
  const [progress, setProgress] = useState(0)

  const current = TESTIMONIALS[currentIndex]

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length)
    setProgress(0)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)
    setProgress(0)
  }

  // Live Typewriter Effect for Review Quote
  useEffect(() => {
    setDisplayedText('')
    setIsTyping(true)

    let charIndex = 0
    const fullText = current.quote
    const speed = 16 // ms per character (fluid, brisk luxury pace)

    const typeTimer = setInterval(() => {
      if (charIndex < fullText.length) {
        setDisplayedText(fullText.slice(0, charIndex + 1))
        charIndex++
      } else {
        setIsTyping(false)
        clearInterval(typeTimer)
      }
    }, speed)

    return () => clearInterval(typeTimer)
  }, [currentIndex, current.quote])

  // Auto-advance Timer with Pause on Hover
  useEffect(() => {
    if (isPaused) return

    const totalDuration = 8500 // 8.5 seconds per critique
    const tickInterval = 50
    const step = (tickInterval / totalDuration) * 100

    const autoTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          nextTestimonial()
          return 0
        }
        return prev + step
      })
    }, tickInterval)

    return () => clearInterval(autoTimer)
  }, [currentIndex, isPaused])

  return (
    <AnimatedSection id="testimonials" className="py-16 sm:py-24 md:py-32 bg-[#08090b] relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-[#d4af37]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-12 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14 md:mb-18">
          <span className="section-tag flex items-center justify-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
            Critic Acclaim &amp; Guest Reflections
          </span>
          <h2 className="font-cinzel text-2xl sm:text-4xl md:text-5xl font-bold text-[#edebe6] mt-2 mb-3 tracking-[0.14em] leading-tight">
            Words of Distinction
          </h2>
          <GoldDivider className="my-4 sm:my-5" />
          <p className="font-serif italic text-sm sm:text-base text-[#a5a8b5] font-light max-w-xl mx-auto leading-relaxed">
            Honored reflections from Michelin inspectors, master wine experts, and esteemed culinary patrons.
          </p>
        </div>

        {/* Featured Testimonial Card with Live Typewriter */}
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="testimonial-card relative bg-[#111318]/90 border border-[#d4af37]/35 p-6 sm:p-10 md:p-14 shadow-[0_20px_60px_rgba(0,0,0,0.85)] backdrop-blur-xl rounded-sm overflow-hidden transition-colors duration-400"
        >
          {/* Subtle Watermark Quote Icon */}
          <Quote className="testimonial-watermark absolute top-6 right-6 w-16 h-16 sm:w-20 sm:h-20 text-[#d4af37]/10 -scale-x-100 pointer-events-none transition-transform duration-700 hover:rotate-6" />

          {/* Top Live Badge & Stars */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-1.5 text-[#d4af37]">
              {[...Array(current.rating)].map((_, i) => (
                <motion.div
                  key={`${current.id}-star-${i}`}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.08, duration: 0.3 }}
                >
                  <Star className="w-4 h-4 fill-current drop-shadow-[0_0_8px_rgba(212,175,55,0.6)]" />
                </motion.div>
              ))}
            </div>

            <div className="testimonial-status-pill flex items-center gap-2 px-2.5 py-1 bg-[#181b24] border border-[#d4af37]/30 rounded-full text-[10px] uppercase font-sans tracking-wider text-[#caa065]">
              <span className={`w-1.5 h-1.5 rounded-full bg-[#d4af37] ${isTyping ? 'animate-ping' : ''}`} />
              <span>{isTyping ? 'Typing Critique...' : current.date}</span>
            </div>
          </div>

          {/* Animated Typewriter Quote Body */}
          <div className="min-h-[140px] sm:min-h-[120px] md:min-h-[110px] flex items-center mb-8">
            <p className="testimonial-quote font-serif italic text-lg sm:text-2xl md:text-3xl text-[#f7ecd7] leading-relaxed font-light">
              &ldquo;{displayedText}&rdquo;
              {/* Blinking 24k Gold Cursor */}
              <span
                className={`inline-block w-1.5 sm:w-2 h-5 sm:h-7 ml-1 bg-[#d4af37] align-middle shadow-[0_0_8px_#d4af37] ${
                  isTyping ? 'opacity-100' : 'animate-pulse'
                }`}
              />
            </p>
          </div>

          {/* Critic Attribution & Interactive Slider Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-t border-[#d4af37]/25 pt-6 gap-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.35 }}
              >
                <h4 className="testimonial-author font-cinzel text-base sm:text-lg font-semibold text-[#edebe6] tracking-wide">
                  {current.name}
                </h4>
                <p className="testimonial-role text-xs text-[#d4af37] tracking-wider mt-0.5">
                  {current.role} &bull; <span className="testimonial-pub text-[#8a8d98]">{current.publication}</span>
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Slider Controls with Pagination Dots */}
            <div className="flex items-center justify-between sm:justify-end gap-4">
              {/* Micro Pagination Dots */}
              <div className="flex items-center gap-1.5">
                {TESTIMONIALS.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setCurrentIndex(idx)
                      setProgress(0)
                    }}
                    className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                      idx === currentIndex
                        ? 'w-5 sm:w-6 bg-[#d4af37]'
                        : 'w-1.5 bg-[#d4af37]/30 hover:bg-[#d4af37]/60'
                    }`}
                    aria-label={`Jump to critique ${idx + 1}`}
                  />
                ))}
              </div>

              {/* Prev / Next Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={prevTestimonial}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-[#d4af37]/30 text-[#d4af37] hover:border-[#d4af37] hover:bg-[#d4af37]/10 flex items-center justify-center transition-all cursor-pointer"
                  aria-label="Previous review"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                <span className="text-xs font-mono text-[#8a8d98] tracking-widest px-1">
                  0{currentIndex + 1} / 0{TESTIMONIALS.length}
                </span>

                <button
                  onClick={nextTestimonial}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-[#d4af37]/30 text-[#d4af37] hover:border-[#d4af37] hover:bg-[#d4af37]/10 flex items-center justify-center transition-all cursor-pointer"
                  aria-label="Next review"
                >
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Golden Auto-Play Progress Bar at Bottom of Card */}
          <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#d4af37]/15">
            <div
              className="h-full bg-gradient-to-r from-[#d4af37] via-[#f7ecd7] to-[#d4af37] transition-all duration-75"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Accreditations Strip */}
        <div className="mt-12 sm:mt-16 flex flex-wrap items-center justify-center gap-4 sm:gap-8 md:gap-14 opacity-60">
          <span className="font-cinzel text-[10px] sm:text-xs tracking-[0.25em] uppercase text-[#edebe6]">MICHELIN GUIDE 2024</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
          <span className="font-cinzel text-[10px] sm:text-xs tracking-[0.25em] uppercase text-[#edebe6]">GAULT &amp; MILLAU</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
          <span className="font-cinzel text-[10px] sm:text-xs tracking-[0.25em] uppercase text-[#edebe6]">WORLD&apos;S 50 BEST DISCOVERY</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
          <span className="font-cinzel text-[10px] sm:text-xs tracking-[0.25em] uppercase text-[#edebe6]">WINE SPECTATOR EXCELLENCE</span>
        </div>
      </div>
    </AnimatedSection>
  )
}


