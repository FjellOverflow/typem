import type { Ref } from 'vue'
import type { ICheckableListItem, IList, IListPlaythrough, ISettings } from '@/types'
import { toCheckableItems, useChecking } from '@/composables/checking'
import { usePlaythroughs } from '@/composables/playthroughs'
import { useTimer } from '@/composables/timer'

const startablePhases = ['ready', 'paused'] as const
const activePhases = [...startablePhases, 'running'] as const
const endPhases = ['stopped', 'finished'] as const

export const RoundPhaseOptions = ['idle', ...activePhases, ...endPhases] as const
export type RoundPhase = (typeof RoundPhaseOptions)[number]
type EndPhase = (typeof endPhases)[number]

export function useRound(
  list: Ref<IList>,
  onNewRecord: (newRecord: IListPlaythrough, beatenRecord: IListPlaythrough) => void,
) {
  const { addPlaythrough } = usePlaythroughs()

  const phase = ref<RoundPhase>('idle')
  const settings = ref<ISettings>({ ...list.value.settings })
  const timer = shallowRef<ReturnType<typeof useTimer>>()
  const checker = shallowRef<ReturnType<typeof useChecking>>()

  const isPhaseIn = (phases: readonly RoundPhase[]) => phases.includes(phase.value)
  const canStart = computed(() => isPhaseIn(startablePhases))
  const hasEnded = computed(() => isPhaseIn(endPhases))

  const items = computed<ICheckableListItem[]>(
    () => checker.value?.items.value ?? toCheckableItems(list.value.items),
  )
  const numberOfMatches = computed(() => items.value.filter((item) => item.checked).length)
  const seconds = computed(() => timer.value?.seconds.value ?? 0)
  const remainingPauses = computed(() => timer.value?.remainingPauses.value ?? 0)

  function init() {
    if (phase.value !== 'idle') return false

    settings.value.allowOverride = false
    timer.value = useTimer(settings.value.numberOfPauses)
    checker.value = useChecking(list.value.items, settings.value, () => end('finished'))
    phase.value = 'ready'

    return true
  }

  function start() {
    if (!canStart.value) return false

    timer.value?.start()
    phase.value = 'running'

    return true
  }

  function pause() {
    if (phase.value !== 'running' || !timer.value?.pause()) return false

    phase.value = 'paused'

    return true
  }

  function check(input: string) {
    start()

    if (phase.value !== 'running') return undefined

    return checker.value?.check(input)
  }

  function stop() {
    if (!isPhaseIn(activePhases)) return false

    end('stopped')

    return true
  }

  function end(endPhase: EndPhase) {
    timer.value?.stop()
    phase.value = endPhase
    savePlaythrough()
  }

  function savePlaythrough() {
    if (numberOfMatches.value === 0) return

    const playthrough = {
      listId: list.value.id,
      seconds: seconds.value,
      finished: phase.value === 'finished',
      numberOfMatches: numberOfMatches.value,
      timestamp: new Date().toISOString(),
    }
    const { beatenRecord } = addPlaythrough(playthrough)

    if (beatenRecord) onNewRecord(playthrough, beatenRecord)
  }

  function reset() {
    timer.value?.stop()
    timer.value = undefined
    checker.value = undefined
    settings.value.allowOverride = list.value.settings.allowOverride
    phase.value = 'idle'
  }

  function restart() {
    if (phase.value === 'idle' || phase.value === 'finished') return false

    stop()
    reset()

    return init()
  }

  watch(list, (newList) => {
    reset()
    settings.value = { ...newList.settings }
  })

  onScopeDispose(() => timer.value?.stop())

  return {
    phase: readonly(phase),
    canStart,
    hasEnded,
    settings,
    items,
    seconds,
    remainingPauses,
    init,
    start,
    pause,
    check,
    stop,
    reset,
    restart,
  }
}
