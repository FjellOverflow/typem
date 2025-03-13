<script setup lang="ts">
const confirmDialog = useTemplateRef('confirmDialog')
defineEmits<{
  confirm: []
}>()

defineExpose({ open: () => confirmDialog.value?.open() })
</script>
<template>
  <ConfirmDialog ref="confirmDialog" @confirm="$emit('confirm')" sentiment="btn-error">
    <template #title> {{ $t('Are you sure?') }} </template>
    <template #body>
      {{ $t('This action removes ALL custom lists. Once remoevd, they can not be recovered.') }}
    </template>
  </ConfirmDialog>
</template>
