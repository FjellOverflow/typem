export function useHotkey(key: string, callback: () => void) {
  document.addEventListener('keydown', (event: KeyboardEvent) => {
    if (event.ctrlKey && event.key === key) {
      callback()
    }
  })
}
