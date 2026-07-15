/**
 * Estado do vinil-herói — o contrato entre a coreografia (GSAP, chunk
 * "motion") e a cena (R3F, chunk "three"). O GSAP escreve valores aqui via
 * scrub; o useFrame da cena lê a cada frame. Nenhum dos dois importa o
 * outro: o disco é UM objeto contínuo que viaja pela narrativa inteira.
 */

export type HeroTarget =
  /** posição livre em coords normalizadas de viewport [-1..1] */
  | { kind: 'free'; nx: number; ny: number; scale: number }
  /** ancorado a um slot do DOM (rastreado por frame — gruda no layout) */
  | { kind: 'slot'; id: string; fit: number }

export type HeroSegment = { from: HeroTarget; to: HeroTarget; p: number }

export type HeroState = {
  seg: HeroSegment
  tiltX: number
  tiltZ: number
  /** rad/s */
  spin: number
  /** 0 = pleno · 1 = apagado (fundo) */
  dim: number
  /** 0..1 — separação das camadas no exploded view */
  explode: number
  /** 0..1 — feixe do momento da luz */
  glow: number
  /** estação da luz ativa (material transmission elegível) */
  vidro: boolean
  visible: boolean
  /** parallax do ponteiro (desktop) */
  mx: number
  my: number
}

/**
 * Estação inicial: fundo do cold open. CASADA 1:1 com o fallback SVG
 * (mesmo centro, ~131svh de diâmetro, mesma opacidade) — o crossfade
 * SVG→3D troca um pelo outro sem salto visual.
 */
export const COLD: HeroTarget = { kind: 'free', nx: 0, ny: 0, scale: 1.53 }

export const hero: HeroState = {
  seg: { from: COLD, to: COLD, p: 1 },
  tiltX: 1.45,
  tiltZ: -0.06,
  spin: 0.14,
  dim: 0.8,
  explode: 0,
  glow: 0,
  vidro: false,
  visible: true,
  mx: 0,
  my: 0,
}

declare global {
  interface Window {
    __hero?: HeroState
  }
}
if (typeof window !== 'undefined') window.__hero = hero
