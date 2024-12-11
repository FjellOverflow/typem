import type { IRun } from '@/types'
import { useStorage } from '@vueuse/core'

export function useHistory() {
  const allRuns = useStorage<IRun[]>('history', [])

  return { allRuns }
}

export function useListHistory(listId: string) {
  const { allRuns } = useHistory()

  const allListRuns = computed(() =>
    allRuns.value.filter((run) => run.finished && run.listId === listId),
  )

  const bestListRun = computed(() => {
    const finishedRuns = allListRuns.value.filter((run) => run.finished)

    if (finishedRuns.length === 0) return

    return finishedRuns.reduce((min, current) =>
      min && min.seconds < current.seconds ? min : current,
    )
  })

  return {
    allRuns,
    allListRuns,
    bestListRun,
  }
}
