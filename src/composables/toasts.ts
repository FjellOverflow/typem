interface Toast {
  message: string
  sentiment: `alert-${'info' | 'success' | 'warning' | 'error'}`
}

const _nextId = ref(0)
const toasts = ref<(Toast & { id: number })[]>([])

export function useToasts(timeout = 5000) {
  function sendToast(toast: Toast) {
    const id = _nextId.value++

    toasts.value.unshift({ id, ...toast })

    setTimeout(() => {
      const index = toasts.value.findIndex((t) => t.id === id)

      if (index > -1) toasts.value.splice(index, 1)
    }, timeout)
  }

  return {
    toasts,
    sendToast,
  }
}
