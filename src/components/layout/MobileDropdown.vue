<script setup lang="ts">
import { MenuIcon } from 'lucide-vue-next'
</script>
<template>
  <div class="dropdown dropdown-bottom dropdown-end">
    <div tabindex="0" class="btn btn-ghost">
      <MenuIcon />
    </div>
    <div tabindex="0" class="dropdown-content bg-base-100 z-50 rounded border p-4 w-44">
      <slot />
    </div>
  </div>
</template>
