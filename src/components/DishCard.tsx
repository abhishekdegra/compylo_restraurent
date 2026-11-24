import React, { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import type { MenuItem } from '../types'
import { Sparkles, Leaf } from 'lucide-react'
import { WhatsAppIcon } from './ui/WhatsAppIcon'
import { SITE_CONFIG } from '../config/site'
import { buildResponsiveImageSrcSet } from '../utils/responsiveImage'

interface DishCardProps {
  item: MenuItem
}

export const DishCard: React.FC<DishCardProps> = ({ item }) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50, opacity: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only calculate 3D tilt on devices with a fine pointer (mouse/trackpad), skip on touch screens to save battery & GPU
    if (typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches) return
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    // Max 8 deg rotation for elegant subtle 3D depth
    const rotX = -((y - centerY) / centerY) * 7
    const rotY = ((x - centerX) / centerX) * 7

    setRotateX(rotX)
    setRotateY(rotY)

    // Specular highlight coordinate percentage
    const glareX = (x / rect.width) * 100
    const glareY = (y / rect.height) * 100
    setGlarePosition({ x: glareX, y: glareY, opacity: 1 })
  }

  const handleMouseLeave = () => {
    setRotateX(0)
    setRotateY(0)
    setGlarePosition((prev) => ({ ...prev, opacity: 0 }))
  }

  const whatsappDishInquiry = () => {
    const message = `Hello ${SITE_CONFIG.name}, I am interested in tasting "${item.name}" (${item.price}). Could you share if it is available for tonight's service?`
    window.open(SITE_CONFIG.buildWhatsAppUrl(message), '_blank', 'noopener,noreferrer')
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="perspective-1000"
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transition: 'transform 0.15s ease-out',
        }}
        className="dish-card group relative flex flex-col justify-between bg-[#111318]/90 border border-[#d4af37]/20 hover:border-[#d4af37]/60 transition-colors duration-500 overflow-hidden shadow-[0_12px_35px_rgba(0,0,0,0.6)] hover:shadow-[0_18px_45px_rgba(212,175,55,0.18)] rounded-sm h-full"
      >
        {/* Dynamic Specular Golden Glare Layer */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-30"
          style={{
            background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(212,175,55,0.18) 0%, rgba(212,175,55,0.04) 40%, transparent 70%)`,
            opacity: glarePosition.opacity,
          }}
        />

        {/* Top Image Container */}
        <div className="relative h-64 w-full overflow-hidden bg-[#08090b]">
          <img
            src={item.image}
            srcSet={buildResponsiveImageSrcSet(item.image)}
            sizes="(max-width: 767px) calc(100vw - 3rem), (max-width: 1023px) calc(50vw - 3rem), 390px"
            alt={item.name}
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=80'
            }}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            loading="lazy"
            decoding="async"
          />
          {/* Soft Shadow Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#111318] via-transparent to-black/30 dish-image-vignette transition-all duration-500" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-2 z-20">
            {item.isChefSpecial && (
              <span className="inline-flex items-center gap-1 bg-[#d4af37] text-[#08090b] text-[10px] font-sans font-bold uppercase tracking-wider px-2.5 py-1 rounded-none shadow-md">
                <Sparkles className="w-3 h-3" />
                Chef Special
              </span>
            )}
            {item.isVeg && (
              <span className="inline-flex items-center gap-1 bg-[#2e4d34] text-[#a1f0b0] text-[10px] font-sans font-medium uppercase tracking-wider px-2 py-1 rounded-none border border-[#4a6741]">
                <Leaf className="w-3 h-3" />
                Vegetarian
              </span>
            )}
          </div>

          {/* Price Tag Floating */}
          <div className="dish-price-tag absolute bottom-3 right-3 bg-[#08090b]/85 backdrop-blur-md px-3.5 py-1.5 border border-[#d4af37]/40 z-20 transition-all duration-300">
            <span className="font-serif text-lg font-semibold text-[#f7ecd7] tracking-tight">
              {item.price}
            </span>
          </div>
        </div>

        {/* Dish Description Container */}
        <div className="p-6 flex flex-col flex-grow justify-between relative z-10">
          <div>
            {item.subtitle && (
              <span className="dish-subtitle text-[11px] font-serif italic text-[#d4af37] tracking-wider block mb-1">
                {item.subtitle}
              </span>
            )}
            <h3 className="dish-title font-cinzel text-lg md:text-xl font-semibold text-[#f5eedf] group-hover:text-[#d4af37] transition-colors leading-snug">
              {item.name}
            </h3>

            <p className="dish-description text-xs text-[#a5a8b5] font-sans font-light mt-3 leading-relaxed">
              {item.description}
            </p>

            {item.tags && item.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-4">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="dish-tag text-[9px] uppercase tracking-widest text-[#8a8d98] bg-[#1a1e27] px-2 py-0.5 border border-white/5 transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Card Footer: Quick WhatsApp Inquiry */}
          <div className="mt-6 pt-4 border-t border-[#d4af37]/15 flex items-center justify-between">
            <button
              onClick={whatsappDishInquiry}
              className="text-[11px] uppercase tracking-[0.2em] font-sans text-[#caa065] hover:text-[#f7ecd7] flex items-center gap-1.5 transition-colors cursor-pointer group-hover:underline"
            >
              <WhatsAppIcon className="w-3.5 h-3.5 text-[#25D366]" />
              Inquire on WhatsApp
            </button>
            <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]/40 group-hover:bg-[#d4af37] transition-colors" />
          </div>
        </div>
      </div>
    </motion.div>
  )
}
