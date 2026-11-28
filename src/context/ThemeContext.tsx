import React, { createContext, useContext, useEffect, useState } from 'react'

export type CircadianTheme = 'dawn' | 'zenith' | 'dusk' | 'noir'

interface ThemeDetails {
  id: CircadianTheme
  name: string
  shortName: string
  subname: string
  period: string
  hours: string
  icon: string
  accentColor: string
  themeColor: string
}

export const THEME_DETAILS: Record<CircadianTheme, ThemeDetails> = {
  dawn: {
    id: 'dawn',
    name: 'Morning Dawn',
    shortName: 'Dawn',
    subname: 'Fresh Sunrise & Warm Sunlit Gold',
    period: 'Morning Service (05:00 – 12:00)',
    hours: '05:00 – 12:00',
    icon: '⛅',
    accentColor: '#cfa83b',
    themeColor: '#f7f4ed',
  },
  zenith: {
    id: 'zenith',
    name: 'Midday Zenith (White)',
    shortName: 'Zenith',
    subname: 'Pure White Marble & Royal Ivory',
    period: 'Afternoon Service (12:00 – 17:00)',
    hours: '12:00 – 17:00',
    icon: '☀️',
    accentColor: '#b8860b',
    themeColor: '#faf8f5',
  },
  dusk: {
    id: 'dusk',
    name: 'Sunset Dusk (Amber)',
    shortName: 'Dusk',
    subname: 'Warm Sunset Glow & Hearth Embers',
    period: 'Evening Service (17:00 – 21:00)',
    hours: '17:00 – 21:00',
    icon: '🌅',
    accentColor: '#e68a2e',
    themeColor: '#0e090b',
  },
  noir: {
    id: 'noir',
    name: 'Midnight Noir (Black)',
    shortName: 'Noir',
    subname: 'Midnight Obsidian & 24k Fine Leaf Gold',
    period: 'Night Service (21:00 – 05:00)',
    hours: '21:00 – 05:00',
    icon: '🌙',
    accentColor: '#d4af37',
    themeColor: '#08090b',
  },
}

export function getCircadianThemeForHour(hour: number): CircadianTheme {
  if (hour >= 5 && hour < 12) return 'dawn'
  if (hour >= 12 && hour < 17) return 'zenith'
  if (hour >= 17 && hour < 21) return 'dusk'
  return 'noir'
}

interface ThemeContextType {
  theme: CircadianTheme
  isAuto: boolean
  currentTime: string
  setTheme: (theme: CircadianTheme) => void
  toggleAuto: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)
const AUTO_THEME_KEY = 'kafeholic_theme_auto'
const MANUAL_THEME_KEY = 'kafeholic_theme_manual'

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuto, setIsAuto] = useState<boolean>(() => {
    const saved = localStorage.getItem(AUTO_THEME_KEY)
    return saved !== null ? saved === 'true' : true
  })

  const [theme, setCurrentTheme] = useState<CircadianTheme>(() => {
    const savedManual = localStorage.getItem(MANUAL_THEME_KEY) as CircadianTheme | null
    const savedAuto = localStorage.getItem(AUTO_THEME_KEY)
    const autoEnabled = savedAuto !== null ? savedAuto === 'true' : true

    if (!autoEnabled && savedManual && THEME_DETAILS[savedManual]) {
      return savedManual
    }
    const currentHour = new Date().getHours()
    return getCircadianThemeForHour(currentHour)
  })

  const [currentTime, setCurrentTime] = useState<string>(() => {
    const now = new Date()
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
  })

  // Clock tick & Circadian auto-updater every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }))

      if (isAuto) {
        const correctTheme = getCircadianThemeForHour(now.getHours())
        setCurrentTheme((prev) => (prev !== correctTheme ? correctTheme : prev))
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [isAuto])

  // Apply theme to HTML attribute & mobile status bar meta tag
  useEffect(() => {
    const root = document.documentElement
    root.setAttribute('data-theme', theme)

    const metaThemeColor = document.querySelector('meta[name="theme-color"]')
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', THEME_DETAILS[theme].themeColor)
    }

    if (isAuto) {
      localStorage.setItem(AUTO_THEME_KEY, 'true')
    } else {
      localStorage.setItem(AUTO_THEME_KEY, 'false')
      localStorage.setItem(MANUAL_THEME_KEY, theme)
    }
  }, [theme, isAuto])

  const setTheme = (newTheme: CircadianTheme) => {
    setIsAuto(false)
    setCurrentTheme(newTheme)
  }

  const toggleAuto = () => {
    const nextAuto = !isAuto
    setIsAuto(nextAuto)
    if (nextAuto) {
      const currentHour = new Date().getHours()
      setCurrentTheme(getCircadianThemeForHour(currentHour))
    }
  }

  return (
    <ThemeContext.Provider value={{ theme, isAuto, currentTime, setTheme, toggleAuto }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useCircadianTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useCircadianTheme must be used within a ThemeProvider')
  }
  return context
}
