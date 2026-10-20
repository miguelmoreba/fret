import { useState } from 'react'
import './App.css'
import { Fretboard } from './Fretboard'
import {
  BASS_STRINGS,
  NOTES,
  getNoteAt,
  randomFret,
  randomItem,
  type Note,
} from './music'

type Mode = 'find' | 'name'

function App() {
  const [mode, setMode] = useState<Mode>('find')
  const [promptNote, setPromptNote] = useState<Note>('D')
  const [target, setTarget] = useState({ stringIndex: 1, fret: 5 })
  const [maxFret, setMaxFret] = useState(12)
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

  function changeFretRange(nextMaxFret: number) {
    setMaxFret(nextMaxFret)
    setCorrectPosition(null)
    setRevealTarget(false)
    setTarget({
      stringIndex: randomFret(BASS_STRINGS.length - 1),
      fret: randomFret(nextMaxFret),
    })
    setFeedback(
      mode === 'find'
        ? `Choose a position that plays ${promptNote}.`
        : 'Choose the note name below.',
    )
  }

  function newPrompt() {
    setCorrectPosition(null)
    setRevealTarget(false)

    if (mode === 'find') {
      const note = randomItem(NOTES)
      setPromptNote(note)
      setFeedback(`Choose a position that plays ${note}.`)
      return
    }

    setTarget({
      stringIndex: randomFret(BASS_STRINGS.length - 1),
      fret: randomFret(maxFret),
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
          <label className="string-name-toggle">
            <input
              type="checkbox"
              checked={showStringNames}
              onChange={(event) => setShowStringNames(event.target.checked)}
            />
            <span>Show string names</span>
          </label>
          <label className="fret-range">
            <span>Fret range</span>
            <select
              value={maxFret}
              onChange={(event) => changeFretRange(Number(event.target.value))}
            >
              <option value="4">0–4</option>
              <option value="7">0–7</option>
              <option value="9">0–9</option>
              <option value="12">0–12</option>
            </select>
          </label>
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
        correctPosition={correctPosition}
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
