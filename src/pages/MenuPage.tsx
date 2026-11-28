import React from 'react'
import { Menu } from '../components/Menu'
import { PalateQuiz } from '../components/PalateQuiz'
import { AnimatedSection } from '../components/ui/AnimatedSection'
import { GoldDivider } from '../components/ui/GoldDivider'
import { Wine } from 'lucide-react'
import { SITE_CONFIG } from '../config/site'

export const MenuPage: React.FC = () => {
  return (
    <div className="pt-24 sm:pt-28 pb-16 overflow-x-hidden">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto px-6 pt-10 sm:pt-14 pb-8">
        <span className="section-tag">
          Fine Dining &bull; Seasonal Selections
        </span>
        <h1 className="font-cinzel text-4xl sm:text-5xl md:text-6xl font-bold text-[#edebe6] mt-2 mb-4 leading-tight">
          The Complete Menu
        </h1>
        <GoldDivider className="my-5" />
        <p className="font-serif italic text-base sm:text-lg text-[#a5a8b5] font-light max-w-2xl mx-auto leading-relaxed">
          Every dish represents a marriage of lineage French discipline, Japanese Binchotan woodfire searing, and rare foraged botanicals.
        </p>
      </div>

      {/* Main Tabbed Menu Component */}
      <Menu />

      {/* Interactive Sommelier Palate Pairing Quiz */}
      <PalateQuiz />

      {/* Wine Cellar Note */}
      <AnimatedSection className="py-16 bg-[#08090b] border-t border-[#d4af37]/15">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/40 flex items-center justify-center mx-auto text-[#d4af37]">
            <Wine className="w-6 h-6" />
          </div>
          <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-[#f7ecd7]">
            The {SITE_CONFIG.name} Vintage Wine Cellar
          </h3>
          <p className="text-xs sm:text-sm text-[#a5a8b5] font-light max-w-xl mx-auto leading-relaxed">
            Our temperature-monitored cellar holds more than 450 certified vintages from Bordeaux, Burgundy, Piedmont, and small-batch biodynamic wine producers.
          </p>
        </div>
      </AnimatedSection>
    </div>
  )
}
