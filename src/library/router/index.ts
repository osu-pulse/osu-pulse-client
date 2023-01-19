import type { RouteRecordRaw } from 'vue-router';

export const libraryRoute: RouteRecordRaw = {
  name: RouteName.LIBRARY,
  path: '/library',
  component: () => import('../views/LibraryView.vue'),
};
