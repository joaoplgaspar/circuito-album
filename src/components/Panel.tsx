import type { ReactNode } from 'react'

type PanelProps = {
  id: string
  /** marcação de instrumento no topo do painel, ex.: "01 · COLD OPEN" */
  mark: string
  children: ReactNode
  className?: string
}

/**
 * Painel da narrativa vertical. As bordas esquerdas dos painéis empilhados
 * formam o trilho contínuo do traço de circuito: cada .trace-fill energiza
 * na MESMA linha de viewport em que o do painel seguinte começa (ranges
 * contíguos em src/motion/init.ts) — a linha lê como uma só. O .trace-node
 * é a estação que acende na passagem.
 */
export function Panel({ id, mark, children, className = '' }: PanelProps) {
  return (
    <section
      id={id}
      aria-label={mark}
      className={`relative border-l border-graphite/40 px-6 py-24 sm:px-10 md:mx-auto md:max-w-5xl md:px-16 md:py-32 ${className}`}
    >
      <span
        aria-hidden="true"
        className="trace-fill absolute top-0 -left-px h-full w-px origin-top scale-y-0 bg-amber/80"
      />
      <span aria-hidden="true" className="trace-node" />
      <p className="panel-mark label-mono mb-10 text-amber">{mark}</p>
      {children}
    </section>
  )
}
