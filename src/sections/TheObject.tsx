import { ALBUM } from '../content/album'
import { Panel } from '../components/Panel'
import { VinylDisc } from '../components/VinylDisc'

const SPECS = [ALBUM.weight, 'Transparente', 'Tiragem 200', ALBUM.pressedIn, ALBUM.rpm]

/**
 * Painel 2 — O objeto. O vinil assume o centro; specs em mono orbitam nas
 * margens. Com 3D ativo, a View do canvas único (src/three/ThreeLayer.tsx)
 * assume o slot e o disco gira a 33⅓ sugerido; o SVG é o fallback.
 */
export function TheObject() {
  return (
    <Panel id="o-objeto" mark="02 · O OBJETO">
      <div className="grid items-center gap-12 md:grid-cols-[1fr_auto]">
        <div data-vinyl-slot="object" className="relative mx-auto aspect-square w-full max-w-md">
          <VinylDisc pressing="transparente" className="vinyl-fallback w-full" />
        </div>

        <ul className="flex flex-row flex-wrap gap-4 md:flex-col md:gap-6" aria-label="Especificações">
          {SPECS.map((spec) => (
            <li key={spec} className="label-mono border-l border-amber/40 pl-3 text-steel">
              {spec}
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-16 max-w-xl text-lg leading-relaxed text-steel">
        Cento e oitenta gramas de policarbonato translúcido, cortados em laca e
        prensados em uma tiragem única. <span className="text-white">Circuito</span>{' '}
        foi pensado como objeto antes de ser pensado como arquivo — o disco é a
        interface.
      </p>
    </Panel>
  )
}
