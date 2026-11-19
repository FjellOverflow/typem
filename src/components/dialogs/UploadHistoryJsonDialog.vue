<script setup lang="ts">
import { usePlaythroughs } from '@/composables/playthroughs'
import { useToasts } from '@/composables/toasts'
import { uploadJSON } from '@/plugins/util'

const confirmDialog = useTemplateRef('confirmDialog')

const uploadedFile = ref<File>()
const fileInputVisible = ref(true)

const { t } = useI18n()
const { sendToast } = useToasts()
const { importHistory } = usePlaythroughs()

function onUpload(e: Event) {
  uploadedFile.value = [...((e.target as HTMLInputElement).files || [])][0]
}

async function importUploadedFile() {
  if (!uploadedFile.value) return undefined

  try {
    return importHistory(await uploadJSON(uploadedFile.value))
  } catch (e) {
    console.error(e)
    return undefined
  }
}

async function onConfirmUpload() {
  const addedCount = await importUploadedFile()

  if (addedCount === undefined) sendToast({ message: t('Import failed'), sentiment: 'alert-error' })
  else if (addedCount === 0)
    sendToast({ message: t('No new playthroughs to import'), sentiment: 'alert-info' })
  else sendToast({ message: t('Import successful'), sentiment: 'alert-success' })

  onClose()
}

function onClose() {
  uploadedFile.value = undefined
  fileInputVisible.value = false
  setTimeout(() => (fileInputVisible.value = true), 200)
}

defineExpose({ open: () => confirmDialog.value?.showModal() })
</script>
<template>
  <dialog ref="confirmDialog" class="modal">
    <div class="modal-box border rounded-md w-[85%] flex flex-col gap-4">
      <div class="sm:text-4xl text-3xl">
        {{ $t('Import history?') }}
      </div>
      <div class="text-lg sm:text-xl">
        {{
          $t(
            'Imported playthroughs are added to your history. Playthroughs that are already in your history are skipped.',
          )
        }}
      </div>
      <div class="mt-4">
        <input
          v-if="fileInputVisible"
          type="file"
          class="file-input file-input-primary w-full"
          accept="application/json"
          :onchange="onUpload"
        />
      </div>
      <div class="modal-action">
        <form method="dialog">
          <div class="flex gap-4">
            <button class="btn btn-outline" @click="onClose">
              {{ $t('Cancel') }}
            </button>
            <button
              class="btn btn-outline btn-primary"
              @click="onConfirmUpload"
              :class="{ 'btn-disabled': !uploadedFile }"
            >
              {{ $t('Upload') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </dialog>
</template>
