import { ALBUM } from '../content/album'
import { Panel } from '../components/Panel'

/**
 * Painel 6 — Edição numerada. O carimbo 047/200 estampa na tela — eco da
 * linguagem de stamp da PRENSA. A animação de impacto entra na P3.
 */
export function NumberedEdition() {
  return (
    <Panel id="edicao" mark="06 · EDIÇÃO NUMERADA" className="text-center">
      <p
        data-fx="stamp"
        aria-label={`Cópia ${ALBUM.editionCopy}`}
        className="display-tight mx-auto inline-block -rotate-3 border-4 border-amber px-8 py-4 text-[clamp(3rem,10vw,7rem)] leading-none text-amber"
      >
        {ALBUM.editionCopy}
      </p>

      <p className="mx-auto mt-12 max-w-xl text-lg leading-relaxed text-steel">
        Cada cópia da prensagem transparente é numerada à mão na contracapa,
        de 001 a 200. Quando a tiragem acaba, acabou — não há repressagem
        prevista.
      </p>
    </Panel>
  )
}
