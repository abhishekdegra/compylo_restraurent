import React from 'react'
import { Reservation } from '../components/Reservation'
import { GoldDivider } from '../components/ui/GoldDivider'

export const ReservationPage: React.FC = () => {
  return (
    <div className="pt-24 sm:pt-28 pb-16 overflow-x-hidden">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto px-6 pt-10 sm:pt-14 pb-4">
        <span className="section-tag">
          Bespoke Hospitality &bull; VIP Concierge
        </span>
        <h1 className="font-cinzel text-4xl sm:text-5xl md:text-6xl font-bold text-[#edebe6] mt-2 mb-4 leading-tight">
          Reserve Your Table
        </h1>
        <GoldDivider className="my-5" />
        <p className="font-serif italic text-base sm:text-lg text-[#a5a8b5] font-light max-w-2xl mx-auto leading-relaxed">
          Due to our intimate seating and precision culinary preparation, reservations are confirmed directly via our private WhatsApp Concierge.
        </p>
      </div>

      {/* Reservation Component with Salon Selector */}
      <Reservation />
    </div>
  )
}

