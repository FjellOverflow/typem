<script setup lang="ts">
import type { ISettings } from '@/types'
import { Lock, Settings } from 'lucide-vue-next'

const isOpen = ref(true)
const settings = defineModel<ISettings>({ required: true })

const numberOfPauses = computed(() =>
  settings.value.numberOfPauses >= 0 ? settings.value.numberOfPauses : 6,
)

function onUpdateAllowPauses(newVal: boolean) {
  settings.value.numberOfPauses = newVal ? -1 : 0
}

function onUpdateNumberOfPauses(newVal: number) {
  if (newVal > 5) {
    settings.value.numberOfPauses = -1
  } else {
    settings.value.numberOfPauses = newVal
  }
}

defineExpose({
  open: () => (isOpen.value = true),
  close: () => (isOpen.value = false),
})
</script>
<template>
  <div class="collapse collapse-arrow border rounded-lg overflow-visible">
    <input type="checkbox" v-model="isOpen" />
    <div class="collapse-title text-xl font-medium flex gap-2 items-center">
      <Lock v-if="!settings.allowOverride" />
      <Settings v-else />
      {{ $t('settings.label') }}
    </div>
    <div class="collapse-content">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <Tooltip :label="$t('settings.showHints.tooltip')">
            <Toggle
              v-model="settings.showHints"
              :label="$t('settings.showHints.label')"
              :disabled="!settings.allowOverride"
            />
          </Tooltip>
          <Tooltip :label="$t('settings.allowPauses.tooltip')">
            <Toggle
              :model-value="settings.numberOfPauses !== 0"
              :label="$t('settings.allowPauses.label')"
              :disabled="!settings.allowOverride"
              @update:model-value="onUpdateAllowPauses"
            />
          </Tooltip>
          <div class="w-2/3 p-2" v-if="settings.numberOfPauses !== 0">
            <Range
              :disabled="!settings.allowOverride"
              :model-value="numberOfPauses"
              :min="1"
              :max="6"
              :labels="['1', '2', '3', '4', '5', '∞']"
              @update:model-value="onUpdateNumberOfPauses"
            />
          </div>
        </div>
        <div>
          <Tooltip :label="$t('settings.requireWhitespaces.tooltip')">
            <Checkbox
              v-model="settings.requireWhitespaces"
              :label="$t('settings.requireWhitespaces.label')"
              :disabled="!settings.allowOverride"
            />
          </Tooltip>
          <Tooltip :label="$t('settings.requireCapitalization.tooltip')">
            <Checkbox
              v-model="settings.requireCapitalization"
              :label="$t('settings.requireCapitalization.label')"
              :disabled="!settings.allowOverride"
            />
          </Tooltip>
          <Tooltip :label="$t('settings.requireOrder.tooltip')">
            <Checkbox
              v-model="settings.requireOrder"
              :label="$t('settings.requireOrder.label')"
              :disabled="!settings.allowOverride"
            />
          </Tooltip>
        </div>
      </div>
    </div>
  </div>
</template>
