<script setup lang="ts">
import { formatDuration } from '@/plugins/util'
import { type IListPlaythrough } from '@/types'
import { PartyPopperIcon } from '@lucide/vue'

const { locale } = useI18n()

const confirmDialog = useTemplateRef('confirmDialog')

const beatenRecord = ref<IListPlaythrough>()
const newRecord = ref<IListPlaythrough>()

const improvement = computed(() => {
  if (!beatenRecord.value || !newRecord.value) return 0
  return beatenRecord.value?.seconds - newRecord.value?.seconds
})

function open(record: IListPlaythrough, previousRecord: IListPlaythrough) {
  beatenRecord.value = previousRecord
  newRecord.value = record

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
            duration: formatDuration(newRecord?.seconds || 0),
          })
        }}
      </div>
    </template>
    <template #body>
      {{
        $t('You beat your previous record from {date} by {seconds}.', {
          date: new Date(beatenRecord?.timestamp || '').toLocaleDateString(locale),
          seconds: formatDuration(improvement),
        })
      }}
    </template>
  </ConfirmDialog>
</template>
