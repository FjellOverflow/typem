export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: Array<string>
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

const pwaInstallPromptEvent = ref<BeforeInstallPromptEvent>()

function checkIfInstallable() {
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault()
    pwaInstallPromptEvent.value = event as BeforeInstallPromptEvent
  })
}

export { checkIfInstallable, pwaInstallPromptEvent }
