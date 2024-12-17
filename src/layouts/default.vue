<script lang="ts">
import { useListsLoader } from '@/assets/lists/loader'
export { useListsLoader }
</script>

<script setup lang="ts">
import { Shuffle, List, Heart, CalendarClock } from 'lucide-vue-next'

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
          <NavLink to="/"><List /> All </NavLink>
        </li>
        <li>
          <NavLink :to="randomListUrl"> <Shuffle /> Random </NavLink>
        </li>
        <li>
          <NavLink to="/favorites"><Heart /> Favorites </NavLink>
        </li>
        <li>
          <NavLink to="/history" :active="route.name.startsWith('/history')">
            <CalendarClock /> History
          </NavLink>
        </li>
      </ul>
    </template>
    <template #end>
      <ThemeToggle />
    </template>
  </NavBar>
  <div class="mx-auto flex w-full max-w-[90%] flex-col justify-start md:max-w-3xl">
    <RouterView />
  </div>
</template>
