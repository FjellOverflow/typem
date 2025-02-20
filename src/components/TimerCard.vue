<script setup lang="ts">
import { formatDuration } from '@/plugins/util'
import { PauseIcon, PlayIcon, SquareIcon } from 'lucide-vue-next'

const props = defineProps<{
  isRunning: boolean
  seconds: number
  numberOfPauses: number
  isStopped?: boolean
}>()

defineEmits<{
  start: []
  pause: []
  stop: []
}>()

const displayTime = computed(() => formatDuration(props.seconds))

const isStoppable = computed(
  () => (props.numberOfPauses === 0 || !props.isRunning) && props.seconds > 0,
)
</script>
<template>
  <div class="border border-yellow rounded-lg grid grid-cols-2 p-4 gap-2">
    <div class="col-span-2 text-3xl sm:text-4xl font-medium flex items-center justify-items-center">
      <span>{{ displayTime }}</span>
    </div>
    <template v-if="!isStopped">
      <button
        v-if="isRunning"
        :disabled="numberOfPauses === 0"
        class="btn btn-outline"
        @click="$emit('pause')"
      >
        <PauseIcon /> {{ $t('Pause') }}
        {{ numberOfPauses >= 0 ? `(${numberOfPauses})` : '' }}
      </button>
      <button v-else class="btn btn-outline" @click="$emit('start')">
        <PlayIcon /> {{ $t(seconds === 0 ? 'Start' : 'Resume') }}
      </button>
      <button v-if="isStoppable" class="btn btn-outline" @click="$emit('stop')">
        <SquareIcon /> {{ $t('Give up') }}
      </button>
    </template>
  </div>
</template>
