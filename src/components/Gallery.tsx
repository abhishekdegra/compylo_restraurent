import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GALLERY_IMAGES } from '../data/galleryData'
import type { GalleryImage } from '../types'
import { AnimatedSection } from './ui/AnimatedSection'
import { GoldDivider } from './ui/GoldDivider'
import { Maximize2, X } from 'lucide-react'
import { buildResponsiveImageSrcSet } from '../utils/responsiveImage'
import { SITE_CONFIG } from '../config/site'

export const Gallery: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)

  return (
    <AnimatedSection id="gallery" className="py-24 md:py-36 bg-[#0c0e12] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <span className="section-tag">
            Visual Ambiance
          </span>
          <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-bold text-[#edebe6] mt-2 mb-4 tracking-[0.14em] leading-tight">
            The {SITE_CONFIG.name} Atmosphere
          </h2>
          <GoldDivider className="my-5" />
          <p className="font-serif italic text-base sm:text-lg text-[#a5a8b5] font-light max-w-xl mx-auto leading-relaxed mt-4">
            An intimate haven of brushed bronze, custom blown glassware, and candlelit solitude.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-12 gap-4 sm:gap-6">
          {GALLERY_IMAGES.map((img) => (
            <motion.div
              key={img.id}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
              onClick={() => setSelectedImage(img)}
              className={`relative overflow-hidden group cursor-pointer border border-[#d4af37]/20 hover:border-[#d4af37]/60 shadow-[0_10px_30px_rgba(0,0,0,0.6)] ${img.span || 'col-span-12 md:col-span-4 h-80'}`}
            >
              <img
                src={img.image}
                srcSet={buildResponsiveImageSrcSet(img.image)}
                sizes="(max-width: 767px) calc(100vw - 3rem), (max-width: 1279px) 50vw, 420px"
                alt={img.title}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                loading="lazy"
                decoding="async"
              />

              {/* Gradient & Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#08090b]/90 via-[#08090b]/30 to-transparent opacity-60 group-hover:opacity-85 transition-opacity duration-300" />

              {/* Information Pill */}
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between z-10">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.25em] text-[#d4af37] font-sans block mb-1">
                    {img.category}
                  </span>
                  <h4 className="font-cinzel text-sm sm:text-base font-semibold text-[#f5eedf]">
                    {img.title}
                  </h4>
                </div>

                <div className="w-8 h-8 rounded-full bg-[#12151b]/80 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Maximize2 className="w-3.5 h-3.5" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-50 bg-[#08090b]/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl w-full max-h-[90vh] bg-[#12151b] border border-[#d4af37]/40 p-2 sm:p-4 shadow-[0_25px_60px_rgba(0,0,0,0.9)] overflow-hidden"
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-20 w-10 h-10 bg-[#08090b]/80 border border-[#d4af37]/50 text-[#d4af37] hover:text-white flex items-center justify-center transition-colors"
                aria-label="Close Preview"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-full h-[60vh] sm:h-[70vh] overflow-hidden bg-black flex items-center justify-center">
                <img
                  src={selectedImage.image}
                  srcSet={buildResponsiveImageSrcSet(selectedImage.image, [720, 960, 1280, 1600])}
                  sizes="100vw"
                  alt={selectedImage.title}
                  decoding="async"
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="p-4 sm:p-6 bg-[#12151b] border-t border-[#d4af37]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#d4af37]">
                    {selectedImage.category}
                  </span>
                  <h3 className="font-cinzel text-lg sm:text-xl text-[#f7ecd7]">
                    {selectedImage.title}
                  </h3>
                </div>
                <button
                  onClick={() => {
                    setSelectedImage(null)
                    const target = document.querySelector('#reservation')
                    if (target) target.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="text-xs uppercase tracking-widest text-[#d4af37] hover:text-white border-b border-[#d4af37] pb-1 cursor-pointer"
                >
                  Experience This Setting &rarr;
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatedSection>
  )
}
