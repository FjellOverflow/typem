<script setup lang="ts">
import { usePlaythroughs } from '@/composables/playthroughs'
import { getListById } from '@/plugins/listLoader'
import { getSecondsPerItem, formatDuration } from '@/plugins/util'
import { type IList, type IListPlaythrough } from '@/types'
import { BanIcon, CheckIcon, TrashIcon, TrophyIcon } from 'lucide-vue-next'

const confirmDeletionDialog = useTemplateRef('confirmDeletionDialog')

const props = defineProps<{
  run: IListPlaythrough
}>()

const { getBestListPlaythrough, deletePlaythrough } = usePlaythroughs()

const list = ref<IList>()
const isRecord = ref(false)

loadList()

watch(props.run, loadList)

async function loadList() {
  const result = await getListById(props.run.listId)

  if (result) {
    list.value = result
    const record = getBestListPlaythrough(result.id)
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
      <div class="flex flex-col items-end">
        <span> {{ formatDuration(run.seconds) }}</span>
        <span class="opacity-65 text-base">
          {{ getSecondsPerItem(run.numberOfMatches, run.seconds) }}
        </span>
      </div>
    </div>

    <div class="text-lg font-medium grid grid-cols-4 w-full">
      <div class="col-span-3 flex justify-between items-end">
        <div class="flex gap-2">
          <div v-if="isRecord" class="badge badge-outline badge-primary h-7 p-2 flex gap-1">
            <TrophyIcon :size="14" /> {{ $t('Record') }}
          </div>
          <div class="mx-auto" />
          <div v-if="run.finished" class="badge badge-outline badge-success h-7 p-2 flex gap-1">
            <CheckIcon :size="14" /> {{ $t('Finished') }}
          </div>
          <div v-else class="badge badge-outline badge-error h-7 p-2 flex gap-1">
            <BanIcon :size="14" />
            {{ $t('Matched {number}', { number: `${run.numberOfMatches}/${list.items.length}` }) }}
          </div>
        </div>
        <span class="opacity-50">{{ new Date(run.timestamp).toLocaleString() }}</span>
      </div>

      <div class="flex justify-end">
        <ConfirmDialog
          ref="confirmDeletionDialog"
          @confirm="deletePlaythrough(run)"
          sentiment="error"
        >
          <template #title> {{ $t('Are you sure?') }} </template>
          <template #body>
            {{ $t('Once deleted, the playthrough can not be recovered.') }}
          </template>
        </ConfirmDialog>
        <button @click="confirmDeletionDialog?.open()" class="btn btn-ghost">
          <TrashIcon />
        </button>
      </div>
    </div>
  </div>
</template>
