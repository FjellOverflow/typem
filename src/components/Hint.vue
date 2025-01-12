<script setup lang="ts">
import type { ICheckableItem } from '@/types'
import { ArrowLeftIcon, ArrowRightIcon, LightbulbIcon } from 'lucide-vue-next'

const props = defineProps<{ items: ICheckableItem[]; canCycle: boolean }>()

const offset = ref(0)

const uncheckedItems = computed(() => props.items.filter((item) => !item.checked))

watch(uncheckedItems, () => setOffset(offset.value))

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
  <div class="border rounded-lg p-4 text-2xl flex justify-between">
    <button
      v-if="canCycle"
      class="btn btn-outline text-xl font-medium"
      @click="setOffset(offset - 1)"
    >
      <ArrowLeftIcon /> {{ $t('hint.previous') }}
    </button>

    <div class="flex gap-4 items-center">
      <LightbulbIcon :size="36" />
      {{ nextItem?.hint || $t('hint.none') }}
    </div>

    <button
      v-if="canCycle"
      class="btn btn-outline text-xl font-medium"
      @click="setOffset(offset + 1)"
    >
      <ArrowRightIcon /> {{ $t('hint.next') }}
    </button>
  </div>
</template>
