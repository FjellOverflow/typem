<script setup lang="ts">
import { formatDuration } from '@/plugins/util'
import { type IListPlaythrough } from '@/types'
import { PartyPopperIcon } from '@lucide/vue'

const { locale } = useI18n()

const confirmDialog = useTemplateRef('confirmDialog')

const records = ref<{ newRecord: IListPlaythrough; beatenRecord: IListPlaythrough }>()

const improvement = computed(() => {
  if (!records.value) return 0
  return records.value.beatenRecord.seconds - records.value.newRecord.seconds
})

function open(newRecord: IListPlaythrough, beatenRecord: IListPlaythrough) {
  records.value = { newRecord, beatenRecord }

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
            duration: formatDuration(records?.newRecord.seconds || 0),
          })
        }}
      </div>
    </template>
    <template #body>
      {{
        $t('You beat your previous record from {date} by {seconds}.', {
          date: new Date(records?.beatenRecord.timestamp || '').toLocaleDateString(locale),
          seconds: formatDuration(improvement),
        })
      }}
    </template>
  </ConfirmDialog>
</template>
