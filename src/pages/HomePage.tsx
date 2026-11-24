import React from 'react'
import { Link } from 'react-router-dom'
import { Hero } from '../components/Hero'
import { AnimatedSection } from '../components/ui/AnimatedSection'
import { GoldDivider } from '../components/ui/GoldDivider'
import { DishCard } from '../components/DishCard'
import { PalateQuiz } from '../components/PalateQuiz'
import { Testimonials } from '../components/Testimonials'
import { Reservation } from '../components/Reservation'
import { MENU_ITEMS } from '../data/menuData'
import { GALLERY_IMAGES } from '../data/galleryData'
import { ArrowRight } from 'lucide-react'
import { buildResponsiveImageSrcSet } from '../utils/responsiveImage'

export const HomePage: React.FC = () => {
  // Show 3 signature dishes on home
  const signatureDishes = MENU_ITEMS.filter((i) => i.isChefSpecial).slice(0, 3)
  // Show 3 atmosphere images
  const previewGallery = GALLERY_IMAGES.slice(0, 3)

  return (
    <div className="overflow-x-hidden">
      {/* 1. Cinematic 100vh Full Screen Hero */}
      <Hero />

      {/* 2. Story Teaser Section */}
      <AnimatedSection className="py-20 sm:py-28 bg-[#08090b] border-t border-[#d4af37]/15">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            <div className="lg:col-span-6 relative">
              <div className="overflow-hidden rounded-sm border border-[#d4af37]/35 shadow-[0_15px_40px_rgba(0,0,0,0.8)]">
                <img
                  src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1000&q=80"
                  srcSet={buildResponsiveImageSrcSet('https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1000&q=80')}
                  sizes="(max-width: 1023px) calc(100vw - 3rem), 50vw"
                  alt="Compylo Private Dining"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-80 sm:h-96 object-cover"
                />
              </div>
            </div>

            <div className="lg:col-span-6 space-y-5">
              <span className="section-tag">
                Our Heritage &bull; Est. 2024
              </span>
              <h2 className="font-cinzel text-3xl sm:text-4xl font-bold text-[#edebe6] leading-tight">
                Where Timeless Discipline Meets Avant-Garde Fire
              </h2>
              <div className="w-16 h-[1.5px] bg-[#d4af37]" />
              <p className="text-sm text-[#a5a8b5] font-normal sm:font-medium leading-relaxed">
                Founded on the belief that fine dining should be transformative rather than performative, <strong className="text-[#d4af37] font-semibold">COMPYLO</strong> brings together age-old French culinary discipline, Himalayan wild botanicals, and 1,000°C Japanese Binchotan charcoal craft.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Link
                  to="/story"
                  className="inline-flex max-w-full items-center gap-2 text-[10px] sm:text-xs uppercase tracking-wider sm:tracking-widest text-[#d4af37] hover:text-[#f7ecd7] border-b border-[#d4af37] pb-1 font-semibold group transition-colors leading-relaxed"
                >
                  Read Our Full Story &amp; Meet The Chef
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* 3. Curated Menu Teaser (3D Tilt Cards) */}
      <AnimatedSection className="py-20 sm:py-28 bg-[#0c0e12] border-t border-[#d4af37]/15">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="section-tag">
              Chef's Seasonal Selection
            </span>
            <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-bold text-[#edebe6] mt-2 mb-4 leading-tight">
              Signature Gastronomy
            </h2>
            <GoldDivider className="my-4" />
            <p className="font-serif italic text-base text-[#a5a8b5]">
              A glimpse into our seasonal creations — woodfire seared, botanical infused, and finished with rare vintage reductions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {signatureDishes.map((item) => (
              <DishCard key={item.id} item={item} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/menu"
              className="inline-flex w-full sm:w-auto justify-center items-center gap-2 bg-gradient-to-r from-[#d4af37] via-[#f3d994] to-[#caa065] text-[#08090b] font-sans uppercase tracking-[0.12em] sm:tracking-[0.2em] text-[10px] sm:text-xs font-semibold py-4 px-4 sm:px-9 shadow-[0_4px_24px_rgba(212,175,55,0.25)] hover:brightness-105 transition-all leading-relaxed"
            >
              <span>Explore the Complete Seasonal Menu</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </AnimatedSection>

      {/* 4. Interactive Sommelier Palate Pairing Quiz (User requested on HomePage) */}
      <PalateQuiz />

      {/* 5. Atmosphere Bento Preview */}
      <AnimatedSection className="py-20 sm:py-28 bg-[#08090b] border-t border-[#d4af37]/15">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="section-tag">
              The Sanctuary
            </span>
            <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-bold text-[#edebe6] mt-2 mb-4 leading-tight">
              Visual Ambiance
            </h2>
            <GoldDivider className="my-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {previewGallery.map((img) => (
              <div
                key={img.id}
                className="relative overflow-hidden rounded-sm border border-[#d4af37]/25 h-72 group shadow-xl"
              >
                <img
                  src={img.image}
                  srcSet={buildResponsiveImageSrcSet(img.image)}
                  sizes="(max-width: 767px) calc(100vw - 3rem), (max-width: 1023px) 33vw, 400px"
                  alt={img.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#08090b]/90 via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="text-[10px] uppercase tracking-widest text-[#d4af37] block mb-1">
                    {img.category}
                  </span>
                  <h4 className="font-cinzel text-sm sm:text-base text-[#f5eedf] font-semibold">
                    {img.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/gallery"
              className="inline-flex max-w-full items-center gap-2 text-[10px] sm:text-xs uppercase tracking-wider sm:tracking-widest text-[#d4af37] hover:text-[#f7ecd7] border-b border-[#d4af37] pb-1 font-semibold group transition-colors leading-relaxed"
            >
              View Complete Architectural Gallery &amp; Lightbox
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </AnimatedSection>

      {/* 6. Critic Accolades & Guest Reviews (User requested on HomePage) */}
      <Testimonials />

      {/* 7. Full VIP Table Reservation Experience with Visual Salon Selector */}
      <Reservation />
    </div>
  )
}
