<script setup lang="ts">
const i18n = useI18n({ useScope: 'global' })
const locale = useStorage('locale', i18n.locale)

function onClickChangeLocale(newLocale: string) {
  locale.value = newLocale
}
</script>
<template>
  <div v-if="i18n.availableLocales.length > 1" class="dropdown">
    <div tabindex="0" role="button" class="btn btn-ghost btn-sm sm:btn-md text-xl">
      {{ $t('🇬🇧') }}
    </div>
    <ul
      tabindex="0"
      class="text-lg dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
    >
      <li v-for="availableLocale in i18n.availableLocales" :key="availableLocale">
        <a @click="onClickChangeLocale(availableLocale)">{{
          $t('🇬🇧 English', {}, { locale: availableLocale })
        }}</a>
      </li>
    </ul>
  </div>
</template>
