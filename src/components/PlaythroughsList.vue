<script setup lang="ts">
import type { IListPlaythrough } from '@/types'
defineProps<{
  playthroughs: IListPlaythrough[]
}>()
</script>
<template>
  <div class="flex flex-col gap-4">
    <PlaythroughCard
      v-for="playthrough in playthroughs"
      :key="playthrough.timestamp"
      :playthrough
    />
  </div>
</template>
