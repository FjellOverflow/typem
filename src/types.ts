import { z } from 'zod'

export const defaultSettings = {
  requireWhitespaces: false,
  requireCapitalization: false,
  requireOrder: false,
  numberOfPauses: -1,
  showHints: false,
  allowOverride: true,
  shuffle: false,
}

export const SettingsSchema = z.object({
  requireWhitespaces: z.boolean().default(defaultSettings.requireWhitespaces),
  requireCapitalization: z.boolean().default(defaultSettings.requireCapitalization),
  requireOrder: z.boolean().default(defaultSettings.requireOrder),
  numberOfPauses: z.number().default(defaultSettings.numberOfPauses),
  showHints: z.boolean().default(defaultSettings.showHints),
  allowOverride: z.boolean().default(defaultSettings.allowOverride),
  shuffle: z.boolean().default(defaultSettings.shuffle),
})
export type ISettings = z.infer<typeof SettingsSchema>

export const ListItemSchema = z.object({
  hint: z.string().optional(),
  answer: z.string(),
  matches: z.array(z.string()),
})
export type IListItem = z.infer<typeof ListItemSchema>

export const ListSchema = z.object({
  id: z.string(),
  meta: z.object({
    name: z.string(),
    description: z.string(),
    difficulty: z.number(),
    author: z.string(),
    lastUpdated: z.string().date(),
    source: z.string(),
    tags: z.array(z.string()),
    category: z.string(),
  }),
  items: z.array(ListItemSchema),
  settings: SettingsSchema.default(defaultSettings),
})
export type IList = z.infer<typeof ListSchema>

export type ICheckableListItem = IListItem & {
  checked: boolean
}

export const ListPlaythroughSchema = z.object({
  listId: z.string(),
  seconds: z.number(),
  finished: z.boolean(),
  numberOfMatches: z.number(),
  timestamp: z.string(),
})
export type IListPlaythrough = z.infer<typeof ListPlaythroughSchema>
