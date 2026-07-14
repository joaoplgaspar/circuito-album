import { useSyncExternalStore } from 'react'

export type PressingId = 'preta' | 'transparente'

/**
 * Store minimalista pra prensagem ativa do momento da luz — compartilhada
 * entre o painel 5 (botões, bundle inicial) e a cena 3D (chunk lazy), sem
 * atravessar contexto React entre árvores portadas.
 */
let current: PressingId = 'transparente'
const listeners = new Set<() => void>()

export const pressingStore = {
  get: (): PressingId => current,
  set: (next: PressingId) => {
    current = next
    listeners.forEach((l) => l())
  },
  subscribe: (l: () => void) => {
    listeners.add(l)
    return () => {
      listeners.delete(l)
    }
  },
}

export function usePressing(): PressingId {
  return useSyncExternalStore(pressingStore.subscribe, pressingStore.get, () => 'transparente')
}
