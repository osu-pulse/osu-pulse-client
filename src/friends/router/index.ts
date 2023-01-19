import type { RouteRecordRaw } from 'vue-router';

export const friendsRoute: RouteRecordRaw = {
  name: RouteName.FRIENDS,
  path: '/friends',
  component: () => import('../views/FriendsView.vue'),
};
