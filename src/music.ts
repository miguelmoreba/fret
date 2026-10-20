export const NOTES = [
  'C',
  'C♯',
  'D',
  'D♯',
  'E',
  'F',
  'F♯',
  'G',
  'G♯',
  'A',
  'A♯',
  'B',
] as const

export type Note = (typeof NOTES)[number]

export const BASS_STRINGS = [
  { label: 'G', openNote: 'G', width: 1.5 },
  { label: 'D', openNote: 'D', width: 2 },
  { label: 'A', openNote: 'A', width: 2.5 },
  { label: 'E', openNote: 'E', width: 3 },
] as const satisfies ReadonlyArray<{
  label: string
  openNote: Note
  width: number
}>

export const FRETS = Array.from({ length: 13 }, (_, fret) => fret)

export function getNoteAt(openNote: Note, fret: number): Note {
  const openNoteIndex = NOTES.indexOf(openNote)
  return NOTES[(openNoteIndex + fret) % NOTES.length]
}

export function getAvailableNotes(
  stringIndices: readonly number[],
  minFret: number,
  maxFret: number,
): Note[] {
  const availableNotes = new Set<Note>()

  stringIndices.forEach((stringIndex) => {
    const bassString = BASS_STRINGS[stringIndex]
    for (let fret = minFret; fret <= maxFret; fret += 1) {
      availableNotes.add(getNoteAt(bassString.openNote, fret))
    }
  })

  return NOTES.filter((note) => availableNotes.has(note))
}

export function randomItem<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)]
}

export function randomInteger(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max - min + 1))
}
