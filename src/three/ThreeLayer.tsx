import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import * as THREE from 'three'
import {
  makeGrooveBump,
  makeLabelTexture,
  makeCoverTexture,
  makeInsertTexture,
  makeBeamTexture,
} from './textures'
import { hero, type HeroTarget } from '../lib/heroStore'
import { pressingStore } from '../lib/pressingStore'

/**
 * A cena do case: UM vinil-herói persistente num canvas único fixo atrás
 * do conteúdo (z:-1). A coreografia (chunk "motion") escreve no heroStore;
 * aqui o useFrame resolve alvos (posições livres ou slots do DOM rastreados
 * por frame), faz damping e aplica materiais — o disco viaja contínuo do
 * cold open à saída. Guardrails do brief: primitivas, transmission só na
 * estação da luz, dpr cap, zero pós-processamento.
 */

const DISC_H = 0.035
const LABEL_R = 0.34

const smooth = (p: number) => p * p * (3 - 2 * p)

function makeStandard(bump: THREE.CanvasTexture) {
  return new THREE.MeshStandardMaterial({
    color: '#101216',
    roughness: 0.42,
    metalness: 0.05,
    bumpMap: bump,
    bumpScale: 0.35,
    transparent: true,
  })
}

function makeVidro(bump: THREE.CanvasTexture) {
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
    transparent: true,
  })
}

function HeroVinyl() {
  const positionRef = useRef<THREE.Group>(null)
  const tiltRef = useRef<THREE.Group>(null)
  const spinRef = useRef<THREE.Group>(null)
  const discRef = useRef<THREE.Mesh>(null)
  const coverRef = useRef<THREE.Mesh>(null)
  const insertRef = useRef<THREE.Mesh>(null)
  const beamRef = useRef<THREE.Group>(null)
  const coneMatRef = useRef<THREE.MeshBasicMaterial>(null)
  const spotRef = useRef<THREE.SpotLight>(null)
  const pointRef = useRef<THREE.PointLight>(null)
  const vidroMat = useRef<THREE.MeshPhysicalMaterial | null>(null)

  const { camera } = useThree()

  const tex = useMemo(
    () => ({
      bump: makeGrooveBump(),
      label: makeLabelTexture(),
      cover: makeCoverTexture(),
      insert: makeInsertTexture(),
      beam: makeBeamTexture(),
    }),
    [],
  )
  const mats = useMemo(
    () => ({
      standard: makeStandard(tex.bump),
      label: new THREE.MeshStandardMaterial({
        map: tex.label,
        roughness: 0.85,
        transparent: true,
      }),
      cover: new THREE.MeshStandardMaterial({
        map: tex.cover,
        roughness: 0.8,
        transparent: true,
        side: THREE.DoubleSide,
      }),
      insert: new THREE.MeshStandardMaterial({
        map: tex.insert,
        roughness: 0.9,
        transparent: true,
        side: THREE.DoubleSide,
      }),
    }),
    [tex],
  )

  const coarse = useMemo(() => window.matchMedia('(pointer: coarse)').matches, [])
  const slots = useMemo(() => new Map<string, HTMLElement>(), [])

  useEffect(() => {
    document
      .querySelectorAll<HTMLElement>('[data-vinyl-slot]')
      .forEach((el) => slots.set(el.dataset.vinylSlot ?? '', el))
  }, [slots])

  const resolve = (t: HeroTarget, halfW: number, halfH: number) => {
    if (t.kind === 'free') return { x: t.nx * halfW, y: t.ny * halfH, s: t.scale }
    const el = slots.get(t.id)
    if (!el) return { x: 0, y: 0, s: 1 }
    const r = el.getBoundingClientRect()
    const vw = window.innerWidth
    const vh = window.innerHeight
    const nx = ((r.left + r.width / 2) / vw) * 2 - 1
    const ny = -(((r.top + r.height / 2) / vh) * 2 - 1)
    const worldH = (Math.min(r.height, r.width) / vh) * 2 * halfH
    return { x: nx * halfW, y: ny * halfH, s: (worldH / 2) * t.fit }
  }

  useFrame((state, delta) => {
    const cam = camera as THREE.PerspectiveCamera
    const dist = cam.position.z
    const halfH = Math.tan(THREE.MathUtils.degToRad(cam.fov / 2)) * dist
    const halfW = halfH * cam.aspect

    // alvo do segmento atual: mistura from→to com o progresso do scrub
    const a = resolve(hero.seg.from, halfW, halfH)
    const b = resolve(hero.seg.to, halfW, halfH)
    const p = smooth(Math.min(Math.max(hero.seg.p, 0), 1))
    const tx = a.x + (b.x - a.x) * p
    const ty = a.y + (b.y - a.y) * p
    const ts = a.s + (b.s - a.s) * p

    const g = positionRef.current!
    // damping macio: absorve rajadas de wheel sem o disco "correr" atrás
    const damp = 8.5
    g.position.x = THREE.MathUtils.damp(g.position.x, tx, damp, delta)
    g.position.y = THREE.MathUtils.damp(g.position.y, ty, damp, delta)
    const s = THREE.MathUtils.damp(g.scale.x, ts, damp, delta)
    g.scale.setScalar(s)
    g.visible = hero.visible

    // inclinação + parallax do ponteiro
    const tilt = tiltRef.current!
    tilt.rotation.x = THREE.MathUtils.damp(tilt.rotation.x, hero.tiltX + hero.my * 0.05, damp, delta)
    tilt.rotation.z = THREE.MathUtils.damp(tilt.rotation.z, hero.tiltZ + hero.mx * 0.04, damp, delta)

    // 33⅓ sugerido — desacelera quando apagado
    spinRef.current!.rotation.y += delta * hero.spin * (1 - hero.dim * 0.5)

    // material: transmission só na estação da luz, e só na prensagem transparente
    const wantVidro = hero.vidro && pressingStore.get() === 'transparente'
    if (wantVidro && !vidroMat.current) vidroMat.current = makeVidro(tex.bump)
    const body = wantVidro && vidroMat.current ? vidroMat.current : mats.standard
    if (discRef.current!.material !== body) discRef.current!.material = body

    // dim: o herói recua pro fundo sem sair de cena; em 1, some por completo
    const alpha = Math.max(0, 1 - hero.dim)
    body.opacity = alpha
    mats.label.opacity = alpha

    // exploded view: capa e encarte sobem e recuam de leve — o recuo em z
    // compensa a perspectiva (sem ele a capa "cresce" e engole a cena)
    const e = smooth(hero.explode)
    const cover = coverRef.current!
    const insert = insertRef.current!
    // leque: capa sobe à direita, encarte escapa à esquerda — as três
    // camadas ficam legíveis ao mesmo tempo
    cover.position.y = 0.04 + e * 0.85
    cover.position.z = -e * 0.32
    cover.position.x = e * 0.12
    insert.position.y = 0.02 + e * 0.45
    insert.position.z = -e * 0.16
    insert.position.x = -e * 0.55
    const layerAlpha = Math.min(e * 2.5, 1) * alpha
    mats.cover.opacity = layerAlpha
    mats.insert.opacity = coarse ? 0 : layerAlpha // mobile: 2 camadas (guardrail)
    cover.visible = e > 0.004
    insert.visible = !coarse && e > 0.004

    // feixe do momento da luz
    const glow = hero.glow * (wantVidro ? 1 : 0.25)
    beamRef.current!.visible = glow > 0.02
    if (coneMatRef.current) coneMatRef.current.opacity = 0.75 * glow
    if (spotRef.current) spotRef.current.intensity = 45 * glow
    if (pointRef.current) pointRef.current.intensity = 14 * glow

    state.invalidate()
  })

  return (
    <group ref={positionRef}>
      <group ref={tiltRef}>
        <group ref={spinRef}>
          <mesh ref={discRef} material={mats.standard}>
            <cylinderGeometry args={[1, 1, DISC_H, 96]} />
          </mesh>
          <mesh
            material={mats.label}
            position={[0, DISC_H / 2 + 0.0015, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <circleGeometry args={[LABEL_R, 48]} />
          </mesh>
          <mesh
            material={mats.label}
            position={[0, -(DISC_H / 2 + 0.0015), 0]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <circleGeometry args={[LABEL_R, 48]} />
          </mesh>
        </group>

        {/* camadas da prensagem (exploded view) — não giram com o disco */}
        <mesh
          ref={coverRef}
          material={mats.cover}
          rotation={[-Math.PI / 2, 0, 0.04]}
          visible={false}
        >
          <planeGeometry args={[2.15, 2.15]} />
        </mesh>
        <mesh
          ref={insertRef}
          material={mats.insert}
          rotation={[-Math.PI / 2, 0, -0.03]}
          visible={false}
        >
          <planeGeometry args={[1.9, 1.9]} />
        </mesh>
      </group>

      {/* o feixe viaja com o herói; só acende na estação da luz. É um quad
          PINTADO (gradiente feathered, zero silhueta geométrica) atrás do
          plano do disco: o depth test oclui o que o disco cobre e o
          transmission refrata o feixe através do vidro. A luz "de verdade"
          sobre o material vem do spot + point. */}
      <group ref={beamRef} visible={false}>
        <spotLight
          ref={spotRef}
          position={[0, 2.6, -1.4]}
          angle={0.5}
          penumbra={0.8}
          intensity={0}
          color="#ffb000"
        />
        <pointLight ref={pointRef} position={[0, 0.4, -1.3]} intensity={0} color="#ffb000" distance={6} />
        {/* quad alto o bastante pro início do gradiente ficar sempre fora
            da tela na estação da luz — sem linha de corte no topo */}
        <mesh position={[0, 1.7, -0.7]}>
          <planeGeometry args={[3.4, 5.4]} />
          <meshBasicMaterial
            ref={coneMatRef}
            map={tex.beam}
            transparent
            opacity={0}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      </group>
    </group>
  )
}

export default function ThreeLayer() {
  const dprCap = useMemo(
    () => (window.matchMedia('(pointer: coarse)').matches ? 1.5 : 2),
    [],
  )

  useEffect(() => {
    // liga a troca SVG→3D só depois do primeiro frame renderizado
    const id = requestAnimationFrame(() => {
      document.documentElement.dataset.three = 'on'
    })
    return () => {
      cancelAnimationFrame(id)
      delete document.documentElement.dataset.three
    }
  }, [])

  return (
    <Canvas
      className="three-canvas"
      style={{ position: 'fixed', inset: 0, zIndex: -1, pointerEvents: 'none' }}
      dpr={[1, dprCap]}
      camera={{ position: [0, 0, 3.4], fov: 38 }}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
    >
      <ambientLight intensity={0.45} />
      <directionalLight position={[2.5, 2.5, 2]} intensity={1.6} />
      <directionalLight position={[-2.5, -1, -2]} intensity={0.9} color="#ffb000" />

      {/* backdrop no azul-carvão exato da página (toneMapped=false): dá ao
          transmission o que refratar, sem emenda visível */}
      <mesh position={[0, 0, -2.4]}>
        <planeGeometry args={[14, 14]} />
        <meshBasicMaterial color="#0a0c10" toneMapped={false} />
      </mesh>

      {/* environment procedural — reflexos sem HDR externo */}
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

      <HeroVinyl />
    </Canvas>
  )
}
