<script lang="ts">
import { useListsLoader } from '@/assets/lists/loader'
export { useListsLoader }
</script>

<script setup lang="ts">
import { useHistory } from '@/composables/history'

const { data: lists } = useListsLoader()

const { getBestRun } = useHistory()

const records = computed(() => {
  const listIds = [...new Set(lists.value.map((list) => list.id))]

  return listIds.map((listId) => getBestRun(listId)).filter((runOrUndefind) => !!runOrUndefind)
})
</script>
<template>
  <Runs :runs="records" />
</template>
