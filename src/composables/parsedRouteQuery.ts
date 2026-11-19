import { useRouteQuery } from '@vueuse/router'
import type { z } from 'zod'

type RouteQuerySchema = z.ZodObject<Record<string, z.ZodType<string>>>

export function useParsedRouteQuery<Schema extends RouteQuerySchema>(schema: Schema) {
  const fields = Object.entries(schema.shape).map(([name, fieldSchema]) => {
    const defaultValue = fieldSchema.parse(undefined)
    const routeValue = useRouteQuery<string, string>(name, defaultValue, {
      transform: (raw) => fieldSchema.parse(raw),
    })

    return { name, defaultValue, routeValue }
  })

  const isDefault = computed(() =>
    fields.every((field) => field.routeValue.value === field.defaultValue),
  )

  function reset() {
    for (const field of fields) field.routeValue.value = field.defaultValue
  }

  const query = reactive(Object.fromEntries(fields.map((field) => [field.name, field.routeValue])))

  return { query: query as z.output<Schema>, isDefault, reset }
}
