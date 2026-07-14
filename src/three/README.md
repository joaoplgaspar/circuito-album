# src/three — a cena do vinil (P2 ✓)

Arquitetura e guardrails (Seção 3 do brief), como implementados:

- **Canvas único** (`ThreeLayer.tsx`): um `<Canvas>` fixed atrás da página,
  `pointer-events: none`, com `View.Port` do drei. Cada painel com 3D tem um
  slot `[data-vinyl-slot]` no DOM e recebe uma `<View>` via portal — um só
  contexto WebGL, scissor por painel.
- **Modelo por primitivas** (`VinylModel.tsx`): disco = cilindro fino (96
  segmentos), selos = `CircleGeometry` com textura de canvas 2D. Ranhuras =
  bump map grayscale procedural (`textures.ts`) — sem asset externo.
- **Transmission só no painel 5** (`MeshPhysicalMaterial`): o painel 2 usa
  material padrão. O momento da luz tem backdrop no azul-carvão exato da
  página (`toneMapped: false`, emenda invisível) que dá ao transmission o que
  refratar, environment procedural (`frames={1}`, res 64, zero HDR externo) e
  feixe = spot + cone aditivo + point light — nada de bloom/pós-processamento.
- **GPU budget:** `dpr` cap 1.5 (mobile) / 2 (desktop);
  `frameloop="demand"` quando nenhum slot está na viewport
  (IntersectionObserver, rootMargin 20%).
- **Carregamento:** chunk lazy (`manualChunks` isola three/R3F/drei), montado
  só depois da primeira intenção do usuário — ver `src/lib/useThreeGate.ts`.
  A página inteira é prerenderizada em HTML no build; LCP é texto, nunca o
  canvas.
- **Fallbacks em cascata:** `prefers-reduced-motion` ou sem WebGL2 → a camada
  3D nem monta e os SVGs (`src/components/VinylDisc.tsx`) ficam;
  erro em runtime → `ThreeErrorBoundary` desmonta a camada e os SVGs voltam
  (`html[data-three]` controla a troca via CSS).
- **Mobile:** mesmas cenas com `dpr` menor; se o frame time estourar em
  device real (QA da P4), a variante `fake` do material (opacidade, sem
  transmission) já existe em `VinylModel.tsx`.
