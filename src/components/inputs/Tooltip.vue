<script setup lang="ts">
import { CircleHelpIcon, LightbulbIcon } from 'lucide-vue-next'

withDefaults(
  defineProps<{
    label: string
    type?: 'help' | 'hint'
    size?: number
  }>(),
  {
    type: 'help',
    size: 20,
  },
)
</script>
<template>
  <div class="flex">
    <div>
      <slot />
    </div>
    <div class="flex flex-col justify-center">
      <div class="tooltip tooltip-bottom" :data-tip="label">
        <LightbulbIcon
          v-if="type === 'hint'"
          :size
          class="hover:opacity-100 opacity-25 ease-in-out transition-opacity duration-200"
        />
        <CircleHelpIcon
          v-else
          :size
          class="hover:opacity-100 opacity-25 ease-in-out transition-opacity duration-200"
        />
      </div>
    </div>
  </div>
</template>
