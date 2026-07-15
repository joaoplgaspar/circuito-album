/**
 * Pós-build em dois passos sobre o dist/index.html:
 * 1. Prerender SSG: injeta o HTML renderizado do App dentro do #root.
 * 2. Prefetch dos chunks lazy (three/motion): os BYTES chegam ao cache do
 *    navegador em prioridade mínima, sem parse — quando a primeira
 *    interação armar os chunks, o import() resolve do cache e o crossfade
 *    SVG→3D acontece sem espera de rede. (Parse continua fora da janela
 *    de carregamento: TBT/LCP não veem nada disso.)
 */
import { readdir, readFile, writeFile, rm } from 'node:fs/promises'

const { render } = await import(new URL('../dist-server/entry-server.js', import.meta.url))

const indexPath = new URL('../dist/index.html', import.meta.url)
let html = await readFile(indexPath, 'utf8')

const marker = '<div id="root"></div>'
if (!html.includes(marker)) {
  throw new Error('prerender: <div id="root"></div> não encontrado no dist/index.html')
}
html = html.replace(marker, `<div id="root">${render()}</div>`)

const assets = await readdir(new URL('../dist/assets', import.meta.url))
const lazyChunks = assets.filter(
  (f) => /^(three|motion|ThreeLayer|init)-.*\.js$/.test(f),
)
const prefetch = lazyChunks
  .map((f) => `    <link rel="prefetch" as="script" crossorigin href="/assets/${f}" />`)
  .join('\n')
html = html.replace('</head>', `${prefetch}\n  </head>`)

await writeFile(indexPath, html)
await rm(new URL('../dist-server', import.meta.url), { recursive: true, force: true })

console.log(
  `prerender: página estática injetada · prefetch de ${lazyChunks.length} chunks lazy (${lazyChunks.join(', ')})`,
)
