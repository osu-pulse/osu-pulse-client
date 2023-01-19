import type { RouteRecordRaw } from 'vue-router';

export const themesRoute: RouteRecordRaw = {
  name: RouteName.THEMES,
  path: '/themes',
  component: () => import('../views/ThemesView.vue'),
};
