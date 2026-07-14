import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import App from './App'

/**
 * Entry do prerender SSG (scripts/prerender.mjs): a landing inteira vira
 * HTML estático no build — o LCP é texto servido, não output de JS. O
 * cliente hidrata por cima (src/main.tsx). Nada de browser no build.
 */
export function render(): string {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
