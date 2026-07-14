import { ALBUM } from '../content/album'
import { Waveform } from '../components/Waveform'
import { VinylDisc } from '../components/VinylDisc'

/**
 * Painel 1 — Cold open. Tela quase preta, waveform âmbar, KILOWATT em mono
 * pequeno, CIRCUITO em display gigante. O LCP da página é este heading de
 * texto — nunca o canvas (que nem existe na P1).
 */
export function ColdOpen() {
  return (
    <section
      id="cold-open"
      aria-label="Abertura"
      className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-6 text-center"
    >
      <div
        data-fx="disc"
        className="pointer-events-none absolute top-1/2 left-1/2 w-[130vmin] -translate-x-1/2 -translate-y-1/2 opacity-20 blur-[2px]"
      >
        <VinylDisc pressing="preta" className="w-full" />
      </div>

      <div className="relative">
        <div data-fx="wave">
          <Waveform seed={7} bars={48} className="mx-auto mb-8 h-6 w-64 text-amber sm:w-80" />
        </div>
        <p data-fx="fade" className="label-mono mb-4 text-steel">
          {ALBUM.artist} · {ALBUM.label} · {ALBUM.catalog}
        </p>
        <h1
          data-fx="title"
          className="display-tight text-[clamp(3.25rem,15vw,14rem)] leading-none text-white"
        >
          {ALBUM.title}
        </h1>
        <p data-fx="fade" className="label-mono mt-6 text-graphite">
          {ALBUM.weight} · {ALBUM.rpm} · {ALBUM.edition}
        </p>
      </div>

      <p data-fx="hint" className="label-mono absolute bottom-8 text-graphite">
        scroll ↓
      </p>
    </section>
  )
}
