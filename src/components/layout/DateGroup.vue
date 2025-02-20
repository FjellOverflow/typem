<script setup lang="ts">
defineProps<{
  date: Date
}>()
</script>
<template>
  <div class="collapse collapse-arrow overflow-visible">
    <input type="checkbox" checked="true" />
    <span class="collapse-title text-2xl opacity-50 pt-2 sm:pt-6 pb-2 px-0">{{
      date.toDateString()
    }}</span>

    <div class="collapse-content p-0">
      <slot />
    </div>
  </div>
</template>
