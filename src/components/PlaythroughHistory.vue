<script setup lang="ts">
import {
  defaultPlaythroughQuery,
  queryPlaythroughs,
  type PlaythroughSortKey,
  type SortDirection,
} from '@/composables/playthroughQuery'
import type { IList, IListPlaythrough } from '@/types'
import { useRouteQuery } from '@vueuse/router'
import { EllipsisIcon, FilterIcon } from '@lucide/vue'

const props = defineProps<{
  playthroughs: IListPlaythrough[]
  lists: IList[]
}>()

const pageSize = 10
const numberOfVisiblePlaythroughs = ref(pageSize)

const filterListId = useRouteQuery('listId', defaultPlaythroughQuery.listId)
const sortBy = useRouteQuery<PlaythroughSortKey>('sortBy', defaultPlaythroughQuery.sortBy)
const sortDirection = useRouteQuery<SortDirection>('sortDir', defaultPlaythroughQuery.sortDir)

const matchingPlaythroughs = computed(() =>
  queryPlaythroughs(props.playthroughs, props.lists, {
    listId: filterListId.value,
    sortBy: sortBy.value,
    sortDir: sortDirection.value,
  }),
)

const visiblePlaythroughs = computed(() =>
  matchingPlaythroughs.value.slice(0, numberOfVisiblePlaythroughs.value),
)
</script>
<template>
  <div class="hidden md:flex w-full gap-4 mb-4">
    <PlaythroughFilters
      v-model:list-id="filterListId"
      v-model:sort-by="sortBy"
      v-model:sort-dir="sortDirection"
      :lists
    />
  </div>

  <CollapsibleBox class="md:hidden mb-4" :model-value="false">
    <template #title>
      <div class="flex gap-2 items-center">
        <FilterIcon />
        {{ $t('Filters') }}
      </div>
    </template>
    <template #content>
      <div class="flex flex-col gap-4 p-2">
        <PlaythroughFilters
          v-model:list-id="filterListId"
          v-model:sort-by="sortBy"
          v-model:sort-dir="sortDirection"
          :lists
        />
      </div>
    </template>
  </CollapsibleBox>

  <PlaythroughsList :playthroughs="visiblePlaythroughs" />

  <div
    v-if="visiblePlaythroughs.length === 0"
    class="w-full flex justify-center text-2xl sm:text-3xl mt-8"
  >
    {{ $t('No playthroughs yet.') }}
  </div>

  <div class="p-8 flex justify-center">
    <button
      v-if="visiblePlaythroughs.length < matchingPlaythroughs.length"
      @click="numberOfVisiblePlaythroughs += pageSize"
      class="btn btn-outline"
    >
      <EllipsisIcon />
      {{ $t('Load more') }}
    </button>
  </div>
</template>
