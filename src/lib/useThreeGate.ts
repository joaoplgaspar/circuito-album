import { useEffect, useState } from 'react'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

function supportsWebGL2(): boolean {
  try {
    return !!document.createElement('canvas').getContext('webgl2')
  } catch {
    return false
  }
}

/**
 * Fallbacks em cascata do brief: reduced-motion → sem 3D; WebGL2
 * indisponível → sem 3D.
 *
 * Mesmo liberado, o chunk three/R3F só carrega na PRIMEIRA INTENÇÃO real
 * (scroll, toque, tecla) — nunca por timer. Quem não interage não paga o
 * parse de ~900KB, e a janela de carregamento (LCP/TBT) fica limpa: o
 * trade-off central do budget. Quem chega com a página já rolada
 * (refresh no meio) arma imediatamente.
 */
export function useThreeGate(): boolean {
  const reducedMotion = usePrefersReducedMotion()
  const [armed, setArmed] = useState(false)

  useEffect(() => {
    if (reducedMotion || !supportsWebGL2()) return

    if (window.scrollY > 0) {
      setArmed(true)
      return
    }

    const arm = () => setArmed(true)
    const options = { once: true, passive: true } as const
    const events = ['scroll', 'pointerdown', 'wheel', 'touchmove', 'keydown'] as const
    events.forEach((e) => window.addEventListener(e, arm, options))
    return () => events.forEach((e) => window.removeEventListener(e, arm))
  }, [reducedMotion])

  return armed && !reducedMotion
}
