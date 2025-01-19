<script setup lang="ts">
import type { IListPlaythrough } from '@/types'

const props = defineProps<{
  playthroughs: IListPlaythrough[]
}>()

const sortedPlaythroughs = computed(() => {
  const playthroughs = [...props.playthroughs]

  playthroughs.sort(
    ({ timestamp: t1 }, { timestamp: t2 }) => new Date(t2).getTime() - new Date(t1).getTime(),
  )

  return playthroughs
})
</script>
<template>
  <div class="flex flex-col gap-4">
    <PlaythroughCard
      v-for="playthrough in sortedPlaythroughs"
      :key="playthrough.timestamp"
      :playthrough
    />
  </div>
</template>
