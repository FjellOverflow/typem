import Shepherd, { type StepOptions } from 'shepherd.js'
import '@/assets/shepherd.css'

export function useHelp() {
  const router = useRouter()
  const { t } = useI18n()

  const hasDoneTour = useStorage<boolean>('completedHelp', false)

  const tour = new Shepherd.Tour({
    useModalOverlay: true,
  })

  tour.options.defaultStepOptions = {
    cancelIcon: { enabled: true },
  }

  const steps: StepOptions[] = [
    {
      buttons: [
        {
          text: t('help.Skip'),
          action: tour.cancel,
        },
        {
          text: t('help.Start the tour'),
          classes: 'shepherd-button-next',
          action: async () => {
            await router.push('/')
            tour.next()
          },
        },
      ],
    },
    {
      attachTo: { element: '#main', on: 'top' },
      canClickTarget: false,
      buttons: [
        {
          text: t('Next'),
          classes: 'shepherd-button-next',
          action: tour.next,
        },
      ],
    },
    {
      attachTo: { element: '#list-preview-planets', on: 'top' },
      scrollTo: true,
      advanceOn: { selector: '#list-preview-planets .btn.btn-outline.btn-primary', event: 'click' },
      buttons: [
        {
          text: t('Next'),
          classes: 'shepherd-button-next',
          action: async () => {
            await router.push('/play/planets')
            tour.next()
          },
        },
      ],
    },
    {
      attachTo: { element: '#main', on: 'top' },
      canClickTarget: false,
      buttons: [
        {
          text: t('Next'),
          classes: 'shepherd-button-next',
          action: tour.next,
        },
      ],
    },
    {
      attachTo: { element: '#settingsCard', on: 'top' },
      canClickTarget: false,
      buttons: [
        {
          text: t('Next'),
          classes: 'shepherd-button-next',
          action: tour.next,
        },
      ],
    },
    {
      attachTo: { element: '#list-preview-planets', on: 'top' },
      advanceOn: { selector: '#list-preview-planets', event: 'oninit' },
      buttons: [
        {
          text: t('Next'),
          classes: 'shepherd-button-next',
          action: async () => {
            ;(document.querySelector('#initButton') as HTMLButtonElement | null)?.click()
            await new Promise((r) => setTimeout(r, 1))
            tour.next()
          },
        },
      ],
    },
    {
      attachTo: {
        element: '#inputField',
        on: 'top',
      },
      advanceOn: { selector: '#inputField', event: 'onmatch' },
      beforeShowPromise: () =>
        new Promise<void>((r) => {
          setTimeout(() => {
            ;(document.querySelector('#inputField') as HTMLInputElement)?.focus()
          }, 500)
          r()
        }),
      when: {
        show() {
          const vElement = this.getElement()
          if (vElement)
            vElement.focus = () => {
              /* Do nothing */
            }
        },
      },
    },
    {
      attachTo: {
        element: '#inputField',
        on: 'top',
      },
      advanceOn: { selector: '#inputField', event: 'onmatch' },
      beforeShowPromise: () =>
        new Promise<void>((r) => {
          setTimeout(() => {
            ;(document.querySelector('#inputField') as HTMLInputElement)?.focus()
          }, 500)
          r()
        }),
      when: {
        show() {
          const vElement = this.getElement()
          if (vElement)
            vElement.focus = () => {
              /* Do nothing */
            }
        },
      },
    },
    {
      attachTo: {
        element: '#timerCard',
        on: 'top',
      },
      advanceOn: { selector: '#giveUpBtn', event: 'click' },
      buttons: [
        {
          text: t('Next'),
          classes: 'shepherd-button-next',
          action: () => {
            ;(document.querySelector('#giveUpBtn') as HTMLButtonElement | null)?.click()
          },
        },
      ],
    },
    {
      attachTo: {
        element: '#timerCard',
        on: 'top',
      },
      canClickTarget: false,
      buttons: [
        {
          text: t('Next'),
          classes: 'shepherd-button-next',
          action: tour.next,
        },
      ],
    },
    {
      attachTo: {
        element: '#itemsCard',
        on: 'top',
      },
      buttons: [
        {
          text: t('Next'),
          classes: 'shepherd-button-next',
          action: tour.next,
        },
      ],
    },
    {
      canClickTarget: false,
      attachTo: {
        element: '#main',
        on: 'top',
      },
      buttons: [
        {
          text: t('Next'),
          classes: 'shepherd-button-next',
          action: tour.next,
        },
      ],
      beforeShowPromise: () => router.push('/history/all'),
    },
    {
      buttons: [
        {
          text: t('help.Finish the tour'),
          classes: 'shepherd-button-next',
          action: async () => {
            await router.push('/')
            tour.next()
          },
        },
      ],
    },
  ]

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
