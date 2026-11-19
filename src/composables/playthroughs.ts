import { ListPlaythroughSchema, type IListPlaythrough, type ListProgress } from '@/types'
import { useStorage } from '@vueuse/core'

function compareForRecord(p1: IListPlaythrough, p2: IListPlaythrough) {
  if (p1.numberOfMatches !== p2.numberOfMatches) return p2.numberOfMatches - p1.numberOfMatches

  if (p1.seconds !== p2.seconds) return p1.seconds - p2.seconds

  if (p1.timestamp !== p2.timestamp)
    return new Date(p1.timestamp).getTime() - new Date(p2.timestamp).getTime()

  return Number(p2.finished) - Number(p1.finished)
}

function isSamePlaythrough(p1: IListPlaythrough, p2: IListPlaythrough) {
  return p1.listId === p2.listId && p1.timestamp === p2.timestamp
}

function parsePlaythrough(entry: unknown) {
  const result = ListPlaythroughSchema.safeParse(entry)

  return result.success ? result.data : undefined
}

function validPlaythroughsOf(entries: unknown) {
  if (!Array.isArray(entries)) return []

  return entries.map(parsePlaythrough).filter((p) => !!p)
}

function createPlaythroughStore() {
  const history = useStorage<IListPlaythrough[]>('history', [])

  const validHistory = validPlaythroughsOf(history.value)

  if (JSON.stringify(validHistory) !== JSON.stringify(history.value)) history.value = validHistory

  const playthroughs = computed(() => history.value)

  const recordsByListId = computed(() => {
    const records = new Map<string, IListPlaythrough>()

    for (const playthrough of playthroughs.value) {
      const record = records.get(playthrough.listId)

      if (!record || compareForRecord(playthrough, record) < 0)
        records.set(playthrough.listId, playthrough)
    }

    return records
  })

  const records = computed(() => [...recordsByListId.value.values()])

  function recordOf(listId: string) {
    return recordsByListId.value.get(listId)
  }

  function isRecord(playthrough: IListPlaythrough) {
    const record = recordOf(playthrough.listId)

    return !!record && isSamePlaythrough(record, playthrough)
  }

  function progressOf(listId: string): ListProgress {
    const record = recordOf(listId)

    if (!record) return 'untried'
    if (record.finished) return 'finished'

    return 'tried'
  }

  function addPlaythrough(playthrough: IListPlaythrough) {
    const previousRecord = recordOf(playthrough.listId)

    history.value.push(playthrough)

    const isNewRecord =
      playthrough.finished &&
      previousRecord?.finished &&
      playthrough.seconds < previousRecord.seconds

    return { beatenRecord: isNewRecord ? previousRecord : undefined }
  }

  function deletePlaythrough(playthrough: IListPlaythrough) {
    const index = history.value.findIndex((entry) => isSamePlaythrough(entry, playthrough))

    if (index === -1) return false

    history.value.splice(index, 1)

    return true
  }

  function deleteHistory() {
    history.value = []
  }

  function importHistory(imported: unknown) {
    const validImported = validPlaythroughsOf(imported)

    if (validImported.length === 0) return undefined

    let addedCount = 0

    for (const playthrough of validImported)
      if (!history.value.some((entry) => isSamePlaythrough(entry, playthrough))) {
        history.value.push(playthrough)
        addedCount++
      }

    return addedCount
  }

  function exportHistory() {
    return [...history.value]
  }

  return {
    playthroughs,
    records,
    recordOf,
    isRecord,
    progressOf,
    addPlaythrough,
    deletePlaythrough,
    deleteHistory,
    importHistory,
    exportHistory,
  }
}

let store: ReturnType<typeof createPlaythroughStore> | undefined

export function usePlaythroughs() {
  // Detached, so the shared store outlives the component that first calls this.
  store ??= effectScope(true).run(createPlaythroughStore)!

  return store
}
