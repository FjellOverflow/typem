<script setup lang="ts">
import { useLocalize } from '@/composables/localize'
import { matchKeyword } from '@/plugins/util'
import { type IList } from '@/types'
import { useRouteQuery } from '@vueuse/router'
import { FilterIcon, Gamepad2Icon } from 'lucide-vue-next'

const props = withDefaults(
  defineProps<{
    lists: IList[]
    noDataText?: string
  }>(),
  {
    noDataText: 'No lists found',
  },
)

const { localize } = useLocalize()

const filterKeyword = useRouteQuery('keyword', '')
const filterTag = useRouteQuery('tag', 'any')
const filterLanguage = useRouteQuery('language', 'any')
const sortBy = useRouteQuery<'name' | 'difficulty' | 'length'>('sortBy', 'name')
const sortDirection = useRouteQuery<'asc' | 'desc'>('sortDir', 'asc')

const filtersActive = computed(
  () =>
    !!filterKeyword.value ||
    sortBy.value !== 'name' ||
    sortDirection.value !== 'asc' ||
    filterTag.value !== 'any' ||
    filterLanguage.value !== 'any',
)

const availableTags = computed(() => [
  'any',
  ...new Set(props.lists.map((l) => l.meta.tags).flat()),
])

const filteredLists = computed(() => {
  const lists = props.lists
    .filter((list) => matchKeyword(localize.value(list.meta.name), filterKeyword.value))
    .filter((list) => filterTag.value === 'any' || list.meta.tags.includes(filterTag.value))
    .filter(
      (list) =>
        filterLanguage.value === 'any' || list.meta.supportedLocales.includes(filterLanguage.value),
    )

  lists.sort((l1, l2) => {
    const [left, right] = sortDirection.value === 'desc' ? [l2, l1] : [l1, l2]

    if (sortBy.value === 'difficulty') return left.meta.difficulty - right.meta.difficulty
    else if (sortBy.value === 'length') return left.items.length - right.items.length

    return localize.value(left.meta.name).localeCompare(localize.value(right.meta.name))
  })

  return lists
})
</script>
<template>
  <CollapsibleBox :model-value="false">
    <template #title>
      <div class="flex gap-2 items-center">
        <FilterIcon />
        {{ $t('Filters') }}
      </div>
    </template>
    <template #content>
      <div class="flex flex-col md:flex-row flex-wrap gap-4 p-2">
        <ListFilters
          v-model:keyword="filterKeyword"
          v-model:tag="filterTag"
          v-model:language="filterLanguage"
          v-model:sortBy="sortBy"
          v-model:sortDir="sortDirection"
          :tags="availableTags"
        />
      </div>
    </template>
  </CollapsibleBox>

  <ListPreviewCard v-for="list in filteredLists" :key="list.id" :list class="mt-4 last:mb-8">
    <template #action>
      <button
        class="btn btn-outline btn-primary font-medium sm:text-xl"
        @click="$router.push(`/play/${list.id}`)"
      >
        {{ $t("Let's play!") }} <Gamepad2Icon />
      </button>
    </template>
  </ListPreviewCard>

  <div
    v-if="filteredLists.length === 0"
    class="w-full flex justify-center text-2xl lg:text-3xl mt-8"
  >
    {{ filtersActive ? $t('No lists matching filters.') : noDataText }}
  </div>
</template>
