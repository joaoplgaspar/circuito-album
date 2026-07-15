import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import Lenis from 'lenis'
import { hero, COLD, type HeroTarget } from '../lib/heroStore'
import { supportsWebGL2 } from '../lib/webgl'

/**
 * Coreografia (P3, reformulada): o vinil-herói é UM objeto contínuo — cada
 * transição entre painéis é um segmento (from→to) escrito no heroStore e
 * scrubado pelo scroll; entre segmentos ele fica GRUDADO no slot do painel
 * (rastreado por frame na cena). Regras do brief: sem scroll-jacking, pins
 * curtos só no exploded view e no momento da luz, easing do sistema,
 * bounce proibido.
 */

const EASE = 'expo.out'

// estações livres (coords normalizadas de viewport)
const EDGE: HeroTarget = { kind: 'free', nx: 0.62, ny: 0.08, scale: 0.85 }
const EDGE_MOBILE: HeroTarget = { kind: 'free', nx: 0.95, ny: 0.12, scale: 0.7 }
const STAGE: HeroTarget = { kind: 'free', nx: 0.16, ny: -0.3, scale: 0.68 }
const STAGE_MOBILE: HeroTarget = { kind: 'free', nx: 0, ny: -0.22, scale: 0.5 }
const EXIT: HeroTarget = { kind: 'free', nx: 0, ny: -1.6, scale: 0.5 }
const OBJ_SLOT: HeroTarget = { kind: 'slot', id: 'object', fit: 0.95 }
const LIGHT_SLOT: HeroTarget = { kind: 'slot', id: 'light', fit: 0.95 }

/** segmento do herói scrubado pelo range do trigger */
function heroLeg(
  trigger: string,
  start: string,
  end: string,
  from: HeroTarget,
  to: HeroTarget,
  vars?: Record<string, number>,
) {
  const seg = { from, to, p: 0 }
  ScrollTrigger.create({
    trigger,
    start,
    end,
    scrub: 0.4,
    onUpdate(self) {
      hero.seg = seg
      seg.p = self.progress
    },
  })
  if (vars) {
    gsap.timeline({ scrollTrigger: { trigger, start, end, scrub: 0.4 } }).to(hero, {
      ...vars,
      ease: 'none',
      immediateRender: false,
    })
  }
}

export async function initMotion(): Promise<() => void> {
  gsap.registerPlugin(ScrollTrigger, SplitText)
  await document.fonts.ready

  // —— Lenis sobre o scroll nativo (teclado permanece nativo) ——
  const lenis = new Lenis({ autoRaf: false, lerp: 0.12 })
  lenis.on('scroll', ScrollTrigger.update)
  const raf = (time: number) => lenis.raf(time * 1000)
  gsap.ticker.add(raf)
  gsap.ticker.lagSmoothing(0)

  const mm = gsap.matchMedia()
  const splits: SplitText[] = []
  const threeOk = supportsWebGL2()
  const listeners: Array<() => void> = []

  // ————————————————————————————————————————————————————————————
  // COLD OPEN — intro + saída com parallax (a primeira dobra tem drama)
  // ————————————————————————————————————————————————————————————
  if (window.scrollY < window.innerHeight * 0.4) {
    gsap
      .timeline({ defaults: { ease: EASE } })
      .from('[data-fx="wave"] rect', {
        scaleY: 0.1,
        transformOrigin: 'center',
        stagger: { each: 0.012, from: 'center' },
        duration: 0.5,
      })
      .fromTo(
        '[data-fx="title"]',
        { clipPath: 'inset(0 0 100% 0)' },
        { clipPath: 'inset(0 0 0% 0)', duration: 1.1 },
        '<0.1',
      )
      .from('[data-fx="fade"]', { y: 18, autoAlpha: 0, stagger: 0.12, duration: 0.6 }, '<0.35')
      .from('[data-fx="hint"]', { autoAlpha: 0, duration: 0.8 }, '<0.4')
  }

  // saída do cold open: título sobe e dissolve em camadas (parallax real)
  gsap
    .timeline({
      scrollTrigger: { trigger: '#cold-open', start: 'top top', end: 'bottom 35%', scrub: 0.4 },
    })
    .to('[data-fx="title"]', { yPercent: -45, autoAlpha: 0, ease: 'none' }, 0)
    .to('[data-fx="fade"]', { yPercent: -110, autoAlpha: 0, stagger: 0.06, ease: 'none' }, 0)
    .to('[data-fx="wave"]', { yPercent: -160, scaleX: 0.4, autoAlpha: 0, ease: 'none' }, 0)
  gsap.to('[data-fx="hint"]', {
    autoAlpha: 0,
    scrollTrigger: { start: 30, end: 110, scrub: true },
  })

  // ————————————————————————————————————————————————————————————
  // A JORNADA DO HERÓI + PINS — criados em ORDEM DE DOCUMENTO, por
  // breakpoint. ScrollTrigger refresca na ordem de registro: um trigger
  // registrado antes de um pin que o precede no documento calcula posições
  // sem o spacer do pin — e a coreografia inteira desanda.
  // ————————————————————————————————————————————————————————————

  // exploded view: timeline SIMÉTRICA (abre, segura, fecha dentro do próprio
  // range) — o explode nunca vaza pra outro trigger. O tilt vai pra oblíquo
  // enquanto abre (de frente, as camadas não se separam na tela) e volta.
  const explodedTl = (st: ScrollTrigger.Vars) =>
    gsap
      .timeline({ scrollTrigger: st })
      .fromTo(
        hero,
        { explode: 0 },
        { explode: 1, duration: 0.4, ease: 'none', immediateRender: false },
        0,
      )
      .to(hero, { tiltX: 0.92, tiltZ: -0.22, spin: 0.05, duration: 0.4, ease: 'none' }, 0)
      .from('.exploded-labels li', { x: -18, autoAlpha: 0, stagger: 0.1, duration: 0.16 }, 0.08)
      .to({}, { duration: 0.22 }, 0.4) // respiro com tudo aberto
      .to('.exploded-labels li', { autoAlpha: 0, stagger: 0.05, duration: 0.1 }, 0.62)
      .to(hero, { explode: 0, duration: 0.28, ease: 'none' }, 0.7)
      .to(hero, { tiltX: 1.28, tiltZ: 0.1, spin: 0.1, duration: 0.28, ease: 'none' }, 0.7)

  // momento da luz: mesmo padrão simétrico — acende, segura, apaga
  const glowTl = (st: ScrollTrigger.Vars) => {
    const tl = gsap.timeline({ scrollTrigger: st })
    tl.fromTo('.glow-overlay', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.35, ease: 'none' }, 0)
      .to({}, { duration: 0.35 }, 0.35)
      .to('.glow-overlay', { autoAlpha: 0, duration: 0.3, ease: 'none' }, 0.7)
    if (threeOk) {
      tl.fromTo(
        hero,
        { glow: 0 },
        { glow: 1, duration: 0.35, ease: 'none', immediateRender: false },
        0,
      ).to(hero, { glow: 0, duration: 0.3, ease: 'none' }, 0.7)
    }
    return tl
  }

  const journey = (desktop: boolean) => {
    const edge = desktop ? EDGE : EDGE_MOBILE
    const stage = desktop ? STAGE : STAGE_MOBILE

    if (threeOk) {
      heroLeg('#o-objeto', 'top 96%', 'top 42%', COLD, OBJ_SLOT, {
        tiltX: 1.12,
        tiltZ: -0.12,
        dim: 0,
        spin: 0.5,
      })
      heroLeg('#faixas', 'top 96%', 'top 48%', OBJ_SLOT, edge, {
        tiltX: 1.5,
        tiltZ: 0.3,
        dim: desktop ? 0.55 : 0.6,
        spin: 0.22,
      })
      heroLeg('#prensagem', 'top 92%', desktop ? 'top 30%' : 'top 40%', edge, stage, {
        tiltX: 1.28,
        tiltZ: 0.1,
        dim: 0,
        spin: 0.1,
      })
      explodedTl(
        desktop
          ? {
              trigger: '#prensagem',
              start: 'top top',
              end: '+=110%',
              scrub: 0.4,
              pin: true,
              anticipatePin: 1,
            }
          : { trigger: '#prensagem', start: 'top 45%', end: 'bottom 95%', scrub: 0.5 },
      )
      heroLeg('#momento-da-luz', 'top 96%', 'top 45%', stage, LIGHT_SLOT, {
        tiltX: 1.35,
        tiltZ: 0.06,
        spin: 0.3,
      })
    }

    glowTl(
      desktop
        ? {
            trigger: '#momento-da-luz',
            start: 'top top',
            end: '+=75%',
            scrub: 0.4,
            pin: true,
            anticipatePin: 1,
          }
        : { trigger: '#momento-da-luz', start: 'top 65%', end: 'bottom 80%', scrub: 0.5 },
    )

    if (threeOk) {
      heroLeg('#edicao', 'top 70%', 'top 15%', LIGHT_SLOT, EXIT, {
        dim: 0.9,
        spin: 0.12,
      })
      // herói some de vez no painel de compra (e volta se o scroll voltar)
      ScrollTrigger.create({
        trigger: '#comprar',
        start: 'top 90%',
        onEnter: () => {
          hero.visible = false
        },
        onLeaveBack: () => {
          hero.visible = true
        },
      })
    }
  }

  mm.add('(min-width: 768px)', () => journey(true))
  mm.add('(max-width: 767px)', () => journey(false))

  if (threeOk) {
    // estação da luz: material transmission elegível
    ScrollTrigger.create({
      trigger: '#momento-da-luz',
      start: 'top 85%',
      end: 'bottom 15%',
      onToggle: (self) => {
        hero.vidro = self.isActive
      },
    })

    // parallax do ponteiro (desktop, leve)
    mm.add('(pointer: fine)', () => {
      const setMx = gsap.quickTo(hero, 'mx', { duration: 0.8, ease: 'power2.out' })
      const setMy = gsap.quickTo(hero, 'my', { duration: 0.8, ease: 'power2.out' })
      const onMove = (e: PointerEvent) => {
        setMx((e.clientX / window.innerWidth) * 2 - 1)
        setMy((e.clientY / window.innerHeight) * 2 - 1)
      }
      window.addEventListener('pointermove', onMove, { passive: true })
      listeners.push(() => window.removeEventListener('pointermove', onMove))
    })
  } else {
    // sem WebGL: as camadas DOM (fallback) se separam com o scroll
    gsap.from('#prensagem figure', {
      y: (i: number) => -i * 90,
      autoAlpha: (i: number) => (i === 0 ? 1 : 0.3),
      ease: 'none',
      scrollTrigger: { trigger: '#prensagem', start: 'top 60%', end: 'bottom 85%', scrub: 0.5 },
    })
  }

  // ————————————————————————————————————————————————————————————
  // TRAÇO DE CIRCUITO — contínuo: cada painel completa na mesma linha de
  // viewport em que o próximo começa; nodes acendem na passagem
  // ————————————————————————————————————————————————————————————
  document.querySelectorAll<HTMLElement>('.trace-fill').forEach((fill) => {
    gsap.to(fill, {
      scaleY: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: fill.parentElement,
        start: 'top 82%',
        end: 'bottom 82%',
        scrub: 0.3,
      },
    })
  })
  document.querySelectorAll<HTMLElement>('.trace-node').forEach((node) => {
    ScrollTrigger.create({
      trigger: node,
      start: 'top 82%',
      onEnter: () => node.classList.add('lit'),
      onLeaveBack: () => node.classList.remove('lit'),
    })
  })

  // ————————————————————————————————————————————————————————————
  // REVEALS — linguagem única: marks decodificam, headings mascarados,
  // leads sobem; tudo com o mesmo ease e distâncias consistentes
  // ————————————————————————————————————————————————————————————
  document.querySelectorAll<HTMLElement>('.panel-mark').forEach((mark) => {
    const split = SplitText.create(mark, { type: 'chars' })
    splits.push(split)
    gsap.from(split.chars, {
      autoAlpha: 0,
      duration: 0.35,
      ease: 'none',
      stagger: { each: 0.02, from: 'random' },
      scrollTrigger: { trigger: mark, start: 'top 88%', once: true },
    })
  })

  document.querySelectorAll<HTMLElement>('main section h2').forEach((h2) => {
    const split = SplitText.create(h2, { type: 'lines', mask: 'lines' })
    splits.push(split)
    gsap.from(split.lines, {
      yPercent: 110,
      duration: 0.9,
      ease: EASE,
      stagger: 0.09,
      scrollTrigger: { trigger: h2, start: 'top 85%', once: true },
    })
  })

  ScrollTrigger.batch('main section p.text-lg', {
    start: 'top 90%',
    once: true,
    onEnter: (els) =>
      gsap.from(els, { y: 26, autoAlpha: 0, duration: 0.8, ease: EASE, stagger: 0.1 }),
  })

  // specs do objeto orbitam pra dentro
  gsap.from('#o-objeto li', {
    x: 24,
    autoAlpha: 0,
    duration: 0.7,
    ease: EASE,
    stagger: 0.08,
    scrollTrigger: { trigger: '#o-objeto', start: 'top 55%', once: true },
  })

  // tracklist: waveforms se desenham na entrada
  ScrollTrigger.batch('#faixas li', {
    start: 'top 90%',
    once: true,
    onEnter: (items) =>
      items.forEach((li, i) =>
        gsap.from(li.querySelectorAll('svg rect'), {
          scaleY: 0.1,
          transformOrigin: 'center',
          duration: 0.45,
          ease: EASE,
          stagger: 0.006,
          delay: i * 0.07,
        }),
      ),
  })

  // stamp 047/200
  gsap.from('[data-fx="stamp"]', {
    scale: 1.5,
    autoAlpha: 0,
    rotate: -9,
    duration: 0.45,
    ease: 'power4.out',
    scrollTrigger: { trigger: '#edicao', start: 'top 70%', once: true },
  })

  ScrollTrigger.batch('#comprar [role="radio"], #comprar a', {
    start: 'top 92%',
    once: true,
    onEnter: (els) =>
      gsap.from(els, { y: 20, autoAlpha: 0, duration: 0.6, ease: EASE, stagger: 0.08 }),
  })
  ScrollTrigger.batch('#creditos dl > div', {
    start: 'top 94%',
    once: true,
    onEnter: (els) =>
      gsap.from(els, { y: 14, autoAlpha: 0, duration: 0.5, ease: EASE, stagger: 0.05 }),
  })

  // garantia extra: ordena a fila de refresh por posição real e recalcula
  ScrollTrigger.sort()
  ScrollTrigger.refresh()

  return () => {
    mm.revert()
    ScrollTrigger.getAll().forEach((t) => t.kill())
    splits.forEach((s) => s.revert())
    listeners.forEach((off) => off())
    gsap.ticker.remove(raf)
    lenis.destroy()
  }
}
