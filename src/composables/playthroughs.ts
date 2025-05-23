import { ListPlaythroughSchema, type IListPlaythrough } from '@/types'
import { useStorage } from '@vueuse/core'
import { useToasts } from '@/composables/toasts'
import i18n from '@/plugins/i18n'

function sortPlaythroughByMatchesAndSeconds(p1: IListPlaythrough, p2: IListPlaythrough) {
  if (p1.numberOfMatches !== p2.numberOfMatches) return p2.numberOfMatches - p1.numberOfMatches

  if (p1.seconds !== p2.seconds) return p1.seconds - p2.seconds

  if (p1.timestamp !== p2.timestamp)
    return new Date(p1.timestamp).getTime() - new Date(p2.timestamp).getTime()

  return Number(p2.finished) - Number(p1.finished)
}

function validatePlaythroughs(objects: unknown[]): IListPlaythrough[] {
  return objects
    .map((o) => {
      try {
        return ListPlaythroughSchema.parse(o)
      } catch (e) {
        console.debug(e)
      }
    })
    .filter((o) => !!o)
}

export function usePlaythroughs() {
  const { sendToast } = useToasts()

  const allPlaythroughs = useStorage<IListPlaythrough[]>('history', [])

  allPlaythroughs.value = validatePlaythroughs([...allPlaythroughs.value])

  function getBestListPlaythrough(listId: string) {
    if (allPlaythroughs.value.length === 0) return

    const listPlaythroughs = [...allPlaythroughs.value.filter((p) => p.listId === listId)]

    const sortedListPlaythroughs = listPlaythroughs.sort(sortPlaythroughByMatchesAndSeconds)

    return sortedListPlaythroughs[0]
  }

  function deletePlaythrough(playthrough: IListPlaythrough) {
    const playthroughIndex = allPlaythroughs.value.findIndex(
      (p) => JSON.stringify(p) === JSON.stringify(playthrough),
    )

    if (playthroughIndex > -1) {
      allPlaythroughs.value.splice(playthroughIndex, 1)
      sendToast({
        message: i18n.global.t('Deleted playthrough'),
        sentiment: 'alert-success',
      })
    } else {
      sendToast({
        message: i18n.global.t("Couldn't delete playthrough"),
        sentiment: 'alert-error',
      })
    }
  }

  function deleteAllPlaythroughs() {
    allPlaythroughs.value = []
    sendToast({
      message: i18n.global.t('Deleted all playthroughs'),
      sentiment: 'alert-success',
    })
  }

  function importPlaythroughs(importedObj: unknown): boolean {
    if (!Array.isArray(importedObj)) return false

    const newPlaythroughs = validatePlaythroughs([...importedObj])

    if (newPlaythroughs.length > 0) {
      allPlaythroughs.value = newPlaythroughs
      return true
    }

    return false
  }

  return {
    allPlaythroughs,
    getBestListPlaythrough,
    deletePlaythrough,
    deleteAllPlaythroughs,
    importPlaythroughs,
  }
}

export function useListPlaythroughs(listId: string) {
  const { allPlaythroughs } = usePlaythroughs()

  const allListPlaythroughs = computed(() =>
    allPlaythroughs.value.filter((p) => p.listId === listId),
  )

  const bestListPlaythrough = computed(
    (): IListPlaythrough | undefined =>
      allListPlaythroughs.value.sort(sortPlaythroughByMatchesAndSeconds)[0],
  )

  return {
    allListPlaythroughs,
    bestListPlaythrough,
  }
}
