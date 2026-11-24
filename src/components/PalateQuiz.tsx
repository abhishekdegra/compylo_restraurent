import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AnimatedSection } from './ui/AnimatedSection'
import { GoldDivider } from './ui/GoldDivider'
import { Flame, Waves, Sprout, Sparkles, Wine, ChevronRight, ChevronLeft } from 'lucide-react'
import { WhatsAppIcon } from './ui/WhatsAppIcon'
import { SITE_CONFIG } from '../config/site'
import { ActionRateLimiter } from '../utils/security'
import { buildResponsiveImageSrcSet } from '../utils/responsiveImage'

const palateLimiter = new ActionRateLimiter('palate_booking', 3000)

interface PalateOption {
  id: string
  mood: string
  shortMood: string
  tagline: string
  icon: React.ComponentType<{ className?: string }>
  starter: { name: string; subtitle: string; note: string }
  main: { name: string; subtitle: string; note: string }
  dessert: { name: string; subtitle: string; note: string }
  sommelierPairing: { name: string; vintage: string; note: string }
  profile: string
  shortProfile: string
  image: string
}

const PALATE_PRESETS: PalateOption[] = [
  {
    id: 'smoky-bold',
    mood: 'Smoky, Bold & Carnivorous',
    shortMood: 'Smoky & Bold',
    tagline: 'Intense woodfire caramelization, aged bone marrow richness, and peaty single malt notes.',
    icon: Flame,
    starter: {
      name: 'Pan-Seared Hudson Valley Duck Liver',
      subtitle: 'Caramelized Figs & Spiced Brioche',
      note: 'Pan-seared duck liver, caramelized fig compote & spiced brioche',
    },
    main: {
      name: 'A5 Miyazaki Wagyu Tenderloin',
      subtitle: 'Binchotan Charcoal & Bone Marrow Sauce',
      note: 'Charred over 1,000°C Kishu Binchotan with bone marrow bordelaise',
    },
    dessert: {
      name: 'Valrhona Noir 72% Gold Sphere',
      subtitle: 'Flame-Finished Chocolate & Salted Caramel',
      note: 'Tableside hot smoked bourbon salted caramel cascade',
    },
    sommelierPairing: {
      name: 'Chateau Margaux Grand Cru & Old Fashioned',
      vintage: '2015 Reserve & 18-Year Single Malt',
      note: 'Tannic structure cutting through rich wagyu intramuscular marbling',
    },
    profile: 'Deep Umami & Roasted Oak',
    shortProfile: 'Deep Umami',
    image: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'coastal-delicate',
    mood: 'Delicate, Coastal & Citrus',
    shortMood: 'Coastal & Fresh',
    tagline: 'Pristine ocean sweetness, yuzu acidity, and Grand Cru champagne effervescence.',
    icon: Waves,
    starter: {
      name: 'Wild Hokkaido Scallop Carpaccio',
      subtitle: 'Yuzu, Finger Lime & Gold Leaf',
      note: 'Finger lime pearls, cold-pressed yuzu emulsion & 24k gold leaf',
    },
    main: {
      name: 'Saffron-Poached Chilean Sea Bass',
      subtitle: 'Saffron Broth, Fennel & Sea Grapes',
      note: 'Saffron shellfish fumet, baby fennel confit & sea grapes',
    },
    dessert: {
      name: 'Yuzu Meyer Lemon Crisp Tartlet',
      subtitle: 'Torched Meringue & Candied Citrus',
      note: 'Torched Italian meringue with Japanese candied citrus zest',
    },
    sommelierPairing: {
      name: 'Dom Perignon Vintage & Smoked Champagne Cocktail',
      vintage: '2013 Brut Champagne',
      note: 'Crisp minerality and toasted brioche notes enhancing delicate ocean sweetness',
    },
    profile: 'Crisp Salinity & Vibrant Citrus',
    shortProfile: 'Crisp Seafood',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'botanical-earth',
    mood: 'Botanical, Earth & Foraged',
    shortMood: 'Botanical Earth',
    tagline: 'High-altitude mountain truffles, aged carnaroli grains, and biodynamic terroir.',
    icon: Sprout,
    starter: {
      name: 'Puglia Artisanal Burrata & Black Truffle',
      subtitle: 'Black Truffle & 25-Year-Aged Balsamic',
      note: '25-year Modena balsamic, shaved black truffles & micro basil',
    },
    main: {
      name: 'Acquerello Carnaroli Black Truffle Risotto',
      subtitle: 'Black Truffle & 36-Month-Aged Parmesan',
      note: 'Slow-cooked in vegetable court bouillon with 36-month Reggiano',
    },
    dessert: {
      name: 'Madagascar Vanilla Layered Pastry',
      subtitle: 'Caramelized Pastry & Raspberry',
      note: 'Inverted caramelized puff pastry with tart raspberry coulis',
    },
    sommelierPairing: {
      name: 'Gaja Barbaresco & Botanical Juniper Elixir',
      vintage: '2017 Piedmont Red',
      note: 'Forest floor aromatics, dried rose petals, and silky aged acidity',
    },
    profile: 'Forest Terroir & Creamy Truffle',
    shortProfile: 'Wild Truffle',
    image: 'https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'sweet-decadence',
    mood: 'Decadent Sweet & Spectacle',
    shortMood: 'Sweet Decadence',
    tagline: 'For dessert gourmands — tableside smoke, dark cocoa velvet, and single origin espresso.',
    icon: Sparkles,
    starter: {
      name: 'Wild Forest Morel Cappuccino',
      subtitle: 'Morel Soup & White Truffle Foam',
      note: 'Porcini essence with aerated white truffle foam and parmesan tuile',
    },
    main: {
      name: 'Roasted Duck Breast & Blood Orange',
      subtitle: 'Grand Marnier Glaze & Parsnip Silk',
      note: 'Blood orange reduction, Grand Marnier glaze & parsnip silk',
    },
    dessert: {
      name: 'The Chocolate & Vanilla Pastry Grand Tasting',
      subtitle: 'Dark Chocolate, Vanilla & Warm Caramel',
      note: 'Both signature desserts served with hot single-origin caramel',
    },
    sommelierPairing: {
      name: 'Chateau d\'Yquem Sauternes & Midnight Espresso',
      vintage: '2016 Premier Reserve',
      note: 'Honeyed apricot and roasted Ethiopian single origin notes',
    },
    profile: 'Honeyed Apricot & Dark Cacao',
    shortProfile: 'Dark Cacao',
    image: 'https://images.unsplash.com/photo-1579372786545-d24232daf58c?auto=format&fit=crop&w=1000&q=80',
  },
]

export const PalateQuiz: React.FC = () => {
  const [selectedPalateId, setSelectedPalateId] = useState<string>('smoky-bold')
  const recommendationRef = useRef<HTMLDivElement>(null)

  const activeIndex = PALATE_PRESETS.findIndex((p) => p.id === selectedPalateId)
  const activePalate = PALATE_PRESETS[activeIndex >= 0 ? activeIndex : 0]

  const handleSelectPalate = (id: string, autoScroll = false) => {
    setSelectedPalateId(id)

    // On mobile screens, smoothly bring the recommendation card into clear view
    if (autoScroll && typeof window !== 'undefined' && window.innerWidth < 1024) {
      setTimeout(() => {
        recommendationRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }, 50)
    }
  }

  const handleNextPalate = () => {
    const nextIdx = (activeIndex + 1) % PALATE_PRESETS.length
    handleSelectPalate(PALATE_PRESETS[nextIdx].id, true)
  }

  const handlePrevPalate = () => {
    const prevIdx = (activeIndex - 1 + PALATE_PRESETS.length) % PALATE_PRESETS.length
    handleSelectPalate(PALATE_PRESETS[prevIdx].id, true)
  }

  const handleWhatsAppBooking = () => {
    if (!palateLimiter.canProceed()) return
    palateLimiter.recordAction()

    const text = `🍷 *CUSTOM SOMMELIER PAIRING RESERVATION — ${SITE_CONFIG.name}*
━━━━━━━━━━━━━━━━━━━━
✨ *Selected Palate Mood:* ${activePalate.mood}
🎯 *Flavor Profile:* ${activePalate.profile}

🍽️ *Curated 3-Course Menu:*
• Starter: ${activePalate.starter.name}
• Main: ${activePalate.main.name}
• Dessert: ${activePalate.dessert.name}

🍾 *Curated Wine Pairing:*
${activePalate.sommelierPairing.name} (${activePalate.sommelierPairing.vintage})
━━━━━━━━━━━━━━━━━━━━
_Kindly check availability for this tasting menu._`

    const url = SITE_CONFIG.buildWhatsAppUrl(text)
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <AnimatedSection id="sommelier-quiz" className="py-16 sm:py-24 md:py-32 bg-[#0c0e12] relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/2 right-1/3 w-[500px] h-[500px] bg-[#d4af37]/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 md:mb-16">
          <span className="section-tag">
            Interactive Wine Pairing Concierge
          </span>
          <h2 className="font-cinzel text-2xl sm:text-4xl md:text-5xl font-bold text-[#edebe6] mt-2 mb-3 tracking-[0.14em] leading-tight">
            Curate Your Palate
          </h2>
          <GoldDivider className="my-4 sm:my-5" />
          <p className="font-serif italic text-sm sm:text-base md:text-lg text-[#a5a8b5] font-light max-w-xl mx-auto leading-relaxed">
            Select your flavor mood for tonight. Our wine team will instantly create a personalized three-course menu with matching vintages.
          </p>
        </div>

        {/* ── MOBILE & TABLET COMPACT DECK (< lg) ── */}
        <div className="lg:hidden mb-6">
          {/* Header indicator */}
          <div className="flex items-center justify-between mb-2.5 px-1">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#caa065] font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#d4af37] animate-pulse" />
              Choose Palate Mood (Tap to View)
            </span>
            <span className="text-[10px] text-[#8a8d98] font-mono">
              {activeIndex + 1} / {PALATE_PRESETS.length}
            </span>
          </div>

          {/* 2x2 Compact Luxury Grid */}
          <div className="grid grid-cols-2 gap-2">
            {PALATE_PRESETS.map((option) => {
              const Icon = option.icon
              const isSelected = option.id === selectedPalateId
              return (
                <button
                  key={option.id}
                  onClick={() => handleSelectPalate(option.id, true)}
                  className={`relative p-3 text-left transition-all duration-200 rounded-sm cursor-pointer border flex flex-col justify-between min-h-[72px] ${
                    isSelected
                      ? 'bg-[#181b24] border-[#d4af37] shadow-[0_0_20px_rgba(212,175,55,0.25)] ring-1 ring-[#d4af37]/60'
                      : 'bg-[#111318]/80 border-[#d4af37]/20 hover:border-[#d4af37]/50 active:bg-[#151821]'
                  }`}
                  aria-pressed={isSelected}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="mobileActivePalatePill"
                      className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#d4af37] shadow-[0_0_8px_#d4af37]"
                      transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                    />
                  )}

                  <div className="flex items-center gap-2">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-[#d4af37] text-[#08090b]' : 'bg-[#1a1e27] text-[#d4af37]'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[9px] uppercase tracking-wider text-[#caa065] font-medium truncate">
                      {option.shortProfile}
                    </span>
                  </div>

                  <div className="mt-1">
                    <h4 className="font-cinzel text-xs font-semibold text-[#f5eedf] leading-tight truncate">
                      {option.shortMood}
                    </h4>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Live Dynamic Status Ribbon */}
          <motion.div
            key={`ribbon-${activePalate.id}`}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="mt-2.5 py-2 px-3 bg-[#181b24] border border-[#d4af37]/35 rounded-sm flex items-center justify-between"
          >
            <div className="flex items-center gap-2 text-xs text-[#d4af37]">
              <Sparkles className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
              <span className="font-medium truncate">
                Showing: <strong className="text-[#f7ecd7] font-semibold">{activePalate.shortMood}</strong>
              </span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-[#8a8d98] font-sans shrink-0 ml-2">
              <span>Updated Live</span>
              <span className="text-[#d4af37]">&darr;</span>
            </div>
          </motion.div>
        </div>

        {/* ── DESKTOP 4-COLUMN CARDS (hidden on mobile, visible on lg+) ── */}
        <div className="hidden lg:grid grid-cols-4 gap-4 mb-12">
          {PALATE_PRESETS.map((option) => {
            const Icon = option.icon
            const isSelected = option.id === selectedPalateId
            return (
              <button
                key={option.id}
                onClick={() => handleSelectPalate(option.id, false)}
                className={`palate-option-card relative p-6 text-left transition-all duration-300 rounded-sm cursor-pointer border ${
                  isSelected
                    ? 'bg-[#181b24] border-[#d4af37] shadow-[0_8px_30px_rgba(212,175,55,0.25)]'
                    : 'bg-[#111318]/70 border-[#d4af37]/20 hover:border-[#d4af37]/60 hover:bg-[#141720]'
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="activePalateBorder"
                    className="absolute inset-0 border-2 border-[#d4af37] rounded-sm pointer-events-none"
                    transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                  />
                )}
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isSelected ? 'bg-[#d4af37] text-[#08090b]' : 'bg-[#1a1e27] text-[#d4af37]'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] uppercase font-sans tracking-widest text-[#caa065] palate-profile-tag">
                    {option.profile}
                  </span>
                </div>

                <h3 className="font-cinzel text-base font-semibold text-[#f5eedf] mb-1 palate-mood-title">
                  {option.mood}
                </h3>
                <p className="text-xs text-[#8a8d98] font-sans font-light line-clamp-2 leading-relaxed palate-mood-desc">
                  {option.tagline}
                </p>
              </button>
            )
          })}
        </div>

        {/* ── DYNAMIC RECOMMENDATION PANEL (Fully Responsive) ── */}
        <div
          ref={recommendationRef}
          className="palate-recommendation-panel bg-[#111318]/95 border border-[#d4af37]/35 p-5 sm:p-8 lg:p-12 shadow-[0_25px_60px_rgba(0,0,0,0.85)] backdrop-blur-xl rounded-sm transition-all"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activePalate.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center"
            >
              {/* Image Preview with Mood Tag */}
              <div className="palate-image-preview lg:col-span-5 relative overflow-hidden rounded-sm border border-[#d4af37]/30 h-52 sm:h-72 lg:h-96">
                <img
                  src={activePalate.image}
                  srcSet={buildResponsiveImageSrcSet(activePalate.image)}
                  sizes="(max-width: 1023px) calc(100vw - 4rem), 42vw"
                  alt={activePalate.mood}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#08090b] via-black/20 to-transparent opacity-90" />

                <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 palate-image-text">
                  <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.25em] text-[#d4af37] font-semibold block mb-0.5 sm:mb-1">
                    Curated Profile
                  </span>
                  <div className="font-cinzel text-lg sm:text-xl text-[#f7ecd7] font-bold">
                    {activePalate.profile}
                  </div>
                </div>
              </div>

              {/* Course Breakdown */}
              <div className="lg:col-span-7 space-y-4 sm:space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-[11px] sm:text-xs uppercase tracking-[0.25em] text-[#d4af37] font-semibold mb-1">
                    <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Recommended 3-Course Pairing
                  </div>
                  <h3 className="font-cinzel text-xl sm:text-2xl lg:text-3xl font-bold text-[#f5eedf] leading-snug palate-symphony-title">
                    The {activePalate.mood} Symphony
                  </h3>
                </div>

                <div className="space-y-3 sm:space-y-4 pt-1">
                  {/* Starter */}
                  <div className="palate-course-card p-3 sm:p-3.5 bg-[#181b24] border-l-2 border-[#d4af37] rounded-r-sm transition-colors">
                    <div className="flex items-center justify-between gap-2">
                      <span className="course-tag text-[10px] uppercase tracking-widest text-[#caa065] font-semibold shrink-0">
                        Course I &bull; Appetizer
                      </span>
                      <span className="course-french font-serif italic text-[11px] sm:text-xs text-[#8a8d98] truncate text-right">
                        {activePalate.starter.subtitle}
                      </span>
                    </div>
                    <div className="course-title font-cinzel text-sm sm:text-base text-[#f7ecd7] font-semibold mt-0.5">
                      {activePalate.starter.name}
                    </div>
                    <div className="course-note text-[11px] sm:text-xs text-[#a5a8b5] font-light mt-0.5 leading-relaxed">
                      {activePalate.starter.note}
                    </div>
                  </div>

                  {/* Main */}
                  <div className="palate-course-card p-3 sm:p-3.5 bg-[#181b24] border-l-2 border-[#d4af37] rounded-r-sm transition-colors">
                    <div className="flex items-center justify-between gap-2">
                      <span className="course-tag text-[10px] uppercase tracking-widest text-[#caa065] font-semibold shrink-0">
                        Course II &bull; Plat Principal
                      </span>
                      <span className="course-french font-serif italic text-[11px] sm:text-xs text-[#8a8d98] truncate text-right">
                        {activePalate.main.subtitle}
                      </span>
                    </div>
                    <div className="course-title font-cinzel text-sm sm:text-base text-[#f7ecd7] font-semibold mt-0.5">
                      {activePalate.main.name}
                    </div>
                    <div className="course-note text-[11px] sm:text-xs text-[#a5a8b5] font-light mt-0.5 leading-relaxed">
                      {activePalate.main.note}
                    </div>
                  </div>

                  {/* Dessert */}
                  <div className="palate-course-card p-3 sm:p-3.5 bg-[#181b24] border-l-2 border-[#d4af37] rounded-r-sm transition-colors">
                    <div className="flex items-center justify-between gap-2">
                      <span className="course-tag text-[10px] uppercase tracking-widest text-[#caa065] font-semibold shrink-0">
                        Course III &bull; Dessert
                      </span>
                      <span className="course-french font-serif italic text-[11px] sm:text-xs text-[#8a8d98] truncate text-right">
                        {activePalate.dessert.subtitle}
                      </span>
                    </div>
                    <div className="course-title font-cinzel text-sm sm:text-base text-[#f7ecd7] font-semibold mt-0.5">
                      {activePalate.dessert.name}
                    </div>
                    <div className="course-note text-[11px] sm:text-xs text-[#a5a8b5] font-light mt-0.5 leading-relaxed">
                      {activePalate.dessert.note}
                    </div>
                  </div>

                  {/* Sommelier Wine Pairing Card */}
                  <div className="sommelier-pairing-card p-3 sm:p-4 bg-[#1e2330] border border-[#d4af37]/40 flex items-start gap-3 rounded-sm transition-colors">
                    <div className="p-2 sm:p-2.5 bg-[#d4af37]/15 rounded-full text-[#d4af37] shrink-0 mt-0.5">
                      <Wine className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="pairing-tag text-[10px] uppercase tracking-widest text-[#d4af37] font-semibold">
                        Wine & Spirit Pairing
                      </div>
                      <div className="pairing-title font-cinzel text-xs sm:text-sm text-[#f5eedf] font-semibold mt-0.5">
                        {activePalate.sommelierPairing.name} ({activePalate.sommelierPairing.vintage})
                      </div>
                      <div className="pairing-note text-[11px] sm:text-xs text-[#a5a8b5] font-light mt-0.5 leading-relaxed">
                        {activePalate.sommelierPairing.note}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Direct Action & Quick Switchers */}
                <div className="pt-2 sm:pt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
                  <button
                    onClick={handleWhatsAppBooking}
                    className="w-full sm:w-auto bg-[#25D366] hover:bg-[#1ebc59] active:bg-[#189b47] text-black font-sans uppercase text-[11px] sm:text-xs tracking-widest font-semibold px-6 sm:px-8 py-3.5 flex items-center justify-center gap-2 transition-all shadow-[0_4px_20px_rgba(37,211,102,0.3)] cursor-pointer rounded-sm"
                  >
                    <WhatsAppIcon className="w-4 h-4 text-black shrink-0" />
                    <span>Reserve This Pairing via WhatsApp</span>
                  </button>

                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-1 sm:pt-0">
                    <button
                      onClick={handlePrevPalate}
                      className="text-xs text-[#8a8d98] hover:text-[#d4af37] flex items-center gap-1 transition-colors cursor-pointer py-1"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span>Previous</span>
                    </button>
                    <span className="text-[#d4af37]/40 text-xs">&bull;</span>
                    <button
                      onClick={handleNextPalate}
                      className="text-xs text-[#caa065] hover:text-[#d4af37] flex items-center gap-1 transition-colors cursor-pointer py-1 font-medium"
                    >
                      <span>Next Palate</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </AnimatedSection>
  )
}
