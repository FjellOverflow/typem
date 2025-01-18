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

const confirmResetModal = useTemplateRef('confirmResetModal')

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
            <HouseIcon /> {{ $t('index.info.homepage') }}
          </button>
        </a>
        <a :href="bugReportUrl" target="_blank">
          <button class="btn btn-outline btn-warning text-sm font-medium">
            <BugIcon /> {{ $t('index.info.issues') }}
          </button></a
        >

        <dialog ref="confirmResetModal" class="modal">
          <div class="modal-box border rounded-lg">
            <h3 class="text-lg font-bold">Are you sure?</h3>
            <p class="py-4">
              This action removes ALL past runs. Once reset, the history can not be recovered.
            </p>
            <div class="modal-action">
              <form method="dialog">
                <button @click="deleteAllPlaythroughs" class="btn btn-error btn-outline mr-4">
                  Confirm
                </button>
                <button class="btn btn-outline">Close</button>
              </form>
            </div>
          </div>
        </dialog>
        <button
          @click="confirmResetModal?.showModal()"
          class="btn btn-outline btn-error text-sm font-medium"
        >
          <RotateCcwIcon /> {{ $t('index.info.resetHistory') }}
        </button>
      </div>
      <div class="text-lg opacity-65 gap-4 flex justify-around">
        <div>{{ $t('index.info.version', { version: packageVersion }) }}</div>
        <div>{{ $t('index.info.author', { author: packageAuthor }) }}</div>
      </div>
    </template>
  </PopUp>
</template>
