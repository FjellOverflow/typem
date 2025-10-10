<script lang="ts" setup>
import { ArrowDownNarrowWideIcon, ArrowDownWideNarrowIcon, XIcon } from 'lucide-vue-next'
import { availableLocales } from '@/types/localization'

const filterKeyword = defineModel('keyword')
const filterTag = defineModel('tag')
const filterLanguage = defineModel('language')

const sortBy = defineModel<'name' | 'difficulty' | 'length'>('sortBy', { required: true })
const sortDirection = defineModel<'asc' | 'desc'>('sortDir', { required: true })

const props = defineProps<{
  tags: string[]
}>()

const { t } = useI18n()

const filtersActive = computed(
  () =>
    !!filterKeyword.value ||
    sortBy.value !== 'name' ||
    sortDirection.value !== 'asc' ||
    filterTag.value !== 'any' ||
    filterLanguage.value !== 'any',
)

const sortedTags = computed(() =>
  [...props.tags].sort((tag1, tag2) => {
    if (tag1 === 'any') return -1
    else if (tag2 === 'any') return 1

    return t(tag1).localeCompare(t(tag2))
  }),
)

function toggleSortDirection() {
  sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
}

function resetFilters() {
  filterKeyword.value = ''
  filterTag.value = 'any'
  filterLanguage.value = 'any'
  sortBy.value = 'name'
  sortDirection.value = 'asc'
}
</script>
<template>
  <input
    v-model="filterKeyword"
    type="text"
    :placeholder="$t('Type to filter')"
    class="input input-bordered md:flex-1"
  />

  <select v-model="filterTag" class="select select-bordered md:w-48">
    <option v-for="tag in sortedTags" :key="tag" :value="tag">
      {{ $t('Tag') }}: {{ $t(tag) }}
    </option>
  </select>

  <select v-model="filterLanguage" class="select select-bordered md:w-48">
    <option value="any">{{ $t('Language') }}: {{ $t('any') }}</option>
    <option
      v-for="availableLocale in availableLocales"
      :key="availableLocale"
      :value="availableLocale"
    >
      {{ $t('Language') }}: {{ $t('🇬🇧 English', {}, { locale: availableLocale }) }}
    </option>
  </select>

  <div class="flex md:w-64 w-full">
    <select v-model="sortBy" class="select select-bordered grow">
      <option value="name">{{ $t('Sort by name') }}</option>
      <option value="difficulty">{{ $t('Sort by difficulty') }}</option>
      <option value="length">{{ $t('Sort by length') }}</option>
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
    <button class="btn btn-ghost md:block hidden" @click="toggleSortDirection">
      <ArrowDownNarrowWideIcon v-if="sortDirection === 'asc'" />
      <ArrowDownWideNarrowIcon v-else />
    </button>
  </div>

  <div class="flex-1"></div>
  <button
    :disabled="!filtersActive"
    class="md:ml-auto mx-auto btn btn-outline text-xl font-medium md:w-auto w-1/2"
    @click="resetFilters"
  >
    <XIcon /> {{ $t('Clear') }}
  </button>
</template>
