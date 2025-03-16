import { describe, it, expect, beforeEach } from 'vitest'
import { useListPlaythroughs, usePlaythroughs } from '@/composables/playthroughs'

const generatedPlaythrough = (listId = 'list0', seconds = 1337, numberOfMatches = 42) => ({
  listId,
  numberOfMatches,
  seconds,
  finished: numberOfMatches === 42,
  timestamp: new Date().toISOString(),
})

describe('playthroughs composable', () => {
  beforeEach(() => localStorage.clear())

  it('keeps list', () => {
    const { allPlaythroughs } = usePlaythroughs()

    expect(allPlaythroughs.value).toHaveLength(0)

    allPlaythroughs.value.push(generatedPlaythrough())
    expect(allPlaythroughs.value).toHaveLength(1)
  })

  it('filters best by list', async () => {
    const { allPlaythroughs, getBestListPlaythrough } = usePlaythroughs()

    expect(getBestListPlaythrough('list0')).toBe(undefined)

    const playthrough0 = generatedPlaythrough('list0', 100, 10)
    allPlaythroughs.value.push(playthrough0)

    await nextTick()
    expect(getBestListPlaythrough('list0')).toEqual(playthrough0)

    const playthrough1 = generatedPlaythrough('list0', 99, 10)
    allPlaythroughs.value.push(playthrough1)

    await nextTick()
    expect(getBestListPlaythrough('list0')).toEqual(playthrough1)

    const playthrough2 = generatedPlaythrough('list0', 101, 11)
    allPlaythroughs.value.push(playthrough2)

    await nextTick()
    expect(getBestListPlaythrough('list0')).toEqual(playthrough2)

    const playthrough3 = generatedPlaythrough('list0', 99, 11)
    allPlaythroughs.value.push(playthrough3)

    await nextTick()
    expect(getBestListPlaythrough('list0')).toEqual(playthrough3)

    const playthrough4 = generatedPlaythrough('list0', 98, 10)
    allPlaythroughs.value.push(playthrough4)

    await nextTick()
    expect(getBestListPlaythrough('list0')).toEqual(playthrough3)

    const playthrough5 = generatedPlaythrough('list0', 99, 11)
    allPlaythroughs.value.push(playthrough5)

    await nextTick()
    expect(getBestListPlaythrough('list0')).toEqual(playthrough3)

    const playthrough6 = { ...playthrough3, finished: true }
    allPlaythroughs.value.push(playthrough6)

    await nextTick()
    expect(getBestListPlaythrough('list0')).toEqual(playthrough6)
  })

  it('deletes ', async () => {
    const { allPlaythroughs, deletePlaythrough } = usePlaythroughs()

    const playthrough0 = generatedPlaythrough()
    allPlaythroughs.value.push(playthrough0)

    const playthrough1 = generatedPlaythrough()
    allPlaythroughs.value.push(playthrough1)

    expect(allPlaythroughs.value).toEqual(expect.arrayContaining([playthrough0, playthrough1]))

    deletePlaythrough(playthrough0)

    expect(allPlaythroughs.value).toEqual(expect.arrayContaining([playthrough1]))
  })

  it('deletes all', async () => {
    const { allPlaythroughs, deleteAllPlaythroughs } = usePlaythroughs()

    allPlaythroughs.value.push(generatedPlaythrough())
    allPlaythroughs.value.push(generatedPlaythrough())

    expect(allPlaythroughs.value).toHaveLength(2)

    deleteAllPlaythroughs()

    expect(allPlaythroughs.value).toHaveLength(0)
  })

  it('imports', async () => {
    const { allPlaythroughs, importPlaythroughs } = usePlaythroughs()

    expect(allPlaythroughs.value).toHaveLength(0)

    importPlaythroughs(undefined)
    importPlaythroughs(null)
    importPlaythroughs('null')
    importPlaythroughs({})
    importPlaythroughs({ a: 'b' })

    importPlaythroughs([])
    importPlaythroughs([undefined])
    importPlaythroughs([null])
    importPlaythroughs(['null'])
    importPlaythroughs([{}])
    importPlaythroughs([{ a: 'b' }])
    importPlaythroughs(generatedPlaythrough())

    expect(allPlaythroughs.value).toHaveLength(0)

    importPlaythroughs([generatedPlaythrough()])

    expect(allPlaythroughs.value).toHaveLength(1)
  })
})

describe('listPlaythroughs composable', () => {
  beforeEach(() => localStorage.clear())

  it('filters by list', async () => {
    const { allPlaythroughs } = usePlaythroughs()
    const { allListPlaythroughs } = useListPlaythroughs('list0')

    expect(allListPlaythroughs.value).toHaveLength(0)

    allPlaythroughs.value.push(generatedPlaythrough())
    allPlaythroughs.value.push(generatedPlaythrough())

    await nextTick()
    expect(allListPlaythroughs.value).toHaveLength(2)

    allPlaythroughs.value.push(generatedPlaythrough('list1'))

    expect(allListPlaythroughs.value).toHaveLength(2)
  })

  it('filters best by list', async () => {
    const { allPlaythroughs } = usePlaythroughs()
    const { allListPlaythroughs, bestListPlaythrough } = useListPlaythroughs('list0')

    expect(bestListPlaythrough.value).toBe(undefined)

    const playthrough0 = generatedPlaythrough('list0', 100, 10)
    allPlaythroughs.value.push(playthrough0)

    await nextTick()
    expect(bestListPlaythrough.value).toEqual(playthrough0)

    const playthrough1 = generatedPlaythrough('list0', 99, 10)
    allPlaythroughs.value.push(playthrough1)

    await nextTick()
    expect(bestListPlaythrough.value).toEqual(playthrough1)

    const playthrough2 = generatedPlaythrough('list0', 101, 11)
    allPlaythroughs.value.push(playthrough2)

    await nextTick()
    expect(bestListPlaythrough.value).toEqual(playthrough2)

    const playthrough3 = generatedPlaythrough('list0', 99, 11)
    allPlaythroughs.value.push(playthrough3)

    await nextTick()
    expect(bestListPlaythrough.value).toEqual(playthrough3)

    const playthrough4 = generatedPlaythrough('list0', 98, 10)
    allPlaythroughs.value.push(playthrough4)

    await nextTick()
    expect(bestListPlaythrough.value).toEqual(playthrough3)

    const playthrough5 = generatedPlaythrough('list0', 99, 11)
    allPlaythroughs.value.push(playthrough5)

    await nextTick()
    expect(bestListPlaythrough.value).toEqual(playthrough3)

    const playthrough6 = { ...playthrough3, finished: true }
    allPlaythroughs.value.push(playthrough6)

    await nextTick()
    expect(bestListPlaythrough.value).toEqual(playthrough6)
    expect(allPlaythroughs.value).toEqual(expect.arrayContaining(allListPlaythroughs.value))
  })
})
