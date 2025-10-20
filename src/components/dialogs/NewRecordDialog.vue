<script setup lang="ts">
import { formatDuration } from '@/plugins/util'
import { type IListPlaythrough } from '@/types'
import { PartyPopperIcon } from 'lucide-vue-next'

const { locale } = useI18n()

const confirmDialog = useTemplateRef('confirmDialog')

const oldBestPlaythrough = ref<IListPlaythrough>()
const newBestPlaythrough = ref<IListPlaythrough>()

const improvement = computed(() => {
  if (!oldBestPlaythrough.value || !newBestPlaythrough.value) return 0
  return oldBestPlaythrough.value?.seconds - newBestPlaythrough.value?.seconds
})

function open(newPlaythrough: IListPlaythrough, oldPlaythrough: IListPlaythrough) {
  oldBestPlaythrough.value = oldPlaythrough
  newBestPlaythrough.value = newPlaythrough

  confirmDialog.value?.open()
}

defineExpose({ open })
</script>
<template>
  <ConfirmDialog ref="confirmDialog" :show-cancel-btn="false">
    <template #title>
      <div class="flex gap-4">
        <PartyPopperIcon class="h-8 sm:h-10" />
        {{
          $t('New record: {duration}', {
            duration: formatDuration(newBestPlaythrough?.seconds || 0),
          })
        }}
      </div>
    </template>
    <template #body>
      {{
        $t('You beat your previous record from {date} by {seconds}.', {
          date: new Date(oldBestPlaythrough?.timestamp || '').toLocaleDateString(locale),
          seconds: formatDuration(improvement),
        })
      }}
    </template>
  </ConfirmDialog>
</template>
