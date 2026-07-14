import { ALBUM } from '../content/album'
import { Panel } from '../components/Panel'
import { VinylDisc } from '../components/VinylDisc'

const LAYERS = [
  { label: 'CAPA · 300g/m² · impressão offset', kind: 'capa' },
  { label: 'ENCARTE · 12 páginas · ficha técnica', kind: 'encarte' },
  { label: `DISCO · ${ALBUM.weight} · ${ALBUM.rpm}`, kind: 'disco' },
] as const

/**
 * Painel 4 — A prensagem (exploded view). Na P3 vira a cena scroll-driven em
 * que capa, encarte e disco se separam em camadas 3D (pin curto, < 1.5
 * viewport). A P1 mostra a versão estática em camadas deslocadas — que é
 * também o fallback reduced-motion definitivo.
 */
export function Pressing() {
  return (
    <Panel id="prensagem" mark="04 · A PRENSAGEM">
      <h2 className="display-tight mb-12 text-3xl text-white sm:text-4xl">
        Três camadas, um objeto
      </h2>

      <div className="space-y-6">
        {LAYERS.map((layer, i) => (
          <figure
            key={layer.kind}
            className="flex items-center gap-6 border border-graphite/40 bg-white/[0.02] p-6"
            style={{ marginLeft: `${i * 8}%` }}
          >
            <div className="h-20 w-20 shrink-0">
              {layer.kind === 'disco' ? (
                <VinylDisc pressing="preta" className="h-full w-full" />
              ) : (
                <div
                  className={`flex h-full w-full items-center justify-center border ${
                    layer.kind === 'capa' ? 'border-amber/60' : 'border-steel/40'
                  }`}
                >
                  <span className="display-tight text-[0.5rem] text-amber">
                    {layer.kind === 'capa' ? ALBUM.title : 'ENCARTE'}
                  </span>
                </div>
              )}
            </div>
            <figcaption className="label-mono text-steel">{layer.label}</figcaption>
          </figure>
        ))}
      </div>

      <p className="mt-16 max-w-xl text-lg leading-relaxed text-steel">
        No scroll, as camadas se separam: a capa tipográfica, o encarte com a
        ficha técnica completa e o disco em si. Cada componente da prensagem
        recebe sua etiqueta — como um diagrama de montagem.
      </p>
    </Panel>
  )
}
