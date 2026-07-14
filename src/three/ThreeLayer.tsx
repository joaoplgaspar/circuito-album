import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Canvas } from '@react-three/fiber'
import { View, PerspectiveCamera, Environment } from '@react-three/drei'
import * as THREE from 'three'
import { VinylModel } from './VinylModel'
import { makeBackdropTexture } from './textures'
import { usePressing } from '../lib/pressingStore'

/**
 * Camada 3D do case — guardrails da Seção 3 do brief:
 * canvas ÚNICO (fixed, atrás de tudo, pointer-events none) + uma View do
 * drei portada em cada slot [data-vinyl-slot]; dpr com cap 1.5 (mobile) /
 * 2 (desktop); frameloop="demand" quando nenhum slot está na viewport.
 * Este módulo inteiro vive num chunk lazy — nada dele toca o JS inicial.
 */

type Slot = { el: HTMLElement; kind: string }

/** Vista do painel 2 — o objeto, material padrão (sem transmission). */
function ObjectScene() {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 3.3]} fov={35} />
      <ambientLight intensity={0.45} />
      <directionalLight position={[2.5, 2.5, 2]} intensity={1.6} />
      <directionalLight position={[-2.5, -1, -2]} intensity={0.9} color="#ffb000" />
      <group rotation={[1.15, 0, -0.12]}>
        <VinylModel variant="preta" />
      </group>
    </>
  )
}

/** Vista do painel 5 — o momento da luz: transmission + feixe atravessando. */
function LightScene() {
  const pressing = usePressing()
  const transparent = pressing === 'transparente'
  const backdrop = useMemo(() => makeBackdropTexture(), [])

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0.1, 3.7]} fov={38} />
      <ambientLight intensity={transparent ? 0.5 : 0.5} />
      <directionalLight position={[2, 2.5, 2]} intensity={1.4} />

      {/* backdrop no mesmo azul-carvão da página: é o que o transmission
          refrata, e carrega a cáustica sugerida do feixe. toneMapped=false
          preserva o #0A0C10 exato — sem emenda visível com a página */}
      <mesh position={[0, 0, -2.2]}>
        <planeGeometry args={[11, 11]} />
        <meshBasicMaterial map={backdrop} toneMapped={false} />
      </mesh>

      {/* environment procedural (frames=1, res 64) — reflexos sem HDR externo */}
      <Environment frames={1} resolution={64}>
        <mesh scale={30}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshBasicMaterial color="#141922" side={THREE.BackSide} />
        </mesh>
        <mesh position={[0, 5, -4]}>
          <planeGeometry args={[12, 4]} />
          <meshBasicMaterial color="#e8ddc8" />
        </mesh>
        <mesh position={[-4, -2, 3]} rotation={[0, 1.2, 0]}>
          <planeGeometry args={[6, 3]} />
          <meshBasicMaterial color="#ffb000" />
        </mesh>
      </Environment>

      {transparent && (
        <>
          {/* o feixe: spot âmbar atravessando o disco + cone aditivo barato
              (o "glow" pesado fica pro CSS — zero pós-processamento) */}
          <spotLight
            position={[0, 2.6, -1.2]}
            angle={0.5}
            penumbra={0.8}
            intensity={45}
            color="#ffb000"
          />
          {/* luz "dentro do feixe", atrás do disco — faz o material acender */}
          <pointLight position={[0, 0.4, -1.3]} intensity={14} color="#ffb000" distance={6} />
          <mesh position={[0, 1, -0.5]} rotation={[0.3, 0, 0]}>
            <coneGeometry args={[1.1, 3.4, 32, 1, true]} />
            <meshBasicMaterial
              color="#ffb000"
              transparent
              opacity={0.06}
              blending={THREE.AdditiveBlending}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>
        </>
      )}
      <group rotation={[1.35, 0, 0.08]}>
        <VinylModel variant={transparent ? 'vidro' : 'preta'} speed={0.3} />
      </group>
    </>
  )
}

export default function ThreeLayer() {
  const [slots, setSlots] = useState<Slot[]>([])
  const [active, setActive] = useState(false)
  const visible = useRef(new Map<Element, boolean>())

  const dprCap = useMemo(
    () => (window.matchMedia('(pointer: coarse)').matches ? 1.5 : 2),
    [],
  )

  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-vinyl-slot]'))
    setSlots(els.map((el) => ({ el, kind: el.dataset.vinylSlot ?? '' })))

    // sinaliza pro CSS esconder os fallbacks SVG dos slots com vista 3D viva
    document.documentElement.dataset.three = 'on'

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) visible.current.set(entry.target, entry.isIntersecting)
        setActive([...visible.current.values()].some(Boolean))
      },
      { rootMargin: '20% 0px' },
    )
    els.forEach((el) => io.observe(el))

    return () => {
      io.disconnect()
      delete document.documentElement.dataset.three
    }
  }, [])

  return (
    <>
      <Canvas
        style={{ position: 'fixed', inset: 0, zIndex: 10, pointerEvents: 'none' }}
        dpr={[1, dprCap]}
        frameloop={active ? 'always' : 'demand'}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      >
        <View.Port />
      </Canvas>

      {slots.map(({ el, kind }) =>
        createPortal(
          <View key={kind} className="absolute inset-0">
            {kind === 'light' ? <LightScene /> : <ObjectScene />}
          </View>,
          el,
        ),
      )}
    </>
  )
}
