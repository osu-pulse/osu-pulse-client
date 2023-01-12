import path from 'path';
import Vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { defineConfig } from 'vitest/config';
import { PrimeVueResolver } from 'unplugin-vue-components/resolvers';

export default defineConfig({
  server: {
    port: 8080,
  },

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
    Vue({
      reactivityTransform: true,
    }),

    AutoImport({
      imports: [
        'vue',
        'vue-router',
        'vue/macros',
        '@vueuse/core',
        'vitest',
        {
          // PrimeVue
          'primevue/config': [['default', 'PrimeVue']],
          'primevue/toastservice': [['default', 'ToastService']],
          'primevue/confirmationservice': [['default', 'ConfirmationService']],
          'primevue/tooltip': [['default', 'Tooltip']],
          'primevue/api': ['PrimeIcons', 'ToastSeverity'],
          'primevue/useconfirm': ['useConfirm'],
          'primevue/usedialog': ['useDialog'],
          'primevue/usetoast': ['useToast'],
          // GraphQL
          '@vue/apollo-composable': [
            'useQuery',
            'useMutation',
            'useSubscription',
          ],
          'graphql-tag': [['default', 'gql']],
          // Moment
          moment: [['default', 'moment']],
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
      resolvers: [PrimeVueResolver()],
      dts: './src/components.d.ts',
    }),
  ],
});
