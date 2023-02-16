import type { RouteRecordRaw } from 'vue-router'
import { RouteName } from '@/shared/constants/route-name'

export const devicesRoute: RouteRecordRaw = {
  name: RouteName.DEVICES,
  path: '/devices',
  component: () => import('../views/DevicesView.vue'),
}
