<script setup lang="ts">
import { usePlaythroughs } from '@/composables/playthroughs'
import { getListById } from '@/plugins/listLoader'
import { getSecondsPerItem, formatDuration } from '@/plugins/util'
import { type IList, type IListPlaythrough } from '@/types'
import { BanIcon, CheckIcon, TrashIcon, TrophyIcon } from 'lucide-vue-next'
import DeletePlaythroughDialog from './dialogs/DeletePlaythroughDialog.vue'

const confirmDeletionDialog = useTemplateRef('confirmDeletionDialog')

const props = defineProps<{
  playthrough: IListPlaythrough
}>()

const { getBestListPlaythrough, deletePlaythrough } = usePlaythroughs()

const list = ref<IList>()
const isRecord = ref(false)

loadList()

watch(props.playthrough, loadList)

async function loadList() {
  const result = await getListById(props.playthrough.listId)

  if (result) {
    list.value = result
    const record = getBestListPlaythrough(result.id)
    isRecord.value = !!record && record.seconds === props.playthrough.seconds
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
        <span> {{ formatDuration(playthrough.seconds) }}</span>
        <span class="opacity-65 text-base">
          {{ getSecondsPerItem(playthrough.numberOfMatches, playthrough.seconds) }}
        </span>
      </div>
    </div>

    <div class="text-lg font-medium grid grid-cols-4 w-full">
      <div class="col-span-3 flex justify-between items-end">
        <div class="flex gap-2">
          <div
            v-if="isRecord"
            class="tooltip tooltip-bottom cursor-default"
            :data-tip="
              playthrough.finished
                ? $t('This is your fastest time finishing the list!')
                : $t('This is the playthrough in which you named the most items!')
            "
          >
            <div class="badge badge-outline badge-primary h-7 p-2 flex gap-1">
              <TrophyIcon :size="14" /> {{ $t('Record') }}
            </div>
          </div>

          <div class="mx-auto" />

          <div
            v-if="playthrough.finished"
            class="tooltip tooltip-bottom cursor-default"
            :data-tip="$t('You named all items on the list!')"
          >
            <div class="badge badge-outline badge-success h-7 p-2 flex gap-1">
              <CheckIcon :size="14" /> {{ $t('Finished') }}
            </div>
          </div>

          <div
            v-else
            class="tooltip tooltip-bottom cursor-default"
            :data-tip="
              $t('You only named {actual} of {total} items', {
                actual: playthrough.numberOfMatches,
                total: list.items.length,
              })
            "
          >
            <div class="badge badge-outline badge-error h-7 p-2 flex gap-1">
              <BanIcon :size="14" />
              {{
                $t('Matched {number}', {
                  number: `${playthrough.numberOfMatches}/${list.items.length}`,
                })
              }}
            </div>
          </div>
        </div>
        <span class="opacity-50">{{ new Date(playthrough.timestamp).toLocaleString() }}</span>
      </div>

      <div class="flex justify-end">
        <DeletePlaythroughDialog
          ref="confirmDeletionDialog"
          @confirm="deletePlaythrough(playthrough)"
        />
        <div class="tooltip tooltip-bottom" :data-tip="$t('Delete playthrough')">
          <button @click="confirmDeletionDialog?.open()" class="btn btn-ghost">
            <TrashIcon />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
