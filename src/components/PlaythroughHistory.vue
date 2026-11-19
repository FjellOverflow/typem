<script setup lang="ts">
import { queryPlaythroughs, usePlaythroughQuery } from '@/composables/playthroughQuery'
import type { IList, IListPlaythrough } from '@/types'
import { EllipsisIcon, FilterIcon } from '@lucide/vue'

const props = defineProps<{
  playthroughs: IListPlaythrough[]
  lists: IList[]
}>()

const pageSize = 10
const numberOfVisiblePlaythroughs = ref(pageSize)

const { query } = usePlaythroughQuery()

const matchingPlaythroughs = computed(() =>
  queryPlaythroughs(props.playthroughs, props.lists, query),
)

const visiblePlaythroughs = computed(() =>
  matchingPlaythroughs.value.slice(0, numberOfVisiblePlaythroughs.value),
)
</script>
<template>
  <div class="hidden md:flex w-full gap-4 mb-4">
    <PlaythroughFilters :lists />
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
        <PlaythroughFilters :lists />
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
