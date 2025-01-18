<script setup lang="ts">
import { matchKeyword } from '@/plugins/util'
import type { IList } from '@/types'
import {
  ArrowDownNarrowWideIcon,
  ArrowDownWideNarrowIcon,
  Gamepad2Icon,
  XIcon,
} from 'lucide-vue-next'
import { useRouteQuery } from '@vueuse/router'

const props = withDefaults(
  defineProps<{
    lists: IList[]
    noDataText?: string
  }>(),
  {
    noDataText: 'No lists found',
  },
)

const filterKeyword = useRouteQuery('keyword', '')
const filterTag = useRouteQuery('tag', 'any')
const sortBy = useRouteQuery<'name' | 'difficulty'>('sortBy', 'name')
const sortDirection = useRouteQuery<'asc' | 'desc'>('sortDir', 'asc')

const availableTags = computed(() => [
  'any',
  ...new Set(
    props.lists
      .map((l) => l.meta.tags)
      .flat()
      .sort(),
  ),
])

function toggleSortDirection() {
  sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
}

const filtersActive = computed(
  () =>
    !!filterKeyword.value ||
    sortBy.value !== 'name' ||
    sortDirection.value !== 'asc' ||
    filterTag.value !== 'any',
)

const filteredLists = computed(() => {
  const sets = props.lists
    .filter((list) => matchKeyword(list.meta.name, filterKeyword.value))
    .filter((list) => filterTag.value === 'any' || list.meta.tags.includes(filterTag.value))

  sets.sort((s1, s2) => {
    const [left, right] = sortDirection.value === 'desc' ? [s2, s1] : [s1, s2]

    if (sortBy.value === 'difficulty') return left.meta.difficulty - right.meta.difficulty

    return left.meta.name.localeCompare(right.meta.name)
  })

  return sets
})

function resetFilters() {
  filterKeyword.value = ''
  filterTag.value = 'any'
  sortBy.value = 'name'
  sortDirection.value = 'asc'
}
</script>
<template>
  <div class="flex w-full my-2 gap-4">
    <input
      type="text"
      placeholder="Type to filter"
      class="input input-bordered w-48"
      v-model="filterKeyword"
    />
    <select class="select select-bordered w-48 capitalize" v-model="filterTag">
      <option v-for="tag in availableTags" :key="tag" :value="tag" class="capitalize">
        Tag: {{ tag }}
      </option>
    </select>
    <select class="select select-bordered w-48" v-model="sortBy">
      <option value="name">Sort by name</option>
      <option value="difficulty">Sort by difficulty</option>
    </select>
    <button class="btn btn-ghost" @click="toggleSortDirection">
      <ArrowDownNarrowWideIcon v-if="sortDirection === 'asc'" />
      <ArrowDownWideNarrowIcon v-else />
    </button>

    <button
      class="ml-auto btn btn-outline text-xl font-medium"
      @click="resetFilters"
      :disabled="!filtersActive"
    >
      <XIcon /> Clear
    </button>
  </div>
  <ListPreview v-for="list in filteredLists" :key="list.id" :list class="mt-4 last:mb-8">
    <template #action>
      <button
        class="btn btn-outline btn-primary text-xl font-medium"
        @click="$router.push(`/play/${list.id}`)"
      >
        {{ $t('play.label') }} <Gamepad2Icon />
      </button>
    </template>
  </ListPreview>
  <div v-if="filteredLists.length === 0" class="w-full flex justify-center text-3xl mt-8">
    {{ filtersActive ? 'No results found' : noDataText }}
  </div>
</template>
