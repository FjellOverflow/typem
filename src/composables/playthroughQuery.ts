import type { IList, IListPlaythrough } from '@/types'
import { useRouteQuery } from '@vueuse/router'
import { z } from 'zod'

export const PlaythroughSortKeyOptions = ['date', 'speed', 'duration'] as const
export type PlaythroughSortKey = (typeof PlaythroughSortKeyOptions)[number]

export const SortDirectionOptions = ['asc', 'desc'] as const
export type SortDirection = (typeof SortDirectionOptions)[number]

export const PlaythroughQuerySchema = z.object({
  listId: z.string().catch(''),
  sortBy: z.enum(PlaythroughSortKeyOptions).catch('date'),
  sortDir: z.enum(SortDirectionOptions).catch('asc'),
})
export type IPlaythroughQuery = z.infer<typeof PlaythroughQuerySchema>

export const defaultPlaythroughQuery = PlaythroughQuerySchema.parse({})

export function isDefaultPlaythroughQuery(query: IPlaythroughQuery) {
  return PlaythroughQuerySchema.keyof().options.every(
    (field) => query[field] === defaultPlaythroughQuery[field],
  )
}

type PlaythroughComparator = (p1: IListPlaythrough, p2: IListPlaythrough) => number

const naturalOrderBy: Record<PlaythroughSortKey, PlaythroughComparator> = {
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
    .sort((p1, p2) => (query.sortDir === 'desc' ? naturalOrder(p2, p1) : naturalOrder(p1, p2)))
}

function useParsedRouteQuery<Schema extends z.ZodType<string>>(
  field: keyof IPlaythroughQuery,
  schema: Schema,
) {
  return useRouteQuery<string, z.output<Schema>>(field, schema.parse(undefined), {
    transform: (value) => schema.parse(value),
  })
}

export function usePlaythroughQuery() {
  const { shape } = PlaythroughQuerySchema

  const query: IPlaythroughQuery = reactive({
    listId: useParsedRouteQuery('listId', shape.listId),
    sortBy: useParsedRouteQuery('sortBy', shape.sortBy),
    sortDir: useParsedRouteQuery('sortDir', shape.sortDir),
  })

  const isDefault = computed(() => isDefaultPlaythroughQuery(query))

  function reset() {
    Object.assign(query, defaultPlaythroughQuery)
  }

  return { query, isDefault, reset }
}
