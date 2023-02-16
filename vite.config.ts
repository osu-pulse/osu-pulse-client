import path from 'path'
import Vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'
import SvgLoader from 'vite-svg-loader'

export default defineConfig({
  base: './',

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },

  test: {
    coverage: {
      all: true,
      include: [
        'src/**/components/*.vue',
        'src/**/views/*.vue',
        'src/**/hooks/*.ts',
        'src/**/services/*.ts',
        'src/**/filters/*.ts',
        'src/**/guards/*.ts',
        'src/**/utils/*.ts',
      ],
      reportsDirectory: 'coverage',
    },
  },

  plugins: [Vue(), SvgLoader()],
})
