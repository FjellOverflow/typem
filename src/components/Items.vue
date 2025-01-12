<script setup lang="ts">
import type { ICheckableItem, IItem } from '@/types'
import { ListCheckIcon } from 'lucide-vue-next'

const isOpen = ref(false)

const props = defineProps<{
  items: ICheckableItem[]
  isStopped?: boolean
  highlighted?: IItem
}>()

const numberOfItemsChecked = computed(() => props.items.filter((item) => item.checked).length)

const smallerLayout = computed(() => props.items.length > 28)

defineExpose({
  open: () => (isOpen.value = true),
  close: () => (isOpen.value = false),
})
</script>
<template>
  <CollapsibleBox v-model="isOpen">
    <template #title>
      <div class="flex gap-2 items-center">
        <ListCheckIcon />
        {{ `${$t('items.label')} (${numberOfItemsChecked}/${items.length})` }}
      </div>
    </template>
    <template #content>
      <ul
        class="grid list-none mt-4 gap-2"
        :class="[smallerLayout ? 'grid-cols-5' : 'grid-cols-4']"
      >
        <li
          v-for="item in items"
          :key="item.answer"
          class="mb-2"
          :class="{ 'text-sm': smallerLayout, 'text-base': !smallerLayout }"
        >
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
                :size="smallerLayout ? 17 : 20"
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
            <div v-else :class="[smallerLayout ? 'h-5' : 'h-6']"></div>
          </div>
        </li>
      </ul>
    </template>
  </CollapsibleBox>
</template>
