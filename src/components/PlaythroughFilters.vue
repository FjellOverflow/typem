<script lang="ts" setup>
import { useLocalize } from '@/composables/localize'
import { usePlaythroughQuery } from '@/composables/playthroughQuery'
import type { IList } from '@/types'
import { ArrowDownNarrowWideIcon, ArrowDownWideNarrowIcon, XIcon } from '@lucide/vue'

const props = defineProps<{
  lists: IList[]
}>()

const { localize } = useLocalize()
const { query, isDefault, reset } = usePlaythroughQuery()

const listSelectOptions = computed(() => [
  { id: '', meta: { name: { en: 'All lists', de: 'Alle Listen' } } },
  ...props.lists,
])

function toggleSortDirection() {
  query.sortDir = query.sortDir === 'asc' ? 'desc' : 'asc'
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
      <option value="date">{{ $t('Sort by date') }}</option>
      <option value="speed">{{ $t('Sort by speed') }}</option>
      <option value="duration">{{ $t('Sort by duration') }}</option>
    </select>
    <div
      class="ml-4 tooltip tooltip-bottom md:hidden"
      :data-tip="query.sortDir === 'asc' ? $t('Sort ascending') : $t('Sort descending')"
    >
      <button class="btn btn-ghost" @click="toggleSortDirection">
        <ArrowDownNarrowWideIcon v-if="query.sortDir === 'asc'" />
        <ArrowDownWideNarrowIcon v-else />
      </button>
    </div>
  </div>

  <div
    class="tooltip tooltip-bottom md:block hidden"
    :data-tip="query.sortDir === 'asc' ? $t('Sort ascending') : $t('Sort descending')"
  >
    <button class="btn btn-ghost" @click="toggleSortDirection">
      <ArrowDownNarrowWideIcon v-if="query.sortDir === 'asc'" />
      <ArrowDownWideNarrowIcon v-else />
    </button>
  </div>
  <button
    :disabled="isDefault"
    class="md:ml-auto mx-auto btn btn-outline text-xl font-medium md:w-auto w-1/2"
    @click="reset"
  >
    <XIcon /> {{ $t('Clear') }}
  </button>
</template>
