import React from 'react'
import { Contact } from '../components/Contact'
import { GoldDivider } from '../components/ui/GoldDivider'

export const ContactPage: React.FC = () => {
  return (
    <div className="pt-24 sm:pt-28 pb-16 overflow-x-hidden">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto px-6 pt-10 sm:pt-14 pb-4">
        <span className="section-tag">
          Sanctuary &bull; Hours &bull; Valet
        </span>
        <h1 className="font-cinzel text-4xl sm:text-5xl md:text-6xl font-bold text-[#edebe6] mt-2 mb-4 leading-tight">
          Location &amp; Access
        </h1>
        <GoldDivider className="my-5" />
        <p className="font-serif italic text-base sm:text-lg text-[#a5a8b5] font-light max-w-2xl mx-auto leading-relaxed">
          Conveniently situated in the city's diplomatic quarter with private valet arrival and dedicated concierge reception.
        </p>
      </div>

      {/* Contact Component */}
      <Contact />
    </div>
  )
}

