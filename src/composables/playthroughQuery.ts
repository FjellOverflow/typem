import type { IList, IListPlaythrough } from '@/types'

export type PlaythroughSortKey = 'date' | 'speed' | 'duration'
export type SortDirection = 'asc' | 'desc'

export interface PlaythroughQuery {
  listId: string
  sortBy: PlaythroughSortKey
  sortDir: SortDirection
}

export const defaultPlaythroughQuery: PlaythroughQuery = {
  listId: '',
  sortBy: 'date',
  sortDir: 'asc',
}

export function isDefaultPlaythroughQuery(query: PlaythroughQuery) {
  return (
    query.listId === defaultPlaythroughQuery.listId &&
    query.sortBy === defaultPlaythroughQuery.sortBy &&
    query.sortDir === defaultPlaythroughQuery.sortDir
  )
}

type PlaythroughComparator = (p1: IListPlaythrough, p2: IListPlaythrough) => number

const newestFirst: PlaythroughComparator = (p1, p2) =>
  new Date(p2.timestamp).getTime() - new Date(p1.timestamp).getTime()

const fastestPerItemFirst: PlaythroughComparator = (p1, p2) =>
  p1.seconds / p1.numberOfMatches - p2.seconds / p2.numberOfMatches

const shortestFirst: PlaythroughComparator = (p1, p2) => p1.seconds - p2.seconds

function comparatorFor(sortBy: PlaythroughSortKey): PlaythroughComparator {
  if (sortBy === 'speed') return fastestPerItemFirst
  if (sortBy === 'duration') return shortestFirst

  return newestFirst
}

export function queryPlaythroughs(
  playthroughs: IListPlaythrough[],
  lists: Pick<IList, 'id'>[],
  query: PlaythroughQuery,
) {
  const knownListIds = new Set(lists.map((list) => list.id))
  const compare = comparatorFor(query.sortBy)

  return playthroughs
    .filter((p) => knownListIds.has(p.listId))
    .filter((p) => !query.listId || p.listId === query.listId)
    .sort((p1, p2) => (query.sortDir === 'desc' ? compare(p2, p1) : compare(p1, p2)))
}
