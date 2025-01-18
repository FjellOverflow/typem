<script setup lang="ts">
import type { IListPlaythrough } from '@/types'

const props = defineProps<{
  runs: IListPlaythrough[]
}>()

const sortedRuns = computed(() => {
  const runs = [...props.runs]

  runs.sort((r1, r2) => new Date(r2.timestamp).getTime() - new Date(r1.timestamp).getTime())

  return runs
})
</script>
<template>
  <div class="flex flex-col gap-4">
    <Run v-for="run in sortedRuns" :key="run.timestamp" :run />
  </div>
</template>
