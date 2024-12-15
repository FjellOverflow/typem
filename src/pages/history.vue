<script setup lang="ts">
import { useTitle } from '@vueuse/core'

useTitle('History - Typem')

import { List, Trophy } from 'lucide-vue-next'
</script>
<template>
  <div class="grid grid-cols-2 gap-4 mb-4">
    <NavLink to="/history/all"><List /> All </NavLink>
    <NavLink to="/history/records"><Trophy /> Records </NavLink>
  </div>
  <RouterView />
</template>
