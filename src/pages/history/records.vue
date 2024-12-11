<script lang="ts">
import { usePresetsLoader } from '@/assets/presets/loader'
export { usePresetsLoader }
</script>
<script setup lang="ts">
import { useHistory } from '@/composables/history'

const { data: presets } = usePresetsLoader()

const { getBestRun } = useHistory()

const records = computed(() => {
  const listIds = [...new Set(presets.value.map((list) => list.id))]

  return listIds.map((listId) => getBestRun(listId)).filter((runOrUndefind) => !!runOrUndefind)
})
</script>
<template>
  <Runs :runs="records" />
</template>
