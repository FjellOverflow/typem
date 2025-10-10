import type { IAvailableLocale, ILocalizedString } from '@/types/localization'

export function useLocalize() {
  const { locale } = useI18n()

  const localize = computed(() => (localizedString: ILocalizedString): string => {
    if (typeof localizedString === 'string' || localizedString instanceof String)
      return localizedString as string

    const fallbackString =
      localizedString.en ??
      Object.values(localizedString)[0] ??
      `TranslationError<${JSON.stringify(localizedString)}>`

    return localizedString[locale.value as IAvailableLocale] ?? fallbackString
  })

  return {
    localize,
  }
}
