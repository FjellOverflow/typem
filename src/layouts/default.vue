<script lang="ts">
import { useListsLoader } from '@/plugins/listLoader'
export { useListsLoader }
</script>

<script setup lang="ts">
import { ShuffleIcon, ListIcon, HeartIcon, CalendarClockIcon, InfoIcon } from 'lucide-vue-next'

const appInfoDialog = useTemplateRef('appInfoDialog')

const { data: lists } = useListsLoader()
const route = useRoute()

const randomListUrl = computed(() => {
  const currentRoute = route.path
  let randomUrl = currentRoute

  do {
    const { id } = lists.value[Math.floor(Math.random() * lists.value.length)]
    randomUrl = `/play/${id}`
  } while (randomUrl === currentRoute)

  return randomUrl
})
</script>

<template>
  <NavBar>
    <template #center>
      <ul class="menu menu-horizontal gap-2">
        <li>
          <NavLink to="/"><ListIcon /> All </NavLink>
        </li>
        <li>
          <NavLink :to="randomListUrl"> <ShuffleIcon /> Random </NavLink>
        </li>
        <li>
          <NavLink to="/favorites"><HeartIcon /> Favorites </NavLink>
        </li>
        <li>
          <NavLink to="/history" :active="route.name.startsWith('/history')">
            <CalendarClockIcon /> History
          </NavLink>
        </li>
      </ul>
    </template>
    <template #end>
      <ThemeToggle />
      <button @click="appInfoDialog?.open()" class="btn btn-ghost">
        <InfoIcon />
      </button>
      <AppInfoDialog ref="appInfoDialog" />
    </template>
  </NavBar>
  <div class="mx-auto flex w-full max-w-[90%] flex-col justify-start md:max-w-3xl">
    <RouterView />
  </div>
</template>
