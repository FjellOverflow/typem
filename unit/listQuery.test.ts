import { describe, it, expect } from 'vitest'
import {
  defaultListQuery,
  ListQuerySchema,
  queryLists,
  type IListQuery,
  type ListQueryContext,
} from '@/composables/listQuery'
import { ListSchema, type IList, type ListProgress } from '@/types'
import type { ILocalizedString } from '@/types/localization'

function list(
  id: string,
  meta: {
    name: ILocalizedString
    description?: ILocalizedString
    difficulty?: number
    tags?: string[]
    supportedLocales?: string[]
  },
  numberOfItems = 1,
): IList {
  return ListSchema.parse({
    id,
    meta: {
      description: '',
      difficulty: 1,
      author: 'test',
      lastUpdated: '2026-01-01',
      source: 'test',
      tags: [],
      supportedLocales: ['en'],
      ...meta,
    },
    items: Array.from({ length: numberOfItems }, (_, index) => ({
      answer: `answer ${index}`,
      matches: [],
    })),
  })
}

const moons = list(
  'moons',
  {
    name: { en: 'Moons', de: 'Monde' },
    description: { en: 'Name the moons of Jupiter', de: 'Nenne die Monde des Jupiter' },
    difficulty: 3,
    tags: ['universe'],
    supportedLocales: ['en', 'de'],
  },
  4,
)
const rivers = list(
  'rivers',
  {
    name: { en: 'Rivers', de: 'Flüsse' },
    difficulty: 2,
    tags: ['europe'],
    supportedLocales: ['en'],
  },
  9,
)
const capitals = list(
  'capitals',
  {
    name: { en: 'Capitals', de: 'Hauptstädte' },
    difficulty: 1,
    tags: ['europe', 'capitals'],
    supportedLocales: ['en', 'de'],
  },
  2,
)

const progressByListId: Record<string, ListProgress> = {
  moons: 'finished',
  rivers: 'tried',
}

const germanContext: ListQueryContext = {
  localize: (text) => (typeof text === 'string' ? text : (text.de ?? text.en ?? '')),
  translateTag: (tag) =>
    ({ universe: 'Universum', europe: 'Europa', capitals: 'Hauptstädte' })[tag] ?? tag,
  progressOf: (listId) => progressByListId[listId] ?? 'untried',
}

function query(overrides: Partial<IListQuery> = {}): IListQuery {
  return { ...defaultListQuery, ...overrides }
}

function idsOf(lists: IList[]) {
  return lists.map((l) => l.id)
}

function queriedIds(overrides: Partial<IListQuery> = {}) {
  return idsOf(queryLists([moons, rivers, capitals], query(overrides), germanContext))
}

describe('list query', () => {
  it('shows every list by its localized name for the default query', () => {
    expect(queriedIds()).toEqual(['rivers', 'capitals', 'moons'])
  })

  it('finds a keyword in the localized name, ignoring case and spaces', () => {
    expect(queriedIds({ keyword: 'haupt städte' })).toEqual(['capitals'])
  })

  it('finds a keyword in the localized description', () => {
    expect(queriedIds({ keyword: 'jupiter' })).toEqual(['moons'])
  })

  it('finds a keyword in the translated tag and not in the tag key', () => {
    expect(queriedIds({ keyword: 'Universum' })).toEqual(['moons'])
    expect(queriedIds({ keyword: 'universe' })).toEqual([])
  })

  it('keeps only the lists with the selected tag', () => {
    expect(queriedIds({ tag: 'europe' })).toEqual(['rivers', 'capitals'])
  })

  it('keeps only the lists that support the selected language', () => {
    expect(queriedIds({ language: 'de' })).toEqual(['capitals', 'moons'])
  })

  it('keeps only the lists with the selected progress', () => {
    expect(queriedIds({ progress: 'tried' })).toEqual(['rivers'])
    expect(queriedIds({ progress: 'untried' })).toEqual(['capitals'])
  })

  it('sorts by difficulty with the easiest first', () => {
    expect(queriedIds({ sortBy: 'difficulty' })).toEqual(['capitals', 'rivers', 'moons'])
  })

  it('sorts by length with the fewest items first', () => {
    expect(queriedIds({ sortBy: 'length' })).toEqual(['capitals', 'moons', 'rivers'])
  })

  it('reverses the order for the descending direction', () => {
    expect(queriedIds({ sortBy: 'length', sortDir: 'desc' })).toEqual([
      'rivers',
      'moons',
      'capitals',
    ])
  })

  it('does not reorder the given lists', () => {
    const lists = [moons, rivers, capitals]

    queryLists(lists, query({ sortBy: 'length' }), germanContext)

    expect(idsOf(lists)).toEqual(['moons', 'rivers', 'capitals'])
  })

  it('parses the URL values of a query', () => {
    const urlValues = {
      keyword: 'moon',
      tag: 'universe',
      language: 'de',
      progress: 'finished',
      sortBy: 'difficulty',
      sortDir: 'desc',
    }

    expect(ListQuerySchema.parse(urlValues)).toEqual(urlValues)
  })

  it('uses the default for a missing or unknown URL value', () => {
    expect(ListQuerySchema.parse({})).toEqual(defaultListQuery)
    expect(
      ListQuerySchema.parse({
        keyword: ['moon', 'sun'],
        tag: '',
        language: 'fr',
        progress: 'done',
        sortBy: 'colour',
        sortDir: 'up',
      }),
    ).toEqual(defaultListQuery)
  })
})
