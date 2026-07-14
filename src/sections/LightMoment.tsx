import { useState } from 'react'
import { Panel } from '../components/Panel'
import { VinylDisc } from '../components/VinylDisc'

/**
 * Painel 5 — ⭐ O momento da luz. Toggle preta ↔ transparente. Na P2/P3 a
 * prensagem transparente monta o MeshPhysicalMaterial com transmission (só
 * aqui — antes disso, material padrão) e o feixe atravessa o disco. Na P1 o
 * toggle troca o render SVG e o brilho âmbar é gradiente CSS.
 */
export function LightMoment() {
  const [pressing, setPressing] = useState<'preta' | 'transparente'>('transparente')
  const transparent = pressing === 'transparente'

  return (
    <Panel id="momento-da-luz" mark="05 · O MOMENTO DA LUZ">
      <h2 className="display-tight mb-4 text-3xl text-white sm:text-4xl">
        A luz atravessa
      </h2>
      <p className="mb-12 max-w-xl text-lg leading-relaxed text-steel">
        Duas prensagens: a preta clássica e a transparente — 200 cópias em que o
        policarbonato deixa a luz passar. É pra ela que esta página inteira
        constrói.
      </p>

      <div
        className="relative mx-auto max-w-md py-8"
        style={
          transparent
            ? { background: 'radial-gradient(ellipse at 50% 45%, rgba(255,176,0,0.14), transparent 70%)' }
            : undefined
        }
      >
        <VinylDisc pressing={pressing} className="w-full" />
      </div>

      <div
        role="radiogroup"
        aria-label="Escolher prensagem"
        className="mt-10 flex justify-center gap-3"
      >
        {(['preta', 'transparente'] as const).map((option) => (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={pressing === option}
            onClick={() => setPressing(option)}
            className={`label-mono cursor-pointer border px-5 py-3 transition-colors ${
              pressing === option
                ? 'border-amber bg-amber/10 text-amber'
                : 'border-graphite text-steel hover:border-steel'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </Panel>
  )
}
