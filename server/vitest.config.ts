

import { defineConfig } from 'vitest/config'

// Vitest configuration for the server — node environment, global test helpers enabled

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    include: ['src/__tests__/unit/**/*.test.ts', 'src/__tests__/integration/**/*.test.ts','src/__tests__/scenarios/**/*.test.ts'],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
    },
  }
})
