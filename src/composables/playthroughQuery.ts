import { useParsedRouteQuery } from '@/composables/parsedRouteQuery'
import { inDirection, type Comparator } from '@/plugins/util'
import { SortDirectionOptions, type IList, type IListPlaythrough } from '@/types'
import { z } from 'zod'

export const PlaythroughSortKeyOptions = ['date', 'speed', 'duration'] as const
export type PlaythroughSortKey = (typeof PlaythroughSortKeyOptions)[number]

export const PlaythroughQuerySchema = z.object({
  listId: z.string().catch(''),
  sortBy: z.enum(PlaythroughSortKeyOptions).catch('date'),
  sortDir: z.enum(SortDirectionOptions).catch('asc'),
})
export type IPlaythroughQuery = z.infer<typeof PlaythroughQuerySchema>

export const defaultPlaythroughQuery = PlaythroughQuerySchema.parse({})

const naturalOrderBy: Record<PlaythroughSortKey, Comparator<IListPlaythrough>> = {
  date: (p1, p2) => new Date(p2.timestamp).getTime() - new Date(p1.timestamp).getTime(),
  speed: (p1, p2) => p1.seconds / p1.numberOfMatches - p2.seconds / p2.numberOfMatches,
  duration: (p1, p2) => p1.seconds - p2.seconds,
}

export function queryPlaythroughs(
  playthroughs: IListPlaythrough[],
  lists: Pick<IList, 'id'>[],
  query: IPlaythroughQuery,
) {
  const knownListIds = new Set(lists.map((list) => list.id))
  const naturalOrder = naturalOrderBy[query.sortBy]

  return playthroughs
    .filter((p) => knownListIds.has(p.listId))
    .filter((p) => !query.listId || p.listId === query.listId)
    .sort(inDirection(naturalOrder, query.sortDir))
}

export function usePlaythroughQuery() {
  return useParsedRouteQuery(PlaythroughQuerySchema)
}
