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
      <div class="text-lg sm:text-xl flex flex-col gap-2">
        <div>{{ packageDescription }}</div>
      </div>
      <div class="flex flex-col sm:flex-row gap-4 justify-around my-4">
        <a :href="homepageUrl" target="_blank" class="text-center">
          <button class="btn btn-outline btn-primary text-sm font-medium sm:w-auto w-2/3">
            <HouseIcon class="h-5 sm:h-6" /> {{ $t('Homepage') }}
          </button>
        </a>
        <a :href="bugReportUrl" target="_blank" class="text-center">
          <button class="btn btn-outline btn-warning text-sm font-medium sm:w-auto w-2/3">
            <BugIcon class="h-5 sm:h-6" /> {{ $t('Report bug') }}
          </button></a
        >
        <DeleteAllPlaythroughsDialog
          ref="confirmDeleteAllDialog"
          @confirm="deleteAllPlaythroughs"
        />
        <div class="text-center">
          <button
            @click="confirmDeleteAllDialog?.open()"
            class="btn btn-outline btn-error text-sm font-medium sm:w-auto w-2/3"
          >
            <RotateCcwIcon class="h-5 sm:h-6" /> {{ $t('Reset history') }}
          </button>
        </div>
      </div>
      <div class="text-lg opacity-65 gap-2 sm:gap-4 flex sm:flex-row flex-col justify-around">
        <div>{{ $t('Version {version}', { version: packageVersion }) }}</div>
        <div>{{ $t('Created by {author}', { author: packageAuthor }) }}</div>
      </div>
    </template>
  </PopUp>
</template>
