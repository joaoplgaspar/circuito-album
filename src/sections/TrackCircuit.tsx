import { TRACKS } from '../content/album'
import { Panel } from '../components/Panel'
import { Waveform } from '../components/Waveform'

/**
 * Painel 3 — O circuito de faixas. Cada faixa é uma estação no traço de
 * circuito, com micro-waveform própria. Na P3 as waveforms "energizam" em
 * âmbar no hover/entrada no viewport; aqui o hover já existe via CSS.
 */
export function TrackCircuit() {
  return (
    <Panel id="faixas" mark="03 · O CIRCUITO DE FAIXAS">
      <h2 className="display-tight mb-12 text-3xl text-white sm:text-4xl">Oito estações</h2>

      <ol className="divide-y divide-graphite/40">
        {TRACKS.map((track) => (
          <li key={track.ch} className="group flex items-center gap-4 py-5 sm:gap-8">
            <span className="label-mono w-14 shrink-0 text-graphite transition-colors group-hover:text-amber">
              {track.ch}
            </span>
            <span className="min-w-0 flex-1 truncate text-lg font-medium text-white sm:text-xl">
              {track.title}
            </span>
            <Waveform
              seed={track.seed}
              className="hidden h-5 w-28 shrink-0 text-graphite transition-colors group-hover:text-amber sm:block sm:w-40"
            />
            <span className="label-mono w-12 shrink-0 text-right text-steel">
              {track.duration}
            </span>
          </li>
        ))}
      </ol>
    </Panel>
  )
}
