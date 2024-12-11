<script setup lang="ts">
import { useHistory } from '@/composables/history'

const { allRuns } = useHistory()
</script>
<template>
  <Runs :runs="allRuns" />
</template>
