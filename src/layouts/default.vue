<script lang="ts">
import { usePresetsLoader } from '@/assets/presets/loader'
import router from '@/plugins/router'
export { usePresetsLoader }
</script>

<script setup lang="ts">
import { useStorage } from '@vueuse/core'
import { Shuffle, List, Sun, Moon } from 'lucide-vue-next'

const { data: presets } = usePresetsLoader()

const theme = useStorage('data-theme', 'dark')

function toggleTheme() {
  const newTheme = theme.value === 'dark' ? 'light' : 'dark'
  document.documentElement.setAttribute('data-theme', newTheme)
  theme.value = newTheme
}

function getRandomPreset() {
  const currentRoute = router.currentRoute.value.path
  let randomUrl = currentRoute

  while (randomUrl === currentRoute) {
    randomUrl = `/play/${presets.value[Math.floor(Math.random() * presets.value.length)].id}`
  }

  return randomUrl
}
</script>

<template>
  <div class="navbar rounded-lg border px-8 m-4 w-auto">
    <div class="navbar-start flex gap-2 items-center">
      <span class="text-4xl font-black">Typem</span>
    </div>
    <div class="navbar-center">
      <ul class="menu menu-horizontal gap-2">
        <li>
          <RouterLink to="/" class="btn btn-ghost text-2xl"><List /> All</RouterLink>
        </li>
        <li>
          <RouterLink :to="getRandomPreset()" class="btn btn-ghost text-2xl">
            <Shuffle /> Random
          </RouterLink>
        </li>
      </ul>
    </div>
    <div class="navbar-end">
      <button class="btn btn-ghost" @click="toggleTheme">
        <Sun v-if="theme === 'light'" /><Moon v-else />
      </button>
    </div>
  </div>
  <div class="mx-auto flex w-full max-w-[90%] flex-col justify-start md:max-w-3xl">
    <RouterView />
  </div>
</template>
