import { useCustomLists } from '@/composables/customLists'
import { ListSchema, type IList } from '@/types'
import { NavigationResult } from 'unplugin-vue-router/data-loaders'
import { defineBasicLoader } from 'unplugin-vue-router/data-loaders/basic'

const { lists: customLists } = useCustomLists()

const builtInLists: IList[] = []

const lists = computed(() => [...builtInLists, ...customLists.value])

const isLoaded = new Promise(async (resolve) => {
  const files = import.meta.glob('@/assets/lists/**/[^.]*.json')

  const promises = Object.entries(files).map(([fileName, file]) =>
    file().then((loadedFile) => {
      try {
        const list = ListSchema.parse((loadedFile as { default: unknown }).default)
        return list
      } catch (e) {
        console.error(`Encountered ${(e as Error).name} when loading ${fileName}. Skipping file.`)
      }
    }),
  )

  const results = await Promise.all(promises)
  builtInLists.push(...results.filter((r) => !!r))

  resolve(true)
})

export async function getListById(listId: string): Promise<IList> {
  await isLoaded

  const list = lists.value.find(({ id }) => id === listId)

  if (list) return list

  throw new Error(`List with id "${listId}" does not exist.`)
}

export const useListsLoader = defineBasicLoader('/', async () => {
  await isLoaded

  return lists.value
})

export const useListLoader = defineBasicLoader('/play/[listId]', async (to) => {
  try {
    return await getListById(to.params.listId)
  } catch (e) {
    console.error(e)
    return new NavigationResult('/')
  }
})
