<script setup lang="ts">
import type { IList } from '@/types'
import { ExternalLinkIcon } from 'lucide-vue-next'

const popUp = useTemplateRef('popUp')

defineExpose({ open: () => popUp.value?.open() })

defineProps<{
  list: IList
}>()
</script>
<template>
  <PopUp ref="popUp">
    <template #title>
      {{ list.meta.name }}
    </template>
    <template #body>
      <div class="flex flex-col gap-2">
        <span class="opacity-40 text-xl"> ({{ list.id }}) </span>
        <span class="text-xl sm:text-2xl">{{ list.meta.description }}</span>
        <div class="flex sm:flex-row flex-col gap-3 justify-between mt-4 text-base">
          <span>
            {{ $t('Created by') }} <i>{{ list.meta.author }}</i>
          </span>
          <span>
            {{ $t('Last update') }}:
            <i>{{ new Date(list.meta.lastUpdated).toLocaleDateString() }}</i>
          </span>
          <a
            class="flex gap-1 underline"
            target="_blank"
            norefferer
            noopener
            :href="list.meta.source"
          >
            <i>{{ $t('Source') }}</i>
            <ExternalLinkIcon :size="14" />
          </a>
        </div>
      </div>
    </template>
  </PopUp>
</template>
