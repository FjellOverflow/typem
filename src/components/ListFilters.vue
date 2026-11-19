<script lang="ts" setup>
import { XIcon } from '@lucide/vue'
import {
  anyValue,
  ListSortKeyOptions,
  useListQuery,
  type ListSortKey,
} from '@/composables/listQuery'
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

const sortLabels: Record<ListSortKey, string> = {
  name: 'Sort by name',
  difficulty: 'Sort by difficulty',
  length: 'Sort by length',
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
        <option :value="anyValue">{{ $t('Tag') }}: {{ $t('any') }}</option>
        <option v-for="tag in sortedTags" :key="tag" :value="tag">
          {{ $t('Tag') }}: {{ $t(tag) }}
        </option>
      </select>

      <select
        v-if="availableLocales.length > 1"
        v-model="query.language"
        class="select select-bordered md:w-48"
      >
        <option :value="anyValue">{{ $t('Language') }}: {{ $t('any') }}</option>
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
          {{ $t('any') }}
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
          <option v-for="sortKey in ListSortKeyOptions" :key="sortKey" :value="sortKey">
            {{ $t(sortLabels[sortKey]) }}
          </option>
        </select>
        <SortDirectionToggle v-model="query.sortDir" class="ml-4" />
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
