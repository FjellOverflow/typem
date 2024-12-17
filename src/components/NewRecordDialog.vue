<script setup lang="ts">
import { formatSeconds } from '@/plugins/util'
import { type IRun } from '@/types'
import { PartyPopperIcon } from 'lucide-vue-next'

const newRecordModal = useTemplateRef('newRecordModal')

const oldBestRun = ref<IRun>()
const newBestRun = ref<IRun>()

const improvement = computed(() => {
  if (!oldBestRun.value || !newBestRun.value) return 0
  return oldBestRun.value?.seconds - newBestRun.value?.seconds
})

function open(newRun: IRun, oldRun: IRun) {
  oldBestRun.value = oldRun
  newBestRun.value = newRun

  newRecordModal.value?.showModal()
}

defineExpose({ open })
</script>
<template>
  <dialog ref="newRecordModal" class="modal">
    <div class="modal-box border rounded-lg">
      <div class="text-4xl flex gap-4">
        <PartyPopperIcon :size="40" /> New record: {{ formatSeconds(newBestRun?.seconds || 0) }}
      </div>
      <div class="text-xl mt-4 flex flex-col gap-2">
        <div>
          You beat your previous record from
          {{ new Date(oldBestRun?.timestamp || '').toLocaleDateString() }} by
          {{ formatSeconds(improvement) }}.
        </div>
      </div>
      <div class="modal-action">
        <form method="dialog">
          <button class="btn btn-outline">Close</button>
        </form>
      </div>
    </div>
  </dialog>
</template>
