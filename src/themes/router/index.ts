import type { RouteRecordRaw } from 'vue-router'
import { RouteName } from '@/shared/constants/route-name'

export const themesRoute: RouteRecordRaw = {
  name: RouteName.THEMES,
  path: '/themes',
  component: () => import('../views/ThemesView.vue'),
}
