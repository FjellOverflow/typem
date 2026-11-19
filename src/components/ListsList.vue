<script setup lang="ts">
import { queryLists, useListQuery } from '@/composables/listQuery'
import { useLocalize } from '@/composables/localize'
import { usePlaythroughs } from '@/composables/playthroughs'
import type { IList } from '@/types'
import { FilterIcon, Gamepad2Icon } from '@lucide/vue'

const props = withDefaults(
  defineProps<{
    lists: IList[]
    noDataText?: string
  }>(),
  {
    noDataText: 'No lists found',
  },
)

const { localize } = useLocalize()
const { progressOf } = usePlaythroughs()
const { query, isDefault } = useListQuery()

const availableTags = computed(() => [...new Set(props.lists.flatMap((list) => list.meta.tags))])

const filteredLists = computed(() =>
  queryLists(props.lists, query, { localize: localize.value, progressOf }),
)
</script>
<template>
  <CollapsibleBox :model-value="false">
    <template #title>
      <div class="flex gap-2 items-center">
        <FilterIcon :class="{ 'fill-primary text-primary': !isDefault }" />
        {{ $t('Filters') }}
      </div>
    </template>
    <template #content>
      <ListFilters :tags="availableTags" />
    </template>
  </CollapsibleBox>

  <ListPreviewCard v-for="list in filteredLists" :key="list.id" :list class="mt-4 last:mb-8">
    <template #action>
      <button
        class="btn btn-outline btn-primary font-medium sm:text-xl"
        @click="$router.push(`/play/${list.id}`)"
      >
        {{ $t("Let's play!") }} <Gamepad2Icon />
      </button>
    </template>
  </ListPreviewCard>

  <div
    v-if="filteredLists.length === 0"
    class="w-full flex justify-center text-2xl lg:text-3xl mt-8"
  >
    {{ isDefault ? noDataText : $t('No lists matching filters.') }}
  </div>
</template>
