import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { AnimatedSection } from './ui/AnimatedSection'
import { GoldDivider } from './ui/GoldDivider'
import { WhatsAppIcon } from './ui/WhatsAppIcon'
import { SITE_CONFIG } from '../config/site'
import { sanitizeInput, ActionRateLimiter } from '../utils/security'
import { buildResponsiveImageSrcSet } from '../utils/responsiveImage'
import {
  Calendar,
  Clock,
  Users,
  Sparkles,
  CheckCircle2,
  UtensilsCrossed,
  ShieldCheck,
  Check,
  QrCode,
  Award,
  Crown,
} from 'lucide-react'

// Rate limiter instance: 4 second cooldown between reservation clicks to prevent bot flooding
const reservationLimiter = new ActionRateLimiter('reservation_submit', 4000)

interface SalonSpace {
  id: string
  name: string
  shortName: string
  subtitle: string
  capacity: string
  icon: string
  badge: string
  perk: string
  image: string
}

const SALON_SPACES: SalonSpace[] = [
  {
    id: 'main-dining',
    name: 'Main Dining Hall (Candlelit)',
    shortName: 'Main Dining',
    subtitle: 'Vaulted ceilings & acoustic jazz',
    capacity: '2 – 6 Guests',
    icon: '🏛️',
    badge: 'Candlelit Intimacy',
    perk: 'Direct view of the grand architectural arches with live acoustic cello and jazz resonance.',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'chef-counter',
    name: 'Chef’s Counter (Open Pass Experience)',
    shortName: 'Chef’s Counter',
    subtitle: 'Front row to Binchotan flamecraft',
    capacity: '1 – 4 Guests',
    icon: '🔥',
    badge: 'Front Row Theater',
    perk: 'Direct interaction with Chef Julien Valmont & brigade over 1,000°C Kishu Binchotan charcoal.',
    image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'private-salon',
    name: 'The Imperial Private Salon',
    shortName: 'Imperial Salon',
    subtitle: 'Discreet royal dining sanctuary',
    capacity: '6 – 14 Guests',
    icon: '👑',
    badge: 'Royal Sanctuary',
    perk: 'Dedicated head wine steward, private entrance, and a custom tasting-menu pairing.',
    image: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'terrace',
    name: 'Romantic Terrace (Under Stars)',
    shortName: 'Starlight Terrace',
    subtitle: 'Heated open-air botanical veranda',
    capacity: '2 – 8 Guests',
    icon: '🌙',
    badge: 'Starlight Veranda',
    perk: 'Panoramic evening gardens, hearth heaters, and midnight sky views under glass pergolas.',
    image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=900&q=80',
  },
]

const TIME_SLOTS = [
  '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00'
]

const GUEST_OPTIONS = [
  '1 Guest', '2 Guests', '3 Guests', '4 Guests', '5 Guests', '6 Guests', '7–10 Guests (Salon)', '10+ Private Event'
]

const OCCASIONS = [
  'Intimate Dinner / Date Night',
  'Anniversary Celebration',
  'Birthday Gathering',
  'Corporate / Executive Dinner',
  'Chef\'s Tasting Journey',
]

export const Reservation: React.FC = () => {
  const [selectedSalonId, setSelectedSalonId] = useState<string>('main-dining')
  const formRef = useRef<HTMLDivElement>(null)

  const selectedSalon = SALON_SPACES.find((s) => s.id === selectedSalonId) || SALON_SPACES[0]

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: new Date().toISOString().split('T')[0],
    time: '20:00',
    guests: '2 Guests',
    seatingArea: 'Main Dining Hall (Candlelit)',
    occasion: 'Intimate Dinner / Date Night',
    specialNotes: '',
    honeypot: '', // Invisible anti-bot field
  })

  const [isBooked, setIsBooked] = useState(false)
  const [rateLimitError, setRateLimitError] = useState('')

  const handleSalonSelect = (salon: SalonSpace, autoScroll = false) => {
    setSelectedSalonId(salon.id)
    setFormData((prev) => ({ ...prev, seatingArea: salon.name }))

    if (autoScroll && typeof window !== 'undefined' && window.innerWidth < 1024) {
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }, 50)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleWhatsAppBooking = (e: React.FormEvent) => {
    e.preventDefault()

    // 1. Anti-Bot Honeypot
    if (formData.honeypot) {
      console.warn('Bot submission blocked via honeypot.')
      return
    }

    // 2. Client-side Rate Limiting
    if (!reservationLimiter.canProceed()) {
      const remaining = reservationLimiter.getRemainingSeconds()
      setRateLimitError(`Please wait ${remaining}s before submitting another request.`)
      return
    }
    setRateLimitError('')

    // 3. Strict Input Sanitization
    const sanitizedName = sanitizeInput(formData.name, 70)
    const sanitizedPhone = sanitizeInput(formData.phone, 25)
    const sanitizedNotes = sanitizeInput(formData.specialNotes, 300)
    const sanitizedDate = sanitizeInput(formData.date, 15)

    if (!sanitizedName || !sanitizedDate) {
      alert('Please fill in your name and preferred reservation date.')
      return
    }

    reservationLimiter.recordAction()

    // Celebratory Gold Confetti Explosion
    confetti({
      particleCount: 110,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#d4af37', '#f3d994', '#ffffff', '#caa065', '#b8860b'],
    })

    setIsBooked(true)

    // Build polite WhatsApp message with sanitized content
    const waText = `🍽️ *TABLE RESERVATION REQUEST — ${SITE_CONFIG.name}*
━━━━━━━━━━━━━━━━━━━━
👤 *Guest Name:* ${sanitizedName}
📱 *Phone:* ${sanitizedPhone || 'Provided via WhatsApp'}
📅 *Date:* ${sanitizedDate}
🕐 *Service Time:* ${formData.time}
👥 *Party Size:* ${formData.guests}
🏛️ *Selected Sanctuary:* ${formData.seatingArea}
🎉 *Occasion:* ${formData.occasion}
📝 *Special Dietary / Notes:* ${sanitizedNotes || 'None specified'}
━━━━━━━━━━━━━━━━━━━━
_Kindly confirm table availability and concierge reception details._`

    const waUrl = SITE_CONFIG.buildWhatsAppUrl(waText)

    setTimeout(() => {
      window.open(waUrl, '_blank', 'noopener,noreferrer')
    }, 700)
  }

  return (
    <AnimatedSection id="reservation" className="py-16 sm:py-24 md:py-32 bg-[#0c0e12] relative overflow-hidden">
      {/* Background Ambience Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#d4af37]/5 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14 md:mb-18">
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-tag flex items-center justify-center gap-2"
          >
            <Crown className="w-3.5 h-3.5 text-[#d4af37]" />
            Bespoke Hospitality &bull; Private Pass
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-bold text-[#edebe6] mt-2 mb-3 tracking-[0.14em] leading-tight"
          >
            Reserve Your Experience
          </motion.h2>
          <GoldDivider className="my-4 sm:my-5" />
          <p className="font-serif italic text-sm sm:text-base md:text-lg text-[#a5a8b5] font-light max-w-xl mx-auto leading-relaxed">
            Select your dining sanctuary. Your personalized VIP reservation pass will be created in real-time and confirmed directly via our private WhatsApp Concierge.
          </p>
        </div>

        {/* ── MOBILE 2x2 ATMOSPHERE SELECTOR (< lg) ── */}
        <div className="lg:hidden mb-6">
          <div className="flex items-center justify-between mb-2.5 px-1">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#caa065] font-semibold flex items-center gap-1.5">
              <UtensilsCrossed className="w-3.5 h-3.5 text-[#d4af37]" />
              Select Dining Atmosphere
            </span>
            <span className="text-[10px] text-[#8a8d98] font-mono">
              {SALON_SPACES.findIndex((s) => s.id === selectedSalonId) + 1} / {SALON_SPACES.length}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {SALON_SPACES.map((salon) => {
              const isSelected = salon.id === selectedSalonId
              return (
                <button
                  key={salon.id}
                  type="button"
                  onClick={() => handleSalonSelect(salon, true)}
                  className={`relative p-3 text-left transition-all duration-300 rounded-sm cursor-pointer border flex flex-col justify-between min-h-[76px] overflow-hidden ${
                    isSelected
                      ? 'bg-[#181b24] border-[#d4af37] shadow-[0_0_20px_rgba(212,175,55,0.3)] ring-1 ring-[#d4af37]'
                      : 'bg-[#111318]/80 border-[#d4af37]/20 hover:border-[#d4af37]/50 active:bg-[#151821]'
                  }`}
                  aria-pressed={isSelected}
                >
                  <div className="absolute inset-0 opacity-15 pointer-events-none">
                    <img
                      src={salon.image}
                      srcSet={buildResponsiveImageSrcSet(salon.image, [320, 480, 720])}
                      sizes="50vw"
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {isSelected && (
                    <motion.div
                      layoutId="mobileActiveSalonPill"
                      className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-[#d4af37] shadow-[0_0_10px_#d4af37]"
                      transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                    />
                  )}

                  <div className="flex items-center justify-between relative z-10 w-full">
                    <span className="text-base leading-none">{salon.icon}</span>
                    <span className="text-[9px] uppercase tracking-wider text-[#caa065] font-sans font-medium">
                      {salon.capacity}
                    </span>
                  </div>

                  <div className="mt-1 relative z-10">
                    <h4 className="font-cinzel text-xs font-semibold text-[#f5eedf] leading-tight truncate">
                      {salon.shortName}
                    </h4>
                    <span className="text-[9px] text-[#8a8d98] font-light block truncate">
                      {salon.subtitle}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Live Mobile Status Ribbon */}
          <motion.div
            key={`salon-ribbon-${selectedSalonId}`}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="mt-2.5 py-2 px-3 bg-[#181b24] border border-[#d4af37]/35 rounded-sm flex items-center justify-between"
          >
            <div className="flex items-center gap-2 text-xs text-[#d4af37] min-w-0">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
              <span className="font-medium truncate">
                Sanctuary: <strong className="text-[#f7ecd7] font-semibold">{selectedSalon.name}</strong>
              </span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-[#8a8d98] font-sans shrink-0 ml-2">
              <span>Pass Below</span>
              <span className="text-[#d4af37]">&darr;</span>
            </div>
          </motion.div>
        </div>

        {/* ── DESKTOP 4-COLUMN CARDS WITH AMBIENT 3D HOVER (hidden on mobile, visible on lg+) ── */}
        <div className="hidden lg:block mb-12">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs uppercase tracking-[0.25em] text-[#d4af37] font-semibold flex items-center gap-2">
              <UtensilsCrossed className="w-4 h-4" /> Select Your Dining Atmosphere
            </span>
            <span className="text-xs text-[#8a8d98] font-mono">
              4 Distinct Sanctuaries &bull; Click to switch
            </span>
          </div>

          <div className="grid grid-cols-4 gap-4">
            {SALON_SPACES.map((salon) => {
              const isSelected = salon.id === selectedSalonId
              return (
                <motion.div
                  key={salon.id}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  onClick={() => handleSalonSelect(salon, false)}
                  className={`group relative overflow-hidden rounded-sm cursor-pointer border transition-all duration-300 flex flex-col justify-between ${
                    isSelected
                      ? 'border-[#d4af37] ring-1 ring-[#d4af37] shadow-[0_12px_35px_rgba(212,175,55,0.35)] bg-[#181b24]'
                      : 'border-[#d4af37]/25 hover:border-[#d4af37]/60 bg-[#111318]/80 hover:bg-[#151821]'
                  }`}
                >
                  {/* Top Ambient Badge & Image */}
                  <div className="relative h-40 w-full overflow-hidden bg-black">
                    <img
                      src={salon.image}
                      srcSet={buildResponsiveImageSrcSet(salon.image)}
                      sizes="25vw"
                      alt={salon.name}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111318] via-transparent to-black/30 opacity-80" />

                    <div className="absolute top-2.5 right-2.5 bg-[#08090b]/85 backdrop-blur-md px-2.5 py-0.5 border border-[#d4af37]/40 text-[9px] uppercase tracking-wider text-[#d4af37] font-sans font-semibold">
                      {salon.capacity}
                    </div>

                    <div className="absolute bottom-2.5 left-2.5 bg-[#d4af37]/90 text-[#08090b] text-[9px] uppercase tracking-wider font-bold px-2 py-0.5">
                      {salon.badge}
                    </div>

                    {isSelected && (
                      <motion.div
                        layoutId="activeSalonGlowBadge"
                        className="absolute top-2.5 left-2.5 w-6 h-6 rounded-full bg-[#d4af37] text-[#08090b] flex items-center justify-center shadow-lg"
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </motion.div>
                    )}
                  </div>

                  {/* Card Body */}
                  <div className="p-4 flex flex-col justify-between flex-grow">
                    <div>
                      <h4 className="font-cinzel text-sm font-semibold text-[#f5eedf] leading-snug group-hover:text-[#d4af37] transition-colors">
                        {salon.name}
                      </h4>
                      <p className="text-[11px] text-[#caa065] font-serif italic mt-1">
                        {salon.subtitle}
                      </p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-white/5 text-[10px] text-[#8a8d98] line-clamp-2 leading-relaxed">
                      {salon.perk}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* ── 12-COLUMN MAIN BOOKING EXPERIENCE: FORM + LIVE VIP PASS PREVIEW ── */}
        <div ref={formRef} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Form Column (7 Cols on desktop) */}
          <div className="lg:col-span-7 bg-[#111318]/95 border border-[#d4af37]/30 shadow-[0_25px_60px_rgba(0,0,0,0.85)] p-5 sm:p-8 backdrop-blur-xl relative rounded-sm">
            {/* Corner Gold Trim Accents */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#d4af37]" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#d4af37]" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#d4af37]" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#d4af37]" />

            {isBooked ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-10 text-center flex flex-col items-center px-2"
              >
                <div className="w-16 h-16 rounded-full bg-[#d4af37]/15 border-2 border-[#d4af37] flex items-center justify-center text-[#d4af37] mb-5 shadow-[0_0_25px_rgba(212,175,55,0.4)]">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#f7ecd7]">
                  VIP Reservation Prepared
                </h3>
                <p className="font-serif italic text-base sm:text-lg text-[#d4af37] mt-1.5">
                  Connecting directly with the {SITE_CONFIG.name} reservation host on WhatsApp...
                </p>
                <p className="text-xs text-[#8a8d98] max-w-md mt-3 font-sans leading-relaxed">
                  Your personalized table reservation has been generated with verified concierge credentials.
                </p>

                <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3 w-full sm:w-auto">
                  <a
                    href={SITE_CONFIG.buildWhatsAppUrl(
                      `Hello ${SITE_CONFIG.name}, my name is ${sanitizeInput(formData.name, 70)}. I would like to confirm my VIP Table Reservation at "${formData.seatingArea}" for ${formData.guests} on ${formData.date} at ${formData.time}.`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto bg-[#25D366] hover:bg-[#1ebc59] text-black font-sans uppercase text-xs tracking-widest font-semibold px-8 py-3.5 flex items-center justify-center gap-2 transition-all shadow-lg rounded-sm"
                  >
                    <WhatsAppIcon className="w-4 h-4 text-white" />
                    Open WhatsApp Concierge
                  </a>
                  <button
                    onClick={() => setIsBooked(false)}
                    className="w-full sm:w-auto border border-[#d4af37]/40 text-[#edebe6] hover:text-[#d4af37] text-xs uppercase tracking-widest px-6 py-3.5 cursor-pointer rounded-sm"
                  >
                    Edit Reservation
                  </button>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleWhatsAppBooking} className="space-y-5">
                {/* Invisible Honeypot field */}
                <input
                  type="text"
                  name="honeypot"
                  value={formData.honeypot}
                  onChange={handleInputChange}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="hidden opacity-0 absolute -left-[9999px] -top-[9999px] pointer-events-none"
                />

                {rateLimitError && (
                  <div className="p-3 bg-red-950/60 border border-red-500/40 text-red-200 text-xs text-center font-sans tracking-wide">
                    {rateLimitError}
                  </div>
                )}

                {/* Form Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#d4af37]/20 gap-2">
                  <div className="text-xs uppercase tracking-[0.25em] text-[#d4af37] font-semibold flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> Guest Details &amp; Schedule
                  </div>
                  <div className="text-[11px] text-[#f7ecd7] bg-[#181b24] px-2.5 py-1 border border-[#d4af37]/35 rounded-sm flex items-center gap-1.5 self-start sm:self-auto font-sans">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-pulse" />
                    <span className="text-[#8a8d98]">Selected:</span>
                    <span className="font-semibold text-[#f5eedf] truncate max-w-[190px] sm:max-w-none">{formData.seatingArea}</span>
                  </div>
                </div>

                {/* Row 1: Name and Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-[0.2em] text-[#d4af37] font-sans font-medium mb-1.5">
                      Guest Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Lord Vikram Singhania"
                      className="w-full bg-[#181b23] border border-[#d4af37]/25 focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] text-[#f5eedf] text-sm px-3.5 py-3 focus:outline-none transition-all placeholder:text-gray-600 rounded-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-[0.2em] text-[#d4af37] font-sans font-medium mb-1.5">
                      Contact Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+91 98765 00000"
                      className="w-full bg-[#181b23] border border-[#d4af37]/25 focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] text-[#f5eedf] text-sm px-3.5 py-3 focus:outline-none transition-all placeholder:text-gray-600 rounded-sm"
                    />
                  </div>
                </div>

                {/* Row 2: Date & Party Size */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-[0.2em] text-[#d4af37] font-sans font-medium mb-1.5 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" /> Preferred Date *
                    </label>
                    <input
                      type="date"
                      name="date"
                      required
                      value={formData.date}
                      onChange={handleInputChange}
                      className="w-full bg-[#181b23] border border-[#d4af37]/25 focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] text-[#f5eedf] text-sm px-3.5 py-3 focus:outline-none transition-all scheme-dark rounded-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-[0.2em] text-[#d4af37] font-sans font-medium mb-1.5 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5" /> Party Size
                    </label>
                    <select
                      name="guests"
                      value={formData.guests}
                      onChange={handleInputChange}
                      className="w-full bg-[#181b23] border border-[#d4af37]/25 focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] text-[#f5eedf] text-sm px-3.5 py-3 focus:outline-none transition-all rounded-sm cursor-pointer"
                    >
                      {GUEST_OPTIONS.map((opt) => (
                        <option key={opt} value={opt} className="bg-[#111318]">
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Interactive Clickable Seating Time Pills */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-[11px] uppercase tracking-[0.2em] text-[#d4af37] font-sans font-medium flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" /> Seating Time Slot
                    </label>
                    <span className="text-[10px] text-[#caa065] font-mono">
                      Selected: {formData.time}
                    </span>
                  </div>

                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                    {TIME_SLOTS.map((slot) => {
                      const isSelected = formData.time === slot
                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, time: slot }))}
                          className={`time-slot-btn py-2 px-1 text-center rounded-sm text-xs font-mono transition-all duration-200 cursor-pointer border ${
                            isSelected
                              ? 'bg-[#d4af37] text-[#08090b] font-bold border-[#d4af37] shadow-[0_0_12px_rgba(212,175,55,0.4)] is-selected'
                              : 'bg-[#181b24] border-[#d4af37]/25 text-[#f5eedf] hover:border-[#d4af37]/60 hover:bg-[#1e2330]'
                          }`}
                        >
                          {slot}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Dining Occasion */}
                <div>
                  <label className="block text-[11px] uppercase tracking-[0.2em] text-[#d4af37] font-sans font-medium mb-1.5 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Dining Occasion
                  </label>
                  <select
                    name="occasion"
                    value={formData.occasion}
                    onChange={handleInputChange}
                    className="w-full bg-[#181b23] border border-[#d4af37]/25 focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] text-[#f5eedf] text-sm px-3.5 py-3 focus:outline-none transition-all rounded-sm cursor-pointer"
                  >
                    {OCCASIONS.map((occ) => (
                      <option key={occ} value={occ} className="bg-[#111318]">
                        {occ}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Special Dietary / Notes */}
                <div>
                  <label className="block text-[11px] uppercase tracking-[0.2em] text-[#d4af37] font-sans font-medium mb-1.5">
                    Dietary Preferences / Special Requests
                  </label>
                  <textarea
                    name="specialNotes"
                    rows={2}
                    value={formData.specialNotes}
                    onChange={handleInputChange}
                    placeholder="e.g. Shellfish allergy, preferred vintage champagne on arrival, quiet corner table..."
                    className="w-full bg-[#181b23] border border-[#d4af37]/25 focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] text-[#f5eedf] text-sm p-3 focus:outline-none transition-all placeholder:text-gray-600 rounded-sm"
                  />
                </div>

                {/* Submit CTA */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-[11px] text-[#8a8d98] font-sans self-start sm:self-auto">
                    <ShieldCheck className="w-4 h-4 text-[#d4af37] shrink-0" />
                    <span>Instant VIP Confirmation via WhatsApp</span>
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto bg-[#25D366] hover:bg-[#1ebc59] active:bg-[#189b47] text-black font-sans uppercase text-xs tracking-widest font-semibold px-8 py-3.5 flex items-center justify-center gap-2.5 transition-all shadow-[0_4px_24px_rgba(37,211,102,0.35)] hover:shadow-[0_6px_30px_rgba(37,211,102,0.5)] cursor-pointer rounded-sm"
                  >
                    <WhatsAppIcon className="w-4 h-4 text-black shrink-0" />
                    <span>Confirm &amp; Reserve on WhatsApp</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Right Column: Live Holographic VIP Reservation Pass (5 Cols on desktop) */}
          <div className="lg:col-span-5 w-full">
            <div className="sticky top-28">
              <div className="vip-pass-card relative bg-gradient-to-b from-[#181b24] via-[#12151b] to-[#0c0e12] border-2 border-[#d4af37]/45 rounded-sm p-5 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.85)] overflow-hidden transition-all duration-500">
                {/* Ambient Golden Sheen Overlay */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#d4af37]/15 rounded-full blur-[60px] pointer-events-none" />

                {/* Top Pass Header */}
                <div className="flex items-center justify-between pb-3.5 border-b border-[#d4af37]/30">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-[#d4af37]" />
                    <span className="font-cinzel text-xs uppercase tracking-[0.22em] text-[#d4af37] font-bold">
                      {SITE_CONFIG.name} VIP PASS
                    </span>
                  </div>
                  <span className="text-[9px] font-mono uppercase tracking-widest text-[#caa065] bg-[#d4af37]/10 px-2 py-0.5 border border-[#d4af37]/30">
                    Priority Hold
                  </span>
                </div>

                {/* Salon Thumbnail Banner */}
                <div className="relative h-28 my-3.5 rounded-sm overflow-hidden border border-[#d4af37]/30 group">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={selectedSalon.image}
                      src={selectedSalon.image}
                      srcSet={buildResponsiveImageSrcSet(selectedSalon.image, [320, 480, 720])}
                      sizes="(max-width: 1023px) calc(100vw - 4rem), 420px"
                      alt={selectedSalon.name}
                      loading="lazy"
                      decoding="async"
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      className="w-full h-full object-cover"
                    />
                  </AnimatePresence>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#08090b] via-transparent to-black/20" />
                  <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-[#f7ecd7]">
                    <span className="font-cinzel text-xs font-semibold truncate">
                      {selectedSalon.name}
                    </span>
                    <span className="text-[10px] text-[#d4af37] shrink-0 font-sans font-medium">
                      {selectedSalon.capacity}
                    </span>
                  </div>
                </div>

                {/* Real-time Ticket Details */}
                <div className="space-y-2.5 text-xs font-sans">
                  <div className="flex justify-between items-baseline border-b border-white/5 pb-2">
                    <span className="vip-label text-[#8a8d98] uppercase text-[10px] tracking-wider">Guest Name:</span>
                    <span className="vip-guest-name font-cinzel font-semibold text-[#f7ecd7] text-right truncate max-w-[190px]">
                      {formData.name.trim() || 'Honored Guest'}
                    </span>
                  </div>

                  <div className="flex justify-between items-baseline border-b border-white/5 pb-2">
                    <span className="vip-label text-[#8a8d98] uppercase text-[10px] tracking-wider">Date &amp; Service:</span>
                    <span className="vip-service-time font-mono text-[#d4af37] font-medium text-right">
                      {formData.date || 'Today'} &bull; {formData.time} Service
                    </span>
                  </div>

                  <div className="flex justify-between items-baseline border-b border-white/5 pb-2">
                    <span className="vip-label text-[#8a8d98] uppercase text-[10px] tracking-wider">Party Size:</span>
                    <span className="vip-party-size text-[#f7ecd7] font-medium text-right">
                      {formData.guests}
                    </span>
                  </div>

                  <div className="flex justify-between items-baseline border-b border-white/5 pb-2">
                    <span className="vip-label text-[#8a8d98] uppercase text-[10px] tracking-wider">Occasion:</span>
                    <span className="vip-occasion text-[#caa065] text-right truncate max-w-[190px] font-serif italic">
                      {formData.occasion}
                    </span>
                  </div>
                </div>

                {/* Bottom Pass Barcode & Security Hologram */}
                <div className="mt-4 pt-3 border-t border-[#d4af37]/25 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <QrCode className="vip-qr w-8 h-8 text-[#d4af37]/80" />
                    <div>
                      <div className="vip-barcode-code font-mono text-[9px] uppercase tracking-wider text-[#d4af37]">
                        PASS: CP-VIP-{selectedSalon.id.slice(0, 4).toUpperCase()}
                      </div>
                      <div className="vip-barcode-sub text-[8px] text-[#8a8d98]">
                        Encrypted Concierge Dispatch
                      </div>
                    </div>
                  </div>

                  <div className="vip-badge-hologram w-8 h-8 rounded-full border border-[#d4af37]/40 bg-[#d4af37]/10 flex items-center justify-center text-[#d4af37]">
                    <Sparkles className="w-4 h-4 animate-spin-slow" />
                  </div>
                </div>
              </div>

              {/* Concierge Assurance Micro-Note */}
              <div className="mt-3 text-center">
                <span className="text-[10px] text-[#8a8d98] font-sans flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#d4af37]" />
                  Zero booking fees &bull; 100% WhatsApp Verified Confirmation
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  )
}

