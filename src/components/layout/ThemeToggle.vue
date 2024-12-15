<script setup lang="ts">
import { Sun, Moon } from 'lucide-vue-next'

const theme = useStorage('data-theme', 'dark')

function toggleTheme() {
  const newTheme = theme.value === 'dark' ? 'light' : 'dark'
  document.documentElement.setAttribute('data-theme', newTheme)
  theme.value = newTheme
}
</script>
<template>
  <button class="btn btn-ghost" @click="toggleTheme">
    <Sun v-if="theme === 'light'" />
    <Moon v-else />
  </button>
</template>
