import { describe, expect, it } from 'vitest'
import { useFavorites } from '@/composables/favorites'

const list0 = {
  id: 'list0',
  meta: {
    name: '',
    description: '',
    difficulty: 0,
    author: '',
    lastUpdated: new Date().toISOString(),
    source: '',
    tags: [],
    category: '',
    isCustom: false,
    supportedLocales: ['en'],
  },
  items: [],
  settings: {
    requireWhitespaces: false,
    requireCapitalization: false,
    requireOrder: false,
    numberOfPauses: 0,
    showHints: false,
    allowOverride: false,
    shuffle: false,
  },
}

const list1 = { ...list0, id: 'list1' }

describe('favorites composable', () => {
  it('toggles favorite', () => {
    const { toggleFavorite, isFavorite } = useFavorites()

    expect(isFavorite(list0)).toBe(false)
    expect(isFavorite(list1)).toBe(false)

    toggleFavorite(list0)

    expect(isFavorite(list0)).toBe(true)
    expect(isFavorite(list1)).toBe(false)

    toggleFavorite(list0)

    expect(isFavorite(list0)).toBe(false)
    expect(isFavorite(list1)).toBe(false)
  })
})
