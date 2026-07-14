import { ALBUM } from '../content/album'

type VinylDiscProps = {
  pressing?: 'preta' | 'transparente'
  className?: string
}

/**
 * Representação 2D do vinil em SVG — o placeholder de P1 e o fallback
 * permanente de reduced-motion/sem-WebGL. Na P2 o render 3D (R3F) assume
 * nas cenas ativas; este SVG continua sendo o que a versão estática mostra.
 */
export function VinylDisc({ pressing = 'transparente', className }: VinylDiscProps) {
  const transparent = pressing === 'transparente'
  const grooves = Array.from({ length: 14 }, (_, i) => 46 - i * 2.4)

  return (
    <svg
      viewBox="0 0 100 100"
      role="img"
      aria-label={`Vinil ${ALBUM.title}, prensagem ${pressing}`}
      className={className}
    >
      <defs>
        <radialGradient id={`vinyl-body-${pressing}`} cx="35%" cy="30%" r="80%">
          {transparent ? (
            <>
              <stop offset="0%" stopColor="#ffb000" stopOpacity="0.28" />
              <stop offset="45%" stopColor="#3a4150" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#0a0c10" stopOpacity="0.9" />
            </>
          ) : (
            <>
              <stop offset="0%" stopColor="#3a4150" />
              <stop offset="60%" stopColor="#14171d" />
              <stop offset="100%" stopColor="#0a0c10" />
            </>
          )}
        </radialGradient>
      </defs>

      <circle cx="50" cy="50" r="48" fill={`url(#vinyl-body-${pressing})`} />
      <circle
        cx="50"
        cy="50"
        r="48"
        fill="none"
        stroke={transparent ? '#ffb000' : '#3a4150'}
        strokeOpacity={transparent ? 0.5 : 0.6}
        strokeWidth="0.4"
      />

      {/* ranhuras */}
      {grooves.map((r) => (
        <circle
          key={r}
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke={transparent ? '#ffb000' : '#8a93a5'}
          strokeOpacity={transparent ? 0.18 : 0.12}
          strokeWidth="0.25"
        />
      ))}

      {/* selo central */}
      <circle cx="50" cy="50" r="16" fill="#0a0c10" stroke="#ffb000" strokeWidth="0.4" />
      <text
        x="50"
        y="47.5"
        textAnchor="middle"
        fill="#ffb000"
        style={{ font: '700 4.4px "Space Grotesk", sans-serif', letterSpacing: '0.08em' }}
      >
        {ALBUM.title}
      </text>
      <text
        x="50"
        y="54"
        textAnchor="middle"
        fill="#8a93a5"
        style={{ font: '400 2.6px "Space Mono", monospace', letterSpacing: '0.15em' }}
      >
        {ALBUM.artist} · {ALBUM.rpm}
      </text>

      {/* furo */}
      <circle cx="50" cy="50" r="1.4" fill="#0a0c10" stroke="#3a4150" strokeWidth="0.3" />
    </svg>
  )
}
