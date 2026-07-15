import { usePrefersReducedMotion } from './usePrefersReducedMotion'
import { useFirstIntent } from './useFirstIntent'
import { supportsWebGL2 } from './webgl'

/**
 * Fallbacks em cascata do brief: reduced-motion → sem 3D; WebGL2
 * indisponível → sem 3D. Mesmo liberado, o chunk three/R3F só carrega na
 * primeira intenção do usuário (useFirstIntent) — quem não interage não
 * paga o parse de ~900KB.
 */
export function useThreeGate(): boolean {
  const reducedMotion = usePrefersReducedMotion()
  const intent = useFirstIntent()

  return !reducedMotion && intent && supportsWebGL2()
}
