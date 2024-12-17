<script lang="ts">
import { useListsLoader } from '@/assets/lists/loader'
export { useListsLoader }
</script>

<script setup lang="ts">
import { useTitle } from '@vueuse/core'
import { useFavorites } from '@/composables/favorites'

useTitle('Favorites - Typem')

const { data: lists } = useListsLoader()

const { isFavorite } = useFavorites()

const favorites = computed(() => lists.value.filter(isFavorite))
</script>
<template>
  <Lists :lists="favorites" no-data-text="No list marked favorite yet" />
</template>
