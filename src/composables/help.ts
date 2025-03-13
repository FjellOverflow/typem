import Shepherd, { type StepOptions } from 'shepherd.js'
import '@/assets/shepherd.css'

export function useHelp() {
  const { t } = useI18n()

  const hasDoneTour = useStorage<boolean>('completedHelp', false)

  const tour = new Shepherd.Tour({
    useModalOverlay: true,
  })

  tour.options.defaultStepOptions = {
    cancelIcon: { enabled: true },
  }

  const steps: StepOptions[] = []

  tour.addSteps(
    steps.map((s, i) => ({
      title: t(`help.steps.${i}.title`),
      text: t(`help.steps.${i}.text`),
      ...s,
    })),
  )

  tour.on('cancel', () => (hasDoneTour.value = true))
  tour.on('complete', () => (hasDoneTour.value = true))

  if (!hasDoneTour.value) tour.start()

  return {
    openHelp: tour.start,
  }
}
