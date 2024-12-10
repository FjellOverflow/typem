import { z } from 'zod'

export const defaultSettings = {
  requireWhitespaces: false,
  requireCapitalization: false,
  requireOrder: false,
  numberOfPauses: -1,
  showHints: false,
  allowOverride: true,
}

export const SettingsSchema = z.object({
  requireWhitespaces: z.boolean().default(defaultSettings.requireWhitespaces),
  requireCapitalization: z.boolean().default(defaultSettings.requireCapitalization),
  requireOrder: z.boolean().default(defaultSettings.requireOrder),
  numberOfPauses: z.number().default(defaultSettings.numberOfPauses),
  showHints: z.boolean().default(defaultSettings.showHints),
  allowOverride: z.boolean().default(defaultSettings.allowOverride),
})
export type ISettings = z.infer<typeof SettingsSchema>

export const ItemSchema = z.object({
  hint: z.string().optional(),
  answer: z.string(),
  matches: z.array(z.string()),
})
export type IItem = z.infer<typeof ItemSchema>

export const ItemListSchema = z.object({
  id: z.string(),
  meta: z.object({
    name: z.string(),
    description: z.string(),
    difficulty: z.number(),
    author: z.string(),
    lastUpdated: z.string().date(),
    source: z.string(),
  }),
  items: z.array(ItemSchema),
  settings: SettingsSchema.default(defaultSettings),
})
export type IItemList = z.infer<typeof ItemListSchema>

export type ICheckableItem = IItem & {
  checked: boolean
}

export interface IRun {
  listId: string
  seconds: number
  finished: boolean
  timestamp: string
}
