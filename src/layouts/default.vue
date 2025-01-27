<script lang="ts">
import { useListsLoader } from '@/plugins/listLoader'
import AppInfoPopUp from '@/components/popUps/AppInfoPopUp.vue'
export { useListsLoader }
</script>

<script setup lang="ts">
import { ShuffleIcon, ListIcon, HeartIcon, CalendarClockIcon, InfoIcon } from 'lucide-vue-next'

const appInfoPopUp = useTemplateRef('appInfoPopUp')

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
          <NavLink to="/"><ListIcon /> {{ $t('All') }} </NavLink>
        </li>
        <li>
          <NavLink :to="randomListUrl"> <ShuffleIcon /> {{ $t('Random') }} </NavLink>
        </li>
        <li>
          <NavLink to="/favorites"><HeartIcon /> {{ $t('Favorites') }} </NavLink>
        </li>
        <li>
          <NavLink to="/history" :active="route.name.startsWith('/history')">
            <CalendarClockIcon /> {{ $t('History') }}
          </NavLink>
        </li>
      </ul>
    </template>
    <template #end>
      <ThemeToggle />
      <button @click="appInfoPopUp?.open()" class="btn btn-ghost">
        <InfoIcon />
      </button>
      <AppInfoPopUp ref="appInfoPopUp" />
    </template>
  </NavBar>
  <div class="mx-auto flex w-full max-w-[90%] flex-col justify-start md:max-w-3xl">
    <RouterView />
  </div>
</template>
