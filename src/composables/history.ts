import type { IRun } from '@/types'
import { useStorage } from '@vueuse/core'

export function useHistory() {
  const history = useStorage<IRun[]>('history', [])

  function getAllRunsByList(id: string) {
    return history.value.filter(({ listId }) => id === listId)
  }

  function getBestRunByList(id: string): IRun | undefined {
    const finishedRuns = getAllRunsByList(id).filter((run) => run.finished)

    if (finishedRuns.length === 0) return

    return finishedRuns.reduce((min, current) =>
      min && min.seconds < current.seconds ? min : current,
    )
  }

  return { history, getAllRunsByList, getBestRunByList }
}
