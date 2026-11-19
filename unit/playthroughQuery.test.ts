import { describe, it, expect } from 'vitest'
import {
  defaultPlaythroughQuery,
  PlaythroughQuerySchema,
  queryPlaythroughs,
  type IPlaythroughQuery,
} from '@/composables/playthroughQuery'
import type { IListPlaythrough } from '@/types'

function playthrough(overrides: Partial<IListPlaythrough> = {}): IListPlaythrough {
  return {
    listId: 'list0',
    seconds: 60,
    numberOfMatches: 8,
    finished: true,
    timestamp: '2026-01-01T00:00:00.000Z',
    ...overrides,
  }
}

const lists = [{ id: 'list0' }, { id: 'list1' }]

function query(overrides: Partial<IPlaythroughQuery> = {}): IPlaythroughQuery {
  return { ...defaultPlaythroughQuery, ...overrides }
}

const oldest = playthrough({
  seconds: 30,
  numberOfMatches: 3,
  timestamp: '2026-01-01T00:00:00.000Z',
})
const middle = playthrough({
  seconds: 20,
  numberOfMatches: 1,
  timestamp: '2026-01-02T00:00:00.000Z',
})
const newest = playthrough({
  seconds: 40,
  numberOfMatches: 8,
  timestamp: '2026-01-03T00:00:00.000Z',
})

describe('playthrough query', () => {
  it('sorts by date with the newest first', () => {
    expect(queryPlaythroughs([oldest, newest, middle], lists, query())).toEqual([
      newest,
      middle,
      oldest,
    ])
  })

  it('sorts by speed with the fewest seconds per item first', () => {
    expect(queryPlaythroughs([oldest, newest, middle], lists, query({ sortBy: 'speed' }))).toEqual([
      newest,
      oldest,
      middle,
    ])
  })

  it('sorts by duration with the shortest first', () => {
    expect(
      queryPlaythroughs([oldest, newest, middle], lists, query({ sortBy: 'duration' })),
    ).toEqual([middle, oldest, newest])
  })

  it('reverses the order for the descending direction', () => {
    expect(
      queryPlaythroughs(
        [oldest, newest, middle],
        lists,
        query({ sortBy: 'duration', sortDir: 'desc' }),
      ),
    ).toEqual([newest, oldest, middle])
  })

  it('parses the URL values of a query', () => {
    expect(
      PlaythroughQuerySchema.parse({ listId: 'list1', sortBy: 'speed', sortDir: 'desc' }),
    ).toEqual({ listId: 'list1', sortBy: 'speed', sortDir: 'desc' })
  })

  it('uses the default for a missing or unknown URL value', () => {
    expect(PlaythroughQuerySchema.parse({})).toEqual(defaultPlaythroughQuery)
    expect(
      PlaythroughQuerySchema.parse({ listId: ['list0', 'list1'], sortBy: 'colour', sortDir: 'up' }),
    ).toEqual(defaultPlaythroughQuery)
  })

  it('keeps only the playthroughs of the selected list', () => {
    const otherList = playthrough({ listId: 'list1' })

    expect(queryPlaythroughs([oldest, otherList], lists, query({ listId: 'list1' }))).toEqual([
      otherList,
    ])
  })

  it('drops the playthroughs of lists that no longer exist', () => {
    const removedList = playthrough({ listId: 'removed' })

    expect(queryPlaythroughs([oldest, removedList], lists, query())).toEqual([oldest])
  })

  it('does not reorder the given playthroughs', () => {
    const playthroughs = [oldest, newest, middle]

    queryPlaythroughs(playthroughs, lists, query())

    expect(playthroughs).toEqual([oldest, newest, middle])
  })
})
