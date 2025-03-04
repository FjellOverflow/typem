<script setup lang="ts">
import { usePlaythroughs } from '@/composables/playthroughs'
import { uploadJSON } from '@/plugins/util'

const confirmDialog = useTemplateRef('confirmDialog')

const uploadedFile = ref<File>()
const fileInputVisible = ref(true)

const { importPlaythroughs } = usePlaythroughs()

function onUpload(e: Event) {
  uploadedFile.value = [...((e.target as HTMLInputElement).files || [])][0]
}

async function onConfirmUpload() {
  if (uploadedFile.value) {
    try {
      const result = await uploadJSON(uploadedFile.value)
      importPlaythroughs(result)
    } catch (e) {
      console.error(e)
    }
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
        {{ $t('Overwrite history?') }}
      </div>
      <div class="text-lg sm:text-xl">
        {{
          $t(
            'This action replaces ALL past playthroughs. Once new playthroughs are imported, the old playthroughs can not be recovered.',
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
