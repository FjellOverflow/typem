<script setup lang="ts">
import { useCustomLists } from '@/composables/customLists'
import { useLocalize } from '@/composables/localize'
import type { IList } from '@/types'
import { TrashIcon } from 'lucide-vue-next'

const confirmListDeletionDialog = useTemplateRef('confirmListDeletionDialog')

const { localize } = useLocalize()
const { deleteCustomList } = useCustomLists()

defineProps<{ list: IList }>()
</script>
<template>
  <div class="border rounded-md p-2 flex items-center">
    <DeleteCustomListDialog ref="confirmListDeletionDialog" @confirm="deleteCustomList(list)" />
    <RouterLink class="underline text-xl lg:text-2xl font-medium" :to="`/play/${list.id}`">
      {{ localize(list.meta.name) }}
    </RouterLink>
    <div
      class="tooltip tooltip-bottom before:max-w-28 ml-auto"
      :data-tip="$t('Delete custom list')"
    >
      <button class="btn btn-ghost" @click="confirmListDeletionDialog?.open()">
        <TrashIcon />
      </button>
    </div>
  </div>
</template>
