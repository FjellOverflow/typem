import type { IItemList } from '@/types'
import { useStorage } from '@vueuse/core'

export function useFavorites() {
  const favorites = useStorage<string[]>('favorites', [])

  function toggleFavorite({ id }: IItemList) {
    const index = favorites.value.findIndex((item) => item === id)

    if (index >= 0) {
      favorites.value.splice(index, 1)
    } else favorites.value.push(id)
  }

  function isFavorite(list: IItemList) {
    return favorites.value.includes(list.id)
  }

  return {
    favorites,
    isFavorite,
    toggleFavorite,
  }
}
