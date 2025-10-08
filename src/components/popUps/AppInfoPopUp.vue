<script setup lang="ts">
import { BugIcon, DownloadIcon, HouseIcon, SettingsIcon } from 'lucide-vue-next'
import packageJson from '../../../package.json'
import logo from '@/assets/logo.svg'
import { pwaInstallPromptEvent } from '@/plugins/pwaInstall'

const popUp = useTemplateRef('popUp')

defineExpose({ open: () => popUp.value?.open() })

const {
  name: packageName,
  version: packageVersion,
  author: packageAuthor,
  homepage: homepageUrl,
  bugs: { url: bugReportUrl },
} = packageJson
</script>
<template>
  <PopUp ref="popUp">
    <template #title>
      <div class="flex gap-4 capitalize"><img :src="logo" class="h-10" /> {{ packageName }}</div>
    </template>
    <template #body>
      <div class="text-lg sm:text-xl flex flex-col gap-2">
        <div>{{ $t('Type out the list items as quickly as possible.') }}</div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
        <div v-if="pwaInstallPromptEvent" class="text-center">
          <button
            ref="pwaInstallButton"
            class="btn btn-outline btn-primary text-sm font-medium w-3/4"
            @click="pwaInstallPromptEvent.prompt()"
          >
            <DownloadIcon class="h-5 sm:h-6" /> {{ $t('Install as app') }}
          </button>
        </div>
        <div class="text-center">
          <RouterLink
            to="/settings"
            class="btn btn-outline text-sm font-medium w-3/4"
            @click="popUp?.close()"
          >
            <SettingsIcon class="h-5 sm:h-6" /> {{ $t('Settings') }}
          </RouterLink>
        </div>

        <a :href="homepageUrl" target="_blank" class="text-center">
          <button class="btn btn-outline text-sm font-medium w-3/4">
            <HouseIcon class="h-5 sm:h-6" /> {{ $t('Homepage') }}
          </button>
        </a>
        <a :href="bugReportUrl" target="_blank" class="text-center">
          <button class="btn btn-outline text-sm font-medium w-3/4">
            <BugIcon class="h-5 sm:h-6" /> {{ $t('Report bug') }}
          </button></a
        >
      </div>
      <div class="text-lg opacity-65 gap-2 sm:gap-4 flex sm:flex-row flex-col justify-around">
        <div>{{ $t('Version {version}', { version: packageVersion }) }}</div>
        <div>{{ $t('Created by {author}', { author: packageAuthor }) }}</div>
      </div>
    </template>
  </PopUp>
</template>
