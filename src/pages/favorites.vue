<script lang="ts">
import { useListsLoader } from '@/plugins/listLoader'
export { useListsLoader }
</script>

<script setup lang="ts">
import { useTitle } from '@vueuse/core'
import { useFavorites } from '@/composables/favorites'

const { t } = useI18n()
useTitle(`${t('favorites.pageTitle')} - Typem`)

const { data: lists } = useListsLoader()

const { isFavorite } = useFavorites()

const favorites = computed(() => lists.value.filter(isFavorite))
</script>
<template>
  <Lists :lists="favorites" :no-data-text="$t('favorites.noData')" />
</template>
