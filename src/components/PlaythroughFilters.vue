<script lang="ts" setup>
import type { IList } from '@/types'
import { ArrowDownNarrowWideIcon, ArrowDownWideNarrowIcon, XIcon } from 'lucide-vue-next'

const props = defineProps<{
  lists: IList[]
}>()

const filterListId = defineModel('listId')
const sortBy = defineModel<'date' | 'speed' | 'duration'>('sortBy', { required: true })
const sortDirection = defineModel<'asc' | 'desc'>('sortDir', { required: true })

const listSelectOptions = computed(() => [{ id: '', meta: { name: 'All lists' } }, ...props.lists])

const filtersActive = computed(
  () => !!filterListId.value || sortBy.value !== 'date' || sortDirection.value !== 'asc',
)

function resetFilters() {
  filterListId.value = ''
  sortBy.value = 'date'
  sortDirection.value = 'asc'
}

function toggleSortDirection() {
  sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
}
</script>
<template>
  <select v-model="filterListId" class="select select-bordered md:w-60 capitalize">
    <option v-for="list in listSelectOptions" :key="list.id" :value="list.id" class="capitalize">
      {{ list.meta.name }}
    </option>
  </select>

  <div class="flex md:w-48 w-full">
    <select v-model="sortBy" class="select select-bordered grow">
      <option value="date">{{ $t('Sort by date') }}</option>
      <option value="speed">{{ $t('Sort by speed') }}</option>
      <option value="duration">{{ $t('Sort by duration') }}</option>
    </select>
    <div
      class="ml-4 tooltip tooltip-bottom md:hidden"
      :data-tip="sortDirection === 'asc' ? $t('Sort ascending') : $t('Sort descending')"
    >
      <button class="btn btn-ghost" @click="toggleSortDirection">
        <ArrowDownNarrowWideIcon v-if="sortDirection === 'asc'" />
        <ArrowDownWideNarrowIcon v-else />
      </button>
    </div>
  </div>

  <div
    class="tooltip tooltip-bottom md:block hidden"
    :data-tip="sortDirection === 'asc' ? $t('Sort ascending') : $t('Sort descending')"
  >
    <button class="btn btn-ghost" @click="toggleSortDirection">
      <ArrowDownNarrowWideIcon v-if="sortDirection === 'asc'" />
      <ArrowDownWideNarrowIcon v-else />
    </button>
  </div>
  <button
    :disabled="!filtersActive"
    class="md:ml-auto mx-auto btn btn-outline text-xl font-medium md:w-auto w-1/2"
    @click="resetFilters"
  >
    <XIcon /> {{ $t('Clear') }}
  </button>
</template>
