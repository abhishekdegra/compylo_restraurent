import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'

interface AnimatedSectionProps {
  children: React.ReactNode
  className?: string
  id?: string
  delay?: number
}

export const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  className,
  id,
  delay = 0,
}) => {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{
        duration: 0.65,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={cn('relative w-full gpu-layer', className)}
    >
      {children}
    </motion.section>
  )
}

