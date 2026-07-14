# src/three — cena R3F do vinil (P2)

Reservado para a fase P2. Guardrails inegociáveis (Seção 3 do brief):

- **Modelo por primitivas** — disco = cilindro fino + normal map procedural de
  ranhuras; labels como texturas; capa/encarte como planos. Sem asset externo
  pesado.
- **Transmission só no painel 5** (`MeshPhysicalMaterial`) — antes disso,
  material padrão. Uma luz principal + ambiente, `samples` baixos.
- **GPU budget:** canvas único, `dpr` cap 1.5 (mobile) / 2 (desktop),
  `frameloop="demand"` fora das cenas ativas, low-poly, zero pós-processamento
  pesado (glow âmbar = emissive + CSS).
- **Carregamento:** dynamic import + IntersectionObserver; a página renderiza
  o conteúdo completo antes do 3D montar. LCP é texto/imagem, nunca o canvas.
- **Fallbacks em cascata:** `prefers-reduced-motion` → renders estáticos do
  próprio modelo; WebGL indisponível/GPU fraca → mesmo fallback. Gate central:
  `src/lib/usePrefersReducedMotion.ts`. O fallback atual (SVG
  `src/components/VinylDisc.tsx`) permanece como base da versão estática.
- **Mobile:** cenas simplificadas (exploded em 2 camadas), transmission
  substituído por fake de opacidade+refração se o frame time estourar.
