import type { ICheckableListItem, IListItem, ISettings } from '@/types'

const shuffleItems = <T>(items: T[]): T[] => {
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[items[i], items[j]] = [items[j], items[i]]
  }
  return items
}

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

export function useChecking(
  rawItems: IListItem[],
  { requireWhitespaces, requireCapitalization, requireOrder, shuffle }: ISettings,
  onDone: () => void,
) {
  const checkFun = checkInput(requireWhitespaces, requireCapitalization)

  const items = ref<ICheckableListItem[]>([
    ...rawItems.map((item) => ({ ...item, checked: false })),
  ])

  if (shuffle) shuffleItems(items.value)

  function check(input: string) {
    let availableItems = items.value.filter((item) => !item.checked)

    if (requireOrder) availableItems = [availableItems[0]]

    const matchedItem = availableItems.find((item) => checkFun(input, item))

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
