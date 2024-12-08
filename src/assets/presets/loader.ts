import { ItemListSchema, type IItemList } from '@/types'
import { NavigationResult } from 'unplugin-vue-router/data-loaders'
import { defineBasicLoader } from 'unplugin-vue-router/data-loaders/basic'

const isLoaded = new Promise((r) => {
  loadPresets().then(() => r(true))
})

const presets: IItemList[] = []

async function loadPresets() {
  const files = import.meta.glob('@/assets/presets/**/[^.]*.json')
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
    presets.push(...results.filter((r) => !!r))
  })

  presets.sort((l1, l2) => l1.meta.name.localeCompare(l2.meta.name))
}

async function getPresets() {
  await isLoaded

  return presets
}

async function getPresetById(id: string): Promise<IItemList> {
  await isLoaded

  const preset = presets.find((item) => item.id === id)

  if (preset) return preset

  throw new Error(`Preset with id "${id}" does not exist.`)
}

export const usePresetLoader = defineBasicLoader('/play/[presetId]', async (to) => {
  try {
    return await getPresetById(to.params.presetId)
  } catch (e) {
    console.error(e)
    return new NavigationResult('/')
  }
})

export const usePresetsLoader = defineBasicLoader('/', async () => getPresets())
