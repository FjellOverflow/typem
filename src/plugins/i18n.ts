import { createI18n } from 'vue-i18n'
import messages from '../locales/index'

const availableLocales = Object.keys(messages)

const localeFromStorage = localStorage.getItem('locale')

let locale = 'en'

if (localeFromStorage && availableLocales.includes(localeFromStorage)) locale = localeFromStorage

const i18n = createI18n({
  legacy: false,
  locale,
  messages,
})

export default i18n
