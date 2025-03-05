<script setup lang="ts">
import { useCustomLists } from '@/composables/customLists'
import { useToasts } from '@/composables/toasts'
import { uploadJSON } from '@/plugins/util'

const confirmDialog = useTemplateRef('confirmDialog')

const uploadedFile = ref<File>()
const fileInputVisible = ref(true)

const { t } = useI18n()
const { sendToast } = useToasts()
const { importList } = useCustomLists()

function onUpload(e: Event) {
  uploadedFile.value = [...((e.target as HTMLInputElement).files || [])][0]
}

async function onConfirmUpload() {
  let success = false
  if (uploadedFile.value) {
    try {
      const result = await uploadJSON(uploadedFile.value)
      success = importList(result)
    } catch (e) {
      console.error(e)
    }
  }
  if (success) {
    sendToast({
      message: t('Import successful'),
      sentiment: 'alert-success',
    })
  } else {
    sendToast({
      message: t('Import failed'),
      sentiment: 'alert-error',
    })
  }

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
    <div class="modal-box border rounded-lg w-[85%] flex flex-col gap-4">
      <div class="sm:text-4xl text-3xl">
        {{ $t('Import custom list') }}
      </div>
      <div class="text-lg sm:text-xl">
        {{
          $t('You can upload a custom list that shows up among the built-in lists and is playable.')
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
