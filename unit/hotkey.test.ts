import { describe, it, expect, vi } from 'vitest'
import { useHotkey } from '@/composables/hotkey'

describe('hotkey composable', () => {
  it('calls callback', () => {
    const callback = vi.fn()

    useHotkey('f', callback)

    const type = (key: string, ctrlKey: boolean) =>
      document.dispatchEvent(new KeyboardEvent('keydown', { key, ctrlKey }))

    new KeyboardEvent('keydown', { key: 'f', ctrlKey: true })

    type('a', false)
    expect(callback).toHaveBeenCalledTimes(0)

    type('f', false)
    expect(callback).toHaveBeenCalledTimes(0)

    type('a', true)
    expect(callback).toHaveBeenCalledTimes(0)

    type('f', true)
    expect(callback).toHaveBeenCalledTimes(1)

    type('f', true)
    expect(callback).toHaveBeenCalledTimes(2)

    type('a', true)
    expect(callback).toHaveBeenCalledTimes(2)
  })
})
