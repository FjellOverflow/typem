import { useChecking } from '@/composables/checking'
import type { IListItem, ISettings } from '@/types'
import { describe, it, expect, vi } from 'vitest'

const item0: IListItem = {
  answer: 'answer0',
  matches: ['answer0'],
}

const item1: IListItem = {
  answer: 'answer 1',
  matches: ['answer 1'],
}

const item2: IListItem = {
  answer: 'Answer2',
  matches: ['Answer2'],
}

const settings: ISettings = {
  requireWhitespaces: false,
  requireCapitalization: false,
  requireOrder: false,
  numberOfPauses: 0,
  showHints: false,
  allowOverride: false,
  shuffle: false,
}

describe('checking composable', () => {
  it('checks', () => {
    const { check, items } = useChecking([item0, item1], settings, () => undefined)

    expect(items.value).toHaveLength(2)
    expect(items.value.filter((i) => i.checked)).toHaveLength(0)

    expect(check('answer1')).toEqual({ ...item1, checked: true, index: 1 })
    expect(items.value.filter((i) => i.checked)).toHaveLength(1)

    expect(check('answer0')).toEqual({ ...item0, checked: true, index: 0 })
    expect(items.value.filter((i) => i.checked)).toHaveLength(2)

    expect(check('false answer')).toEqual(undefined)
    expect(items.value.filter((i) => i.checked)).toHaveLength(2)
  })

  it('checks twice', () => {
    const { check, items } = useChecking([item0, item0], settings, () => undefined)

    expect(check('answer0')).toEqual({ ...item0, checked: true, index: 0 })
    expect(items.value.filter((i) => i.checked)).toHaveLength(1)

    expect(check('answer0')).toEqual({ ...item0, checked: true, index: 1 })
    expect(items.value.filter((i) => i.checked)).toHaveLength(2)

    expect(check('answer0')).toEqual(undefined)
    expect(items.value.filter((i) => i.checked)).toHaveLength(2)
  })

  it("doesn't check twice", () => {
    const { check, items } = useChecking([item0], settings, () => undefined)

    expect(check('answer0')).toEqual({ ...item0, checked: true, index: 0 })
    expect(items.value.filter((i) => i.checked)).toHaveLength(1)

    expect(check('answer0')).toEqual(undefined)
    expect(items.value.filter((i) => i.checked)).toHaveLength(1)
  })

  it('calls callback', () => {
    const callback = vi.fn()
    const { check } = useChecking([item0, item1, item2], settings, callback)

    check('answer0')
    check('answer1')
    check('answer2')

    expect(callback).toHaveBeenCalledOnce()
  })

  it('requires whitespace', () => {
    const { check, items } = useChecking(
      [item1],
      { ...settings, requireWhitespaces: true },
      () => undefined,
    )

    expect(check('answer1')).toEqual(undefined)
    expect(items.value.filter((i) => i.checked)).toHaveLength(0)

    expect(check('answer 1')).toEqual({ ...item1, checked: true, index: 0 })
    expect(items.value.filter((i) => i.checked)).toHaveLength(1)
  })

  it('requires capitalization', () => {
    const { check, items } = useChecking(
      [item2],
      { ...settings, requireCapitalization: true },
      () => undefined,
    )

    expect(check('answer2')).toEqual(undefined)
    expect(items.value.filter((i) => i.checked)).toHaveLength(0)

    expect(check('Answer2')).toEqual({ ...item2, checked: true, index: 0 })
    expect(items.value.filter((i) => i.checked)).toHaveLength(1)
  })

  it('requires order', () => {
    const { check, items } = useChecking(
      [item0, item1],
      { ...settings, requireOrder: true },
      () => undefined,
    )

    expect(check('answer 1')).toEqual(undefined)
    expect(items.value.filter((i) => i.checked)).toHaveLength(0)

    expect(check('answer0')).toEqual({ ...item0, checked: true, index: 0 })
    expect(items.value.filter((i) => i.checked)).toHaveLength(1)

    expect(check('answer 1')).toEqual({ ...item1, checked: true, index: 1 })
    expect(items.value.filter((i) => i.checked)).toHaveLength(2)
  })

  it('requires shuffled order', () => {
    const { check, items } = useChecking(
      [item0, item1, item2],
      { ...settings, requireOrder: true, shuffle: true },
      () => undefined,
    )

    items.value.forEach((i, index) => {
      if (i.matches[0]) expect(check(i.matches[0])).toEqual({ ...i, checked: true, index })

      expect(items.value.filter((i) => i.checked)).toHaveLength(index + 1)
    })
  })
})
