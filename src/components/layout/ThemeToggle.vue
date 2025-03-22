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
  <button id="themeToggle" class="btn btn-ghost btn-sm sm:btn-md" @click="toggleTheme">
    <SunIcon class="w-4 sm:w-6" v-if="theme === 'light'" />
    <MoonIcon class="w-4 sm:w-6" v-else />
  </button>
</template>
