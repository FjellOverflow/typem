<script setup lang="ts">
const popUp = useTemplateRef('popUp')

defineExpose({ open: () => popUp.value?.showModal() })
</script>
<template>
  <dialog ref="popUp" class="modal">
    <div class="modal-box border rounded-lg w-xl flex flex-col gap-4">
      <div class="text-4xl">
        <slot name="title" />
      </div>
      <div class="text-xl">
        <slot name="body" />
      </div>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button>close</button>
    </form>
  </dialog>
</template>
