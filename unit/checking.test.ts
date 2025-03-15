import { useChecking } from '@/composables/checking'
import type { IListItem, ISettings } from '@/types'
import { describe, it, expect, vi } from 'vitest'

const mockItem0: IListItem = {
  answer: 'answer0',
  matches: ['answer0'],
}

const mockItem1: IListItem = {
  answer: 'answer 1',
  matches: ['answer 1'],
}

const mockItem2: IListItem = {
  answer: 'Answer2',
  matches: ['Answer2'],
}

const exampleItems = [mockItem0, mockItem1, mockItem2]

const basicSettings: ISettings = {
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
    const { check, items } = useChecking(exampleItems, basicSettings, () => undefined)

    expect(items.value).toHaveLength(3)
    expect(items.value.filter((i) => i.checked)).toHaveLength(0)

    expect(check('answer0')).toEqual({ ...mockItem0, checked: true })
    expect(items.value.filter((i) => i.checked)).toHaveLength(1)

    expect(check('answer1')).toEqual({ ...mockItem1, checked: true })
    expect(items.value.filter((i) => i.checked)).toHaveLength(2)

    expect(check('false answer')).toEqual(undefined)
    expect(items.value.filter((i) => i.checked)).toHaveLength(2)
  })

  it('checks twice', () => {
    const { check, items } = useChecking([mockItem0, mockItem0], basicSettings, () => undefined)

    expect(check('answer0')).toEqual({ ...mockItem0, checked: true })
    expect(items.value.filter((i) => i.checked)).toHaveLength(1)

    expect(check('answer0')).toEqual({ ...mockItem0, checked: true })
    expect(items.value.filter((i) => i.checked)).toHaveLength(2)

    expect(check('answer0')).toEqual(undefined)
    expect(items.value.filter((i) => i.checked)).toHaveLength(2)
  })

  it("doesn't check twice", () => {
    const { check } = useChecking(exampleItems, basicSettings, () => undefined)

    expect(check('answer0')).toEqual({ ...mockItem0, checked: true })
    expect(check('answer0')).toEqual(undefined)
  })

  it('calls callback', () => {
    const callback = vi.fn()
    const { check } = useChecking(exampleItems, basicSettings, callback)

    check('answer0')
    check('answer1')
    check('answer2')

    expect(callback).toHaveBeenCalledOnce()
  })

  it('requires whitespace', () => {
    const { check } = useChecking(
      exampleItems,
      { ...basicSettings, requireWhitespaces: true },
      () => undefined,
    )

    expect(check('answer1')).toEqual(undefined)

    expect(check('answer 1')).toEqual({ ...mockItem1, checked: true })
  })

  it('requires capitalization', () => {
    const { check } = useChecking(
      exampleItems,
      { ...basicSettings, requireCapitalization: true },
      () => undefined,
    )

    expect(check('answer2')).toEqual(undefined)

    expect(check('Answer2')).toEqual({ ...mockItem2, checked: true })
  })
})
