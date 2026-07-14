type WaveformProps = {
  seed: number
  bars?: number
  className?: string
}

/** PRNG determinístico (mulberry32) — a mesma faixa desenha sempre a mesma onda. */
function mulberry32(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * Micro-waveform em SVG puro — estática na P1; a "energização" âmbar no
 * hover/scroll entra na P3 via CSS/GSAP, sem trocar o markup.
 */
export function Waveform({ seed, bars = 32, className }: WaveformProps) {
  const rand = mulberry32(seed)
  const heights = Array.from({ length: bars }, () => 0.15 + rand() * 0.85)
  const gap = 100 / bars

  return (
    <svg
      viewBox="0 0 100 24"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={className}
    >
      {heights.map((h, i) => {
        const barHeight = h * 22
        return (
          <rect
            key={i}
            x={i * gap + gap * 0.25}
            y={(24 - barHeight) / 2}
            width={gap * 0.5}
            height={barHeight}
            fill="currentColor"
          />
        )
      })}
    </svg>
  )
}
