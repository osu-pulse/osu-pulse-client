import path from 'path';
import Vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { defineConfig } from 'vitest/config';
import { PrimeVueResolver } from 'unplugin-vue-components/resolvers';
import { iconNames } from 'bootstrap-icons-vue';
import SvgLoader from 'vite-svg-loader';

export default defineConfig({
  base: './',

  resolve: {
    alias: {
      '~/': `${path.resolve(__dirname, 'src')}/`,
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

  plugins: [
    Vue(),

    SvgLoader(),

    AutoImport({
      imports: [
        'vue',
        'vue-router',
        '@vueuse/core',
        'vitest',
        {
          '@vue/apollo-composable': [
            'useQuery',
            'useMutation',
            'useSubscription',
          ],
          'graphql-tag': [['default', 'gql']],
          'bootstrap-icons-vue': iconNames,
        },
      ],
      dirs: [
        './src/**/components',
        './src/**/dto',
        './src/**/flows',
        './src/**/hooks',
        './src/**/services',
        './src/**/types',
        './src/**/stores',
        './src/**/constants',
        './src/**/utils',
        './src/**/router',
      ],
      vueTemplate: true,
      dts: './src/auto-imports.d.ts',
    }),

    Components({
      dirs: ['./src/**/views', './src/**/components'],
      resolvers: [
        PrimeVueResolver(),
        (componentName) => {
          if (componentName.startsWith('BI')) {
            return { name: componentName, from: 'bootstrap-icons-vue' };
          }
        },
      ],
      dts: './src/components.d.ts',
    }),
  ],
});
