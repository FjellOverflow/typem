export function useHotkey(key: string, callback: () => void) {
  const keyDownCallback = (event: KeyboardEvent) => {
    if (event.ctrlKey && event.key === key) {
      callback()
    }
  }

  onMounted(() => {
    document.addEventListener('keydown', keyDownCallback)
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', keyDownCallback)
  })
}
