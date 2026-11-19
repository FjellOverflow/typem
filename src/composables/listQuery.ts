import { useParsedRouteQuery } from '@/composables/parsedRouteQuery'
import { ListProgressOptions, SortDirectionOptions, type IList, type ListProgress } from '@/types'
import { availableLocales, type ILocalizedString } from '@/types/localization'
import { z } from 'zod'

export const anyValue = 'any'

export const ListSortKeyOptions = ['name', 'difficulty', 'length'] as const
export type ListSortKey = (typeof ListSortKeyOptions)[number]

export const ListQuerySchema = z.object({
  keyword: z.string().catch(''),
  tag: z.string().min(1).catch(anyValue),
  language: z.enum([anyValue, ...availableLocales]).catch(anyValue),
  progress: z.enum([anyValue, ...ListProgressOptions]).catch(anyValue),
  sortBy: z.enum(ListSortKeyOptions).catch('name'),
  sortDir: z.enum(SortDirectionOptions).catch('asc'),
})
export type IListQuery = z.infer<typeof ListQuerySchema>

export const defaultListQuery = ListQuerySchema.parse({})

export interface ListQueryContext {
  localize: (text: ILocalizedString) => string
  translateTag: (tag: string) => string
  progressOf: (listId: string) => ListProgress
}

type ListComparator = (l1: IList, l2: IList) => number

function naturalOrderBy(
  localize: ListQueryContext['localize'],
): Record<ListSortKey, ListComparator> {
  return {
    name: (l1, l2) => localize(l1.meta.name).localeCompare(localize(l2.meta.name)),
    difficulty: (l1, l2) => l1.meta.difficulty - l2.meta.difficulty,
    length: (l1, l2) => l1.items.length - l2.items.length,
  }
}

function normalizedForSearch(text: string) {
  return text.replace(/ /g, '').toLowerCase()
}

function containsKeyword(text: string, keyword: string) {
  return normalizedForSearch(text).includes(normalizedForSearch(keyword))
}

export function queryLists(lists: IList[], query: IListQuery, context: ListQueryContext) {
  const { localize, translateTag, progressOf } = context

  const searchableTextOf = (list: IList) =>
    [
      localize(list.meta.name),
      localize(list.meta.description),
      ...list.meta.tags.map(translateTag),
    ].join(' ')

  const naturalOrder = naturalOrderBy(localize)[query.sortBy]

  return lists
    .filter((list) => containsKeyword(searchableTextOf(list), query.keyword))
    .filter((list) => query.tag === anyValue || list.meta.tags.includes(query.tag))
    .filter(
      (list) => query.language === anyValue || list.meta.supportedLocales.includes(query.language),
    )
    .filter((list) => query.progress === anyValue || progressOf(list.id) === query.progress)
    .sort((l1, l2) => (query.sortDir === 'desc' ? naturalOrder(l2, l1) : naturalOrder(l1, l2)))
}

export function useListQuery() {
  return useParsedRouteQuery(ListQuerySchema)
}
