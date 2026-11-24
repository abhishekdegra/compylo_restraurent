import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'

interface GoldDividerProps {
  className?: string
  withDiamond?: boolean
}

export const GoldDivider: React.FC<GoldDividerProps> = ({
  className,
  withDiamond = true,
}) => {
  return (
    <div className={cn('flex items-center justify-center gap-3 my-6 w-full max-w-md mx-auto', className)}>
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#d4af37]/60 to-[#d4af37]"
      />
      {withDiamond && (
        <motion.div
          initial={{ scale: 0, rotate: 0 }}
          whileInView={{ scale: 1, rotate: 45 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-2 h-2 bg-[#d4af37] shadow-[0_0_8px_#d4af37]"
        />
      )}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-[#d4af37]/60 to-[#d4af37]"
      />
    </div>
  )
}

