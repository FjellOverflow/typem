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

function closeDropdown() {
  ;(document.activeElement as HTMLElement | null)?.blur()
}
</script>

<template>
  <Toasts />
  <NavBar>
    <template #center>
      <ul class="menu menu-horizontal gap-2 xl:flex hidden">
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
      <AppInfoPopUp ref="appInfoPopUp" />
      <div class="xl:block hidden">
        <ThemeToggle />
        <button @click="appInfoPopUp?.open()" class="btn btn-ghost">
          <InfoIcon />
        </button>
      </div>

      <MobileDropdown class="justify-end flex xl:hidden">
        <ul class="menu menu-vertical gap-2" @click="closeDropdown">
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
        <div class="flex gap-2">
          <ThemeToggle />
          <button @click="appInfoPopUp?.open()" class="btn btn-ghost">
            <InfoIcon />
          </button>
        </div>
      </MobileDropdown>
    </template>
  </NavBar>
  <div class="mx-auto flex w-full max-w-[90%] flex-col justify-start md:max-w-3xl">
    <RouterView />
  </div>
</template>
