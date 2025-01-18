import { ListPlaythroughSchema, type IListPlaythrough } from '@/types'
import { useStorage } from '@vueuse/core'

function sortPlaythroughByMatchesAndSeconds(p1: IListPlaythrough, p2: IListPlaythrough) {
  if (p1.numberOfMatches !== p2.numberOfMatches) return p2.numberOfMatches - p1.numberOfMatches

  return p1.seconds - p2.seconds
}

function sortPlaythroughsByTimestamp(
  { timestamp: t1 }: IListPlaythrough,
  { timestamp: t2 }: IListPlaythrough,
) {
  const [d1, d2] = [new Date(t1), new Date(t2)]

  return d2.getTime() - d1.getTime()
}

function validatePlaythroughs(objects: unknown[]): IListPlaythrough[] {
  const verified = objects
    .map((o) => {
      try {
        return ListPlaythroughSchema.parse(o)
      } catch (e) {
        console.debug(e)
      }
    })
    .filter((o) => !!o)

  return verified.sort(sortPlaythroughsByTimestamp)
}

export function usePlaythroughs() {
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

    if (playthroughIndex > -1) allPlaythroughs.value.splice(playthroughIndex, 1)
  }

  function deleteAllPlaythroughs() {
    allPlaythroughs.value = []
  }

  return { allPlaythroughs, getBestListPlaythrough, deletePlaythrough, deleteAllPlaythroughs }
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
    allPlaythroughs,
    allListPlaythroughs,
    bestListPlaythrough,
  }
}
