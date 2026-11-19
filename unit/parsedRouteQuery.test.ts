import { describe, it, expect } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import { z } from 'zod'
import { useParsedRouteQuery } from '@/composables/parsedRouteQuery'

const ShelfQuerySchema = z.object({
  title: z.string().catch(''),
  order: z.enum(['newest', 'oldest']).catch('newest'),
})

async function openShelf(url: string) {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/', component: { template: '<div />' } }],
  })
  await router.push(url)

  let shelf: ReturnType<typeof useParsedRouteQuery<typeof ShelfQuerySchema>> | undefined

  mount(
    {
      template: '<div />',
      setup() {
        shelf = useParsedRouteQuery(ShelfQuerySchema)
      },
    },
    { global: { plugins: [router] } },
  )

  if (!shelf) throw new Error()
  return { router, ...shelf }
}

describe('parsed route query composable', () => {
  it('reads the query from the URL', async () => {
    const { query, isDefault } = await openShelf('/?title=dune&order=oldest')

    expect({ ...query }).toEqual({ title: 'dune', order: 'oldest' })
    expect(isDefault.value).toBe(false)
  })

  it('uses the default for a missing or unknown value', async () => {
    const { query, isDefault } = await openShelf('/?order=sideways')

    expect({ ...query }).toEqual({ title: '', order: 'newest' })
    expect(isDefault.value).toBe(true)
  })

  it('writes a changed value to the URL', async () => {
    const { router, query } = await openShelf('/')

    query.order = 'oldest'
    await flushPromises()

    expect(router.currentRoute.value.query.order).toBe('oldest')
  })

  it('resets every value to its default', async () => {
    const { router, query, isDefault, reset } = await openShelf('/?title=dune&order=oldest')

    reset()
    await flushPromises()

    expect({ ...query }).toEqual({ title: '', order: 'newest' })
    expect(isDefault.value).toBe(true)
    expect(router.currentRoute.value.query).toEqual({})
  })
})
