<script lang="ts">
import { useListsLoader } from '@/plugins/listLoader'
import { useTitle } from '@vueuse/core'
export { useListsLoader }
</script>

<script setup lang="ts">
const { data: lists } = useListsLoader()

useTitle('Typem')
</script>
<template>
  <ListsList :lists />
</template>
