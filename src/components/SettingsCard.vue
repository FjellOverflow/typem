<script setup lang="ts">
import type { ISettings } from '@/types'
import { LockIcon, SettingsIcon } from 'lucide-vue-next'

const settings = defineModel<ISettings>({ required: true })

const isOpen = ref(true)

const numberOfPauses = computed(() =>
  settings.value.numberOfPauses >= 0 ? settings.value.numberOfPauses : 6,
)

function onUpdateAllowPauses(newVal: boolean | undefined) {
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
  isOpen,
  open: () => (isOpen.value = true),
  close: () => (isOpen.value = false),
})
</script>
<template>
  <CollapsibleBox v-model="isOpen">
    <template #title>
      <div class="flex gap-2 items-center">
        <LockIcon v-if="!settings.allowOverride" />
        <SettingsIcon v-else />
        {{ $t('Settings') }}
      </div>
    </template>
    <template #content>
      <div class="grid grid-cols-1 sm:grid-cols-2 sm:gap-4">
        <div>
          <Tooltip
            :label="
              $t(
                'Show the hint or question for the item. Example: What is the capital of Germany?.',
              )
            "
          >
            <Toggle
              v-model="settings.showHints"
              :label="$t('Show hints')"
              :disabled="!settings.allowOverride"
            />
          </Tooltip>
          <Tooltip
            :label="
              $t(
                'Allow pausing the timer during the quiz. If allowed, choose between 1 to 5 or a infinite number of pauses.',
              )
            "
          >
            <Toggle
              :model-value="settings.numberOfPauses !== 0"
              :label="$t('Allow pauses')"
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
          <Tooltip
            :label="
              $t(
                'If enabled, requires you to type out all whitespaces. If disabled, whitespaces can be omitted, for example BuenosAires matches Buenos Aires.',
              )
            "
          >
            <Checkbox
              v-model="settings.requireWhitespaces"
              :label="$t('Require whitespaces')"
              :disabled="!settings.allowOverride"
            />
          </Tooltip>
          <Tooltip
            :label="
              $t(
                'If enabled, requires you to use capital and lowercase letters. If disabled, capitalization is ignored, for example berlin matches Berlin.',
              )
            "
          >
            <Checkbox
              v-model="settings.requireCapitalization"
              :label="$t('Require proper capitalization')"
              :disabled="!settings.allowOverride"
            />
          </Tooltip>
          <Tooltip
            :label="$t('If enabled, requires you match the items in the same order as shown.')"
          >
            <Checkbox
              v-model="settings.requireOrder"
              :label="$t('Require right ordering')"
              :disabled="!settings.allowOverride"
            />
          </Tooltip>
          <Tooltip :label="$t('If enabled, will show items in randomized order.')">
            <Checkbox
              v-model="settings.shuffle"
              :label="$t('Shuffle items')"
              :disabled="!settings.allowOverride"
            />
          </Tooltip>
        </div>
      </div>
    </template>
  </CollapsibleBox>
</template>
