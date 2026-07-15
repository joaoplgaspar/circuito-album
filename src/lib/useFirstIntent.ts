import { useEffect, useState } from 'react'

/**
 * `true` a partir do primeiro sinal de vida do usuário — e o pointermove/
 * touchstart contam: no desktop o mouse mexe segundos antes do primeiro
 * scroll, então os chunks pesados (three/R3F, GSAP) montam ANTES da
 * rolagem começar, e o crossfade SVG→3D acontece com a página parada.
 * Nada carrega por timer: a janela de carregamento (LCP/TBT) fica limpa
 * e o lab (que não mexe mouse nem rola) mede a página estática.
 * Quem chega com a página já rolada (refresh no meio) arma imediatamente.
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
    const events = [
      'pointermove',
      'touchstart',
      'scroll',
      'pointerdown',
      'wheel',
      'keydown',
    ] as const
    events.forEach((e) => window.addEventListener(e, arm, options))
    return () => events.forEach((e) => window.removeEventListener(e, arm))
  }, [])

  return armed
}
