import React from 'react'
import { About } from '../components/About'
import { Chef } from '../components/Chef'
import { GastronomyTimeline } from '../components/GastronomyTimeline'
import { GoldDivider } from '../components/ui/GoldDivider'

export const StoryPage: React.FC = () => {
  return (
    <div className="pt-24 sm:pt-28 pb-16 overflow-x-hidden">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto px-6 pt-10 sm:pt-14 pb-4">
        <span className="section-tag">
          Philosophy &bull; Heritage &bull; Craft
        </span>
        <h1 className="font-cinzel text-4xl sm:text-5xl md:text-6xl font-bold text-[#edebe6] mt-2 mb-4 leading-tight">
          The Compylo Journey
        </h1>
        <GoldDivider className="my-5" />
        <p className="font-serif italic text-base sm:text-lg text-[#a5a8b5] font-light max-w-2xl mx-auto leading-relaxed">
          From mountain dawn foraging to the whisper of late-night Binchotan coals, discover the ethos that defines our culinary sanctum.
        </p>
      </div>

      {/* 1. Our Story & Heritage */}
      <About />

      {/* 2. Executive Chef Julien Valmont */}
      <Chef />

      {/* 3. A Day at Compylo (Horological Gastronomy Timeline) */}
      <GastronomyTimeline />
    </div>
  )
}

