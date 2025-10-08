<script setup lang="ts">
const modelValue = defineModel<boolean>({ default: false })

defineOptions({
  inheritAttrs: false,
})

defineProps<{
  label: string
}>()
</script>
<template>
  <div class="form-control max-w-fit">
    <label class="label p-2 cursor-pointer">
      <input
        v-model="modelValue"
        v-bind="$attrs"
        type="checkbox"
        :checked="modelValue"
        class="toggle"
      />
      <span v-if="label" class="label-text ml-2 text-wrap">{{ label }}</span>
    </label>
  </div>
</template>
