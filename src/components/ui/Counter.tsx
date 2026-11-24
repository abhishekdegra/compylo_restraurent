import React, { useEffect, useState, useRef } from 'react'
import { useInView } from 'framer-motion'

interface CounterProps {
  from?: number
  to: number
  duration?: number
  suffix?: string
  prefix?: string
}

export const Counter: React.FC<CounterProps> = ({
  from = 0,
  to,
  duration = 2,
  suffix = '',
  prefix = '',
}) => {
  const [count, setCount] = useState(from)
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  useEffect(() => {
    if (!isInView) return

    let start = from
    const end = to
    const totalFrames = Math.round(duration * 60)
    let frame = 0

    const counter = setInterval(() => {
      frame++
      const progress = frame / totalFrames
      // Ease out cubic
      const easedProgress = 1 - Math.pow(1 - progress, 3)
      const current = Math.round(start + (end - start) * easedProgress)

      setCount(current)

      if (frame === totalFrames) {
        clearInterval(counter)
        setCount(end)
      }
    }, 1000 / 60)

    return () => clearInterval(counter)
  }, [isInView, from, to, duration])

  return (
    <span ref={ref} className="font-serif tracking-tight">
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  )
}

