import { fileURLToPath, URL } from 'node:url'
import { VitePWA } from 'vite-plugin-pwa'
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
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Typem',
        short_name: 'Typem',
        description: 'Type out the list items as quickly as possible',
        icons: [
          {
            src: '/web-app-manifest-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable',
          },
          {
            src: '/web-app-manifest-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
          {
            src: '/web-app-manifest-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
        ],
        theme_color: '#7480ff',
        background_color: '#ffffff',
        display: 'standalone',
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
