import { describe, it, expect } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import { z } from 'zod'
import { useParsedRouteQuery } from '@/composables/parsedRouteQuery'

const PlanetQuerySchema = z.object({
  name: z.string().catch(''),
  order: z.enum(['nearest', 'farthest']).catch('nearest'),
})

async function openPlanetQuery(url: string) {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/', component: { template: '<div />' } }],
  })
  await router.push(url)

  let planetQuery: ReturnType<typeof useParsedRouteQuery<typeof PlanetQuerySchema>> | undefined

  mount(
    {
      template: '<div />',
      setup() {
        planetQuery = useParsedRouteQuery(PlanetQuerySchema)
      },
    },
    { global: { plugins: [router] } },
  )

  if (!planetQuery) throw new Error('The component setup did not run')
  return { router, ...planetQuery }
}

describe('parsed route query composable', () => {
  it('reads the query from the URL', async () => {
    const { query, isDefault } = await openPlanetQuery('/?name=mars&order=farthest')

    expect({ ...query }).toEqual({ name: 'mars', order: 'farthest' })
    expect(isDefault.value).toBe(false)
  })

  it('uses the default for a missing or unknown value', async () => {
    const { query, isDefault } = await openPlanetQuery('/?order=sideways')

    expect({ ...query }).toEqual({ name: '', order: 'nearest' })
    expect(isDefault.value).toBe(true)
  })

  it('writes a changed value to the URL', async () => {
    const { router, query } = await openPlanetQuery('/')

    query.order = 'farthest'
    await flushPromises()

    expect(router.currentRoute.value.query.order).toBe('farthest')
  })

  it('resets every value to its default', async () => {
    const { router, query, isDefault, reset } = await openPlanetQuery('/?name=mars&order=farthest')

    reset()
    await flushPromises()

    expect({ ...query }).toEqual({ name: '', order: 'nearest' })
    expect(isDefault.value).toBe(true)
    expect(router.currentRoute.value.query).toEqual({})
  })
})
