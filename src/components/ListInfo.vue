<script setup lang="ts">
import type { IItemList } from '@/types'
import { ExternalLink } from 'lucide-vue-next'

defineProps<{
  list: IItemList
}>()
</script>
<template>
  <div class="flex flex-col gap-2">
    <div class="text-4xl">
      {{ list.meta.name }}
    </div>
    <span class="opacity-40 text-xl"> ({{ list.id }}) </span>
    <span class="text-2xl">{{ list.meta.description }}</span>
    <div class="flex justify-between mt-4">
      <span
        >Created by <i>{{ list.meta.author }}</i></span
      >
      <span
        >Last update: <i>{{ new Date(list.meta.lastUpdated).toLocaleDateString() }}</i>
      </span>
      <a class="flex gap-1 underline" target="_blank" norefferer noopener :href="list.meta.source"
        ><i>Source</i><ExternalLink :size="14" />
      </a>
    </div>
  </div>
</template>
