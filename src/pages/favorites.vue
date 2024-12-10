<script lang="ts">
import { usePresetsLoader } from '@/assets/presets/loader'
import { useFavorites } from '@/composables/favorites'
import { useTitle } from '@vueuse/core'
export { usePresetsLoader }
</script>

<script setup lang="ts">
useTitle('Favorites - Typem')

const { data: presets } = usePresetsLoader()

const { isFavorite } = useFavorites()

const favorites = computed(() => presets.value.filter(isFavorite))
</script>
<template>
  <Lists :lists="favorites" no-data-text="No list marked favorite yet" />
</template>
