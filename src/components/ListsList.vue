<script setup lang="ts">
import { matchKeyword } from '@/plugins/util'
import { type IList } from '@/types'
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
const sortBy = useRouteQuery<'name' | 'difficulty' | 'length'>('sortBy', 'name')
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
  const lists = props.lists
    .filter((list) => matchKeyword(list.meta.name, filterKeyword.value))
    .filter((list) => filterTag.value === 'any' || list.meta.tags.includes(filterTag.value))

  lists.sort((l1, l2) => {
    const [left, right] = sortDirection.value === 'desc' ? [l2, l1] : [l1, l2]

    if (sortBy.value === 'difficulty') return left.meta.difficulty - right.meta.difficulty
    else if (sortBy.value === 'length') return left.items.length - right.items.length

    return left.meta.name.localeCompare(right.meta.name)
  })

  return lists
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
      v-model="filterKeyword"
      type="text"
      :placeholder="$t('Type to filter')"
      class="input input-bordered w-48"
    />

    <select v-model="filterTag" class="select select-bordered w-48 capitalize">
      <option v-for="tag in availableTags" :key="tag" :value="tag" class="capitalize">
        {{ $t('Tag') }}: {{ tag }}
      </option>
    </select>

    <select v-model="sortBy" class="select select-bordered w-48">
      <option value="name">{{ $t('Sort by name') }}</option>
      <option value="difficulty">{{ $t('Sort by difficulty') }}</option>
      <option value="length">{{ $t('Sort by length') }}</option>
    </select>

    <button class="btn btn-ghost" @click="toggleSortDirection">
      <ArrowDownNarrowWideIcon v-if="sortDirection === 'asc'" />
      <ArrowDownWideNarrowIcon v-else />
    </button>

    <button
      :disabled="!filtersActive"
      class="ml-auto btn btn-outline text-xl font-medium"
      @click="resetFilters"
    >
      <XIcon /> {{ $t('Clear') }}
    </button>
  </div>

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
