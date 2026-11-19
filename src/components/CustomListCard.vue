<script setup lang="ts">
import { useCustomLists } from '@/composables/customLists'
import { useLocalize } from '@/composables/localize'
import { useToasts } from '@/composables/toasts'
import type { IList } from '@/types'
import { TrashIcon } from '@lucide/vue'

const confirmListDeletionDialog = useTemplateRef('confirmListDeletionDialog')

const { localize } = useLocalize()
const { t } = useI18n()
const { sendToast } = useToasts()
const { deleteCustomList } = useCustomLists()

const props = defineProps<{ list: IList }>()

function onConfirmDelete() {
  if (deleteCustomList(props.list))
    sendToast({ message: t('Deleted custom list'), sentiment: 'alert-success' })
  else sendToast({ message: t("Couldn't delete custom list"), sentiment: 'alert-error' })
}
</script>
<template>
  <div class="border rounded-md p-2 flex items-center">
    <DeleteCustomListDialog ref="confirmListDeletionDialog" @confirm="onConfirmDelete" />
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
