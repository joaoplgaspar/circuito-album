import * as THREE from 'three'

/**
 * Texturas 100% procedurais (canvas 2D) — guardrail do brief: modelo por
 * primitivas, sem asset externo pesado. Geradas uma vez, dentro do chunk
 * lazy, quando as webfonts da página já carregaram.
 */

/** Bump map de ranhuras: anéis concêntricos em grayscale (mais barato que normal map). */
export function makeGrooveBump(size = 1024): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')!
  const c = size / 2

  ctx.fillStyle = '#808080'
  ctx.fillRect(0, 0, size, size)

  const labelEdge = c * 0.36
  const rim = c * 0.985
  let r = labelEdge
  let ring = 0
  while (r < rim) {
    // separador de faixa a cada ~48 ranhuras: faixa lisa mais larga
    const isSeparator = ring % 48 === 0 && ring > 0
    ctx.beginPath()
    ctx.arc(c, c, r, 0, Math.PI * 2)
    ctx.lineWidth = isSeparator ? 4 : 1.1
    ctx.strokeStyle = ring % 2 === 0 ? 'rgba(255,255,255,0.20)' : 'rgba(0,0,0,0.30)'
    ctx.stroke()
    r += isSeparator ? 6 : 2.4
    ring++
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.anisotropy = 4
  return texture
}

/**
 * Backdrop do momento da luz: mesmo azul-carvão da página com o glow âmbar
 * radial — dá ao transmission algo pra refratar e sugere a cáustica do
 * feixe, sem pós-processamento.
 */
export function makeBackdropTexture(size = 512): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')!
  const c = size / 2

  ctx.fillStyle = '#0a0c10'
  ctx.fillRect(0, 0, size, size)

  // raio curto: precisa morrer em #0A0C10 puro bem antes da borda do scissor
  const glow = ctx.createRadialGradient(c, c * 0.92, 0, c, c * 0.92, c * 0.52)
  glow.addColorStop(0, 'rgba(255,176,0,0.20)')
  glow.addColorStop(0.55, 'rgba(255,176,0,0.05)')
  glow.addColorStop(1, 'rgba(255,176,0,0)')
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, size, size)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

/** Selo central — a mesma direção de arte do fallback SVG. */
export function makeLabelTexture(size = 512): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')!
  const c = size / 2

  ctx.fillStyle = '#0e1116'
  ctx.beginPath()
  ctx.arc(c, c, c, 0, Math.PI * 2)
  ctx.fill()

  ctx.strokeStyle = '#ffb000'
  ctx.lineWidth = 5
  ctx.beginPath()
  ctx.arc(c, c, c * 0.96, 0, Math.PI * 2)
  ctx.stroke()

  ctx.textAlign = 'center'
  ctx.fillStyle = '#ffb000'
  ctx.font = '700 78px "Space Grotesk", sans-serif'
  ctx.fillText('CIRCUITO', c, c - 24)

  ctx.fillStyle = '#8a93a5'
  ctx.font = '400 26px "Space Mono", monospace'
  ctx.fillText('KILOWATT · 33⅓ RPM', c, c + 48)
  ctx.font = '400 22px "Space Mono", monospace'
  ctx.fillText('PRS-004 · LADO A', c, c + 92)

  // furo do eixo
  ctx.fillStyle = '#0a0c10'
  ctx.beginPath()
  ctx.arc(c, c, 13, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = '#3a4150'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.arc(c, c, 13, 0, Math.PI * 2)
  ctx.stroke()

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 4
  return texture
}
