<script lang="ts">
import { useListLoader } from '@/plugins/listLoader'
import { useListPlaythroughs, usePlaythroughs } from '@/composables/playthroughs'
import { useHotkey } from '@/composables/hotkey'
export { useListLoader }
</script>

<script setup lang="ts">
import { formatDuration } from '@/plugins/util'
import type { ICheckableListItem } from '@/types'
import { useTitle } from '@vueuse/core'
import { useChecking } from '@/composables/checking'
import { useTimer } from '@/composables/timer'
import { PartyPopperIcon, RotateCwIcon, ThumbsUpIcon } from 'lucide-vue-next'

const { data: list } = useListLoader()

const pageTitle = useTitle(`${list.value.meta.name} - Typem`)
window.scrollTo(0, 0)

watch(list, (newList) => {
  reset()
  pageTitle.value = `${newList.meta.name} - Typem`
  settings.value = { ...newList.settings }
  window.scrollTo(0, 0)
})

const inputField = useTemplateRef('inputField')
const settingsCard = useTemplateRef('settingsCard')
const itemsCard = useTemplateRef('itemsCard')
const newRecordDialog = useTemplateRef('newRecordDialog')

const { allPlaythroughs } = usePlaythroughs()
const { bestListPlaythrough } = useListPlaythroughs(list.value.id)

useHotkey('q', () => {
  if (isInitialized.value && !isDone.value) {
    onStop()
    reset()
    init()
  }
})

const settings = ref({ ...list.value.settings })
const checker = ref()
const timer = ref()

const isInitialized = ref(false)
const isRunning = ref(false)
const isStopped = ref(false)
const isDone = ref(false)

const input = ref('')
const newMatch = ref<ICheckableListItem | undefined>()

function init() {
  settings.value.allowOverride = false

  timer.value = useTimer(settings.value.numberOfPauses)
  checker.value = useChecking(list.value.items, settings.value, () => {
    isDone.value = true
    onStop()
  })

  isInitialized.value = true

  setTimeout(() => {
    document
      .querySelector(`#list-preview-${list.value.id}`)
      ?.dispatchEvent(new CustomEvent('oninit'))
    settingsCard.value?.close()
    itemsCard.value?.open()
    inputField.value?.focus()
  }, 5)
}

function reset() {
  settings.value.allowOverride = list.value.settings.allowOverride
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

  const numberOfMatches = checker.value?.items.filter(
    (item: ICheckableListItem) => item.checked,
  ).length

  if (numberOfMatches === 0) return

  const newPlaythrough = {
    listId: list.value.id,
    seconds: timer.value.seconds,
    finished: isDone.value,
    numberOfMatches,
    timestamp: new Date().toISOString(),
  }
  if (
    newPlaythrough.finished &&
    bestListPlaythrough.value?.finished &&
    newPlaythrough.seconds < bestListPlaythrough.value.seconds
  )
    newRecordDialog.value?.open(newPlaythrough, bestListPlaythrough.value)

  allPlaythroughs.value.push(newPlaythrough)
}

function onInput() {
  if (!isRunning.value) onStart()

  const matchedItem = checker.value?.check(input.value)

  if (matchedItem) {
    input.value = ''
    newMatch.value = matchedItem
    setTimeout(() => (newMatch.value = undefined), 1000)

    inputField.value?.dispatchEvent(new CustomEvent('onmatch'))
  }
}
</script>
<template>
  <NewRecordDialog ref="newRecordDialog" />
  <div class="grid grid-cols-2 sm:grid-cols-5 items-center gap-4">
    <ListPreviewCard :list class="col-span-2 sm:col-span-5" :show-details="!isInitialized">
      <template #action>
        <button
          id="initButton"
          v-if="!isInitialized"
          class="btn btn-outline btn-primary sm:text-xl font-medium"
          @click="init"
        >
          <ThumbsUpIcon /> {{ $t("I'm ready!") }}
        </button>
        <button
          v-if="isInitialized && isStopped"
          class="btn btn-outline btn-primary text-xl font-medium"
          @click="reset"
        >
          <RotateCwIcon /> {{ $t('Restart') }}
        </button>
      </template>
    </ListPreviewCard>

    <template v-if="isInitialized">
      <template v-if="!isDone">
        <HintCard
          v-if="!isStopped && settings.showHints"
          :items="checker?.items || []"
          :can-cycle="!settings.requireOrder"
          class="col-span-2 sm:col-span-5"
          @move="inputField?.focus()"
        />
        <TimerCard
          id="timerCard"
          ref="timerCard"
          :seconds="timer?.seconds || 0"
          :numberOfPauses="timer?.remainingPauses || 0"
          :isStopped
          :isRunning
          @start="onStart"
          @pause="onPause"
          @stop="onStop"
          class="col-span-2"
        />
        <input
          id="inputField"
          ref="inputField"
          v-model="input"
          :disabled="isStopped"
          type="text"
          :placeholder="!isRunning && !isStopped ? $t('Type to start') : undefined"
          class="input input-bordered w-full h-16 text-2xl col-span-2 sm:col-span-3"
          :class="{
            'input-primary': !isStopped,
            'input-success': newMatch,
            'hidden sm:block': isStopped,
          }"
          @input="onInput"
        />
      </template>

      <div v-else class="border border-success rounded-md col-span-2 sm:col-span-5 p-4">
        <div class="flex sm:gap-4 gap-2 items-end text-success">
          <PartyPopperIcon :size="36" />
          <span class="text-2xl sm:text-3xl">{{ $t('You did it!') }}</span>

          <span class="sm:text-xl text-lg">
            {{
              $t('You named all {number} items in {duration}.', {
                number: list.items.length,
                duration: formatDuration(timer.seconds),
              })
            }}
          </span>
        </div>
      </div>
    </template>

    <ItemsTable
      id="itemsCard"
      ref="itemsCard"
      :items="checker?.items || list.items"
      :highlighted="newMatch"
      :isStopped
      class="col-span-2 sm:col-span-5"
    />

    <SettingsCard
      id="settingsCard"
      ref="settingsCard"
      v-model="settings"
      class="col-span-2 sm:col-span-5"
    />
  </div>
</template>
