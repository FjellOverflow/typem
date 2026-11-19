<script lang="ts" setup>
import { useLocalize } from '@/composables/localize'
import {
  PlaythroughSortKeyOptions,
  usePlaythroughQuery,
  type PlaythroughSortKey,
} from '@/composables/playthroughQuery'
import type { IList } from '@/types'
import { XIcon } from '@lucide/vue'

const props = defineProps<{
  lists: IList[]
}>()

const { localize } = useLocalize()
const { query, isDefault, reset } = usePlaythroughQuery()

const listSelectOptions = computed(() => [
  { id: '', meta: { name: { en: 'All lists', de: 'Alle Listen' } } },
  ...props.lists,
])

const sortLabels: Record<PlaythroughSortKey, string> = {
  date: 'Sort by date',
  speed: 'Sort by speed',
  duration: 'Sort by duration',
}
</script>
<template>
  <select v-model="query.listId" class="select select-bordered md:w-60">
    <option v-for="list in listSelectOptions" :key="list.id" :value="list.id">
      {{ localize(list.meta.name) }}
    </option>
  </select>

  <div class="flex md:w-48 w-full">
    <select v-model="query.sortBy" class="select select-bordered grow">
      <option v-for="sortKey in PlaythroughSortKeyOptions" :key="sortKey" :value="sortKey">
        {{ $t(sortLabels[sortKey]) }}
      </option>
    </select>
    <SortDirectionToggle v-model="query.sortDir" class="ml-4 md:hidden" />
  </div>

  <SortDirectionToggle v-model="query.sortDir" class="md:block hidden" />
  <button
    :disabled="isDefault"
    class="md:ml-auto mx-auto btn btn-outline text-xl font-medium md:w-auto w-1/2"
    @click="reset"
  >
    <XIcon /> {{ $t('Clear') }}
  </button>
</template>
