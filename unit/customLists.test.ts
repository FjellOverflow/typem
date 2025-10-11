import { describe, expect, it, beforeEach } from 'vitest'
import { useCustomLists } from '@/composables/customLists'

const list = {
  id: 'list0',
  meta: {
    name: '',
    description: '',
    difficulty: 0,
    author: '',
    lastUpdated: '2025-03-16',
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

describe('customLists composable', () => {
  beforeEach(() => localStorage.clear())

  it('imports', () => {
    const { lists, importList } = useCustomLists()

    expect(lists.value).toHaveLength(0)

    importList(undefined)
    importList(null)
    importList('null')
    importList({})
    importList({ a: 'b' })

    importList([])
    importList([undefined])
    importList([null])
    importList(['null'])
    importList([{}])
    importList([{ a: 'b' }])
    importList([list])

    expect(lists.value).toHaveLength(0)

    importList(list)

    expect(lists.value).toHaveLength(1)
  })

  it('removes', () => {
    const { lists, importList, deleteCustomList } = useCustomLists()

    expect(lists.value).toHaveLength(0)

    importList(list)
    importList({ ...list, id: 'list1' })

    expect(lists.value).toHaveLength(2)

    deleteCustomList({ ...list, id: 'custom-list0' })

    expect(lists.value).toHaveLength(1)
  })

  it('removes all', () => {
    const { lists, importList, deleteAllCustomLists } = useCustomLists()

    expect(lists.value).toHaveLength(0)

    importList(list)
    importList({ ...list, id: 'list1' })

    expect(lists.value).toHaveLength(2)

    deleteAllCustomLists()

    expect(lists.value).toHaveLength(0)
  })
})
