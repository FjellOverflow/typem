import { createI18n } from 'vue-i18n'
import messages from '@/locales/index'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'no',
  messages,
})

export default i18n
