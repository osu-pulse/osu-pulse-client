import type { RouteRecordRaw } from 'vue-router';

export const homeRoute: RouteRecordRaw = {
  name: RouteName.HOME,
  path: '/home',
  component: () => import('../views/HomeView.vue'),
};
