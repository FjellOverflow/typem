<script lang="ts">
import { useListsLoader } from '@/plugins/listLoader'
import { usePlaythroughs } from '@/composables/playthroughs'
import { groupByDate } from '@/plugins/util'
export { useListsLoader }
</script>

<script setup lang="ts">
import { useTitle } from '@vueuse/core'

const { t } = useI18n()
useTitle(`${t('history.records.pageTitle')} - Typem`)

const { data: lists } = useListsLoader()

const { getBestListPlaythrough } = usePlaythroughs()

const records = computed(() =>
  [...new Set(lists.value.map((list) => list.id))]
    .map((listId) => getBestListPlaythrough(listId))
    .filter((p) => !!p),
)

const groups = computed(() => groupByDate(records.value))
</script>
<template>
  <DateGroup v-for="group in groups" :key="group.date.toISOString()" :date="group.date">
    <Runs :runs="group.items" />
  </DateGroup>
</template>
