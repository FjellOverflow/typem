<script lang="ts">
import { useListsLoader } from '@/assets/lists/loader'
export { useListsLoader }
</script>

<script setup lang="ts">
const { data: lists } = useListsLoader()
</script>
<template>
  <Lists :lists />
</template>
