import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './app'),
      '@': path.resolve(__dirname, './app'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      reportsDirectory: './coverage',
      include: [
        'app/components/**/*.{ts,vue}',
        'app/composables/**/*.{ts}',
        'app/utils/**/*.{ts}',
      ],
      exclude: [
        'nuxt.config.ts',
        'vuetify.config.ts',
        'app/app.vue',
        'app/layouts/**',
        'app/pages/**',
        'app/plugins/**',
        'app/types/**',      
        'server/**',
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 75,
        statements: 80,
      },
    },
  },
})
