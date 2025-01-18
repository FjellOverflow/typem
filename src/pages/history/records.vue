<script lang="ts">
import { useListsLoader } from '@/plugins/listLoader'
import { usePlaythroughs } from '@/composables/playthroughs'
export { useListsLoader }
</script>

<script setup lang="ts">
import { useTitle } from '@vueuse/core'

useTitle('Records - Typem')

const { data: lists } = useListsLoader()

const { getBestListPlaythrough } = usePlaythroughs()

const records = computed(() => {
  const listIds = [...new Set(lists.value.map((list) => list.id))]

  return listIds
    .map((listId) => getBestListPlaythrough(listId))
    .filter((runOrUndefind) => !!runOrUndefind)
})
</script>
<template>
  <Runs :runs="records" />
</template>
