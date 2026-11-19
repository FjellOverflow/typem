<script setup lang="ts">
import type { SortDirection } from '@/types'
import { ArrowDownNarrowWideIcon, ArrowDownWideNarrowIcon } from '@lucide/vue'

const direction = defineModel<SortDirection>({ required: true })

function toggle() {
  direction.value = direction.value === 'asc' ? 'desc' : 'asc'
}
</script>
<template>
  <div
    class="tooltip tooltip-bottom"
    :data-tip="direction === 'asc' ? $t('Sort ascending') : $t('Sort descending')"
  >
    <button class="btn btn-ghost" @click="toggle">
      <ArrowDownNarrowWideIcon v-if="direction === 'asc'" />
      <ArrowDownWideNarrowIcon v-else />
    </button>
  </div>
</template>
