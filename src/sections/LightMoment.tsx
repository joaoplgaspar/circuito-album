import { Panel } from '../components/Panel'
import { VinylDisc } from '../components/VinylDisc'
import { usePressing, pressingStore } from '../lib/pressingStore'

/**
 * Painel 5 — ⭐ O momento da luz. Toggle preta ↔ transparente. Com 3D ativo,
 * a prensagem transparente monta o MeshPhysicalMaterial com transmission
 * (só aqui — guardrail do brief) e o feixe atravessa o disco; o estado vive
 * no pressingStore, compartilhado com a cena. Sem 3D, o toggle troca o
 * render SVG e o brilho âmbar é gradiente CSS.
 */
export function LightMoment() {
  const pressing = usePressing()
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
        className="light-glow relative mx-auto max-w-md py-8"
        style={
          transparent
            ? { background: 'radial-gradient(ellipse at 50% 45%, rgba(255,176,0,0.14), transparent 70%)' }
            : undefined
        }
      >
        <div data-vinyl-slot="light" className="relative aspect-square w-full">
          <VinylDisc pressing={pressing} className="vinyl-fallback w-full" />
        </div>
        {/* glow que acende com o scroll (src/motion/init.ts) — o "bloom" do
            case é CSS, não pós-processamento */}
        <div
          aria-hidden="true"
          className="glow-overlay pointer-events-none absolute inset-0 z-20 opacity-0"
          style={{
            background:
              'radial-gradient(ellipse at 50% 42%, rgba(255,176,0,0.20), rgba(255,176,0,0.05) 45%, transparent 72%)',
          }}
        />
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
            onClick={() => pressingStore.set(option)}
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
