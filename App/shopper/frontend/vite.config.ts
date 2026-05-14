import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: "/shopper/",
  plugins: [react()],
  server: {
    port: 5174,
  },
  resolve: {
    tsconfigPaths: true
  },
  test: {
    environment: 'jsdom',
    testTimeout: 10000,
    hookTimeout: 20000,
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      include: [
        'src/**',
      ],
      exclude: [
        'src/app/layout.tsx',
        'src/**/index.ts',
        'src/main.tsx'
      ],
    },
  },
})
