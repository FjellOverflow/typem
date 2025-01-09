import type { IRun } from '@/types'
import { useStorage } from '@vueuse/core'

function sortRunsByMatchesAndTime(run1: IRun, run2: IRun) {
  if (run1.numberOfMatches !== run2.numberOfMatches)
    return run2.numberOfMatches - run1.numberOfMatches

  return run1.seconds - run2.seconds
}

export function useHistory() {
  const allRuns = useStorage<IRun[]>('history', [])

  function getBestRun(listId: string) {
    if (allRuns.value.length === 0) return

    const listRuns = [...allRuns.value.filter((run) => run.listId === listId)]
    return listRuns.sort(sortRunsByMatchesAndTime)[0]
  }

  return { allRuns, getBestRun }
}

export function useListHistory(listId: string) {
  const { allRuns } = useHistory()

  const allListRuns = computed(() => allRuns.value.filter((run) => run.listId === listId))

  const bestListRun = computed(() => allListRuns.value.sort(sortRunsByMatchesAndTime)[0])

  return {
    allRuns,
    allListRuns,
    bestListRun,
  }
}
