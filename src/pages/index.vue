<script lang="ts">
import { usePresetsLoader } from '@/assets/presets/loader'
export { usePresetsLoader }
</script>

<script setup lang="ts">
const { data: presets } = usePresetsLoader()
</script>
<template>
  <Lists :lists="presets" />
</template>
