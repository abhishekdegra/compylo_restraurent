import { useEffect, useState } from 'react'
import entranceWide from '../assets/kafeholic-entrance-wide.webp'
import entrancePortrait from '../assets/kafeholic-entrance-portrait.webp'
import { SITE_CONFIG } from '../config/site'
import './Loader.css'

interface LoaderProps {
  onComplete: () => void
}

export function Loader({ onComplete }: LoaderProps) {
  const [isReady, setIsReady] = useState(false)
  const [isSkipping, setIsSkipping] = useState(false)
  const [isPortrait] = useState(() => window.matchMedia('(max-aspect-ratio: 4/5)').matches)
  const [reducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const phase = isSkipping ? 'skipping' : isReady ? 'playing' : 'loading'

  useEffect(() => {
    const originalOverflow = document.body.style.overflow
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsSkipping(true)
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onEscape)
    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', onEscape)
    }
  }, [])

  useEffect(() => {
    if (phase === 'loading') {
      const deadline = window.setTimeout(() => setIsSkipping(true), 1_600)
      return () => window.clearTimeout(deadline)
    }

    // The animation-end event is the normal handoff. Cover interrupted and
    // unsupported animations too, so the intro cannot trap a visitor.
    const timeout = phase === 'skipping' || reducedMotion ? 800 : 2_700
    const deadline = window.setTimeout(onComplete, timeout)
    return () => window.clearTimeout(deadline)
  }, [onComplete, phase, reducedMotion])

  return (
    <div
      className="cafe-intro"
      data-phase={phase}
      data-ready={isReady ? '' : undefined}
      data-portrait={isPortrait ? '' : undefined}
      onAnimationEnd={(event) => {
        if (event.target === event.currentTarget) onComplete()
      }}
    >
      <p className="sr-only" role="status">Entering {SITE_CONFIG.name}</p>

      <div className="cafe-intro__frame" aria-hidden="true">
        <div className="cafe-intro__camera">
          <img
            className="cafe-intro__photo"
            src={isPortrait ? entrancePortrait : entranceWide}
            alt=""
            width={isPortrait ? 941 : 1672}
            height={isPortrait ? 1672 : 941}
            fetchPriority="high"
            draggable={false}
            onLoad={() => {
              if (!isSkipping) setIsReady(true)
            }}
            onError={() => setIsSkipping(true)}
          />

          <div className="cafe-intro__doorway">
            <div className="cafe-intro__door cafe-intro__door--left" />
            <div className="cafe-intro__door cafe-intro__door--right" />
          </div>
        </div>
      </div>

      <button
        className="cafe-intro__skip"
        type="button"
        onClick={() => setIsSkipping(true)}
      >
        Skip intro <span aria-hidden="true">→</span>
      </button>
    </div>
  )
}
