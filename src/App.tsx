import { Suspense, lazy, useEffect } from 'react'
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
import { useFirstIntent } from './lib/useFirstIntent'
import { usePrefersReducedMotion } from './lib/usePrefersReducedMotion'

const ThreeLayer = lazy(() => import('./three/ThreeLayer'))

/**
 * CIRCUITO — narrativa vertical contínua em 8 painéis (Seção 2 do brief).
 * A página estática renderiza completa por si só (e é prerenderizada em
 * HTML no build). Por cima dela, dois chunks lazy gated pela primeira
 * intenção do usuário e por prefers-reduced-motion:
 *   "three"  → cena R3F do vinil (src/three/ThreeLayer.tsx)
 *   "motion" → coreografia GSAP/Lenis (src/motion/init.ts)
 */
function App() {
  const three = useThreeGate()
  const reducedMotion = usePrefersReducedMotion()
  const intent = useFirstIntent()
  const motionOk = intent && !reducedMotion

  // coreografia GSAP/Lenis (chunk "motion"): mesma regra do 3D — só na
  // primeira intenção, nunca com reduced-motion
  useEffect(() => {
    if (!motionOk) return
    let cancelled = false
    let cleanup: (() => void) | undefined
    import('./motion/init').then(async (m) => {
      if (cancelled) return
      cleanup = await m.initMotion()
      if (cancelled) cleanup()
    })
    return () => {
      cancelled = true
      cleanup?.()
    }
  }, [motionOk])

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
