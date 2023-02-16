import type { RouteRecordRaw } from 'vue-router'
import { RouteName } from '@/shared/constants/route-name'

export const libraryRoute: RouteRecordRaw = {
  name: RouteName.LIBRARY,
  path: '/library',
  component: () => import('../views/LibraryView.vue'),
}
