<script setup lang="ts">
import logo from '@/assets/logo.svg'
</script>
<template>
  <div class="navbar rounded-lg border px-4 my-4 w-3/4 mx-auto">
    <div class="navbar-start flex gap-2 items-center">
      <img :src="logo" class="h-14" />
    </div>
    <div class="navbar-center">
      <slot name="center" />
    </div>
    <div class="navbar-end">
      <slot name="end" />
    </div>
  </div>
</template>
