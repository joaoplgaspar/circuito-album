import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import Lenis from 'lenis'

/**
 * Coreografia da página (P3) — regras da Seção 4 do brief:
 * - ScrollTrigger com scrub suave; SEM scroll-jacking (o scroll nunca é
 *   sequestrado; pins curtos < 1.5 viewport só no exploded view e no
 *   momento da luz, e só em desktop)
 * - easing do sistema: expo.out (≈ --ease-premium); bounce/elastic proibido
 * - traço de circuito e reveals = transform/opacity/clip-path — nada que
 *   force layout por frame
 *
 * Este módulo inteiro vive no chunk "motion" e só carrega depois da
 * primeira intenção do usuário, com reduced-motion já descartado no gate.
 */

const EASE = 'expo.out'

export async function initMotion(): Promise<() => void> {
  gsap.registerPlugin(ScrollTrigger, SplitText)

  // SplitText mede linhas: precisa das webfonts prontas
  await document.fonts.ready

  // —— Lenis: suavização sobre o scroll nativo (teclado continua nativo) ——
  const lenis = new Lenis({ autoRaf: false })
  lenis.on('scroll', ScrollTrigger.update)
  const raf = (time: number) => lenis.raf(time * 1000)
  gsap.ticker.add(raf)
  gsap.ticker.lagSmoothing(0)

  const mm = gsap.matchMedia()
  const splits: SplitText[] = []

  // —— Cold open: intro só se o usuário ainda está nele ——
  if (window.scrollY < window.innerHeight * 0.4) {
    const intro = gsap.timeline({ defaults: { ease: EASE } })
    intro
      .from('[data-fx="wave"] rect', {
        scaleY: 0.1,
        transformOrigin: 'center',
        stagger: { each: 0.012, from: 'center' },
        duration: 0.5,
      })
      .fromTo(
        '[data-fx="title"]',
        { clipPath: 'inset(0 0 100% 0)' },
        { clipPath: 'inset(0 0 0% 0)', duration: 0.9 },
        '<0.15',
      )
      .from('[data-fx="fade"]', { y: 18, autoAlpha: 0, stagger: 0.12, duration: 0.6 }, '<0.3')
  }

  // disco de fundo girando devagar (composite-only: transform em layer com blur)
  gsap.to('[data-fx="disc"]', { rotation: 360, duration: 90, repeat: -1, ease: 'none' })

  // hint de scroll some no primeiro avanço
  gsap.to('[data-fx="hint"]', {
    autoAlpha: 0,
    scrollTrigger: { start: 40, end: 120, scrub: true },
  })

  // —— Traço de circuito: cada painel energiza sua linha conforme o scroll ——
  document.querySelectorAll<HTMLElement>('.trace-fill').forEach((fill) => {
    gsap.to(fill, {
      scaleY: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: fill.parentElement,
        start: 'top 75%',
        end: 'bottom 60%',
        scrub: 0.6,
      },
    })
  })

  // —— Reveals: headings com SplitText + máscara; leads com rise ——
  document.querySelectorAll<HTMLElement>('main section h2').forEach((h2) => {
    const split = SplitText.create(h2, { type: 'lines', mask: 'lines' })
    splits.push(split)
    gsap.from(split.lines, {
      yPercent: 110,
      duration: 0.8,
      ease: EASE,
      stagger: 0.09,
      scrollTrigger: { trigger: h2, start: 'top 85%', once: true },
    })
  })

  ScrollTrigger.batch('main section p.text-lg', {
    start: 'top 88%',
    once: true,
    onEnter: (els) =>
      gsap.from(els, { y: 22, autoAlpha: 0, duration: 0.7, ease: EASE, stagger: 0.1 }),
  })

  // —— Tracklist: micro-waveforms se desenham ao entrar no viewport ——
  ScrollTrigger.batch('#faixas li', {
    start: 'top 88%',
    once: true,
    onEnter: (items) =>
      items.forEach((li, i) =>
        gsap.from(li.querySelectorAll('svg rect'), {
          scaleY: 0.1,
          transformOrigin: 'center',
          duration: 0.45,
          ease: EASE,
          stagger: 0.006,
          delay: i * 0.08,
        }),
      ),
  })

  // —— Exploded view: camadas se separam com o scroll ——
  const layers = gsap.utils.toArray<HTMLElement>('#prensagem figure')
  if (layers.length) {
    mm.add('(min-width: 768px)', () => {
      // desktop: pin curto (~1 viewport) enquanto as camadas abrem
      gsap.from(layers, {
        y: (i) => -i * 120,
        autoAlpha: (i: number) => (i === 0 ? 1 : 0.25),
        ease: 'none',
        scrollTrigger: {
          trigger: '#prensagem',
          start: 'top 25%',
          end: '+=70%',
          scrub: 0.5,
          pin: true,
          anticipatePin: 1,
        },
      })
    })
    mm.add('(max-width: 767px)', () => {
      // mobile: sem pin — separação em 2 tempos, mais leve
      gsap.from(layers.slice(1), {
        y: -48,
        autoAlpha: 0.35,
        ease: 'none',
        stagger: 0.05,
        scrollTrigger: { trigger: '#prensagem', start: 'top 60%', end: 'bottom 80%', scrub: 0.6 },
      })
    })
  }

  // —— Momento da luz: pin curto; o glow CSS acende com o scroll ——
  mm.add('(min-width: 768px)', () => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#momento-da-luz',
        start: 'top 15%',
        end: '+=60%',
        scrub: 0.5,
        pin: true,
        anticipatePin: 1,
      },
    })
    tl.fromTo('.glow-overlay', { autoAlpha: 0 }, { autoAlpha: 1, ease: 'none' }).fromTo(
      '[data-vinyl-slot="light"]',
      { scale: 0.94 },
      { scale: 1, ease: 'none' },
      0,
    )
  })
  mm.add('(max-width: 767px)', () => {
    gsap.fromTo(
      '.glow-overlay',
      { autoAlpha: 0 },
      {
        autoAlpha: 1,
        ease: 'none',
        scrollTrigger: { trigger: '#momento-da-luz', start: 'top 60%', end: 'center 45%', scrub: 0.6 },
      },
    )
  })

  // —— Stamp 047/200: estampa ao entrar (eco da linguagem PRENSA) ——
  gsap.from('#edicao [data-fx="stamp"]', {
    scale: 1.5,
    autoAlpha: 0,
    rotate: -9,
    duration: 0.45,
    ease: 'power4.out',
    scrollTrigger: { trigger: '#edicao', start: 'top 70%', once: true },
  })

  // —— Painel de compra + créditos: rise discreto ——
  ScrollTrigger.batch('#comprar [role="radio"], #comprar a', {
    start: 'top 90%',
    once: true,
    onEnter: (els) =>
      gsap.from(els, { y: 20, autoAlpha: 0, duration: 0.6, ease: EASE, stagger: 0.08 }),
  })
  ScrollTrigger.batch('#creditos dl > div', {
    start: 'top 92%',
    once: true,
    onEnter: (els) =>
      gsap.from(els, { y: 14, autoAlpha: 0, duration: 0.5, ease: EASE, stagger: 0.05 }),
  })

  return () => {
    mm.revert()
    ScrollTrigger.getAll().forEach((t) => t.kill())
    splits.forEach((s) => s.revert())
    gsap.ticker.remove(raf)
    lenis.destroy()
  }
}
