<script setup lang="ts">
import { useTitle } from '@vueuse/core'

const { t } = useI18n()
useTitle(`${t('History')} - Typem`)

import { ListCheckIcon, ListIcon, TrophyIcon } from 'lucide-vue-next'
</script>
<template>
  <div class="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-4">
    <NavLink to="/history/all"><ListIcon class="w-4 sm:w-6" /> {{ $t('All') }} </NavLink>
    <NavLink to="/history/finished"
      ><ListCheckIcon class="w-4 sm:w-6" /> {{ $t('Finished') }}
    </NavLink>
    <NavLink to="/history/records"><TrophyIcon class="w-4 sm:w-6" /> {{ $t('Records') }} </NavLink>
  </div>
  <RouterView />
</template>
