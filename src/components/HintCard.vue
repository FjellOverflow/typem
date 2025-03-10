<script setup lang="ts">
import { useHotkey } from '@/composables/hotkey'
import type { ICheckableListItem } from '@/types'
import { ArrowLeftIcon, ArrowRightIcon, LightbulbIcon } from 'lucide-vue-next'

const emit = defineEmits<{
  move: []
}>()

const props = defineProps<{ items: ICheckableListItem[]; canCycle: boolean }>()

const offset = ref(0)
const uncheckedItems = computed(() => props.items.filter((item) => !item.checked))

useHotkey('ArrowRight', onClickNext)
useHotkey('ArrowLeft', onClickPrevious)

watch(uncheckedItems, () => setOffset(offset.value))

function onClickPrevious() {
  setOffset(offset.value - 1)
  emit('move')
}

function onClickNext() {
  setOffset(offset.value + 1)
  emit('move')
}

function setOffset(newOffset: number) {
  let normalizedOffset = newOffset

  while (normalizedOffset >= uncheckedItems.value.length)
    normalizedOffset -= uncheckedItems.value.length
  while (normalizedOffset < 0) normalizedOffset += uncheckedItems.value.length

  offset.value = normalizedOffset
}

const nextItem = computed(() => uncheckedItems.value[offset.value])
</script>
<template>
  <div class="border rounded-md p-4 sm:text-2xl text-xl">
    <div class="flex sm:hidden gap-4 items-center mb-4">
      <LightbulbIcon :size="24" />
      {{ nextItem?.hint || $t('No hint available') }}
    </div>
    <div class="flex justify-between">
      <div v-if="canCycle" class="tooltip tooltip-bottom" data-tip="CTRL + LeftArrow">
        <button class="btn btn-outline text-lg sm:text-xl font-medium" @click="onClickPrevious">
          <ArrowLeftIcon /> {{ $t('Previous') }}
        </button>
      </div>

      <div class="hidden sm:flex gap-4 items-center">
        <LightbulbIcon :size="36" />
        {{ nextItem?.hint || $t('No hint available') }}
      </div>

      <div v-if="canCycle" class="tooltip tooltip-bottom" data-tip="CTRL + RightArrow">
        <button class="btn btn-outline text-lg sm:text-xl font-medium" @click="onClickNext">
          <ArrowRightIcon /> {{ $t('Next') }}
        </button>
      </div>
    </div>
  </div>
</template>
