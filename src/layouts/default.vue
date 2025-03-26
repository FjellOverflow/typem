<script lang="ts">
import { useListsLoader } from '@/plugins/listLoader'
export { useListsLoader }
</script>

<script setup lang="ts">
import {
  ShuffleIcon,
  ListIcon,
  HeartIcon,
  CalendarClockIcon,
  InfoIcon,
  ArrowUp,
  HelpCircleIcon,
} from 'lucide-vue-next'
import AppInfoPopUp from '@/components/popUps/AppInfoPopUp.vue'
import { useHelp } from '@/composables/help'

const appInfoPopUp = useTemplateRef('appInfoPopUp')

const { data: lists } = useListsLoader()
const route = useRoute()
const { openHelp } = useHelp()

const scrollPosition = ref(0)

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

function scrollToTop() {
  document.body.scrollTop = 0
  document.documentElement.scrollTop = 0
}

document.addEventListener('scroll', () => {
  scrollPosition.value = document.body.scrollTop || document.documentElement.scrollTop
})
</script>

<template>
  <Toasts />
  <div class="fixed! right-2 bottom-2 sm:right-4 sm:bottom-4 md:right-8 md:bottom-8">
    <div v-if="scrollPosition > 100" class="tooltip tooltip-top" :data-tip="$t('Back to top')">
      <button @click="scrollToTop" class="btn btn-ghost">
        <ArrowUp />
      </button>
    </div>
  </div>
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
      <div class="xl:flex hidden gap-2">
        <ThemeToggle />
        <button id="appInfoPopUpBtn" @click="appInfoPopUp?.open()" class="btn btn-ghost">
          <InfoIcon />
        </button>
        <button id="openHelpBtn" @click="openHelp" class="btn btn-ghost">
          <HelpCircleIcon />
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
          <button
            id="appInfoPopUpBtn"
            @click="appInfoPopUp?.open()"
            class="btn btn-ghost btn-sm sm:btn-md"
          >
            <InfoIcon class="w-4 sm:w-6" />
          </button>
          <button id="openHelpBtn" @click="openHelp" class="btn btn-ghost btn-sm sm:btn-md">
            <HelpCircleIcon class="w-4 sm:w-6" />
          </button>
        </div>
      </MobileDropdown>
    </template>
  </NavBar>
  <div id="main" class="mx-auto flex w-full max-w-[90%] flex-col justify-start md:max-w-3xl">
    <RouterView />
  </div>
</template>
