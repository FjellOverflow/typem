import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    viewportWidth: 1920,
    viewportHeight: 1080,
    specPattern: 'cypress/e2e/**/*.{cy,spec}.{js,ts}',
    baseUrl: 'http://localhost:4173',
  },
})
