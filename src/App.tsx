import { ColdOpen } from './sections/ColdOpen'
import { TheObject } from './sections/TheObject'
import { TrackCircuit } from './sections/TrackCircuit'
import { Pressing } from './sections/Pressing'
import { LightMoment } from './sections/LightMoment'
import { NumberedEdition } from './sections/NumberedEdition'
import { BuyPanel } from './sections/BuyPanel'
import { CreditsFooter } from './sections/CreditsFooter'

/**
 * CIRCUITO — narrativa vertical contínua em 8 painéis (Seção 2 do brief).
 * P1: página completa estática — todo o conteúdo real, sem 3D nem motion.
 * O que entra depois, sempre lazy e gated por prefers-reduced-motion:
 *   P2 → cena R3F do vinil (dynamic import + intersection, src/three/)
 *   P3 → Lenis + ScrollTrigger, traço de circuito, exploded view
 */
function App() {
  return (
    <>
      <a
        href="#o-objeto"
        className="label-mono sr-only bg-amber text-ink focus:not-sr-only focus:absolute focus:z-50 focus:px-4 focus:py-2"
      >
        pular abertura
      </a>

      <main>
        <ColdOpen />
        <TheObject />
        <TrackCircuit />
        <Pressing />
        <LightMoment />
        <NumberedEdition />
        <BuyPanel />
      </main>

      <CreditsFooter />
    </>
  )
}

export default App
