<script lang="ts">
import { useListsLoader } from '@/plugins/listLoader'
import CustomListCard from '@/components/CustomListCard.vue'
export { useListsLoader }
</script>

<script setup lang="ts">
import { usePlaythroughs } from '@/composables/playthroughs'
import { downloadJSON } from '@/plugins/util'
import { useTitle } from '@vueuse/core'
import { DownloadIcon, RotateCcwIcon, TrashIcon, TrophyIcon, UploadIcon } from 'lucide-vue-next'
import { useCustomLists } from '@/composables/customLists'

const { t } = useI18n()
useTitle(`${t('Settings')} - Typem`)

const { data: lists } = useListsLoader()
const confirmDeleteAllPlaythroughsDialog = useTemplateRef('confirmDeleteAllPlaythroughsDialog')
const confirmDeleteAllCustomListsDialog = useTemplateRef('confirmDeleteAllCustomListsDialog')

const uploadHistoryJsonDialog = useTemplateRef('uploadHistoryJsonDialog')
const uploadCustomListDialog = useTemplateRef('uploadCustomListDialog')

const { removeAllCustomLists, lists: customLists } = useCustomLists()
const { allPlaythroughs, deleteAllPlaythroughs, getBestListPlaythrough } = usePlaythroughs()

function onClickDownloadAll() {
  downloadJSON(allPlaythroughs.value, `typem_history_${new Date().toISOString()}`)
}

function onClickDownloadRecords() {
  const records = [...new Set(lists.value.map((list) => list.id))]
    .map((listId) => getBestListPlaythrough(listId))
    .filter((p) => !!p)

  downloadJSON(records, `typem_records_${new Date().toISOString()}`)
}
</script>
<template>
  <div class="sm:mb-4 flex flex-col gap-4">
    <DeleteAllPlaythroughsDialog
      ref="confirmDeleteAllPlaythroughsDialog"
      @confirm="deleteAllPlaythroughs"
    />
    <DeleteAllCustomListsDialog
      ref="confirmDeleteAllCustomListsDialog"
      @confirm="removeAllCustomLists"
    />

    <UploadHistoryJsonDialog ref="uploadHistoryJsonDialog" />
    <UploadCustomListDialog ref="uploadCustomListDialog" />

    <CollapsibleBox :model-value="true">
      <template #title>
        <div class="flex flex-col gap-2">
          <span class="text-2xl lg:text-3xl font-medium">{{ $t('History') }}</span>
          <span class="lg:text-xl font-medium">{{
            $t('All past playthroughs played. Saved locally on this device.')
          }}</span>
        </div>
      </template>

      <template #content>
        <div class="flex gap-4 sm:flex-row flex-col items-center sm:items-start sm:p-4 p-0">
          <button
            class="btn btn-outline btn-primary text-sm font-medium sm:w-auto w-2/3"
            @click="onClickDownloadAll"
          >
            <DownloadIcon class="h-5 sm:h-6" /> {{ $t('Export all') }}
          </button>
          <button
            class="btn btn-outline text-sm font-medium sm:w-auto w-2/3"
            @click="onClickDownloadRecords"
          >
            <TrophyIcon class="h-5 sm:h-6" /> {{ $t('Export records only') }}
          </button>
          <button
            class="btn btn-outline text-sm font-medium sm:w-auto w-2/3"
            @click="uploadHistoryJsonDialog?.open()"
          >
            <UploadIcon class="h-5 sm:h-6" /> {{ $t('Import from JSON') }}
          </button>
          <button
            class="btn btn-outline text-sm font-medium sm:w-auto w-2/3"
            @click="confirmDeleteAllPlaythroughsDialog?.open()"
          >
            <RotateCcwIcon class="h-5 sm:h-6" /> {{ $t('Reset') }}
          </button>
        </div>
      </template>
    </CollapsibleBox>

    <CollapsibleBox :model-value="true">
      <template #title>
        <div class="flex flex-col gap-2">
          <span class="text-2xl lg:text-3xl font-medium">{{ $t('Custom lists') }}</span>
          <span class="lg:text-xl font-medium">
            {{ $t('Playable lists, uploaded by the user. Saved locally on this device.') }}
          </span>
        </div>
      </template>

      <template #content>
        <div v-if="customLists.length > 0" class="flex flex-col gap-4 my-4">
          <CustomListCard v-for="list in customLists" :key="list.id" :list />
        </div>
        <div class="flex gap-4 sm:flex-row flex-col items-center sm:items-start sm:p-4 p-0">
          <button
            class="btn btn-outline btn-primary text-sm font-medium sm:w-auto w-2/3"
            @click="uploadCustomListDialog?.open()"
          >
            <UploadIcon class="h-5 sm:h-6" /> {{ $t('Import from JSON') }}
          </button>
          <button
            v-if="customLists.length > 0"
            class="btn btn-outline text-sm font-medium sm:w-auto w-2/3"
            @click="confirmDeleteAllCustomListsDialog?.open()"
          >
            <TrashIcon class="h-5 sm:h-6" /> {{ $t('Remove all') }}
          </button>
        </div>
      </template>
    </CollapsibleBox>
  </div>
  <RouterView />
</template>
