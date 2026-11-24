import React from 'react'
import { motion } from 'framer-motion'
import { AnimatedSection } from './ui/AnimatedSection'
import { GoldDivider } from './ui/GoldDivider'
import { Counter } from './ui/Counter'
import { Award, Compass, HeartHandshake, Sparkles } from 'lucide-react'
import { buildResponsiveImageSrcSet } from '../utils/responsiveImage'

export const About: React.FC = () => {
  return (
    <AnimatedSection id="story" className="py-24 md:py-36 bg-[#08090b] relative overflow-hidden">
      {/* Decorative Background Lighting */}
      <div className="absolute top-1/2 -left-48 w-96 h-96 bg-[#d4af37]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
          <span className="section-tag">
            Our Heritage & Philosophy
          </span>
          <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-bold text-[#edebe6] mt-2 mb-4 tracking-[0.14em] leading-tight">
            The Compylo Legacy
          </h2>
          <GoldDivider className="my-5" />
          <p className="font-serif italic text-lg sm:text-xl text-[#a5a8b5] font-light max-w-xl mx-auto leading-relaxed mt-4">
            "Cooking is not merely the preparation of ingredients; it is an intimate conversation between nature, memory, and fire."
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Visual Composition with Layered Frames */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              {/* Primary Image */}
              <div className="relative overflow-hidden rounded-sm border border-[#d4af37]/30 shadow-[0_20px_50px_rgba(0,0,0,0.8)] group">
                <img
                  src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1000&q=80"
                  srcSet={buildResponsiveImageSrcSet('https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1000&q=80')}
                  sizes="(max-width: 1023px) calc(100vw - 3rem), 50vw"
                  alt="Compylo Private Dining Room"
                  className="w-full h-[460px] object-cover transition-transform duration-1000 group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#08090b] via-transparent to-transparent opacity-80" />
              </div>

              {/* Floating Floating Accent Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="about-michelin-card absolute -bottom-8 -right-4 sm:-right-8 bg-[#12151b]/95 backdrop-blur-md p-6 border border-[#d4af37]/40 shadow-[0_15px_35px_rgba(0,0,0,0.7)] max-w-xs transition-colors duration-400"
              >
                <div className="flex items-center gap-3 text-[#d4af37] mb-2">
                  <Sparkles className="w-5 h-5" />
                  <span className="font-cinzel text-sm uppercase tracking-widest font-semibold">
                    Michelin Standard
                  </span>
                </div>
                <p className="text-xs text-[#a5a8b5] leading-relaxed">
                  Every cut, glaze, and botanical reduction is prepared fresh daily under the uncompromising eye of our culinary brigade.
                </p>
              </motion.div>
            </div>
          </div>

          {/* Right Column: Story Text and Values */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
            <h3 className="font-cinzel text-2xl sm:text-3xl font-semibold text-[#f7ecd7] leading-tight">
              A Sanctum for Discerning Palates
            </h3>

            <p className="text-[#a5a8b5] font-sans text-sm md:text-base leading-relaxed font-light">
              Founded on the belief that fine dining should be transformative rather than performative, <strong className="text-[#d4af37] font-normal">COMPYLO</strong> brings together age-old European culinary discipline and bold modern techniques.
            </p>

            <p className="text-[#a5a8b5] font-sans text-sm md:text-base leading-relaxed font-light">
              We source our wild herbs from high-altitude Himalayan foragers, our seafood directly from certified sustainable Japanese coastal fisheries, and aged heritage meats cured exclusively in our temperature-controlled aging vaults.
            </p>

            {/* Core Values Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="about-pillar-card p-4 bg-[#12151b]/50 border border-[#d4af37]/15 rounded-sm transition-colors duration-400">
                <Compass className="w-5 h-5 text-[#d4af37] mb-2" />
                <h4 className="font-cinzel text-sm text-[#f7ecd7] mb-1 font-semibold">Origin</h4>
                <p className="text-[11px] text-[#8a8d98]">100% Traceable sustainable sourcing</p>
              </div>

              <div className="about-pillar-card p-4 bg-[#12151b]/50 border border-[#d4af37]/15 rounded-sm transition-colors duration-400">
                <Award className="w-5 h-5 text-[#d4af37] mb-2" />
                <h4 className="font-cinzel text-sm text-[#f7ecd7] mb-1 font-semibold">Mastery</h4>
                <p className="text-[11px] text-[#8a8d98]">Bespoke French & Japanese coal grill</p>
              </div>

              <div className="about-pillar-card p-4 bg-[#12151b]/50 border border-[#d4af37]/15 rounded-sm transition-colors duration-400">
                <HeartHandshake className="w-5 h-5 text-[#d4af37] mb-2" />
                <h4 className="font-cinzel text-sm text-[#f7ecd7] mb-1 font-semibold">Intimacy</h4>
                <p className="text-[11px] text-[#8a8d98]">Private dining rooms & dedicated wine service</p>
              </div>
            </div>

            {/* Dynamic Counter Row */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-[#d4af37]/20">
              <div>
                <div className="text-3xl md:text-4xl font-serif text-[#d4af37]">
                  <Counter to={15} suffix="+" />
                </div>
                <div className="text-[10px] md:text-xs uppercase tracking-widest text-[#8a8d98] mt-1">
                  Years of Mastery
                </div>
              </div>

              <div>
                <div className="text-3xl md:text-4xl font-serif text-[#d4af37]">
                  <Counter to={52} suffix="+" />
                </div>
                <div className="text-[10px] md:text-xs uppercase tracking-widest text-[#8a8d98] mt-1">
                  Seasonal Dishes
                </div>
              </div>

              <div>
                <div className="text-3xl md:text-4xl font-serif text-[#d4af37]">
                  <Counter to={12800} suffix="+" />
                </div>
                <div className="text-[10px] md:text-xs uppercase tracking-widest text-[#8a8d98] mt-1">
                  Memorable Dinners
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  )
}

