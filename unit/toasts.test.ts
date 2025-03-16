import { beforeEach, describe, it, expect, vi } from 'vitest'

describe('toasts composable', () => {
  beforeEach(() => vi.resetModules())

  it('adds toasts', async () => {
    const { useToasts } = await import('@/composables/toasts')
    const { toasts, sendToast } = useToasts()

    expect(toasts.value).toHaveLength(0)

    sendToast({
      message: 'test',
      sentiment: 'alert-info',
    })

    expect(toasts.value).toHaveLength(1)

    sendToast({
      message: 'test',
      sentiment: 'alert-info',
    })

    expect(toasts.value).toHaveLength(2)
  })

  it('removes toasts', async () => {
    const { useToasts } = await import('@/composables/toasts')
    const { toasts, sendToast } = useToasts(10)

    sendToast({
      message: 'test',
      sentiment: 'alert-info',
    })

    sendToast({
      message: 'test',
      sentiment: 'alert-info',
    })

    expect(toasts.value).toHaveLength(2)

    await nextTick()
    await new Promise((r) => setTimeout(r, 20))

    expect(toasts.value).toHaveLength(0)
  })

  it("doesn't remove toasts", async () => {
    const { useToasts } = await import('@/composables/toasts')
    const { toasts, sendToast } = useToasts(10000)

    sendToast({
      message: 'test',
      sentiment: 'alert-info',
    })

    sendToast({
      message: 'test',
      sentiment: 'alert-info',
    })

    expect(toasts.value).toHaveLength(2)

    await nextTick()
    await new Promise((r) => setTimeout(r, 200))

    expect(toasts.value).toHaveLength(2)
  })
})
