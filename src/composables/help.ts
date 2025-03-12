import Shepherd from 'shepherd.js'
import '@/assets/shepherd.css'

export function useHelp() {
  const { t } = useI18n()
  const hasDoneTour = useStorage<boolean>('completedHelp', false)

  const tour = new Shepherd.Tour({
    useModalOverlay: true,
  })

  tour.options.defaultStepOptions = {
    cancelIcon: { enabled: true },
    buttons: [
      {
        text: t('Back'),
        action: tour.back,
      },
      {
        text: t('Next'),
        action: tour.next,
        classes: 'shepherd-button-next',
      },
    ],
  }

  tour.on('cancel', () => (hasDoneTour.value = true))
  tour.on('complete', () => (hasDoneTour.value = true))

  if (!hasDoneTour.value) tour.start()

  return {
    openHelp: tour.start,
  }
}
