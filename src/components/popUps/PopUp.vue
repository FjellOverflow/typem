<script setup lang="ts">
const popUp = useTemplateRef('popUp')

defineExpose({ open: () => popUp.value?.showModal() })
</script>
<template>
  <dialog ref="popUp" class="modal">
    <div class="modal-box border rounded-lg w-[80%] flex flex-col gap-2 sm:gap-4">
      <slot />

      <div class="sm:text-4xl text-3xl w-[85%]">
        <slot name="title" />
      </div>

      <div class="sm:text-xl text-lg">
        <slot name="body" />
      </div>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button>close</button>
    </form>
  </dialog>
</template>
