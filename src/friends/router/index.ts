import type { RouteRecordRaw } from 'vue-router'
import { RouteName } from '@/shared/constants/route-name'

export const friendsRoute: RouteRecordRaw = {
  name: RouteName.FRIENDS,
  path: '/friends',
  component: () => import('../views/FriendsView.vue'),
}
