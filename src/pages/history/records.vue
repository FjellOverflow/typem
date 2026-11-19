<script lang="ts">
import { useListsLoader } from '@/plugins/listLoader'
export { useListsLoader }
</script>

<script setup lang="ts">
import { useTitle } from '@vueuse/core'
import { usePlaythroughs } from '@/composables/playthroughs'

const { t } = useI18n()
useTitle(`${t('Records')} - Typem`)

const { data: lists } = useListsLoader()
const { records } = usePlaythroughs()
</script>
<template>
  <PlaythroughHistory :playthroughs="records" :lists />
</template>
