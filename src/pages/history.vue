<script setup lang="ts">
import { useTitle } from '@vueuse/core'

const { t } = useI18n()
useTitle(`${t('history.pageTitle')} - Typem`)

import { ListCheckIcon, ListIcon, TrophyIcon } from 'lucide-vue-next'
</script>
<template>
  <div class="grid grid-cols-3 gap-4 mb-4">
    <NavLink to="/history/all"><ListIcon /> {{ $t('history.nav.all') }} </NavLink>
    <NavLink to="/history/finished"><ListCheckIcon /> {{ $t('history.nav.finished') }} </NavLink>
    <NavLink to="/history/records"><TrophyIcon /> {{ $t('history.nav.records') }} </NavLink>
  </div>
  <RouterView />
</template>
