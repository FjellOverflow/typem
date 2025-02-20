<script setup lang="ts">
import type { RouterLinkProps } from 'vue-router'

defineProps<{
  to: RouterLinkProps['to']
  active?: boolean
}>()

const route = useRoute()
</script>
<template>
  <RouterLink
    :to
    class="btn sm:text-2xl text-base px-1 sm:px-4"
    :class="[route.name === to || active ? 'btn-outline' : 'btn-ghost']"
  >
    <slot />
  </RouterLink>
</template>
