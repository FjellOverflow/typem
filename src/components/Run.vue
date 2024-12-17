<script setup lang="ts">
import { getListById } from '@/assets/lists/loader'
import { useHistory } from '@/composables/history'
import { formatSeconds } from '@/plugins/util'
import { type IItemList, type IRun } from '@/types'
import { BanIcon, CheckIcon, TrophyIcon } from 'lucide-vue-next'

const props = defineProps<{
  run: IRun
}>()

const { getBestRun } = useHistory()

const list = ref<IItemList>()
const isRecord = ref(false)

loadList()

watch(props.run, loadList)

async function loadList() {
  const result = await getListById(props.run.listId)

  if (result) {
    list.value = result
    const record = getBestRun(result.id)
    isRecord.value = !!record && record.seconds === props.run.seconds
  }
}
</script>
<template>
  <div v-if="list" class="border rounded-lg p-4 flex flex-col gap-4">
    <div class="text-3xl font-medium flex justify-between">
      <span class="underline">
        <RouterLink :to="`/play/${list.id}`">{{ list.meta.name }}</RouterLink>
      </span>
      <span>
        {{ formatSeconds(run.seconds) }}
      </span>
    </div>

    <div class="text-lg font-medium flex justify-between">
      <span class="opacity-50">{{ new Date(run.timestamp).toLocaleString() }}</span>
      <div v-if="isRecord" class="badge badge-outline badge-primary h-7 p-2 flex gap-1">
        <TrophyIcon :size="14" /> Record
      </div>
      <template v-else>
        <div v-if="run.finished" class="badge badge-outline badge-success h-7 p-2 flex gap-1">
          <CheckIcon :size="14" /> Finished
        </div>
        <div v-else class="badge badge-outline badge-error h-7 p-2 flex gap-1">
          <BanIcon :size="14" /> Matched {{ run.numberOfMatches }}/{{ list.items.length }}
        </div>
      </template>
    </div>
  </div>
</template>
