import React, { useState, useEffect, useRef } from 'react'
import { VolumeX } from 'lucide-react'
import { SITE_CONFIG } from '../config/site'

export const AmbientSoundscape: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const timerRef = useRef<number | null>(null)

  const stopSoundscape = () => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current)
      timerRef.current = null
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => {})
      audioCtxRef.current = null
    }
    setIsPlaying(false)
  }

  const startSoundscape = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      const ctx = new AudioCtx()
      audioCtxRef.current = ctx

      // Soothing warm pentatonic chords in Hz (F major 9, D minor 9, C major 7)
      const chordProgressions = [
        [174.61, 220.00, 261.63, 329.63, 392.00], // Fmaj9 (warm, intimate)
        [146.83, 220.00, 261.63, 349.23, 440.00], // Dm9 (deep, moody)
        [130.81, 196.00, 246.94, 329.63, 392.00], // Cmaj7 (soothing, clear)
        [220.00, 261.63, 329.63, 392.00, 523.25], // Am9 (twilight reflection)
      ]

      let chordIndex = 0

      const playChord = () => {
        if (!ctx || ctx.state === 'closed') return

        const freqs = chordProgressions[chordIndex]
        chordIndex = (chordIndex + 1) % chordProgressions.length
        const now = ctx.currentTime
        const chordDuration = 5.5

        // Gentle master filter for analog luxury warmth
        const masterFilter = ctx.createBiquadFilter()
        masterFilter.type = 'lowpass'
        masterFilter.frequency.setValueAtTime(450, now)

        const masterGain = ctx.createGain()
        masterGain.gain.setValueAtTime(0.001, now)
        masterGain.gain.exponentialRampToValueAtTime(0.08, now + 1.8)
        masterGain.gain.exponentialRampToValueAtTime(0.001, now + chordDuration)

        masterFilter.connect(masterGain)
        masterGain.connect(ctx.destination)

        freqs.forEach((freq, idx) => {
          const osc = ctx.createOscillator()
          osc.type = idx % 2 === 0 ? 'sine' : 'triangle'
          osc.frequency.setValueAtTime(freq, now)

          const oscGain = ctx.createGain()
          oscGain.gain.setValueAtTime(0.25 / freqs.length, now)

          osc.connect(oscGain)
          oscGain.connect(masterFilter)

          osc.start(now)
          osc.stop(now + chordDuration)
        })
      }

      playChord()
      timerRef.current = window.setInterval(playChord, 5200)
      setIsPlaying(true)
    } catch {
      setIsPlaying(false)
    }
  }

  const toggleSoundscape = () => {
    if (isPlaying) {
      stopSoundscape()
    } else {
      startSoundscape()
    }
  }

  useEffect(() => {
    return () => {
      stopSoundscape()
    }
  }, [])

  return (
    <button
      onClick={toggleSoundscape}
      className={`soundscape-toggle-btn inline-flex items-center gap-2 py-1.5 px-3 rounded-full border transition-all duration-300 cursor-pointer ${
        isPlaying
          ? 'is-active bg-[#181b24] border-[#d4af37] text-[#d4af37] shadow-[0_0_15px_rgba(212,175,55,0.25)]'
          : 'bg-[#12151b]/70 border-[#d4af37]/25 text-[#8a8d98] hover:text-[#f7ecd7] hover:border-[#d4af37]/60'
      }`}
      aria-label="Toggle Luxury Lounge Soundscape"
      title={isPlaying ? 'Mute Lounge Soundscape' : `Listen to ${SITE_CONFIG.name} Lounge Acoustics`}
    >
      {isPlaying ? (
        <>
          <div className="flex items-center gap-0.5 h-3">
            <span className="w-0.5 h-full bg-[#d4af37] animate-pulse" />
            <span className="w-0.5 h-2 bg-[#d4af37] animate-bounce" />
            <span className="w-0.5 h-full bg-[#d4af37] animate-pulse" />
            <span className="w-0.5 h-1.5 bg-[#d4af37] animate-bounce" />
          </div>
          <span className="soundscape-label text-[10px] uppercase font-sans tracking-widest font-semibold hidden md:inline">
            Acoustics On
          </span>
        </>
      ) : (
        <>
          <VolumeX className="w-3.5 h-3.5 soundscape-icon" />
          <span className="soundscape-label text-[10px] uppercase font-sans tracking-widest font-semibold hidden md:inline">
            Soundscape
          </span>
        </>
      )}
    </button>
  )
}
