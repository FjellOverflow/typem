<script lang="ts">
import { useListsLoader } from '@/plugins/listLoader'
import { usePlaythroughs } from '@/composables/playthroughs'
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
</script>
<template>
  <Runs :runs="records" />
</template>
