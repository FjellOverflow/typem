import { useRouteQuery } from '@vueuse/router'
import type { z } from 'zod'

export type RouteQuerySchema = z.ZodObject<Record<string, z.ZodType<string>>>

export function useParsedRouteQuery<Schema extends RouteQuerySchema>(schema: Schema) {
  const fields = Object.entries(schema.shape).map(([name, fieldSchema]) => {
    const defaultValue = fieldSchema.parse(undefined)
    const value = useRouteQuery<string, string>(name, defaultValue, {
      transform: (raw) => fieldSchema.parse(raw),
    })

    return { name, defaultValue, value }
  })

  const isDefault = computed(() =>
    fields.every((field) => field.value.value === field.defaultValue),
  )

  function reset() {
    for (const field of fields) field.value.value = field.defaultValue
  }

  const query = reactive(Object.fromEntries(fields.map((field) => [field.name, field.value])))

  return { query: query as unknown as z.output<Schema>, isDefault, reset }
}
