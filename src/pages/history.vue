<script setup lang="ts">
import { useHistory } from '@/composables/history'

const { history } = useHistory()
</script>
<template>
  <ul>
    <li v-for="run in history" :key="run.timestamp">{{ run }}</li>
  </ul>
</template>
