import type { IList } from '@/types'
import { useStorage } from '@vueuse/core'

export function useFavorites() {
  const favorites = useStorage<string[]>('favorites', [])

  function toggleFavorite({ id }: IList) {
    const index = favorites.value.findIndex((item) => item === id)

    if (index >= 0) {
      favorites.value.splice(index, 1)
    } else favorites.value.push(id)
  }

  function isFavorite(list: IList) {
    return favorites.value.includes(list.id)
  }

  return {
    favorites,
    isFavorite,
    toggleFavorite,
  }
}
