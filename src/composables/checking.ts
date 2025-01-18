import type { ICheckableListItem, IListItem, ISettings } from '@/types'

const checkInput =
  (withWhitespaces: boolean, withCapitalization: boolean) => (input: string, item: IListItem) => {
    let processedInput = `${input}`
    let potentialMatches = [...item.matches]

    if (!withWhitespaces) {
      processedInput = processedInput.replace(/ /g, '')
      potentialMatches = potentialMatches.map((m) => m.replace(/ /g, ''))
    }

    if (!withCapitalization) {
      processedInput = processedInput.toLowerCase()
      potentialMatches = potentialMatches.map((m) => m.toLowerCase())
    }

    return potentialMatches.some((m) => m === processedInput)
  }

export function useChecking(rawItems: IListItem[], settings: ISettings, onDone: () => void) {
  const checkFun = checkInput(settings.requireWhitespaces, settings.requireCapitalization)

  const items = ref<ICheckableListItem[]>([
    ...rawItems.map((item) => ({ ...item, checked: false })),
  ])

  function check(input: string) {
    const matchedItem = items.value
      .filter((item) => !item.checked)
      .find((item) => checkFun(input, item))

    if (matchedItem) {
      matchedItem.checked = true
      if (items.value.every((item) => item.checked)) onDone()

      return matchedItem
    }
  }

  return {
    items,
    check,
  }
}

export function useOrderedChecking(rawItems: IListItem[], settings: ISettings, onDone: () => void) {
  const checkFun = checkInput(settings.requireWhitespaces, settings.requireCapitalization)

  const items = ref<ICheckableListItem[]>([
    ...rawItems.map((item) => ({ ...item, checked: false })),
  ])

  function check(input: string) {
    const item = items.value.filter((item) => !item.checked)[0]

    if (!item) return

    if (checkFun(input, item)) {
      item.checked = true
      if (items.value.every((item) => item.checked)) onDone()
      return item
    }
  }

  return {
    items,
    check,
  }
}
