<script lang="ts">
import { useListsLoader } from '@/plugins/listLoader'
export { useListsLoader }
</script>

<script setup lang="ts">
const { data: lists } = useListsLoader()
</script>
<template>
  <ListsList :lists />
</template>
