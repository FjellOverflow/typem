import { ItemListSchema, type IItemList } from '@/types'
import { NavigationResult } from 'unplugin-vue-router/data-loaders'
import { defineBasicLoader } from 'unplugin-vue-router/data-loaders/basic'

const isLoaded = new Promise((r) => {
  loadLists().then(() => r(true))
})

const lists: IItemList[] = []

async function loadLists() {
  const files = import.meta.glob('@/assets/lists/**/[^.]*.json')
  const promises = Object.entries(files).map(([fileName, file]) =>
    file().then((loadedFile) => {
      try {
        const list = ItemListSchema.parse((loadedFile as { default: unknown }).default)
        return list
      } catch (e) {
        console.error(`Encountered ${(e as Error).name} when loading ${fileName}. Skipping file.`)
      }
    }),
  )

  await Promise.all(promises).then((results) => {
    lists.push(...results.filter((r) => !!r))
  })

  lists.sort((l1, l2) => l1.meta.name.localeCompare(l2.meta.name))
}

async function getLists() {
  await isLoaded

  return lists
}

export async function getListById(listId: string): Promise<IItemList> {
  await isLoaded

  const list = lists.find(({ id }) => id === listId)

  if (list) return list

  throw new Error(`List with id "${listId}" does not exist.`)
}

export const useListLoader = defineBasicLoader('/play/[listId]', async (to) => {
  try {
    return await getListById(to.params.listId)
  } catch (e) {
    console.error(e)
    return new NavigationResult('/')
  }
})

export const useListsLoader = defineBasicLoader('/', async () => getLists())
