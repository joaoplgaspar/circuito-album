import type { ReactNode } from 'react'

type PanelProps = {
  id: string
  /** marcação de instrumento no topo do painel, ex.: "01 · COLD OPEN" */
  mark: string
  children: ReactNode
  className?: string
}

/**
 * Painel da narrativa vertical. O traço de circuito âmbar (hairline à
 * esquerda) conecta os painéis; na P3 ele vira um <path> SVG contínuo
 * dirigido por scroll (stroke-dashoffset) — o layout já reserva o trilho.
 */
export function Panel({ id, mark, children, className = '' }: PanelProps) {
  return (
    <section
      id={id}
      aria-label={mark}
      className={`relative border-l border-graphite/60 px-6 py-24 sm:px-10 md:mx-auto md:max-w-5xl md:px-16 md:py-32 ${className}`}
    >
      <span
        aria-hidden="true"
        className="absolute top-0 -left-px h-16 w-px bg-amber"
      />
      {/* trilho do traço de circuito: energiza via scaleY dirigido por scroll
          (src/motion/init.ts); sem motion fica invisível e o segmento
          estático acima faz o papel */}
      <span
        aria-hidden="true"
        className="trace-fill absolute top-0 -left-px h-full w-px origin-top scale-y-0 bg-amber/80"
      />
      <p className="label-mono mb-10 text-amber">{mark}</p>
      {children}
    </section>
  )
}
