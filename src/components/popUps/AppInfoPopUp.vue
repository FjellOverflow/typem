<script setup lang="ts">
import { BugIcon, HouseIcon, RotateCcwIcon } from 'lucide-vue-next'
import packageJson from '../../../package.json'
import logo from '@/assets/logo.svg'
import { usePlaythroughs } from '@/composables/playthroughs'

const popUp = useTemplateRef('popUp')

defineExpose({ open: () => popUp.value?.open() })

const {
  name: packageName,
  description: packageDescription,
  version: packageVersion,
  author: packageAuthor,
  homepage: homepageUrl,
  bugs: { url: bugReportUrl },
} = packageJson

const confirmDeleteAllDialog = useTemplateRef('confirmDeleteAllDialog')

const { deleteAllPlaythroughs } = usePlaythroughs()
</script>
<template>
  <PopUp ref="popUp">
    <template #title>
      <div class="flex gap-4 capitalize"><img :src="logo" class="h-10" /> {{ packageName }}</div>
    </template>
    <template #body>
      <div class="text-xl flex flex-col gap-2">
        <div>{{ packageDescription }}</div>
      </div>
      <div class="flex gap-4 justify-around my-4">
        <a :href="homepageUrl" target="_blank">
          <button class="btn btn-outline btn-primary text-sm font-medium">
            <HouseIcon /> {{ $t('Homepage') }}
          </button>
        </a>
        <a :href="bugReportUrl" target="_blank">
          <button class="btn btn-outline btn-warning text-sm font-medium">
            <BugIcon /> {{ $t('Report bug') }}
          </button></a
        >
        <ConfirmDialog
          ref="confirmDeleteAllDialog"
          sentiment="error"
          @confirm="deleteAllPlaythroughs"
        >
          <template #title> {{ $t('Are you sure?') }} </template>
          <template #body>
            {{
              $t(
                'This action removes ALL past playthroughs. Once reset, they can not be recovered.',
              )
            }}
          </template>
        </ConfirmDialog>

        <button
          @click="confirmDeleteAllDialog?.open()"
          class="btn btn-outline btn-error text-sm font-medium"
        >
          <RotateCcwIcon /> {{ $t('Reset history') }}
        </button>
      </div>
      <div class="text-lg opacity-65 gap-4 flex justify-around">
        <div>{{ $t('Version {version}', { version: packageVersion }) }}</div>
        <div>{{ $t('Created by {author}', { author: packageAuthor }) }}</div>
      </div>
    </template>
  </PopUp>
</template>
