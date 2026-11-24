import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Ensures that navigating between pages instantly resets scroll position to the top
 * without lag or jank, synchronizing with both native window and Lenis smooth scroll.
 */
export const ScrollToTop = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    // Instant scroll to top on route transition
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' as ScrollBehavior,
    })

    // If Lenis is registered on window, also tell it to reset immediately
    if (typeof window !== 'undefined' && (window as unknown as { __lenis?: { scrollTo: (target: number, opts: { immediate: boolean }) => void } }).__lenis) {
      ;(window as unknown as { __lenis: { scrollTo: (target: number, opts: { immediate: boolean }) => void } }).__lenis.scrollTo(0, { immediate: true })
    }
  }, [pathname])

  return null
}
