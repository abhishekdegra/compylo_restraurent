import React from 'react'
import { AnimatedSection } from './ui/AnimatedSection'
import { GoldDivider } from './ui/GoldDivider'
import { MapPin, Phone, Mail, Clock, Car, Shirt } from 'lucide-react'
import { SITE_CONFIG } from '../config/site'

export const Contact: React.FC = () => {
  return (
    <AnimatedSection id="contact" className="py-24 md:py-36 bg-[#08090b] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <span className="section-tag">
            Sanctuary & Hours
          </span>
          <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-bold text-[#edebe6] mt-2 mb-4 tracking-[0.14em] leading-tight">
            Location & Access
          </h2>
          <GoldDivider className="my-5" />
          <p className="font-serif italic text-base sm:text-lg text-[#a5a8b5] font-light max-w-xl mx-auto leading-relaxed mt-4">
            Conveniently situated in the city's diplomatic quarter with private valet arrival.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Stylized Map View */}
          <div className="lg:col-span-7 bg-[#111318] border border-[#d4af37]/25 p-2 rounded-sm shadow-[0_15px_40px_rgba(0,0,0,0.8)] overflow-hidden relative flex flex-col min-h-[420px]">
            {/* Embedded Dark Styled Map */}
            <iframe
              title={`${SITE_CONFIG.name} Fine Dining Location`}
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3501.8906354890666!2d77.22741547631985!3d28.633045375664184!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd37b605929d%3A0x6b4ef8d6139cfc1a!2sConnaught%20Place%2C%20New%20Delhi!5e0!3m2!1sen!2sin!4v1714500000000!5m2!1sen!2sin"
              className="contact-map-iframe w-full h-full min-h-[400px] border-0 filter invert contrast-125 hue-rotate-180 opacity-70 hover:opacity-100 transition-opacity duration-500"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />

            {/* Quick Map Floating Pill */}
            <div className="contact-map-pill absolute bottom-6 left-6 right-6 bg-[#08090b]/90 backdrop-blur-md p-4 border border-[#d4af37]/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-[#d4af37]" />
                <div>
                  <span className="font-cinzel text-xs font-bold text-[#f7ecd7] block">
                    The {SITE_CONFIG.name} Estate
                  </span>
                  <span className="text-[11px] text-[#8a8d98] font-sans">
                    42 King's Promenade, Diplomatic Enclave
                  </span>
                </div>
              </div>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] uppercase tracking-widest text-[#d4af37] hover:underline"
              >
                Directions &rarr;
              </a>
            </div>
          </div>

          {/* Right Column: Contact and Hours */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            {/* Hours Card */}
            <div className="bg-[#111318]/90 border border-[#d4af37]/25 p-8 backdrop-blur-md">
              <div className="flex items-center gap-2 text-[#d4af37] mb-4">
                <Clock className="w-4 h-4" />
                <h3 className="font-cinzel text-sm uppercase tracking-widest font-semibold text-[#f7ecd7]">
                  Hours of Service
                </h3>
              </div>

              <div className="space-y-3.5 text-xs font-sans">
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="text-[#c8cbd5]">Tuesday &ndash; Friday</span>
                  <span className="text-[#f7ecd7] font-medium font-serif text-sm">18:30 &ndash; 23:30</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="text-[#c8cbd5]">Saturday &ndash; Sunday (Lunch)</span>
                  <span className="text-[#f7ecd7] font-medium font-serif text-sm">12:30 &ndash; 15:30</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="text-[#c8cbd5]">Saturday &ndash; Sunday (Dinner)</span>
                  <span className="text-[#f7ecd7] font-medium font-serif text-sm">18:30 &ndash; 00:00</span>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="text-[#8a8d98]">Monday</span>
                  <span className="text-[#d4af37] italic font-serif">Private Salon Booking Only</span>
                </div>
              </div>
            </div>

            {/* Direct Lines */}
            <div className="bg-[#111318]/90 border border-[#d4af37]/25 p-8 backdrop-blur-md">
              <h3 className="font-cinzel text-sm uppercase tracking-widest font-semibold text-[#f7ecd7] mb-4">
                Direct Inquiries
              </h3>

              <div className="space-y-4 text-xs font-sans">
                <a
                  href={`tel:${SITE_CONFIG.phoneTel}`}
                  className="flex items-center gap-3 text-[#c8cbd5] hover:text-[#d4af37] transition-colors"
                >
                  <Phone className="w-4 h-4 text-[#d4af37]" />
                  <span>{SITE_CONFIG.phoneDisplay} &bull; Reservation Desk</span>
                </a>

                <a
                  href={`mailto:${SITE_CONFIG.email}`}
                  className="flex items-center gap-3 text-[#c8cbd5] hover:text-[#d4af37] transition-colors"
                >
                  <Mail className="w-4 h-4 text-[#d4af37]" />
                  <span>{SITE_CONFIG.email}</span>
                </a>

                <div className="flex items-center gap-3 text-[#8a8d98] pt-2 border-t border-white/5">
                  <Car className="w-4 h-4 text-[#d4af37]" />
                  <span>Complimentary Valet Parking at Main Portico</span>
                </div>

                <div className="flex items-center gap-3 text-[#8a8d98]">
                  <Shirt className="w-4 h-4 text-[#d4af37]" />
                  <span>Dress Code: Elegant Evening / Smart Formal</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  )
}

