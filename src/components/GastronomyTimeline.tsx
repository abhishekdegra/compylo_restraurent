import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AnimatedSection } from './ui/AnimatedSection'
import { GoldDivider } from './ui/GoldDivider'
import { Clock, ChevronRight, Compass } from 'lucide-react'
import { buildResponsiveImageSrcSet } from '../utils/responsiveImage'

interface TimelineMoment {
  time: string
  period: 'Dawn' | 'Morning' | 'Afternoon' | 'Dusk' | 'Night' | 'Late Night'
  title: string
  subtitle: string
  description: string
  image: string
  highlights: string[]
}

const TIMELINE_MOMENTS: TimelineMoment[] = [
  {
    time: '06:30',
    period: 'Dawn',
    title: 'Himalayan Mountain Foraging',
    subtitle: 'Pre-Dawn Mountain Harvest',
    description: 'At break of dawn, our foragers collect wild high-altitude morels, micro-sorrel, and pine botanicals before the morning dew evaporates. Freshness measured in hours, not days.',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1000&q=80',
    highlights: ['Wild Forest Morels', 'Micro-Botanicals', 'Direct Valley Harvest'],
  },
  {
    time: '11:00',
    period: 'Morning',
    title: 'The 48-Hour Heritage Reductions',
    subtitle: 'Slow-Cooked Heritage Sauces',
    description: 'The foundation of classical sauce making. Roasted veal marrow bones, charred shallots, and vintage port simmer gently in copper pots until a rich, velvety essence is achieved.',
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=1000&q=80',
    highlights: ['French Copper Kettles', '25-Year Modena Balsamic', 'Zero Artificial Thickeners'],
  },
  {
    time: '16:00',
    period: 'Afternoon',
    title: 'Wine Cellar Decanting & Caviar Inspection',
    subtitle: 'Vintage Wine & Caviar Preparation',
    description: 'Our head wine steward opens selected vintage bottles three to four hours before service. Every tin of Imperial Oscietra caviar is individually inspected for freshness and balanced salinity.',
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1000&q=80',
    highlights: ['1982 Bordeaux Reserves', 'Acoustic Temperature Vaults', 'Imperial Caviar Flight'],
  },
  {
    time: '18:30',
    period: 'Dusk',
    title: 'Binchotan White Oak Coals Ignited',
    subtitle: 'Lighting the Binchotan Charcoal',
    description: 'Japanese Kishu Binchotan charcoal reaches 1,000°C without flare or smoke, radiating pure infrared heat to caramelize A5 Miyazaki Wagyu while retaining buttery intra-muscular marbling.',
    image: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=1000&q=80',
    highlights: ['1,000°C Smokeless Infrared', 'A5 Miyazaki Wagyu', 'Handmade Yakitori Grates'],
  },
  {
    time: '21:15',
    period: 'Night',
    title: 'The Tableside Golden Sphere Spectacle',
    subtitle: 'The Golden Chocolate Sphere',
    description: 'Dark Valrhona 72% chocolate domes dusted in 24-karat edible gold are served tableside while our dining host pours steaming single-origin bourbon caramel to reveal the gelato center.',
    image: 'https://images.unsplash.com/photo-1579372786545-d24232daf58c?auto=format&fit=crop&w=1000&q=80',
    highlights: ['Tableside Flame Finish', '24k Edible Gold Leaf', 'Smoked Salt Caramel'],
  },
  {
    time: '23:30',
    period: 'Late Night',
    title: 'Midnight Drinks & Chef Conversations',
    subtitle: 'Midnight Drinks by the Embers',
    description: 'As candlelight flickers low, guests linger in the Private Salon with rare Japanese single malts, Ethiopian single-origin espresso martinis, and private discussions with Chef Julien.',
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1000&q=80',
    highlights: ['Rare Cask Whisky', 'Bite-Sized Pastries', 'Intimate Solitude'],
  },
]

export const GastronomyTimeline: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState(3)
  const current = TIMELINE_MOMENTS[activeIdx]

  return (
    <AnimatedSection id="timeline" className="py-24 md:py-36 bg-[#08090b] relative overflow-hidden border-t border-[#d4af37]/15">
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/4 w-[600px] h-[600px] bg-[#d4af37]/5 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <span className="section-tag">
            Horological Gastronomy
          </span>
          <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-bold text-[#edebe6] mt-2 mb-4 tracking-[0.14em] leading-tight">
            A Day at Compylo
          </h2>
          <GoldDivider className="my-5" />
          <p className="font-serif italic text-base sm:text-lg text-[#a5a8b5] font-light max-w-xl mx-auto leading-relaxed mt-4">
            The extraordinary unseen dedication — 24 hours of foraging, slow reduction, and firecraft distilled into a single unforgettable dinner.
          </p>
        </div>

        {/* Timeline Selector Scrubber */}
        <div className="flex items-center justify-between overflow-x-auto pb-4 mb-12 scrollbar-none border-b border-[#d4af37]/20">
          {TIMELINE_MOMENTS.map((item, idx) => {
            const isActive = idx === activeIdx
            return (
              <button
                key={item.time}
                onClick={() => setActiveIdx(idx)}
                className="group relative flex flex-col items-center flex-1 min-w-[130px] py-4 px-2 cursor-pointer transition-all focus:outline-none"
              >
                {/* Time Indicator */}
                <span
                  className={`font-serif text-lg md:text-xl font-bold tracking-tight transition-colors duration-300 ${
                    isActive ? 'text-[#d4af37]' : 'text-[#8a8d98] group-hover:text-[#f7ecd7]'
                  }`}
                >
                  {item.time}
                </span>

                <span className="text-[10px] uppercase tracking-[0.25em] text-[#8a8d98] font-sans mt-0.5">
                  {item.period}
                </span>

                {/* Active Glowing Dot */}
                <div className="mt-3 relative flex items-center justify-center">
                  <div
                    className={`w-3.5 h-3.5 rounded-full border transition-all duration-300 ${
                      isActive
                        ? 'bg-[#d4af37] border-[#f7ecd7] shadow-[0_0_12px_#d4af37]'
                        : 'bg-[#181b23] border-[#d4af37]/30 group-hover:border-[#d4af37]'
                    }`}
                  />
                  {isActive && (
                    <motion.div
                      layoutId="timelineGlow"
                      className="absolute w-6 h-6 rounded-full bg-[#d4af37]/25 animate-ping"
                    />
                  )}
                </div>
              </button>
            )
          })}
        </div>

        {/* Featured Moment Showcase */}
        <div className="bg-[#111318]/90 border border-[#d4af37]/30 p-8 sm:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.85)] backdrop-blur-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            {/* Visual Panel */}
            <div className="lg:col-span-6 relative overflow-hidden rounded-sm border border-[#d4af37]/35 shadow-2xl group">
              <AnimatePresence mode="wait">
                <motion.img
                  key={current.image}
                  src={current.image}
                  srcSet={buildResponsiveImageSrcSet(current.image)}
                  sizes="(max-width: 1023px) calc(100vw - 3rem), 50vw"
                  alt={current.title}
                  loading="lazy"
                  decoding="async"
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="w-full h-80 sm:h-96 object-cover gpu-layer"
                />
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-[#08090b] via-transparent to-transparent opacity-75" />

              <div className="absolute top-4 left-4 bg-[#08090b]/85 backdrop-blur-md px-3.5 py-1.5 border border-[#d4af37]/40 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#d4af37]" />
                <span className="font-serif text-sm font-semibold text-[#f7ecd7]">
                  {current.time} &bull; {current.period}
                </span>
              </div>
            </div>

            {/* Content Story Panel */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.title}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-4"
                >
                  <span className="text-[11px] font-serif italic text-[#d4af37] tracking-wider block">
                    {current.subtitle}
                  </span>

                  <h3 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#f5eedf] leading-snug">
                    {current.title}
                  </h3>

                  <p className="text-sm text-[#a5a8b5] font-sans font-light leading-relaxed">
                    {current.description}
                  </p>

                  <div className="pt-2">
                    <span className="text-[10px] uppercase tracking-[0.25em] text-[#d4af37] font-semibold block mb-2.5">
                      Culinary Hallmarks:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {current.highlights.map((h) => (
                        <span
                          key={h}
                          className="text-xs text-[#c8cbd5] bg-[#1a1e27] border border-[#d4af37]/20 px-3 py-1 rounded-none flex items-center gap-1.5"
                        >
                          <ChevronRight className="w-3 h-3 text-[#d4af37]" />
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="pt-4 border-t border-[#d4af37]/20 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-[#8a8d98]">
                  <Compass className="w-4 h-4 text-[#d4af37]" />
                  <span>Uncompromised Artistry &bull; Daily at Compylo</span>
                </div>

                <button
                  onClick={() => {
                    const target = document.querySelector('#reservation')
                    if (target) target.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="text-xs uppercase tracking-widest text-[#d4af37] hover:text-[#f7ecd7] transition-colors cursor-pointer flex items-center gap-1 hover:underline"
                >
                  Reserve For Tonight &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  )
}
