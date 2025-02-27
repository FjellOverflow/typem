<script setup lang="ts">
import type { IList } from '@/types'
import { FileCodeIcon, ExternalLinkIcon } from 'lucide-vue-next'

const popUp = useTemplateRef('popUp')

defineExpose({
  open: () => {
    showRaw.value = false
    return popUp.value?.open()
  },
})

defineProps<{
  list: IList
}>()

const showRaw = ref(false)
</script>
<template>
  <PopUp ref="popUp">
    <div
      class="tooltip tooltip-bottom absolute right-4 top-4"
      :data-tip="showRaw ? $t('Hide raw') : $t('Show raw')"
    >
      <button
        @click="showRaw = !showRaw"
        class="btn btn-ghost"
        :class="{ 'text-primary': showRaw }"
      >
        <FileCodeIcon />
      </button>
    </div>

    <template #title>
      {{ list.meta.name }}
    </template>

    <template v-if="showRaw" #body>
      <div class="bg-neutral rounded-lg p-4">
        <code class="text-sm break-all">{{ JSON.stringify(list, null, 2) }}</code>
      </div>
    </template>

    <template v-else #body>
      <div class="flex flex-col gap-2">
        <span class="opacity-40 text-xl"> {{ list.meta.tags.map((t) => `#${t}`).join(', ') }}</span>
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
