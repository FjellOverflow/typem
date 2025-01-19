<script setup lang="ts">
import { formatDuration } from '@/plugins/util'
import { type IListPlaythrough } from '@/types'
import { PartyPopperIcon } from 'lucide-vue-next'

const confirmDialog = useTemplateRef('confirmDialog')

const oldBestRun = ref<IListPlaythrough>()
const newBestRun = ref<IListPlaythrough>()

const improvement = computed(() => {
  if (!oldBestRun.value || !newBestRun.value) return 0
  return oldBestRun.value?.seconds - newBestRun.value?.seconds
})

function open(newRun: IListPlaythrough, oldRun: IListPlaythrough) {
  oldBestRun.value = oldRun
  newBestRun.value = newRun

  confirmDialog.value?.open()
}

defineExpose({ open })
</script>
<template>
  <ConfirmDialog ref="confirmDialog" :show-cancel-btn="false">
    <template #title>
      <div class="flex gap-4">
        <PartyPopperIcon :size="40" />
        {{ $t('New record: {duration}', { duration: formatDuration(newBestRun?.seconds || 0) }) }}
      </div>
    </template>
    <template #body>
      {{
        $t('You beat your previous record from {date} by {seconds}.', {
          date: new Date(oldBestRun?.timestamp || '').toLocaleDateString(),
          seconds: formatDuration(improvement),
        })
      }}
    </template>
  </ConfirmDialog>
</template>
