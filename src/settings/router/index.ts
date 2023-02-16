import type { RouteRecordRaw } from 'vue-router'
import { RouteName } from '@/shared/constants/route-name'

export const settingsRoute: RouteRecordRaw = {
  name: RouteName.SETTINGS,
  path: '/settings',
  component: () => import('../views/SettingsView.vue'),
}
