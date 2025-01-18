<script setup lang="ts">
import { usePlaythroughs } from '@/composables/playthroughs'
import { groupByDate } from '@/plugins/util'
import { EllipsisIcon } from 'lucide-vue-next'

const { allPlaythroughs } = usePlaythroughs()

const allFinishedPlaythroughs = computed(() => allPlaythroughs.value.filter((r) => r.finished))

const numberOfVisiblePlaythroughs = ref(10)

const groups = computed(() =>
  groupByDate(
    allFinishedPlaythroughs.value.slice(0, numberOfVisiblePlaythroughs.value).map((r) => ({
      ...r,
      date: new Date(r.timestamp),
    })),
  ),
)
</script>
<template>
  <DateGroup v-for="group in groups" :key="group.date.toISOString()" :date="group.date">
    <Runs :runs="group.items" />
  </DateGroup>

  <div class="p-8 flex justify-center">
    <button
      v-if="numberOfVisiblePlaythroughs < allPlaythroughs.length"
      @click="numberOfVisiblePlaythroughs += 10"
      class="btn btn-outline"
    >
      <EllipsisIcon />
      {{ $t('history.loadMore') }}
    </button>
  </div>
</template>
