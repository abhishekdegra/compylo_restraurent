import { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import palaceGates from '../assets/palace-gates.webp'
import palaceBird from '../assets/palace-bird-single.webp'
import palaceBirdMid from '../assets/palace-bird-mid.webp'
import palaceBirdDown from '../assets/palace-bird-down.webp'
import palaceFacade from '../assets/palace-facade.webp'

interface LoaderProps {
  onComplete: () => void
}

const BIRD_FLOCK = [
  { y: 12, scale: 1.05, delay: 0.00, duration: 1.72, reverse: false, rotate: -8 },
  { y: 28, scale: 0.82, delay: 0.09, duration: 1.78, reverse: true, rotate: 7 },
  { y: 43, scale: 0.94, delay: 0.18, duration: 1.74, reverse: false, rotate: -3 },
  { y: 57, scale: 0.72, delay: 0.27, duration: 1.82, reverse: true, rotate: 10 },
  { y: 20, scale: 0.64, delay: 0.36, duration: 1.68, reverse: false, rotate: -12 },
  { y: 36, scale: 0.78, delay: 0.44, duration: 1.72, reverse: true, rotate: 4 },
] as const

function Bird({ y, scale, delay, duration, reverse, rotate }: (typeof BIRD_FLOCK)[number]) {
  const from = reverse ? '51vw' : '49vw'
  const to = reverse ? '-50vw' : '96vw'

  return (
    <motion.div
      aria-hidden="true"
      className="absolute left-0 top-0 w-[270px] sm:w-[360px] md:w-[440px] will-change-transform"
      style={{ top: `${y}%` }}
      initial={{ x: from, y: 28, opacity: 0, scale: scale * 0.54 }}
      animate={{ x: to, y: [28, -18, -52], opacity: [0, 1, 1, 0], scale: [scale * 0.54, scale * 0.88, scale] }}
      transition={{
        x: { duration, delay, ease: [0.22, 0.8, 0.32, 1] },
        y: { duration, delay, ease: [0.2, 0.72, 0.28, 1] },
        scale: { duration: duration * 0.84, delay, ease: 'easeOut' },
        opacity: { duration, delay, times: [0, 0.1, 0.86, 1] },
      }}
    >
      <motion.div
        className="intro-bird-body w-full"
        animate={{ y: [0, -6, -1, 4, 0], rotate: [-1, -2, 0, 1, -1] }}
        transition={{ duration: 0.48, repeat: Infinity, ease: 'easeInOut', delay: -delay }}
      >
        <div
          className="intro-bird-sprite relative w-full"
          style={{ transform: `scaleX(${reverse ? -1 : 1}) rotate(${rotate}deg)` }}
        >
          <img
            src={palaceBird}
            alt=""
            className="intro-real-bird intro-bird-wing intro-bird-wing-up"
            style={{ animationDelay: `${-delay}s` }}
            draggable={false}
          />
          <img
            src={palaceBirdMid}
            alt=""
            className="intro-real-bird intro-bird-wing intro-bird-wing-mid"
            style={{ animationDelay: `${-delay}s` }}
            draggable={false}
          />
          <img
            src={palaceBirdDown}
            alt=""
            className="intro-real-bird intro-bird-wing intro-bird-wing-down"
            style={{ animationDelay: `${-delay}s` }}
            draggable={false}
          />
        </div>
      </motion.div>
    </motion.div>
  )
}

function GatePanel({ side, isOpen }: { side: 'left' | 'right'; isOpen: boolean }) {
  const isLeft = side === 'left'

  return (
    <motion.div
      className={`intro-gate-panel ${isLeft ? 'intro-gate-left' : 'intro-gate-right'}`}
      initial={{ rotateY: 0 }}
      animate={{ rotateY: isOpen ? (isLeft ? -108 : 108) : 0 }}
      transition={{ duration: 1.15, ease: [0.68, 0, 0.22, 1] }}
    >
      <img
        src={palaceGates}
        alt=""
        className={`intro-gate-photo ${isLeft ? 'intro-gate-photo-left' : 'intro-gate-photo-right'}`}
        draggable={false}
      />
      <div className="intro-gate-sheen" />
    </motion.div>
  )
}

export const Loader = ({ onComplete }: LoaderProps) => {
  const [isExiting, setIsExiting] = useState(false)
  const [showForeground, setShowForeground] = useState(true)
  const [gatesOpen, setGatesOpen] = useState(false)
  const completedRef = useRef(false)

  const finishIntro = useCallback((fast = false) => {
    if (completedRef.current) return
    completedRef.current = true
    setIsExiting(true)
    window.setTimeout(onComplete, fast ? 220 : 460)
  }, [onComplete])

  useEffect(() => {
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const foregroundTimer = window.setTimeout(() => setShowForeground(false), reducedMotion ? 240 : 1_500)
    const gateTimer = window.setTimeout(() => setGatesOpen(true), reducedMotion ? 300 : 1_650)
    const finishTimer = window.setTimeout(() => finishIntro(false), reducedMotion ? 640 : 4_120)

    return () => {
      window.clearTimeout(foregroundTimer)
      window.clearTimeout(gateTimer)
      window.clearTimeout(finishTimer)
      document.body.style.overflow = originalOverflow
    }
  }, [finishIntro])

  return (
    <motion.div
      role="status"
      aria-label="Entering Compylo"
      initial={{ opacity: 1 }}
      animate={{ opacity: isExiting ? 0 : 1 }}
      transition={{ duration: isExiting ? 0.55 : 0 }}
      className="intro-loader fixed inset-0 z-[100] overflow-hidden select-none"
    >
      <motion.div
        className="absolute inset-0 z-0 bg-[#050608]"
        initial={{ opacity: 1 }}
        animate={{ opacity: gatesOpen ? 0 : 1 }}
        transition={{ duration: 1.25, ease: 'easeInOut' }}
      />

      <div className="intro-gate-stage absolute inset-0 z-10">
        <motion.img
          src={palaceFacade}
          alt=""
          aria-hidden="true"
          className="intro-palace-facade absolute inset-0 h-full w-full object-cover pointer-events-none"
          initial={{ opacity: 1, scale: 1.025 }}
          animate={{ opacity: gatesOpen ? 0 : 1, scale: gatesOpen ? 1.055 : 1.025 }}
          transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
          draggable={false}
        />
        <GatePanel side="left" isOpen={gatesOpen} />
        <GatePanel side="right" isOpen={gatesOpen} />
        <motion.div
          className="intro-gate-seam absolute left-1/2 top-0 h-full w-px -translate-x-1/2"
          initial={{ opacity: 0.2, scaleY: 0 }}
          animate={{ opacity: gatesOpen ? 0 : 0.85, scaleY: gatesOpen ? 1 : 0.82 }}
          transition={{ duration: gatesOpen ? 0.45 : 1.35, ease: 'easeOut' }}
        />
      </div>

      <motion.div
        className="intro-bird-flock absolute inset-0 z-[70] pointer-events-none"
        initial={{ opacity: 1 }}
        animate={{ opacity: gatesOpen ? 1 : 0 }}
        transition={{ duration: 0.18 }}
      >
        {gatesOpen && BIRD_FLOCK.map((bird, index) => (
          <Bird key={`${bird.reverse}-${bird.y}-${index}`} {...bird} />
        ))}
      </motion.div>

      <motion.div
        className="intro-brand-reveal absolute inset-0 z-[80] flex flex-col items-center justify-center px-6 text-center pointer-events-none"
        initial={{ opacity: 1 }}
        animate={{ opacity: showForeground ? 1 : 0 }}
        transition={{ duration: 0.52, ease: 'easeInOut' }}
      >
        <motion.p
          initial={{ opacity: 0, y: 10, letterSpacing: '0.32em' }}
          animate={{ opacity: 1, y: 0, letterSpacing: '0.48em' }}
          transition={{ delay: 0.18, duration: 0.62, ease: [0.16, 1, 0.3, 1] }}
          className="mb-5 text-[8px] sm:text-[10px] uppercase text-[#d8bc6b] font-sans"
        >
          An Epicurean Sanctuary
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.58, rotate: -18 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ delay: 0.25, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="intro-crest relative mb-6 flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full"
        >
          <span className="font-cinzel text-3xl sm:text-4xl font-semibold text-gold-gradient">C</span>
        </motion.div>

        <div className="overflow-hidden pb-2">
          <motion.h2
            initial={{ y: '110%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.45, duration: 0.62, ease: [0.16, 1, 0.3, 1] }}
            className="font-cinzel text-3xl sm:text-5xl md:text-6xl font-bold tracking-[0.28em] text-[#f8f1df] translate-x-[0.14em]"
          >
            COMPYLO
          </motion.h2>
        </div>

        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 0.68, duration: 0.6, ease: 'easeOut' }}
          className="my-4 h-px w-32 sm:w-48 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent"
        />

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.78, duration: 0.5 }}
          className="font-serif italic text-sm sm:text-base text-[#c9c1af]"
        >
          The sanctuary awaits
        </motion.p>
      </motion.div>

      <motion.div
        className="intro-vignette absolute inset-0 z-[60] pointer-events-none"
        animate={{ opacity: gatesOpen ? 0 : 1 }}
        transition={{ duration: 0.9 }}
      />

      <motion.button
        type="button"
        onClick={() => finishIntro(true)}
        initial={{ opacity: 0 }}
        animate={{ opacity: isExiting ? 0 : 0.72 }}
        transition={{ delay: 0.9, duration: 0.5 }}
        className="absolute bottom-5 right-5 z-[90] border-b border-[#d4af37]/60 pb-1 text-[9px] uppercase tracking-[0.24em] text-[#ead8a3] hover:opacity-100 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-[#d4af37] cursor-pointer"
        aria-label="Skip opening animation"
      >
        Skip intro
      </motion.button>
    </motion.div>
  )
}
