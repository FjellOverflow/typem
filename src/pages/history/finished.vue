<script setup lang="ts">
import { useHistory } from '@/composables/history'
import type { IRun } from '@/types'
import { EllipsisIcon } from 'lucide-vue-next'

const { allRuns } = useHistory()
const allFinishedRuns = computed(() => allRuns.value.filter((r) => r.finished))

const numberOfVisibleRuns = ref(10)

const visibleRuns = computed(() => allFinishedRuns.value.slice(0, numberOfVisibleRuns.value))

const groups = computed(() => {
  const dateMap = new Map<string, { date: Date; runs: IRun[] }>()

  visibleRuns.value.forEach((run) => {
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
  <div
    v-for="group in groups"
    :key="group.date.toISOString()"
    class="collapse collapse-arrow overflow-visible"
  >
    <input type="checkbox" checked="true" />
    <span class="collapse-title text-2xl opacity-50 pt-6 pb-2 px-0">{{
      group.date.toDateString()
    }}</span>

    <div class="collapse-content p-0">
      <Runs :runs="group.runs" />
    </div>
  </div>

  <div class="p-8 mb-8 flex justify-center">
    <button
      v-if="numberOfVisibleRuns < allFinishedRuns.length"
      @click="numberOfVisibleRuns += 10"
      class="btn btn-outline"
    >
      <EllipsisIcon />
      Show more
    </button>
  </div>
</template>
