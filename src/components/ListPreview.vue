<script setup lang="ts">
import { useFavorites } from '@/composables/favorites'
import { useListHistory } from '@/composables/history'
import { formatSeconds } from '@/plugins/util'
import type { IItemList } from '@/types'
import { Heart, Info, List, Lock, Star, Timer } from 'lucide-vue-next'

const infoModal = useTemplateRef('infoModal')

const props = withDefaults(
  defineProps<{
    list: IItemList
    showDetails?: boolean
  }>(),
  {
    showDetails: true,
  },
)

const { t } = useI18n()

const { bestListRun } = useListHistory(props.list.id)
const { isFavorite, toggleFavorite } = useFavorites()

const difficultyLabel = computed(() => {
  if (props.list.meta.difficulty === 3) return t('difficulty.hard')

  if (props.list.meta.difficulty === 2) return t('difficulty.medium')

  return t('difficulty.easy')
})
</script>
<template>
  <div class="border rounded-lg p-4 grid grid-cols-3 gap-4">
    <div class="col-span-2 flex flex-col gap-2">
      <span class="text-3xl font-medium">
        {{ list.meta.name }}
      </span>
      <span v-if="showDetails" class="text-xl font-medium">
        {{ list.meta.description }}
      </span>
    </div>
    <div class="flex flex-col justify-center">
      <slot name="action" />
    </div>
    <div v-if="showDetails" class="col-span-3 flex items-center gap-8">
      <div class="flex gap-2 opacity-65">
        <List /> <span>{{ list.items.length }} items</span>
      </div>
      <div class="flex gap-2 opacity-65">
        <Star v-for="i in list.meta.difficulty" :key="i" />
        <span> {{ difficultyLabel }}</span>
      </div>
      <div v-if="bestListRun" class="flex gap-2 opacity-65">
        <Timer />
        <span> {{ formatSeconds(bestListRun.seconds) }}</span>
      </div>
      <div v-if="!list.settings.allowOverride" class="flex gap-2 opacity-65">
        <Lock />
        <span>{{ $t('settings.cannotOverride') }}</span>
      </div>
      <div class="mx-auto" />
      <div class="flex gap-1">
        <button
          @click="toggleFavorite(list)"
          class="btn btn-ghost"
          :class="{ 'text-primary': isFavorite(list) }"
        >
          <Heart :class="{ 'fill-primary': isFavorite(list) }" />
        </button>
        <button @click="infoModal?.showModal()" class="btn btn-ghost">
          <Info />
        </button>
        <dialog ref="infoModal" class="modal">
          <div class="modal-box border">
            <ListInfo :list />
          </div>
          <form method="dialog" class="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>
      </div>
    </div>
  </div>
</template>
