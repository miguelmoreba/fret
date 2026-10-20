import { useState } from 'react'
import './App.css'
import { Fretboard } from './Fretboard'
import {
  BASS_STRINGS,
  FRETS,
  NOTES,
  getAvailableNotes,
  getNoteAt,
  randomInteger,
  randomItem,
  type Note,
} from './music'

type Mode = 'find' | 'name'

function App() {
  const [mode, setMode] = useState<Mode>('find')
  const [promptNote, setPromptNote] = useState<Note>('D')
  const [target, setTarget] = useState({ stringIndex: 1, fret: 5 })
  const [minFret, setMinFret] = useState(0)
  const [maxFret, setMaxFret] = useState(12)
  const [activeStrings, setActiveStrings] = useState<number[]>(
    BASS_STRINGS.map((_, index) => index),
  )
  const [showStringNames, setShowStringNames] = useState(true)
  const [feedback, setFeedback] = useState('Choose a position that plays D.')
  const [correctPosition, setCorrectPosition] = useState<string | null>(null)
  const [revealTarget, setRevealTarget] = useState(false)

  const targetString = BASS_STRINGS[target.stringIndex]
  const targetNote = getNoteAt(targetString.openNote, target.fret)

  function changeMode(nextMode: Mode) {
    setMode(nextMode)
    setCorrectPosition(null)
    setRevealTarget(false)
    setFeedback(
      nextMode === 'find'
        ? `Choose a position that plays ${promptNote}.`
        : 'Choose the note name below.',
    )
  }

  function choosePosition(stringIndex: number, fret: number) {
    if (mode !== 'find') return

    const bassString = BASS_STRINGS[stringIndex]
    const note = getNoteAt(bassString.openNote, fret)
    const positionId = `${stringIndex}-${fret}`

    if (note === promptNote) {
      setCorrectPosition(positionId)
      setFeedback(
        `Correct — ${bassString.label} string, fret ${fret} is ${note}.`,
      )
      return
    }

    setCorrectPosition(null)
    setFeedback(`${note} lives there. Try another position for ${promptNote}.`)
  }

  function chooseNote(note: Note) {
    const isCorrect = note === targetNote
    setRevealTarget(isCorrect)
    setFeedback(
      isCorrect
        ? `Correct — ${targetString.label} string, fret ${target.fret} is ${targetNote}.`
        : `That position is not ${note}. Try again.`,
    )
  }

  function resetForSettings(
    nextStrings: number[],
    nextMinFret: number,
    nextMaxFret: number,
  ) {
    const nextNote = randomItem(
      getAvailableNotes(nextStrings, nextMinFret, nextMaxFret),
    )

    setPromptNote(nextNote)
    setMaxFret(nextMaxFret)
    setMinFret(nextMinFret)
    setActiveStrings(nextStrings)
    setCorrectPosition(null)
    setRevealTarget(false)
    setTarget({
      stringIndex: randomItem(nextStrings),
      fret: randomInteger(nextMinFret, nextMaxFret),
    })
    setFeedback(
      mode === 'find'
        ? `Choose a position that plays ${nextNote}.`
        : 'Choose the note name below.',
    )
  }

  function toggleString(stringIndex: number) {
    const isActive = activeStrings.includes(stringIndex)
    if (isActive && activeStrings.length === 1) return

    const nextStrings = isActive
      ? activeStrings.filter((index) => index !== stringIndex)
      : [...activeStrings, stringIndex].sort((a, b) => a - b)

    resetForSettings(nextStrings, minFret, maxFret)
  }

  function changeMinFret(nextMinFret: number) {
    resetForSettings(
      activeStrings,
      nextMinFret,
      Math.max(nextMinFret, maxFret),
    )
  }

  function changeMaxFret(nextMaxFret: number) {
    resetForSettings(
      activeStrings,
      Math.min(minFret, nextMaxFret),
      nextMaxFret,
    )
  }

  function newPrompt() {
    setCorrectPosition(null)
    setRevealTarget(false)

    if (mode === 'find') {
      const note = randomItem(
        getAvailableNotes(activeStrings, minFret, maxFret),
      )
      setPromptNote(note)
      setFeedback(`Choose a position that plays ${note}.`)
      return
    }

    setTarget({
      stringIndex: randomItem(activeStrings),
      fret: randomInteger(minFret, maxFret),
    })
    setFeedback('Choose the note name below.')
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <span className="eyebrow">Bass practice</span>
          <h1>Fretboard trainer</h1>
        </div>
        <div className="header-controls">
          <fieldset className="string-filter">
            <legend>Practice strings</legend>
            <div className="string-options">
              {BASS_STRINGS.map((bassString, stringIndex) => {
                const checked = activeStrings.includes(stringIndex)
                return (
                  <label key={bassString.label}>
                    <input
                      type="checkbox"
                      checked={checked}
                      disabled={checked && activeStrings.length === 1}
                      onChange={() => toggleString(stringIndex)}
                    />
                    <span>{bassString.label}</span>
                  </label>
                )
              })}
            </div>
          </fieldset>
          <label className="string-name-toggle">
            <input
              type="checkbox"
              checked={showStringNames}
              onChange={(event) => setShowStringNames(event.target.checked)}
            />
            <span>Show string names</span>
          </label>
          <div className="fret-range">
            <span>Fret interval</span>
            <div className="fret-range-inputs">
              <label>
                <span className="sr-only">First fret</span>
                <select
                  aria-label="First fret"
                  value={minFret}
                  onChange={(event) =>
                    changeMinFret(Number(event.target.value))
                  }
                >
                  {FRETS.map((fret) => (
                    <option value={fret} key={fret}>
                      {fret}
                    </option>
                  ))}
                </select>
              </label>
              <span aria-hidden="true">to</span>
              <label>
                <span className="sr-only">Last fret</span>
                <select
                  aria-label="Last fret"
                  value={maxFret}
                  onChange={(event) =>
                    changeMaxFret(Number(event.target.value))
                  }
                >
                  {FRETS.map((fret) => (
                    <option value={fret} key={fret}>
                      {fret}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
          <nav className="mode-switch" aria-label="Practice mode">
            <button
              type="button"
              className={mode === 'find' ? 'active' : ''}
              aria-pressed={mode === 'find'}
              onClick={() => changeMode('find')}
            >
              Find the note
            </button>
            <button
              type="button"
              className={mode === 'name' ? 'active' : ''}
              aria-pressed={mode === 'name'}
              onClick={() => changeMode('name')}
            >
              Name the note
            </button>
          </nav>
        </div>
      </header>

      <section className="prompt" aria-live="polite">
        <div>
          <span className="eyebrow">
            {mode === 'find' ? 'Find the note' : 'Name the note'}
          </span>
          <h2>
            {mode === 'find'
              ? `Tap a ${promptNote} on the fretboard`
              : `What note is on the ${targetString.label} string, fret ${target.fret}?`}
          </h2>
        </div>
        <strong className="prompt-note">
          {mode === 'find' ? promptNote : '?'}
        </strong>
      </section>

      <Fretboard
        activePosition={mode === 'name' ? target : null}
        activeStrings={activeStrings}
        correctPosition={correctPosition}
        minFret={minFret}
        maxFret={maxFret}
        revealTarget={revealTarget}
        showStringNames={showStringNames}
        onChoose={choosePosition}
      />

      {mode === 'name' && (
        <div className="note-choices" aria-label="Note choices">
          {NOTES.map((note) => (
            <button type="button" key={note} onClick={() => chooseNote(note)}>
              {note}
            </button>
          ))}
        </div>
      )}

      <p className="feedback" aria-live="polite">
        {feedback}
      </p>

      <button className="new-prompt" type="button" onClick={newPrompt}>
        New prompt
      </button>
    </main>
  )
}

export default App
