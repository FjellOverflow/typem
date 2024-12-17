<script setup lang="ts">
import { SunIcon, MoonIcon } from 'lucide-vue-next'

const theme = useStorage('data-theme', 'dark')

function toggleTheme() {
  const newTheme = theme.value === 'dark' ? 'light' : 'dark'
  document.documentElement.setAttribute('data-theme', newTheme)
  theme.value = newTheme
}
</script>
<template>
  <button class="btn btn-ghost" @click="toggleTheme">
    <SunIcon v-if="theme === 'light'" />
    <MoonIcon v-else />
  </button>
</template>
