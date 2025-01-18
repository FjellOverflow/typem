import { defineConfig } from 'cypress'

// TODO: write e2e tests

export default defineConfig({
  e2e: {
    specPattern: 'cypress/e2e/**/*.{cy,spec}.{js,ts}',
    baseUrl: 'http://localhost:4173',
  },
})
