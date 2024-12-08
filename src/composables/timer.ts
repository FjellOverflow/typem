export function useTimer(numberOfPauses = -1) {
  const remainingPauses = ref(numberOfPauses)
  const seconds = ref(0)
  const isStopped = ref(false)
  const isRunning = ref(false)

  const lastTimestamp = ref<Date | undefined>()
  const ticker = ref<ReturnType<typeof setTimeout>>()

  function updateSeconds() {
    const now = new Date()
    if (!lastTimestamp.value) return

    seconds.value = (now.getTime() - lastTimestamp.value.getTime()) / 1000
  }

  function startTicker() {
    stopTicker()
    ticker.value = setInterval(updateSeconds, 50)
  }

  function stopTicker() {
    clearInterval(ticker.value)
  }

  function start(): boolean {
    if (isStopped.value || isRunning.value) return false

    lastTimestamp.value = new Date(Date.now() - seconds.value * 1000)
    startTicker()
    isRunning.value = true
    return true
  }

  function pause(): boolean {
    if (isStopped.value || !isRunning.value || !lastTimestamp.value || remainingPauses.value === 0)
      return false

    stopTicker()
    isRunning.value = false
    updateSeconds()
    remainingPauses.value += -1
    return true
  }

  function stop(): boolean {
    if (isStopped.value || !isRunning.value || !lastTimestamp.value) return false

    stopTicker()
    isRunning.value = false
    isStopped.value = true
    updateSeconds()
    return true
  }

  return {
    seconds,
    isStopped,
    isRunning,
    remainingPauses,
    start,
    pause,
    stop,
  }
}
