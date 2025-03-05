import { ListSchema, type IList } from '@/types'

export function useCustomLists() {
  const lists = useStorage<IList[]>('customLists', [])

  function importList(o: unknown): boolean {
    try {
      const newList = ListSchema.parse(o)
      newList.id = `custom-${newList.id}`
      newList.meta.isCustom = true

      if (!lists.value.map((l) => l.id).includes(newList.id)) lists.value.push(newList)
      else return false
    } catch (e) {
      console.debug(e)
      return false
    }

    return true
  }

  function removeAllCustomLists() {
    lists.value = []
  }

  function removeCustomList(list: IList) {
    const index = lists.value.findIndex((l) => l.id === list.id)

    if (index >= 0) lists.value.splice(index, 1)
  }

  return {
    importList,
    lists,
    removeAllCustomLists,
    removeCustomList,
  }
}
