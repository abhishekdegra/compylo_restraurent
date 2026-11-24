import React from 'react'
import { Gallery } from '../components/Gallery'
import { Testimonials } from '../components/Testimonials'
import { GoldDivider } from '../components/ui/GoldDivider'

export const GalleryPage: React.FC = () => {
  return (
    <div className="pt-24 sm:pt-28 pb-16 overflow-x-hidden">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto px-6 pt-10 sm:pt-14 pb-4">
        <span className="section-tag">
          Atmosphere &bull; Architecture &bull; Accolades
        </span>
        <h1 className="font-cinzel text-4xl sm:text-5xl md:text-6xl font-bold text-[#edebe6] mt-2 mb-4 leading-tight">
          Visual Atmosphere
        </h1>
        <GoldDivider className="my-5" />
        <p className="font-serif italic text-base sm:text-lg text-[#a5a8b5] font-light max-w-2xl mx-auto leading-relaxed">
          An intimate world of brushed bronze, custom blown glassware, and candlelit solitude, celebrated by international critics.
        </p>
      </div>

      {/* 1. Full Bento Gallery with Lightbox */}
      <Gallery />

      {/* 2. Critic Reflections & Accolades */}
      <Testimonials />
    </div>
  )
}

