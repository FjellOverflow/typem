<script setup lang="ts">
import { useTitle } from '@vueuse/core'

useTitle('History - Typem')

import { ListCheckIcon, ListIcon, TrophyIcon } from 'lucide-vue-next'
</script>
<template>
  <div class="grid grid-cols-3 gap-4 mb-4">
    <NavLink to="/history/all"><ListIcon /> All </NavLink>
    <NavLink to="/history/finished"><ListCheckIcon /> Finished </NavLink>
    <NavLink to="/history/records"><TrophyIcon /> Records </NavLink>
  </div>
  <RouterView />
</template>
