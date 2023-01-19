import type { RouteRecordRaw } from 'vue-router';

export const settingsRoute: RouteRecordRaw = {
  name: RouteName.SETTINGS,
  path: '/settings',
  component: () => import('../views/SettingsView.vue'),
};
