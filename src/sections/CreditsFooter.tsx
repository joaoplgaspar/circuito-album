import { ALBUM, CREDITS, DISCLAIMER, LINKS } from '../content/album'

/**
 * Painel 8 — Créditos. Ficha técnica fictícia em mono, disclaimer
 * obrigatório e links do universo (portfólio · loja PRENSA).
 */
export function CreditsFooter() {
  return (
    <footer id="creditos" aria-label="Créditos" className="border-t border-graphite/40 px-6 py-24 sm:px-10">
      <div className="mx-auto max-w-2xl">
        <p className="label-mono mb-10 text-amber">08 · CRÉDITOS</p>

        <dl className="space-y-3 font-mono text-sm">
          {CREDITS.map((credit) => (
            <div key={credit.role} className="flex justify-between gap-4 border-b border-graphite/30 pb-3">
              <dt className="label-mono text-graphite">{credit.role}</dt>
              <dd className="text-right text-steel">{credit.name}</dd>
            </div>
          ))}
          <div className="flex justify-between gap-4 pb-3">
            <dt className="label-mono text-graphite">Catálogo</dt>
            <dd className="text-right text-steel">
              {ALBUM.catalog} · {ALBUM.label} · {ALBUM.year}
            </dd>
          </div>
        </dl>

        <p className="mt-16 text-sm leading-relaxed text-graphite">{DISCLAIMER}</p>

        <nav aria-label="Links" className="mt-6 flex gap-6">
          <a href={LINKS.portfolio} className="label-mono text-steel underline-offset-4 hover:text-amber hover:underline">
            portfólio
          </a>
          <a href={LINKS.prensa} className="label-mono text-steel underline-offset-4 hover:text-amber hover:underline">
            loja PRENSA
          </a>
        </nav>
      </div>
    </footer>
  )
}
