<script setup lang="ts">
import { availableLocales, type IAvailableLocale } from '@/types/localization'
import FlagIcon from '../FlagIcon.vue'

const { locale } = useI18n({ useScope: 'global' })
const storedLocale = useStorage('locale', locale)

function onClickChangeLocale(newLocale: string) {
  storedLocale.value = newLocale
}
</script>
<template>
  <div v-if="availableLocales.length > 1" class="dropdown" id="localeSwitcher">
    <div tabindex="0" role="button" class="btn btn-ghost btn-sm sm:btn-md sm:text-xl">
      <FlagIcon :locale="locale as IAvailableLocale" />
    </div>
    <ul
      tabindex="0"
      class="sm:text-lg dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
    >
      <li v-for="availableLocale in availableLocales" :key="availableLocale">
        <a @click="onClickChangeLocale(availableLocale)">
          <FlagIcon :locale="availableLocale" />
          {{ $t('English', {}, { locale: availableLocale }) }}
        </a>
      </li>
    </ul>
  </div>
</template>
