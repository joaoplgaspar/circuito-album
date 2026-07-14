import { Suspense, lazy } from 'react'
import { ColdOpen } from './sections/ColdOpen'
import { TheObject } from './sections/TheObject'
import { TrackCircuit } from './sections/TrackCircuit'
import { Pressing } from './sections/Pressing'
import { LightMoment } from './sections/LightMoment'
import { NumberedEdition } from './sections/NumberedEdition'
import { BuyPanel } from './sections/BuyPanel'
import { CreditsFooter } from './sections/CreditsFooter'
import { ThreeErrorBoundary } from './components/ThreeErrorBoundary'
import { useThreeGate } from './lib/useThreeGate'

const ThreeLayer = lazy(() => import('./three/ThreeLayer'))

/**
 * CIRCUITO — narrativa vertical contínua em 8 painéis (Seção 2 do brief).
 * A página estática (P1) renderiza completa por si só; a camada 3D (P2) é
 * um chunk lazy que só monta se useThreeGate liberar (motion permitido +
 * WebGL2 + primeiro scroll/idle). P3 → Lenis + ScrollTrigger, traço de
 * circuito, exploded view.
 */
function App() {
  const three = useThreeGate()

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

      {three && (
        <ThreeErrorBoundary>
          <Suspense fallback={null}>
            <ThreeLayer />
          </Suspense>
        </ThreeErrorBoundary>
      )}
    </>
  )
}

export default App
