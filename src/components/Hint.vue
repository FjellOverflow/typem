<script setup lang="ts">
import type { ICheckableItem } from '@/types'
import { ArrowLeft, ArrowRight, Lightbulb } from 'lucide-vue-next'

const props = defineProps<{ items: ICheckableItem[]; canCycle: boolean }>()

const offset = ref(0)

const uncheckedItems = computed(() => props.items.filter((item) => !item.checked))

watch(uncheckedItems, () => (offset.value = 0))

const nextItem = computed(() => {
  let positivOffset = offset.value
  while (positivOffset < 0) positivOffset += uncheckedItems.value.length

  return uncheckedItems.value[positivOffset % uncheckedItems.value.length]
})
</script>
<template>
  <div class="border rounded-lg p-4 text-2xl flex justify-between">
    <button v-if="canCycle" class="btn btn-outline text-xl font-medium" @click="offset -= 1">
      <ArrowLeft /> {{ $t('hint.previous') }}
    </button>

    <div class="flex gap-4 items-center">
      <Lightbulb :size="36" />
      {{ nextItem?.hint || $t('hint.none') }}
    </div>

    <button v-if="canCycle" class="btn btn-outline text-xl font-medium" @click="offset += 1">
      <ArrowRight /> {{ $t('hint.next') }}
    </button>
  </div>
</template>
