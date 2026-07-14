import { useSyncExternalStore } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

const subscribe = (callback: () => void) => {
  const mql = window.matchMedia(QUERY)
  mql.addEventListener('change', callback)
  return () => mql.removeEventListener('change', callback)
}

const getSnapshot = () => window.matchMedia(QUERY).matches

/**
 * Gate central de motion do case: as fases P2/P3 (3D/GSAP) consultam este
 * hook antes de montar canvas ou timelines. `true` = servir a versão
 * estática completa (renders pré-capturados, zero animação).
 */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, () => true)
}
