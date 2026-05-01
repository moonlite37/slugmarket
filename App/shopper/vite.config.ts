import {defineConfig, configDefaults} from 'vitest/config';
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'node',
    exclude:[
      ...configDefaults.exclude, 
      'build/*'
    ],
    coverage: {
      include: [
        'src/**',
        'test/**',
      ],
      exclude: [
        
      ],
    },
  },
})


