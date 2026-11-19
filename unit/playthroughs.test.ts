import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ListPlaythroughSchema, type IListPlaythrough } from '@/types'

let clock = Date.parse('2026-01-01T00:00:00.000Z')

function playthrough(overrides: Partial<IListPlaythrough> = {}): IListPlaythrough {
  clock += 1000

  return {
    listId: 'list0',
    seconds: 60,
    numberOfMatches: 8,
    finished: true,
    timestamp: new Date(clock).toISOString(),
    ...overrides,
  }
}

async function loadStore() {
  const { usePlaythroughs } = await import('@/composables/playthroughs')

  return usePlaythroughs()
}

function storedHistory() {
  return JSON.parse(localStorage.getItem('history') ?? '[]')
}

describe('playthrough store', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.resetModules()
  })

  it('adds playthroughs and persists them', async () => {
    const { playthroughs, addPlaythrough } = await loadStore()
    const added = playthrough()

    expect(playthroughs.value).toEqual([])

    addPlaythrough(added)
    await nextTick()

    expect(playthroughs.value).toEqual([added])
    expect(storedHistory()).toEqual([added])
  })

  it('shares one state between callers', async () => {
    const { usePlaythroughs } = await import('@/composables/playthroughs')

    usePlaythroughs().addPlaythrough(playthrough())

    expect(usePlaythroughs().playthroughs.value).toHaveLength(1)
  })

  it('ranks the record by matches, then seconds, then timestamp', async () => {
    const { recordOf, addPlaythrough } = await loadStore()

    expect(recordOf('list0')).toBeUndefined()

    const fewMatches = playthrough({ numberOfMatches: 3, seconds: 10, finished: false })
    addPlaythrough(fewMatches)
    expect(recordOf('list0')).toEqual(fewMatches)

    const moreMatches = playthrough({ numberOfMatches: 8, seconds: 90 })
    addPlaythrough(moreMatches)
    expect(recordOf('list0')).toEqual(moreMatches)

    const faster = playthrough({ seconds: 60 })
    addPlaythrough(faster)
    expect(recordOf('list0')).toEqual(faster)

    addPlaythrough(playthrough({ seconds: 60 }))
    expect(recordOf('list0')).toEqual(faster)

    addPlaythrough(playthrough({ listId: 'list1', seconds: 1 }))
    expect(recordOf('list0')).toEqual(faster)
  })

  it('marks only the record, not other playthroughs with the same seconds', async () => {
    const { isRecord, addPlaythrough } = await loadStore()
    const record = playthrough({ seconds: 60 })
    const sameSecondsUnfinished = playthrough({
      seconds: 60,
      numberOfMatches: 3,
      finished: false,
    })
    const tiedButLater = playthrough({ seconds: 60 })

    addPlaythrough(record)
    addPlaythrough(sameSecondsUnfinished)
    addPlaythrough(tiedButLater)

    expect(isRecord(record)).toBe(true)
    expect(isRecord(sameSecondsUnfinished)).toBe(false)
    expect(isRecord(tiedButLater)).toBe(false)
  })

  it('moves the record when the record is deleted', async () => {
    const { isRecord, addPlaythrough, deletePlaythrough } = await loadStore()
    const fast = playthrough({ seconds: 60 })
    const slow = playthrough({ seconds: 70 })

    addPlaythrough(fast)
    addPlaythrough(slow)
    expect(isRecord(slow)).toBe(false)

    deletePlaythrough(fast)

    expect(isRecord(slow)).toBe(true)
  })

  it('reports progress per list', async () => {
    const { progressOf, addPlaythrough } = await loadStore()

    expect(progressOf('list0')).toBe('untried')

    addPlaythrough(playthrough({ numberOfMatches: 3, finished: false }))
    expect(progressOf('list0')).toBe('tried')

    addPlaythrough(playthrough())
    expect(progressOf('list0')).toBe('finished')
    expect(progressOf('list1')).toBe('untried')
  })

  it('reports a new record only when a finished playthrough beats a finished record on time', async () => {
    const { addPlaythrough } = await loadStore()

    expect(
      addPlaythrough(playthrough({ numberOfMatches: 3, finished: false })).beatenRecord,
    ).toBeUndefined()

    const firstFinish = playthrough({ seconds: 60 })
    expect(addPlaythrough(firstFinish).beatenRecord).toBeUndefined()

    expect(addPlaythrough(playthrough({ seconds: 70 })).beatenRecord).toBeUndefined()

    expect(addPlaythrough(playthrough({ seconds: 50 })).beatenRecord).toEqual(firstFinish)
  })

  it('collects one record per list', async () => {
    const { records, addPlaythrough } = await loadStore()
    const list0Record = playthrough({ seconds: 50 })
    const list1Record = playthrough({ listId: 'list1' })

    addPlaythrough(playthrough({ seconds: 60 }))
    addPlaythrough(list0Record)
    addPlaythrough(list1Record)

    expect(records.value).toEqual([list0Record, list1Record])
  })

  it('deletes a playthrough by list id and timestamp', async () => {
    const { playthroughs, addPlaythrough, deletePlaythrough } = await loadStore()
    const kept = playthrough()
    const deleted = playthrough()

    addPlaythrough(kept)
    addPlaythrough(deleted)

    expect(deletePlaythrough({ ...deleted })).toBe(true)
    expect(playthroughs.value).toEqual([kept])
    expect(deletePlaythrough(deleted)).toBe(false)
  })

  it('deletes the history', async () => {
    const { playthroughs, addPlaythrough, deleteHistory } = await loadStore()

    addPlaythrough(playthrough())
    addPlaythrough(playthrough())
    deleteHistory()

    expect(playthroughs.value).toEqual([])
  })

  it('drops invalid stored entries and writes the valid ones back', async () => {
    const valid = playthrough()
    localStorage.setItem('history', JSON.stringify([{ listId: 'list0', seconds: 'slow' }, valid]))

    const { playthroughs, exportHistory } = await loadStore()
    await nextTick()

    expect(playthroughs.value).toEqual([valid])
    expect(exportHistory()).toEqual([valid])
    expect(storedHistory()).toEqual([valid])
  })

  it('drops a stored history that is not a list', async () => {
    localStorage.setItem('history', JSON.stringify({ a: 'b' }))

    const { playthroughs } = await loadStore()
    await nextTick()

    expect(playthroughs.value).toEqual([])
    expect(storedHistory()).toEqual([])
  })

  it('does not write a valid stored history back', async () => {
    localStorage.setItem('history', JSON.stringify([ListPlaythroughSchema.parse(playthrough())]))
    const setItem = vi.spyOn(Storage.prototype, 'setItem')

    await loadStore()
    await nextTick()

    expect(setItem).not.toHaveBeenCalled()
    setItem.mockRestore()
  })

  it('imports only the valid playthroughs of a history', async () => {
    const { playthroughs, importHistory, exportHistory } = await loadStore()

    for (const rejected of [
      undefined,
      null,
      'null',
      {},
      { a: 'b' },
      playthrough(),
      [],
      [undefined],
      [null],
      ['null'],
      [{}],
      [{ a: 'b' }],
    ])
      expect(importHistory(rejected)).toBe(false)

    expect(exportHistory()).toEqual([])

    const valid = playthrough()

    expect(importHistory([valid, { a: 'b' }])).toBe(true)
    expect(playthroughs.value).toEqual([valid])
    expect(exportHistory()).toEqual([valid])
  })

  it('merges an imported history and keeps the local entry of a duplicate', async () => {
    const { playthroughs, addPlaythrough, importHistory } = await loadStore()
    const local = playthrough()
    const imported = playthrough()

    addPlaythrough(local)

    expect(importHistory([{ ...local, seconds: 1 }, imported, imported])).toBe(true)
    expect(playthroughs.value).toEqual([local, imported])
  })

  it('accepts an import that holds only known playthroughs', async () => {
    const { playthroughs, addPlaythrough, importHistory } = await loadStore()
    const local = playthrough()

    addPlaythrough(local)

    expect(importHistory([local])).toBe(true)
    expect(playthroughs.value).toEqual([local])
  })
})
