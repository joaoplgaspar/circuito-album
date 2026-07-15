import { ALBUM } from '../content/album'
import { Panel } from '../components/Panel'
import { VinylDisc } from '../components/VinylDisc'

const LAYERS = [
  { label: 'CAPA', spec: '300g/m² · impressão offset', kind: 'capa' },
  { label: 'ENCARTE', spec: '12 páginas · ficha técnica', kind: 'encarte' },
  { label: 'DISCO', spec: `${ALBUM.weight} · ${ALBUM.rpm}`, kind: 'disco' },
] as const

/**
 * Painel 4 — A prensagem (exploded view). Com 3D: pin curto e as camadas
 * REAIS (capa, encarte, disco) se separam em 3D no palco central, com as
 * etiquetas mono reveladas em sincronia (src/motion/init.ts). Sem 3D: as
 * camadas DOM abaixo fazem a versão estática/scrubada — mesmo conteúdo,
 * mesma direção de arte.
 */
export function Pressing() {
  return (
    <Panel id="prensagem" mark="04 · A PRENSAGEM">
      <h2 className="display-tight mb-12 text-3xl text-white sm:text-4xl">
        Três camadas, um objeto
      </h2>

      <div className="relative md:min-h-[52vh]">
        {/* fallback DOM — some (mantendo o espaço do palco) quando o 3D assume */}
        <div className="exploded-fallback space-y-6">
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
              <figcaption className="label-mono text-steel">
                {layer.label} · {layer.spec}
              </figcaption>
            </figure>
          ))}
        </div>

        {/* etiquetas do diagrama — só existem com o 3D vivo, reveladas em
            sincronia com a separação das camadas */}
        <ul className="exploded-labels absolute top-1/2 right-0 -translate-y-1/2 space-y-8">
          {LAYERS.map((layer) => (
            <li
              key={layer.kind}
              className={layer.kind === 'encarte' ? 'max-md:hidden' : undefined}
            >
              <span className="label-mono block border-l border-amber pl-3 text-amber">
                {layer.label}
              </span>
              <span className="label-mono mt-1 block pl-3 text-graphite">{layer.spec}</span>
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-16 max-w-xl text-lg leading-relaxed text-steel">
        No scroll, as camadas se separam: a capa tipográfica, o encarte com a
        ficha técnica completa e o disco em si. Cada componente da prensagem
        recebe sua etiqueta — como um diagrama de montagem.
      </p>
    </Panel>
  )
}
