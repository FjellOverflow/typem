import { z } from 'zod'

export const availableLocales = ['en', 'de', 'no'] as const
export type IAvailableLocale = (typeof availableLocales)[number]

export const LocalizedStringSchema = z.union([
  z.string(),
  z.partialRecord(z.enum(availableLocales), z.string()),
])
export type ILocalizedString = z.infer<typeof LocalizedStringSchema>
