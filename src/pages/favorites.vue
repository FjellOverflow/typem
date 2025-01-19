<script lang="ts">
import { useListsLoader } from '@/plugins/listLoader'
export { useListsLoader }
</script>

<script setup lang="ts">
import { useTitle } from '@vueuse/core'
import { useFavorites } from '@/composables/favorites'

const { t } = useI18n()
useTitle(`${t('Favorites')} - Typem`)

const { data: lists } = useListsLoader()

const { isFavorite } = useFavorites()

const favorites = computed(() => lists.value.filter(isFavorite))
</script>
<template>
  <ListsList :lists="favorites" :no-data-text="$t('No lists marked favorite yet.')" />
</template>
