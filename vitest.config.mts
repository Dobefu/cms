import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { coverageConfigDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['vitestSetup.ts'],
    coverage: {
      enabled: true,
      provider: 'v8',
      reporter: ['text', 'lcov', 'html'],
      exclude: [
        ...coverageConfigDefaults.exclude,
        'next.config.ts',
        'postcss.config.mjs',
        'tailwind.config.ts',
        'src/fetch-locales.ts',
        'src/mdx-components.tsx',
        '**/layout.tsx',
        '**/root-layout.tsx',
        '**/root-layout.client.tsx',
        'src/types/**',
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        statements: 80,
        branches: 80,
      },
    },
  },
})
