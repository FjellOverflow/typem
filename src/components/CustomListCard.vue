<script setup lang="ts">
import { useCustomLists } from '@/composables/customLists'
import type { IList } from '@/types'
import { TrashIcon } from 'lucide-vue-next'

const confirmListDeletionDialog = useTemplateRef('confirmListDeletionDialog')

const { removeCustomList } = useCustomLists()

defineProps<{ list: IList }>()
</script>
<template>
  <div class="border rounded-lg p-2 flex items-center">
    <DeleteCustomListDialog ref="confirmListDeletionDialog" @confirm="removeCustomList(list)" />
    <RouterLink class="underline text-xl lg:text-2xl font-medium" :to="`/play/${list.id}`">
      {{ list.meta.name }}
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
