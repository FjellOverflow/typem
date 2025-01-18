<script setup lang="ts">
import { BugIcon, HouseIcon, RotateCcwIcon } from 'lucide-vue-next'
import packageJson from '../../package.json'
import logo from '@/assets/logo.svg'
import { usePlaythroughs } from '@/composables/playthroughs'

const {
  name: packageName,
  description: packageDescription,
  version: packageVersion,
  author: packageAuthor,
  homepage: homepageUrl,
  bugs: { url: bugReportUrl },
} = packageJson

const appInfoModal = useTemplateRef('appInfoDialog')
const confirmResetModal = useTemplateRef('confirmResetModal')

const { deleteAllPlaythroughs } = usePlaythroughs()

defineExpose({ open: () => appInfoModal.value?.showModal() })
</script>
<template>
  <dialog ref="appInfoDialog" class="modal">
    <div class="modal-box border rounded-lg w-xl flex flex-col gap-4">
      <div class="text-4xl flex gap-4 capitalize">
        <img :src="logo" class="h-10" /> {{ packageName }}
      </div>
      <div class="text-xl flex flex-col gap-2">
        <div>{{ packageDescription }}</div>
      </div>
      <div class="flex gap-4 justify-around my-4">
        <a :href="homepageUrl" target="_blank">
          <button class="btn btn-outline btn-primary text-sm font-medium">
            <HouseIcon /> Homepage
          </button>
        </a>
        <a :href="bugReportUrl" target="_blank">
          <button class="btn btn-outline btn-warning text-sm font-medium">
            <BugIcon /> Report bug
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
          <RotateCcwIcon /> Reset history
        </button>
      </div>
      <div class="text-lg opacity-65 gap-4 flex justify-around">
        <div>Version {{ packageVersion }}</div>
        <div>Created by {{ packageAuthor }}</div>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button>close</button>
    </form>
  </dialog>
</template>
