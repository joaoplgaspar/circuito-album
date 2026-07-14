# CIRCUITO · Album Experience

Página imersiva de lançamento do disco **"Circuito"**, da banda fictícia
**KILOWATT** — o disco eletrônico do catálogo da PRENSA RECORDS, em edição
transparente limitada de 200 cópias numeradas.

> **Tudo aqui é fictício** — banda, álbum, faixas e créditos. CIRCUITO é um
> lançamento fictício da PRENSA RECORDS: uma demonstração de engenharia
> front-end por João Pedro Gaspar.

## A tese do case

Página com cara de Awwwards que **mantém Lighthouse mobile ≥ 90 nas quatro
categorias**. O budget de performance não é um requisito ao lado do craft —
é o próprio case. Se um efeito não cabe no budget, o efeito perde.

Scroll-driven storytelling (GSAP + Lenis) + vinil em 3D real (React Three
Fiber), fechando o funil fictício completo:

```
campanha (esta página) → loja (PRENSA) → mecânica (carrinho otimista)
```

O CTA deep-linka pra PDP do disco na loja PRENSA com a variante
pré-selecionada (`?variant=`).

## Performance budget (inegociável)

| Métrica | Alvo |
| --- | --- |
| Lighthouse mobile | ≥ 90 nas 4 categorias, **com as cenas 3D ativas** |
| LCP | < 2.5s — e é texto/imagem, nunca o canvas |
| CLS | < 0.05 |
| JS inicial | < 180KB gzip (3D fora do bundle inicial, lazy) |
| INP | < 200ms durante o scroll |

### Tabela de trade-offs

Cada decisão tomada pra caber no budget é registrada aqui — esta tabela é o
coração da case study.

| Decisão | Custo evitado | Efeito |
| --- | --- | --- |
| three/R3F e GSAP/Lenis em chunks separados, carregados sob demanda | ~centenas de KB fora do JS inicial | JS inicial contém só React + a página estática |
| Fontes self-hosted (@fontsource), só subset latin, 4 arquivos de peso | requisição a third-party + pesos não usados | zero render-blocking externo |
| Vinil como SVG procedural na P1 (e como fallback permanente) | asset 3D/imagem pesada acima da dobra | LCP é o heading de texto |
| Waveforms como SVG determinístico gerado em runtime | 8 imagens/sprites de waveform | bytes ~zero por faixa |
| **Prerender SSG no build** (`renderToString` + `hydrateRoot`, sem browser) | LCP refém do JS executar (3.7s no lab) | **LCP 1.4s** — o texto já está no HTML servido |
| **Chunk 3D carrega na primeira intenção** (scroll/toque/tecla), nunca por timer | ~900KB de parse dentro da janela de carregamento (TBT 4.7s no lab) | **TBT 200ms**; quem não interage não paga |
| Canvas único fixo + `View` (drei) portada em cada slot | um contexto WebGL por cena | 1 contexto, scissor por painel |
| Bump map grayscale procedural em vez de normal map | asset de textura / lib de geração | ranhuras geradas em 1 canvas 2D |
| Environment procedural (`frames={1}`, res 64) | HDR externo de ~1–2MB | reflexos sem nenhum fetch |
| `transmission` só monta no painel 5 (antes, material padrão) | render target extra em todas as cenas | o custo do vidro isolado no clímax |
| `dpr` cap 1.5 (mobile) / 2 (desktop) + `frameloop="demand"` fora de vista | overdraw em telas 3× + rAF permanente | GPU ociosa fora das cenas ativas |
| Feixe de luz = cone aditivo + point light (zero pós-processamento) | stack de bloom | glow âmbar a custo ~zero |

**Lighthouse parcial (gate P2, lab throttled 4×):** Performance mobile
**52 → 97** depois do prerender SSG + gate por intenção. LCP 1.4s · TBT
200ms · CLS 0.003.

## Stack

- **Vite + React + TypeScript**
- **React Three Fiber + drei** — o vinil 3D (modelo por primitivas, sem asset externo)
- **GSAP (ScrollTrigger) + Lenis** — coreografia de scroll, sem scroll-jacking
- **Tailwind CSS v4** — tokens da direção de arte em `src/index.css`
- Deploy: **Vercel**

## Direção de arte — "painel de instrumentos"

- Fundo azul-carvão `#0A0C10` · fósforo âmbar CRT `#FFB000` · neutros frios `#8A93A5` / `#3A4150`
- **Space Grotesk** (display) + **Space Mono** (specs/labels — a mesma mono da PRENSA: é o mesmo selo)
- Motivos: traço de circuito impresso, waveforms, marcações de instrumento (`CH 01`, `33⅓ RPM`, `LTD 200`)

## Acessibilidade

`prefers-reduced-motion` é gate central (`src/lib/usePrefersReducedMotion.ts`):
a versão sem motion é uma página **completa e digna** — conteúdo todo legível,
vinil em render estático. O mesmo fallback serve navegadores sem WebGL/GPU
fraca. Toda a narrativa é alcançável por teclado.

## Áudio

**Nenhuma música licenciada ou sample.** Se houver som (fase P4, opcional),
é 100% sintetizado em runtime com Tone.js — desligado por default, bundle
carregado só após o clique em `SOUND ON`.

## Fases

- [x] **P1 — Direção + esqueleto:** tokens, tipografia, página completa estática (8 painéis), fallback reduced-motion
- [x] **P2 — O vinil:** modelo procedural R3F, materiais preta + transparente, canvas único com Views, lazy por intenção, prerender SSG, fallbacks
- [ ] **P3 — Coreografia:** traço de circuito, reveals, exploded view, momento da luz, deep-link
- [ ] **P4 — Áudio (opcional) + polish**
- [ ] **P5 — Captura + launch**

## Desenvolvimento

```bash
npm install
npm run dev      # servidor local
npm run build    # tsc + build de produção
npm run lint     # oxlint
npm run preview  # preview do build
```

## Nota clean-room

Este projeto foi construído do zero, sem código proprietário de nenhum
cliente ou empregador. Nenhum nome, arte ou música real é referenciado.

## O universo PRENSA

Este é um de três projetos conectados do mesmo universo fictício:

1. **PRENSA** — a loja (tema Shopify, carrinho otimista)
2. **CIRCUITO** — esta página (o case de craft/3D/GSAP)
3. **Portfólio** — [joaopedrogaspar.dev](https://joaopedrogaspar.dev)
