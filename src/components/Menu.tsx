import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MENU_ITEMS } from '../data/menuData'
import { DishCard } from './DishCard'
import { AnimatedSection } from './ui/AnimatedSection'
import { GoldDivider } from './ui/GoldDivider'
import { MagneticButton } from './ui/MagneticButton'
import { Utensils, Sparkles, Wine, GlassWater, Flame } from 'lucide-react'

type CategoryFilter = 'all' | 'starters' | 'mains' | 'tasting' | 'desserts' | 'cocktails'

export const Menu: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all')

  const categories = [
    { key: 'all', label: 'Full Menu', icon: Sparkles },
    { key: 'starters', label: 'Appetizers & Starters', icon: Utensils },
    { key: 'mains', label: 'Grill & Main Courses', icon: Flame },
    { key: 'tasting', label: 'Tasting Menus', icon: Sparkles },
    { key: 'desserts', label: 'Desserts', icon: GlassWater },
    { key: 'cocktails', label: 'Cellar & Cocktails', icon: Wine },
  ]

  const filteredItems =
    activeCategory === 'all'
      ? MENU_ITEMS
      : MENU_ITEMS.filter((item) => item.category === activeCategory)

  return (
    <AnimatedSection id="menu" className="py-24 md:py-36 bg-[#0c0e12] relative overflow-hidden">
      {/* Ambient Lighting */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-[#d4af37]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-[#8b2252]/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <span className="section-tag">
            Seasonal Menu
          </span>
          <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-bold text-[#edebe6] mt-2 mb-4 tracking-[0.14em] leading-tight">
            Our Curated Menu
          </h2>
          <GoldDivider className="my-5" />
          <p className="font-serif italic text-base sm:text-lg text-[#a5a8b5] font-light max-w-xl mx-auto leading-relaxed mt-4">
            Each creation is an exploration of peak-season botanicals, lineage meats, and rare artisanal reductions.
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 mb-16">
          {categories.map((cat) => {
            const Icon = cat.icon
            const isActive = activeCategory === cat.key
            return (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key as CategoryFilter)}
                className={`menu-tab-btn relative px-4 sm:px-6 py-2.5 text-xs uppercase tracking-[0.18em] font-sans font-medium transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'is-active text-[#08090b] font-semibold'
                    : 'text-[#c8cbd5] hover:text-[#d4af37] bg-[#12151b]/70 border border-[#d4af37]/20 hover:border-[#d4af37]/50'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeMenuTab"
                    className="absolute inset-0 bg-gradient-to-r from-[#d4af37] via-[#e5c77a] to-[#b88646] shadow-[0_4px_20px_rgba(212,175,55,0.35)]"
                    transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  <Icon className="w-3.5 h-3.5" />
                  {cat.label}
                </span>
              </button>
            )
          })}
        </div>

        {/* Grid of Dishes */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 content-auto"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <DishCard key={item.id} item={item} />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Dietary / Sommelier Note */}
        <div className="mt-16 p-6 md:p-8 bg-[#111318]/70 border border-[#d4af37]/25 text-center max-w-3xl mx-auto backdrop-blur-md">
          <p className="font-serif italic text-sm md:text-base text-[#e0e2ec]">
            "Our wine team creates custom pairings around each guest's preferences. Please tell our reservation team about any allergies before dining."
          </p>
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <MagneticButton
              variant="outline"
              onClick={() => {
                const target = document.querySelector('#reservation')
                if (target) target.scrollIntoView({ behavior: 'smooth' })
              }}
              className="py-2.5 px-6 text-[10px]"
            >
              Inquire About Custom Tasting Menu
            </MagneticButton>
          </div>
        </div>
      </div>
    </AnimatedSection>
  )
}

