import React, { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'

interface MagneticButtonProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  variant?: 'gold' | 'outline' | 'ghost'
  asLink?: boolean
  href?: string
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  className,
  onClick,
  variant = 'gold',
  asLink = false,
  href,
}) => {
  const ref = useRef<HTMLButtonElement | HTMLAnchorElement | null>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const { clientX, clientY } = e
    const { left, top, width, height } = ref.current.getBoundingClientRect()
    const middleX = clientX - (left + width / 2)
    const middleY = clientY - (top + height / 2)
    setPosition({ x: middleX * 0.25, y: middleY * 0.25 })
  }

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 })
  }

  const baseStyles = 'relative inline-flex items-center justify-center font-sans uppercase tracking-[0.2em] text-xs font-semibold py-4 px-8 transition-all duration-300 rounded-none cursor-pointer overflow-hidden group'

  const variants = {
    gold: 'bg-gradient-to-r from-[#d4af37] via-[#f3d994] to-[#caa065] text-[#08090b] shadow-[0_4px_24px_rgba(212,175,55,0.25)] hover:shadow-[0_8px_32px_rgba(212,175,55,0.45)] hover:brightness-105 active:scale-95',
    outline: 'border border-[#d4af37]/60 text-[#f5eedf] hover:border-[#d4af37] hover:bg-[#d4af37]/10 backdrop-blur-sm',
    ghost: 'text-[#d4af37] hover:text-[#f7ecd7] hover:bg-[#d4af37]/5',
  }

  const combinedClass = cn(baseStyles, variants[variant], className)

  const content = (
    <>
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
    </>
  )

  if (asLink && href) {
    return (
      <motion.a
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={href}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        animate={{ x: position.x, y: position.y }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className={combinedClass}
      >
        {content}
      </motion.a>
    )
  }

  return (
    <motion.button
      ref={ref as React.RefObject<HTMLButtonElement>}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      className={combinedClass}
    >
      {content}
    </motion.button>
  )
}

