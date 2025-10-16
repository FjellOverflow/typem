import { describe, it, expect } from 'vitest'
import { useLocalize } from '@/composables/localize'
import { createApp } from 'vue'
import i18n from '@/plugins/i18n'
import type { ILocalizedString } from '@/types/localization'

function withSetup<T>(useComposable: () => T): T {
  let composable: T | undefined

  const app = createApp({
    setup() {
      composable = useComposable()
      return () => null
    },
  })

  app.use(i18n)
  app.mount(document.createElement('div'))

  if (!composable) throw new Error()
  return composable
}

const bare: ILocalizedString = 'test'
const none: ILocalizedString = {}
const en: ILocalizedString = { en: 'english' }
const de: ILocalizedString = { de: 'deutsch' }
const en_de: ILocalizedString = { en: 'english', de: 'deutsch' }

describe('localize composable', () => {
  it('translates', () => {
    const { localize } = withSetup(useLocalize)

    expect(localize.value(bare)).toEqual('test')
    expect(localize.value(none)).toEqual('TranslationError<{}>')
    expect(localize.value(en)).toEqual('english')
    expect(localize.value(de)).toEqual('deutsch')
    expect(localize.value(en_de)).toEqual('english')

    i18n.global.locale.value = 'de'

    expect(localize.value(bare)).toEqual('test')
    expect(localize.value(none)).toEqual('TranslationError<{}>')
    expect(localize.value(en)).toEqual('english')
    expect(localize.value(de)).toEqual('deutsch')
    expect(localize.value(en_de)).toEqual('deutsch')
  })
})
