<script lang="ts">
import { usePresetsLoader } from '@/assets/presets/loader'
import router from '@/plugins/router'
export { usePresetsLoader }
</script>

<script setup lang="ts">
import { useStorage } from '@vueuse/core'
import { Shuffle, List, Sun, Moon, Heart } from 'lucide-vue-next'
import logo from '@/assets/logo.svg'

const { data: presets } = usePresetsLoader()

const theme = useStorage('data-theme', 'dark')
const route = useRoute()

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
  <div class="navbar rounded-lg border px-4 my-4 w-3/4 mx-auto">
    <div class="navbar-start flex gap-2 items-center">
      <img :src="logo" class="h-14" />
    </div>
    <div class="navbar-center">
      <ul class="menu menu-horizontal gap-2">
        <li>
          <RouterLink
            to="/"
            class="btn text-2xl"
            :class="[route.name === '/' ? 'btn-outline' : 'btn-ghost']"
            ><List /> All</RouterLink
          >
        </li>
        <li>
          <RouterLink
            to="/favorites"
            class="btn text-2xl"
            :class="[route.name === '/favorites' ? 'btn-outline' : 'btn-ghost']"
          >
            <Heart /> Favorites
          </RouterLink>
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
