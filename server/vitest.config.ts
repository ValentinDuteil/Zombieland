

import { defineConfig } from 'vitest/config'

// Vitest configuration for the server — node environment, global test helpers enabled

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    include: ['src/__tests__/**/*.test.ts'],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
    },
  }
})
