import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
export default defineConfig({
  base: "/shopper/",
  plugins: [react()],
  server: {
    port: 5174,
    proxy: {
      '/shopper/api': {
        target: 'http://localhost:3012',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/shopper/, ''),
      },
    },
  },
  preview: {
    allowedHosts: true,
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
