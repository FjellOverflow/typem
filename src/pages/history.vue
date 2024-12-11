<script setup lang="ts">
import { useTitle } from '@vueuse/core'

useTitle('History - Typem')

import { List, Trophy } from 'lucide-vue-next'

const route = useRoute()
</script>
<template>
  <div class="grid grid-cols-2 gap-4 mb-4">
    <RouterLink
      to="/history/all"
      class="btn text-2xl"
      :class="[route.name === '/history/all' ? 'btn-outline' : 'btn-ghost']"
      ><List /> All</RouterLink
    >
    <RouterLink
      to="/history/records"
      class="btn text-2xl"
      :class="[route.name === '/history/records' ? 'btn-outline' : 'btn-ghost']"
      ><Trophy /> Records</RouterLink
    >
  </div>
  <RouterView />
</template>
