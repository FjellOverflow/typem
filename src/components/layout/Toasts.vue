<script setup lang="ts">
import { useToasts } from '@/composables/toasts'

const { toasts } = useToasts()
</script>
<template>
  <div class="toast toast-top toast-end">
    <div v-for="toast in toasts" :key="toast.message" class="alert" :class="toast.sentiment">
      <span>{{ toast.message }}</span>
    </div>
  </div>
</template>
