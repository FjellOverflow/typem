<script setup lang="ts">
const modelValue = defineModel({ default: true })
</script>
<template>
  <div class="collapse collapse-arrow border rounded-md overflow-visible">
    <input type="checkbox" v-model="modelValue" />
    <div class="collapse-title text-xl font-medium">
      <slot name="title" />
    </div>
    <div class="collapse-content">
      <slot name="content" />
    </div>
  </div>
</template>
