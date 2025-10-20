<script setup lang="ts">
import type { IAvailableLocale } from '@/types/localization'

const IsoAlpha2Map = {
  de: 'de',
  en: 'gb',
  no: 'no',
}

const props = defineProps<{ locale: IAvailableLocale }>()

const isoAlpha2 = computed(() => IsoAlpha2Map[props.locale])
</script>
<template>
  <span :class="`fi fi-${isoAlpha2}`" />
</template>
