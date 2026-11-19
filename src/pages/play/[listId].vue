<script lang="ts">
import { useListLoader } from '@/plugins/listLoader'
import { useHotkey } from '@/composables/hotkey'
import { useLocalize } from '@/composables/localize'
export { useListLoader }
</script>

<script setup lang="ts">
import { formatDuration } from '@/plugins/util'
import type { ICheckableListItem } from '@/types'
import { useTitle } from '@vueuse/core'
import { useRound } from '@/composables/round'
import { PartyPopperIcon, RotateCwIcon, ThumbsUpIcon } from '@lucide/vue'

const { localize } = useLocalize()
const { data: list } = useListLoader()

const pageTitle = useTitle(`${localize.value(list.value.meta.name)} - Typem`)
window.scrollTo(0, 0)

watch(list, (newList) => {
  pageTitle.value = `${localize.value(newList.meta.name)} - Typem`
  window.scrollTo(0, 0)
})

const inputField = useTemplateRef('inputField')
const settingsCard = useTemplateRef('settingsCard')
const itemsCard = useTemplateRef('itemsCard')
const newRecordDialog = useTemplateRef('newRecordDialog')

const {
  phase,
  canStart,
  hasEnded,
  settings,
  items,
  seconds,
  remainingPauses,
  init,
  start,
  pause,
  type,
  stop,
  reset,
  restart,
} = useRound(list, (newRecord, beatenRecord) =>
  newRecordDialog.value?.open(newRecord, beatenRecord),
)

const input = ref('')
const newMatch = ref<ICheckableListItem | undefined>()

watch(hasEnded, (ended) => ended && itemsCard.value?.open())

useHotkey('q', () => restart() && prepareRound())

function onInit() {
  if (init()) prepareRound()
}

function prepareRound() {
  input.value = ''

  nextTick().then(() => {
    document
      .querySelector(`#list-preview-${list.value.id}`)
      ?.dispatchEvent(new CustomEvent('oninit'))
    settingsCard.value?.close()
    itemsCard.value?.open()
    inputField.value?.focus()
  })
}

function onInput() {
  const matchedItem = type(input.value)

  if (!matchedItem) return

  input.value = ''
  newMatch.value = matchedItem
  setTimeout(() => (newMatch.value = undefined), 1000)

  inputField.value?.dispatchEvent(new CustomEvent('onmatch'))
}
</script>
<template>
  <NewRecordDialog ref="newRecordDialog" />
  <div class="grid grid-cols-2 sm:grid-cols-5 items-center gap-4">
    <ListPreviewCard :list class="col-span-2 sm:col-span-5" :show-details="phase === 'idle'">
      <template #action>
        <button
          id="initButton"
          v-if="phase === 'idle'"
          class="btn btn-outline btn-primary sm:text-xl font-medium"
          @click="onInit"
        >
          <ThumbsUpIcon /> {{ $t("I'm ready!") }}
        </button>
        <button
          v-if="hasEnded"
          class="btn btn-outline btn-primary text-xl font-medium"
          @click="reset"
        >
          <RotateCwIcon /> {{ $t('Restart') }}
        </button>
      </template>
    </ListPreviewCard>

    <template v-if="phase !== 'idle'">
      <template v-if="phase !== 'finished'">
        <HintCard
          v-if="phase !== 'stopped' && settings.showHints"
          :items
          :can-cycle="!settings.requireOrder"
          class="col-span-2 sm:col-span-5"
          @move="inputField?.focus()"
        />
        <TimerCard
          id="timerCard"
          ref="timerCard"
          :seconds
          :numberOfPauses="remainingPauses"
          :isStopped="phase === 'stopped'"
          :isRunning="phase === 'running'"
          @start="start"
          @pause="pause"
          @stop="stop"
          class="col-span-2"
        />
        <input
          id="inputField"
          ref="inputField"
          v-model="input"
          :disabled="phase === 'stopped'"
          type="text"
          :placeholder="canStart ? $t('Type to start') : undefined"
          class="input input-bordered w-full h-16 text-2xl col-span-2 sm:col-span-3"
          :class="{
            'input-primary': phase !== 'stopped',
            'input-success': newMatch,
            'hidden sm:block': phase === 'stopped',
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
                duration: formatDuration(seconds),
              })
            }}
          </span>
        </div>
      </div>
    </template>

    <ItemsTable
      id="itemsCard"
      ref="itemsCard"
      :items
      :highlighted="newMatch"
      :isStopped="hasEnded"
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
