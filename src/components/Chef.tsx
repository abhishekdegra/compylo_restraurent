import React from 'react'
import { motion } from 'framer-motion'
import { AnimatedSection } from './ui/AnimatedSection'
import { Award, Star, Quote } from 'lucide-react'
import { buildResponsiveImageSrcSet } from '../utils/responsiveImage'

export const Chef: React.FC = () => {
  return (
    <AnimatedSection id="chef" className="py-24 md:py-36 bg-[#08090b] relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-1/2 left-1/3 w-[500px] h-[500px] bg-[#d4af37]/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Chef Editorial Portrait (Left) */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="relative overflow-hidden rounded-sm border border-[#d4af37]/35 shadow-[0_25px_60px_rgba(0,0,0,0.85)] group">
                <img
                  src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=900&q=80"
                  srcSet={buildResponsiveImageSrcSet('https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=900&q=80')}
                  sizes="(max-width: 1023px) calc(100vw - 3rem), 42vw"
                  alt="Executive Chef Julien Laurent"
                  className="w-full h-[520px] object-cover transition-transform duration-1000 group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#08090b] via-transparent to-transparent opacity-90" />
              </div>

              {/* Michelin Credential Plaque */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="chef-plaque absolute -bottom-6 -left-4 sm:-left-6 bg-[#12151b] border border-[#d4af37]/50 p-5 shadow-[0_15px_30px_rgba(0,0,0,0.8)] flex items-center gap-4 transition-colors duration-400"
              >
                <div className="p-3 bg-[#d4af37]/15 rounded-full text-[#d4af37]">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-1 text-[#d4af37]">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <Star className="w-3.5 h-3.5 fill-current" />
                  </div>
                  <div className="text-xs uppercase font-cinzel font-bold text-[#f7ecd7] mt-0.5 tracking-wider">
                    Culinary Director
                  </div>
                  <div className="text-[10px] text-[#8a8d98] font-sans">
                    Mentored across Paris & Ginza
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Chef Philosophy & Story (Right) */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-6 lg:pl-6">
            <div>
              <span className="section-tag">
                The Visionary Behind The Flame
              </span>
              <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-bold text-[#edebe6] mt-2 mb-4 tracking-[0.14em] leading-tight">
                Chef Julien Valmont
              </h2>
              <div className="w-24 h-[1.5px] bg-gradient-to-r from-[#d4af37] to-transparent mt-4 mb-2" />
            </div>

            {/* Pull Quote */}
            <div className="chef-quote relative pl-8 border-l-2 border-[#d4af37]/60 my-2">
              <Quote className="w-6 h-6 text-[#d4af37]/40 absolute -top-1 left-1 -scale-x-100" />
              <p className="font-serif italic text-lg sm:text-xl text-[#f5eedf] leading-relaxed">
                "Fine dining is not about overwhelming complexity. It is about refining a single ingredient until it reveals its purest, most memorable flavor."
              </p>
            </div>

            <p className="text-[#a5a8b5] font-sans text-sm md:text-base leading-relaxed font-light">
              Trained in the classical French tradition under venerable masters in Lyon, Chef Julien spent a decade immersing himself in Kyoto’s reverence for seasonality and charcoal technique before conceptualizing <strong className="text-[#d4af37] font-normal">COMPYLO</strong>.
            </p>

            <p className="text-[#a5a8b5] font-sans text-sm md:text-base leading-relaxed font-light">
              Every evening, Julien and his brigade orchestrate an intimate culinary ballet at the open pass — infusing classic reduction sauces with wild Asian citrus and Japanese white oak smoke.
            </p>

            {/* Signature Block */}
            <div className="pt-6 border-t border-[#d4af37]/20 flex items-center justify-between">
              <div>
                <div className="font-serif italic text-2xl text-[#d4af37] tracking-wider">
                  Julien Valmont
                </div>
                <div className="text-[10px] uppercase tracking-[0.25em] text-[#8a8d98] font-sans mt-0.5">
                  Executive Chef & Co-Founder
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#caa065] block font-sans">
                  Daily Service
                </span>
                <span className="font-serif text-sm text-[#f5eedf]">
                  Dinner only &bull; 18:30 – 23:30
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  )
}
