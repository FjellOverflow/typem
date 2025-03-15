import { describe, it, expect } from 'vitest'
import { useTimer } from '@/composables/timer'

describe('timer composable', () => {
  it('starts', () => {
    const timer = useTimer()

    expect(timer.start()).toBe(true)
    expect(timer.isRunning.value).toBe(true)

    // can't start twice
    expect(timer.start()).toBe(false)
  })

  it('pauses n times', () => {
    let n = 3

    const timer = useTimer(n)
    timer.start()

    // can pause 3 times
    while (n > 0) {
      expect(timer.isRunning.value).toBe(true)
      expect(timer.pause()).toBe(true)
      expect(timer.isRunning.value).toBe(false)

      n -= 1
      timer.start()
    }

    // can't pause a fourth time
    expect(timer.pause()).toBe(false)
    expect(timer.isRunning.value).toBe(true)
  })

  it('always pauses', () => {
    const timer = useTimer()

    for (let i = 13; i > 0; i--) {
      timer.start()

      expect(timer.isRunning.value).toBe(true)
      expect(timer.pause()).toBe(true)
      expect(timer.isRunning.value).toBe(false)
    }
  })

  it("doesn't pause", () => {
    const timer = useTimer(0)
    timer.start()

    expect(timer.isRunning.value).toBe(true)
    expect(timer.pause()).toBe(false)
    expect(timer.isRunning.value).toBe(true)
  })

  it('stops', () => {
    const timer = useTimer()
    timer.start()

    expect(timer.isRunning.value).toBe(true)

    expect(timer.stop()).toBe(true)
    expect(timer.isRunning.value).toBe(false)
    expect(timer.isStopped.value).toBe(true)

    // can't restart once stopped
    expect(timer.start()).toBe(false)
    expect(timer.isRunning.value).toBe(false)
    expect(timer.isStopped.value).toBe(true)

    // can stop once stopped
    expect(timer.stop()).toBe(false)
  })

  it('ticks up seconds', async () => {
    const timer = useTimer()
    timer.start()

    await new Promise((r) => setTimeout(r, 500))
    const timestamp1 = timer.seconds.value

    timer.start()
    await new Promise((r) => setTimeout(r, 500))
    timer.stop()
    const timestamp2 = timer.seconds.value

    await new Promise((r) => setTimeout(r, 500))
    const timestamp3 = timer.seconds.value

    expect(timestamp1).toBeGreaterThan(0)
    expect(timestamp2).toBeGreaterThan(timestamp1)
    expect(timestamp2).toEqual(timestamp3)
  })
})
