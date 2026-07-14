import { useState } from 'react'
import { PRESSINGS, buyUrl } from '../content/album'
import { Panel } from '../components/Panel'

/**
 * Painel 7 — Painel de compra. A seleção de prensagem é visual; o CTA
 * deep-linka pra PDP na PRENSA com a variante pré-selecionada (?variant=).
 * Honestidade de escopo: o carrinho otimista vive na loja — esta página
 * entrega a intenção lá.
 */
export function BuyPanel() {
  const [selected, setSelected] = useState(PRESSINGS[1])

  return (
    <Panel id="comprar" mark="07 · PAINEL DE COMPRA">
      <h2 className="display-tight mb-12 text-3xl text-white sm:text-4xl">Leve o objeto</h2>

      <div role="radiogroup" aria-label="Prensagem" className="grid gap-4 sm:grid-cols-2">
        {PRESSINGS.map((pressing) => {
          const active = selected.id === pressing.id
          return (
            <button
              key={pressing.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setSelected(pressing)}
              className={`cursor-pointer border p-6 text-left transition-colors ${
                active
                  ? 'border-amber bg-amber/5'
                  : 'border-graphite hover:border-steel'
              }`}
            >
              <span className={`label-mono block ${active ? 'text-amber' : 'text-steel'}`}>
                {pressing.name}
              </span>
              <span className="mt-2 block text-sm text-steel">{pressing.description}</span>
              <span className="display-tight mt-4 block text-2xl text-white">
                {pressing.price}
              </span>
            </button>
          )
        })}
      </div>

      <a
        href={buyUrl(selected.variant)}
        className="display-tight mt-10 block w-full cursor-pointer border border-amber bg-amber px-8 py-5 text-center text-lg text-ink transition-colors hover:bg-amber/90 sm:inline-block sm:w-auto"
      >
        Comprar na PRENSA →
      </a>

      <p className="label-mono mt-6 text-graphite">
        abre a página do disco na loja com a prensagem {selected.id} selecionada
      </p>
    </Panel>
  )
}
