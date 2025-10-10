<script setup lang="ts">
import { useFavorites } from '@/composables/favorites'
import { useLocalize } from '@/composables/localize'
import { useListPlaythroughs } from '@/composables/playthroughs'
import { getSecondsPerItem, formatDuration } from '@/plugins/util'
import type { IList } from '@/types'
import {
  HeartIcon,
  InfoIcon,
  LanguagesIcon,
  ListCheckIcon,
  ListIcon,
  LockIcon,
  StarIcon,
  TimerIcon,
} from 'lucide-vue-next'

const listInfoPopUp = useTemplateRef('listInfoPopUp')

const props = withDefaults(
  defineProps<{
    list: IList
    showDetails?: boolean
  }>(),
  {
    showDetails: true,
  },
)

const { t, locale } = useI18n()
const { localize } = useLocalize()

const { bestListPlaythrough } = useListPlaythroughs(props.list.id)
const { isFavorite, toggleFavorite } = useFavorites()

const imageUrl = computed(() =>
  props.list.meta.imageUrl ? new URL(props.list.meta.imageUrl, import.meta.url).href : undefined,
)

const difficultyLabel = computed(() => {
  if (props.list.meta.difficulty === 3) return t('Hard')

  if (props.list.meta.difficulty === 2) return t('Medium')

  return t('Easy')
})
</script>
<template>
  <div :id="`list-preview-${list.id}`" class="border rounded-md p-4 grid grid-cols-3 gap-4">
    <ListInfoPopUp :list ref="listInfoPopUp" />
    <div class="col-span-3 sm:col-span-2 grid grid-cols-4 items-center">
      <img
        v-if="imageUrl"
        :src="imageUrl"
        class="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 border rounded-md"
        style="border-radius: 16px"
      />
      <div class="col-span-3 flex flex-col gap-2" :class="imageUrl ? 'col-span-3' : 'col-span-4'">
        <span class="text-2xl lg:text-3xl font-medium">
          {{ localize(list.meta.name) }}
          <span v-if="list.meta.isCustom" class="badge badge-outline badge-primary align-middle">{{
            $t('Custom')
          }}</span>
        </span>
        <span v-if="showDetails" class="lg:text-xl font-medium">
          {{ localize(list.meta.description) }}
        </span>
      </div>
    </div>

    <div class="sm:col-span-1 sm:flex hidden flex-col justify-center">
      <slot name="action" />
    </div>

    <div v-if="showDetails" class="col-span-3 flex flex-wrap items-center gap-3 sm:gap-8">
      <div
        class="tooltip tooltip-bottom before:max-w-36 cursor-default"
        :data-tip="
          $t('{items} and more', {
            items: list.items
              .slice(0, 3)
              .map((i) => localize(i.answer))
              .join(', '),
          })
        "
      >
        <div class="flex gap-2 opacity-65">
          <ListIcon /> <span>{{ $t('{number} items', { number: list.items.length }) }}</span>
        </div>
      </div>

      <div
        class="tooltip tooltip-bottom before:max-w-36 cursor-default"
        :data-tip="$t('Difficulties are Easy, Medium and Hard')"
      >
        <div class="flex gap-2 opacity-65">
          <StarIcon v-for="i in list.meta.difficulty" :key="i" />
          <span> {{ difficultyLabel }}</span>
        </div>
      </div>

      <div
        v-if="bestListPlaythrough"
        class="tooltip tooltip-bottom before:max-w-36 cursor-default"
        :data-tip="
          getSecondsPerItem(bestListPlaythrough.numberOfMatches, bestListPlaythrough.seconds)
        "
      >
        <div class="flex gap-2 opacity-65">
          <template v-if="bestListPlaythrough.finished">
            <TimerIcon />
            <span> {{ formatDuration(bestListPlaythrough.seconds) }}</span>
          </template>
          <template v-else>
            <ListCheckIcon />
            <span> {{ `${bestListPlaythrough.numberOfMatches}/${list.items.length}` }}</span>
          </template>
        </div>
      </div>

      <div
        v-if="!list.settings.allowOverride"
        class="tooltip tooltip-bottom before:max-w-36 cursor-default"
        :data-tip="$t(`Predefined settings. You can't adjust the settings.`)"
      >
        <div class="flex gap-2 opacity-65">
          <LockIcon />
        </div>
      </div>

      <div
        v-if="!list.meta.supportedLocales?.includes(locale)"
        class="tooltip tooltip-bottom before:max-w-36 cursor-default"
        :data-tip="$t('This list is not available in your language.')"
      >
        <div class="flex gap-2 text-error">
          <LanguagesIcon />
        </div>
      </div>

      <div class="ml-auto sm:flex hidden gap-1">
        <div class="tooltip tooltip-bottom" :data-tip="$t('Mark as favorite')">
          <button
            @click="toggleFavorite(list)"
            class="btn btn-ghost"
            :class="{ 'text-primary': isFavorite(list) }"
          >
            <HeartIcon :class="{ 'fill-primary': isFavorite(list) }" />
          </button>
        </div>
        <div class="tooltip tooltip-bottom" :data-tip="$t('More about the list')">
          <button @click="listInfoPopUp?.open()" class="btn btn-ghost">
            <InfoIcon />
          </button>
        </div>
      </div>
    </div>
    <div class="sm:hidden col-span-3 flex gap-2">
      <div class="w-full">
        <slot name="action" />
      </div>
      <template v-if="showDetails">
        <div class="tooltip tooltip-bottom before:max-w-28 ml-2" :data-tip="$t('Mark as favorite')">
          <button
            @click="toggleFavorite(list)"
            class="btn btn-ghost"
            :class="{ 'text-primary': isFavorite(list) }"
          >
            <HeartIcon :class="{ 'fill-primary': isFavorite(list) }" />
          </button>
        </div>
        <div class="tooltip tooltip-bottom before:max-w-28" :data-tip="$t('More about the list')">
          <button @click="listInfoPopUp?.open()" class="btn btn-ghost">
            <InfoIcon />
          </button>
        </div>
      </template>
    </div>
  </div>
</template>
