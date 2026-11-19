<script lang="ts">
import { useListsLoader } from '@/plugins/listLoader'
export { useListsLoader }
</script>

<script setup lang="ts">
import { useTitle } from '@vueuse/core'
import { usePlaythroughs } from '@/composables/playthroughs'
import { playthroughsOfLists } from '@/plugins/util'
import { useRouteQuery } from '@vueuse/router'
import { FilterIcon } from '@lucide/vue'

const { t } = useI18n()
useTitle(`${t('Records')} - Typem`)

const { data: lists } = useListsLoader()

const { records } = usePlaythroughs()

const filterListId = useRouteQuery('listId', '')
const sortBy = useRouteQuery<'date' | 'speed' | 'duration'>('sortBy', 'date')
const sortDirection = useRouteQuery<'asc' | 'desc'>('sortDir', 'asc')

const filteredRecords = computed(() => {
  const filtered = playthroughsOfLists(records.value, lists.value).filter(
    (p) => !filterListId.value || p.listId === filterListId.value,
  )

  filtered.sort((p1, p2) => {
    const [left, right] = sortDirection.value === 'desc' ? [p2, p1] : [p1, p2]

    if (sortBy.value === 'speed')
      return left.seconds / left.numberOfMatches - right.seconds / right.numberOfMatches
    else if (sortBy.value === 'duration') return left.seconds - right.seconds

    return new Date(right.timestamp).getTime() - new Date(left.timestamp).getTime()
  })
  return filtered
})
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

  <PlaythroughsList :playthroughs="filteredRecords" />

  <div
    v-if="filteredRecords.length === 0"
    class="w-full flex justify-center text-2xl sm:text-3xl mt-8"
  >
    {{ $t('No playthroughs yet.') }}
  </div>
</template>
