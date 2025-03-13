<script setup lang="ts">
const confirmDialog = useTemplateRef('confirmDialog')

defineEmits<{
  confirm: []
  cancel: []
}>()

withDefaults(
  defineProps<{
    showCancelBtn?: boolean
    sentiment?: 'btn-error' | 'btn-success'
  }>(),
  {
    showCancelBtn: true,
  },
)

defineExpose({ open: () => confirmDialog.value?.showModal() })
</script>
<template>
  <dialog ref="confirmDialog" class="modal">
    <div class="modal-box border rounded-md w-[85%] flex flex-col gap-4">
      <div class="sm:text-4xl text-3xl">
        <slot name="title" />
      </div>
      <div class="text-lg sm:text-xl">
        <slot name="body" />
      </div>
      <div class="modal-action">
        <form method="dialog">
          <div class="flex gap-4">
            <button v-if="showCancelBtn" class="btn btn-outline" @click="$emit('cancel')">
              {{ $t('Cancel') }}
            </button>
            <button
              class="btn btn-outline"
              :class="sentiment ? sentiment : ''"
              @click="$emit('confirm')"
            >
              {{ $t('Confirm') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </dialog>
</template>
