<script setup lang="ts">
import { useHistory } from '@/composables/history'
import type { IRun } from '@/types'

const { allRuns } = useHistory()

const groups = computed(() => {
  const dateMap = new Map<string, { date: Date; runs: IRun[] }>()

  allRuns.value.forEach((run) => {
    const date = new Date(run.timestamp)
    const dateStr = date.toDateString()

    if (!dateMap.has(dateStr)) dateMap.set(dateStr, { date, runs: [run] })
    else dateMap.get(dateStr)?.runs.push(run)
  })

  dateMap.forEach((group) =>
    group.runs.sort(
      (r1, r2) => new Date(r2.timestamp).getTime() - new Date(r1.timestamp).getTime(),
    ),
  )

  return [...dateMap.values()].sort(({ date: d1 }, { date: d2 }) => d2.getTime() - d1.getTime())
})
</script>
<template>
  <template v-for="group in groups" :key="group.date">
    <span class="text-2xl opacity-50 mt-6 mb-2">{{ group.date.toDateString() }}</span>
    <Runs :runs="group.runs" />
  </template>
</template>
