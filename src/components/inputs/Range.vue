<script lang="ts" setup>
const modelValue = defineModel<number>({ required: true })

const modelProxy = ref<number | string>(modelValue.value)

defineProps<{
  labels: string[]
}>()

function onUpdate() {
  modelValue.value = parseInt(`${modelProxy.value}`)
}
</script>
<template>
  <div>
    <input
      type="range"
      v-bind="$attrs"
      v-model="modelProxy"
      class="range"
      step="1"
      @input="onUpdate"
    />
    <div class="flex w-full justify-between px-2 text-xs">
      <span v-for="(label, key) in labels" :key>{{ label }}</span>
    </div>
  </div>
</template>
