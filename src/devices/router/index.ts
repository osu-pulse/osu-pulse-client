import type { RouteRecordRaw } from 'vue-router';

export const devicesRoute: RouteRecordRaw = {
  name: RouteName.DEVICES,
  path: '/devices',
  component: () => import('../views/DevicesView.vue'),
};
