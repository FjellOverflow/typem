<script setup lang="ts">
import { useTitle } from '@vueuse/core'

const { t } = useI18n()
useTitle(`${t('History')} - Typem`)

import { ListCheckIcon, ListIcon, TrophyIcon } from 'lucide-vue-next'
</script>
<template>
  <div class="grid grid-cols-3 gap-4 mb-4">
    <NavLink to="/history/all"><ListIcon /> {{ $t('All') }} </NavLink>
    <NavLink to="/history/finished"><ListCheckIcon /> {{ $t('Finished') }} </NavLink>
    <NavLink to="/history/records"><TrophyIcon /> {{ $t('Records') }} </NavLink>
  </div>
  <RouterView />
</template>
