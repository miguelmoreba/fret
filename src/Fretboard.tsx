import type { CSSProperties } from 'react'
import { BASS_STRINGS, FRETS, getNoteAt } from './music'

type Position = {
  stringIndex: number
  fret: number
}

type FretboardProps = {
  activePosition: Position | null
  correctPosition: string | null
  maxFret: number
  revealTarget: boolean
  showStringNames: boolean
  onChoose: (stringIndex: number, fret: number) => void
}

export function Fretboard({
  activePosition,
  correctPosition,
  maxFret,
  revealTarget,
  showStringNames,
  onChoose,
}: FretboardProps) {
  const visibleFrets = FRETS.filter((fret) => fret <= maxFret)
  const minimumWidth = `${44 + visibleFrets.length * 48}px`
  const fretboardColumns: CSSProperties = {
    gridTemplateColumns: `44px repeat(${visibleFrets.length}, minmax(48px, 1fr))`,
    minWidth: minimumWidth,
  }

  return (
    <section className="fretboard-section" aria-label="Bass fretboard">
      <div className="fretboard-scroll">
        <div
          className="fret-numbers"
          style={fretboardColumns}
          aria-hidden="true"
        >
          <span />
          {visibleFrets.map((fret) => (
            <span key={fret}>{fret === 0 ? 'open' : fret}</span>
          ))}
        </div>

        <div className="fretboard" style={{ minWidth: minimumWidth }}>
          {BASS_STRINGS.map((bassString, stringIndex) => (
            <div
              className="string-row"
              style={fretboardColumns}
              key={bassString.label}
            >
              <strong
                className={`string-name${showStringNames ? '' : ' hidden'}`}
                aria-hidden={!showStringNames}
              >
                {showStringNames ? bassString.label : ''}
              </strong>
              {visibleFrets.map((fret) => {
                const note = getNoteAt(bassString.openNote, fret)
                const positionId = `${stringIndex}-${fret}`
                const isActive =
                  activePosition?.stringIndex === stringIndex &&
                  activePosition.fret === fret

                return (
                  <button
                    type="button"
                    className={[
                      'fret',
                      isActive ? 'target' : '',
                      isActive && !revealTarget ? 'pending' : '',
                      isActive && revealTarget ? 'revealed' : '',
                      correctPosition === positionId ? 'correct' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    style={
                      { '--string-size': `${bassString.width}px` } as CSSProperties
                    }
                    aria-label={`${bassString.label} string, fret ${fret}, ${note}`}
                    key={fret}
                    onClick={() => onChoose(stringIndex, fret)}
                  >
                    <span className="fret-marker">
                      {isActive
                        ? revealTarget
                          ? note
                          : '?'
                        : correctPosition === positionId
                          ? note
                          : ''}
                    </span>
                  </button>
                )
              })}
            </div>
          ))}
        </div>
      </div>
      <div className="orientation">
        <span>
          {showStringNames
            ? 'G is furthest away · low E is nearest you'
            : 'Highest string is furthest away · lowest string is nearest you'}
        </span>
        <span>nut ← · body →</span>
      </div>
    </section>
  )
}
