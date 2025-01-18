<script setup lang="ts">
const confirmDialog = useTemplateRef('confirmDialog')

defineEmits<{
  confirm: []
  cancel: []
}>()

withDefaults(
  defineProps<{
    showCancelBtn?: boolean
    sentiment?: 'error' | 'success'
  }>(),
  {
    showCancelBtn: true,
  },
)

defineExpose({ open: () => confirmDialog.value?.showModal() })
</script>
<template>
  <dialog ref="confirmDialog" class="modal">
    <div class="modal-box border rounded-lg w-xl flex flex-col gap-4">
      <div class="text-4xl">
        <slot name="title" />
      </div>
      <div class="text-xl">
        <slot name="body" />
      </div>
      <div class="modal-action">
        <form method="dialog">
          <div class="flex gap-4">
            <button v-if="showCancelBtn" class="btn btn-outline" @click="$emit('cancel')">
              {{ $t('dialog.cancel') }}
            </button>
            <button
              class="btn btn-outline"
              :class="sentiment ? `btn-${sentiment}` : ''"
              @click="$emit('confirm')"
            >
              {{ $t('dialog.confirm') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </dialog>
</template>
