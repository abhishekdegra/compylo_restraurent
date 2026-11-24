import { useEffect, useRef, useState, useMemo } from 'react'
import { useCircadianTheme } from '../context/ThemeContext'
import banyanTreeNight from '../assets/banyan-tree-night.webp'
import banyanTreeDay from '../assets/banyan-tree-day.webp'

interface Particle {
  x: number
  y: number
  size: number
  speedY: number
  opacity: number
  pulse: number
  pulseSpeed: number
}

interface SpinePoint3D {
  x: number
  y: number
  z: number
  radius: number
  angle: number
  progress: number
  normalX: number
  normalY: number
}

interface SnakeTrailPoint {
  y: number
  theta: number
}

export function BanyanSerpentScroll() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const { theme } = useCircadianTheme()
  const [isVisible, setIsVisible] = useState(true)

  // Dedicated dual-calibrated textures for Dark (Noir/Dusk) and Sunlit Day (Dawn/Zenith)
  const banyanTextureDarkRef = useRef<HTMLImageElement | null>(null)
  const banyanTextureDayRef = useRef<HTMLImageElement | null>(null)
  const serpentTrailRef = useRef<SnakeTrailPoint[]>([])

  // Scroll tracking with true living serpent follow-the-leader kinematics:
  // headT = 0 means head is at bottom leading DOWN; headT = 1 means head is at top leading UP!
  const scrollStateRef = useRef({
    targetProgress: 0,
    currentProgress: 0,
    velocity: 0,
    lastScrollY: 0,
    slitherPhase: 0,
    tongueFlick: 0,
    tongueCooldown: 0,
    isTreeLoaded: false,
    headingDirection: 1, // 1 for down, -1 for reverse scroll up
    turnEnergy: 0, // 1 -> 0 during a direction change; keeps the turn rooted at the snout
    turnSide: 1,
    laneAngle: 0,
    targetLaneAngle: 0,
    smoothHeadAngle: 0, // smooth rotation angle
  })

  // Theme-specific authentic predator palettes (Fine Dining & Dangerous Python)
  const palette = useMemo(() => {
    switch (theme) {
      case 'zenith': // Midday Pure White Marble & Royal Sunlit Gold
        return {
          barkBackdrop: 'rgba(225, 190, 85, 0.12)',
          // Menacing Royal Sunlit Gold & Warm Espresso Python
          snakeSkinBase: '#1a120a',
          snakeSaddle: '#3c2211',
          snakeScaleGlint: '#d4af37',
          snakeHighRidge: '#fef08a',
          snakeBelly: '#f4ede0',
          castShadow: 'rgba(80, 50, 18, 0.35)', // Warm sunlit amber shadow
          eyeIris: '#d97706', // Piercing predatory amber
          eyePupil: '#020202',
          tongue: '#831843',
          spore: 'rgba(212, 160, 23, 0.65)',
          leafDark: '#143823',
          leafMid: '#245a3a',
          leafGold: '#eab308',
        }
      case 'dusk': // Sunset Amber Hearth
        return {
          barkBackdrop: 'rgba(234, 88, 12, 0.25)',
          // Menacing Blood Python / Copperhead
          snakeSkinBase: '#0d0402',
          snakeSaddle: '#260b05',
          snakeScaleGlint: '#ea580c',
          snakeHighRidge: '#f97316',
          snakeBelly: '#dfb791',
          castShadow: 'rgba(0, 0, 0, 0.75)',
          eyeIris: '#dc2626', // Lethal crimson ruby eye
          eyePupil: '#020101',
          tongue: '#881337',
          spore: 'rgba(234, 88, 12, 0.5)',
          leafDark: '#0f2214',
          leafMid: '#1d4826',
          leafGold: '#ea580c',
        }
      case 'dawn': // Morning Champagne & Sunlit Mist
        return {
          barkBackdrop: 'rgba(217, 180, 75, 0.14)',
          // Menacing Golden Tree Python
          snakeSkinBase: '#160f07',
          snakeSaddle: '#36220d',
          snakeScaleGlint: '#eab308',
          snakeHighRidge: '#fef08a',
          snakeBelly: '#f5efe2',
          castShadow: 'rgba(80, 50, 18, 0.32)',
          eyeIris: '#059669', // Lethal venomous emerald eye
          eyePupil: '#022013',
          tongue: '#9d174d',
          spore: 'rgba(217, 180, 75, 0.65)',
          leafDark: '#143823',
          leafMid: '#245a3a',
          leafGold: '#eab308',
        }
      case 'noir': // Midnight Obsidian & 24k Fine Leaf Gold
      default:
        return {
          barkBackdrop: 'rgba(10, 6, 4, 0.55)',
          // Menacing Black King Python with 24k Gold Reticulations
          snakeSkinBase: '#08080b',
          snakeSaddle: '#18171f',
          snakeScaleGlint: '#d4af37',
          snakeHighRidge: '#e6c86e',
          snakeBelly: '#b5b2a3',
          castShadow: 'rgba(0, 0, 0, 0.85)',
          eyeIris: '#10b981', // Cold predatory emerald eye
          eyePupil: '#011208',
          tongue: '#4c0519', // Sinister dark crimson
          spore: 'rgba(212, 175, 55, 0.55)',
          leafDark: '#05160d',
          leafMid: '#0c351e',
          leafGold: '#d4af37',
        }
    }
  }, [theme])

  // Preprocessed full-resolution textures keep the original detail while moving
  // expensive background extraction and color grading out of the browser.
  useEffect(() => {
    let cancelled = false
    let loadedTextures = 0

    const loadTexture = (
      source: string,
      target: { current: HTMLImageElement | null },
    ) => {
      const image = new Image()
      image.decoding = 'async'
      image.onload = () => {
        if (cancelled) return
        target.current = image
        loadedTextures += 1
        if (loadedTextures === 2) {
          scrollStateRef.current.isTreeLoaded = true
        }
      }
      image.src = source
    }

    loadTexture(banyanTreeNight, banyanTextureDarkRef)
    loadTexture(banyanTreeDay, banyanTextureDayRef)

    return () => {
      cancelled = true
    }
  }, [])

  // Scroll listener with calm, smooth interpolation, reverse detection, and Lenis integration
  useEffect(() => {
    const requestHeading = (direction: 1 | -1) => {
      const state = scrollStateRef.current
      if (state.headingDirection !== direction) {
        state.headingDirection = direction
        state.turnEnergy = 1
        // Upward reversal curls left-to-right; downward travel mirrors it.
        state.turnSide = direction > 0 ? -1 : 1
        state.targetLaneAngle += state.turnSide * Math.PI
        state.tongueFlick = Math.max(state.tongueFlick, 18)
      }
    }

    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollTop = window.scrollY || document.documentElement.scrollTop
      const progress = docHeight > 0 ? Math.min(1, Math.max(0, scrollTop / docHeight)) : 0

      const delta = scrollTop - scrollStateRef.current.lastScrollY
      scrollStateRef.current.velocity = delta
      scrollStateRef.current.lastScrollY = scrollTop
      scrollStateRef.current.targetProgress = progress

      // Reverse direction detection on scroll
      if (delta > 0.4) {
        requestHeading(1)
      } else if (delta < -0.4) {
        requestHeading(-1)
      }

      if (Math.abs(delta) > 0.8 && scrollStateRef.current.tongueCooldown <= 0) {
        scrollStateRef.current.tongueFlick = 34
        scrollStateRef.current.tongueCooldown = 45
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    let lenisTimer: number | null = null
    let lenisAttempts = 0
    const checkLenis = () => {
      const lenis = (
        window as unknown as {
          __lenis?: {
            direction?: number
            velocity?: number
            on: (event: string, cb: (e: { progress?: number; velocity?: number; direction?: number }) => void) => void
          }
        }
      ).__lenis

      if (lenis && typeof lenis.on === 'function') {
        lenis.on('scroll', (e) => {
          if (typeof e.progress === 'number') {
            scrollStateRef.current.targetProgress = Math.min(1, Math.max(0, e.progress))
          }
          if (typeof e.direction === 'number' && e.direction !== 0) {
            requestHeading(e.direction > 0 ? 1 : -1)
          } else if (typeof e.velocity === 'number') {
            if (e.velocity > 0.05) {
              requestHeading(1)
            } else if (e.velocity < -0.05) {
              requestHeading(-1)
            }
          }

          if (typeof e.velocity === 'number') {
            scrollStateRef.current.velocity = e.velocity * 3.0
            if (Math.abs(e.velocity) > 0.10 && scrollStateRef.current.tongueCooldown <= 0) {
              scrollStateRef.current.tongueFlick = 34
              scrollStateRef.current.tongueCooldown = 45
            }
          }
        })
      } else if (lenisAttempts < 20) {
        lenisAttempts++
        lenisTimer = window.setTimeout(checkLenis, 300)
      }
    }

    checkLenis()
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (lenisTimer) clearTimeout(lenisTimer)
    }
  }, [])

  // Canvas Render Loop (60Hz - 120Hz ProMotion Calibrated)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true })
    if (!ctx) return

    let animationFrameId: number
    let width = 0
    let height = 0
    let lastTimestamp = performance.now()
    let lastPaintTimestamp = 0
    let resizeFrameId = 0
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const deviceMemory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8
    const lowPowerDevice = navigator.hardwareConcurrency <= 4 || deviceMemory <= 4

    // Setup high-DPI canvas
    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const rect = canvas.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) return
      const nextWidth = rect.width
      const nextHeight = rect.height
      if (width > 0 && (Math.abs(nextWidth - width) > 8 || Math.abs(nextHeight - height) > 120)) {
        serpentTrailRef.current = []
      }
      width = nextWidth
      height = nextHeight
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.scale(dpr, dpr)
    }

    const scheduleResize = () => {
      window.cancelAnimationFrame(resizeFrameId)
      resizeFrameId = window.requestAnimationFrame(resizeCanvas)
    }

    resizeCanvas()
    window.addEventListener('resize', scheduleResize, { passive: true })

    // Floating sacred golden spores
    const particles: Particle[] = Array.from({ length: 18 }, () => ({
      x: Math.random() * 85 + 10,
      y: Math.random() * (window.innerHeight || 800),
      size: Math.random() * 1.8 + 0.6,
      speedY: (Math.random() * 0.3 + 0.08) * (Math.random() > 0.5 ? 1 : -1),
      opacity: Math.random() * 0.5 + 0.2,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: Math.random() * 0.025 + 0.01,
    }))

    // Rich botanical banyan leaf clusters along branches
    const richFoliageClusters = [
      { yRatio: 0.06, xOffset: 20, count: 6, rot: -0.22, scale: 0.95 },
      { yRatio: 0.18, xOffset: -8, count: 5, rot: 0.30, scale: 0.85 },
      { yRatio: 0.35, xOffset: 20, count: 6, rot: -0.18, scale: 0.90 },
      { yRatio: 0.52, xOffset: -9, count: 5, rot: 0.26, scale: 0.85 },
      { yRatio: 0.70, xOffset: 18, count: 6, rot: -0.15, scale: 0.90 },
      { yRatio: 0.88, xOffset: -6, count: 5, rot: 0.24, scale: 0.82 },
    ]

    // Render loop with Frame-Rate Independent Delta-Time Physics
    const render = () => {
      if (document.hidden) {
        lastTimestamp = performance.now()
        animationFrameId = requestAnimationFrame(render)
        return
      }

      if (!ctx || width === 0 || height === 0) {
        resizeCanvas()
        animationFrameId = requestAnimationFrame(render)
        return
      }

      const now = performance.now()
      const state = scrollStateRef.current
      const resting = Math.abs(state.targetProgress - state.currentProgress) < 0.00008 && Math.abs(state.velocity) < 0.025
      const targetFrameTime = reducedMotionQuery.matches
        ? 80
        : lowPowerDevice
          ? resting ? 42 : 28
          : resting ? 34 : 16
      if (now - lastPaintTimestamp < targetFrameTime) {
        animationFrameId = requestAnimationFrame(render)
        return
      }
      lastPaintTimestamp = now

      const dt = Math.min(0.064, (now - lastTimestamp) * 0.001)
      lastTimestamp = now

      ctx.clearRect(0, 0, width, height)

      // Continuous movement detection with hysteresis
      const moveDelta = state.targetProgress - state.currentProgress
      if (moveDelta > 0.0003) {
        if (state.headingDirection !== 1) {
          state.headingDirection = 1
          state.turnEnergy = 1
          state.turnSide = -1
          state.targetLaneAngle += state.turnSide * Math.PI
        }
      } else if (moveDelta < -0.0003) {
        if (state.headingDirection !== -1) {
          state.headingDirection = -1
          state.turnEnergy = 1
          state.turnSide = 1
          state.targetLaneAngle += state.turnSide * Math.PI
        }
      }

      // Reversal is a real half-orbit around the trunk. The head changes lanes
      // first and vertical travel resumes progressively as it becomes aligned.
      const laneDiff = state.targetLaneAngle - state.laneAngle
      const laneTurnFactor = 1 - Math.exp(-5.4 * dt)
      state.laneAngle += laneDiff * laneTurnFactor
      const laneMisalignment = Math.min(1, Math.abs(laneDiff) / Math.PI)
      state.turnEnergy = laneMisalignment
      const turnTravelFactor = 0.06 + Math.pow(1 - laneMisalignment, 2) * 0.94
      const smoothFactor = (1 - Math.exp(-8.5 * dt)) * turnTravelFactor
      state.currentProgress += moveDelta * smoothFactor

      const velDecay = Math.exp(-4.5 * dt)
      state.velocity *= velDecay

      const isMoving = Math.abs(state.velocity) > 0.08 || Math.abs(moveDelta) > 0.0003
      // Undulation wave travels along body in travel direction
      const waveDirection = state.headingDirection > 0 ? 1 : -1
      const slitherSpeed = (isMoving ? (state.velocity * 0.010 + (waveDirection * 0.022)) : 0.004) * (dt * 60)
      state.slitherPhase += slitherSpeed

      if (state.tongueCooldown > 0) state.tongueCooldown--
      if (state.tongueFlick > 0) state.tongueFlick--

      const time = now * 0.001
      const isLightMode = theme === 'zenith' || theme === 'dawn'

      // Bottom-anchored living-banyan motion. A tiny scroll gust is layered over
      // two slow breeze frequencies so the movement never feels mechanical.
      const scrollGust = Math.max(-1, Math.min(1, state.velocity * 0.035))
      const breezeSwayAngle =
        Math.sin(time * 0.42) * 0.0052 +
        Math.sin(time * 0.17 + 1.8) * 0.0024 +
        scrollGust * 0.0018

      // -----------------------------------------------------------------
      // RESPONSIVE CALIBRATION: FULL MOBILE ZERO-CLIPPING GEOMETRY
      // -----------------------------------------------------------------
      const isMobile = width < 80
      const scaleMultiplier = isMobile ? 0.60 : 1.0

      // Trunk Geometry calibrated strictly inside canvas bounds
      const trunkCenterX = isMobile ? Math.floor(width * 0.48) : Math.min(width * 0.44, 50)
      const trunkRadiusBase = isMobile ? 9.5 : 19.0
      const maxBodyRadius = isMobile ? 7.0 : 13.5
      const baseNeckRadius = isMobile ? 4.5 : 8.2

      const getTrunkAt = (y: number) => {
        const curveAmp = isMobile ? 2.5 : 5.5
        const curve =
          Math.sin((y / height) * Math.PI * 2.5 + 0.2) * curveAmp +
          Math.cos((y / height) * Math.PI * 1.2) * (curveAmp * 0.5)
        const anchoredSway = (height - y) * Math.sin(breezeSwayAngle)
        return {
          x: trunkCenterX + curve + anchoredSway,
          radius: trunkRadiusBase,
        }
      }

      // ===================================================================
      // 1. CALCULATE 3D SPINE POINTS ALONG HELICAL COILS
      // ===================================================================
      const minY = isMobile ? 38 : 55
      const maxY = isMobile ? height - 48 : height - 65
      const headY = minY + state.currentProgress * (maxY - minY)

      const totalTurns = 1.7
      const totalThetaSpan = totalTurns * Math.PI * 2

      const snakeVerticalSpan = isMobile ? Math.min(220, height * 0.36) : Math.min(340, height * 0.46)
      const segmentCount = isMobile ? 120 : 160
      const helixPitch = totalThetaSpan / snakeVerticalSpan
      const coilPathRadius = trunkRadiusBase + maxBodyRadius * 0.72
      const bodyPathLength = Math.hypot(snakeVerticalSpan, totalThetaSpan * coilPathRadius)
      const headTheta = headY * helixPitch + state.laneAngle
      const headTrailPoint: SnakeTrailPoint = { y: headY, theta: headTheta }
      const trail = serpentTrailRef.current

      // Seed a perfectly spaced helix once. Afterwards the body is composed only
      // from positions actually travelled by the head, so it cannot squash or flip.
      if (trail.length === 0) {
        const seedCount = segmentCount * 2
        for (let i = 0; i < seedCount; i++) {
          const progress = i / (seedCount - 1)
          const y = headY - state.headingDirection * progress * snakeVerticalSpan * 1.18
          trail.push({
            y,
            theta: y * helixPitch + state.laneAngle,
          })
        }
      } else {
        const previousHead = trail[0]
        const deltaY = headTrailPoint.y - previousHead.y
        const deltaTheta = headTrailPoint.theta - previousHead.theta
        const travelled = Math.hypot(deltaY, deltaTheta * coilPathRadius)

        if (travelled > 0.32) {
          const insertionSteps = Math.min(18, Math.max(1, Math.ceil(travelled / 2.6)))
          const inserted: SnakeTrailPoint[] = []
          for (let step = insertionSteps; step >= 1; step--) {
            const t = step / insertionSteps
            inserted.push({
              y: previousHead.y + deltaY * t,
              theta: previousHead.theta + deltaTheta * t,
            })
          }
          trail.unshift(...inserted)
        } else {
          trail[0] = headTrailPoint
        }
      }

      // Retain a little extra history for clean tail interpolation, but never let
      // the trail grow with page lifetime.
      let retainedLength = 0
      let retainedPoints = trail.length
      for (let i = 1; i < trail.length; i++) {
        const a = trail[i - 1]
        const b = trail[i]
        retainedLength += Math.hypot(a.y - b.y, (a.theta - b.theta) * coilPathRadius)
        if (retainedLength >= bodyPathLength * 1.12) {
          retainedPoints = i + 1
          break
        }
      }
      if (retainedPoints < trail.length) trail.length = retainedPoints

      // Arc-length resampling keeps every body segment at a fixed distance from
      // its neighbours, including through a complete direction reversal.
      const sampledTrail: SnakeTrailPoint[] = []
      let trailCursor = 0
      let traversedLength = 0
      for (let i = 0; i < segmentCount; i++) {
        const targetLength = (i / (segmentCount - 1)) * bodyPathLength

        while (trailCursor + 1 < trail.length) {
          const a = trail[trailCursor]
          const b = trail[trailCursor + 1]
          const segmentLength = Math.hypot(a.y - b.y, (a.theta - b.theta) * coilPathRadius)
          if (traversedLength + segmentLength >= targetLength) {
            const t = segmentLength > 0 ? (targetLength - traversedLength) / segmentLength : 0
            sampledTrail.push({
              y: a.y + (b.y - a.y) * t,
              theta: a.theta + (b.theta - a.theta) * t,
            })
            break
          }
          traversedLength += segmentLength
          trailCursor++
        }

        if (sampledTrail.length <= i) {
          sampledTrail.push(trail[trail.length - 1] || headTrailPoint)
        }
      }

      const spine3D: SpinePoint3D[] = []

      for (let i = 0; i < segmentCount; i++) {
        const progress = i / (segmentCount - 1)
        const trailPoint = sampledTrail[i]
        const segTheta = trailPoint.theta
        const segY = trailPoint.y
        const trunk = getTrunkAt(segY)

        // DUAL-HARMONIC SLITHER ANIMATION WAVE:
        const wave1 = Math.sin(state.slitherPhase - progress * Math.PI * 2.5) * (2.8 * scaleMultiplier)
        const wave2 = Math.sin(state.slitherPhase * 2.0 - progress * Math.PI * 5.0) * (1.0 * scaleMultiplier)
        const undulationWave = wave1 + wave2

        // Girth breathing pulse:
        const breathingPulse = Math.sin(time * 1.6 + progress * Math.PI) * (0.6 * scaleMultiplier)

        // DYNAMIC ANATOMICAL TAPERING FROM THE PERMANENT LEADING HEAD:
        // distFromHead = 0 at the neck, 0.4 at thickest muscle, 1.0 at tail tip.
        const distFromHead = progress
        let segRadius: number
        if (distFromHead < 0.06) {
          segRadius = baseNeckRadius - distFromHead * (12 * scaleMultiplier)
        } else if (distFromHead < 0.45) {
          const bp = (distFromHead - 0.06) / 0.39
          segRadius = baseNeckRadius + Math.sin(bp * Math.PI) * (maxBodyRadius - baseNeckRadius)
        } else {
          const tp = (distFromHead - 0.45) / 0.55
          segRadius = Math.max(1.8 * scaleMultiplier, maxBodyRadius - tp * (maxBodyRadius - 1.8 * scaleMultiplier))
        }

        const gripDistance = trunk.radius + segRadius - (0.8 * scaleMultiplier) + breathingPulse

        const segX = trunk.x + gripDistance * Math.sin(segTheta) + undulationWave * Math.cos(segTheta)
        const segZ = gripDistance * Math.cos(segTheta)

        spine3D.push({
          x: segX,
          y: segY,
          z: segZ,
          radius: segRadius,
          angle: 0,
          progress,
          normalX: 0,
          normalY: 0,
        })
      }

      // Calculate tangent angle and normal vectors along spine
      for (let i = 0; i < segmentCount; i++) {
        let dx: number
        let dy: number
        if (i < segmentCount - 1) {
          dx = spine3D[i].x - spine3D[i + 1].x
          dy = spine3D[i].y - spine3D[i + 1].y
        } else {
          dx = spine3D[i - 1].x - spine3D[i].x
          dy = spine3D[i - 1].y - spine3D[i].y
        }
        const len = Math.hypot(dx, dy) || 0.001
        spine3D[i].angle = Math.atan2(dy, dx)
        spine3D[i].normalX = -dy / len
        spine3D[i].normalY = dx / len
      }

      // ===================================================================
      // HEAD ORIENTATION & LEADING SLITHER VECTOR
      // ===================================================================
      const headPtIndex = 0
      const headPt = spine3D[headPtIndex]

      const nextNeckPoint = spine3D[Math.min(segmentCount - 1, 3)]
      const bodyTangentAngle = Math.atan2(headPt.y - nextNeckPoint.y, headPt.x - nextNeckPoint.x)
      const headTangentAngle = bodyTangentAngle

      // Snout is at (0, +headLength) in skull coordinates, so target angle = tangent - PI/2
      const targetHeadAngle = headTangentAngle - Math.PI / 2

      let angleDiff = targetHeadAngle - state.smoothHeadAngle
      while (angleDiff > Math.PI) angleDiff -= Math.PI * 2
      while (angleDiff < -Math.PI) angleDiff += Math.PI * 2
      if (Math.abs(angleDiff) > Math.PI - 0.08) {
        angleDiff = Math.abs(angleDiff) * state.turnSide
      }

      const headAngleTurnSpeed = 1 - Math.exp(-7.5 * dt)
      state.smoothHeadAngle += angleDiff * headAngleTurnSpeed

      // Split coils into continuous chunks based on Z depth
      interface Chunk {
        startIndex: number
        endIndex: number
        isFront: boolean
      }

      const chunks: Chunk[] = []
      const occlusionTransitions: number[] = []
      let currentChunk: Chunk = {
        startIndex: 0,
        endIndex: 0,
        isFront: spine3D[0].z >= 0,
      }

      for (let i = 1; i < segmentCount; i++) {
        const isFront = spine3D[i].z >= 0
        if (isFront === currentChunk.isFront) {
          currentChunk.endIndex = i
        } else {
          occlusionTransitions.push(i)
          chunks.push({ ...currentChunk })
          currentChunk = {
            startIndex: i - 1,
            endIndex: i,
            isFront,
          }
        }
      }
      chunks.push(currentChunk)

      // Helper to render an unbroken, smooth, continuous muscular ribbon path
      const renderContinuousRibbon = (startIdx: number, endIdx: number, isFront: boolean) => {
        if (startIdx >= endIdx) return

        ctx.save()

        const leftContour: { x: number; y: number }[] = []
        const rightContour: { x: number; y: number }[] = []

        for (let i = startIdx; i <= endIdx; i++) {
          const pt = spine3D[i]
          const r = pt.radius
          leftContour.push({
            x: pt.x - pt.normalX * r,
            y: pt.y - pt.normalY * r,
          })
          rightContour.push({
            x: pt.x + pt.normalX * r,
            y: pt.y + pt.normalY * r,
          })
        }

        ctx.beginPath()
        ctx.moveTo(leftContour[0].x, leftContour[0].y)
        for (let i = 1; i < leftContour.length; i++) {
          ctx.lineTo(leftContour[i].x, leftContour[i].y)
        }
        const lastPt = spine3D[endIdx]
        ctx.arc(lastPt.x, lastPt.y, lastPt.radius, spine3D[endIdx].angle - Math.PI / 2, spine3D[endIdx].angle + Math.PI / 2, false)
        for (let i = rightContour.length - 1; i >= 0; i--) {
          ctx.lineTo(rightContour[i].x, rightContour[i].y)
        }
        const firstPt = spine3D[startIdx]
        ctx.arc(firstPt.x, firstPt.y, firstPt.radius, spine3D[startIdx].angle + Math.PI / 2, spine3D[startIdx].angle - Math.PI / 2, false)
        ctx.closePath()

        if (!isFront) {
          ctx.fillStyle = palette.snakeSkinBase
          ctx.fill()
          ctx.restore()
          return
        }

        // IN FRONT OF TRUNK: Rich photorealistic 3D cylindrical skin
        ctx.fillStyle = palette.snakeSkinBase
        ctx.fill()
        ctx.clip()

        // Naturally blended pale belly plates
        ctx.beginPath()
        ctx.moveTo(leftContour[0].x, leftContour[0].y)
        for (let i = 1; i < leftContour.length; i++) {
          ctx.lineTo(leftContour[i].x, leftContour[i].y)
        }
        for (let i = leftContour.length - 1; i >= 0; i--) {
          const pt = spine3D[startIdx + i]
          ctx.lineTo(pt.x - pt.normalX * (pt.radius * 0.35), pt.y - pt.normalY * (pt.radius * 0.35))
        }
        ctx.closePath()
        ctx.fillStyle = palette.snakeBelly
        ctx.globalAlpha = 0.65
        ctx.fill()
        ctx.globalAlpha = 1.0

        // Bespoke reticulated saddles: dark muscular plates with fine metallic
        // geometry. Thin lines read more convincingly than bright gold dots.
        const saddleStep = isMobile ? 4 : 3
        for (let i = startIdx; i <= endIdx; i += saddleStep) {
          const pt = spine3D[i]
          const r = pt.radius

          ctx.beginPath()
          ctx.ellipse(pt.x + pt.normalX * (r * 0.08), pt.y + pt.normalY * (r * 0.08), r * 0.75, r * 0.55, pt.angle, 0, Math.PI * 2)
          ctx.fillStyle = palette.snakeSaddle
          ctx.globalAlpha = 0.88
          ctx.fill()
          ctx.globalAlpha = 1

          ctx.beginPath()
          ctx.ellipse(pt.x + pt.normalX * (r * 0.08), pt.y + pt.normalY * (r * 0.08), r * 0.52, r * 0.34, pt.angle, 0, Math.PI * 2)
          ctx.strokeStyle = palette.snakeScaleGlint
          ctx.lineWidth = Math.max(0.45, 0.72 * scaleMultiplier)
          ctx.globalAlpha = 0.58
          ctx.stroke()
          ctx.globalAlpha = 1

          if ((i - startIdx) % (saddleStep * 3) === 0) {
            ctx.beginPath()
            ctx.arc(pt.x + pt.normalX * (r * 0.24), pt.y + pt.normalY * (r * 0.24), Math.max(0.45, r * 0.075), 0, Math.PI * 2)
            ctx.fillStyle = palette.snakeHighRidge
            ctx.globalAlpha = 0.72
            ctx.fill()
            ctx.globalAlpha = 1
          }
        }

        // Continuous Muscular Specular Sheen along the spine ridge
        ctx.beginPath()
        for (let i = startIdx; i <= endIdx; i++) {
          const pt = spine3D[i]
          const sx = pt.x + pt.normalX * (pt.radius * 0.22)
          const sy = pt.y + pt.normalY * (pt.radius * 0.22)
          if (i === startIdx) ctx.moveTo(sx, sy)
          else ctx.lineTo(sx, sy)
        }
        ctx.strokeStyle = palette.snakeHighRidge
        ctx.lineWidth = 2.2 * scaleMultiplier
        ctx.globalAlpha = 0.50
        ctx.lineCap = 'round'
        ctx.stroke()
        ctx.globalAlpha = 1.0

        ctx.restore()
      }

      // ===================================================================
      // REUSABLE PREDATOR HEAD SCULPT (PINNED AT NECK JOINT (0, 0))
      // ===================================================================
      const drawPredatorHead = (isFrontPass: boolean) => {
        ctx.save()
        ctx.translate(headPt.x, headPt.y)
        ctx.rotate(state.smoothHeadAngle)

        const headLength = 23 * scaleMultiplier
        const headWidth = 14.5 * scaleMultiplier
        const snoutX = 6.5 * scaleMultiplier
        const neckHalfW = baseNeckRadius * 0.75

        if (isFrontPass) {
          // Soft drop shadow of head onto trunk
          ctx.beginPath()
          ctx.ellipse(0, 8 * scaleMultiplier, 9 * scaleMultiplier, 14 * scaleMultiplier, 0, 0, Math.PI * 2)
          ctx.fillStyle = palette.castShadow
          ctx.filter = isLightMode ? 'blur(3px)' : 'blur(4px)'
          ctx.fill()
          ctx.filter = 'none'
        }

        // ARROWHEAD VIPER/PYTHON SKULL
        ctx.beginPath()
        ctx.moveTo(-neckHalfW, 0)
        ctx.bezierCurveTo(
          -headWidth, headLength * 0.22,
          -headWidth, headLength * 0.58,
          -snoutX, headLength * 0.88
        )
        ctx.lineTo(0, headLength)
        ctx.lineTo(snoutX, headLength * 0.88)
        ctx.bezierCurveTo(
          headWidth, headLength * 0.58,
          headWidth, headLength * 0.22,
          neckHalfW, 0
        )
        ctx.closePath()

        if (!isFrontPass) {
          ctx.fillStyle = palette.snakeSkinBase
          ctx.fill()
          ctx.restore()
          return
        }

        // Front-of-trunk pass: obsidian skull, bronze crown and hard sculpted edges.
        const headGrad = ctx.createLinearGradient(-headWidth, 0, headWidth, 0)
        headGrad.addColorStop(0, palette.snakeSkinBase)
        headGrad.addColorStop(0.24, palette.snakeSaddle)
        headGrad.addColorStop(0.50, palette.snakeScaleGlint)
        headGrad.addColorStop(0.76, palette.snakeSaddle)
        headGrad.addColorStop(1, palette.snakeSkinBase)
        ctx.fillStyle = headGrad
        ctx.shadowColor = palette.castShadow
        ctx.shadowBlur = 7 * scaleMultiplier
        ctx.fill()
        ctx.shadowBlur = 0
        ctx.lineWidth = 1.25 * scaleMultiplier
        ctx.strokeStyle = palette.snakeHighRidge
        ctx.globalAlpha = 0.72
        ctx.stroke()
        ctx.globalAlpha = 1

        // Matte temporal armour plates keep the head dangerous, not ornamental.
        ctx.beginPath()
        ctx.moveTo(-neckHalfW * 0.55, headLength * 0.08)
        ctx.quadraticCurveTo(-headWidth * 0.92, headLength * 0.34, -headWidth * 0.62, headLength * 0.66)
        ctx.lineTo(-4.2 * scaleMultiplier, headLength * 0.58)
        ctx.closePath()
        ctx.moveTo(neckHalfW * 0.55, headLength * 0.08)
        ctx.quadraticCurveTo(headWidth * 0.92, headLength * 0.34, headWidth * 0.62, headLength * 0.66)
        ctx.lineTo(4.2 * scaleMultiplier, headLength * 0.58)
        ctx.closePath()
        ctx.fillStyle = palette.snakeSkinBase
        ctx.globalAlpha = 0.92
        ctx.fill()
        ctx.globalAlpha = 1

        // Central reticulated crown: narrow and blade-like.
        ctx.beginPath()
        ctx.moveTo(0, headLength * 0.84)
        ctx.lineTo(2.7 * scaleMultiplier, headLength * 0.44)
        ctx.lineTo(0, headLength * 0.10)
        ctx.lineTo(-2.7 * scaleMultiplier, headLength * 0.44)
        ctx.closePath()
        const crestGradient = ctx.createLinearGradient(-3 * scaleMultiplier, 0, 3 * scaleMultiplier, 0)
        crestGradient.addColorStop(0, palette.snakeSaddle)
        crestGradient.addColorStop(0.5, palette.snakeHighRidge)
        crestGradient.addColorStop(1, palette.snakeSaddle)
        ctx.fillStyle = crestGradient
        ctx.fill()

        // Micro scales catch light only on the crown ridge.
        for (let scale = 0; scale < 4; scale++) {
          const sy = headLength * (0.24 + scale * 0.135)
          ctx.beginPath()
          ctx.moveTo(-2.2 * scaleMultiplier, sy)
          ctx.lineTo(0, sy + 2.4 * scaleMultiplier)
          ctx.lineTo(2.2 * scaleMultiplier, sy)
          ctx.strokeStyle = palette.snakeSkinBase
          ctx.lineWidth = 0.6 * scaleMultiplier
          ctx.globalAlpha = 0.55
          ctx.stroke()
        }
        ctx.globalAlpha = 1

        // Supraocular Menacing Angry Brow Shelf
        ctx.beginPath()
        ctx.moveTo(-10.5 * scaleMultiplier, headLength * 0.42)
        ctx.lineTo(-5.0 * scaleMultiplier, headLength * 0.55)
        ctx.lineTo(5.0 * scaleMultiplier, headLength * 0.55)
        ctx.lineTo(10.5 * scaleMultiplier, headLength * 0.42)
        ctx.strokeStyle = palette.snakeSkinBase
        ctx.lineWidth = 1.8 * scaleMultiplier
        ctx.stroke()

        // Loreal Heat-Sensing Pits near snout
        ctx.fillStyle = palette.snakeSkinBase
        ctx.beginPath()
        ctx.arc(-3.0 * scaleMultiplier, headLength * 0.82, 1.1 * scaleMultiplier, 0, Math.PI * 2)
        ctx.arc(3.0 * scaleMultiplier, headLength * 0.82, 1.1 * scaleMultiplier, 0, Math.PI * 2)
        ctx.fill()

        // Sinister Dark Crimson Forked Tongue (Flicks forward from snout in travel direction)
        let tongueExtension = 0
        if (state.tongueFlick > 0) {
          const tf = state.tongueFlick / 34
          tongueExtension = Math.sin(tf * Math.PI) * (18 * scaleMultiplier) + Math.sin(tf * Math.PI * 3) * (3.5 * scaleMultiplier)
          tongueExtension = Math.max(0, tongueExtension)
        }

        if (tongueExtension > 1) {
          ctx.beginPath()
          ctx.moveTo(0, headLength)
          ctx.lineTo(0, headLength + tongueExtension)
          ctx.lineTo(-3.5 * scaleMultiplier, headLength + tongueExtension + 5 * scaleMultiplier)
          ctx.moveTo(0, headLength + tongueExtension)
          ctx.lineTo(3.5 * scaleMultiplier, headLength + tongueExtension + 5 * scaleMultiplier)
          ctx.strokeStyle = palette.tongue
          ctx.lineWidth = 1.4 * scaleMultiplier
          ctx.lineCap = 'round'
          ctx.stroke()
        }

        // Retracted ivory fangs flash subtly at the jaw line.
        ctx.beginPath()
        ctx.moveTo(-4.2 * scaleMultiplier, headLength * 0.82)
        ctx.lineTo(-3.0 * scaleMultiplier, headLength * 0.94)
        ctx.moveTo(4.2 * scaleMultiplier, headLength * 0.82)
        ctx.lineTo(3.0 * scaleMultiplier, headLength * 0.94)
        ctx.strokeStyle = '#f4ead2'
        ctx.lineWidth = 0.9 * scaleMultiplier
        ctx.globalAlpha = 0.82
        ctx.stroke()
        ctx.globalAlpha = 1

        // COLD LETHAL PREDATOR EYES
        const renderPredatorEye = (ex: number, ey: number) => {
          ctx.beginPath()
          ctx.ellipse(ex, ey, 2.8 * scaleMultiplier, 3.4 * scaleMultiplier, 0, 0, Math.PI * 2)
          ctx.fillStyle = palette.snakeSkinBase
          ctx.fill()

          ctx.beginPath()
          ctx.arc(ex, ey, 2.2 * scaleMultiplier, 0, Math.PI * 2)
          ctx.fillStyle = palette.eyeIris
          ctx.shadowColor = palette.eyeIris
          ctx.shadowBlur = 5 * scaleMultiplier
          ctx.fill()
          ctx.shadowBlur = 0

          ctx.beginPath()
          ctx.ellipse(ex, ey, 0.50 * scaleMultiplier, 2.0 * scaleMultiplier, 0, 0, Math.PI * 2)
          ctx.fillStyle = palette.eyePupil
          ctx.fill()

          ctx.beginPath()
          ctx.arc(ex - 0.5 * scaleMultiplier, ey - 0.7 * scaleMultiplier, 0.55 * scaleMultiplier, 0, Math.PI * 2)
          ctx.fillStyle = '#ffffff'
          ctx.globalAlpha = 0.82
          ctx.fill()
          ctx.globalAlpha = 1
        }

        renderPredatorEye(-7.5 * scaleMultiplier, headLength * 0.48)
        renderPredatorEye(7.5 * scaleMultiplier, headLength * 0.48)

        ctx.restore()
      }

      // ===================================================================
      // 2. PASS 1: DRAW BACK COILS OF SERPENT & HEAD (IF BEHIND TRUNK)
      // ===================================================================
      chunks.forEach((chunk) => {
        if (!chunk.isFront) {
          renderContinuousRibbon(chunk.startIndex, chunk.endIndex, false)
        }
      })

      if (headPt.z < 0) {
        drawPredatorHead(false)
      }

      // ===================================================================
      // 3. PASS 2: PHOTOREALISTIC ANCIENT BANYAN TREE TRUNK
      // ===================================================================
      ctx.save()

      const activeTreeTexture = isLightMode ? banyanTextureDayRef.current : banyanTextureDarkRef.current

      if (activeTreeTexture) {
        if (isLightMode) {
          // A narrow champagne shaft plus a grounded bark shadow keeps the tree
          // sculptural on ivory surfaces without the old milky halo.
          const grounding = ctx.createLinearGradient(0, 0, width, 0)
          grounding.addColorStop(0, 'rgba(42, 27, 12, 0.16)')
          grounding.addColorStop(0.48, 'rgba(76, 49, 18, 0.08)')
          grounding.addColorStop(1, 'rgba(255, 255, 255, 0)')
          ctx.fillStyle = grounding
          ctx.fillRect(0, 0, width, height)

          const sunbeam = ctx.createRadialGradient(trunkCenterX, height * 0.35, 8, trunkCenterX, height * 0.35, width * 1.1)
          sunbeam.addColorStop(0, 'rgba(245, 225, 160, 0.13)')
          sunbeam.addColorStop(0.6, 'rgba(212, 175, 55, 0.04)')
          sunbeam.addColorStop(1, 'rgba(255, 255, 255, 0)')
          ctx.fillStyle = sunbeam
          ctx.fillRect(0, 0, width, height)
        } else {
          // Midnight/Amber atmospheric blur backdrop
          ctx.fillStyle = palette.barkBackdrop
          ctx.filter = 'blur(8px)'
          ctx.fillRect(trunkCenterX - trunkRadiusBase - 10, 0, trunkRadiusBase * 2 + 20, height)
          ctx.filter = 'none'
        }

        const treeAspect = activeTreeTexture.width / activeTreeTexture.height
        const targetTreeH = height * 1.04
        const widthFactor = isMobile ? 0.45 : 0.70
        const targetTreeW = targetTreeH * treeAspect * widthFactor
        const treeX = trunkCenterX - targetTreeW * 0.40

        // Rotate around the rooted base. The procedural trunk and snake use the
        // same breezeSwayAngle through getTrunkAt(), so nothing appears detached.
        ctx.save()
        ctx.translate(trunkCenterX, height)
        ctx.rotate(breezeSwayAngle)
        ctx.drawImage(activeTreeTexture, treeX - trunkCenterX, -height, targetTreeW, targetTreeH)
        ctx.restore()
      } else {
        const trunkPoly: { x: number; y: number; r: number }[] = []
        for (let s = 0; s <= 45; s++) {
          const ty = (s / 45) * height
          const info = getTrunkAt(ty)
          trunkPoly.push({ x: info.x, y: ty, r: info.radius })
        }
        ctx.beginPath()
        ctx.moveTo(trunkPoly[0].x - trunkPoly[0].r, trunkPoly[0].y)
        for (let s = 1; s <= 45; s++) ctx.lineTo(trunkPoly[s].x - trunkPoly[s].r, trunkPoly[s].y)
        for (let s = 45; s >= 0; s--) ctx.lineTo(trunkPoly[s].x + trunkPoly[s].r, trunkPoly[s].y)
        ctx.closePath()
        const tg = ctx.createLinearGradient(0, 0, width * 0.72, 0)
        tg.addColorStop(0, isLightMode ? '#3c2415' : '#100805')
        tg.addColorStop(0.5, isLightMode ? '#6b4423' : '#362112')
        tg.addColorStop(1, isLightMode ? '#3c2415' : '#100805')
        ctx.fillStyle = tg
        ctx.fill()
      }

      ctx.restore() // End Trunk

      // ===================================================================
      // 3.5 PASS: OCCLUDED-COIL PRESSURE & EMERGENCE CONTINUITY
      // Back coils remain physically behind the trunk, but their soft pressure
      // shadow and short emergence seams prevent the body from looking severed.
      // ===================================================================
      ctx.save()
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'

      chunks.forEach((chunk) => {
        if (chunk.isFront || chunk.endIndex - chunk.startIndex < 2) return

        ctx.beginPath()
        for (let i = chunk.startIndex; i <= chunk.endIndex; i++) {
          const pt = spine3D[i]
          if (i === chunk.startIndex) ctx.moveTo(pt.x, pt.y)
          else ctx.lineTo(pt.x, pt.y)
        }
        ctx.strokeStyle = palette.castShadow
        ctx.lineWidth = Math.max(2.5 * scaleMultiplier, maxBodyRadius * 0.72)
        ctx.globalAlpha = isLightMode ? 0.22 : 0.34
        ctx.filter = `blur(${isLightMode ? 2.2 : 2.8}px)`
        ctx.stroke()
      })

      ctx.filter = 'none'
      ctx.globalAlpha = 1

      occlusionTransitions.forEach((transitionIndex) => {
        const start = Math.max(0, transitionIndex - 2)
        const end = Math.min(segmentCount - 1, transitionIndex + 2)
        const transitionPoint = spine3D[transitionIndex]

        ctx.beginPath()
        for (let i = start; i <= end; i++) {
          const pt = spine3D[i]
          if (i === start) ctx.moveTo(pt.x, pt.y)
          else ctx.lineTo(pt.x, pt.y)
        }
        ctx.strokeStyle = palette.snakeSkinBase
        ctx.lineWidth = Math.max(2, transitionPoint.radius * 1.18)
        ctx.globalAlpha = 0.78
        ctx.stroke()

        ctx.strokeStyle = palette.snakeScaleGlint
        ctx.lineWidth = Math.max(0.55, 0.75 * scaleMultiplier)
        ctx.globalAlpha = 0.46
        ctx.stroke()
      })

      ctx.restore()

      // ===================================================================
      // 4. PASS 3: REAL CONTACT SHADOW CAST ONTO TRUNK ("CHIPAK KE")
      // ===================================================================
      ctx.save()
      chunks.forEach((chunk) => {
        if (chunk.isFront) {
          ctx.beginPath()
          for (let i = chunk.startIndex; i <= chunk.endIndex; i++) {
            const pt = spine3D[i]
            const r = pt.radius
            const sx = pt.x - 2.5 * scaleMultiplier
            const sy = pt.y + 3.5 * scaleMultiplier
            ctx.ellipse(sx, sy, r * 1.12, 4.0 * scaleMultiplier, 0, 0, Math.PI * 2)
          }
          ctx.fillStyle = palette.castShadow
          ctx.filter = isLightMode ? 'blur(3px)' : 'blur(4px)'
          ctx.fill()
          ctx.filter = 'none'
        }
      })
      ctx.restore()

      // ===================================================================
      // 5. PASS 4: DRAW FRONT COILS OF SERPENT
      // ===================================================================
      chunks.forEach((chunk) => {
        if (chunk.isFront) {
          renderContinuousRibbon(chunk.startIndex, chunk.endIndex, true)
        }
      })

      // ===================================================================
      // 6. PASS 5: FORMIDABLE, LETHAL DANGER PREDATOR HEAD (IF IN FRONT)
      // ===================================================================
      if (headPt.z >= 0) {
        drawPredatorHead(true)
      }

      // ===================================================================
      // 7. PASS 6: EXTRA LUSH BOTANICAL BANYAN LEAVES ALONG TRUNK
      // ===================================================================
      ctx.save()
      const drawRichBanyanLeaf = (lx: number, ly: number, angle: number, size: number) => {
        ctx.save()
        ctx.translate(lx, ly)
        ctx.rotate(angle)
        ctx.scale(size * scaleMultiplier, size * scaleMultiplier)

        // Leaf shadow: warm amber shadow in daylight, black in night
        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.bezierCurveTo(8, -10, 18, -10, 26, 0)
        ctx.bezierCurveTo(18, 10, 8, 10, 0, 0)
        ctx.fillStyle = isLightMode ? 'rgba(120, 80, 20, 0.16)' : 'rgba(0, 0, 0, 0.30)'
        ctx.fill()

        // Luminous botanical leaf blade
        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.bezierCurveTo(7, -9, 16, -9, 24, 0)
        ctx.bezierCurveTo(16, 9, 7, 9, 0, 0)
        ctx.closePath()

        const leafGrad = ctx.createLinearGradient(0, -9, 24, 9)
        leafGrad.addColorStop(0, palette.leafDark)
        leafGrad.addColorStop(0.65, palette.leafMid)
        leafGrad.addColorStop(1, palette.leafGold)
        ctx.fillStyle = leafGrad
        ctx.fill()

        // Sunlit golden leaf vein
        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.lineTo(22, 0)
        ctx.strokeStyle = palette.leafGold
        ctx.lineWidth = 0.8
        ctx.stroke()

        ctx.restore()
      }

      richFoliageClusters.forEach((cluster) => {
        const clusterY = cluster.yRatio * height
        const clusterX = trunkCenterX + (height - clusterY) * Math.sin(breezeSwayAngle) + cluster.xOffset * scaleMultiplier

        for (let l = 0; l < cluster.count; l++) {
          const leafFlutter = Math.sin(time * 0.85 + l * 0.9 + cluster.yRatio * 4) * 0.045
          const angle = cluster.rot + breezeSwayAngle * 5 + (l - cluster.count / 2) * 0.35 + leafFlutter
          const leafX = clusterX + Math.cos(angle) * (l * 3.8 * scaleMultiplier)
          const leafY = clusterY + Math.sin(angle) * (l * 3.4 * scaleMultiplier)
          drawRichBanyanLeaf(leafX, leafY, angle, cluster.scale * 0.75)
        }
      })
      ctx.restore()

      // ===================================================================
      // 8. PASS 7: FLOATING SACRED GOLDEN SPORES (STARDUST)
      // ===================================================================
      ctx.save()
      particles.forEach((p) => {
        p.y += p.speedY
        p.pulse += p.pulseSpeed
        if (p.y < 0) p.y = height
        if (p.y > height) p.y = 0

        const alpha = p.opacity * (0.6 + 0.4 * Math.sin(p.pulse))
        ctx.beginPath()
        ctx.arc(p.x * scaleMultiplier, p.y, p.size * scaleMultiplier, 0, Math.PI * 2)
        ctx.fillStyle = palette.spore
        ctx.globalAlpha = alpha
        ctx.fill()
      })
      ctx.restore()

      animationFrameId = requestAnimationFrame(render)
    }

    animationFrameId = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(animationFrameId)
      cancelAnimationFrame(resizeFrameId)
      window.removeEventListener('resize', scheduleResize)
    }
  }, [palette, theme])

  if (!isVisible) return null

  return (
    <aside
      aria-label="Sacred Banyan & Guardian Serpent Interactive Experience"
      className="fixed left-0 top-0 h-screen w-8 sm:w-16 md:w-28 lg:w-40 z-30 pointer-events-none select-none transition-opacity duration-500 overflow-hidden sm:pl-1 md:pl-2"
    >
      {/* 3D Hardware-Accelerated Canvas with Theme-Aware Drop Shadow */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block guardian-canvas"
      />

      {/* Subtle Luxury Minimizer Button */}
      <div className="guardian-minimizer absolute bottom-3 left-1.5 sm:left-2.5 pointer-events-auto flex items-center space-x-1.5 opacity-60 hover:opacity-100 transition-opacity duration-300">
        <button
          onClick={() => setIsVisible(false)}
          title="Minimize Guardian Rail"
          className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-black/70 border border-[#d4af37]/40 text-[#d4af37] text-[9px] sm:text-[10px] flex items-center justify-center hover:scale-110 hover:border-[#d4af37] transition-all cursor-pointer backdrop-blur-sm"
        >
          &times;
        </button>
        <span className="text-[8px] sm:text-[9px] uppercase tracking-widest text-[#d4af37]/80 font-serif hidden md:inline-block">
          Guardian
        </span>
      </div>
    </aside>
  )
}
