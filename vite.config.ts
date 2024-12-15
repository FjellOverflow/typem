import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueRouter from 'unplugin-vue-router/vite'
import vueLayouts from 'vite-plugin-vue-layouts'
import vueComponents from 'unplugin-vue-components/vite'
import autoImports from 'unplugin-auto-import/vite'

export default defineConfig({
  plugins: [
    vueRouter(),
    vue(),
    vueLayouts(),
    vueComponents(),
    autoImports({
      imports: [
        'vue',
        'vue-router',
        'vue-i18n',
        {
          '@vueuse/core': ['useStorage'],
        },
      ],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
