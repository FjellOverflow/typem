<script lang="ts">
import { usePresetLoader } from '@/assets/presets/loader'
import { formatSeconds } from '@/plugins/util'
import type { IItem } from '@/types'
import { useTitle } from '@vueuse/core'
import { useHistory, useListHistory } from '@/composables/history'
export { usePresetLoader }
</script>

<script setup lang="ts">
import { useChecking, useOrderedChecking } from '@/composables/checking'
import { useTimer } from '@/composables/timer'
import { PartyPopper, RotateCw, ThumbsUp } from 'lucide-vue-next'

const { data: preset } = usePresetLoader()

const pageTitle = useTitle(`${preset.value.meta.name} - Typem`)

watch(preset, (newPreset) => {
  reset()
  pageTitle.value = `${newPreset.meta.name} - Typem`
  settings.value = { ...newPreset.settings }
  window.scrollTo(0, 0)
})

const inputField = useTemplateRef('inputField')
const settingsCard = useTemplateRef('settingsCard')
const itemsCard = useTemplateRef('itemsCard')
const newRecordDialog = useTemplateRef('newRecordDialog')

const { allRuns } = useHistory()
const { bestListRun } = useListHistory(preset.value.id)

const settings = ref({ ...preset.value.settings })
const checker = ref()
const timer = ref()

const isInitialized = ref(false)
const isRunning = ref(false)
const isStopped = ref(false)
const isDone = ref(false)

const input = ref('')
const newMatch = ref<IItem | undefined>()

function init() {
  settings.value.allowOverride = false

  timer.value = useTimer(settings.value.numberOfPauses)
  checker.value = (settings.value.requireOrder ? useOrderedChecking : useChecking)(
    preset.value.items,
    settings.value,
    () => {
      isDone.value = true
      onStop()
    },
  )

  isInitialized.value = true

  setTimeout(() => {
    settingsCard.value?.close()
    itemsCard.value?.open()
    inputField.value?.focus()
  }, 5)
}

function reset() {
  settings.value.allowOverride = preset.value.settings.allowOverride
  checker.value = undefined
  timer.value = undefined
  input.value = ''

  isStopped.value = false
  isInitialized.value = false
  isRunning.value = false
  isDone.value = false
}

function onStart() {
  timer.value?.start()
  isRunning.value = true
}

function onPause() {
  timer.value?.pause()
  isRunning.value = false
}

function onStop() {
  timer.value?.stop()

  isRunning.value = false
  isStopped.value = true

  itemsCard.value?.open()

  const numberOfMatches = checker.value?.items.filter((item) => item.checked).length

  if (numberOfMatches === 0) return

  const newRun = {
    listId: preset.value.id,
    seconds: timer.value.seconds,
    finished: isDone.value,
    numberOfMatches,
    timestamp: new Date().toISOString(),
  }
  if (newRun.finished && bestListRun.value && newRun.seconds < bestListRun.value.seconds)
    newRecordDialog.value?.open(newRun, bestListRun.value)

  allRuns.value.push(newRun)
}

function onInput() {
  if (!isRunning.value) onStart()

  const matchedItem = checker.value?.check(input.value)

  if (matchedItem) {
    input.value = ''
    newMatch.value = matchedItem
    setTimeout(() => (newMatch.value = undefined), 1000)
  }
}
</script>
<template>
  <NewRecordDialog ref="newRecordDialog" />
  <div class="grid grid-cols-5 items-center gap-4 py-4">
    <ListPreview :list="preset" class="col-span-5" :show-details="!isInitialized">
      <template #action>
        <button
          v-if="!isInitialized"
          class="btn btn-outline btn-primary text-xl font-medium"
          @click="init"
        >
          <ThumbsUp /> {{ $t('starter.label') }}
        </button>
        <button
          v-if="isInitialized && isStopped"
          class="btn btn-outline btn-primary text-xl font-medium"
          @click="reset"
        >
          <RotateCw /> {{ $t('restart.label') }}
        </button>
      </template>
    </ListPreview>

    <template v-if="isInitialized">
      <template v-if="!isDone">
        <Hint
          v-if="!isStopped && settings.showHints"
          :items="checker?.items || []"
          :can-cycle="!settings.requireOrder"
          class="col-span-5"
        />
        <Timer
          ref="timerCard"
          :seconds="timer?.seconds || 0"
          :isStopped
          :isRunning
          :numberOfPauses="timer?.remainingPauses || 0"
          @start="onStart"
          @pause="onPause"
          @stop="onStop"
          class="col-span-2"
        />
        <input
          ref="inputField"
          v-model="input"
          :disabled="isStopped"
          type="text"
          :placeholder="!isRunning && !isStopped ? 'Type to start' : undefined"
          class="input input-bordered w-full h-16 text-2xl col-span-3"
          :class="{ 'input-primary': !isStopped, 'input-success': newMatch }"
          @input="onInput"
        />
      </template>

      <div v-else class="border border-success rounded-lg col-span-5 p-4">
        <div class="flex gap-4 items-end text-success">
          <PartyPopper :size="36" />
          <span class="text-3xl">You did it!</span>
          <span class="text-xl"
            >You named all {{ preset.items.length }} items in
            {{ formatSeconds(timer.seconds) }}.</span
          >
        </div>
      </div>
    </template>

    <Items
      ref="itemsCard"
      :items="checker?.items || preset.items"
      :isStopped
      class="col-span-5"
      :highlighted="newMatch"
    />

    <Settings v-model="settings" ref="settingsCard" class="col-span-5" />
  </div>
</template>
