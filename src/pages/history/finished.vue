<script lang="ts">
import { useListsLoader } from '@/plugins/listLoader'
export { useListsLoader }
</script>

<script setup lang="ts">
import { usePlaythroughs } from '@/composables/playthroughs'
import { useRouteQuery } from '@vueuse/router'
import { EllipsisIcon, FilterIcon } from 'lucide-vue-next'

const { data: lists } = useListsLoader()
const { allPlaythroughs } = usePlaythroughs()

const numberOfVisiblePlaythroughs = ref(10)
const filterListId = useRouteQuery('listId', '')
const sortBy = useRouteQuery<'date' | 'speed' | 'duration'>('sortBy', 'date')
const sortDirection = useRouteQuery<'asc' | 'desc'>('sortDir', 'asc')

const filteredPlaythroughs = computed(() => {
  const playthroughs = allPlaythroughs.value
    .filter((r) => r.finished)
    .filter((p) => !filterListId.value || p.listId === filterListId.value)

  playthroughs.sort((p1, p2) => {
    const [left, right] = sortDirection.value === 'desc' ? [p2, p1] : [p1, p2]

    if (sortBy.value === 'speed')
      return left.seconds / left.numberOfMatches - right.seconds / right.numberOfMatches
    else if (sortBy.value === 'duration') return left.seconds - right.seconds

    return new Date(right.timestamp).getTime() - new Date(left.timestamp).getTime()
  })
  return playthroughs
})

const visiblePlaythroughs = computed(() =>
  filteredPlaythroughs.value.slice(0, numberOfVisiblePlaythroughs.value),
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
      v-if="visiblePlaythroughs.length < filteredPlaythroughs.length"
      @click="numberOfVisiblePlaythroughs += 10"
      class="btn btn-outline"
    >
      <EllipsisIcon />
      {{ $t('Load more') }}
    </button>
  </div>
</template>
