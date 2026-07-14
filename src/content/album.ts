/**
 * CIRCUITO — conteúdo do álbum.
 *
 * TUDO AQUI É FICTÍCIO: banda, faixas, créditos e nomes foram inventados
 * para esta demonstração de engenharia front-end. Nenhuma referência a
 * artistas, músicas ou pessoas reais.
 */

export const ALBUM = {
  artist: 'KILOWATT',
  title: 'CIRCUITO',
  label: 'PRENSA RECORDS',
  catalog: 'PRS-004',
  year: 2026,
  rpm: '33⅓ RPM',
  weight: '180g',
  edition: 'LTD 200',
  editionCopy: '047/200',
  pressedIn: 'Prensado no Brasil',
} as const

export type Track = {
  ch: string
  title: string
  duration: string
  /** semente determinística pra micro-waveform da faixa */
  seed: number
}

export const TRACKS: Track[] = [
  { ch: 'CH 01', title: 'Ignição', duration: '3:42', seed: 11 },
  { ch: 'CH 02', title: 'Alta Tensão', duration: '4:15', seed: 23 },
  { ch: 'CH 03', title: 'Corrente Contínua', duration: '5:08', seed: 37 },
  { ch: 'CH 04', title: 'Osciloscópio', duration: '3:57', seed: 41 },
  { ch: 'CH 05', title: 'Fantasma na Linha', duration: '4:44', seed: 53 },
  { ch: 'CH 06', title: 'Voltagem de Repouso', duration: '3:21', seed: 67 },
  { ch: 'CH 07', title: 'Curto', duration: '4:02', seed: 79 },
  { ch: 'CH 08', title: 'Apagão', duration: '6:13', seed: 97 },
]

export type Pressing = {
  id: 'preta' | 'transparente'
  name: string
  description: string
  price: string
  /** valor de `?variant=` na PDP da PRENSA */
  variant: string
}

export const PRESSINGS: Pressing[] = [
  {
    id: 'preta',
    name: 'Prensagem preta',
    description: '180g · edição padrão',
    price: 'R$ 180',
    variant: 'preta',
  },
  {
    id: 'transparente',
    name: 'Prensagem transparente',
    description: '180g · edição limitada de 200, numerada à mão',
    price: 'R$ 240',
    variant: 'transparente',
  },
]

/**
 * Deep-link pra PDP do disco na loja PRENSA — o carrinho otimista vive lá;
 * esta página entrega a intenção com a variante certa.
 * TODO: apontar pra URL final da loja quando o deploy da PRENSA estiver no ar.
 */
export const PRENSA_PDP_URL = 'https://prensa-records.vercel.app/discos/kilowatt-circuito'

export const buyUrl = (variant: string) => `${PRENSA_PDP_URL}?variant=${variant}`

export const CREDITS: { role: string; name: string }[] = [
  { role: 'Produção', name: 'KILOWATT & Otto Reis' },
  { role: 'Gravação', name: 'Estúdio Chassi, São Paulo' },
  { role: 'Mixagem', name: 'Lena Barros' },
  { role: 'Masterização', name: 'Vito Câmara, Sala 220V' },
  { role: 'Corte de laca', name: 'Oficina PRENSA' },
  { role: 'Direção de arte', name: 'Estúdio Voltagem' },
  { role: 'Design da capa', name: 'Marina Fusível' },
  { role: 'Fotografia', name: 'Caio Diodo' },
  { role: 'A&R', name: 'PRENSA RECORDS' },
]

export const DISCLAIMER =
  'CIRCUITO é um lançamento fictício da PRENSA RECORDS — demonstração de engenharia front-end por João Pedro Gaspar.'

export const LINKS = {
  portfolio: 'https://joaopedrogaspar.dev', // TODO: URL final do portfólio
  prensa: 'https://prensa-records.vercel.app', // TODO: URL final da loja
} as const
