import { ListSchema, type IList } from '@/types'
import { useToasts } from '@/composables/toasts'
import i18n from '@/plugins/i18n'

export function useCustomLists() {
  const { sendToast } = useToasts()

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

  function deleteAllCustomLists() {
    lists.value = []
    sendToast({
      message: i18n.global.t('Deleted all custom lists'),
      sentiment: 'alert-success',
    })
  }

  function deleteCustomList(list: IList) {
    const index = lists.value.findIndex((l) => l.id === list.id)

    if (index >= 0) {
      lists.value.splice(index, 1)
      sendToast({
        message: i18n.global.t('Deleted custom list'),
        sentiment: 'alert-success',
      })
    } else {
      sendToast({
        message: i18n.global.t("Couldn't delete custom list"),
        sentiment: 'alert-error',
      })
    }
  }

  return {
    importList,
    lists,
    deleteAllCustomLists,
    deleteCustomList,
  }
}
