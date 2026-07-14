import { usePrefersReducedMotion } from './usePrefersReducedMotion'
import { useFirstIntent } from './useFirstIntent'

function supportsWebGL2(): boolean {
  try {
    return !!document.createElement('canvas').getContext('webgl2')
  } catch {
    return false
  }
}

let webgl2: boolean | null = null

/**
 * Fallbacks em cascata do brief: reduced-motion → sem 3D; WebGL2
 * indisponível → sem 3D. Mesmo liberado, o chunk three/R3F só carrega na
 * primeira intenção do usuário (useFirstIntent) — quem não interage não
 * paga o parse de ~900KB.
 */
export function useThreeGate(): boolean {
  const reducedMotion = usePrefersReducedMotion()
  const intent = useFirstIntent()

  if (reducedMotion || !intent) return false
  webgl2 ??= supportsWebGL2()
  return webgl2
}
