import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { makeGrooveBump, makeLabelTexture } from './textures'

export type VinylVariant =
  /** prensagem preta — material padrão */
  | 'preta'
  /** transparente "fake" (opacidade, sem transmission) — painéis antes do 5 e mobile */
  | 'fake'
  /** transparente real (MeshPhysicalMaterial + transmission) — só no momento da luz */
  | 'vidro'

type VinylModelProps = {
  variant: VinylVariant
  /** rad/s — 33⅓ RPM real é ~3.5; usamos rotação "sugerida", mais lenta */
  speed?: number
}

const DISC_RADIUS = 1
const DISC_HEIGHT = 0.035
const LABEL_RADIUS = 0.34

/** texturas compartilhadas entre vistas/variantes — geradas uma única vez */
let shared: { bump: THREE.CanvasTexture; label: THREE.CanvasTexture } | null = null
function sharedTextures() {
  shared ??= { bump: makeGrooveBump(), label: makeLabelTexture() }
  return shared
}

function makeBodyMaterial(variant: VinylVariant, bump: THREE.CanvasTexture): THREE.Material {
  switch (variant) {
    case 'preta':
      return new THREE.MeshStandardMaterial({
        color: '#101216',
        roughness: 0.42,
        metalness: 0.05,
        bumpMap: bump,
        bumpScale: 0.35,
      })
    case 'fake':
      // truque de opacidade — lê como translúcido sem o custo do transmission
      return new THREE.MeshStandardMaterial({
        color: '#c98f2d',
        roughness: 0.18,
        metalness: 0,
        transparent: true,
        opacity: 0.55,
        bumpMap: bump,
        bumpScale: 0.5,
        side: THREE.DoubleSide,
      })
    case 'vidro':
      // caro por natureza: só monta no painel 5 (guardrail do brief)
      return new THREE.MeshPhysicalMaterial({
        transmission: 1,
        thickness: 0.18,
        ior: 1.45,
        roughness: 0.12,
        color: '#fff3dc',
        attenuationColor: '#ffb000',
        attenuationDistance: 3,
        bumpMap: bump,
        bumpScale: 0.3,
        envMapIntensity: 1.3,
      })
  }
}

/**
 * O vinil por primitivas: cilindro fino (96 segmentos) + dois selos como
 * CircleGeometry com textura procedural. Zero asset externo.
 */
export function VinylModel({ variant, speed = 0.45 }: VinylModelProps) {
  const spin = useRef<THREE.Group>(null)
  const { bump, label } = sharedTextures()

  const bodyMaterial = useMemo(() => makeBodyMaterial(variant, bump), [variant, bump])
  const labelMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({ map: label, roughness: 0.85, metalness: 0 }),
    [label],
  )

  useFrame((_, delta) => {
    if (spin.current) spin.current.rotation.y += delta * speed
  })

  const labelY = DISC_HEIGHT / 2 + 0.0015

  return (
    <group ref={spin}>
      <mesh material={bodyMaterial}>
        <cylinderGeometry args={[DISC_RADIUS, DISC_RADIUS, DISC_HEIGHT, 96]} />
      </mesh>
      <mesh material={labelMaterial} position={[0, labelY, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[LABEL_RADIUS, 48]} />
      </mesh>
      <mesh material={labelMaterial} position={[0, -labelY, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[LABEL_RADIUS, 48]} />
      </mesh>
    </group>
  )
}
