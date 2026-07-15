# src/three — o vinil-herói (P2/P3, reformulado)

Um único vinil persistente viaja pela narrativa inteira — não há "cenas"
separadas. Arquitetura:

- **`ThreeLayer.tsx`**: canvas único fixed em `z:-1` (entre o fundo e o
  conteúdo), `pointer-events: none`. `HeroVinyl` resolve a cada frame o
  alvo atual escrito no **`src/lib/heroStore.ts`** — o contrato entre a
  coreografia (GSAP, chunk "motion") e a cena (R3F, chunk "three"); nenhum
  chunk importa o outro.
- **Segmentos**: a coreografia escreve `hero.seg = { from, to, p }`, onde
  cada alvo é `free` (coords normalizadas de viewport) ou `slot` (elemento
  `[data-vinyl-slot]` rastreado por `getBoundingClientRect` POR FRAME — o
  disco gruda no layout e acompanha o scroll entre transições). Damping
  exponencial por cima do scrub.
- **Modelo por primitivas**: cilindro (96 seg) + selos `CircleGeometry`;
  ranhuras = bump map grayscale procedural; capa/encarte = planos com
  textura tipográfica gerada em canvas 2D (`textures.ts`). Zero asset
  externo.
- **Exploded view**: `hero.explode` separa capa/encarte em leque (sobem e
  RECUAM em z — o recuo compensa a perspectiva) com tilt oblíquo vindo da
  timeline; mobile mostra 2 camadas (guardrail).
- **Momento da luz**: `hero.vidro && pressing === 'transparente'` monta o
  `MeshPhysicalMaterial` com transmission (lazy — só é criado aí, guardrail
  do brief). Feixe = spot + point + cone aditivo com **alphaMap gradiente**
  (nasce e morre suave, sem aresta) dirigidos por `hero.glow`. Zero
  pós-processamento — o bloom é overlay CSS.
- **GPU budget**: `dpr` cap 1.5 (mobile) / 2 (desktop); backdrop no
  azul-carvão exato (`toneMapped: false`, emenda invisível); environment
  procedural (`frames={1}`, res 64, sem HDR externo).
- **Fallbacks em cascata**: reduced-motion ou sem WebGL2 → a camada nem
  monta e os SVGs/DOM (`.vinyl-fallback`, `.exploded-fallback`) ficam; erro
  em runtime → `ThreeErrorBoundary` desmonta e os fallbacks voltam
  (`html[data-three]` controla a troca via CSS, ligada só após o primeiro
  frame renderizado).
