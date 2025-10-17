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
  <div class="flex flex-col flex-wrap gap-4 p-2">
    <div class="flex flex-col md:flex-row gap-4">
      <input
        v-model="filterKeyword"
        type="text"
        :placeholder="$t('Type to filter')"
        class="input input-bordered"
      />

      <select v-model="filterTag" class="select select-bordered md:w-48">
        <option v-for="tag in sortedTags" :key="tag" :value="tag">
          {{ $t('Tag') }}: {{ $t(tag) }}
        </option>
      </select>

      <select
        v-if="availableLocales.length > 1"
        v-model="filterLanguage"
        class="select select-bordered md:w-48"
      >
        <option value="any">{{ $t('Language') }}: {{ $t('any') }}</option>
        <option
          v-for="availableLocale in availableLocales"
          :key="availableLocale"
          :value="availableLocale"
        >
          {{ $t('Language') }}:
          <FlagIcon :locale="availableLocale" />
          {{ $t('English', {}, { locale: availableLocale }) }}
        </option>
      </select>
    </div>

    <div class="flex flex-col md:flex-row flex-wrap gap-4">
      <div class="flex grow">
        <select v-model="sortBy" class="select select-bordered">
          <option value="name">{{ $t('Sort by name') }}</option>
          <option value="difficulty">{{ $t('Sort by difficulty') }}</option>
          <option value="length">{{ $t('Sort by length') }}</option>
        </select>
        <div
          class="ml-4 tooltip tooltip-bottom"
          :data-tip="sortDirection === 'asc' ? $t('Sort ascending') : $t('Sort descending')"
        >
          <button class="btn btn-ghost" @click="toggleSortDirection">
            <ArrowDownNarrowWideIcon v-if="sortDirection === 'asc'" />
            <ArrowDownWideNarrowIcon v-else />
          </button>
        </div>
      </div>

      <button
        :disabled="!filtersActive"
        class="md:ml-auto mx-auto btn btn-outline text-xl font-medium md:w-auto"
        @click="resetFilters"
      >
        <XIcon /> {{ $t('Clear') }}
      </button>
    </div>
  </div>
</template>
