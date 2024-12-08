<script setup lang="ts">
import type { ICheckableItem, IItem } from '@/types'
import { ListCheck } from 'lucide-vue-next'

const isOpen = ref(false)

const props = defineProps<{
  items: ICheckableItem[]
  isStopped?: boolean
  highlighted?: IItem
}>()

const numberOfItemsChecked = computed(() => props.items.filter((item) => item.checked).length)

defineExpose({
  open: () => (isOpen.value = true),
  close: () => (isOpen.value = false),
})
</script>
<template>
  <div class="collapse collapse-arrow border rounded-lg overflow-visible">
    <input type="checkbox" v-model="isOpen" />
    <div class="collapse-title text-xl font-medium flex gap-2 items-center">
      <ListCheck />
      {{ `${$t('items.label')} (${numberOfItemsChecked}/${items.length})` }}
    </div>
    <div class="collapse-content">
      <ul class="grid grid-cols-4 list-none mt-4 gap-2">
        <li v-for="item in items" :key="item.answer" class="min-h-6 mb-2">
          <div
            class="overflow-visible border rounded-lg py-1 px-2"
            :class="{
              'border-success': highlighted?.answer === item.answer,
              'border-error': isStopped && !item.checked,
            }"
          >
            <template v-if="item.checked || isStopped">
              <Tooltip
                v-if="item.hint"
                :label="item.hint"
                type="hint"
                :class="{
                  'text-success': highlighted?.answer === item.answer,
                  'text-error': isStopped && !item.checked,
                }"
              >
                <span class="mr-1">{{ item.answer }}</span>
              </Tooltip>
              <span
                v-else
                :class="{
                  'text-success': highlighted?.answer === item.answer,
                  'text-error': isStopped && !item.checked,
                }"
                >{{ item.answer }}</span
              >
            </template>
            <div v-else class="h-6"></div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
