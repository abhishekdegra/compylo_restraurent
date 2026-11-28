import { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Lenis from 'lenis'
import { ThemeProvider } from './context/ThemeContext'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { Loader } from './components/Loader'
import { FloatingWhatsApp } from './components/FloatingWhatsApp'
import { ScrollToTop } from './components/ScrollToTop'

const BanyanSerpentScroll = lazy(() =>
  import('./components/BanyanSerpentScroll').then((module) => ({ default: module.BanyanSerpentScroll })),
)
const HomePage = lazy(() => import('./pages/HomePage').then((module) => ({ default: module.HomePage })))
const MenuPage = lazy(() => import('./pages/MenuPage').then((module) => ({ default: module.MenuPage })))
const StoryPage = lazy(() => import('./pages/StoryPage').then((module) => ({ default: module.StoryPage })))
const GalleryPage = lazy(() => import('./pages/GalleryPage').then((module) => ({ default: module.GalleryPage })))
const ReservationPage = lazy(() => import('./pages/ReservationPage').then((module) => ({ default: module.ReservationPage })))
const ContactPage = lazy(() => import('./pages/ContactPage').then((module) => ({ default: module.ContactPage })))

export function App() {
  const [loading, setLoading] = useState(true)
  const finishIntro = useCallback(() => setLoading(false), [])

  // Initialize Lenis buttery-smooth momentum scroll with mobile performance calibration
  useEffect(() => {
    // The intro owns the viewport. Starting another permanent animation loop behind
    // it only competes for main-thread time on low-end devices.
    if (loading) return

    // Detect low-power or mobile touch environments
    const isTouch = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Native touch scrolling has lower input latency and avoids a permanent RAF
    // on phones. Reduced-motion users also keep the browser's native behavior.
    if (isTouch || prefersReducedMotion) {
      delete (window as unknown as { __lenis?: Lenis }).__lenis
      return
    }

    const lenis = new Lenis({
      duration: 1.08,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      // Optimized for 60Hz-120Hz mobile screens without touch lag
      touchMultiplier: 1,
    })

    // Store instance on window for coordinated navigation
    ;(window as unknown as { __lenis?: Lenis }).__lenis = lenis

    let rafId = 0
    let rafActive = false
    function raf(time: number) {
      if (!rafActive) return
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }

    const startRaf = () => {
      if (rafActive || document.hidden) return
      rafActive = true
      rafId = requestAnimationFrame(raf)
    }

    const stopRaf = () => {
      rafActive = false
      cancelAnimationFrame(rafId)
    }

    const handleVisibility = () => {
      if (document.hidden) stopRaf()
      else startRaf()
    }

    document.addEventListener('visibilitychange', handleVisibility)
    startRaf()

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility)
      stopRaf()
      lenis.destroy()
      delete (window as unknown as { __lenis?: Lenis }).__lenis
    }
  }, [loading])

  return (
    <ThemeProvider>
      <BrowserRouter>
        <ScrollToTop />
        {loading && <Loader onComplete={finishIntro} />}

        <div inert={loading} className="relative min-h-screen bg-[#08090b] text-[#edebe6] selection:bg-[#d4af37] selection:text-[#08090b] font-sans antialiased overflow-x-clip flex flex-col justify-between transition-colors duration-500">
          {/* Majestic Banyan Tree & Guardian Serpent Scroll Experience */}
          {!loading && (
            <Suspense fallback={null}>
              <BanyanSerpentScroll />
            </Suspense>
          )}

          {/* Spacious Sticky Glass Navbar */}
          <Navbar />

          {/* Dynamic Route Pages */}
          <main className="flex-grow">
            <Suspense fallback={<div className="min-h-screen bg-[#08090b]" aria-hidden="true" />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/story" element={<StoryPage />} />
                <Route path="/menu" element={<MenuPage />} />
                <Route path="/gallery" element={<GalleryPage />} />
                <Route path="/reservation" element={<ReservationPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </main>

          {/* Timeless Footer */}
          <Footer />

          {/* Floating VIP WhatsApp Concierge */}
          <FloatingWhatsApp />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
