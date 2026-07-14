import { useEffect, useState } from 'react'

/**
 * `true` a partir da primeira intenção real do usuário (scroll, toque,
 * tecla) — ou imediatamente, se a página já chegou rolada. É o gatilho
 * comum dos chunks pesados (three/R3F e GSAP/Lenis): nada carrega por
 * timer, e a janela de carregamento (LCP/TBT) fica limpa.
 */
export function useFirstIntent(): boolean {
  const [armed, setArmed] = useState(false)

  useEffect(() => {
    if (window.scrollY > 0) {
      setArmed(true)
      return
    }

    const arm = () => setArmed(true)
    const options = { once: true, passive: true } as const
    const events = ['scroll', 'pointerdown', 'wheel', 'touchmove', 'keydown'] as const
    events.forEach((e) => window.addEventListener(e, arm, options))
    return () => events.forEach((e) => window.removeEventListener(e, arm))
  }, [])

  return armed
}
