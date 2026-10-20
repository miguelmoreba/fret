import type { CSSProperties } from 'react'
import { BASS_STRINGS, FRETS, getNoteAt } from './music'

type Position = {
  stringIndex: number
  fret: number
}

type FretboardProps = {
  activePosition: Position | null
  activeStrings: number[]
  correctPosition: string | null
  minFret: number
  maxFret: number
  revealTarget: boolean
  showStringNames: boolean
  onChoose: (stringIndex: number, fret: number) => void
}

export function Fretboard({
  activePosition,
  activeStrings,
  correctPosition,
  minFret,
  maxFret,
  revealTarget,
  showStringNames,
  onChoose,
}: FretboardProps) {
  const visibleFrets = FRETS.filter(
    (fret) => fret >= minFret && fret <= maxFret,
  )
  const furthestString = BASS_STRINGS[activeStrings[0]]
  const nearestString = BASS_STRINGS[activeStrings.at(-1) ?? activeStrings[0]]
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
          {activeStrings.map((stringIndex) => {
            const bassString = BASS_STRINGS[stringIndex]
            return (
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
            )
          })}
        </div>
      </div>
      <div className="orientation">
        <span>
          {activeStrings.length === 1
            ? showStringNames
              ? `${furthestString.label} string selected`
              : 'One string selected'
            : showStringNames
              ? `${furthestString.label} is furthest away · ${nearestString.label} is nearest you`
              : 'Highest selected string is furthest away · lowest selected string is nearest you'}
        </span>
        <span>nut ← · body →</span>
      </div>
    </section>
  )
}
