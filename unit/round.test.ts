import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { usePlaythroughs } from '@/composables/playthroughs'
import { useRound } from '@/composables/round'
import { defaultSettings, ListSchema, type IList, type ISettings } from '@/types'

function listOf(id: string, settings: Partial<ISettings> = {}): IList {
  return ListSchema.parse({
    id,
    meta: {
      name: id,
      description: id,
      difficulty: 1,
      author: 'test',
      lastUpdated: '2026-01-01',
      source: 'test',
      tags: [],
      supportedLocales: ['en'],
    },
    items: [
      { answer: 'Mercury', matches: ['Mercury'] },
      { answer: 'Venus', matches: ['Venus'] },
      { answer: 'Earth', matches: ['Earth'] },
    ],
    settings: { ...defaultSettings, ...settings },
  })
}

function setupRound(settings: Partial<ISettings> = {}) {
  const list = ref(listOf('planets', settings))
  const onNewRecord = vi.fn()
  const scope = effectScope()
  const round = scope.run(() => useRound(list, onNewRecord))!

  return { round, list, onNewRecord, scope }
}

function nameAllItems(round: ReturnType<typeof useRound>, seconds: number) {
  round.type('Mercury')
  round.type('Venus')
  vi.advanceTimersByTime(seconds * 1000)
  round.type('Earth')
}

const { playthroughs, deleteHistory } = usePlaythroughs()

describe('round composable', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    deleteHistory()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('starts idle with the unchecked items of the List', () => {
    const { round, list } = setupRound()

    expect(round.phase.value).toBe('idle')
    expect(round.canStart.value).toBe(false)
    expect(round.hasEnded.value).toBe(false)
    expect(round.items.value).toHaveLength(3)
    expect(round.items.value.every((item) => !item.checked)).toBe(true)
    expect(round.settings.value).toEqual(list.value.settings)
    expect(round.seconds.value).toBe(0)
  })

  it('locks the settings while active and unlocks them on reset', () => {
    const { round } = setupRound()

    round.settings.value.showHints = true

    expect(round.init()).toBe(true)
    expect(round.phase.value).toBe('ready')
    expect(round.settings.value.allowOverride).toBe(false)
    expect(round.init()).toBe(false)

    round.reset()

    expect(round.phase.value).toBe('idle')
    expect(round.settings.value.allowOverride).toBe(true)
    expect(round.settings.value.showHints).toBe(true)
  })

  it('starts the timer on the first input and resumes it after a pause', () => {
    const { round } = setupRound({ numberOfPauses: -1 })

    round.init()

    expect(round.canStart.value).toBe(true)
    expect(round.type('Pluto')).toBeUndefined()
    expect(round.phase.value).toBe('running')
    expect(round.canStart.value).toBe(false)

    vi.advanceTimersByTime(2000)

    expect(round.pause()).toBe(true)
    expect(round.phase.value).toBe('paused')
    expect(round.canStart.value).toBe(true)

    vi.advanceTimersByTime(5000)

    expect(round.type('Mercury')).toMatchObject({ answer: 'Mercury', checked: true })
    expect(round.phase.value).toBe('running')

    vi.advanceTimersByTime(1000)
    round.stop()

    expect(round.seconds.value).toBe(3)
  })

  it('pauses only as often as the settings allow', () => {
    const { round } = setupRound({ numberOfPauses: 1 })

    round.init()
    round.start()

    expect(round.pause()).toBe(true)

    round.start()

    expect(round.pause()).toBe(false)
    expect(round.phase.value).toBe('running')
    expect(round.remainingPauses.value).toBe(0)
  })

  it('saves a stopped round as an unfinished playthrough and ignores later input', () => {
    const { round } = setupRound()

    round.init()
    round.type('Mercury')
    vi.advanceTimersByTime(4000)

    expect(round.stop()).toBe(true)
    expect(round.phase.value).toBe('stopped')
    expect(round.hasEnded.value).toBe(true)
    expect(playthroughs.value).toEqual([
      expect.objectContaining({
        listId: 'planets',
        seconds: 4,
        finished: false,
        numberOfMatches: 1,
      }),
    ])

    expect(round.type('Venus')).toBeUndefined()
    expect(round.stop()).toBe(false)
    expect(playthroughs.value).toHaveLength(1)
  })

  it('saves nothing when a round stops without matches', () => {
    const { round } = setupRound()

    round.init()
    round.start()
    vi.advanceTimersByTime(1000)
    round.stop()

    expect(playthroughs.value).toEqual([])
  })

  it('finishes and saves when all items are named', () => {
    const { round } = setupRound()

    round.init()
    nameAllItems(round, 7)

    expect(round.phase.value).toBe('finished')
    expect(round.hasEnded.value).toBe(true)
    expect(playthroughs.value).toEqual([
      expect.objectContaining({ seconds: 7, finished: true, numberOfMatches: 3 }),
    ])
    expect(round.type('Mercury')).toBeUndefined()
  })

  it('reports a new record only when a finished round beats a finished record', () => {
    const { round, onNewRecord } = setupRound()

    round.init()
    round.type('Mercury')
    round.stop()
    round.reset()

    round.init()
    nameAllItems(round, 10)
    round.reset()

    expect(onNewRecord).not.toHaveBeenCalled()

    round.init()
    nameAllItems(round, 12)
    round.reset()

    expect(onNewRecord).not.toHaveBeenCalled()

    round.init()
    nameAllItems(round, 5)

    expect(onNewRecord).toHaveBeenCalledOnce()
    expect(onNewRecord).toHaveBeenCalledWith(
      expect.objectContaining({ seconds: 5, finished: true }),
      expect.objectContaining({ seconds: 10, finished: true }),
    )
  })

  it('saves an active round and starts a new one on restart', () => {
    const { round } = setupRound()

    round.init()
    round.type('Mercury')

    expect(round.restart()).toBe(true)
    expect(round.phase.value).toBe('ready')
    expect(round.settings.value.allowOverride).toBe(false)
    expect(round.items.value.every((item) => !item.checked)).toBe(true)
    expect(playthroughs.value).toEqual([expect.objectContaining({ finished: false })])
  })

  it('saves a round only once when it restarts after a stop', () => {
    const { round } = setupRound()

    round.init()
    round.type('Mercury')
    round.stop()

    expect(round.restart()).toBe(true)
    expect(round.phase.value).toBe('ready')
    expect(playthroughs.value).toHaveLength(1)
  })

  it('does not restart an idle or finished round', () => {
    const { round } = setupRound()

    expect(round.restart()).toBe(false)
    expect(round.phase.value).toBe('idle')

    round.init()
    nameAllItems(round, 1)

    expect(round.restart()).toBe(false)
    expect(round.phase.value).toBe('finished')
  })

  it('drops an active round without a save when the List changes', async () => {
    const { round, list } = setupRound()

    round.init()
    round.type('Mercury')
    list.value = listOf('moons', { showHints: true })
    await nextTick()

    expect(round.phase.value).toBe('idle')
    expect(round.settings.value).toEqual(list.value.settings)
    expect(round.items.value.every((item) => !item.checked)).toBe(true)
    expect(playthroughs.value).toEqual([])
    expect(vi.getTimerCount()).toBe(0)
  })

  it('stops the timer without a save when its scope is disposed', () => {
    const { round, scope } = setupRound()

    round.init()
    round.type('Mercury')

    expect(vi.getTimerCount()).toBe(1)

    scope.stop()

    expect(vi.getTimerCount()).toBe(0)
    expect(playthroughs.value).toEqual([])
  })
})
