<script lang="ts" setup>
import { ArrowDownNarrowWideIcon, ArrowDownWideNarrowIcon, XIcon } from '@lucide/vue'
import { anyValue, useListQuery } from '@/composables/listQuery'
import { availableLocales } from '@/types/localization'
import { ListProgressOptions } from '@/types'

const props = defineProps<{
  tags: string[]
}>()

const { t } = useI18n()
const { query, isDefault, reset } = useListQuery()

const sortedTags = computed(() =>
  [...props.tags].sort((tag1, tag2) => t(tag1).localeCompare(t(tag2))),
)

function toggleSortDirection() {
  query.sortDir = query.sortDir === 'asc' ? 'desc' : 'asc'
}
</script>
<template>
  <div class="flex flex-col flex-wrap gap-4 p-2">
    <div class="flex flex-col md:flex-row gap-4">
      <input
        v-model="query.keyword"
        type="text"
        :placeholder="$t('Type to filter')"
        class="input input-bordered"
      />

      <select v-model="query.tag" class="select select-bordered md:w-48">
        <option :value="anyValue">{{ $t('Tag') }}: {{ $t(anyValue) }}</option>
        <option v-for="tag in sortedTags" :key="tag" :value="tag">
          {{ $t('Tag') }}: {{ $t(tag) }}
        </option>
      </select>

      <select
        v-if="availableLocales.length > 1"
        v-model="query.language"
        class="select select-bordered md:w-48"
      >
        <option :value="anyValue">{{ $t('Language') }}: {{ $t(anyValue) }}</option>
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

      <select v-model="query.progress" class="select select-bordered md:w-48">
        <option :value="anyValue">
          {{ $t('Progress') }}:
          {{ $t(anyValue) }}
        </option>
        <option
          v-for="listProgress in ListProgressOptions"
          :key="listProgress"
          :value="listProgress"
        >
          {{ $t('Progress') }}:
          {{ $t(listProgress) }}
        </option>
      </select>
    </div>

    <div class="flex flex-col md:flex-row flex-wrap gap-4">
      <div class="flex grow">
        <select v-model="query.sortBy" class="select select-bordered">
          <option value="name">{{ $t('Sort by name') }}</option>
          <option value="difficulty">{{ $t('Sort by difficulty') }}</option>
          <option value="length">{{ $t('Sort by length') }}</option>
        </select>
        <div
          class="ml-4 tooltip tooltip-bottom"
          :data-tip="query.sortDir === 'asc' ? $t('Sort ascending') : $t('Sort descending')"
        >
          <button class="btn btn-ghost" @click="toggleSortDirection">
            <ArrowDownNarrowWideIcon v-if="query.sortDir === 'asc'" />
            <ArrowDownWideNarrowIcon v-else />
          </button>
        </div>
      </div>

      <button
        :disabled="isDefault"
        class="md:ml-auto mx-auto btn btn-outline text-xl font-medium md:w-auto"
        @click="reset"
      >
        <XIcon /> {{ $t('Clear') }}
      </button>
    </div>
  </div>
</template>
