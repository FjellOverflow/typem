<script lang="ts">
import { useListsLoader } from '@/plugins/listLoader'
export { useListsLoader }
</script>

<script setup lang="ts">
import { usePlaythroughs } from '@/composables/playthroughs'

const { data: lists } = useListsLoader()
const { playthroughs } = usePlaythroughs()

const finishedPlaythroughs = computed(() => playthroughs.value.filter((p) => p.finished))
</script>
<template>
  <PlaythroughHistory :playthroughs="finishedPlaythroughs" :lists />
</template>
