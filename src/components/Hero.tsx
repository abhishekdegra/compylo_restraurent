import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronDown, Sparkles, MessageCircle, ArrowRight } from 'lucide-react'
import { MagneticButton } from './ui/MagneticButton'

export const Hero: React.FC = () => {
  return (
    <section id="hero" className="hero-section relative w-full min-h-screen lg:h-screen flex flex-col justify-between items-center overflow-hidden bg-[#08090b] pt-20 sm:pt-28 pb-5 sm:pb-8">
      {/* Background Hero Image with Slow Parallax/Zoom & Multi-layered Vignette */}
      <div className="absolute inset-0 z-0">
        <motion.img
          src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1600&q=80"
          srcSet="https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=640&q=80 640w, https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=960&q=80 960w, https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1280&q=80 1280w, https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1600&q=80 1600w"
          sizes="100vw"
          alt=""
          aria-hidden="true"
          fetchPriority="high"
          decoding="async"
          initial={{ scale: 1.06 }}
          animate={{ scale: 1 }}
          transition={{ duration: 6, ease: 'easeOut' }}
          className="hero-background-image w-full h-full object-cover object-center gpu-layer will-change-transform"
        />
        {/* Cinematic Vignette Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#08090b] via-[#08090b]/75 to-[#08090b]/60 hero-bottom-vignette transition-all duration-700" />
        <div className="absolute inset-0 bg-radial from-transparent via-[#08090b]/40 to-[#08090b]/90 hero-radial-vignette transition-all duration-700" />
      </div>

      {/* Hero Ambient Gold Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-[#d4af37]/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Middle Content Container — Centered within Viewport */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 text-center flex-1 flex flex-col justify-center items-center my-auto hero-content">
        {/* Luxury Badge */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="hero-badge inline-flex max-w-full items-center gap-1.5 px-3 sm:px-4 py-1 border border-[#d4af37]/40 rounded-full bg-[#12151b]/80 backdrop-blur-md mb-2 sm:mb-4 shadow-[0_0_20px_rgba(212,175,55,0.18)]"
        >
          <Sparkles className="w-3 h-3 text-[#d4af37]" />
          <span className="text-[9px] sm:text-[10px] md:text-xs font-sans tracking-[0.16em] sm:tracking-[0.28em] uppercase text-[#f7ecd7] font-medium hero-badge-text leading-relaxed">
            Artisanal Fine Dining
          </span>
        </motion.div>

        {/* Main Title — Scaled to fit screens without horizontal overflow */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.92, filter: 'blur(10px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="font-cinzel text-[2.15rem] sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-extrabold tracking-[0.1em] sm:tracking-[0.18em] hero-title-gradient drop-shadow-[0_10px_35px_rgba(0,0,0,0.6)] my-2 sm:my-3 leading-none"
        >
          COMPYLO
        </motion.h1>

        {/* Elegant Gold Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.7, delay: 0.55 }}
          className="w-20 md:w-32 h-[1.5px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent my-2 sm:my-3"
        />

        {/* Subtitle / Poetic Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.65 }}
          className="hero-subtitle font-serif italic text-sm sm:text-lg md:text-xl lg:text-2xl text-[#f7ecd7] font-medium w-full max-w-xs sm:max-w-2xl leading-relaxed mb-5 sm:mb-8 drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]"
        >
          Where culinary craft meets timeless intimacy. An unforgettable journey of flavor, heritage, and modern fine dining.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full max-w-sm sm:max-w-none sm:w-auto"
        >
          <Link to="/reservation" className="w-full sm:w-auto">
            <MagneticButton
              variant="gold"
              className="w-full sm:w-auto py-3.5 px-8 text-[11px]"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#08090b]" />
              Reserve a Table
            </MagneticButton>
          </Link>

          <Link to="/menu" className="w-full sm:w-auto">
            <MagneticButton
              variant="outline"
              className="w-full sm:w-auto py-3.5 px-8 text-[11px]"
            >
              Explore Curated Menu
              <ArrowRight className="w-3.5 h-3.5 text-[#d4af37]" />
            </MagneticButton>
          </Link>
        </motion.div>
      </div>

      {/* Bottom Metrics Bar & Chevron — Gracefully Fits Inside 100vh */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 mt-3 sm:mt-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 1 }}
          className="hero-metrics-bar grid grid-cols-[repeat(2,minmax(0,1fr))] md:grid-cols-4 gap-2 sm:gap-6 py-3 px-3 sm:px-8 rounded-2xl sm:rounded-full border border-[#d4af37]/30 bg-[#08090b]/80 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.5)] text-center w-full mx-auto transition-all duration-400"
        >
          <div className="min-w-0">
            <div className="hero-metric-val font-serif text-base sm:text-2xl text-[#f7ecd7]">A5 Wagyu</div>
            <div className="hero-metric-label text-[8px] sm:text-[9px] uppercase tracking-[0.12em] sm:tracking-[0.2em] leading-tight text-[#8a8d98] mt-0.5">Miyazaki Certified</div>
          </div>
          <div className="min-w-0">
            <div className="hero-metric-val font-serif text-base sm:text-2xl text-[#f7ecd7]">450+</div>
            <div className="hero-metric-label text-[8px] sm:text-[9px] uppercase tracking-[0.12em] sm:tracking-[0.2em] leading-tight text-[#8a8d98] mt-0.5">Vintage Wine Cellar</div>
          </div>
          <div className="min-w-0">
            <div className="hero-metric-val font-serif text-base sm:text-2xl text-[#f7ecd7]">7-Course</div>
            <div className="hero-metric-label text-[8px] sm:text-[9px] uppercase tracking-[0.12em] sm:tracking-[0.2em] leading-tight text-[#8a8d98] mt-0.5">Chef's Tasting Menu</div>
          </div>
          <div className="min-w-0">
            <div className="hero-metric-val font-serif text-base sm:text-2xl text-[#f7ecd7]">100%</div>
            <div className="hero-metric-label text-[8px] sm:text-[9px] uppercase tracking-[0.12em] sm:tracking-[0.2em] leading-tight text-[#8a8d98] mt-0.5">Personal Hospitality</div>
          </div>
        </motion.div>

        {/* Subtle Scroll Hint */}
        <div className="text-center mt-3">
          <ChevronDown className="w-4 h-4 text-[#d4af37]/60 mx-auto animate-bounce" />
        </div>
      </div>
    </section>
  )
}
