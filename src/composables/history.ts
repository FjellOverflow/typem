import type { IRun } from '@/types'
import { useStorage } from '@vueuse/core'

function sortRunsByMatchesAndSeconds(run1: IRun, run2: IRun) {
  if (run1.numberOfMatches !== run2.numberOfMatches)
    return run2.numberOfMatches - run1.numberOfMatches

  return run1.seconds - run2.seconds
}

function sortRunsByTimestamp({ timestamp: t1 }: IRun, { timestamp: t2 }: IRun) {
  const [d1, d2] = [new Date(t1), new Date(t2)]

  return d2.getTime() - d1.getTime()
}

export function useHistory() {
  const allRuns = useStorage<IRun[]>('history', [])

  allRuns.value.sort(sortRunsByTimestamp)

  function getBestRun(listId: string) {
    if (allRuns.value.length === 0) return

    const listRuns = [...allRuns.value.filter((run) => run.listId === listId)]
    return listRuns.sort(sortRunsByMatchesAndSeconds)[0]
  }

  function deleteRun(run: IRun) {
    const runIndex = allRuns.value.findIndex((r) => JSON.stringify(r) === JSON.stringify(run))

    if (runIndex > -1) allRuns.value.splice(runIndex, 1)
  }

  return { allRuns, getBestRun, deleteRun }
}

export function useListHistory(listId: string) {
  const { allRuns } = useHistory()

  const allListRuns = computed(() => allRuns.value.filter((run) => run.listId === listId))

  const bestListRun = computed(() => allListRuns.value.sort(sortRunsByMatchesAndSeconds)[0])

  return {
    allRuns,
    allListRuns,
    bestListRun,
  }
}
