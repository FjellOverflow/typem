<script setup lang="ts">
import { matchKeyword } from '@/plugins/util'
import type { IItemList } from '@/types'
import { Gamepad2, X } from 'lucide-vue-next'
import { useRouteQuery } from '@vueuse/router'

const props = defineProps<{
  lists: IItemList[]
}>()

const filterKeyword = useRouteQuery('keyword', '')

const filtersActive = computed(() => !!filterKeyword.value)

const filteredPresets = computed(() =>
  props.lists.filter((list) => matchKeyword(list.meta.name, filterKeyword.value)),
)

function resetFilters() {
  filterKeyword.value = ''
}
</script>
<template>
  <div class="flex w-full my-2">
    <input
      type="text"
      placeholder="Type to filter"
      class="input input-bordered w-56"
      v-model="filterKeyword"
    />
    <button
      class="ml-auto btn btn-outline text-xl font-medium"
      @click="resetFilters"
      :disabled="!filtersActive"
    >
      <X /> Clear
    </button>
  </div>
  <ListPreview v-for="preset in filteredPresets" :key="preset.id" :list="preset" class="mt-4">
    <template #action>
      <button
        class="btn btn-outline btn-primary text-xl font-medium"
        @click="$router.push(`/play/${preset.id}`)"
      >
        {{ $t('play.label') }} <Gamepad2 />
      </button>
    </template>
  </ListPreview>
  <div v-if="filteredPresets.length === 0" class="w-full flex justify-center text-3xl mt-8">
    No results found
  </div>
</template>
