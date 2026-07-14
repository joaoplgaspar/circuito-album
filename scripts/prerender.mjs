/**
 * Prerender SSG: injeta o HTML renderizado do App dentro do #root do
 * dist/index.html. Roda depois dos dois `vite build` (client + ssr).
 */
import { readFile, writeFile, rm } from 'node:fs/promises'

const { render } = await import(new URL('../dist-server/entry-server.js', import.meta.url))

const indexPath = new URL('../dist/index.html', import.meta.url)
const html = await readFile(indexPath, 'utf8')

const marker = '<div id="root"></div>'
if (!html.includes(marker)) {
  throw new Error('prerender: <div id="root"></div> não encontrado no dist/index.html')
}

await writeFile(indexPath, html.replace(marker, `<div id="root">${render()}</div>`))
await rm(new URL('../dist-server', import.meta.url), { recursive: true, force: true })

console.log('prerender: dist/index.html agora contém a página estática completa')
